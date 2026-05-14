"""
Backfill LP risk scores for dates that have ReportMetric data but no LPRiskScore.

Usage:
    python manage.py backfill_lp_scores
    python manage.py backfill_lp_scores --start-date 2026-04-01 --end-date 2026-04-18
    python manage.py backfill_lp_scores --dry-run
"""
from datetime import date, timedelta
from django.core.management.base import BaseCommand
from django.db.models import Count
from api.models import Store, Tenant, ReportMetric, LPRiskScore
from api.services.lp_service import LPService
import logging

logger = logging.getLogger(__name__)


class Command(BaseCommand):
    help = 'Backfill LP risk scores for dates with sales data but no LP scores'

    def add_arguments(self, parser):
        parser.add_argument('--start-date', type=str, default=None, help='Start date (YYYY-MM-DD)')
        parser.add_argument('--end-date', type=str, default=None, help='End date (YYYY-MM-DD)')
        parser.add_argument('--dry-run', action='store_true', help='Show what would be processed')

    def handle(self, *args, **options):
        dry_run = options['dry_run']
        start_date = options['start_date']
        end_date = options['end_date']

        if not start_date:
            start_date = '2026-03-25'
        if not end_date:
            end_date = date.today().isoformat()

        self.stdout.write(f'Date range: {start_date} to {end_date}')
        self.stdout.write(f'Dry run: {dry_run}')

        # Find dates that have ReportMetric (sales) data but no LP scores
        dates_with_metrics = set(
            ReportMetric.objects.filter(
                report_type='sales',
                report_date__gte=start_date,
                report_date__lte=end_date,
            ).values_list('report_date', flat=True).distinct()
        )

        dates_with_lp = set(
            LPRiskScore.objects.filter(
                report_date__gte=start_date,
                report_date__lte=end_date,
            ).values_list('report_date', flat=True).distinct()
        )

        missing_dates = sorted(dates_with_metrics - dates_with_lp)

        self.stdout.write(f'Dates with sales metrics: {len(dates_with_metrics)}')
        self.stdout.write(f'Dates with LP scores: {len(dates_with_lp)}')
        self.stdout.write(f'Missing dates to backfill: {len(missing_dates)}')

        if not missing_dates:
            self.stdout.write(self.style.SUCCESS('No missing dates to backfill!'))
            return

        if dry_run:
            for d in missing_dates:
                self.stdout.write(f'  Would process: {d}')
            return

        stores = Store.objects.filter(status='active')
        total_scores = 0

        for d in missing_dates:
            scores_for_date = 0
            for store in stores:
                # Check if this store has sales metrics for this date
                has_metrics = ReportMetric.objects.filter(
                    store=store, report_type='sales', report_date=d
                ).exists()
                if not has_metrics:
                    continue

                try:
                    lp_service = LPService(tenant=store.tenant)
                    risk_score = lp_service.calculate_risk_score_for_store(store, d)
                    lp_service.generate_alerts_for_store(store, risk_score)
                    scores_for_date += 1
                except Exception as e:
                    self.stderr.write(f'  Error: store {store.id} date {d}: {e}')

            total_scores += scores_for_date
            self.stdout.write(f'  {d}: {scores_for_date} scores calculated')

        self.stdout.write(self.style.SUCCESS(f'\nDone: {total_scores} LP scores calculated across {len(missing_dates)} dates'))
