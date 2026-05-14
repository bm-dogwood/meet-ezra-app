#!/usr/bin/env python3
"""Direct backfill script using psycopg2 - no Django overhead."""
import json
import re
from decimal import Decimal, InvalidOperation
import psycopg2

DB_PARAMS = {
    'host': '127.0.0.1',
    'port': 5433,
    'dbname': 'dev-mt',
    'user': 'app',
    'password': r'\,nR{e.X6EjL]c-B',
}

HOUR_MAP = {
    '12AM': 0, '1AM': 1, '2AM': 2, '3AM': 3, '4AM': 4, '5AM': 5,
    '6AM': 6, '7AM': 7, '8AM': 8, '9AM': 9, '10AM': 10, '11AM': 11,
    '12PM': 12, '1PM': 13, '2PM': 14, '3PM': 15, '4PM': 16, '5PM': 17,
    '6PM': 18, '7PM': 19, '8PM': 20, '9PM': 21, '10PM': 22, '11PM': 23,
}
HOUR_COLUMNS = list(HOUR_MAP.keys())

BUCKET_RANGES = {
    '9AM-12PM': (9, 12), '12PM-2PM': (12, 14),
    '2PM-5PM': (14, 17), '5PM-9PM': (17, 21),
}

def get_time_bucket(hour):
    for label, (s, e) in BUCKET_RANGES.items():
        if s <= hour < e:
            return label
    return None

def parse_decimal(v):
    if v is None: return None
    try:
        return Decimal(str(v).replace('$','').replace(',','').replace('%','').strip())
    except: return None

def to24(h, m, ap):
    h = int(h)
    if ap == 'PM' and h != 12: h += 12
    elif ap == 'AM' and h == 12: h = 0
    return h

conn = psycopg2.connect(**DB_PARAMS)
cur = conn.cursor()

# Get store mapping
cur.execute("SELECT id, name, external_code FROM api_store")
stores_by_code = {}
stores_by_name = {}
for sid, name, code in cur.fetchall():
    if code: stores_by_code[code.strip()] = sid
    if name: stores_by_name[name.strip()] = sid

def resolve_store(name):
    return stores_by_code.get(name) or stores_by_name.get(name)

# Step 1: Backfill perf-by-hour
cur.execute("SELECT id, report_date, raw_data FROM api_rawreport WHERE report_type='performance-by-hour' ORDER BY report_date")
for rr_id, report_date, raw_data in cur.fetchall():
    rows = raw_data if isinstance(raw_data, list) else json.loads(raw_data) if raw_data else []
    bucket_counts = {}
    for row in rows:
        cn = (row.get('Center Name') or '').strip()
        mt = (row.get('Metric') or '').strip()
        if not cn or cn in ('Grand Total','Total','Center Total') or not mt: continue
        if 'guest serviced' not in mt.lower() and 'floor hour' not in mt.lower(): continue
        sid = resolve_store(cn)
        if not sid: continue
        for col in HOUR_COLUMNS:
            val = parse_decimal(row.get(col))
            if val is None: continue
            bl = get_time_bucket(HOUR_MAP[col])
            if not bl: continue
            key = (sid, bl)
            if key not in bucket_counts:
                bucket_counts[key] = {'idle': 0, 'total': 0}
            bucket_counts[key]['total'] += 1
            if val == 0:
                bucket_counts[key]['idle'] += 1
    for (sid, bl), c in bucket_counts.items():
        cur.execute(
            "UPDATE sched_time_buckets SET idle_hour_count=%s, total_hour_count=%s WHERE store_id=%s AND date=%s AND time_bucket=%s",
            (c['idle'], c['total'], sid, report_date, bl))
    conn.commit()
    print(f'Perf {report_date}: {len(bucket_counts)} buckets')

