"""
Ezra Data Ingestion Handlers for Exponential and Scheduling report types.

These handlers are called from IngestRawReportView when specific report types
are ingested. They transform raw Zenoti report data into the normalized
Exponential and Scheduling models.

Report types handled:
  - 'business-kpi': Zenoti Business KPI report → ReportMetric + guest counts
  - 'sales-accrual': Zenoti Sales-Accrual report → Individual guest visits (Exponential)
  - 'attendance': Zenoti Attendance report → Payroll hours, overtime (Scheduling)
  - 'performance-by-hour': Zenoti Performance By Hour report → Guest tickets, idle hours
  - 'statutory-pay': Zenoti Statutory Pay report → Average payroll rates
"""
import logging
import math
import re
from datetime import datetime, date
from decimal import Decimal, InvalidOperation

from django.db import transaction

from api.models import (
    AppConfig, Store, Tenant,
    ExponentialCustomer, ExponentialVisit, ExponentialSMSLog, ExponentialUptake,
    SchedulingTimeBucket, SchedulingDailyMetrics,
)
from api.constants import DEFAULT_SCHEDULING_CONFIG, DEFAULT_EXPONENTIAL_CONFIG

logger = logging.getLogger(__name__)

SKIP_VALUES = frozenset(['Grand Total', 'Total', 'Center Total'])

# Hour column keys used in performance-by-hour report
HOUR_COLUMNS = [
    '12AM', '1AM', '2AM', '3AM', '4AM', '5AM', '6AM', '7AM',
    '8AM', '9AM', '10AM', '11AM', '12PM', '1PM', '2PM', '3PM',
    '4PM', '5PM', '6PM', '7PM', '8PM', '9PM', '10PM', '11PM',
]

# Map column name to 24-hour int
HOUR_MAP = {
    '12AM': 0, '1AM': 1, '2AM': 2, '3AM': 3, '4AM': 4, '5AM': 5,
    '6AM': 6, '7AM': 7, '8AM': 8, '9AM': 9, '10AM': 10, '11AM': 11,
    '12PM': 12, '1PM': 13, '2PM': 14, '3PM': 15, '4PM': 16, '5PM': 17,
    '6PM': 18, '7PM': 19, '8PM': 20, '9PM': 21, '10PM': 22, '11PM': 23,
}


def _parse_decimal(value):
    """Safely parse a decimal value."""
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


def _parse_date(value, formats=None):
    """Safely parse a date from various formats."""
    if not value:
        return None
    if isinstance(value, date):
        return value
    formats = formats or ['%Y-%m-%d', '%m/%d/%Y', '%m/%d/%y', '%Y-%m-%dT%H:%M:%S']
    for fmt in formats:
        try:
            return datetime.strptime(str(value).strip(), fmt).date()
        except (ValueError, TypeError):
            continue
    return None


def _get_time_bucket(hour):
    """Map an hour (0-23) to a scheduling time bucket."""
    config = AppConfig.get_config_value('scheduling_config', DEFAULT_SCHEDULING_CONFIG)
    buckets = config.get('time_buckets', DEFAULT_SCHEDULING_CONFIG['time_buckets'])
    for bucket in buckets:
        start_h = int(bucket['start'].split(':')[0])
        end_h = int(bucket['end'].split(':')[0])
        if start_h <= hour < end_h:
            return bucket['label']
    return None


def _resolve_store(name, store_cache):
    """Resolve a store by name/code from cache or DB."""
    if not name:
        return None
    name = name.strip()
    if name in store_cache:
        return store_cache[name]
    store = Store.objects.filter(external_code=name).first()
    if not store:
        store = Store.objects.filter(name=name).first()
    if store:
        store_cache[name] = store
    return store


# ===========================================
# EXPONENTIAL REPORT HANDLERS
# ===========================================

def process_business_kpi(rows, report_date, tenant, store_cache):
    """
    Process Zenoti Business KPI report.
    Extracts: Unique Guest count, New Guest Count, Service Sales, etc.
    """
    processed = 0
    for row in rows:
        center_name = (row.get('Center Name') or row.get('Center Name ') or '').strip()
        if not center_name or center_name in SKIP_VALUES:
            continue

        # Accept both casing variants
        guest_count = _parse_decimal(
            row.get('Unique Guest count') or row.get('Unique Guest Count')
        )
        if guest_count is None:
            continue

        processed += 1

    logger.info(f"Business KPI: processed {processed} rows for {tenant.name}")
    return processed


