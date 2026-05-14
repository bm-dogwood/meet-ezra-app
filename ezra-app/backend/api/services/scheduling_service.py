"""
Ezra Scheduling Service - Real data from SchedulingTimeBucket & SchedulingDailyMetrics.
Queries the database for labor optimization metrics.
"""
import logging
from datetime import date, timedelta, datetime
from decimal import Decimal

from django.db.models import Sum, Avg, Max, Min, Count, Q, F, Case, When, Value, IntegerField
from django.db.models.functions import Coalesce

from api.models import (
    Store, SchedulingTimeBucket, SchedulingDailyMetrics,
    SchedulingRecommendation, ReportMetric,
)
from api.constants import DEFAULT_SCHEDULING_CONFIG

logger = logging.getLogger(__name__)

TIME_BUCKETS = ['9AM-12PM', '12PM-2PM', '2PM-5PM', '5PM-9PM']
WINDOW_LABELS = {
    '9AM-12PM': 'Morning (9AM-12PM)',
    '12PM-2PM': 'Midday (12PM-2PM)',
    '2PM-5PM': 'Afternoon (2PM-5PM)',
    '5PM-9PM': 'Evening (5PM-9PM)',
}


def _d(val):
    """Convert Decimal/None to float."""
    if val is None:
        return 0.0
    return float(val)


def _parse_date(val):
    if not val:
        return None
    if isinstance(val, date):
        return val
    try:
        return datetime.strptime(val, '%Y-%m-%d').date()
    except (ValueError, TypeError):
        return None


