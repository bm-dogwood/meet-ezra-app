"""
Management command to fix stale total_visits, last_visit_date, and
previous_visit_date on ExponentialCustomer records.

Needed when reports were ingested out of chronological order.

Usage:
  python manage.py fix_exponential_stats
  python manage.py fix_exponential_stats --dry-run
"""
from django.core.management.base import BaseCommand
from api.models import ExponentialCustomer, ExponentialVisit


class Command(BaseCommand):
    help = 'Recompute total_visits, last_visit_date, previous_visit_date for all exp_customers'

    def add_arguments(self, parser):
        parser.add_argument('--dry-run', action='store_true', help='Show what would change without saving')

    def handle(self, *args, **options):
        dry_run = options['dry_run']
        fixed = 0
        total = ExponentialCustomer.objects.count()

        self.stdout.write(f"Scanning {total} customers...")

        for customer in ExponentialCustomer.objects.iterator(chunk_size=500):
            visit_dates = list(
                ExponentialVisit.objects.filter(customer=customer)
                .values_list('visit_date', flat=True)
                .order_by('-visit_date')
            )
            new_total = len(visit_dates)
            new_last = visit_dates[0] if visit_dates else None
            new_prev = visit_dates[1] if len(visit_dates) > 1 else None

            changed = (
                customer.total_visits != new_total
                or customer.last_visit_date != new_last
                or customer.previous_visit_date != new_prev
            )

            if changed:
                fixed += 1
                if dry_run:
                    self.stdout.write(
                        f"  [DRY] {customer.guest_code}: "
                        f"visits {customer.total_visits}->{new_total}, "
                        f"last {customer.last_visit_date}->{new_last}, "
                        f"prev {customer.previous_visit_date}->{new_prev}"
                    )
                else:
                    customer.total_visits = new_total
                    customer.last_visit_date = new_last
                    customer.previous_visit_date = new_prev
                    customer.save(update_fields=['total_visits', 'last_visit_date', 'previous_visit_date'])

        prefix = "[DRY RUN] " if dry_run else ""
        self.stdout.write(self.style.SUCCESS(f"{prefix}Fixed {fixed}/{total} customers"))