def process_sales_accrual_guests(rows, report_date, tenant, store_cache):
    """
    Process Zenoti Sales-Accrual report for guest visit tracking.
    Extracts: Guest Name, Guest Code, Center Name, Sale Date, Member, First Visit.
    Stores individual visit records for Exponential segmentation.
    
    Optimized: deduplicates rows by guest_code first to minimize DB queries.
    """
    customers_created = 0
    visits_created = 0

    # Phase 1: Deduplicate — collect unique guests and their data
    # Key: guest_code → {guest_name, center_name, is_member, store, last_service}
    unique_guests = {}
    for row in rows:
        center_name = (row.get('Center Name') or row.get('Center Name ') or '').strip()
        guest_name = (row.get('Guest Name') or '').strip()
        guest_code = str(row.get('Guest Code') or '').strip()

        if not center_name or not guest_name or not guest_code:
            continue
        if center_name in SKIP_VALUES:
            continue

        store = _resolve_store(center_name, store_cache)
        if not store:
            continue

        member_val = str(row.get('Member') or '').strip().lower()
        is_member = member_val == 'yes'

        # Extract service name for last_service tracking
        item_type = (row.get('Item Type') or '').strip()
        item_name = (row.get('Item Name') or '').strip()
        service_name = item_name if item_type == 'Service' and item_name else ''

        # Keep first occurrence, but upgrade is_member if any row says yes
        if guest_code in unique_guests:
            if is_member:
                unique_guests[guest_code]['is_member'] = True
            # Keep first service found (rows are typically in order)
            if service_name and not unique_guests[guest_code].get('last_service'):
                unique_guests[guest_code]['last_service'] = service_name
        else:
            unique_guests[guest_code] = {
                'guest_name': guest_name,
                'center_name': center_name,
                'store': store,
                'is_member': is_member,
                'last_service': service_name,
            }

    # Phase 2: Batch-fetch existing customers
    guest_codes = list(unique_guests.keys())
    existing_customers = {
        c.guest_code: c
        for c in ExponentialCustomer.objects.filter(
            tenant=tenant, guest_code__in=guest_codes
        ).select_related('store')
    }

    # Phase 3: Create/update customers
    sale_date = report_date
    customers_to_create = []
    customer_map = {}  # guest_code → customer

    for guest_code, info in unique_guests.items():
        if guest_code in existing_customers:
            customer = existing_customers[guest_code]
            update_fields = []
            if customer.guest_name != info['guest_name']:
                customer.guest_name = info['guest_name']
                update_fields.append('guest_name')
            if info['is_member'] and not customer.sms_opt_in:
                customer.sms_opt_in = True
                update_fields.append('sms_opt_in')
            if info.get('last_service') and customer.last_service != info['last_service']:
                customer.last_service = info['last_service']
                update_fields.append('last_service')
            if update_fields:
                customer.save(update_fields=update_fields)
            customer_map[guest_code] = customer
        else:
            customer = ExponentialCustomer(
                tenant=tenant,
                store=info['store'],
                guest_code=guest_code,
                guest_name=info['guest_name'],
                sms_opt_in=info['is_member'],
                last_service=info.get('last_service', ''),
            )
            customers_to_create.append(customer)

    if customers_to_create:
        ExponentialCustomer.objects.bulk_create(customers_to_create, ignore_conflicts=True)
        customers_created = len(customers_to_create)
        # Re-fetch to get IDs for newly created customers
        new_codes = [c.guest_code for c in customers_to_create]
        for c in ExponentialCustomer.objects.filter(tenant=tenant, guest_code__in=new_codes):
            customer_map[c.guest_code] = c

    # Also add existing customers to map
    for gc, c in existing_customers.items():
        if gc not in customer_map:
            customer_map[gc] = c

    # Phase 4: Batch-check existing visits
    existing_visits = set()
    for v in ExponentialVisit.objects.filter(
        customer__tenant=tenant,
        visit_date=sale_date,
        customer__guest_code__in=guest_codes
    ).values_list('customer__guest_code', 'store_id'):
        existing_visits.add((v[0], v[1]))

    # Phase 5: Create visits in bulk
    visits_to_create = []
    affected_customer_ids = set()
    for guest_code, info in unique_guests.items():
        customer = customer_map.get(guest_code)
        if not customer:
            continue
        store = info['store']
        if (guest_code, store.id) not in existing_visits:
            visits_to_create.append(ExponentialVisit(
                customer=customer,
                store=store,
                visit_date=sale_date,
                center_name=info['center_name'],
            ))
            affected_customer_ids.add(customer.id)

    if visits_to_create:
        ExponentialVisit.objects.bulk_create(visits_to_create, ignore_conflicts=True)
        visits_created = len(visits_to_create)

    # Phase 6: Recompute visit stats for ALL affected customers
    # Handles out-of-order ingestion (e.g. newest report ingested first)
    if affected_customer_ids:
        affected_customers = ExponentialCustomer.objects.filter(id__in=affected_customer_ids)
        for customer in affected_customers:
            visit_dates = list(
                ExponentialVisit.objects.filter(customer=customer)
                .values_list('visit_date', flat=True)
                .order_by('-visit_date')
            )
            customer.total_visits = len(visit_dates)
            customer.last_visit_date = visit_dates[0] if visit_dates else None
            customer.previous_visit_date = visit_dates[1] if len(visit_dates) > 1 else None
            customer.save(update_fields=['total_visits', 'last_visit_date', 'previous_visit_date'])

    logger.info(
        f"Sales-Accrual Guests: {customers_created} customers created, "
        f"{visits_created} visits created for {tenant.name} "
        f"(deduplicated {len(rows)} rows to {len(unique_guests)} unique guests)"
    )

    # Phase 7: Campaign redemption tracking via Discount Name
    # If a guest has a "Campaign" discount AND was previously sent an SMS,
    # create an ExponentialUptake record (return visit after SMS).
    uptakes_created = 0
    campaign_guests = set()
    for row in rows:
        discount_name = (row.get('Discount Name') or '').strip()
        guest_code = str(row.get('Guest Code') or '').strip()
        if discount_name.lower().startswith('campaign') and guest_code:
            campaign_guests.add(guest_code)

    if campaign_guests:
        # Find SMS logs for these guests that don't already have uptake records
        sms_logs = ExponentialSMSLog.objects.filter(
            customer__tenant=tenant,
            customer__guest_code__in=campaign_guests,
        ).exclude(
            uptake__isnull=False  # skip if uptake already exists
        ).select_related('customer')

        for log in sms_logs:
            sent_date = log.sent_at.date() if log.sent_at else None
            if not sent_date:
                continue
            days_to_return = (report_date - sent_date).days
            # Only count if return visit is within 14 days of SMS send (per spec)
            if 0 < days_to_return <= 14:
                ExponentialUptake.objects.get_or_create(
                    sms_log=log,
                    defaults={
                        'customer': log.customer,
                        'return_visit_date': report_date,
                        'days_to_return': days_to_return,
                    }
                )
                uptakes_created += 1

    if uptakes_created:
        logger.info(f"Sales-Accrual: {uptakes_created} campaign uptakes tracked for {tenant.name}")

    return visits_created


def process_sms_opt_in(rows, report_date, tenant, store_cache):
    """
    Process SMS opt-in data from Zenoti guest event report.
    Updates sms_opt_in flag based on 'Event' column containing 'SMS Opt-in Marketing'.
    """
    updated = 0
    for row in rows:
        guest_code = str(row.get('Guest Code') or '').strip()
        event = (row.get('Event') or '').strip()

        if not guest_code:
            continue

        is_opted_in = 'SMS Opt-in Marketing' in event

        try:
            customer = ExponentialCustomer.objects.get(tenant=tenant, guest_code=guest_code)
            if customer.sms_opt_in != is_opted_in:
                customer.sms_opt_in = is_opted_in
                customer.save(update_fields=['sms_opt_in'])
                updated += 1
        except ExponentialCustomer.DoesNotExist:
            pass

    logger.info(f"SMS Opt-in: updated {updated} customers for {tenant.name}")
    return updated


# ===========================================
# SCHEDULING REPORT HANDLERS
# ===========================================

