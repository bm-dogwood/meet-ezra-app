"""
Management command to reprocess production report data into SchedulingDailyMetrics.

Fixes revenue and ticket counts that were incorrectly set from only the first
employee row instead of the Center Total aggregated row.

Usage: python manage.py reprocess_production_metrics
       python manage.py reprocess_production_metrics --date 2026-02-27
       python manage.py reprocess_production_metrics --days 30
"""
from datetime import datetime, timedelta
from decimal import Decimal

from django.core.management.base import BaseCommand

from api.models import RawReport, SchedulingDailyMetrics, Store


SKIP_VALUES = frozenset(['Grand Total', 'Total', 'Center Total'])


class Command(BaseCommand):
    help = 'Reprocess production reports to fix revenue/ticket counts in SchedulingDailyMetrics'

    def add_arguments(self, parser):
        parser.add_argument('--date', type=str, help='Specific date (YYYY-MM-DD)')
        parser.add_argument('--days', type=int, default=30, help='Number of days to reprocess (default: 30)')
        parser.add_argument('--dry-run', action='store_true', help='Show changes without applying')

    def handle(self, *args, **options):
        if options['date']:
            dates = [datetime.strptime(options['date'], '%Y-%m-%d').date()]
        else:
            end = datetime.now().date()
            start = end - timedelta(days=options['days'])
            dates = None  # process all available

        raw_reports = RawReport.objects.filter(report_type='production').order_by('report_date')
        if dates:
            raw_reports = raw_reports.filter(report_date__in=dates)
        elif options['days']:
            cutoff = datetime.now().date() - timedelta(days=options['days'])
            raw_reports = raw_reports.filter(report_date__gte=cutoff)

        total_updated = 0
        total_reports = 0

        # Build store cache
        store_cache = {}
        for store in Store.objects.filter(status='active'):
            store_cache[store.name] = store
            if store.external_code:
                store_cache[store.external_code] = store

        for raw in raw_reports:
            rows = raw.raw_data
            report_date = raw.report_date
            total_reports += 1

            store_totals = {}
            current_store = None

            for row in rows:
                center_name = (row.get('Center Name') or '').strip()

                if center_name in SKIP_VALUES:
                    continue

                if center_name:
                    resolved = store_cache.get(center_name)
                    if resolved:
                        current_store = resolved

                if not current_store:
                    continue

                employee = (row.get('Employee') or row.get('Employee ') or '').strip()
                if employee == 'Center Total':
                    revenue = Decimal(str(row.get('Total Sale $') or 0))
                    tickets = int(float(row.get('Total Ticket Count') or 0))
                    store_totals[current_store.id] = {
                        'store': current_store,
                        'revenue': revenue,
                        'tickets': tickets,
                    }

            for sid, data in store_totals.items():
                dm = SchedulingDailyMetrics.objects.filter(
                    store=data['store'], date=report_date
                ).first()

                if not dm:
                    continue

                old_rev = float(dm.total_revenue)
                old_tickets = dm.total_guest_tickets
                new_rev = float(data['revenue'])
                new_tickets = data['tickets']

                if abs(old_rev - new_rev) > 0.01 or old_tickets != new_tickets:
                    if options['dry_run']:
                        self.stdout.write(
                            f"  {data['store'].name} ({report_date}): "
                            f"rev {old_rev} -> {new_rev}, "
                            f"tickets {old_tickets} -> {new_tickets}"
                        )
                    else:
                        dm.total_revenue = data['revenue']
                        dm.total_guest_tickets = data['tickets']
                        dm.save(update_fields=['total_revenue', 'total_guest_tickets'])
                    total_updated += 1

            self.stdout.write(f"Processed {report_date}: {len(store_totals)} stores")

        action = "Would update" if options['dry_run'] else "Updated"
        self.stdout.write(self.style.SUCCESS(
            f'{action} {total_updated} records across {total_reports} reports'
        ))
