"""
Django management command to execute Ezra Exponential SMS campaigns.

Runs daily (via cron/K8s CronJob) to:
1. Re-segment all customers into 4wk/6wk/8wk buckets
2. Identify eligible customers for each active campaign
3. Send SMS via Twilio
4. Log results and track uptake

Usage:
  python manage.py run_exponential_campaigns
  python manage.py run_exponential_campaigns --tenant-code breeze
  python manage.py run_exponential_campaigns --dry-run
"""
import logging
from datetime import date, timedelta
from decimal import Decimal

from django.core.management.base import BaseCommand
from django.db import transaction
from django.db.models import Max, Count, Q
from django.utils import timezone

from api.models import (
    AppConfig, Tenant, Store,
    ExponentialCustomer, ExponentialVisit, ExponentialSegment,
    ExponentialCampaign, ExponentialSMSLog, ExponentialUptake,
    SMSTemplate,
)
from api.constants import DEFAULT_EXPONENTIAL_CONFIG, DEFAULT_SMS_TEMPLATES

logger = logging.getLogger(__name__)


class Command(BaseCommand):
    help = 'Run Ezra Exponential daily campaign execution: segment customers and send SMS'

    def add_arguments(self, parser):
        parser.add_argument(
            '--tenant-code', type=str, required=False,
            help='Run for a specific tenant only',
        )
        parser.add_argument(
            '--dry-run', action='store_true',
            help='Segment customers but do not send SMS',
        )
        parser.add_argument(
            '--skip-segmentation', action='store_true',
            help='Skip re-segmentation, only send campaigns',
        )

    def handle(self, *args, **options):
        tenant_code = options.get('tenant_code')
        dry_run = options.get('dry_run', False)
        skip_segmentation = options.get('skip_segmentation', False)

        config = AppConfig.get_config_value('exponential_config', DEFAULT_EXPONENTIAL_CONFIG)

        if tenant_code:
            tenants = Tenant.objects.filter(code=tenant_code, is_active=True)
        else:
            tenants = Tenant.objects.filter(is_active=True)

        if not tenants.exists():
            self.stdout.write(self.style.WARNING('No active tenants found'))
            return

        for tenant in tenants:
            self.stdout.write(f'\n=== Processing tenant: {tenant.name} ===')

            if not skip_segmentation:
                self._segment_customers(tenant, config)

            self._track_uptake(tenant, config)

            if not dry_run:
                self._execute_campaigns(tenant, config)
            else:
                self.stdout.write(self.style.WARNING('DRY RUN: Skipping SMS sending'))

        self.stdout.write(self.style.SUCCESS('\nExponential campaign run complete'))

    def _segment_customers(self, tenant, config):
        """Re-segment all customers into 4wk/6wk/8wk buckets."""
        today = date.today()
        bucket_4wk_min_visits = config.get('bucket_4wk_min_visits', 2)
        bucket_6wk_min_days = config.get('bucket_6wk_min_days', 31)
        bucket_6wk_max_days = config.get('bucket_6wk_max_days', 42)
        bucket_8wk_min_days = config.get('bucket_8wk_min_days', 43)

        customers = ExponentialCustomer.objects.filter(
            tenant=tenant, last_visit_date__isnull=False
        )

        # Clear today's segments
        ExponentialSegment.objects.filter(
            customer__tenant=tenant, assigned_at=today
        ).delete()

        segments_created = {'4wk': 0, '6wk': 0, '8wk': 0}
        segments_to_create = []

        for customer in customers.iterator():
            days_since = (today - customer.last_visit_date).days
            visits_30d = ExponentialVisit.objects.filter(
                customer=customer,
                visit_date__gte=today - timedelta(days=30)
            ).count()

            # Bucket precedence: 4wk > 6wk > 8wk
            if visits_30d >= bucket_4wk_min_visits:
                bucket = '4wk'
            elif bucket_6wk_min_days <= days_since <= bucket_6wk_max_days:
                bucket = '6wk'
            elif days_since >= bucket_8wk_min_days:
                bucket = '8wk'
            else:
                continue  # Not in any bucket

            segments_to_create.append(ExponentialSegment(
                customer=customer,
                store=customer.store,
                bucket=bucket,
                days_since_last_visit=days_since,
                visits_last_30_days=visits_30d,
                assigned_at=today,
            ))
            segments_created[bucket] += 1

            if len(segments_to_create) >= 1000:
                ExponentialSegment.objects.bulk_create(segments_to_create)
                segments_to_create = []

        if segments_to_create:
            ExponentialSegment.objects.bulk_create(segments_to_create)

        self.stdout.write(
            f"  Segmented: 4wk={segments_created['4wk']}, "
            f"6wk={segments_created['6wk']}, 8wk={segments_created['8wk']}"
        )

    def _execute_campaigns(self, tenant, config):
        """Execute active campaigns: send SMS to eligible customers."""
        from api.services.twilio_sms_service import send_campaign_sms

        today = date.today()
        cooldown_days = config.get('cooldown_days', 14)
        max_sms_per_day = config.get('max_sms_per_day', 500)
        templates = AppConfig.get_config_value('exponential_sms_templates', DEFAULT_SMS_TEMPLATES)

        active_campaigns = ExponentialCampaign.objects.filter(
            tenant=tenant, status='active'
        )

        total_sent = 0
        total_delivered = 0
        total_failed = 0

        for campaign in active_campaigns:
            if total_sent >= max_sms_per_day:
                self.stdout.write(self.style.WARNING(
                    f"  Daily SMS limit ({max_sms_per_day}) reached"
                ))
                break

            # Find template for this bucket — prefer SMSTemplate model, fallback to AppConfig JSON
            db_template = SMSTemplate.objects.filter(
                tenant=tenant, bucket=campaign.target_bucket, is_active=True
            ).first()
            if db_template:
                template_body = db_template.body
            else:
                json_template = next(
                    (t for t in templates if t['bucket'] == campaign.target_bucket and t.get('is_active', True)),
                    None
                )
                if not json_template:
                    self.stdout.write(self.style.WARNING(
                        f"  No active template for bucket {campaign.target_bucket}"
                    ))
                    continue
                template_body = json_template['body']

            coupon_value = float(campaign.coupon_value or config.get(f'coupon_{campaign.target_bucket}', 10))

            # Get eligible customers: in segment, SMS opt-in, not contacted within cooldown
            cooldown_cutoff = today - timedelta(days=cooldown_days)
            recently_contacted = ExponentialSMSLog.objects.filter(
                customer__tenant=tenant,
                sent_at__date__gte=cooldown_cutoff,
            ).values_list('customer_id', flat=True)

            # Build store filter for campaign scope
            store_filter = Q(customer__tenant=tenant)
            if campaign.scope == 'single' and campaign.store:
                store_filter &= Q(store=campaign.store)

            eligible_segments = ExponentialSegment.objects.filter(
                store_filter,
                bucket=campaign.target_bucket,
                assigned_at=today,
                customer__sms_opt_in=True,
                customer__phone__isnull=False,
            ).exclude(
                customer_id__in=recently_contacted
            ).select_related('customer', 'store')

            campaign_sent = 0
            campaign_delivered = 0
            campaign_failed = 0

            for segment in eligible_segments.iterator():
                if total_sent >= max_sms_per_day:
                    break

                customer = segment.customer
                store_name = segment.store.name if segment.store else 'our salon'

                result = send_campaign_sms(
                    customer=customer,
                    campaign=campaign,
                    template_body=template_body,
                    coupon_value=coupon_value,
                    store_name=store_name,
                )

                # Log the SMS
                sms_log = ExponentialSMSLog.objects.create(
                    campaign=campaign,
                    customer=customer,
                    segment_at_send=campaign.target_bucket,
                    coupon_value=Decimal(str(coupon_value)),
                    message_body=result.get('message_body', ''),
                    status='delivered' if result['success'] else 'failed',
                    twilio_message_sid=result.get('message_sid', ''),
                    error_message=result.get('error', ''),
                )

                if result['success']:
                    campaign_delivered += 1
                else:
                    campaign_failed += 1

                total_sent += 1
                campaign_sent += 1

            # Update campaign counters
            campaign.messages_sent += campaign_sent
            campaign.messages_delivered += campaign_delivered
            campaign.messages_failed += campaign_failed
            campaign.save(update_fields=['messages_sent', 'messages_delivered', 'messages_failed'])

            self.stdout.write(
                f"  Campaign '{campaign.name}': sent={campaign_sent}, "
                f"delivered={campaign_delivered}, failed={campaign_failed}"
            )

        self.stdout.write(
            f"  Total: sent={total_sent}, delivered={total_delivered}, failed={total_failed}"
        )

    def _track_uptake(self, tenant, config):
        """Check if customers who received SMS have returned."""
        uptake_window = config.get('uptake_window_days', 14)
        cutoff_date = date.today() - timedelta(days=uptake_window)

        # Find SMS logs without uptake records, sent within the window
        untracked_logs = ExponentialSMSLog.objects.filter(
            campaign__tenant=tenant,
            status='delivered',
            sent_at__date__gte=cutoff_date,
        ).exclude(
            uptake__isnull=False
        ).select_related('customer')

        uptakes_created = 0

        for sms_log in untracked_logs.iterator():
            # Check if customer visited after SMS was sent
            return_visit = ExponentialVisit.objects.filter(
                customer=sms_log.customer,
                visit_date__gt=sms_log.sent_at.date(),
                visit_date__lte=sms_log.sent_at.date() + timedelta(days=uptake_window),
            ).order_by('visit_date').first()

            if return_visit:
                days_to_return = (return_visit.visit_date - sms_log.sent_at.date()).days
                ExponentialUptake.objects.get_or_create(
                    sms_log=sms_log,
                    defaults={
                        'customer': sms_log.customer,
                        'return_visit_date': return_visit.visit_date,
                        'days_to_return': days_to_return,
                    }
                )
                uptakes_created += 1

        if uptakes_created:
            self.stdout.write(f"  Uptake tracked: {uptakes_created} return visits attributed")
