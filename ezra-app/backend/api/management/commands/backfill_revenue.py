"""
Backfill scheduling revenue data from raw reports (production, sales).

Fixes missing revenue in sched_daily_metrics for dates where raw reports
exist but revenue was never processed (e.g., Mar 23-24, Apr 5).

Usage:
    python manage.py backfill_revenue
    python manage.py backfill_revenue --dry-run
    python manage.py backfill_revenue --tenant-id 21
    python manage.py backfill_revenue --start-date 2026-03-23 --end-date 2026-03-24
    python manage.py backfill_revenue --all-tenants
"""
from datetime import date
from django.core.management.base import BaseCommand
from django.db.models import Sum
from api.models import RawReport, Tenant, Store, SchedulingDailyMetrics
from api.services.ingestion_handlers import handle_report_ingestion
import logging

logger = logging.getLogger(__name__)

REVENUE_REPORT_TYPES = ['production', 'sales']


class Command(BaseCommand):
    help = 'Backfill scheduling revenue from production/sales raw reports for dates with zero revenue'

    def add_arguments(self, parser):
        parser.add_argument('--tenant-id', type=int, default=None, help='Specific tenant ID')
        parser.add_argument('--all-tenants', action='store_true', help='Process all active tenants')
        parser.add_argument('--start-date', type=str, default=None, help='Start date (YYYY-MM-DD)')
        parser.add_argument('--end-date', type=str, default=None, help='End date (YYYY-MM-DD)')
        parser.add_argument('--dry-run', action='store_true', help='Show what would be processed')
        parser.add_argument('--force', action='store_true',
                            help='Re-process even if revenue already exists')

    def handle(self, *args, **options):
        dry_run = options['dry_run']
        force = options['force']
        start_date = options['start_date']
        end_date = options['end_date']

        # Determine tenants to process
        if options['all_tenants']:
            tenants = Tenant.objects.filter(is_active=True)
        elif options['tenant_id']:
            tenants = Tenant.objects.filter(id=options['tenant_id'])
        else:
            # Default: all tenants that have scheduling data
            tenant_ids = SchedulingDailyMetrics.objects.values_list(
                'store__tenant_id', flat=True
            ).distinct()
            tenants = Tenant.objects.filter(id__in=tenant_ids)

        self.stdout.write(f'Tenants to process: {tenants.count()}')
        self.stdout.write(f'Dry run: {dry_run}')

        total_processed = 0
        total_fixed = 0

        for tenant in tenants:
            self.stdout.write(f'\n--- Tenant: {tenant.name} (id={tenant.id}) ---')

            # Find dates with zero revenue in sched_daily_metrics
            dm_qs = SchedulingDailyMetrics.objects.filter(
                store__tenant=tenant,
                total_revenue=0,
            )
            if start_date:
                dm_qs = dm_qs.filter(date__gte=start_date)
            if end_date:
                dm_qs = dm_qs.filter(date__lte=end_date)

            zero_rev_dates = list(
                dm_qs.values_list('date', flat=True).distinct().order_by('date')
            )

            if not zero_rev_dates and not force:
                self.stdout.write(f'  No dates with zero revenue, skipping')
                continue

            # If force mode, get all dates from raw reports
            if force:
                report_qs = RawReport.objects.filter(
                    tenant=tenant,
                    report_type__in=REVENUE_REPORT_TYPES,
                )
                if start_date:
                    report_qs = report_qs.filter(report_date__gte=start_date)
                if end_date:
                    report_qs = report_qs.filter(report_date__lte=end_date)
                dates_to_process = list(
                    report_qs.values_list('report_date', flat=True).distinct().order_by('report_date')
                )
            else:
                # Only process dates that have zero revenue AND have raw reports
                dates_to_process = []
                for d in zero_rev_dates:
                    has_report = RawReport.objects.filter(
                        tenant=tenant,
                        report_type__in=REVENUE_REPORT_TYPES,
                        report_date=d,
                    ).exists()
                    if has_report:
                        dates_to_process.append(d)

            if not dates_to_process:
                self.stdout.write(f'  No dates to backfill')
                continue

            self.stdout.write(f'  Dates to process: {len(dates_to_process)}')
            self.stdout.write(f'  Range: {dates_to_process[0]} to {dates_to_process[-1]}')

            if dry_run:
                for d in dates_to_process:
                    zero_count = SchedulingDailyMetrics.objects.filter(
                        store__tenant=tenant, date=d, total_revenue=0
                    ).count()
                    self.stdout.write(f'    {d}: {zero_count} stores with zero revenue')
                continue

            # Pre-warm store cache
            store_cache = {}
            for store in Store.objects.filter(tenant=tenant):
                store_cache[store.name] = store
                if store.external_code:
                    store_cache[store.external_code] = store

            for d in dates_to_process:
                for report_type in REVENUE_REPORT_TYPES:
                    reports = RawReport.objects.filter(
                        tenant=tenant,
                        report_type=report_type,
                        report_date=d,
                    )
                    for report in reports:
                        try:
                            rows = report.raw_data
                            if not rows or not isinstance(rows, list):
                                continue
                            handle_report_ingestion(report_type, rows, d, tenant, store_cache)
                            total_processed += 1
                        except Exception as e:
                            self.stderr.write(f'  Error: {report_type} {d}: {e}')

                # Check if revenue was fixed
                still_zero = SchedulingDailyMetrics.objects.filter(
                    store__tenant=tenant, date=d, total_revenue=0
                ).count()
                total_stores = SchedulingDailyMetrics.objects.filter(
                    store__tenant=tenant, date=d
                ).count()
                fixed = total_stores - still_zero
                total_fixed += fixed
                self.stdout.write(f'    {d}: {fixed}/{total_stores} stores now have revenue')

        self.stdout.write(self.style.SUCCESS(
            f'\nDone: {total_processed} reports processed, {total_fixed} store-days fixed'
        ))
