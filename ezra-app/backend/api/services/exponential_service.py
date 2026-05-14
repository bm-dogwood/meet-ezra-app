"""
Ezra Exponential Service - Real data from ExponentialCustomer, ExponentialVisit,
ExponentialSegment, ExponentialCampaign, ExponentialSMSLog, ExponentialUptake.
Queries the database for customer retention and follow-up metrics.
"""
import logging
from datetime import date, timedelta, datetime
from decimal import Decimal

from django.db.models import (
    Sum, Avg, Max, Min, Count, Q, F, Case, When, Value,
    IntegerField, CharField, Subquery, OuterRef,
)
from django.db.models.functions import Coalesce, TruncDate

from api.models import (
    Store, ExponentialCustomer, ExponentialVisit, ExponentialSegment,
    ExponentialCampaign, ExponentialSMSLog, ExponentialUptake,
)
from api.constants import DEFAULT_EXPONENTIAL_CONFIG

logger = logging.getLogger(__name__)

BUCKET_MAP = {
    '4_6wk': {'name': '4-6 weeks', 'riskLevel': 'low', 'description': '28-42 days since last visit'},
    '4_8wk': {'name': '4-8 weeks', 'riskLevel': 'medium', 'description': '28-56 days since last visit'},
    '8wk_plus': {'name': '8+ weeks', 'riskLevel': 'high', 'description': '57+ days since last visit'},
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


class ExponentialService:
    """Service for querying real Exponential data."""

    def __init__(self, tenant=None, config=None):
        self.tenant = tenant
        self.config = config or DEFAULT_EXPONENTIAL_CONFIG

    def _store_qs(self):
        qs = Store.objects.filter(status='active')
        if self.tenant:
            qs = qs.filter(tenant=self.tenant)
        return qs

    def _customer_qs(self):
        qs = ExponentialCustomer.objects.all()
        if self.tenant:
            qs = qs.filter(tenant=self.tenant)
        return qs

    def _date_range(self, start_date=None, end_date=None):
        end = _parse_date(end_date) or date.today()
        start = _parse_date(start_date) or (end - timedelta(days=29))
        return start, end

    def _compute_segments_from_customers(self, customer_qs, reference_date=None):
        """
        Compute segment buckets dynamically from customer data using SegmentConfig.
        Segments may overlap (e.g. 4-6wk is a subset of 4-8wk) — a customer can
        appear in multiple buckets. Falls back to hardcoded defaults if SegmentConfig
        table doesn't exist yet.
        """
        ref = reference_date or date.today()

        # Get dynamic segment configs for this tenant (or Default for super_admin)
        segment_configs = []
        try:
            from api.models import SegmentConfig, Tenant
            config_tenant = self.tenant
            if not config_tenant:
                config_tenant = Tenant.objects.filter(name='Default').first()
            if config_tenant:
                segment_configs = SegmentConfig.get_for_tenant(config_tenant)
        except Exception:
            pass  # Table doesn't exist yet (migration not applied)

        # Fallback to hardcoded defaults if no configs
        if not segment_configs:
            return self._compute_segments_hardcoded(customer_qs, ref), None

        customers_with_visits = customer_qs.filter(
            last_visit_date__isnull=False
        )

        buckets = {cfg.slug: [] for cfg in segment_configs}

        for cust in customers_with_visits:
            days_since = (ref - cust.last_visit_date).days if cust.last_visit_date else 999

            # Check ALL segments (no break) — segments can overlap
            for cfg in segment_configs:
                if cfg.max_days is not None:
                    if cfg.min_days <= days_since <= cfg.max_days:
                        buckets[cfg.slug].append(cust)
                else:
                    if days_since >= cfg.min_days:
                        buckets[cfg.slug].append(cust)

        return buckets, segment_configs

    def _compute_segments_hardcoded(self, customer_qs, ref):
        """Fallback: new default segments (4-6wk, 4-8wk, 8+wk) — overlapping."""
        customers_with_visits = customer_qs.filter(
            last_visit_date__isnull=False
        )

        bucket_4_6wk = []
        bucket_4_8wk = []
        bucket_8wk_plus = []

        for cust in customers_with_visits:
            days_since = (ref - cust.last_visit_date).days if cust.last_visit_date else 999

            if 28 <= days_since <= 42:
                bucket_4_6wk.append(cust)
            if 28 <= days_since <= 56:
                bucket_4_8wk.append(cust)
            if days_since >= 57:
                bucket_8wk_plus.append(cust)

        return {'4_6wk': bucket_4_6wk, '4_8wk': bucket_4_8wk, '8wk_plus': bucket_8wk_plus}

    def _build_segment_stats(self, segment_config, customer_list):
        """Build segment stats dict for a dynamic segment config."""
        count = len(customer_list)

        customer_ids = [c.id for c in customer_list]
        sms_sent = ExponentialSMSLog.objects.filter(
            customer_id__in=customer_ids
        ).count() if customer_ids else 0

        uptake_count = ExponentialUptake.objects.filter(
            customer_id__in=customer_ids
        ).count() if customer_ids else 0

        uptake_pct = round(uptake_count / sms_sent * 100, 1) if sms_sent > 0 else 0.0

        upper = f"-{segment_config.max_days}" if segment_config.max_days else "+"
        description = f"{segment_config.min_days}{upper} days since last visit"

        return {
            'name': segment_config.name,
            'slug': segment_config.slug,
            'customerCount': count,
            'description': description,
            'riskLevel': segment_config.risk_level,
            'color': segment_config.color,
            'uptakePercent': uptake_pct,
            'messagesSent': sms_sent,
            'returns': uptake_count,
        }

    def _build_segment_stats_legacy(self, bucket_key, customer_list):
        """Build segment stats dict using hardcoded BUCKET_MAP (fallback)."""
        meta = BUCKET_MAP.get(bucket_key, {})
        count = len(customer_list)

        customer_ids = [c.id for c in customer_list]
        sms_sent = ExponentialSMSLog.objects.filter(
            customer_id__in=customer_ids
        ).count() if customer_ids else 0

        uptake_count = ExponentialUptake.objects.filter(
            customer_id__in=customer_ids
        ).count() if customer_ids else 0

        uptake_pct = round(uptake_count / sms_sent * 100, 1) if sms_sent > 0 else 0.0

        color_map = {'4_6wk': 'success', '4_8wk': 'warning', '8wk_plus': 'danger'}
        return {
            'name': meta.get('name', bucket_key),
            'slug': bucket_key,
            'customerCount': count,
            'description': meta.get('description', ''),
            'riskLevel': meta.get('riskLevel', 'low'),
            'color': color_map.get(bucket_key, 'warning'),
            'uptakePercent': uptake_pct,
            'messagesSent': sms_sent,
            'returns': uptake_count,
        }

    # =========================================================
    # OVERVIEW
    # =========================================================
    def get_overview_metrics(self, stores=None, start_date=None, end_date=None):
        start, end = self._date_range(start_date, end_date)
        store_ids = list(self._store_qs().values_list('id', flat=True))

        if not store_ids:
            return self._empty_overview()

        # Total guests MTD (unique customers with visits this month)
        mtd_start = date(end.year, end.month, 1)
        guests_mtd = ExponentialVisit.objects.filter(
            store_id__in=store_ids,
            visit_date__gte=mtd_start,
            visit_date__lte=end,
        ).values('customer_id').distinct().count()

        # Total customers last month
        last_month_end = mtd_start - timedelta(days=1)
        last_month_start = date(last_month_end.year, last_month_end.month, 1)
        customers_last_month = ExponentialVisit.objects.filter(
            store_id__in=store_ids,
            visit_date__gte=last_month_start,
            visit_date__lte=last_month_end,
        ).values('customer_id').distinct().count()

        # If no last month data, use all customers as fallback
        if customers_last_month == 0:
            customers_last_month = self._customer_qs().filter(
                store_id__in=store_ids
            ).count()

        # Compute segments using dynamic configs (falls back to hardcoded)
        all_customers = self._customer_qs().filter(store_id__in=store_ids)
        buckets, segment_configs = self._compute_segments_from_customers(all_customers, reference_date=end)

        segments = []
        if segment_configs:
            # Dynamic segments
            for cfg in segment_configs:
                segments.append(self._build_segment_stats(cfg, buckets[cfg.slug]))
        else:
            # Hardcoded fallback
            for bk in ['4_6wk', '4_8wk', '8wk_plus']:
                segments.append(self._build_segment_stats_legacy(bk, buckets[bk]))

        # Daily campaigns (from ExponentialCampaign + SMS logs)
        daily_campaigns = self._build_daily_campaigns(store_ids, start, end)

        # Uptake by segment
        uptake_by_segment = self._build_uptake_by_segment(store_ids)

        # Location summaries
        location_summaries = self._build_location_summaries(store_ids, end)

        return {
            'guestsMTD': guests_mtd,
            'customersLastMonth': customers_last_month,
            'segments': segments,
            'dailyCampaigns': daily_campaigns,
            'uptakeBySegment': uptake_by_segment,
            'locationSummaries': location_summaries,
        }

    def _empty_overview(self):
        return {
            'guestsMTD': 0,
            'customersLastMonth': 0,
            'segments': [],
            'dailyCampaigns': [],
            'uptakeBySegment': [],
            'locationSummaries': [],
        }

    def _build_daily_campaigns(self, store_ids, start, end):
        """Build daily campaign send counts by segment."""
        from django.db.models import Q
        # Get SMS logs grouped by date and segment
        # Include store-based customers AND CRM guests (store=NULL) via tenant's campaigns
        store_filter = Q(customer__store_id__in=store_ids)
        if self.tenant:
            store_filter = store_filter | Q(customer__store__isnull=True, campaign__tenant=self.tenant)
        else:
            store_filter = store_filter | Q(customer__store__isnull=True)
        logs = ExponentialSMSLog.objects.filter(
            store_filter,
            sent_at__date__gte=start,
            sent_at__date__lte=end,
        ).values(
            date=TruncDate('sent_at'),
            segment=F('segment_at_send'),
        ).annotate(
            count=Count('id')
        ).order_by('date')

        # Build date -> counts map
        date_map = {}
        current = start
        while current <= end:
            date_map[current.isoformat()] = {
                'date': current.isoformat(),
                'sendsBySegment': {},
                'totalSends': 0,
            }
            current += timedelta(days=1)

        for row in logs:
            d = row['date'].isoformat() if row['date'] else None
            if d and d in date_map:
                seg = row['segment'] or 'unknown'
                cnt = row['count']
                date_map[d]['sendsBySegment'][seg] = date_map[d]['sendsBySegment'].get(seg, 0) + cnt
                date_map[d]['totalSends'] += cnt

        return list(date_map.values())

    def _build_uptake_by_segment(self, store_ids):
        """Build uptake effectiveness by segment. OPTIMIZED VERSION with dynamic segments."""
        from django.db.models import Q
        store_filter = Q(customer__store_id__in=store_ids)
        if self.tenant:
            store_filter = store_filter | Q(customer__store__isnull=True, campaign__tenant=self.tenant)
        else:
            store_filter = store_filter | Q(customer__store__isnull=True)
        uptake_store_filter = Q(sms_log__customer__store_id__in=store_ids)
        if self.tenant:
            uptake_store_filter = uptake_store_filter | Q(sms_log__customer__store__isnull=True, sms_log__campaign__tenant=self.tenant)
        else:
            uptake_store_filter = uptake_store_filter | Q(sms_log__customer__store__isnull=True)
        
        # Get dynamic segment configs for this tenant (or Default for super_admin)
        segment_configs = []
        try:
            from api.models import SegmentConfig, Tenant
            config_tenant = self.tenant
            if not config_tenant:
                config_tenant = Tenant.objects.filter(name='Default').first()
            if config_tenant:
                segment_configs = SegmentConfig.get_for_tenant(config_tenant)
        except Exception:
            pass  # Table doesn't exist yet (migration not applied)
        
        # Bulk query: Get sent counts by segment
        sent_data = ExponentialSMSLog.objects.filter(
            store_filter
        ).values('segment_at_send').annotate(
            sent_count=Count('id')
        )
        sent_map = {item['segment_at_send']: item['sent_count'] for item in sent_data}
        
        # Bulk query: Get returned counts by segment
        returned_data = ExponentialUptake.objects.filter(
            uptake_store_filter
        ).values('sms_log__segment_at_send').annotate(
            returned_count=Count('id')
        )
        returned_map = {item['sms_log__segment_at_send']: item['returned_count'] for item in returned_data}
        
        result = []
        
        # Use dynamic segments if available, otherwise fallback to hardcoded
        if segment_configs:
            # Build a set of segment names we've already matched
            matched_segments = set()
            for cfg in segment_configs:
                # Match by name first (segment_at_send stores display name),
                # then fall back to slug for backward compatibility
                sent = sent_map.get(cfg.name, 0) or sent_map.get(cfg.slug, 0)
                returned = returned_map.get(cfg.name, 0) or returned_map.get(cfg.slug, 0)
                pct = round(returned / sent * 100, 1) if sent > 0 else 0.0
                result.append({
                    'segment': cfg.name,
                    'uptake': pct,
                })
                matched_segments.add(cfg.name)
                matched_segments.add(cfg.slug)
            
            # Also include any legacy segments from SMS logs that don't match current configs
            for seg_name, sent in sent_map.items():
                if seg_name and seg_name not in matched_segments:
                    returned = returned_map.get(seg_name, 0)
                    pct = round(returned / sent * 100, 1) if sent > 0 else 0.0
                    result.append({
                        'segment': seg_name,
                        'uptake': pct,
                    })
        else:
            # Fallback to hardcoded segments
            for bk, meta in BUCKET_MAP.items():
                sent = sent_map.get(bk, 0)
                returned = returned_map.get(bk, 0)
                pct = round(returned / sent * 100, 1) if sent > 0 else 0.0
                result.append({
                    'segment': meta['name'],
                    'uptake': pct,
                })
        
        return result

    def _build_location_summaries(self, store_ids, reference_date=None):
        """Build per-store summary rows for the overview table. OPTIMIZED VERSION."""
        ref = reference_date or date.today()
        mtd_start = date(ref.year, ref.month, 1)
        last_month_end = mtd_start - timedelta(days=1)
        last_month_start = date(last_month_end.year, last_month_end.month, 1)

        # Get all stores at once
        stores = Store.objects.filter(id__in=store_ids, status='active')
        store_dict = {s.id: s for s in stores}

        # Bulk query: Get customer counts per store
        customer_counts = self._customer_qs().filter(
            store_id__in=store_ids
        ).values('store_id').annotate(
            total_customers=Count('id')
        )
        customer_count_map = {item['store_id']: item['total_customers'] for item in customer_counts}

        # Bulk query: Get guests MTD per store
        guests_mtd_data = ExponentialVisit.objects.filter(
            store_id__in=store_ids,
            visit_date__gte=mtd_start,
            visit_date__lte=ref,
        ).values('store_id').annotate(
            guests_mtd=Count('customer_id', distinct=True)
        )
        guests_mtd_map = {item['store_id']: item['guests_mtd'] for item in guests_mtd_data}

        # Bulk query: Get customers last month per store
        cust_last_month_data = ExponentialVisit.objects.filter(
            store_id__in=store_ids,
            visit_date__gte=last_month_start,
            visit_date__lte=last_month_end,
        ).values('store_id').annotate(
            cust_last_month=Count('customer_id', distinct=True)
        )
        cust_last_month_map = {item['store_id']: item['cust_last_month'] for item in cust_last_month_data}

        # Bulk query: Get follow-ups sent per store
        followups_data = ExponentialSMSLog.objects.filter(
            customer__store_id__in=store_ids
        ).values('customer__store_id').annotate(
            followups=Count('id')
        )
        followups_map = {item['customer__store_id']: item['followups'] for item in followups_data}

        # Bulk query: Get uptake per store
        uptake_data = ExponentialUptake.objects.filter(
            customer__store_id__in=store_ids
        ).values('customer__store_id').annotate(
            total_returned=Count('id')
        )
        uptake_map = {item['customer__store_id']: item['total_returned'] for item in uptake_data}

        # Get segment configs once
        segment_configs = None
        try:
            from api.models import SegmentConfig, Tenant
            config_tenant = self.tenant
            if not config_tenant:
                from api.models import Tenant
                config_tenant = Tenant.objects.filter(name='Default').first()
            if config_tenant:
                segment_configs = SegmentConfig.get_for_tenant(config_tenant)
        except Exception:
            pass

        # Bulk query: Get all customers with last_visit_date for segment computation
        # Calculate days_since in the database
        all_customers = self._customer_qs().filter(
            store_id__in=store_ids,
            last_visit_date__isnull=False
        ).annotate(
            days_since_visit=(ref - F('last_visit_date'))
        ).values('store_id', 'days_since_visit')

        # Group customers by store and compute segments in one pass
        segment_counts_by_store = {}
        for cust_data in all_customers:
            store_id = cust_data['store_id']
            days_since = cust_data['days_since_visit'].days
            
            if store_id not in segment_counts_by_store:
                if segment_configs:
                    segment_counts_by_store[store_id] = {cfg.slug: 0 for cfg in segment_configs}
                else:
                    segment_counts_by_store[store_id] = {'4_6wk': 0, '4_8wk': 0, '8wk_plus': 0}
            
            # Count for each segment
            if segment_configs:
                for cfg in segment_configs:
                    if cfg.max_days is not None:
                        if cfg.min_days <= days_since <= cfg.max_days:
                            segment_counts_by_store[store_id][cfg.slug] += 1
                    else:
                        if days_since >= cfg.min_days:
                            segment_counts_by_store[store_id][cfg.slug] += 1
            else:
                # Hardcoded fallback
                if 28 <= days_since <= 42:
                    segment_counts_by_store[store_id]['4_6wk'] += 1
                if 28 <= days_since <= 56:
                    segment_counts_by_store[store_id]['4_8wk'] += 1
                if days_since >= 57:
                    segment_counts_by_store[store_id]['8wk_plus'] += 1

        summaries = []
        for store_id, store in store_dict.items():
            total_cust = customer_count_map.get(store_id, 0)
            if total_cust == 0:
                continue

            guests_mtd = guests_mtd_map.get(store_id, 0)
            cust_last_month = cust_last_month_map.get(store_id, 0)
            if cust_last_month == 0:
                cust_last_month = total_cust

            # Get segment counts
            seg_counts = segment_counts_by_store.get(store_id, {})
            if not seg_counts:
                if segment_configs:
                    seg_counts = {cfg.slug: 0 for cfg in segment_configs}
                else:
                    seg_counts = {'4_6wk': 0, '4_8wk': 0, '8wk_plus': 0}
            
            # Calculate high risk count
            if segment_configs:
                high_risk_slug = segment_configs[-1].slug
                high_risk_count = seg_counts.get(high_risk_slug, 0)
            else:
                high_risk_count = seg_counts.get('8wk_plus', 0)

            # Follow-ups and uptake
            followups = followups_map.get(store_id, 0)
            total_returned = uptake_map.get(store_id, 0)
            uptake = round(total_returned / followups * 100, 1) if followups > 0 else 0.0

            # Retention risk score
            if total_cust > 0:
                high_risk_ratio = (high_risk_count / total_cust) * 100
                risk_score = round(
                    (high_risk_ratio * 0.6) + (max(0, 50 - uptake) * 0.4),
                    0
                )
                risk_score = min(max(risk_score, 0), 100)
            else:
                risk_score = 0

            location_data = {
                'locationId': str(store.id),
                'storeCode': store.external_code or '',
                'locationName': store.name or '',
                'state': store.state or '',
                'guestsMTD': guests_mtd,
                'customersLastMonth': cust_last_month,
                'segmentCounts': seg_counts,
                'followUpsSent': followups,
                'overallUptake': uptake,
                'retentionRiskScore': int(risk_score),
                'lastSyncAt': store.last_synced_at.isoformat() if store.last_synced_at else ref.isoformat(),
            }

            summaries.append(location_data)

        # Sort by retention risk score descending
        summaries.sort(key=lambda x: x['retentionRiskScore'], reverse=True)
        return summaries

    # =========================================================
    # STORE DRILLDOWN
    # =========================================================
    def get_store_drilldown(self, store_id, start_date=None, end_date=None):
        """Detailed data for a specific store."""
        try:
            store = Store.objects.get(id=store_id)
        except Store.DoesNotExist:
            return None

        start, end = self._date_range(start_date, end_date)
        ref = end

        store_customers = self._customer_qs().filter(store=store)
        if not store_customers.exists():
            return self._empty_store(store)

        mtd_start = date(ref.year, ref.month, 1)
        last_month_end = mtd_start - timedelta(days=1)
        last_month_start = date(last_month_end.year, last_month_end.month, 1)

        # Guests MTD
        guests_mtd = ExponentialVisit.objects.filter(
            store=store,
            visit_date__gte=mtd_start,
            visit_date__lte=ref,
        ).values('customer_id').distinct().count()

        # Customers last month
        cust_last_month = ExponentialVisit.objects.filter(
            store=store,
            visit_date__gte=last_month_start,
            visit_date__lte=last_month_end,
        ).values('customer_id').distinct().count()
        if cust_last_month == 0:
            cust_last_month = store_customers.count()

        # Segments
        result = self._compute_segments_from_customers(store_customers, reference_date=ref)
        buckets, segment_configs = result
        if segment_configs:
            seg_counts = {cfg.slug: len(buckets[cfg.slug]) for cfg in segment_configs}
        else:
            seg_counts = {k: len(v) for k, v in buckets.items()}

        # Follow-ups & uptake
        followups = ExponentialSMSLog.objects.filter(customer__store=store).count()
        returned = ExponentialUptake.objects.filter(customer__store=store).count()
        uptake = round(returned / followups * 100, 1) if followups > 0 else 0.0

        summary = {
            'guestsMTD': guests_mtd,
            'customersLastMonth': cust_last_month,
            'segmentCounts': seg_counts,
            'followUpsSent': followups,
            'overallUptake': uptake,
        }

        # Segment detail cards
        segments = []
        if segment_configs:
            for cfg in segment_configs:
                segments.append(self._build_segment_stats(cfg, buckets[cfg.slug]))
        else:
            for bk in ['4_6wk', '4_8wk', '8wk_plus']:
                segments.append(self._build_segment_stats_legacy(bk, buckets.get(bk, [])))

        # Daily campaigns for this store
        daily_campaigns = self._build_store_daily_campaigns(store, start, end)

        # Recommendations
        recommendations = self._generate_recommendations(
            store.name, buckets, summary, store_customers.count()
        )

        # Guest samples (anonymized)
        guest_samples = self._build_guest_samples(store, buckets, ref)

        return {
            'locationId': str(store.id),
            'locationName': store.name or '',
            'storeCode': store.external_code or '',
            'summary': summary,
            'segments': segments,
            'dailyCampaigns': daily_campaigns,
            'recommendations': recommendations,
            'guestSamples': guest_samples,
        }

    def _empty_store(self, store):
        return {
            'locationId': str(store.id),
            'locationName': store.name or '',
            'storeCode': store.external_code or '',
            'summary': {
                'guestsMTD': 0, 'customersLastMonth': 0,
                'fourWeekCount': 0, 'sixWeekCount': 0, 'eightWeekCount': 0,
                'followUpsSent': 0, 'overallUptake': 0,
            },
            'segments': [],
            'dailyCampaigns': [],
            'recommendations': [],
            'guestSamples': [],
        }

    def _build_store_daily_campaigns(self, store, start, end):
        """Daily campaign sends for a specific store."""
        logs = ExponentialSMSLog.objects.filter(
            customer__store=store,
            sent_at__date__gte=start,
            sent_at__date__lte=end,
        ).values(
            date=TruncDate('sent_at'),
            segment=F('segment_at_send'),
        ).annotate(count=Count('id')).order_by('date')

        date_map = {}
        current = start
        while current <= end:
            date_map[current.isoformat()] = {
                'date': current.isoformat(),
                'fourWeekSends': 0,
                'sixWeekSends': 0,
                'eightWeekSends': 0,
                'totalSends': 0,
            }
            current += timedelta(days=1)

        for row in logs:
            d = row['date'].isoformat() if row['date'] else None
            if d and d in date_map:
                seg = row['segment']
                cnt = row['count']
                if seg == '4wk':
                    date_map[d]['fourWeekSends'] += cnt
                elif seg == '6wk':
                    date_map[d]['sixWeekSends'] += cnt
                elif seg == '8wk':
                    date_map[d]['eightWeekSends'] += cnt
                date_map[d]['totalSends'] += cnt

        return list(date_map.values())

    def _generate_recommendations(self, store_name, buckets, summary, total_customers):
        """Generate smart recommendations based on real data."""
        recs = []
        rec_id = 0

        four_wk = len(buckets.get('4_6wk', buckets.get('4wk', [])))
        six_wk = len(buckets.get('4_8wk', buckets.get('6wk', [])))
        eight_wk = len(buckets.get('8wk_plus', buckets.get('8wk', [])))
        total_segmented = four_wk + six_wk + eight_wk

        # High 8-week count
        if total_segmented > 0 and eight_wk / total_segmented > 0.3:
            rec_id += 1
            pct = round(eight_wk / total_segmented * 100, 1)
            recs.append({
                'id': str(rec_id),
                'type': 'increase_outreach',
                'priority': 'high',
                'title': f'High churn risk: {pct}% in 8-week bucket',
                'description': (
                    f'{eight_wk} customers haven\'t visited in 43+ days. '
                    f'Consider launching an aggressive re-engagement campaign with $15 offers.'
                ),
                'metric': f'{eight_wk} customers at risk',
                'impact': 'Potential to recover 10-15% with targeted SMS',
            })

        # Low follow-up activity
        if summary.get('followUpsSent', 0) == 0 and total_segmented > 0:
            rec_id += 1
            recs.append({
                'id': str(rec_id),
                'type': 'increase_outreach',
                'priority': 'high',
                'title': 'No follow-up campaigns sent yet',
                'description': (
                    f'{total_segmented} customers are segmented but no SMS campaigns have been launched. '
                    f'Start with the 8-week bucket for highest impact.'
                ),
                'metric': f'{total_segmented} eligible customers',
                'impact': 'Industry avg 15-25% return rate from SMS outreach',
            })

        # Good 4-week retention
        if total_segmented > 0 and four_wk / total_segmented > 0.5:
            rec_id += 1
            pct = round(four_wk / total_segmented * 100, 1)
            recs.append({
                'id': str(rec_id),
                'type': 'success',
                'priority': 'low',
                'title': f'Strong retention: {pct}% in 4-week bucket',
                'description': (
                    f'{four_wk} customers have visited 2+ times in 30 days. '
                    f'This location has healthy repeat visit patterns.'
                ),
                'metric': f'{four_wk} loyal customers',
                'impact': '',
            })

        # 6-week segment opportunity
        if six_wk > 10:
            rec_id += 1
            recs.append({
                'id': str(rec_id),
                'type': 'timing',
                'priority': 'medium',
                'title': f'{six_wk} customers in the 6-week window',
                'description': (
                    f'These customers are 31-42 days since their last visit — '
                    f'the optimal window for a $10 re-engagement offer before they drift to 8-week.'
                ),
                'metric': f'{six_wk} in medium risk',
                'impact': 'Prevent escalation to high churn',
            })

        # Low uptake
        uptake = summary.get('overallUptake', 0)
        if uptake > 0 and uptake < 15:
            rec_id += 1
            recs.append({
                'id': str(rec_id),
                'type': 'adjust_offer',
                'priority': 'medium',
                'title': f'Low uptake rate ({uptake}%)',
                'description': (
                    f'Consider increasing coupon values or adjusting message timing. '
                    f'Test sending at different hours for better engagement.'
                ),
                'metric': f'{uptake}% uptake',
                'impact': 'Target 20%+ uptake rate',
            })

        return recs[:6]

    def _build_guest_samples(self, store, buckets, reference_date):
        """Build guest sample records with full detail. Optimised to avoid N+1."""
        samples = []
        ref = reference_date or date.today()

        # Collect all sample customer IDs first
        sample_customers = []
        for bk in buckets.keys():
            customers = buckets.get(bk, [])[:5]
            for cust in customers:
                sample_customers.append((bk, cust))

        if not sample_customers:
            return samples

        cust_ids = [c.id for _, c in sample_customers]

        # Batch fetch last SMS per customer
        from django.db.models import Max, Subquery, OuterRef
        last_sms_map = {}
        sms_qs = ExponentialSMSLog.objects.filter(
            customer_id__in=cust_ids
        ).values('customer_id').annotate(
            last_sent=Max('sent_at'),
            last_status=Subquery(
                ExponentialSMSLog.objects.filter(
                    customer_id=OuterRef('customer_id')
                ).order_by('-sent_at').values('status')[:1]
            ),
        )
        for row in sms_qs:
            last_sms_map[row['customer_id']] = {
                'sent_at': row['last_sent'],
                'status': row['last_status'],
            }

        # Batch fetch uptake existence
        uptake_ids = set(
            ExponentialUptake.objects.filter(
                customer_id__in=cust_ids
            ).values_list('customer_id', flat=True)
        )

        # Resolve segment name from config if available
        from api.models import SegmentConfig
        seg_name_map = {}
        configs = SegmentConfig.objects.filter(tenant=self.tenant).order_by('sort_order')
        if configs.exists():
            for cfg in configs:
                seg_name_map[cfg.slug] = cfg.name
        else:
            seg_name_map = {k: v.get('name', k) for k, v in BUCKET_MAP.items()}

        for bk, cust in sample_customers:
            sms_info = last_sms_map.get(cust.id)
            has_uptake = cust.id in uptake_ids

            if sms_info and has_uptake:
                status = 'returned'
            elif sms_info:
                status = 'no_response'
            else:
                status = 'not_messaged'

            days_since = (ref - cust.last_visit_date).days if cust.last_visit_date else None

            samples.append({
                'id': cust.guest_code,
                'guestName': cust.guest_name or '',
                'phone': cust.phone or '',
                'lastVisitDate': cust.last_visit_date.isoformat() if cust.last_visit_date else '',
                'daysSinceVisit': days_since,
                'segment': seg_name_map.get(bk, BUCKET_MAP.get(bk, {}).get('name', bk)),
                'lastService': cust.last_service or '',
                'totalVisits': cust.total_visits or 0,
                'smsOptIn': cust.sms_opt_in,
                'lastMessageDate': sms_info['sent_at'].date().isoformat() if sms_info else None,
                'status': status,
            })

        return samples[:15]
