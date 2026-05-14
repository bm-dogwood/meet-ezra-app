"""
Backfill scheduling data from raw reports (attendance, performance-by-hour, statutory-pay).

These handlers failed silently from Mar 6-24 due to a _resolve_store function
signature collision. Raw reports were saved but never processed into
sched_daily_metrics / sched_time_buckets.

Usage:
    python manage.py backfill_scheduling
    python manage.py backfill_scheduling --dry-run
    python manage.py backfill_scheduling --tenant-id 18
    python manage.py backfill_scheduling --report-types attendance,statutory-pay
"""
from django.core.management.base import BaseCommand
from api.models import RawReport, Tenant, Store
from api.services.ingestion_handlers import handle_report_ingestion
import logging

logger = logging.getLogger(__name__)

REPORT_TYPES = ['attendance', 'performance-by-hour', 'statutory-pay', 'production', 'sales']


class Command(BaseCommand):
    help = 'Backfill scheduling data from unprocessed raw reports'

    def add_arguments(self, parser):
        parser.add_argument('--tenant-id', type=int, default=18, help='Tenant ID (default: 18)')
        parser.add_argument('--dry-run', action='store_true', help='Show what would be processed without executing')
        parser.add_argument('--report-types', type=str, default=None,
                            help='Comma-separated report types to process (default: all scheduling types)')

    def handle(self, *args, **options):
        tenant_id = options['tenant_id']
        dry_run = options['dry_run']
        report_types = options['report_types'].split(',') if options['report_types'] else REPORT_TYPES

        try:
            tenant = Tenant.objects.get(id=tenant_id)
        except Tenant.DoesNotExist:
            self.stderr.write(f'Tenant {tenant_id} not found')
            return

        self.stdout.write(f'Tenant: {tenant.name} (id={tenant.id})')
        self.stdout.write(f'Report types: {report_types}')
        self.stdout.write(f'Dry run: {dry_run}')

        # Pre-warm store cache
        store_cache = {}
        for store in Store.objects.filter(tenant=tenant):
            store_cache[store.name] = store
            if store.external_code:
                store_cache[store.external_code] = store
        self.stdout.write(f'Store cache: {len(store_cache)} entries')

        total = 0
        errors = []

        for report_type in report_types:
            reports = RawReport.objects.filter(
                tenant=tenant,
                report_type=report_type,
            ).order_by('report_date')

            count = reports.count()
            if count == 0:
                self.stdout.write(f'[{report_type}] No reports, skipping')
                continue

            self.stdout.write(f'[{report_type}] {count} reports to process')

            if dry_run:
                for r in reports:
                    rows = r.raw_data if isinstance(r.raw_data, list) else []
                    self.stdout.write(f'  Would process: {r.report_date} ({len(rows)} rows)')
                continue

            for i, report in enumerate(reports, 1):
                try:
                    rows = report.raw_data
                    if not rows or not isinstance(rows, list):
                        self.stdout.write(f'  [{report_type}] {report.report_date}: empty, skipping')
                        continue

                    result = handle_report_ingestion(report_type, rows, report.report_date, tenant, store_cache)
                    total += 1

                    if i % 10 == 0 or i == count:
                        self.stdout.write(f'  [{report_type}] {i}/{count} ({report.report_date}, result={result})')

                except Exception as e:
                    msg = f'[{report_type}] {report.id} ({report.report_date}): {e}'
                    self.stderr.write(msg)
                    errors.append(msg)

        self.stdout.write(self.style.SUCCESS(f'\nDone: {total} reports processed'))
        if errors:
            self.stderr.write(f'{len(errors)} errors:')
            for err in errors:
                self.stderr.write(f'  {err}')