def _parse_earliest_checkin_hour(actual_checkins_str):
    """
    Parse the earliest check-in hour from Attendance 'Actual Check-Ins' field.
    Format: ' 10:56 AM - 02:40 PM, 03:18 PM - 07:22 PM'
    Returns hour as int (0-23) or None.
    NOTE: Zenoti may return segments out of chronological order, so we
    compute min() across all parsed times instead of assuming the first is earliest.
    """
    if not actual_checkins_str or not isinstance(actual_checkins_str, str):
        return None
    times = re.findall(r'(\d{1,2}):(\d{2})\s*(AM|PM)', actual_checkins_str.strip())
    if not times:
        return None

    def to_hour_24(h_str, m_str, ampm):
        h = int(h_str)
        if ampm == 'PM' and h != 12:
            h += 12
        elif ampm == 'AM' and h == 12:
            h = 0
        return h

    all_hours = [to_hour_24(*t) for t in times]
    return min(all_hours)


def _parse_checkin_window(actual_checkins_str):
    """
    Parse the full check-in window from Attendance 'Actual Check-Ins' field.
    Format: ' 10:56 AM - 02:40 PM, 03:18 PM - 07:22 PM'
    Returns (earliest_hour, latest_hour) as ints (0-23) or (None, None).
    NOTE: Zenoti may return segments out of chronological order (e.g.
    '02:26 PM - 03:29 PM, 08:45 AM - 01:55 PM'), so we compute min/max
    across ALL parsed times rather than assuming first=earliest, last=latest.
    """
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

    all_hours = [to_hour_24(*t) for t in times]
    return min(all_hours), max(all_hours)


def process_attendance(rows, report_date, tenant, store_cache):
    """
    Process Zenoti Attendance report.
    Uses 'Work Center' as store identifier.
    Extracts: Actual Hours, Scheduled Hours, Work Center.
    Calculates overtime = Actual Hours - Scheduled Hours > 0.
    Tracks earliest check-in and latest check-out per store for idle window.
    """
    processed = 0
    daily_metrics = {}  # store_id -> aggregated metrics
    store_checkin_windows = {}  # store_id -> {'earliest': int, 'latest': int}

    # Reset labor_hours/scheduled_hours on existing time buckets for idempotency
    store_ids = list(set(store_cache.values()))
    if store_ids:
        SchedulingTimeBucket.objects.filter(
            store__in=[s.id if hasattr(s, 'id') else s for s in store_ids],
            date=report_date,
        ).update(labor_hours=Decimal('0'), scheduled_hours=Decimal('0'))

    for row in rows:
        # Attendance report uses 'Work Center' as the store identifier
        work_center = (row.get('Work Center') or '').strip()
        if not work_center or work_center in SKIP_VALUES:
            continue

        actual_hours = _parse_decimal(row.get('Actual Hours') or row.get('TotalHrs'))
        scheduled_hours = _parse_decimal(row.get('Scheduled Hours'))

        if actual_hours is None:
            continue

        store = _resolve_store(work_center, store_cache)
        if not store:
            continue

        scheduled_hours = scheduled_hours or Decimal('0')
        overtime = max(Decimal('0'), actual_hours - scheduled_hours)

        # Always use API-level report_date (not row-level Date)
        row_date = report_date

        # Distribute labor hours across time buckets that overlap with
        # the employee's check-in to check-out window, proportionally by
        # the number of hours each bucket overlaps.
        earliest_h, latest_h = _parse_checkin_window(row.get('Actual Check-Ins'))
        if earliest_h is not None and latest_h is not None:
            sid = store.id
            if sid not in store_checkin_windows:
                store_checkin_windows[sid] = {'earliest': earliest_h, 'latest': latest_h}
            else:
                store_checkin_windows[sid]['earliest'] = min(store_checkin_windows[sid]['earliest'], earliest_h)
                store_checkin_windows[sid]['latest'] = max(store_checkin_windows[sid]['latest'], latest_h)

            # Calculate overlap of each time bucket with this employee's window
            BUCKET_HOUR_RANGES = {
                '9AM-12PM': (9, 12),
                '12PM-2PM': (12, 14),
                '2PM-5PM': (14, 17),
                '5PM-9PM': (17, 21),
            }
            overlaps = {}  # bucket_label -> overlap_hours
            total_overlap = Decimal('0')
            for bl, (bs, be) in BUCKET_HOUR_RANGES.items():
                overlap_start = max(earliest_h, bs)
                overlap_end = min(latest_h + 1, be)  # +1 because latest_h is the hour, not end
                if overlap_start < overlap_end:
                    overlap = Decimal(str(overlap_end - overlap_start))
                    overlaps[bl] = overlap
                    total_overlap += overlap

            if total_overlap > 0:
                for bl, overlap in overlaps.items():
                    fraction = overlap / total_overlap
                    bucket_labor = actual_hours * fraction
                    bucket_sched = scheduled_hours * fraction

                    tb, created = SchedulingTimeBucket.objects.get_or_create(
                        store=store,
                        date=row_date,
                        time_bucket=bl,
                        work_center=work_center,
                        defaults={
                            'labor_hours': Decimal('0'),
                            'scheduled_hours': Decimal('0'),
                            'is_idle': True,
                        }
                    )
                    tb.labor_hours += bucket_labor
                    tb.scheduled_hours += bucket_sched
                    if tb.guest_tickets == 0:
                        tb.is_idle = True
                    tb.save(update_fields=['labor_hours', 'scheduled_hours', 'is_idle'])
        else:
            # No check-in window parsed, fall back to earliest check-in bucket
            checkin_hour = _parse_earliest_checkin_hour(row.get('Actual Check-Ins'))
            time_bucket_label = _get_time_bucket(checkin_hour) if checkin_hour is not None else None

            if time_bucket_label:
                tb, created = SchedulingTimeBucket.objects.get_or_create(
                    store=store,
                    date=row_date,
                    time_bucket=time_bucket_label,
                    work_center=work_center,
                    defaults={
                        'labor_hours': Decimal('0'),
                        'scheduled_hours': Decimal('0'),
                        'is_idle': True,
                    }
                )
                tb.labor_hours += actual_hours
                tb.scheduled_hours += scheduled_hours
                if tb.guest_tickets == 0:
                    tb.is_idle = True
                tb.save(update_fields=['labor_hours', 'scheduled_hours', 'is_idle'])

        # Aggregate for daily metrics
        sid = store.id
        if sid not in daily_metrics:
            daily_metrics[sid] = {
                'store': store,
                'date': row_date,
                'payroll_hours': Decimal('0'),
                'scheduled_hours': Decimal('0'),
                'overtime_hours': Decimal('0'),
            }
        daily_metrics[sid]['payroll_hours'] += actual_hours
        daily_metrics[sid]['scheduled_hours'] += scheduled_hours
        daily_metrics[sid]['overtime_hours'] += overtime
        processed += 1

    # Update daily metrics
    for sid, m in daily_metrics.items():
        has_overtime = m['overtime_hours'] > 0
        defaults = {
            'total_payroll_hours': m['payroll_hours'],
            'total_scheduled_hours': m['scheduled_hours'],
            'overtime_hours': m['overtime_hours'],
            'has_overtime': has_overtime,
        }
        # Store the clock-in window if we parsed it
        if sid in store_checkin_windows:
            defaults['earliest_checkin_hour'] = store_checkin_windows[sid]['earliest']
            defaults['latest_checkout_hour'] = store_checkin_windows[sid]['latest']
        SchedulingDailyMetrics.objects.update_or_create(
            store=m['store'],
            date=m['date'],
            defaults=defaults,
        )

    # Recalculate daily idle hours (attendance affects labor hours in time buckets)
    _recalculate_daily_idle(report_date, tenant, store_cache)

    logger.info(f"Attendance: processed {processed} rows for {tenant.name}")
    return processed