# Step 2: Backfill attendance windows
cur.execute("SELECT id, report_date, raw_data FROM api_rawreport WHERE report_type='attendance' ORDER BY report_date")
for rr_id, report_date, raw_data in cur.fetchall():
    rows = raw_data if isinstance(raw_data, list) else json.loads(raw_data) if raw_data else []
    store_windows = {}
    for row in rows:
        wc = (row.get('Work Center') or '').strip()
        if not wc or wc in ('Grand Total','Total','Center Total'): continue
        sid = resolve_store(wc)
        if not sid: continue
        ci = row.get('Actual Check-Ins')
        if not ci: continue
        times = re.findall(r'(\d{1,2}):(\d{2})\s*(AM|PM)', str(ci).strip())
        if not times: continue
        earliest = to24(*times[0])
        latest = to24(*times[-1])
        if sid not in store_windows:
            store_windows[sid] = {'e': earliest, 'l': latest}
        else:
            store_windows[sid]['e'] = min(store_windows[sid]['e'], earliest)
            store_windows[sid]['l'] = max(store_windows[sid]['l'], latest)
    for sid, w in store_windows.items():
        cur.execute(
            "UPDATE sched_daily_metrics SET earliest_checkin_hour=%s, latest_checkout_hour=%s WHERE store_id=%s AND date=%s",
            (w['e'], w['l'], sid, report_date))
    conn.commit()
    print(f'Att {report_date}: {len(store_windows)} stores')

# Step 3: Recalculate idle hours
print('Recalculating idle hours...')
cur.execute("SELECT id, store_id, date, total_payroll_hours, earliest_checkin_hour, latest_checkout_hour FROM sched_daily_metrics")
dm_rows = cur.fetchall()
updated = 0
for dm_id, store_id, dm_date, payroll_hrs, checkin_start, checkout_end in dm_rows:
    cur.execute(
        "SELECT time_bucket, guest_tickets, labor_hours, is_idle, idle_hour_count, total_hour_count FROM sched_time_buckets WHERE store_id=%s AND date=%s",
        (store_id, dm_date))
    buckets = cur.fetchall()
    if not buckets: continue
    tb_tickets = sum(b[1] for b in buckets)
    tb_labor = sum(b[2] for b in buckets)
    has_perf = tb_tickets > 0

    def in_window(bl):
        if checkin_start is None or checkout_end is None: return True
        bs, be = BUCKET_RANGES.get(bl, (0, 24))
        return bs < checkout_end + 1 and be > checkin_start

    if has_perf:
        idle_hrs = Decimal('0')
        labor_in_win = Decimal('0')
        for (bl, gt, lh, is_idle, ihc, thc) in buckets:
            if not in_window(bl): continue
            if thc > 0 and lh > 0:
                frac = Decimal(str(ihc)) / Decimal(str(thc))
                idle_hrs += lh * frac
                labor_in_win += lh
            elif lh > 0:
                labor_in_win += lh
                if is_idle or gt == 0:
                    idle_hrs += lh
    else:
        idle_hrs = Decimal('0')
        labor_in_win = Decimal('0')

    eff_labor = payroll_hrs if payroll_hrs and payroll_hrs > 0 else tb_labor
    eff_win = labor_in_win if labor_in_win > 0 else eff_labor
    pct = (idle_hrs / eff_win * 100) if eff_win > 0 else Decimal('0')

    cur.execute("UPDATE sched_daily_metrics SET idle_hours=%s, pct_idle=%s WHERE id=%s",
                (idle_hrs, pct, dm_id))
    updated += 1

conn.commit()
print(f'Recalculated {updated} daily metrics')

# Verify Durango Square Feb 22
cur.execute("""
SELECT dm.date, dm.total_payroll_hours, dm.idle_hours, dm.pct_idle, dm.total_guest_tickets,
       dm.earliest_checkin_hour, dm.latest_checkout_hour
FROM sched_daily_metrics dm
JOIN api_store s ON dm.store_id = s.id
WHERE s.name ILIKE '%%durango%%' AND dm.date = '2026-02-22'
""")
for row in cur.fetchall():
    print(f'Durango 2/22: payroll={row[1]}, idle={row[2]}, pct={row[3]}, tickets={row[4]}, checkin={row[5]}, checkout={row[6]}')

cur.execute("""
SELECT tb.time_bucket, tb.guest_tickets, tb.labor_hours, tb.is_idle, tb.idle_hour_count, tb.total_hour_count
FROM sched_time_buckets tb
JOIN api_store s ON tb.store_id = s.id
WHERE s.name ILIKE '%%durango%%' AND tb.date = '2026-02-22'
ORDER BY tb.time_bucket
""")
for row in cur.fetchall():
    print(f'  {row[0]}: tickets={row[1]}, labor={row[2]}, idle={row[3]}, idle_hrs={row[4]}/{row[5]}')

cur.close()
conn.close()
print('Done!')
