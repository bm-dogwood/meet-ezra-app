"""
Management command to backfill idle_hour_count, total_hour_count on SchedulingTimeBucket
and earliest_checkin_hour, latest_checkout_hour on SchedulingDailyMetrics from raw reports.

Run this after the 0029 migration to populate the new fields from existing data.
Usage: python manage.py backfill_idle_hour_counts
"""
import re
from decimal import Decimal, InvalidOperation
from django.core.management.base import BaseCommand
from api.models import (
    SchedulingTimeBucket, SchedulingDailyMetrics, AppConfig,
)
from api.constants import DEFAULT_SCHEDULING_CONFIG


HOUR_COLUMNS = [
    '12AM', '1AM', '2AM', '3AM', '4AM', '5AM', '6AM', '7AM',
    '8AM', '9AM', '10AM', '11AM', '12PM', '1PM', '2PM', '3PM',
    '4PM', '5PM', '6PM', '7PM', '8PM', '9PM', '10PM', '11PM',
]
HOUR_MAP = {
    '12AM': 0, '1AM': 1, '2AM': 2, '3AM': 3, '4AM': 4, '5AM': 5,
    '6AM': 6, '7AM': 7, '8AM': 8, '9AM': 9, '10AM': 10, '11AM': 11,
    '12PM': 12, '1PM': 13, '2PM': 14, '3PM': 15, '4PM': 16, '5PM': 17,
    '6PM': 18, '7PM': 19, '8PM': 20, '9PM': 21, '10PM': 22, '11PM': 23,
}

BUCKET_HOUR_RANGES = {
    '9AM-12PM': (9, 12),
    '12PM-2PM': (12, 14),
    '2PM-5PM': (14, 17),
    '5PM-9PM': (17, 21),
}


def _get_time_bucket(hour):
    config = AppConfig.get_config_value('scheduling_config', DEFAULT_SCHEDULING_CONFIG)
    buckets = config.get('time_buckets', DEFAULT_SCHEDULING_CONFIG['time_buckets'])
    for bucket in buckets:
        start_h = int(bucket['start'].split(':')[0])
        end_h = int(bucket['end'].split(':')[0])
        if start_h <= hour < end_h:
            return bucket['label']
    return None


def _parse_decimal(value):
    if value is None:
        return None
    try:
        if isinstance(value, str):
            value = value.replace('$', '').replace(',', '').replace('%', '').strip()
            if not value:
                return None
        return Decimal(str(value))
    except (ValueError, TypeError, InvalidOperation):
        return None


def _parse_checkin_window(actual_checkins_str):
    if not actual_checkins_str or not isinstance(actual_checkins_str, str):
        return None, None
    times = re.findall(r'(\d{1,2}):(\d{2})\s*(AM|PM)', actual_checkins_str.strip())
    if not times:
        return None, None

    def to_hour_24(h_str, m_str, ampm):
        h = int(h_str)
        if ampm == 'PM' and h != 12:
            h += 12
        elif ampm == 'AM' and h == 12:
            h = 0
        return h

    earliest = to_hour_24(*times[0])
    latest = to_hour_24(*times[-1])
    return earliest, latest