def process_performance_by_hour(rows, report_date, tenant, store_cache):
    """
    Process Zenoti Performance By Hour report.
    
    IMPORTANT: This handler NO LONGER sets guest_tickets. Guest visit counts
    are now exclusively sourced from the Appointments report (per client spec).
    
    This handler only provides FALLBACK idle detection for stores that don't
    have Appointments data. If a store already has idle_hours_detail populated
    by the Appointments handler, this handler will not overwrite it.
    """
    processed = 0

    for row in rows:
        center_name = (row.get('Center Name') or '').strip()
        if not center_name or center_name in SKIP_VALUES:
            continue

        metric_type = (row.get('Metric') or '').strip()
        if not metric_type:
            continue

        store = _resolve_store(center_name, store_cache)
        if not store:
            continue

        # Only process Guest Serviced/Floor Hour for fallback idle detection
        is_guest_metric = 'guest serviced' in metric_type.lower() or 'floor hour' in metric_type.lower()

        # Iterate over each hour column
        for col_name in HOUR_COLUMNS:
            val = _parse_decimal(row.get(col_name))
            if val is None:
                continue

            hour_24 = HOUR_MAP[col_name]
            time_bucket_label = _get_time_bucket(hour_24)
            if not time_bucket_label:
                continue

            if is_guest_metric:
                is_idle = val == 0

                tb, created = SchedulingTimeBucket.objects.get_or_create(
                    store=store,
                    date=report_date,
                    time_bucket=time_bucket_label,
                    work_center=center_name,
                    defaults={'is_idle': True, 'guest_tickets': 0, 'idle_hour_count': 0, 'total_hour_count': 0, 'idle_hours_detail': {}}
                )
                # Only update idle detection if Appointments handler hasn't
                # already set it (idle_hours_detail would be non-empty).
                # Never touch guest_tickets — that's owned by Appointments.
                if not tb.idle_hours_detail:
                    tb.total_hour_count += 1
                    if is_idle:
                        tb.idle_hour_count += 1
                    detail = tb.idle_hours_detail or {}
                    detail[str(hour_24)] = is_idle
                    tb.idle_hours_detail = detail
                    tb.is_idle = is_idle and tb.guest_tickets == 0
                    tb.save(update_fields=['is_idle', 'idle_hour_count', 'total_hour_count', 'idle_hours_detail'])

            processed += 1

    # Recalculate daily idle hours
    _recalculate_daily_idle(report_date, tenant, store_cache)

    logger.info(f"Performance By Hour: processed {processed} rows for {tenant.name}")
    return processed


