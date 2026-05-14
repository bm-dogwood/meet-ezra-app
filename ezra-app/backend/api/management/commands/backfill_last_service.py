"""
Backfill last_service on ExponentialCustomer from SALES_ACCURAL raw reports.

Scans raw reports (newest first), extracts the most recent Service-type
Item Name per Guest Code, and writes it to exp_customers.last_service.

Usage:
    python manage.py backfill_last_service          # full backfill
    python manage.py backfill_last_service --dry-run # preview only
"""

from django.core.management.base import BaseCommand
from api.models import ExponentialCustomer, RawReport


class Command(BaseCommand):
    help = 'Backfill last_service field on ExponentialCustomer from sales-accrual raw reports'

    def add_arguments(self, parser):
        parser.add_argument('--dry-run', action='store_true', help='Preview without writing')
        parser.add_argument('--batch', type=int, default=500, help='Batch size for bulk update')

    def handle(self, *args, **options):
        dry_run = options['dry_run']
        batch_size = options['batch']

        self.stdout.write('Building service type map from raw reports...')

        # Build guest_code -> Item Name map (newest report wins)
        service_map = {}
        reports = RawReport.objects.filter(
            report_type__in=['sales-accrual', 'SALES_ACCURAL'],
        ).order_by('-report_date')

        report_count = 0
        for raw in reports:
            report_count += 1
            if not isinstance(raw.raw_data, list):
                continue
            for row in raw.raw_data:
                if not isinstance(row, dict):
                    continue
                gc = row.get('Guest Code')
                if gc and gc not in service_map and row.get('Item Type') == 'Service' and row.get('Item Name'):
                    service_map[gc] = row['Item Name']

        self.stdout.write(f'Scanned {report_count} reports, found services for {len(service_map)} guest codes')

        if dry_run:
            # Show a sample
            for gc, svc in list(service_map.items())[:10]:
                self.stdout.write(f'  {gc}: {svc}')
            self.stdout.write('Dry run — no changes written.')
            return

        # Bulk update customers
        updated = 0
        customers = ExponentialCustomer.objects.filter(
            guest_code__in=list(service_map.keys())
        ).only('id', 'guest_code', 'last_service')

        batch = []
        for c in customers.iterator(chunk_size=batch_size):
            svc = service_map.get(c.guest_code, '')
            if svc and c.last_service != svc:
                c.last_service = svc
                batch.append(c)
                if len(batch) >= batch_size:
                    ExponentialCustomer.objects.bulk_update(batch, ['last_service'])
                    updated += len(batch)
                    self.stdout.write(f'  Updated {updated} customers...')
                    batch = []

        if batch:
            ExponentialCustomer.objects.bulk_update(batch, ['last_service'])
            updated += len(batch)

        self.stdout.write(self.style.SUCCESS(f'Done. Updated {updated} customers with last_service.'))