class Command(BaseCommand):
    help = 'Backfill idle_hour_count/total_hour_count and checkin window from raw reports'

    def handle(self, *args, **options):
        from api.models import RawReport, Store

        # Step 1: Backfill idle_hour_count and total_hour_count from performance-by-hour reports
        perf_reports = RawReport.objects.filter(report_type='performance-by-hour').order_by('report_date')
        self.stdout.write(f"Processing {perf_reports.count()} performance-by-hour reports...")

        store_cache = {}
        for rr in perf_reports:
            rows = rr.raw_data or []
            report_date = rr.report_date

            # Build per-store, per-bucket hour counts from raw data
            # Key: (store_id, bucket_label) -> {idle: int, total: int}
            bucket_counts = {}

            for row in rows:
                center_name = (row.get('Center Name') or '').strip()
                if not center_name or center_name in ('Grand Total', 'Total', 'Center Total'):
                    continue
                metric_type = (row.get('Metric') or '').strip()
                if not metric_type:
                    continue
                is_guest_metric = 'guest serviced' in metric_type.lower() or 'floor hour' in metric_type.lower()
                if not is_guest_metric:
                    continue

                # Resolve store
                if center_name not in store_cache:
                    store = Store.objects.filter(external_code=center_name).first()
                    if not store:
                        store = Store.objects.filter(name=center_name).first()
                    store_cache[center_name] = store
                store = store_cache[center_name]
                if not store:
                    continue

                for col_name in HOUR_COLUMNS:
                    val = _parse_decimal(row.get(col_name))
                    if val is None:
                        continue
                    hour_24 = HOUR_MAP[col_name]
                    bucket_label = _get_time_bucket(hour_24)
                    if not bucket_label:
                        continue

                    key = (store.id, bucket_label)
                    if key not in bucket_counts:
                        bucket_counts[key] = {'idle': 0, 'total': 0}
                    bucket_counts[key]['total'] += 1
                    if val == 0:
                        bucket_counts[key]['idle'] += 1

            # Update time buckets
            for (store_id, bucket_label), counts in bucket_counts.items():
                SchedulingTimeBucket.objects.filter(
                    store_id=store_id,
                    date=report_date,
                    time_bucket=bucket_label,
                ).update(
                    idle_hour_count=counts['idle'],
                    total_hour_count=counts['total'],
                )

        self.stdout.write(self.style.SUCCESS("Backfilled idle_hour_count/total_hour_count"))

        # Step 2: Backfill earliest_checkin_hour and latest_checkout_hour from attendance reports
        att_reports = RawReport.objects.filter(report_type='attendance').order_by('report_date')
        self.stdout.write(f"Processing {att_reports.count()} attendance reports...")

        for rr in att_reports:
            rows = rr.raw_data or []
            report_date = rr.report_date
            store_windows = {}  # store_id -> {earliest, latest}

            for row in rows:
                work_center = (row.get('Work Center') or '').strip()
                if not work_center or work_center in ('Grand Total', 'Total', 'Center Total'):
                    continue
                if work_center not in store_cache:
                    store = Store.objects.filter(external_code=work_center).first()
                    if not store:
                        store = Store.objects.filter(name=work_center).first()
                    store_cache[work_center] = store
                store = store_cache[work_center]
                if not store:
                    continue

                earliest_h, latest_h = _parse_checkin_window(row.get('Actual Check-Ins'))
                if earliest_h is not None and latest_h is not None:
                    sid = store.id
                    if sid not in store_windows:
                        store_windows[sid] = {'earliest': earliest_h, 'latest': latest_h}
                    else:
                        store_windows[sid]['earliest'] = min(store_windows[sid]['earliest'], earliest_h)
                        store_windows[sid]['latest'] = max(store_windows[sid]['latest'], latest_h)

            for sid, window in store_windows.items():
                SchedulingDailyMetrics.objects.filter(
                    store_id=sid, date=report_date,
                ).update(
                    earliest_checkin_hour=window['earliest'],
                    latest_checkout_hour=window['latest'],
                )

        self.stdout.write(self.style.SUCCESS("Backfilled checkin windows"))

        # Step 3: Recalculate idle hours using the new data
        self.stdout.write("Recalculating idle hours...")
        config = AppConfig.get_config_value('scheduling_config', DEFAULT_SCHEDULING_CONFIG)

        metrics = SchedulingDailyMetrics.objects.select_related('store').all()
        updated = 0

        for dm in metrics:
            buckets = list(SchedulingTimeBucket.objects.filter(store=dm.store, date=dm.date))
            if not buckets:
                continue

            tb_tickets = sum(b.guest_tickets for b in buckets)
            tb_labor = sum(b.labor_hours for b in buckets)
            has_perf_data = tb_tickets > 0

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
                for b in buckets:
                    if not bucket_in_window(b.time_bucket):
                        continue
                    if b.total_hour_count > 0 and b.labor_hours > 0:
                        idle_fraction = Decimal(str(b.idle_hour_count)) / Decimal(str(b.total_hour_count))
                        idle_hours += b.labor_hours * idle_fraction
                        labor_in_window += b.labor_hours
                    elif b.labor_hours > 0:
                        labor_in_window += b.labor_hours
                        if b.is_idle or b.guest_tickets == 0:
                            idle_hours += b.labor_hours
            else:
                idle_hours = Decimal('0')
                labor_in_window = Decimal('0')

            effective_labor = dm.total_payroll_hours if dm.total_payroll_hours > 0 else tb_labor
            effective_window_labor = labor_in_window if labor_in_window > 0 else effective_labor
            pct_idle = (idle_hours / effective_window_labor * 100) if effective_window_labor > 0 else Decimal('0')

            dm.idle_hours = idle_hours
            dm.pct_idle = pct_idle
            dm.save(update_fields=['idle_hours', 'pct_idle'])
            updated += 1

        self.stdout.write(self.style.SUCCESS(f'Recalculated {updated} daily metrics records'))
