"""
Management command to recalculate scheduling daily metrics from time bucket data.
Run after fixing the idle hours calculation bug.
Usage: python manage.py recalculate_scheduling_metrics
"""
from django.core.management.base import BaseCommand
from api.models import SchedulingDailyMetrics, SchedulingTimeBucket, AppConfig, Store
from api.constants import DEFAULT_SCHEDULING_CONFIG
from decimal import Decimal


class Command(BaseCommand):
    help = 'Recalculate scheduling daily metrics (idle hours, SRPH, quality score) from time buckets'

    def handle(self, *args, **options):
        config = AppConfig.get_config_value('scheduling_config', DEFAULT_SCHEDULING_CONFIG)
        idle_threshold = Decimal(str(config.get('idle_revenue_threshold', 0)))

        # Time bucket hour ranges for clock-in window overlap check
        BUCKET_HOUR_RANGES = {
            '9AM-12PM': (9, 12),
            '12PM-2PM': (12, 14),
            '2PM-5PM': (14, 17),
            '5PM-9PM': (17, 21),
        }

        metrics = SchedulingDailyMetrics.objects.select_related('store').all()
        updated = 0

        for dm in metrics:
            buckets = list(SchedulingTimeBucket.objects.filter(store=dm.store, date=dm.date))
            if not buckets:
                continue

            tb_revenue = sum(b.revenue for b in buckets)
            tb_labor = sum(b.labor_hours for b in buckets)
            tb_tickets = sum(b.guest_tickets for b in buckets)

            has_perf_data = tb_tickets > 0

            # Get clock-in window
            checkin_start = dm.earliest_checkin_hour
            checkout_end = dm.latest_checkout_hour

            def bucket_in_window(bucket_label):
                if checkin_start is None or checkout_end is None:
                    return True
                b_start, b_end = BUCKET_HOUR_RANGES.get(bucket_label, (0, 24))
                return b_start < checkout_end + 1 and b_end > checkin_start

            if has_perf_data:
                idle_hours = Decimal('0')
                labor_in_window = Decimal('0')
                total_clock_in_w = 0
                idle_clock_in_w = 0
                for b in buckets:
                    if not bucket_in_window(b.time_bucket):
                        continue
                    if b.total_hour_count > 0 and b.labor_hours > 0:
                        detail = b.idle_hours_detail or {}
                        if detail and checkin_start is not None and checkout_end is not None:
                            idle_in_w = sum(1 for h, idle in detail.items() if idle and checkin_start <= int(h) <= checkout_end)
                            total_in_w = sum(1 for h in detail if checkin_start <= int(h) <= checkout_end)
                            total_clock_in_w += total_in_w
                            idle_clock_in_w += idle_in_w
                            idle_fraction = Decimal(str(idle_in_w)) / Decimal(str(total_in_w)) if total_in_w > 0 else Decimal('0')
                        else:
                            idle_fraction = Decimal(str(b.idle_hour_count)) / Decimal(str(b.total_hour_count))
                            total_clock_in_w += b.total_hour_count
                            idle_clock_in_w += b.idle_hour_count
                        idle_hours += b.labor_hours * idle_fraction
                        labor_in_window += b.labor_hours
                    elif b.labor_hours > 0:
                        labor_in_window += b.labor_hours
                        if b.is_idle or (b.guest_tickets == 0):
                            idle_hours += b.labor_hours
            else:
                idle_hours = Decimal('0')
                labor_in_window = Decimal('0')
                total_clock_in_w = 0
                idle_clock_in_w = 0

            # Use the best available labor hours
            effective_labor = dm.total_payroll_hours if dm.total_payroll_hours > 0 else tb_labor
            effective_window_labor = labor_in_window if labor_in_window > 0 else effective_labor

            # Only overwrite revenue/tickets from time buckets if they have
            # non-zero data; otherwise keep values from production/sales.
            if tb_revenue > 0:
                dm.total_revenue = tb_revenue
            if tb_tickets > 0:
                dm.total_guest_tickets = tb_tickets

            actual_rev = dm.total_revenue if dm.total_revenue > 0 else tb_revenue
            actual_tickets = dm.total_guest_tickets if dm.total_guest_tickets > 0 else tb_tickets

            srph = actual_rev / effective_labor if effective_labor > 0 else Decimal('0')
            tplh = Decimal(str(actual_tickets)) / effective_labor if effective_labor > 0 else Decimal('0')
            # Idle % uses clock hour counts per Emory's formula
            if total_clock_in_w > 0:
                pct_idle = Decimal(str(idle_clock_in_w)) / Decimal(str(total_clock_in_w)) * 100
            else:
                pct_idle = (idle_hours / effective_window_labor * 100) if effective_window_labor > 0 else Decimal('0')

            idle_w = Decimal(str(config.get('idle_score_weight', 0.5)))
            ot_w = Decimal(str(config.get('overtime_score_weight', 0.3)))
            srph_w = Decimal(str(config.get('srph_score_weight', 0.2)))

            idle_score = max(Decimal('0'), Decimal('100') - pct_idle * 3)
            srph_score = min(srph, Decimal('100'))
            ot_score = Decimal('100') if not dm.has_overtime else max(
                Decimal('0'), Decimal('100') - dm.overtime_hours * 5
            )
            quality_score = idle_score * idle_w + ot_score * ot_w + srph_score * srph_w

            dm.idle_hours = idle_hours
            dm.srph = srph
            dm.tplh = tplh
            dm.pct_idle = pct_idle
            dm.scheduling_quality_score = quality_score
            dm.save()
            updated += 1

        self.stdout.write(self.style.SUCCESS(f'Recalculated {updated} daily metrics records'))
