"""
Management command to execute scheduled and recurring campaigns.

Run via cron or K8s CronJob every 5-15 minutes:
  python manage.py run_scheduled_campaigns

Or for a specific tenant:
  python manage.py run_scheduled_campaigns --tenant-code mcd
"""
import logging
from django.core.management.base import BaseCommand
from django.utils import timezone

from api.models import Tenant, AppConfig
from api.services.campaign_service import CampaignService
from api.constants import DEFAULT_EXPONENTIAL_CONFIG

logger = logging.getLogger(__name__)


class Command(BaseCommand):
    help = 'Execute scheduled and recurring Exponential campaigns that are due.'

    def add_arguments(self, parser):
        parser.add_argument(
            '--tenant-code',
            type=str,
            default=None,
            help='Only process campaigns for this tenant code.',
        )
        parser.add_argument(
            '--dry-run',
            action='store_true',
            help='Show what would be executed without actually sending.',
        )

    def handle(self, *args, **options):
        tenant_code = options.get('tenant_code')
        dry_run = options.get('dry_run', False)

        config = AppConfig.get_config_value(
            'exponential_config', DEFAULT_EXPONENTIAL_CONFIG
        )

        if tenant_code:
            tenants = Tenant.objects.filter(code=tenant_code, is_active=True)
        else:
            tenants = Tenant.objects.filter(is_active=True)

        total_executed = 0

        for tenant in tenants:
            service = CampaignService(tenant=tenant, config=config)

            # Find due campaigns
            from api.models import ExponentialCampaign
            due_count = ExponentialCampaign.objects.filter(
                tenant=tenant,
                status='scheduled',
                scheduled_at__lte=timezone.now(),
            ).count()

            if due_count == 0 and not dry_run:
                continue

            self.stdout.write(
                f"Tenant {tenant.code}: {due_count} scheduled campaign(s) due"
            )

            if dry_run:
                due = ExponentialCampaign.objects.filter(
                    tenant=tenant,
                    status='scheduled',
                    scheduled_at__lte=timezone.now(),
                )
                for c in due:
                    self.stdout.write(
                        f"  [DRY RUN] Would execute: {c.name} "
                        f"(id={c.id}, bucket={c.target_bucket}, "
                        f"scheduled_at={c.scheduled_at})"
                    )
                continue

            results = service.execute_due_campaigns()
            for r in results:
                if 'error' in r:
                    self.stderr.write(f"  Error: {r['error']}")
                else:
                    self.stdout.write(
                        f"  Executed campaign {r['campaign_id']}: "
                        f"sent={r['sent']}, failed={r['failed']}"
                    )
                    total_executed += 1

        self.stdout.write(
            self.style.SUCCESS(
                f"Done. {total_executed} campaign(s) executed."
            )
        )
