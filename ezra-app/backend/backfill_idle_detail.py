"""
Backfill idle_hours_detail on SchedulingTimeBucket from raw performance-by-hour reports.
Run via: python backfill_idle_detail.py

This reads the raw_data from api_rawreport for performance-by-hour reports,
extracts per-hour Guest Serviced/Floor Hour values, and populates the
idle_hours_detail JSON field on each time bucket.
"""
import os
import sys
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
django.setup()

from decimal import Decimal
from api.models import RawReport, SchedulingTimeBucket, SchedulingDailyMetrics, Store

HOUR_MAP = {
    '12AM': 0, '1AM': 1, '2AM': 2, '3AM': 3, '4AM': 4, '5AM': 5,
    '6AM': 6, '7AM': 7, '8AM': 8, '9AM': 9, '10AM': 10, '11AM': 11,
    '12PM': 12, '1PM': 13, '2PM': 14, '3PM': 15, '4PM': 16, '5PM': 17,
    '6PM': 18, '7PM': 19, '8PM': 20, '9PM': 21, '10PM': 22, '11PM': 23,
}

BUCKET_RANGES = {
    '9AM-12PM': (9, 12),
    '12PM-2PM': (12, 14),
    '2PM-5PM': (14, 17),
    '5PM-9PM': (17, 21),
}

def get_time_bucket(hour):
    for label, (start, end) in BUCKET_RANGES.items():
        if start <= hour < end:
            return label
    return None

# Build store lookup
store_cache = {}
for s in Store.objects.all():
    store_cache[s.name] = s
    if s.external_code:
        store_cache[s.external_code] = s

reports = RawReport.objects.filter(report_type='performance-by-hour').order_by('report_date')
print(f"Found {reports.count()} performance-by-hour reports")

for report in reports:
    report_date = report.report_date
    rows = report.raw_data
    if not isinstance(rows, list):
        continue

    # Collect per-store, per-bucket idle detail
    # key: (store_id, bucket_label) -> {hour_24_str: is_idle}
    bucket_details = {}

    for row in rows:
        center_name = (row.get('Center Name') or '').strip()
        if not center_name or center_name in ('Grand Total', 'Total', 'Center Total'):
            continue
        metric = (row.get('Metric') or '').strip()
        if 'guest serviced' not in metric.lower() and 'floor hour' not in metric.lower():
            continue

        store = store_cache.get(center_name)
        if not store:
            continue

        for col_name, hour_24 in HOUR_MAP.items():
            val = row.get(col_name)
            if val is None:
                continue
            try:
                val = float(val)
            except (ValueError, TypeError):
                continue

            bucket_label = get_time_bucket(hour_24)
            if not bucket_label:
                continue

            key = (store.id, bucket_label)
            if key not in bucket_details:
                bucket_details[key] = {}
            bucket_details[key][str(hour_24)] = (val == 0)

    # Update time buckets
    updated = 0
    for (store_id, bucket_label), detail in bucket_details.items():
        tbs = SchedulingTimeBucket.objects.filter(
            store_id=store_id, date=report_date, time_bucket=bucket_label
        )
        for tb in tbs:
            tb.idle_hours_detail = detail
            tb.save(update_fields=['idle_hours_detail'])
            updated += 1

    print(f"  {report_date}: updated {updated} time buckets")

print("Done backfilling idle_hours_detail")