def process_appointments(rows, report_date, tenant, store_cache):
    """
    Process Zenoti Appointments report.
    Primary source for guest ticket counting and idle detection.

    Guest Visit Logic (per client spec):
    - Only count rows where Status == "Closed"
    - Guest visits are counted at the scheduled Start Time hour (when the
      appointment was booked for), using Center Name to identify the salon
    - Deduplicate by Guest Name per store per hour: if a guest has multiple
      services in the same hour, they count as 1 visit
    - For idle detection, an hour is idle if 0 services overlapped with it
      (uses Actual StartTime/EndTime for the real service span)

    Data source: Zenoti Appointments Report
    Filters: Date Type = Appointment date, Date = Yesterday, Status = Closed
    """
    processed = 0

    # Reset guest_tickets and hour counts on existing time buckets for idempotency
    store_ids = list(set(store_cache.values()))
    if store_ids:
        SchedulingTimeBucket.objects.filter(
            store__in=[s.id if hasattr(s, 'id') else s for s in store_ids],
            date=report_date,
        ).update(guest_tickets=0, is_idle=True, idle_hour_count=0, total_hour_count=0, idle_hours_detail={})

    # Phase 1: Parse appointments
    # Trackers per store:
    #   guest_visits: hour -> set of guest names (for deduplication)
    #   active_hours: set of hours that had any service activity (for idle detection)
    store_data = {}

    for row in rows:
        status = (row.get('Status') or '').strip()
        if status != 'Closed':
            continue

        center_name = (row.get('Center Name') or row.get('Center Name ') or '').strip()
        if not center_name or center_name in SKIP_VALUES:
            continue

        store = _resolve_store(center_name, store_cache)
        if not store:
            continue

        # Use scheduled Start Time for guest visit bucket placement
        scheduled_start = (row.get('Start Time') or '').strip()
        # Use Actual StartTime/EndTime for idle detection (real service span)
        actual_start = (row.get('Actual StartTime') or '').strip()
        actual_end = (row.get('Actual EndTime') or '').strip()

        if not actual_start:
            continue

        # Parse times
        scheduled_dt = _parse_appointment_datetime(scheduled_start) if scheduled_start else None
        actual_start_dt = _parse_appointment_datetime(actual_start)
        actual_end_dt = _parse_appointment_datetime(actual_end) if actual_end else None

        if not actual_start_dt:
            continue

        # Filter to only appointments on the report_date (using actual start)
        if actual_start_dt.date() != report_date:
            continue

        # If no end time, use start time as end time (instant service)
        if not actual_end_dt:
            actual_end_dt = actual_start_dt

        # Guest name for deduplication (normalize: strip + lowercase)
        guest_name = (row.get('Guest Name') or '').strip().lower()

        sid = store.id
        if sid not in store_data:
            store_data[sid] = {'store': store, 'guest_visits': {}, 'active_hours': set()}

        # Guest visit: counted at scheduled Start Time hour, deduplicated by guest name
        # Fall back to Actual StartTime if scheduled Start Time is not available
        visit_dt = scheduled_dt if scheduled_dt and scheduled_dt.date() == report_date else actual_start_dt
        visit_hour = visit_dt.hour
        if visit_hour not in store_data[sid]['guest_visits']:
            store_data[sid]['guest_visits'][visit_hour] = set()
        store_data[sid]['guest_visits'][visit_hour].add(guest_name)

        # Idle detection: mark all hours the actual service spans as active
        start_hour = actual_start_dt.hour
        end_hour = actual_end_dt.hour
        if actual_end_dt.minute > 0 or actual_end_dt.second > 0:
            end_hour_inclusive = end_hour
        else:
            end_hour_inclusive = max(start_hour, end_hour - 1)
        for h in range(start_hour, end_hour_inclusive + 1):
            store_data[sid]['active_hours'].add(h)

        processed += 1

    # Phase 2: Update time buckets with service counts and idle detection
    BUCKET_HOUR_RANGES = {
        '9AM-12PM': (9, 12),
        '12PM-2PM': (12, 14),
        '2PM-5PM': (14, 17),
        '5PM-9PM': (17, 21),
    }

    for sid, data in store_data.items():
        store = data['store']
        guest_visits = data['guest_visits']
        active_hours = data['active_hours']

        for bucket_label, (bucket_start, bucket_end) in BUCKET_HOUR_RANGES.items():
            idle_hours_detail = {}
            total_tickets = 0
            idle_count = 0
            total_count = 0

            for h in range(bucket_start, bucket_end):
                # Guest visits: count unique guests who started service in this hour
                total_tickets += len(guest_visits.get(h, set()))
                # Idle: based on whether any service was active during this hour
                is_idle = h not in active_hours
                idle_hours_detail[str(h)] = is_idle
                total_count += 1
                if is_idle:
                    idle_count += 1

            tb, created = SchedulingTimeBucket.objects.get_or_create(
                store=store,
                date=report_date,
                time_bucket=bucket_label,
                work_center=store.name,
                defaults={
                    'guest_tickets': 0,
                    'is_idle': True,
                    'idle_hour_count': 0,
                    'total_hour_count': 0,
                    'idle_hours_detail': {},
                }
            )
            tb.guest_tickets = total_tickets
            tb.is_idle = total_tickets == 0
            tb.idle_hour_count = idle_count
            tb.total_hour_count = total_count
            tb.idle_hours_detail = idle_hours_detail
            tb.save(update_fields=[
                'guest_tickets', 'is_idle', 'idle_hour_count',
                'total_hour_count', 'idle_hours_detail',
            ])

    # Also handle stores that have attendance data but no appointments at all
    # (all hours are idle for those stores)
    stores_with_attendance = set()
    for s in store_cache.values():
        sid = s.id if hasattr(s, 'id') else s
        if sid not in store_data:
            # Check if this store has time buckets for this date (from attendance)
            existing = SchedulingTimeBucket.objects.filter(
                store_id=sid, date=report_date
            ).exists()
            if existing:
                stores_with_attendance.add(sid)

    for sid in stores_with_attendance:
        for bucket_label, (bucket_start, bucket_end) in BUCKET_HOUR_RANGES.items():
            idle_hours_detail = {}
            for h in range(bucket_start, bucket_end):
                idle_hours_detail[str(h)] = True  # All idle, no appointments

            tbs = SchedulingTimeBucket.objects.filter(
                store_id=sid, date=report_date, time_bucket=bucket_label
            )
            for tb in tbs:
                tb.guest_tickets = 0
                tb.is_idle = True
                tb.idle_hour_count = bucket_end - bucket_start
                tb.total_hour_count = bucket_end - bucket_start
                tb.idle_hours_detail = idle_hours_detail
                tb.save(update_fields=[
                    'guest_tickets', 'is_idle', 'idle_hour_count',
                    'total_hour_count', 'idle_hours_detail',
                ])

    # Recalculate daily idle hours
    _recalculate_daily_idle(report_date, tenant, store_cache)

    logger.info(f"Appointments: processed {processed} closed services for {tenant.name}")
    return processed


def _parse_appointment_datetime(dt_str):
    """Parse appointment datetime from various Zenoti formats.
    Examples: '2/20/2026 9:00:00 AM', '2026-02-20T09:00:00', '02/20/2026 09:00 AM'
    """
    if not dt_str:
        return None
    formats = [
        '%m/%d/%Y %I:%M:%S %p',   # 2/20/2026 9:00:00 AM
        '%m/%d/%Y %I:%M %p',      # 2/20/2026 9:00 AM
        '%Y-%m-%dT%H:%M:%S',      # 2026-02-20T09:00:00
        '%Y-%m-%d %H:%M:%S',      # 2026-02-20 09:00:00
        '%m/%d/%y %I:%M:%S %p',   # 2/20/26 9:00:00 AM
        '%m/%d/%y %I:%M %p',      # 2/20/26 9:00 AM
    ]
    for fmt in formats:
        try:
            return datetime.strptime(str(dt_str).strip(), fmt)
        except (ValueError, TypeError):
            continue
    return None


def process_statutory_pay(rows, report_date, tenant, store_cache):
    """
    Process Zenoti Statutory Pay report.
    Uses 'Work Center' as store identifier.
    Extracts: Blended Production Hourly Rate per employee.
    Calculates average payroll rate per store and propagates to time buckets.
    """
    store_rates = {}  # store_id -> {store, rates}

    for row in rows:
        # Statutory Pay uses 'Work Center' as the store identifier
        work_center = (row.get('Work Center') or '').strip()
        if not work_center or work_center in SKIP_VALUES:
            continue

        rate = _parse_decimal(row.get('Blended Production Hourly Rate'))
        if rate is None:
            continue

        store = _resolve_store(work_center, store_cache)
        if not store:
            continue

        sid = store.id
        if sid not in store_rates:
            store_rates[sid] = {'store': store, 'rates': []}
        store_rates[sid]['rates'].append(rate)

    # Update daily metrics and time buckets with average payroll rate
    for sid, data in store_rates.items():
        if data['rates']:
            avg_rate = sum(data['rates']) / len(data['rates'])
            dm, _ = SchedulingDailyMetrics.objects.get_or_create(
                store=data['store'], date=report_date
            )
            dm.avg_payroll_rate = avg_rate
            dm.save(update_fields=['avg_payroll_rate'])

            # Also set avg_payroll_rate on time buckets for this store/date
            SchedulingTimeBucket.objects.filter(
                store=data['store'], date=report_date
            ).update(avg_payroll_rate=avg_rate)

    logger.info(f"Statutory Pay: processed rates for {len(store_rates)} stores for {tenant.name}")
    return len(store_rates)


