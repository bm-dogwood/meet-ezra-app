"""
Management command to execute a single campaign by ID.

Created as a K8s CronJob per campaign for precise scheduling.
  python manage.py run_campaign --campaign-id 9
"""
import logging
from django.core.management.base import BaseCommand

from api.models import AppConfig, ExponentialCampaign
from api.services.campaign_service import CampaignService
from api.constants import DEFAULT_EXPONENTIAL_CONFIG

logger = logging.getLogger(__name__)


class Command(BaseCommand):
    help = 'Execute a single Exponential campaign by ID.'

    def add_arguments(self, parser):
        parser.add_argument(
            '--campaign-id',
            type=int,
            required=True,
            help='ID of the campaign to execute.',
        )

    def _cleanup_cronjob(self, campaign_id):
        """Always clean up the K8s CronJob for this campaign."""
        try:
            from api.services.cronjob_manager import CronJobManager
            manager = CronJobManager()
            manager.remove_campaign_cronjob(campaign_id)
        except Exception:
            logger.exception("Failed to remove campaign CronJob (non-fatal)")

    def handle(self, *args, **options):
        campaign_id = options['campaign_id']

        try:
            campaign = ExponentialCampaign.objects.select_related('tenant').get(id=campaign_id)
        except ExponentialCampaign.DoesNotExist:
            self.stderr.write(f"Campaign {campaign_id} not found.")
            self._cleanup_cronjob(campaign_id)
            return

        if campaign.status != 'scheduled':
            self.stderr.write(
                f"Campaign {campaign_id} status is '{campaign.status}', expected 'scheduled'. Skipping."
            )
            self._cleanup_cronjob(campaign_id)
            return

        config = AppConfig.get_config_value(
            'exponential_config', DEFAULT_EXPONENTIAL_CONFIG
        )
        service = CampaignService(tenant=campaign.tenant, config=config)
        result = service.execute_campaign(campaign_id)

        if 'error' in result:
            self.stderr.write(f"Error: {result['error']}")
        else:
            self.stdout.write(self.style.SUCCESS(
                f"Campaign {campaign_id} executed: "
                f"sent={result['sent']}, failed={result['failed']}, "
                f"skipped_duplicate_phone={result.get('skipped_duplicate_phone', 0)}"
            ))

        # For recurring campaigns: reset to scheduled if still within date range
        campaign.refresh_from_db()
        if campaign.is_recurring and campaign.recurring_end_date:
            from django.utils import timezone as tz
            today = tz.now().date()
            if today <= campaign.recurring_end_date:
                campaign.status = 'scheduled'
                campaign.last_recurring_run = tz.now()
                campaign.save(update_fields=['status', 'last_recurring_run'])
                self.stdout.write(f"Recurring campaign {campaign_id} reset to 'scheduled' (end: {campaign.recurring_end_date})")
                return  # Don't clean up CronJob — it needs to fire again
            else:
                self.stdout.write(f"Recurring campaign {campaign_id} past end date, completing.")

        self._cleanup_cronjob(campaign_id)