class SchedulingService:
    """Service for querying real scheduling data."""

    def __init__(self, tenant=None, config=None):
        self.tenant = tenant
        self.config = config or DEFAULT_SCHEDULING_CONFIG

    def _store_qs(self):
        """Base store queryset filtered by tenant."""
        qs = Store.objects.filter(status='active')
        if self.tenant:
            qs = qs.filter(tenant=self.tenant)
        return qs

    def _date_range(self, start_date=None, end_date=None):
        """Parse and return (start, end) date tuple."""
        end = _parse_date(end_date) or date.today()
        start = _parse_date(start_date) or (end - timedelta(days=29))
        return start, end

    # =========================================================
    # OVERVIEW
    # =========================================================
    def get_overview_metrics(self, stores=None, start_date=None, end_date=None):
        start, end = self._date_range(start_date, end_date)
        store_ids = list(self._store_qs().values_list('id', flat=True))
        if not store_ids:
            return self._empty_overview()

        # Aggregate daily metrics
        dm_qs = SchedulingDailyMetrics.objects.filter(
            store_id__in=store_ids, date__gte=start, date__lte=end,
        )
        agg = dm_qs.aggregate(
            total_revenue=Coalesce(Sum('total_revenue'), Decimal('0')),
            total_payroll_hours=Coalesce(Sum('total_payroll_hours'), Decimal('0')),
            total_idle_hours=Coalesce(Sum('idle_hours'), Decimal('0')),
            total_overtime_hours=Coalesce(Sum('overtime_hours'), Decimal('0')),
            total_guest_tickets=Coalesce(Sum('total_guest_tickets'), Value(0)),
            avg_payroll_rate=Coalesce(Avg('avg_payroll_rate'), Decimal('0')),
            overtime_stores=Count('id', filter=Q(has_overtime=True)),
        )

        total_rev = _d(agg['total_revenue'])
        total_hrs = _d(agg['total_payroll_hours'])
        total_idle = _d(agg['total_idle_hours'])
        pct_idle = round((total_idle / total_hrs * 100), 1) if total_hrs > 0 else 0
        avg_rate = _d(agg['avg_payroll_rate'])
        labor_cost = round(total_hrs * avg_rate, 2)
        srph = round(total_rev / total_hrs, 2) if total_hrs > 0 else 0
        tplh = round(agg['total_guest_tickets'] / total_hrs, 2) if total_hrs > 0 else 0

        # Revenue trend (daily)
        rev_trend = list(
            dm_qs.values('date')
            .annotate(revenue=Sum('total_revenue'))
            .order_by('date')
        )
        revenue_trend = [
            {'date': r['date'].isoformat(), 'revenue': _d(r['revenue'])}
            for r in rev_trend
        ]

        # Idle by location (top 10 by idle percentage)
        idle_by_loc = list(
            dm_qs.values('store__name')
            .annotate(
                total_idle=Sum('idle_hours'),
                total_hrs=Sum('total_payroll_hours'),
            )
            .filter(total_payroll_hours__gt=0)
            .order_by('-total_idle')
        )
        idle_by_location = []
        for row in idle_by_loc:
            hrs = _d(row['total_hrs'])
            idle = _d(row['total_idle'])
            pct = round(idle / hrs * 100, 1) if hrs > 0 else 0
            name = row['store__name'] or 'Unknown'
            idle_by_location.append({'name': name, 'idlePercent': pct})
        # Sort by idle percentage descending, take top 10
        idle_by_location.sort(key=lambda x: x['idlePercent'], reverse=True)
        idle_by_location = idle_by_location[:10]

        # Location summaries (for the table)
        location_summaries = self._build_location_summaries(store_ids, start, end)

        return {
            'totalRevenue': total_rev,
            'totalLaborHours': round(total_hrs, 1),
            'totalIdleHours': round(total_idle, 1),
            'idlePercent': pct_idle,
            'avgTSTH': srph,
            'overtimeAlerts': agg['overtime_stores'],
            'totalLaborCost': labor_cost,
            'avgPayrollRate': round(avg_rate, 2),
            'totalGuestTickets': agg['total_guest_tickets'],
            'storesCount': len(store_ids),
            'lastSync': date.today().isoformat(),
            'revenueTrend': revenue_trend,
            'idleByLocation': idle_by_location,
            'locationSummaries': location_summaries,
        }

    def _empty_overview(self):
        return {
            'totalRevenue': 0, 'totalLaborHours': 0, 'totalIdleHours': 0,
            'idlePercent': 0, 'avgTSTH': 0, 'overtimeAlerts': 0,
            'totalLaborCost': 0, 'avgPayrollRate': 0, 'totalGuestTickets': 0,
            'storesCount': 0, 'lastSync': date.today().isoformat(),
            'revenueTrend': [], 'idleByLocation': [], 'locationSummaries': [],
        }

    def _build_location_summaries(self, store_ids, start, end):
        """Build per-store summary rows for the overview table."""
        dm_qs = SchedulingDailyMetrics.objects.filter(
            store_id__in=store_ids, date__gte=start, date__lte=end,
        )
        store_aggs = list(
            dm_qs.values('store_id', 'store__name', 'store__external_code', 'store__state', 'store__last_synced_at')
            .annotate(
                revenue=Coalesce(Sum('total_revenue'), Decimal('0')),
                labor_hours=Coalesce(Sum('total_payroll_hours'), Decimal('0')),
                idle_hours=Coalesce(Sum('idle_hours'), Decimal('0')),
                overtime_hours=Coalesce(Sum('overtime_hours'), Decimal('0')),
                guest_tickets=Coalesce(Sum('total_guest_tickets'), Value(0)),
                avg_rate=Coalesce(Avg('avg_payroll_rate'), Decimal('0')),
                has_ot=Count('id', filter=Q(has_overtime=True)),
            )
            .order_by('-idle_hours')
        )

        summaries = []
        for row in store_aggs:
            hrs = _d(row['labor_hours'])
            idle = _d(row['idle_hours'])
            rev = _d(row['revenue'])
            pct_idle = round(idle / hrs * 100, 1) if hrs > 0 else 0
            tsth = round(rev / hrs, 2) if hrs > 0 else 0
            tplh = round(row['guest_tickets'] / hrs, 2) if hrs > 0 else 0
            rate = _d(row['avg_rate'])
            labor_cost = round(hrs * rate, 2)
            ot = _d(row['overtime_hours'])
            last_sync = row['store__last_synced_at']

            # Compute peak/slowest window from time buckets
            peak_window = ''
            slowest_window = ''
            tb_aggs = list(
                SchedulingTimeBucket.objects.filter(
                    store_id=row['store_id'], date__gte=start, date__lte=end,
                ).values('time_bucket').annotate(
                    total_tickets=Coalesce(Sum('guest_tickets'), Value(0)),
                ).order_by('-total_tickets')
            )
            if tb_aggs:
                peak_window = WINDOW_LABELS.get(tb_aggs[0]['time_bucket'], tb_aggs[0]['time_bucket'])
                # Slowest = last in the list (fewest tickets)
                slowest_window = WINDOW_LABELS.get(tb_aggs[-1]['time_bucket'], tb_aggs[-1]['time_bucket'])

            summaries.append({
                'locationId': str(row['store_id']),
                'storeCode': row['store__external_code'] or '',
                'locationName': row['store__name'] or '',
                'state': row['store__state'] or '',
                'revenue': rev,
                'laborHours': round(hrs, 1),
                'laborCost': labor_cost,
                'idleHours': round(idle, 1),
                'idlePercent': pct_idle,
                'tsth': tsth,
                'ticketsPerLaborHour': tplh,
                'overtimeHours': round(ot, 1),
                'hasOvertimeFlag': row['has_ot'] > 0,
                'lastSyncAt': last_sync.isoformat() if last_sync else date.today().isoformat(),
                'peakWindow': peak_window,
                'slowestWindow': slowest_window,
            })

        # Sort by idle % descending
        summaries.sort(key=lambda x: x['idlePercent'], reverse=True)
        return summaries

    # =========================================================
    # STORE RANKINGS
    # =========================================================
    def get_store_rankings(self, tenant=None, start_date=None, end_date=None):
        """Return stores ranked by % idle hours."""
        t = tenant or self.tenant
        store_qs = Store.objects.filter(status='active')
        if t:
            store_qs = store_qs.filter(tenant=t)
        store_ids = list(store_qs.values_list('id', flat=True))
        if not store_ids:
            return []

        start, end = self._date_range(start_date, end_date)
        summaries = self._build_location_summaries(store_ids, start, end)
        return summaries

    # =========================================================
    # STORE DRILLDOWN
    # =========================================================
    def get_store_drilldown(self, store_id, start_date=None, end_date=None):
        """Detailed time-bucket data for a specific store."""
        try:
            store = Store.objects.get(id=store_id)
        except Store.DoesNotExist:
            return None

        start, end = self._date_range(start_date, end_date)

        # --- Summary KPIs ---
        dm_qs = SchedulingDailyMetrics.objects.filter(store=store, date__gte=start, date__lte=end)
        agg = dm_qs.aggregate(
            revenue=Coalesce(Sum('total_revenue'), Decimal('0')),
            payroll_hours=Coalesce(Sum('total_payroll_hours'), Decimal('0')),
            idle_hours=Coalesce(Sum('idle_hours'), Decimal('0')),
            overtime_hours=Coalesce(Sum('overtime_hours'), Decimal('0')),
            guest_tickets=Coalesce(Sum('total_guest_tickets'), Value(0)),
            avg_rate=Coalesce(Avg('avg_payroll_rate'), Decimal('0')),
            has_ot=Count('id', filter=Q(has_overtime=True)),
        )

        rev = _d(agg['revenue'])
        hrs = _d(agg['payroll_hours'])
        idle = _d(agg['idle_hours'])
        ot = _d(agg['overtime_hours'])
        rate = _d(agg['avg_rate'])
        pct_idle = round(idle / hrs * 100, 1) if hrs > 0 else 0
        tsth = round(rev / hrs, 2) if hrs > 0 else 0
        tplh = round(agg['guest_tickets'] / hrs, 2) if hrs > 0 else 0
        labor_cost = round(hrs * rate, 2)

        summary = {
            'revenue': rev,
            'laborHours': round(hrs, 1),
            'idleHours': round(idle, 1),
            'idlePercent': pct_idle,
            'tsth': tsth,
            'ticketsPerLaborHour': tplh,
            'hasOvertimeFlag': agg['has_ot'] > 0,
            'overtimeHours': round(ot, 1),
            'laborCost': labor_cost,
        }

        # --- Time Window Insights ---
        tb_qs = SchedulingTimeBucket.objects.filter(store=store, date__gte=start, date__lte=end)
        time_window_insights = self._build_time_window_insights(tb_qs, dm_qs)

        # --- Hourly Trend (from time buckets + daily revenue) ---
        hourly_trend = self._build_hourly_trend(tb_qs, dm_qs)

        # --- Daily Breakdown ---
        daily_breakdown = self._build_daily_breakdown(dm_qs)

        # --- Heatmap (last 7 days) ---
        heatmap_start = end - timedelta(days=6)
        heatmap = self._build_heatmap(store, heatmap_start, end)

        # --- Recommendations ---
        recommendations = self._generate_recommendations(
            store.name, time_window_insights, summary
        )

        return {
            'locationId': str(store.id),
            'locationName': store.name,
            'storeCode': store.external_code or '',
            'summary': summary,
            'timeWindowInsights': time_window_insights,
            'hourlyTrend': hourly_trend,
            'dailyBreakdown': daily_breakdown,
            'heatmap': heatmap,
            'recommendations': recommendations,
        }

    def _build_time_window_insights(self, tb_qs, dm_qs=None):
        """Aggregate time bucket data into 4 time window insight cards.
        
        Uses clock-in window from SchedulingDailyMetrics to only count idle
        hours within the actual attendance window.
        """
        # Build a set of (date, bucket) pairs that are within the clock-in window
        # for each date, based on earliest_checkin_hour and latest_checkout_hour.
        BUCKET_HOUR_RANGES = {
            '9AM-12PM': (9, 12),
            '12PM-2PM': (12, 14),
            '2PM-5PM': (14, 17),
            '5PM-9PM': (17, 21),
        }

        # Get clock-in windows per date from daily metrics
        # Clamp to bucket range (9-20) since we only have data for 9AM-9PM
        checkin_windows = {}  # date -> (earliest, latest)
        if dm_qs is not None:
            for dm in dm_qs:
                if dm.earliest_checkin_hour is not None and dm.latest_checkout_hour is not None:
                    checkin_windows[dm.date] = (max(dm.earliest_checkin_hour, 9), min(dm.latest_checkout_hour, 20))

        def bucket_in_window(bucket_label, bucket_date):
            """Check if a time bucket overlaps with the clock-in window for that date."""
            if bucket_date not in checkin_windows:
                return True  # No window data, include all
            checkin_start, checkout_end = checkin_windows[bucket_date]
            b_start, b_end = BUCKET_HOUR_RANGES.get(bucket_label, (0, 24))
            return b_start < checkout_end + 1 and b_end > checkin_start

        insights = []
        for bucket_label in TIME_BUCKETS:
            bucket_rows = tb_qs.filter(time_bucket=bucket_label)
            agg = bucket_rows.aggregate(
                total_tickets=Coalesce(Sum('guest_tickets'), Value(0)),
                total_labor=Coalesce(Sum('labor_hours'), Decimal('0')),
                total_revenue=Coalesce(Sum('revenue'), Decimal('0')),
                idle_count=Count('id', filter=Q(is_idle=True)),
                total_count=Count('id'),
            )
            tickets = agg['total_tickets']
            labor = _d(agg['total_labor'])
            rev = _d(agg['total_revenue'])
            num_days = bucket_rows.values('date').distinct().count() or 1

            avg_tickets = round(tickets / num_days, 1)
            avg_revenue = round(rev / num_days, 2)
            avg_labor = round(labor / num_days, 1)
            tplh_val = round(tickets / labor, 2) if labor > 0 else 0

            # Only count idle hours from buckets that have performance-by-hour
            # data AND are within the clock-in window for that date.
            all_dates_with_perf = set(
                tb_qs.filter(guest_tickets__gt=0)
                .values_list('date', flat=True)
                .distinct()
            )

            # Filter idle labor to only include dates with perf data AND
            # where this bucket is within the clock-in window.
            # Use per-hour idle counts for accurate idle calculation.
            idle_labor = Decimal('0')
            labor_with_perf = Decimal('0')
            for row in bucket_rows.filter(date__in=all_dates_with_perf):
                if bucket_in_window(bucket_label, row.date):
                    labor_with_perf += row.labor_hours
                    if row.total_hour_count > 0 and row.labor_hours > 0:
                        detail = row.idle_hours_detail or {}
                        window = checkin_windows.get(row.date)
                        if detail and window:
                            ci_start, co_end = window
                            idle_in_w = sum(1 for h, idle in detail.items() if idle and ci_start <= int(h) <= co_end)
                            total_in_w = sum(1 for h in detail if ci_start <= int(h) <= co_end)
                            if total_in_w > 0:
                                idle_fraction = Decimal(str(idle_in_w)) / Decimal(str(total_in_w))
                            else:
                                idle_fraction = Decimal('0')
                        else:
                            idle_fraction = Decimal(str(row.idle_hour_count)) / Decimal(str(row.total_hour_count))
                        idle_labor += row.labor_hours * idle_fraction
                    elif row.is_idle:
                        idle_labor += row.labor_hours

            idle_labor = _d(idle_labor)
            labor_with_perf = _d(labor_with_perf)
            idle_pct = round(idle_labor / labor_with_perf * 100, 1) if labor_with_perf > 0 else 0

            insights.append({
                'window': WINDOW_LABELS.get(bucket_label, bucket_label),
                'avgTickets': avg_tickets,
                'avgRevenue': avg_revenue,
                'avgLaborHours': avg_labor,
                'tplh': tplh_val,
                'idleHours': round(idle_labor / num_days, 1),
                'idlePercent': idle_pct,
            })
        return insights

    def _build_hourly_trend(self, tb_qs, dm_qs=None):
        """Build hourly chart data from time buckets.

        Revenue is estimated proportionally from daily totals since TimeBuckets
        don't carry revenue data (performance-by-hour only has guest counts).
        Idle payroll hours are only counted within the clock-in window.
        """
        # Map time buckets to representative hours for the chart
        bucket_hours = {
            '9AM-12PM': [{'hour': 9, 'label': '9AM'}, {'hour': 10, 'label': '10AM'}, {'hour': 11, 'label': '11AM'}],
            '12PM-2PM': [{'hour': 12, 'label': '12PM'}, {'hour': 13, 'label': '1PM'}],
            '2PM-5PM': [{'hour': 14, 'label': '2PM'}, {'hour': 15, 'label': '3PM'}, {'hour': 16, 'label': '4PM'}],
            '5PM-9PM': [{'hour': 17, 'label': '5PM'}, {'hour': 18, 'label': '6PM'}, {'hour': 19, 'label': '7PM'}, {'hour': 20, 'label': '8PM'}],
        }

        BUCKET_HOUR_RANGES = {
            '9AM-12PM': (9, 12),
            '12PM-2PM': (12, 14),
            '2PM-5PM': (14, 17),
            '5PM-9PM': (17, 21),
        }

        # Get daily revenue/tickets and clock-in windows from SchedulingDailyMetrics
        daily_totals = {}  # date -> {revenue, tickets}
        checkin_windows = {}  # date -> (earliest, latest)
        if dm_qs is not None:
            for dm in dm_qs:
                daily_totals[dm.date] = {
                    'revenue': _d(dm.total_revenue),
                    'tickets': dm.total_guest_tickets or 0,
                }
                if dm.earliest_checkin_hour is not None and dm.latest_checkout_hour is not None:
                    # Clamp to bucket range (9-20) since we only have data for 9AM-9PM
                    checkin_windows[dm.date] = (max(dm.earliest_checkin_hour, 9), min(dm.latest_checkout_hour, 20))

        def bucket_in_window(bucket_label, bucket_date):
            if bucket_date not in checkin_windows:
                return True
            checkin_start, checkout_end = checkin_windows[bucket_date]
            b_start, b_end = BUCKET_HOUR_RANGES.get(bucket_label, (0, 24))
            return b_start < checkout_end + 1 and b_end > checkin_start

        # First pass: collect per-bucket ticket totals per day for proportional split
        bucket_day_tickets = {}  # (bucket, date) -> tickets
        for tb in tb_qs:
            key = (tb.time_bucket, tb.date)
            bucket_day_tickets[key] = bucket_day_tickets.get(key, 0) + tb.guest_tickets

        trend = []
        for bucket_label in TIME_BUCKETS:
            rows = tb_qs.filter(time_bucket=bucket_label)
            agg = rows.aggregate(
                total_tickets=Coalesce(Sum('guest_tickets'), Value(0)),
                total_labor=Coalesce(Sum('labor_hours'), Decimal('0')),
            )
            num_days = rows.values('date').distinct().count() or 1
            hours_in_bucket = bucket_hours.get(bucket_label, [])
            n_hours = len(hours_in_bucket) or 1

            avg_tickets_per_hour = round(agg['total_tickets'] / num_days / n_hours, 1)
            avg_labor_per_hour = round(_d(agg['total_labor']) / num_days / n_hours, 1)

            # Idle payroll hours: use per-hour idle detail within the clock-in window
            idle_labor_total = Decimal('0')
            for row in rows:
                if bucket_in_window(bucket_label, row.date):
                    if row.total_hour_count > 0 and row.labor_hours > 0:
                        detail = row.idle_hours_detail or {}
                        window = checkin_windows.get(row.date)
                        if detail and window:
                            ci_start, co_end = window
                            idle_in_w = sum(1 for h, idle in detail.items() if idle and ci_start <= int(h) <= co_end)
                            total_in_w = sum(1 for h in detail if ci_start <= int(h) <= co_end)
                            idle_fraction = Decimal(str(idle_in_w)) / Decimal(str(total_in_w)) if total_in_w > 0 else Decimal('0')
                        else:
                            idle_fraction = Decimal(str(row.idle_hour_count)) / Decimal(str(row.total_hour_count))
                        idle_labor_total += row.labor_hours * idle_fraction
                    elif row.is_idle and row.labor_hours > 0:
                        idle_labor_total += row.labor_hours
            idle_per_hour = round(_d(idle_labor_total) / num_days / n_hours, 1)

            # Estimate revenue per hour
            estimated_revenue = Decimal('0')
            dates_in_bucket = rows.values_list('date', flat=True).distinct()
            for d in dates_in_bucket:
                day_info = daily_totals.get(d, {})
                day_rev = day_info.get('revenue', 0)
                day_tickets = day_info.get('tickets', 0)
                bucket_tickets = bucket_day_tickets.get((bucket_label, d), 0)
                if day_tickets > 0 and bucket_tickets > 0:
                    estimated_revenue += Decimal(str(day_rev)) * bucket_tickets / day_tickets

            avg_rev_per_hour = round(_d(estimated_revenue) / num_days / n_hours, 2)

            for h in hours_in_bucket:
                trend.append({
                    'hour': h['hour'],
                    'label': h['label'],
                    'avgTickets': avg_tickets_per_hour,
                    'avgRevenue': avg_rev_per_hour,
                    'avgLaborHours': avg_labor_per_hour,
                    'idlePayrollHours': idle_per_hour,
                })
        return trend

    def _build_daily_breakdown(self, dm_qs):
        """Build daily breakdown table from SchedulingDailyMetrics.
        
        Uses clock-in window to constrain idle hours per day.
        """
        BUCKET_HOUR_RANGES = {
            '9AM-12PM': (9, 12),
            '12PM-2PM': (12, 14),
            '2PM-5PM': (14, 17),
            '5PM-9PM': (17, 21),
        }

        days = dm_qs.order_by('-date')[:14]
        breakdown = []
        for dm in days:
            hrs = _d(dm.total_payroll_hours)
            rev = _d(dm.total_revenue)
            tsth = round(rev / hrs, 2) if hrs > 0 else 0

            # Recalculate idle from time buckets using clock-in window
            day_buckets = list(
                SchedulingTimeBucket.objects.filter(store=dm.store, date=dm.date)
            )
            has_perf_data = any(b.guest_tickets > 0 for b in day_buckets)

            if has_perf_data and dm.earliest_checkin_hour is not None and dm.latest_checkout_hour is not None:
                # Clamp to bucket range (9-20) since we only have data for 9AM-9PM
                checkin_start = max(dm.earliest_checkin_hour, 9)
                checkout_end = min(dm.latest_checkout_hour, 20)
                idle = Decimal('0')
                labor_in_window = Decimal('0')
                total_clock_in_w = 0
                idle_clock_in_w = 0
                for b in day_buckets:
                    b_start, b_end = BUCKET_HOUR_RANGES.get(b.time_bucket, (0, 24))
                    if b_start < checkout_end + 1 and b_end > checkin_start:
                        labor_in_window += b.labor_hours
                        if b.total_hour_count > 0 and b.labor_hours > 0:
                            detail = b.idle_hours_detail or {}
                            if detail:
                                idle_in_w = sum(1 for h, idle_flag in detail.items() if idle_flag and checkin_start <= int(h) <= checkout_end)
                                total_in_w = sum(1 for h in detail if checkin_start <= int(h) <= checkout_end)
                                total_clock_in_w += total_in_w
                                idle_clock_in_w += idle_in_w
                                idle_fraction = Decimal(str(idle_in_w)) / Decimal(str(total_in_w)) if total_in_w > 0 else Decimal('0')
                            else:
                                idle_fraction = Decimal(str(b.idle_hour_count)) / Decimal(str(b.total_hour_count))
                                total_clock_in_w += b.total_hour_count
                                idle_clock_in_w += b.idle_hour_count
                            idle += b.labor_hours * idle_fraction
                        elif b.is_idle or (b.guest_tickets == 0 and b.labor_hours > 0):
                            idle += b.labor_hours
                idle = _d(idle)
                # Idle % uses clock hour counts per Emory's formula
                if total_clock_in_w > 0:
                    pct = round(idle_clock_in_w / total_clock_in_w * 100, 1)
                else:
                    labor_in_window = _d(labor_in_window)
                    pct = round(idle / labor_in_window * 100, 1) if labor_in_window > 0 else 0
            else:
                idle = _d(dm.idle_hours)
                pct = round(idle / hrs * 100, 1) if hrs > 0 else 0

            # Determine peak/slowest hour from time buckets for this day
            peak_hour = 0
            slowest_hour = 0
            tb_aggs = list(
                SchedulingTimeBucket.objects.filter(
                    store=dm.store, date=dm.date,
                ).values('time_bucket').annotate(
                    total_tickets=Coalesce(Sum('guest_tickets'), Value(0)),
                ).order_by('-total_tickets')
            )
            bucket_to_hour = {'9AM-12PM': 10, '12PM-2PM': 13, '2PM-5PM': 15, '5PM-9PM': 18}
            if tb_aggs:
                peak_hour = bucket_to_hour.get(tb_aggs[0]['time_bucket'], 0)
                slowest_hour = bucket_to_hour.get(tb_aggs[-1]['time_bucket'], 0)

            breakdown.append({
                'date': dm.date.isoformat(),
                'dayOfWeek': dm.date.strftime('%A'),
                'revenue': rev,
                'guestTickets': dm.total_guest_tickets,
                'laborHours': round(hrs, 1),
                'laborCost': round(hrs * _d(dm.avg_payroll_rate), 2),
                'idleHours': round(idle, 1),
                'idlePercent': pct,
                'tsth': tsth,
                'ticketsPerLaborHour': round(dm.total_guest_tickets / hrs, 2) if hrs > 0 else 0,
                'overtimeHours': round(_d(dm.overtime_hours), 1),
                'peakHour': peak_hour,
                'slowestHour': slowest_hour,
            })
        return breakdown

    def _build_heatmap(self, store, start, end):
        """Build 7-day heatmap of guest tickets by time bucket.
        
        Falls back to distributing daily guest tickets from SchedulingDailyMetrics
        proportionally across time buckets when per-bucket data is unavailable.
        """
        # Get historical average distribution across buckets for this store
        # to use as fallback when per-bucket data is missing for a day
        historical_dist = {}
        hist_buckets = (
            SchedulingTimeBucket.objects.filter(store=store, guest_tickets__gt=0)
            .values('time_bucket')
            .annotate(total=Sum('guest_tickets'))
        )
        hist_total = sum(h['total'] for h in hist_buckets) or 1
        for h in hist_buckets:
            historical_dist[h['time_bucket']] = h['total'] / hist_total
        # Default even distribution if no history
        if not historical_dist:
            for b in TIME_BUCKETS:
                historical_dist[b] = 0.25

        heatmap = []
        current = start
        while current <= end:
            day_buckets = SchedulingTimeBucket.objects.filter(
                store=store, date=current,
            )
            row = {
                'day': current.strftime('%a'),
                '9AM-12PM': 0, '12PM-2PM': 0, '2PM-5PM': 0, '5PM-9PM': 0,
            }
            for tb in day_buckets:
                if tb.time_bucket in row:
                    row[tb.time_bucket] += tb.guest_tickets

            # Fall back to distributing daily guest tickets ONLY when there
            # is no performance-by-hour data for this day. If perf-by-hour
            # data exists (total_hour_count > 0) but shows 0 guests, that's
            # legitimate — the store truly had no guest traffic those hours.
            has_perf_data = any(tb.total_hour_count > 0 for tb in day_buckets)
            if not has_perf_data:
                dm = SchedulingDailyMetrics.objects.filter(
                    store=store, date=current
                ).first()
                daily_total = dm.total_guest_tickets if dm else 0
                if daily_total > 0:
                    for b in TIME_BUCKETS:
                        pct = historical_dist.get(b, 0.25)
                        row[b] = round(daily_total * pct)

            heatmap.append(row)
            current += timedelta(days=1)
        return heatmap

    def _generate_recommendations(self, store_name, time_windows, summary):
        """Generate observations highlighting extreme values only — no suggestions."""
        recs = []
        rec_id = 0

        if not time_windows:
            return recs

        # Highest idle window
        idle_windows = sorted(time_windows, key=lambda x: x['idlePercent'], reverse=True)
        if idle_windows and idle_windows[0]['idlePercent'] > 10:
            worst = idle_windows[0]
            rec_id += 1
            recs.append({
                'id': str(rec_id),
                'type': 'reduce_coverage',
                'priority': 'high' if worst['idlePercent'] > 25 else 'medium',
                'title': f"Highest idle: {worst['window']}",
                'description': (
                    f"{worst['idlePercent']:.1f}% idle time during {worst['window']} "
                    f"({worst['idleHours']:.1f} idle hours)."
                ),
                'metric': f"{worst['idlePercent']:.1f}% idle",
                'impact': '',
            })

        # Highest TPLH window
        tplh_windows = sorted(time_windows, key=lambda x: x['tplh'], reverse=True)
        if tplh_windows and tplh_windows[0]['tplh'] > 0:
            best = tplh_windows[0]
            rec_id += 1
            recs.append({
                'id': str(rec_id),
                'type': 'add_coverage',
                'priority': 'medium',
                'title': f"Peak demand: {best['window']}",
                'description': (
                    f"{best['tplh']:.1f} tickets per labor hour during {best['window']}."
                ),
                'metric': f"{best['tplh']:.1f} TPLH",
                'impact': '',
            })

        # Lowest TPLH window
        if len(tplh_windows) > 1:
            lowest = tplh_windows[-1]
            if lowest['tplh'] < 1.0 and lowest.get('avgLaborHours', 0) > 0:
                rec_id += 1
                recs.append({
                    'id': str(rec_id),
                    'type': 'shift_hours',
                    'priority': 'low',
                    'title': f"Lowest demand: {lowest['window']}",
                    'description': (
                        f"{lowest['tplh']:.1f} tickets per labor hour during {lowest['window']}."
                    ),
                    'metric': f"{lowest['tplh']:.1f} TPLH",
                    'impact': '',
                })

        # Overtime flag
        if summary.get('hasOvertimeFlag'):
            ot = summary.get('overtimeHours', 0)
            rec_id += 1
            recs.append({
                'id': str(rec_id),
                'type': 'overtime_alert',
                'priority': 'high',
                'title': f"Overtime: {ot:.1f} hours",
                'description': (
                    f"{ot:.1f} overtime hours recorded in this period."
                ),
                'metric': f"{ot:.1f}h OT",
                'impact': '',
            })

        # Busiest window by ticket volume
        ticket_windows = sorted(time_windows, key=lambda x: x['avgTickets'], reverse=True)
        if ticket_windows and ticket_windows[0]['avgTickets'] > 0:
            busiest = ticket_windows[0]
            rec_id += 1
            recs.append({
                'id': str(rec_id),
                'type': 'efficiency',
                'priority': 'low',
                'title': f"Busiest window: {busiest['window']}",
                'description': (
                    f"Averaging {busiest['avgTickets']:.1f} tickets per day during {busiest['window']}."
                ),
                'metric': f"{busiest['avgTickets']:.1f} avg tickets",
                'impact': '',
            })

        return recs[:6]