def _recalculate_daily_idle(report_date, tenant, store_cache):
    """Recalculate daily idle hours and derived metrics from time buckets.

    Idle hours are only counted within the clock-in window (earliest check-in
    to latest check-out from Attendance). A time bucket is considered within
    the window if it overlaps with the check-in/check-out range.

    BUG 1 fix: Also syncs total_payroll_hours from time buckets when attendance
    hasn't set it yet, so SRPH/TPLH are correct regardless of ingestion order.
    BUG 4 fix: Only overwrites revenue/tickets from time buckets if they have
    non-zero data, preserving values set by production/sales handlers.
    BUG 6 fix: Only calculate idle from ticket data when performance-by-hour
    data exists for the store. Otherwise, estimate idle proportionally from
    production ticket counts to avoid falsely marking stores as 100% idle.
    """
    # Time bucket hour ranges for clock-in window overlap check
    BUCKET_HOUR_RANGES = {
        '9AM-12PM': (9, 12),
        '12PM-2PM': (12, 14),
        '2PM-5PM': (14, 17),
        '5PM-9PM': (17, 21),
    }

    config = AppConfig.get_config_value('scheduling_config', DEFAULT_SCHEDULING_CONFIG)
    idle_threshold = Decimal(str(config.get('idle_revenue_threshold', 0)))

    stores = set(store_cache.values())
    for store in stores:
        buckets = list(SchedulingTimeBucket.objects.filter(store=store, date=report_date))
        if not buckets:
            continue

        tb_revenue = sum(b.revenue for b in buckets)
        tb_labor = sum(b.labor_hours for b in buckets)
        tb_tickets = sum(b.guest_tickets for b in buckets)

        # BUG 6 fix: Check if this store has any performance-by-hour ticket data.
        has_perf_data = tb_tickets > 0

        dm, _ = SchedulingDailyMetrics.objects.get_or_create(store=store, date=report_date)

        # Get the clock-in window from daily metrics (set by attendance handler)
        # Clamp to bucket range (9-20) since we only have data for 9AM-9PM
        checkin_start = max(dm.earliest_checkin_hour, 9) if dm.earliest_checkin_hour is not None else None
        checkout_end = min(dm.latest_checkout_hour, 20) if dm.latest_checkout_hour is not None else None

        def bucket_in_window(bucket_label):
            """Check if a time bucket overlaps with the clock-in window."""
            if checkin_start is None or checkout_end is None:
                return True  # No window data, include all buckets
            b_start, b_end = BUCKET_HOUR_RANGES.get(bucket_label, (0, 24))
            # Bucket overlaps window if bucket_start < checkout_end AND bucket_end > checkin_start
            return b_start < checkout_end + 1 and b_end > checkin_start

        if has_perf_data:
            # Idle hours calculation using per-hour detail from performance-by-hour.
            # idle_hours_detail stores which specific hours are idle: {"9": true, "10": false, ...}
            # 
            # Per Emory's formula:
            #   Idle % = (count of idle clock hours in window) / (total clock hours in window) × 100
            #   Idle Hours (payroll) = labor weighted by idle fraction per bucket
            idle_hours = Decimal('0')
            labor_in_window = Decimal('0')
            # For pct_idle: count raw clock hours
            total_clock_hours_in_window = 0
            idle_clock_hours_in_window = 0

            for b in buckets:
                if not bucket_in_window(b.time_bucket):
                    continue
                if b.total_hour_count > 0 and b.labor_hours > 0:
                    detail = b.idle_hours_detail or {}
                    if detail and checkin_start is not None and checkout_end is not None:
                        # Count idle/total hours only within the clock-in window
                        idle_in_window = 0
                        total_in_window = 0
                        for hour_str, is_idle_flag in detail.items():
                            h = int(hour_str)
                            if checkin_start <= h <= checkout_end:
                                total_in_window += 1
                                if is_idle_flag:
                                    idle_in_window += 1
                        total_clock_hours_in_window += total_in_window
                        idle_clock_hours_in_window += idle_in_window
                        if total_in_window > 0:
                            idle_fraction = Decimal(str(idle_in_window)) / Decimal(str(total_in_window))
                            idle_hours += b.labor_hours * idle_fraction
                            labor_in_window += b.labor_hours
                        else:
                            labor_in_window += b.labor_hours
                    else:
                        # No detail data, fall back to aggregate counts
                        idle_fraction = Decimal(str(b.idle_hour_count)) / Decimal(str(b.total_hour_count))
                        idle_hours += b.labor_hours * idle_fraction
                        labor_in_window += b.labor_hours
                        total_clock_hours_in_window += b.total_hour_count
                        idle_clock_hours_in_window += b.idle_hour_count
                elif b.total_hour_count == 0 and b.labor_hours > 0:
                    if b.is_idle or b.guest_tickets == 0:
                        idle_hours += b.labor_hours
                    labor_in_window += b.labor_hours
                elif b.labor_hours > 0:
                    labor_in_window += b.labor_hours
        else:
            idle_hours = Decimal('0')
            labor_in_window = Decimal('0')
            total_clock_hours_in_window = 0
            idle_clock_hours_in_window = 0

        # BUG 1 fix: If attendance hasn't populated total_payroll_hours yet,
        # use time bucket labor as a fallback so SRPH/TPLH aren't stuck at 0.
        if dm.total_payroll_hours == 0 and tb_labor > 0:
            dm.total_payroll_hours = tb_labor

        # Use the best available labor hours for derived calculations.
        effective_labor = dm.total_payroll_hours if dm.total_payroll_hours > 0 else tb_labor

        # Idle % based on clock hour counts (per Emory's formula):
        # Idle % = (idle clock hours in window) / (total clock hours in window) × 100
        if total_clock_hours_in_window > 0:
            pct_idle = Decimal(str(idle_clock_hours_in_window)) / Decimal(str(total_clock_hours_in_window)) * 100
        else:
            effective_window_labor = labor_in_window if labor_in_window > 0 else effective_labor
            pct_idle = (idle_hours / effective_window_labor * 100) if effective_window_labor > 0 else Decimal('0')

        # Scheduling quality score
        idle_w = Decimal(str(config.get('idle_score_weight', 0.5)))
        ot_w = Decimal(str(config.get('overtime_score_weight', 0.3)))
        srph_w = Decimal(str(config.get('srph_score_weight', 0.2)))

        idle_score = max(Decimal('0'), Decimal('100') - pct_idle * 3)

        ot_score = Decimal('100') if not dm.has_overtime else max(
            Decimal('0'), Decimal('100') - dm.overtime_hours * 5
        )

        # BUG 4 fix: Only overwrite revenue/tickets from time buckets if they
        # have non-zero data; otherwise keep values from production/sales.
        if tb_revenue > 0:
            dm.total_revenue = tb_revenue
        if tb_tickets > 0:
            dm.total_guest_tickets = tb_tickets

        # Recalculate SRPH/TPLH using whatever revenue/tickets are on the record
        actual_rev = dm.total_revenue if dm.total_revenue > 0 else tb_revenue
        actual_tickets = dm.total_guest_tickets if dm.total_guest_tickets > 0 else tb_tickets
        srph = actual_rev / effective_labor if effective_labor > 0 else Decimal('0')
        tplh = Decimal(str(actual_tickets)) / effective_labor if effective_labor > 0 else Decimal('0')

        srph_score = min(srph, Decimal('100'))
        quality_score = idle_score * idle_w + ot_score * ot_w + srph_score * srph_w

        dm.idle_hours = idle_hours
        dm.srph = srph
        dm.tplh = tplh
        dm.pct_idle = pct_idle
        dm.scheduling_quality_score = quality_score
        dm.save()


