"""
LP (Loss Prevention) Service
Handles all LP calculations, risk scoring, and alert generation.
"""
from decimal import Decimal
from datetime import date, timedelta
from typing import Dict, List, Optional, Tuple
from django.db.models import Sum, Count, Q, Avg
from django.db import transaction
from django.utils import timezone

from api.models import (
    Store, Tenant, ReportMetric, RawReport,
    LPAlert, LPRiskScore, LPAlertConfig, LowTicketService
)


class LPService:
    """
    Core LP calculation and alert generation service.
    """
    
    # Default thresholds (used if no tenant config exists)
    DEFAULT_CASH_RATIO_THRESHOLDS = {'yellow': Decimal('25'), 'red': Decimal('30')}
    DEFAULT_TIP_PERCENT_THRESHOLDS = {
        'green_min': Decimal('18'), 
        'green_max': Decimal('30'), 
        'yellow_low': Decimal('12'), 
        'yellow_high': Decimal('35')
    }
    DEFAULT_LOW_TICKET_THRESHOLDS = {'yellow': Decimal('5'), 'red': Decimal('10')}
    
    DEFAULT_RISK_POINTS = {'low': 0, 'medium': 15, 'high': 30}
    DEFAULT_PATTERN_BONUS = {'2_red': 10, '2_flagged': 7, '2_yellow': 5}
    
    # Default low-ticket service names (Beard Trim and Neck Trim only)
    DEFAULT_LOW_TICKET_SERVICES = ['Beard Trim', 'Neck Trim']
    
    def __init__(self, tenant: Optional[Tenant] = None):
        self.tenant = tenant
        self._config = None
        self._low_ticket_services = None
    
    @property
    def config(self) -> LPAlertConfig:
        """Get or create LP config for tenant."""
        if self._config is None and self.tenant:
            self._config, _ = LPAlertConfig.objects.get_or_create(tenant=self.tenant)
        return self._config
    
    @property
    def low_ticket_service_names(self) -> List[str]:
        """Get list of low-ticket service names for tenant."""
        if self._low_ticket_services is None:
            if self.tenant:
                services = LowTicketService.objects.filter(
                    tenant=self.tenant, 
                    is_active=True
                ).values_list('service_name', flat=True)
                self._low_ticket_services = list(services) if services else self.DEFAULT_LOW_TICKET_SERVICES
            else:
                self._low_ticket_services = self.DEFAULT_LOW_TICKET_SERVICES
        return self._low_ticket_services
    
    def get_thresholds(self) -> Dict:
        """Get thresholds from config or defaults."""
        if self.config:
            return {
                'cash_ratio': {
                    'yellow': self.config.cash_ratio_yellow_min,
                    'red': self.config.cash_ratio_red_min,
                },
                'tip_percent': {
                    'green_min': self.config.tip_percent_green_min,
                    'green_max': self.config.tip_percent_green_max,
                    'yellow_low': self.config.tip_percent_yellow_low,
                    'yellow_high': self.config.tip_percent_yellow_high,
                },
                'low_ticket': {
                    'yellow': self.config.low_ticket_yellow_min,
                    'red': self.config.low_ticket_red_min,
                },
            }
        return {
            'cash_ratio': self.DEFAULT_CASH_RATIO_THRESHOLDS,
            'tip_percent': self.DEFAULT_TIP_PERCENT_THRESHOLDS,
            'low_ticket': self.DEFAULT_LOW_TICKET_THRESHOLDS,
        }
    
    def get_risk_points(self) -> Dict:
        """Get risk points from config or defaults."""
        if self.config:
            return {
                'low': self.config.risk_points_low,
                'medium': self.config.risk_points_medium,
                'high': self.config.risk_points_high,
            }
        return self.DEFAULT_RISK_POINTS
    
    def get_pattern_bonus_config(self) -> Dict:
        """Get pattern bonus values from config or defaults."""
        if self.config:
            return {
                '2_red': self.config.pattern_bonus_2_red,
                '2_flagged': self.config.pattern_bonus_2_flagged,
                '2_yellow': self.config.pattern_bonus_2_yellow,
            }
        return self.DEFAULT_PATTERN_BONUS
    
    def calculate_cash_ratio_risk(self, cash: Decimal, cc: Decimal) -> Dict:
        """
        Calculate cash to credit ratio and determine risk level.
        Returns: {value: float, risk: str, points: int}
        """
        thresholds = self.get_thresholds()['cash_ratio']
        risk_points = self.get_risk_points()
        total = cash + cc
        
        if total == 0:
            return {'value': 0, 'risk': 'low', 'points': 0}
        
        cash_percent = (cash / total) * 100
        
        if cash_percent > thresholds['red']:
            risk = 'high'
        elif cash_percent > thresholds['yellow']:
            risk = 'medium'
        else:
            risk = 'low'
        
        return {
            'value': float(cash_percent),
            'risk': risk,
            'points': risk_points[risk]
        }
    
    def calculate_tip_percent_risk(self, tip_amount: Decimal, service_revenue: Decimal) -> Dict:
        """
        Calculate tip percentage and determine risk level.
        """
        thresholds = self.get_thresholds()['tip_percent']
        risk_points = self.get_risk_points()
        
        if service_revenue == 0:
            return {'value': 0, 'risk': 'low', 'points': 0}
        
        tip_percent = (tip_amount / service_revenue) * 100
        
        if tip_percent < thresholds['yellow_low'] or tip_percent > thresholds['yellow_high']:
            risk = 'high'
        elif tip_percent < thresholds['green_min'] or tip_percent > thresholds['green_max']:
            risk = 'medium'
        else:
            risk = 'low'
        
        return {
            'value': float(tip_percent),
            'risk': risk,
            'points': risk_points[risk]
        }
    
    def calculate_low_ticket_risk(self, low_ticket_count: int, total_count: int) -> Dict:
        """
        Calculate low-ticket service percentage and determine risk level.
        """
        thresholds = self.get_thresholds()['low_ticket']
        risk_points = self.get_risk_points()
        
        if total_count == 0:
            return {'value': 0, 'risk': 'low', 'points': 0}
        
        low_ticket_percent = (Decimal(low_ticket_count) / Decimal(total_count)) * 100
        
        if low_ticket_percent > thresholds['red']:
            risk = 'high'
        elif low_ticket_percent > thresholds['yellow']:
            risk = 'medium'
        else:
            risk = 'low'
        
        return {
            'value': float(low_ticket_percent),
            'risk': risk,
            'points': risk_points[risk]
        }
    
    def calculate_pattern_bonus(self, risks: List[str]) -> int:
        """
        Calculate pattern bonus based on multiple flagged indicators.
        """
        pattern_config = self.get_pattern_bonus_config()
        red_count = sum(1 for r in risks if r == 'high')
        yellow_count = sum(1 for r in risks if r == 'medium')
        flagged_count = red_count + yellow_count
        
        if red_count >= 2:
            return pattern_config['2_red']
        elif flagged_count >= 2 and red_count < 2:
            return pattern_config['2_flagged']
        elif yellow_count >= 2 and red_count == 0:
            return pattern_config['2_yellow']
        return 0
    
    def get_store_metrics(self, store: Store, report_date: date) -> Dict:
        """
        Get metrics for a store from ReportMetric model.
        Returns: {cash, cc, tip_amount, service_revenue, total_services, low_ticket_count}
        """
        # Get MFR metrics (sales report)
        metrics = ReportMetric.objects.filter(
            store=store,
            report_type='sales',
            report_date=report_date,
        ).values('metric_name', 'metric_value')
        
        metric_dict = {m['metric_name']: m['metric_value'] or Decimal('0') for m in metrics}
        
        # Get service counts from sales-accrual report
        total_services = 0
        low_ticket_count = 0
        
        # Check if we have service count metrics
        service_metrics = ReportMetric.objects.filter(
            store=store,
            report_type='sales-accrual',
            report_date=report_date,
            metric_name__in=['total_services', 'low_ticket_services']
        ).values('metric_name', 'metric_value')
        
        for m in service_metrics:
            if m['metric_name'] == 'total_services':
                total_services = int(m['metric_value'] or 0)
            elif m['metric_name'] == 'low_ticket_services':
                low_ticket_count = int(m['metric_value'] or 0)
        
        return {
            'cash': metric_dict.get('Cash', Decimal('0')),
            'cc': metric_dict.get('CC', Decimal('0')),
            'tip_amount': metric_dict.get('Tip Amount', Decimal('0')),
            'service_revenue': metric_dict.get('Service Net', Decimal('0')),
            'total_services': total_services,
            'low_ticket_count': low_ticket_count,
        }
    
    def calculate_risk_score_for_store(self, store: Store, report_date: date) -> LPRiskScore:
        """
        Calculate complete LP risk score for a store and save it.
        """
        metrics = self.get_store_metrics(store, report_date)
        
        # Calculate individual indicators
        cash_result = self.calculate_cash_ratio_risk(metrics['cash'], metrics['cc'])
        tip_result = self.calculate_tip_percent_risk(metrics['tip_amount'], metrics['service_revenue'])
        low_ticket_result = self.calculate_low_ticket_risk(
            metrics['low_ticket_count'], 
            metrics['total_services']
        )
        
        # Calculate base points
        base_points = cash_result['points'] + tip_result['points'] + low_ticket_result['points']
        
        # Calculate pattern bonus
        risks = [cash_result['risk'], tip_result['risk'], low_ticket_result['risk']]
        pattern_bonus = self.calculate_pattern_bonus(risks)
        
        # Final score (capped at 100)
        total_score = min(base_points + pattern_bonus, 100)
        
        # Create or update risk score
        risk_score, _ = LPRiskScore.objects.update_or_create(
            store=store,
            report_date=report_date,
            defaults={
                'cash_ratio_value': cash_result['value'],
                'cash_ratio_risk': cash_result['risk'],
                'cash_ratio_points': cash_result['points'],
                'tip_percent_value': tip_result['value'],
                'tip_percent_risk': tip_result['risk'],
                'tip_percent_points': tip_result['points'],
                'low_ticket_value': low_ticket_result['value'],
                'low_ticket_risk': low_ticket_result['risk'],
                'low_ticket_points': low_ticket_result['points'],
                'base_points': base_points,
                'pattern_bonus': pattern_bonus,
                'total_score': total_score,
                'cash_amount': metrics['cash'],
                'cc_amount': metrics['cc'],
                'tip_amount': metrics['tip_amount'],
                'service_revenue': metrics['service_revenue'],
                'total_services': metrics['total_services'],
                'low_ticket_services': metrics['low_ticket_count'],
            }
        )
        
        return risk_score
    
    def generate_alerts_for_store(self, store: Store, risk_score: LPRiskScore) -> List[LPAlert]:
        """
        Generate LP alerts for medium/high risk indicators.
        """
        alerts = []
        thresholds = self.get_thresholds()
        
        # Only create alerts for medium and high risk
        indicators = [
            ('cash_ratio', risk_score.cash_ratio_risk, risk_score.cash_ratio_value, 
             thresholds['cash_ratio']['yellow'], thresholds['cash_ratio']['red']),
            ('tip_percent', risk_score.tip_percent_risk, risk_score.tip_percent_value,
             thresholds['tip_percent']['green_min'], thresholds['tip_percent']['yellow_high']),
            ('low_ticket', risk_score.low_ticket_risk, risk_score.low_ticket_value,
             thresholds['low_ticket']['yellow'], thresholds['low_ticket']['red']),
        ]
        
        for alert_type, risk_level, value, threshold_min, threshold_max in indicators:
            if risk_level in ['medium', 'high']:
                # Check if active alert already exists
                existing = LPAlert.objects.filter(
                    store=store,
                    alert_type=alert_type,
                    report_date=risk_score.report_date,
                    status__in=['new', 'investigating']
                ).first()
                
                if not existing:
                    alert = LPAlert.objects.create(
                        store=store,
                        alert_type=alert_type,
                        risk_level=risk_level,
                        calculated_value=value,
                        threshold_min=threshold_min,
                        threshold_max=threshold_max,
                        report_date=risk_score.report_date,
                    )
                    alerts.append(alert)
        
        return alerts
    
    def calculate_all_risk_scores(self, report_date: date) -> int:
        """
        Calculate LP risk scores for all active stores for a given date.
        Returns count of stores processed.
        """
        if self.tenant:
            stores = Store.objects.filter(tenant=self.tenant, status='active')
        else:
            stores = Store.objects.filter(status='active')
        
        count = 0
        for store in stores:
            self.tenant = store.tenant
            self._config = None  # Reset config for each tenant
            
            risk_score = self.calculate_risk_score_for_store(store, report_date)
            self.generate_alerts_for_store(store, risk_score)
            count += 1
        
        return count
    
    def calculate_resolved_this_week(self, store_ids: List[int]) -> Dict:
        """
        Calculate stores that transitioned from High Risk to Low/Good Risk this week.
        
        Business Logic (per client requirement):
        - A store is "resolved" if it was at High Risk (score >= 30) on day D-1
          and becomes Low/Good Risk (score < 15) on day D
        - Resolution must occur within the current calendar week (Monday-Sunday)
        - Each store is counted only once per week
        
        Returns: {count, change, change_label, resolved_store_ids}
        """
        today = timezone.now().date()
        # Get current week start (Monday)
        week_start = today - timedelta(days=today.weekday())
        
        resolved_stores = set()
        
        # We need to check transitions from day before week_start through today
        # So we start checking from week_start (comparing with week_start - 1)
        check_date = week_start
        while check_date <= today:
            previous_date = check_date - timedelta(days=1)
            
            # Get risk scores for both days for all stores
            current_scores = dict(
                LPRiskScore.objects.filter(
                    store_id__in=store_ids,
                    report_date=check_date
                ).values_list('store_id', 'total_score')
            )
            
            previous_scores = dict(
                LPRiskScore.objects.filter(
                    store_id__in=store_ids,
                    report_date=previous_date
                ).values_list('store_id', 'total_score')
            )
            
            # Find stores that transitioned from High Risk to Low/Good
            for store_id in store_ids:
                if store_id in resolved_stores:
                    continue  # Already counted this week
                
                prev_score = previous_scores.get(store_id)
                curr_score = current_scores.get(store_id)
                
                # Check transition: High Risk (>= 30) -> Low/Good (< 15)
                if prev_score is not None and curr_score is not None:
                    if prev_score >= 30 and curr_score < 15:
                        resolved_stores.add(store_id)
            
            check_date += timedelta(days=1)
        
        # Calculate last week's resolved count for comparison
        last_week_start = week_start - timedelta(days=7)
        last_week_end = week_start - timedelta(days=1)
        
        resolved_last_week = set()
        check_date = last_week_start
        while check_date <= last_week_end:
            previous_date = check_date - timedelta(days=1)
            
            current_scores = dict(
                LPRiskScore.objects.filter(
                    store_id__in=store_ids,
                    report_date=check_date
                ).values_list('store_id', 'total_score')
            )
            
            previous_scores = dict(
                LPRiskScore.objects.filter(
                    store_id__in=store_ids,
                    report_date=previous_date
                ).values_list('store_id', 'total_score')
            )
            
            for store_id in store_ids:
                if store_id in resolved_last_week:
                    continue
                
                prev_score = previous_scores.get(store_id)
                curr_score = current_scores.get(store_id)
                
                if prev_score is not None and curr_score is not None:
                    if prev_score >= 30 and curr_score < 15:
                        resolved_last_week.add(store_id)
            
            check_date += timedelta(days=1)
        
        resolved_count = len(resolved_stores)
        last_week_count = len(resolved_last_week)
        
        # NOTE: Auto-resolve removed - alerts should be managed separately, not during read operations
        
        return {
            'count': resolved_count,
            'change': resolved_count - last_week_count,
            'change_label': 'vs last week',
            'resolved_store_ids': list(resolved_stores),
        }
    
    def auto_resolve_alerts_for_stores(self, store_ids: List[int]) -> int:
        """
        Auto-resolve (close) active alerts for stores that have transitioned to low risk.
        
        When a store's risk score drops below the threshold (< 15), all active alerts
        for that store should be automatically resolved to keep metrics in sync.
        
        Returns: Number of alerts resolved
        """
        from django.utils import timezone as tz
        
        # Find all active alerts for these stores
        active_alerts = LPAlert.objects.filter(
            store_id__in=store_ids,
            status__in=['new', 'investigating']
        )
        
        resolved_count = active_alerts.count()
        
        # Update all active alerts to resolved status
        active_alerts.update(
            status='resolved',
            resolved_at=tz.now(),
            notes='Auto-resolved: Store risk score dropped below threshold'
        )
        
        return resolved_count
    
    def calculate_resolved_for_period(self, store_ids: List[int], start_date, end_date) -> Dict:
        """
        Calculates the number of stores that transitioned from High Risk to Low/Good Risk
        within the specified date period.
        """
        resolved_stores = set()
        check_date = start_date
        
        # Iterate through each day in the period
        while check_date <= end_date:
            previous_date = check_date - timedelta(days=1)
            
            # Get risk scores for both days
            current_scores = dict(
                LPRiskScore.objects.filter(
                    store_id__in=store_ids,
                    report_date=check_date
                ).values_list('store_id', 'total_score')
            )
            
            previous_scores = dict(
                LPRiskScore.objects.filter(
                    store_id__in=store_ids,
                    report_date=previous_date
                ).values_list('store_id', 'total_score')
            )
            
            # Find stores that transitioned from High Risk to Low/Good
            for store_id in store_ids:
                if store_id in resolved_stores:
                    continue
                
                prev_score = previous_scores.get(store_id)
                curr_score = current_scores.get(store_id)
                
                if prev_score is not None and curr_score is not None:
                    if prev_score >= 30 and curr_score < 15:
                        resolved_stores.add(store_id)
            
            check_date += timedelta(days=1)
        
        # Calculate previous period for comparison
        period_days = (end_date - start_date).days + 1
        prev_end_date = start_date - timedelta(days=1)
        prev_start_date = prev_end_date - timedelta(days=period_days - 1)
        
        resolved_prev_period = set()
        check_date = prev_start_date
        while check_date <= prev_end_date:
            previous_date = check_date - timedelta(days=1)
            
            current_scores = dict(
                LPRiskScore.objects.filter(
                    store_id__in=store_ids,
                    report_date=check_date
                ).values_list('store_id', 'total_score')
            )
            
            previous_scores = dict(
                LPRiskScore.objects.filter(
                    store_id__in=store_ids,
                    report_date=previous_date
                ).values_list('store_id', 'total_score')
            )
            
            for store_id in store_ids:
                if store_id in resolved_prev_period:
                    continue
                
                prev_score = previous_scores.get(store_id)
                curr_score = current_scores.get(store_id)
                
                if prev_score is not None and curr_score is not None:
                    if prev_score >= 30 and curr_score < 15:
                        resolved_prev_period.add(store_id)
            
            check_date += timedelta(days=1)
        
        resolved_count = len(resolved_stores)
        prev_count = len(resolved_prev_period)
        
        return {
            'count': resolved_count,
            'change': resolved_count - prev_count,
            'change_label': 'vs prev period',
        }
    
    def get_overview_metrics(self, stores, start_date=None, end_date=None) -> Dict:
        """
        Get aggregated overview metrics for dashboard KPIs.
        Accepts optional start_date and end_date for date range filtering.
        Week is defined as Monday-Sunday based on end_date.
        """
        now = timezone.now()
        today = now.date()
        
        # Use provided dates or default to current week (Mon-Sun)
        if not end_date:
            end_date = today
        if not start_date:
            # Default to Monday of the week containing end_date
            day_of_week = end_date.weekday()
            start_date = end_date - timedelta(days=day_of_week)
        
        # Calculate previous period for comparison (previous week Mon-Sun)
        period_days = (end_date - start_date).days + 1
        prev_end_date = start_date - timedelta(days=1)
        prev_start_date = prev_end_date - timedelta(days=period_days - 1)
        
        store_ids = list(stores.values_list('id', flat=True))
        
        # Get ALL risk scores within date range (for counting total flags across all days)
        all_risk_scores = LPRiskScore.objects.filter(
            store_id__in=store_ids,
            report_date__gte=start_date,
            report_date__lte=end_date
        )
        
        # Get latest score per store for risk distribution display
        risk_scores_qs = all_risk_scores.order_by('store_id', '-report_date')
        seen_stores = set()
        risk_scores_in_range = []
        for score in risk_scores_qs:
            if score.store_id not in seen_stores:
                seen_stores.add(score.store_id)
                risk_scores_in_range.append(score)
        
        # All alerts within date range (any status - date is the filter, not status)
        alerts_in_range = LPAlert.objects.filter(
            store_id__in=store_ids,
            risk_level__in=['medium', 'high'],
            report_date__gte=start_date,
            report_date__lte=end_date
        )
        alert_count = alerts_in_range.count()
        
        # Alerts in previous period for comparison
        alerts_prev_period = LPAlert.objects.filter(
            store_id__in=store_ids,
            risk_level__in=['medium', 'high'],
            report_date__gte=prev_start_date,
            report_date__lte=prev_end_date
        ).count()
        
        # High risk locations = unique stores with ANY flags in the week
        stores_with_flags = set()
        for score in all_risk_scores:
            flags = sum(1 for r in [score.cash_ratio_risk, score.tip_percent_risk, score.low_ticket_risk] 
                       if r in ['medium', 'high'])
            if flags > 0:
                stores_with_flags.add(score.store_id)
        high_risk_count = len(stores_with_flags)
        
        # Previous period high risk count for comparison
        prev_risk_scores = LPRiskScore.objects.filter(
            store_id__in=store_ids,
            report_date__gte=prev_start_date,
            report_date__lte=prev_end_date
        )
        prev_stores_with_flags = set()
        for score in prev_risk_scores:
            flags = sum(1 for r in [score.cash_ratio_risk, score.tip_percent_risk, score.low_ticket_risk] 
                       if r in ['medium', 'high'])
            if flags > 0:
                prev_stores_with_flags.add(score.store_id)
        prev_high_risk_count = len(prev_stores_with_flags)
        
        # Calculate average number of flags: total flags across ALL days / 7 (days in week)
        total_flags = 0
        for score in all_risk_scores:
            flags = sum(1 for r in [score.cash_ratio_risk, score.tip_percent_risk, score.low_ticket_risk] 
                       if r in ['medium', 'high'])
            total_flags += flags
        
        avg_flags = round(total_flags / 7, 1)  # Always divide by 7 (days in week)
        
        # Resolved within selected period
        resolved_data = self.calculate_resolved_for_period(store_ids, start_date, end_date)
        
        # Risk distribution based on flags - count unique stores by max flag count
        # A store is "high risk" if it has 2+ flags, "medium" if 1 flag, "low" if 0
        store_max_flags = {}  # store_id -> max flags count
        for score in all_risk_scores:
            flags = sum(1 for r in [score.cash_ratio_risk, score.tip_percent_risk, score.low_ticket_risk] 
                       if r in ['medium', 'high'])
            if score.store_id not in store_max_flags:
                store_max_flags[score.store_id] = flags
            else:
                store_max_flags[score.store_id] = max(store_max_flags[score.store_id], flags)
        
        risk_dist = {'high': 0, 'medium': 0, 'low': 0}
        for store_id, max_flags in store_max_flags.items():
            if max_flags >= 2:
                risk_dist['high'] += 1
            elif max_flags == 1:
                risk_dist['medium'] += 1
            else:
                risk_dist['low'] += 1
        
        # Fill in remaining stores (those without any risk scores) as low risk
        risk_dist['low'] = len(store_ids) - risk_dist['high'] - risk_dist['medium']
        if risk_dist['low'] < 0:
            risk_dist['low'] = 0
        
        return {
            'active_alerts': {
                'count': alert_count,
                'change': alert_count - alerts_prev_period,
                'change_label': 'vs prev period',
            },
            'high_risk_locations': {
                'count': high_risk_count,
                'change': high_risk_count - prev_high_risk_count,
                'change_label': 'vs prev period',
            },
            'locations_with_2_plus_alerts': high_risk_count,
            'avg_flags': {
                'count': avg_flags,
                'change': 0,
                'change_label': 'vs prev period',
            },
            'resolved_this_week': {
                'count': resolved_data['count'],
                'change': resolved_data['change'],
                'change_label': resolved_data['change_label'],
            },
            'risk_distribution': risk_dist,
            'summary': {
                'total_locations': len(store_ids),
                'total_alerts': alert_count,
            },
        }
    
    def get_flags_by_location(self, stores, report_date: date) -> List[Dict]:
        """
        Get flags (medium/high risk indicators) for each store on a specific date.
        Each store can have 0-3 flags based on:
        - Cash to Credit Ratio (high/low)
        - Tip Percentage (high/low)
        - Low-Ticket-Value Services (high %)
        
        Returns list of stores with their flag counts and details.
        """
        store_ids = list(stores.values_list('id', flat=True))
        
        # Get risk scores for the specific date
        risk_scores = LPRiskScore.objects.filter(
            store_id__in=store_ids,
            report_date=report_date
        ).select_related('store')
        
        result = []
        for score in risk_scores:
            flags = []
            flag_count = 0
            
            # Check each indicator for medium/high risk
            if score.cash_ratio_risk in ['medium', 'high']:
                flags.append({
                    'type': 'cash_ratio',
                    'label': 'Cash Ratio',
                    'risk_level': score.cash_ratio_risk,
                    'value': float(score.cash_ratio_value),
                })
                flag_count += 1
            
            if score.tip_percent_risk in ['medium', 'high']:
                flags.append({
                    'type': 'tip_percent',
                    'label': 'Tip %',
                    'risk_level': score.tip_percent_risk,
                    'value': float(score.tip_percent_value),
                })
                flag_count += 1
            
            if score.low_ticket_risk in ['medium', 'high']:
                flags.append({
                    'type': 'low_ticket',
                    'label': 'Low-Ticket %',
                    'risk_level': score.low_ticket_risk,
                    'value': float(score.low_ticket_value),
                })
                flag_count += 1
            
            # Only include stores with at least 1 flag
            if flag_count > 0:
                # Count high (red) and medium (orange) flags
                high_count = sum(1 for f in flags if f['risk_level'] == 'high')
                medium_count = sum(1 for f in flags if f['risk_level'] == 'medium')
                result.append({
                    'store_id': score.store.id,
                    'store_name': score.store.name,
                    'store_code': score.store.external_code,
                    'flag_count': flag_count,
                    'high_count': high_count,
                    'medium_count': medium_count,
                    'flags': flags,
                    'report_date': str(score.report_date),
                })
        
        # Sort by: 1) high (red) count desc, 2) medium (orange) count desc, 3) total flags desc
        result.sort(key=lambda x: (x['high_count'], x['medium_count'], x['flag_count']), reverse=True)
        
        return result
    
    def get_alerts_for_type(self, alert_type: str, stores, report_date: date = None, limit: int = 100) -> List[Dict]:
        """
        Get all locations with a specific alert type and their values.
        Used for alert detail page.
        Shows all alerts (any status) for the specified type.
        """
        store_ids = list(stores.values_list('id', flat=True))
        
        alerts_qs = LPAlert.objects.filter(
            store_id__in=store_ids,
            alert_type=alert_type,
            risk_level__in=['medium', 'high']
        ).select_related('store', 'store__tenant')
        
        # Filter by report_date if provided
        if report_date:
            alerts_qs = alerts_qs.filter(report_date=report_date)
        
        alerts = alerts_qs.order_by('-report_date', '-calculated_value')[:limit]
        
        result = []
        for alert in alerts:
            result.append({
                'id': alert.id,
                'store_id': alert.store.id,
                'store_name': alert.store.name,
                'store_code': alert.store.external_code,
                'risk_level': alert.risk_level,
                'calculated_value': float(alert.calculated_value),
                'threshold_min': float(alert.threshold_min) if alert.threshold_min else None,
                'threshold_max': float(alert.threshold_max) if alert.threshold_max else None,
                'report_date': str(alert.report_date),
                'detected_at': alert.detected_at.isoformat(),
                'status': alert.status,
            })
        
        return result
    
    def generate_lp_report_data(self, stores, report_date: Optional[date] = None) -> List[Dict]:
        """
        Generate LP report data for all stores (daily report).
        Returns data matching the Excel report format.
        """
        store_ids = list(stores.values_list('id', flat=True))
        
        # Get latest risk scores
        if report_date:
            scores = LPRiskScore.objects.filter(
                store_id__in=store_ids,
                report_date=report_date
            ).select_related('store', 'store__tenant')
        else:
            # Get latest score for each store
            scores = LPRiskScore.objects.filter(
                store_id__in=store_ids
            ).order_by('store', '-report_date').distinct('store').select_related('store', 'store__tenant')
        
        result = []
        for score in scores:
            # Count flags (medium or high risk indicators)
            flags = sum(1 for r in [score.cash_ratio_risk, score.tip_percent_risk, score.low_ticket_risk] 
                       if r in ['medium', 'high'])
            
            result.append({
                'center_name': score.store.name,
                'store_code': score.store.external_code,
                'cash_ratio_risk': score.cash_ratio_risk,
                'tip_percent_risk': score.tip_percent_risk,
                'low_ticket_risk': score.low_ticket_risk,
                'has_2plus_flags': flags >= 2,
                'flag_count': flags,
                'is_high_risk': score.total_score >= 30,
                'cash_percent': round(float(score.cash_ratio_value), 2),
                'tip_percent': round(float(score.tip_percent_value), 2),
                'low_ticket_percent': round(float(score.low_ticket_value), 2),
                'service_sales': float(score.service_revenue),
                'tip_amount': float(score.tip_amount),
                'credit_card': float(score.cc_amount),
                'cash_payment': float(score.cash_amount),
                'all_services': score.total_services,
                'low_ticket_services': score.low_ticket_services,
                'risk_score': score.total_score,
                'report_date': str(score.report_date),
            })
        
        # Sort by risk score descending
        result.sort(key=lambda x: x['risk_score'], reverse=True)
        
        return result
    
    def generate_weekly_lp_report_data(self, stores, start_date: date, end_date: date) -> List[Dict]:
        """
        Generate weekly LP report data with aggregated metrics.
        Provides average scores and trend analysis across the week.
        
        Returns data with enhanced weekly analytics.
        """
        store_ids = list(stores.values_list('id', flat=True))
        
        # Get all risk scores for the date range
        scores = LPRiskScore.objects.filter(
            store_id__in=store_ids,
            report_date__gte=start_date,
            report_date__lte=end_date
        ).select_related('store', 'store__tenant').order_by('store', 'report_date')
        
        # Group scores by store
        store_scores = {}
        for score in scores:
            store_id = score.store.id
            if store_id not in store_scores:
                store_scores[store_id] = {
                    'store': score.store,
                    'scores': [],
                }
            store_scores[store_id]['scores'].append(score)
        
        result = []
        for store_id, data in store_scores.items():
            store = data['store']
            daily_scores = data['scores']
            
            if not daily_scores:
                continue
            
            # Calculate aggregated metrics
            avg_cash_ratio = sum(s.cash_ratio_value for s in daily_scores) / len(daily_scores)
            avg_tip_percent = sum(s.tip_percent_value for s in daily_scores) / len(daily_scores)
            avg_low_ticket = sum(s.low_ticket_value for s in daily_scores) / len(daily_scores)
            avg_risk_score = sum(s.total_score for s in daily_scores) / len(daily_scores)
            
            # Determine overall risk level based on average
            if avg_risk_score >= 30:
                overall_risk = 'high'
            elif avg_risk_score >= 15:
                overall_risk = 'medium'
            else:
                overall_risk = 'low'
            
            # Calculate risk trend (comparing first and last day)
            if len(daily_scores) >= 2:
                first_score = daily_scores[0].total_score
                last_score = daily_scores[-1].total_score
                if last_score < first_score:
                    trend = 'improving'
                elif last_score > first_score:
                    trend = 'worsening'
                else:
                    trend = 'stable'
            else:
                trend = 'stable'
            
            # Count days at each risk level
            high_risk_days = sum(1 for s in daily_scores if s.total_score >= 30)
            medium_risk_days = sum(1 for s in daily_scores if 15 <= s.total_score < 30)
            low_risk_days = sum(1 for s in daily_scores if s.total_score < 15)
            
            # Count flagged days (2+ indicators flagged)
            flagged_days = 0
            for s in daily_scores:
                flags = sum(1 for r in [s.cash_ratio_risk, s.tip_percent_risk, s.low_ticket_risk] 
                           if r in ['medium', 'high'])
                if flags >= 2:
                    flagged_days += 1
            
            # Aggregate raw values
            total_service_sales = sum(float(s.service_revenue) for s in daily_scores)
            total_tip_amount = sum(float(s.tip_amount) for s in daily_scores)
            total_cc = sum(float(s.cc_amount) for s in daily_scores)
            total_cash = sum(float(s.cash_amount) for s in daily_scores)
            total_services = sum(s.total_services for s in daily_scores)
            total_low_ticket_services = sum(s.low_ticket_services for s in daily_scores)
            
            result.append({
                'center_name': store.name,
                'store_code': store.external_code,
                'days_in_range': len(daily_scores),
                'avg_risk_score': round(float(avg_risk_score), 1),
                'overall_risk': overall_risk,
                'trend': trend,
                'high_risk_days': high_risk_days,
                'medium_risk_days': medium_risk_days,
                'low_risk_days': low_risk_days,
                'flagged_days': flagged_days,
                'cash_ratio_risk': 'high' if float(avg_cash_ratio) >= 30 else ('medium' if float(avg_cash_ratio) >= 25 else 'low'),
                'tip_percent_risk': 'high' if float(avg_tip_percent) < 12 or float(avg_tip_percent) > 35 else ('medium' if float(avg_tip_percent) < 18 or float(avg_tip_percent) > 30 else 'low'),
                'low_ticket_risk': 'high' if float(avg_low_ticket) >= 10 else ('medium' if float(avg_low_ticket) >= 5 else 'low'),
                'has_2plus_flags': flagged_days > 0,
                'flag_count': flagged_days,
                'is_high_risk': avg_risk_score >= 30,
                'cash_percent': round(float(avg_cash_ratio), 2),
                'tip_percent': round(float(avg_tip_percent), 2),
                'low_ticket_percent': round(float(avg_low_ticket), 2),
                'service_sales': total_service_sales,
                'tip_amount': total_tip_amount,
                'credit_card': total_cc,
                'cash_payment': total_cash,
                'all_services': total_services,
                'low_ticket_services': total_low_ticket_services,
                'risk_score': round(float(avg_risk_score)),
                'report_date': f"{start_date} to {end_date}",
            })
        
        # Sort by average risk score descending
        result.sort(key=lambda x: x['avg_risk_score'], reverse=True)
        
        return result
    
    def process_sales_accrual_service_counts(self, raw_data: list, report_date: date) -> Dict[str, Tuple[int, int]]:
        """
        Process sales-accrual raw data to count services per store.
        Creates ReportMetric entries for total_services and low_ticket_services.
        Low-ticket services are identified by Item Category = "Beard-Neck Grooming Services".
        Returns: {center_name: (total_services, low_ticket_count)}
        """
        from collections import defaultdict
        
        # Low-ticket category name
        LOW_TICKET_CATEGORY = "Beard-Neck Grooming Services"
        
        # Count services per store (keyed by Center Name)
        store_counts = defaultdict(lambda: {'total': 0, 'low_ticket': 0})
        
        for row in raw_data:
            item_type = row.get('Item Type', '')
            if item_type != 'Service':
                continue
            
            # Get store identifier by Center Name
            center_name = row.get('Center Name') or row.get('Center Name ')
            if not center_name:
                continue
            center_name = str(center_name).strip()
            
            store_counts[center_name]['total'] += 1
            
            # Check if low ticket service by Item Category
            item_category = row.get('Item Category', '')
            if item_category and item_category.strip() == LOW_TICKET_CATEGORY:
                store_counts[center_name]['low_ticket'] += 1
        
        # Create ReportMetric entries for each store
        metrics_created = 0
        for center_name, counts in store_counts.items():
            # Find the store by matching Center Name with store name in database
            store = Store.objects.filter(name=center_name).first()
            
            if not store:
                # Skip if store not found
                continue
            
            # Create metrics
            ReportMetric.objects.update_or_create(
                store=store,
                report_type='sales-accrual',
                report_date=report_date,
                metric_name='total_services',
                defaults={'metric_value': counts['total']}
            )
            ReportMetric.objects.update_or_create(
                store=store,
                report_type='sales-accrual',
                report_date=report_date,
                metric_name='low_ticket_services',
                defaults={'metric_value': counts['low_ticket']}
            )
            metrics_created += 2
        
        return dict(store_counts)