def process_production(rows, report_date, tenant, store_cache):
    """
    Process Zenoti Production report.
    Extracts per-store revenue (Total Sale $) and guest counts into SchedulingDailyMetrics.

    The production report groups rows by store: the first row has the Center Name,
    subsequent employee rows have an empty Center Name, and a "Center Total" summary
    row follows with aggregated values. We use the "Center Total" row for accurate
    store-level totals, carrying forward the current store from the last non-empty
    Center Name.
    """
    store_totals = {}  # store_id -> {revenue, tickets, guests}
    current_store = None

    for row in rows:
        center_name = (row.get('Center Name') or '').strip()

        # Skip Grand Total / summary rows entirely
        if center_name in SKIP_VALUES:
            continue

        # Track current store from non-empty Center Name rows
        if center_name:
            resolved = _resolve_store(center_name, store_cache)
            if resolved:
                current_store = resolved

        if not current_store:
            continue

        # Use the "Center Total" summary row for accurate aggregated values
        employee = (row.get('Employee') or row.get('Employee ') or '').strip()
        if employee == 'Center Total':
            revenue = _parse_decimal(row.get('Total Sale $')) or Decimal('0')
            tickets = int(_parse_decimal(row.get('Total Ticket Count')) or 0)
            guests = int(_parse_decimal(row.get('Total Guest Count')) or 0)

            sid = current_store.id
            store_totals[sid] = {
                'store': current_store,
                'revenue': revenue,
                'tickets': tickets,
                'guests': guests,
            }

    # Fallback: if no "Center Total" rows found (different report format),
    # aggregate per-employee rows like before
    if not store_totals:
        current_store = None
        for row in rows:
            center_name = (row.get('Center Name') or '').strip()

            if center_name and center_name not in SKIP_VALUES:
                resolved = _resolve_store(center_name, store_cache)
                if resolved:
                    current_store = resolved

            if not current_store:
                continue

            employee = (row.get('Employee') or row.get('Employee ') or '').strip()
            if employee in SKIP_VALUES:
                continue

            # BUG 5 fix: fallback to 'Base Center' or 'Work Center' if Center Name is empty
            if not center_name or center_name in SKIP_VALUES:
                alt_center = (row.get('Base Center') or row.get('Work Center') or '').strip()
                if alt_center and alt_center not in SKIP_VALUES:
                    resolved = _resolve_store(alt_center, store_cache)
                    if resolved:
                        current_store = resolved

            revenue = _parse_decimal(row.get('Total Sale $')) or Decimal('0')
            tickets = int(_parse_decimal(row.get('Total Ticket Count')) or 0)
            guests = int(_parse_decimal(row.get('Total Guest Count')) or 0)

            sid = current_store.id
            if sid not in store_totals:
                store_totals[sid] = {'store': current_store, 'revenue': Decimal('0'), 'tickets': 0, 'guests': 0}
            store_totals[sid]['revenue'] += revenue
            store_totals[sid]['tickets'] += tickets
            store_totals[sid]['guests'] += guests

    # Update daily metrics with revenue
    for sid, data in store_totals.items():
        dm, _ = SchedulingDailyMetrics.objects.get_or_create(
            store=data['store'], date=report_date
        )
        dm.total_revenue = data['revenue']
        if data['tickets'] > 0:
            dm.total_guest_tickets = data['tickets']
        dm.save(update_fields=['total_revenue', 'total_guest_tickets'])

    # Recalculate derived metrics (SRPH, idle, quality score)
    _recalculate_daily_idle(report_date, tenant, store_cache)

    logger.info(f"Production: processed revenue for {len(store_totals)} stores for {tenant.name}")
    return len(store_totals)


def process_sales(rows, report_date, tenant, store_cache):
    """
    Process Zenoti Sales report.
    Extracts per-store Total Net revenue into SchedulingDailyMetrics.
    Note: 'Center Name ' has a trailing space in the report.
    Rows with Date='Total' are summary rows per center — we use those.
    """
    store_agg = {}  # store_id -> {revenue}

    for row in rows:
        # Sales report uses 'Center Name ' (trailing space)
        center_name = (row.get('Center Name ') or row.get('Center Name') or '').strip()
        if not center_name or center_name in SKIP_VALUES:
            continue

        # Use Total Net (excludes tax) as revenue
        revenue = _parse_decimal(row.get('Total Net') or row.get('Total Sales'))
        if revenue is None or revenue <= 0:
            continue

        store = _resolve_store(center_name, store_cache)
        if not store:
            continue

        sid = store.id
        if sid not in store_agg:
            store_agg[sid] = {'store': store, 'revenue': Decimal('0')}
        store_agg[sid]['revenue'] += revenue

    # Only update if we have data and production hasn't already set it
    for sid, data in store_agg.items():
        dm, _ = SchedulingDailyMetrics.objects.get_or_create(
            store=data['store'], date=report_date
        )
        # Only set revenue if production hasn't already provided it
        if dm.total_revenue == 0:
            dm.total_revenue = data['revenue']
            dm.save(update_fields=['total_revenue'])

    _recalculate_daily_idle(report_date, tenant, store_cache)

    logger.info(f"Sales: processed revenue for {len(store_agg)} stores for {tenant.name}")
    return len(store_agg)


# ===========================================
# GUEST OPT-OUTS - SMS/Email Opt-out Processing
# ===========================================

def process_guest_opt_outs(rows, report_date, tenant, store_cache):
    """
    Process guest-opt-outs report from Zenoti.

    Each row has:
      Guest Name, Guest Code, Event, Event date, Source, Updated by, Base Center, Campaign Name

    Events we care about:
      - "SMS opt out - Marketing"       → sms_opt_in = False
      - "SMS opt out - Transactional"   → sms_opt_in = False
      - "SMS opt in - Marketing"        → sms_opt_in = True  (re-opt-in)
      - "Email opt out - Marketing"     → logged but no action (we only track SMS)

    Any event containing "SMS opt out" sets sms_opt_in=False.
    Any event containing "SMS opt in" (re-subscribe) sets sms_opt_in=True.
    """
    opted_out = 0
    opted_in = 0
    not_found = 0

    for row in rows:
        guest_code = str(row.get('Guest Code') or '').strip()
        event = (row.get('Event') or '').strip().lower()

        if not guest_code:
            continue

        # Determine action from event string
        is_sms_opt_out = 'sms opt out' in event
        is_sms_opt_in = 'sms opt in' in event

        if not is_sms_opt_out and not is_sms_opt_in:
            continue  # Email opt-outs or unrecognized events — skip

        try:
            customer = ExponentialCustomer.objects.get(tenant=tenant, guest_code=guest_code)
        except ExponentialCustomer.DoesNotExist:
            not_found += 1
            continue

        if is_sms_opt_out and customer.sms_opt_in:
            customer.sms_opt_in = False
            customer.save(update_fields=['sms_opt_in'])
            opted_out += 1
        elif is_sms_opt_in and not customer.sms_opt_in:
            customer.sms_opt_in = True
            customer.save(update_fields=['sms_opt_in'])
            opted_in += 1

    logger.info(
        f"Guest Opt-outs: {opted_out} opted out, {opted_in} re-opted in, "
        f"{not_found} not found for {tenant.name}"
    )
    return opted_out + opted_in


# ===========================================
# MANAGE-GUESTS - Phone Number Enrichment
# Matches guest_code + center → updates phone on existing customers
# ===========================================

def process_manage_guests(rows, report_date, tenant, store_cache):
    """
    Bulk-update phone numbers on existing customers.
    Match on: guest_code + store (Center).  Update: phone.
    """
    # Phase 1: Parse rows → (guest_code, store_id) → phone
    update_map = {}  # (guest_code, store_id) → phone
    skipped = 0

    for row in rows:
        guest_code = str(row.get('Code') or '').strip()
        center = str(row.get('Center') or '').strip()
        phone_raw = str(row.get('Phone No.') or row.get('Phone No') or '').strip()

        if not guest_code or not phone_raw:
            skipped += 1
            continue

        # Normalize phone → E.164
        digits = ''.join(c for c in phone_raw if c.isdigit())
        if len(digits) == 10:
            phone = '+1' + digits
        elif len(digits) == 11 and digits.startswith('1'):
            phone = '+' + digits
        else:
            skipped += 1
            continue

        # Resolve center → store
        store = _resolve_store(center, store_cache) if center else None
        store_id = store.id if store else None

        update_map[(guest_code, store_id)] = phone

    if not update_map:
        logger.info(f"Manage-Guests: 0 phones updated, {skipped} skipped for {tenant.name}")
        return 0

    # Phase 2: Bulk-fetch matching customers
    guest_codes = list({gc for gc, _ in update_map.keys()})
    customers = ExponentialCustomer.objects.filter(
        tenant=tenant,
        guest_code__in=guest_codes,
    ).select_related('store').only('id', 'guest_code', 'phone', 'store_id')

    # Index by (guest_code, store_id) — collect ALL duplicates
    from collections import defaultdict
    customer_idx = defaultdict(list)
    for c in customers:
        customer_idx[(c.guest_code, c.store_id)].append(c)

    # Phase 3: Collect updates (update every matching row)
    to_update = []
    for (guest_code, store_id), new_phone in update_map.items():
        for customer in customer_idx.get((guest_code, store_id), []):
            if customer.phone != new_phone:
                customer.phone = new_phone
                to_update.append(customer)

    # Phase 4: Bulk update
    updated = 0
    if to_update:
        BATCH = 500
        for i in range(0, len(to_update), BATCH):
            batch = to_update[i:i + BATCH]
            ExponentialCustomer.objects.bulk_update(batch, ['phone'], batch_size=BATCH)
            updated += len(batch)

    logger.info(
        f"Manage-Guests: {updated} phones updated (matched={sum(len(v) for v in customer_idx.values())}), "
        f"{skipped} skipped, {len(update_map)} total codes for {tenant.name}"
    )
    return updated


# ===========================================
# DISPATCHER - Called from IngestRawReportView
# ===========================================

REPORT_HANDLERS = {
    # Standardized keys (canonical)
    'business-kpi': process_business_kpi,
    'sales-accrual': process_sales_accrual_guests,
    'sms-opt-in': process_sms_opt_in,
    'guest-opt-outs': process_guest_opt_outs,
    'attendance': process_attendance,
    'performance-by-hour': process_performance_by_hour,
    'appointments': process_appointments,
    'statutory-pay': process_statutory_pay,
    'production': process_production,
    'sales': process_sales,
    # Zenoti report type aliases (actual keys sent by Zenoti integration)
    'attendence': process_attendance,              # Zenoti typo
    'Performance_File': process_performance_by_hour,
    'performance_file': process_performance_by_hour,
    'Statutorypay_report': process_statutory_pay,
    'statutorypay_report': process_statutory_pay,
    'statutory_pay': process_statutory_pay,
    'business': process_business_kpi,
    'guest_opt_outs': process_guest_opt_outs,      # underscore alias
    'manage-guests': process_manage_guests,
    'manage_guests': process_manage_guests,        # underscore alias
}


def handle_report_ingestion(report_type, rows, report_date, tenant, store_cache):
    """
    Dispatch to the appropriate handler based on report type.
    Tries exact match first, then case-insensitive fallback.
    Returns number of records processed, or None if no handler exists.
    """
    handler = REPORT_HANDLERS.get(report_type)
    if not handler:
        # Case-insensitive fallback
        rt_lower = report_type.lower() if report_type else ''
        handler = REPORT_HANDLERS.get(rt_lower)
    if handler:
        return handler(rows, report_date, tenant, store_cache)
    return None
