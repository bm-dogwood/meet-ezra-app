from django.db import models
from django.contrib.auth.models import AbstractUser


class Tenant(models.Model):
    name = models.CharField(max_length=255, unique=True)
    code = models.CharField(max_length=100, unique=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Franchisee'
        verbose_name_plural = 'Franchisees'
        indexes = [
            models.Index(fields=['code'], name='api_tenant_code_idx'),
            models.Index(fields=['is_active'], name='api_tenant_active_idx'),
        ]

    def __str__(self):
        return f"{self.name} ({self.code})"


class User(AbstractUser):
    ROLE_CHOICES = [
        ('super_admin', 'Super Admin'),
        ('franchisor_admin', 'Franchisor Admin'),
        ('franchise_user', 'Franchise User'),
    ]
    
    email = models.EmailField('email address', unique=True)
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE, null=True, blank=True, related_name='users')
    role = models.CharField(max_length=50, choices=ROLE_CHOICES, default='franchise_user')
    
    class Meta:
        db_table = 'users'
        indexes = [
            models.Index(fields=['tenant'], name='api_user_tenant_idx'),
            models.Index(fields=['email'], name='api_user_email_idx'),
            models.Index(fields=['role'], name='api_user_role_idx'),
            models.Index(fields=['tenant', 'role'], name='api_user_tenant_role_idx'),
        ]


class Store(models.Model):
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('inactive', 'Inactive'),
    ]
    
    # Internal status choices (includes onboarding for existing data)
    ALL_STATUS_CHOICES = [
        ('active', 'Active'),
        ('inactive', 'Inactive'),
        ('onboarding', 'Onboarding'),
    ]
    
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE, related_name='stores')
    name = models.CharField(max_length=255)
    external_code = models.CharField(max_length=100, null=True, blank=True, unique=True)
    city = models.CharField(max_length=100, null=True, blank=True)
    state = models.CharField(max_length=50, null=True, blank=True)
    daily_revenue_target = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    daily_labor_target_hours = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    display_name = models.CharField(max_length=255, blank=True, default='', help_text='Client-friendly store name for SMS messages')
    address = models.CharField(max_length=500, blank=True, default='', help_text='Store address for SMS messages')
    booking_link = models.URLField(max_length=500, blank=True, default='', help_text='Booking link URL for SMS messages')
    last_synced_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [
            models.Index(fields=['tenant'], name='api_store_tenant_idx'),
            models.Index(fields=['status'], name='api_store_status_idx'),
            models.Index(fields=['tenant', 'status'], name='api_store_tenant_status_idx'),
            models.Index(fields=['external_code'], name='api_store_external_code_idx'),
            models.Index(fields=['last_synced_at'], name='api_store_last_synced_idx'),
        ]

    def __str__(self):
        return f"{self.name} ({self.tenant.name})"
    
    @property
    def is_active(self):
        """Check if store is active based on status field"""
        return self.status == 'active'


class RawReport(models.Model):
    REPORT_TYPE_CHOICES = [
        ('sales', 'Sales'),
        ('production', 'Production'),
        ('sales-accrual', 'Sales Accrual'),
        ('attendance', 'Attendance'),
        ('business-kpi', 'Business KPI'),
        ('performance-by-hour', 'Performance By Hour'),
        ('statutory-pay', 'Statutory Pay'),
        ('appointments', 'Appointments'),
        ('guest-opt-outs', 'Guest Opt-outs'),
        ('manage-guests', 'Manage Guests'),
        ('sms-opt-in', 'SMS Opt-In'),
    ]
    
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE, related_name='raw_reports')
    report_type = models.CharField(max_length=50, choices=REPORT_TYPE_CHOICES)
    report_date = models.DateField()
    raw_data = models.JSONField()
    ingested_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-report_date']
        indexes = [
            models.Index(fields=['tenant', 'report_type', 'report_date'], name='api_rawreport_unique_idx'),
            models.Index(fields=['tenant'], name='api_rawreport_tenant_idx'),
            models.Index(fields=['report_type'], name='api_rawreport_type_idx'),
            models.Index(fields=['report_date'], name='api_rawreport_date_idx'),
            models.Index(fields=['ingested_at'], name='api_rawreport_ingested_idx'),
        ]

    def __str__(self):
        return f"{self.report_type} - {self.report_date}"


class ReportMetric(models.Model):
    store = models.ForeignKey(Store, on_delete=models.CASCADE, related_name='metrics')
    report_type = models.CharField(max_length=50)
    report_date = models.DateField()
    metric_name = models.CharField(max_length=100)
    metric_value = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True)
    metric_text = models.CharField(max_length=255, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [
            models.Index(fields=['store', 'report_type', 'report_date']),
            models.Index(fields=['store', 'report_date', 'metric_name']),
        ]

    def __str__(self):
        return f"{self.metric_name}: {self.metric_value or self.metric_text}"
    
    @property
    def tenant(self):
        """Get tenant from store"""
        return self.store.tenant if self.store else None


class StoreTarget(models.Model):
    """
    Daily revenue and labor targets for stores.
    Used in Set Goals page and for KPI comparisons.
    Each record represents a target for a specific date.
    """
    store = models.ForeignKey(Store, on_delete=models.CASCADE, related_name='targets')
    target_date = models.DateField()  # Specific date for the target
    revenue_target = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    labor_target_hours = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ['store', 'target_date']
        indexes = [
            models.Index(fields=['store', 'target_date']),
        ]

    def __str__(self):
        return f"{self.store.name} - {self.target_date}: ${self.revenue_target}"


class PasswordResetOTP(models.Model):
    """
    Stores OTP for password reset flow.
    Includes pre-hashed new password to be applied upon OTP verification.
    """
    email = models.EmailField()
    otp = models.CharField(max_length=6)
    new_password_hash = models.CharField(max_length=255)
    is_used = models.BooleanField(default=False)
    expires_at = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [
            models.Index(fields=['email', 'otp']),
        ]

    def __str__(self):
        return f"OTP for {self.email} - {'Used' if self.is_used else 'Active'}"
    
    @property
    def is_expired(self):
        from django.utils import timezone
        return timezone.now() > self.expires_at


class LPAlertConfig(models.Model):
    """
    Configurable LP thresholds per tenant.
    View-only for franchisee admin and super admin.
    """
    tenant = models.OneToOneField(Tenant, on_delete=models.CASCADE, related_name='lp_config')
    
    # Cash Ratio Thresholds
    cash_ratio_yellow_min = models.DecimalField(max_digits=5, decimal_places=2, default=25.00)
    cash_ratio_red_min = models.DecimalField(max_digits=5, decimal_places=2, default=30.00)
    
    # Tip Percentage Thresholds
    tip_percent_green_min = models.DecimalField(max_digits=5, decimal_places=2, default=18.00)
    tip_percent_green_max = models.DecimalField(max_digits=5, decimal_places=2, default=30.00)
    tip_percent_yellow_low = models.DecimalField(max_digits=5, decimal_places=2, default=12.00)
    tip_percent_yellow_high = models.DecimalField(max_digits=5, decimal_places=2, default=35.00)
    
    # Low Ticket Thresholds
    low_ticket_yellow_min = models.DecimalField(max_digits=5, decimal_places=2, default=5.00)
    low_ticket_red_min = models.DecimalField(max_digits=5, decimal_places=2, default=10.00)
    
    # Risk Points (configurable)
    risk_points_low = models.IntegerField(default=0)
    risk_points_medium = models.IntegerField(default=15)
    risk_points_high = models.IntegerField(default=30)
    
    # Pattern Bonus (configurable)
    pattern_bonus_2_red = models.IntegerField(default=10)
    pattern_bonus_2_flagged = models.IntegerField(default=7)
    pattern_bonus_2_yellow = models.IntegerField(default=5)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"LP Config for {self.tenant.name}"


class LowTicketService(models.Model):
    """
    Define which services are considered low-ticket per tenant.
    Default: Beard Trim, Neck Trim, Specialty
    """
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE, related_name='low_ticket_services')
    service_name = models.CharField(max_length=100)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['tenant', 'service_name']

    def __str__(self):
        return f"{self.service_name} ({self.tenant.name})"


class LPRiskScore(models.Model):
    """
    Daily LP risk score snapshot per store.
    Pre-calculated for performance.
    """
    store = models.ForeignKey(Store, on_delete=models.CASCADE, related_name='lp_risk_scores')
    report_date = models.DateField()
    
    # Individual indicator values and risk levels
    cash_ratio_value = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    cash_ratio_risk = models.CharField(max_length=20, default='low')  # low/medium/high
    cash_ratio_points = models.IntegerField(default=0)
    
    tip_percent_value = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    tip_percent_risk = models.CharField(max_length=20, default='low')
    tip_percent_points = models.IntegerField(default=0)
    
    low_ticket_value = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    low_ticket_risk = models.CharField(max_length=20, default='low')
    low_ticket_points = models.IntegerField(default=0)
    
    # Aggregated scores
    base_points = models.IntegerField(default=0)
    pattern_bonus = models.IntegerField(default=0)
    total_score = models.IntegerField(default=0)  # Capped at 100
    
    # Raw data snapshot for report
    cash_amount = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    cc_amount = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    tip_amount = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    service_revenue = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    total_services = models.IntegerField(default=0)
    low_ticket_services = models.IntegerField(default=0)
    
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['store', 'report_date']
        indexes = [
            models.Index(fields=['store', 'report_date']),
            models.Index(fields=['total_score']),
            models.Index(fields=['report_date']),
        ]

    def __str__(self):
        return f"{self.store.name} - {self.report_date}: Score {self.total_score}"


class LPAlert(models.Model):
    """
    LP alerts generated when risk thresholds are exceeded.
    """
    ALERT_TYPE_CHOICES = [
        ('cash_ratio', 'High Cash to Credit Ratio'),
        ('tip_percent', 'Abnormal Tip Percentage'),
        ('low_ticket', 'High % of Low-Ticket Services'),
    ]
    
    RISK_LEVEL_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
    ]
    
    STATUS_CHOICES = [
        ('new', 'New'),
        ('investigating', 'Investigating'),
        ('resolved', 'Resolved'),
        ('dismissed', 'Dismissed'),
    ]
    
    store = models.ForeignKey(Store, on_delete=models.CASCADE, related_name='lp_alerts')
    alert_type = models.CharField(max_length=50, choices=ALERT_TYPE_CHOICES)
    risk_level = models.CharField(max_length=20, choices=RISK_LEVEL_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='new')
    
    # Calculated values that triggered the alert
    calculated_value = models.DecimalField(max_digits=10, decimal_places=2)
    threshold_min = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    threshold_max = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    
    # Metadata
    report_date = models.DateField()
    detected_at = models.DateTimeField(auto_now_add=True)
    resolved_at = models.DateTimeField(null=True, blank=True)
    resolved_by = models.ForeignKey('User', on_delete=models.SET_NULL, null=True, blank=True)
    notes = models.TextField(blank=True)

    class Meta:
        indexes = [
            models.Index(fields=['store', 'alert_type', 'report_date']),
            models.Index(fields=['status']),
            models.Index(fields=['risk_level']),
            models.Index(fields=['detected_at']),
        ]
        ordering = ['-detected_at']

    def __str__(self):
        return f"{self.get_alert_type_display()} - {self.store.name} ({self.risk_level})"


class AppConfig(models.Model):
    name = models.CharField(max_length=512, unique=True)
    value = models.JSONField(default=dict)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'app_config'
        verbose_name = 'Application Configuration'

    @classmethod
    def get_config_value(cls, name, default=None):
        """Retrieve JSON value by config name, returning default if not found."""
        try:
            return cls.objects.get(name=name).value
        except cls.DoesNotExist:
            return default

    def __str__(self):
        return self.name


class ReportSchedule(models.Model):
    REPORT_TYPE_CHOICES = [
        ('daily', 'Daily Sales Flash'),
        ('weekly', 'Weekly Sales Summary'),
        ('lp', 'LP Risk Analysis'),
        ('scheduling', 'Scheduling Report'),
        ('exponential', 'Exponential Report'),
    ]

    LAST_RUN_STATUS_CHOICES = [
        ('success', 'Success'),
        ('failed', 'Failed'),
        ('partial', 'Partial'),
    ]

    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE, related_name='report_schedules')
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_schedules')
    name = models.CharField(max_length=255, default='', blank=True)
    report_types = models.JSONField(default=list)
    cron_expression = models.CharField(max_length=100, default='0 0 * * *')
    schedule_time = models.TimeField()
    timezone = models.CharField(max_length=50)
    recipients = models.JSONField(default=list)
    is_active = models.BooleanField(default=True)
    last_run_at = models.DateTimeField(null=True, blank=True)
    last_run_status = models.CharField(max_length=20, choices=LAST_RUN_STATUS_CHOICES, null=True, blank=True)
    last_run_error = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'report_schedules'
        indexes = [
            models.Index(fields=['tenant'], name='rs_tenant_idx'),
            models.Index(fields=['is_active'], name='rs_active_idx'),
            models.Index(fields=['cron_expression', 'timezone'], name='rs_cron_tz_idx'),
        ]
        constraints = [
            models.UniqueConstraint(fields=['tenant', 'name'], name='rs_unique_name_per_tenant'),
        ]

    @property
    def cron_key(self):
        """Unique key for grouping schedules into a single K8s CronJob."""
        return f"{self.cron_expression}|{self.timezone}"

    def __str__(self):
        types_display = ', '.join(self.report_types) if self.report_types else 'no types'
        return f"{types_display} - {self.schedule_time} {self.timezone}"



# ===========================================
# EZRA EXPONENTIAL - Customer Follow-up Models
# ===========================================

class ExponentialCustomer(models.Model):
    """Customer/guest profile for Exponential CRM replacement."""
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE, null=True, blank=True, related_name='exp_customers')
    store = models.ForeignKey(Store, on_delete=models.CASCADE, null=True, blank=True, related_name='exp_customers')
    guest_code = models.CharField(max_length=100)
    guest_name = models.CharField(max_length=255)
    phone = models.CharField(max_length=20, blank=True, null=True)
    sms_opt_in = models.BooleanField(default=False)
    total_visits = models.IntegerField(default=0)
    last_visit_date = models.DateField(null=True, blank=True)
    previous_visit_date = models.DateField(null=True, blank=True)
    last_service = models.CharField(max_length=255, blank=True, default='', help_text='Last service type from sales-accrual data')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'exp_customers'
        unique_together = ['tenant', 'guest_code']
        indexes = [
            models.Index(fields=['tenant', 'store'], name='exp_cust_tenant_store_idx'),
            models.Index(fields=['last_visit_date'], name='exp_cust_last_visit_idx'),
            models.Index(fields=['sms_opt_in'], name='exp_cust_sms_opt_idx'),
        ]

    def __str__(self):
        return f"{self.guest_name} ({self.guest_code})"


class ExponentialVisit(models.Model):
    """Individual guest visit record."""
    customer = models.ForeignKey(ExponentialCustomer, on_delete=models.CASCADE, related_name='visits')
    store = models.ForeignKey(Store, on_delete=models.CASCADE, related_name='exp_visits')
    visit_date = models.DateField()
    center_name = models.CharField(max_length=255, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'exp_visits'
        indexes = [
            models.Index(fields=['customer', 'visit_date'], name='exp_visit_cust_date_idx'),
            models.Index(fields=['store', 'visit_date'], name='exp_visit_store_date_idx'),
        ]

    def __str__(self):
        return f"{self.customer.guest_name} - {self.visit_date}"


class SegmentConfig(models.Model):
    """Configurable customer segment definitions per tenant."""
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE, related_name='segment_configs')
    name = models.CharField(max_length=100, help_text='Display name, e.g. "4-6 weeks"')
    slug = models.SlugField(max_length=50, help_text='Unique key, e.g. "4_6wk"')
    min_days = models.IntegerField(help_text='Minimum days since last visit (inclusive)')
    max_days = models.IntegerField(null=True, blank=True, help_text='Maximum days since last visit (inclusive). Null = no upper limit.')
    risk_level = models.CharField(max_length=20, default='medium', choices=[
        ('low', 'Low'), ('medium', 'Medium'), ('high', 'High'),
    ])
    color = models.CharField(max_length=20, default='warning', help_text='UI color key: success, warning, danger')
    sort_order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'segment_configs'
        unique_together = ['tenant', 'slug']
        ordering = ['sort_order']

    def __str__(self):
        upper = f"-{self.max_days}" if self.max_days else "+"
        return f"{self.name} ({self.min_days}{upper} days)"

    @classmethod
    def get_defaults(cls):
        """Return default segment definitions per client spec."""
        return [
            {'name': '4-6 weeks', 'slug': '4_6wk', 'min_days': 28, 'max_days': 42, 'risk_level': 'low', 'color': 'success', 'sort_order': 0},
            {'name': '4-8 weeks', 'slug': '4_8wk', 'min_days': 28, 'max_days': 56, 'risk_level': 'medium', 'color': 'warning', 'sort_order': 1},
            {'name': '8+ weeks', 'slug': '8wk_plus', 'min_days': 57, 'max_days': None, 'risk_level': 'high', 'color': 'danger', 'sort_order': 2},
        ]

    @classmethod
    def get_for_tenant(cls, tenant):
        """Get segment configs for a tenant, creating defaults if none exist."""
        try:
            configs = list(cls.objects.filter(tenant=tenant, is_active=True))
            if not configs:
                configs = []
                for d in cls.get_defaults():
                    cfg, _ = cls.objects.get_or_create(tenant=tenant, slug=d['slug'], defaults=d)
                    configs.append(cfg)
            return configs
        except Exception:
            return []  # Table doesn't exist yet


class ExponentialSegment(models.Model):
    """Customer segment assignment (4wk/6wk/8wk bucket)."""
    BUCKET_CHOICES = [
        ('4wk', '4-Week (Low Churn Risk)'),
        ('6wk', '6-Week (Medium Churn Risk)'),
        ('8wk', '8-Week (High Churn Risk)'),
    ]
    customer = models.ForeignKey(ExponentialCustomer, on_delete=models.CASCADE, related_name='segments')
    store = models.ForeignKey(Store, on_delete=models.CASCADE, related_name='exp_segments')
    bucket = models.CharField(max_length=10, choices=BUCKET_CHOICES)
    days_since_last_visit = models.IntegerField(default=0)
    visits_last_30_days = models.IntegerField(default=0)
    assigned_at = models.DateField(auto_now_add=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'exp_segments'
        indexes = [
            models.Index(fields=['bucket'], name='exp_seg_bucket_idx'),
            models.Index(fields=['store', 'bucket'], name='exp_seg_store_bucket_idx'),
        ]

    def __str__(self):
        return f"{self.customer.guest_name} → {self.bucket}"


class ExponentialCampaign(models.Model):
    """SMS campaign record."""
    STATUS_CHOICES = [
        ('scheduled', 'Scheduled'),
        ('active', 'Active'),
        ('paused', 'Paused'),
        ('completed', 'Completed'),
    ]
    SCOPE_CHOICES = [
        ('all', 'All Locations'),
        ('single', 'Single Location'),
        ('multi', 'Multiple Locations'),
        ('guests', 'Specific Guests'),
    ]
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE, related_name='exp_campaigns')
    store = models.ForeignKey(Store, on_delete=models.CASCADE, null=True, blank=True, related_name='exp_campaigns')
    name = models.CharField(max_length=255)
    target_bucket = models.CharField(max_length=100)
    message_template = models.TextField()
    coupon_value = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    coupon_code = models.CharField(max_length=50, blank=True, default='')
    booking_link = models.URLField(max_length=500, blank=True, default='')
    template_variables = models.JSONField(default=dict, blank=True, help_text='User-supplied template variable values, e.g. {"coupon_value":"20","coupon_code":"SAVE20"}')
    scope = models.CharField(max_length=10, choices=SCOPE_CHOICES, default='all')
    location_ids = models.JSONField(default=list, blank=True, help_text='List of store IDs for multi-location scope')
    guest_ids = models.JSONField(default=list, blank=True, help_text='List of guest codes for guest-targeted scope')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='scheduled')
    messages_sent = models.IntegerField(default=0)
    messages_delivered = models.IntegerField(default=0)
    messages_failed = models.IntegerField(default=0)
    scheduled_at = models.DateTimeField(null=True, blank=True, help_text='When the campaign should be sent')
    started_at = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    # Recurring campaign fields
    is_recurring = models.BooleanField(default=False)
    recurring_frequency = models.CharField(max_length=20, blank=True, default='', help_text='daily|weekly|biweekly|monthly')
    recurring_end_date = models.DateField(null=True, blank=True)
    recurring_start_date = models.DateField(null=True, blank=True)
    recurring_time = models.CharField(max_length=5, blank=True, default='', help_text='HH:MM in campaign timezone')
    recurring_day_of_week = models.IntegerField(null=True, blank=True, help_text='0=Monday, 6=Sunday. Used for weekly/biweekly/monthly.')
    campaign_timezone = models.CharField(max_length=50, blank=True, default='America/New_York', help_text='IANA timezone for scheduling')
    last_recurring_run = models.DateTimeField(null=True, blank=True)
    service_filter = models.TextField(blank=True, default='', help_text='Filter eligible customers by last_service (comma-separated for OR)')
    visit_date_from = models.DateField(null=True, blank=True, help_text='Filter customers with last_visit_date >= this date')
    visit_date_to = models.DateField(null=True, blank=True, help_text='Filter customers with last_visit_date <= this date')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'exp_campaigns'
        indexes = [
            models.Index(fields=['tenant', 'status'], name='exp_camp_tenant_status_idx'),
            models.Index(fields=['target_bucket'], name='exp_camp_bucket_idx'),
            models.Index(fields=['scheduled_at'], name='exp_camp_scheduled_idx'),
        ]

    def __str__(self):
        return f"{self.name} ({self.target_bucket})"


class ExponentialSMSLog(models.Model):
    """Individual SMS message log."""
    STATUS_CHOICES = [
        ('queued', 'Queued'),
        ('sent', 'Sent'),
        ('delivered', 'Delivered'),
        ('undelivered', 'Undelivered'),
        ('failed', 'Failed'),
    ]
    campaign = models.ForeignKey(ExponentialCampaign, on_delete=models.CASCADE, related_name='sms_logs')
    customer = models.ForeignKey(ExponentialCustomer, on_delete=models.CASCADE, related_name='sms_logs')
    segment_at_send = models.CharField(max_length=100)
    coupon_value = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    message_body = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='queued')
    twilio_message_sid = models.CharField(max_length=64, blank=True, null=True, db_index=True, help_text='Twilio message SID')
    sent_at = models.DateTimeField(auto_now_add=True)
    delivered_at = models.DateTimeField(null=True, blank=True)
    error_message = models.TextField(blank=True, default='')
    twilio_error_code = models.CharField(max_length=20, blank=True, default='')
    price = models.DecimalField(max_digits=8, decimal_places=4, null=True, blank=True, help_text='SMS cost from Twilio')

    class Meta:
        db_table = 'exp_sms_logs'
        indexes = [
            models.Index(fields=['campaign', 'status'], name='exp_sms_camp_status_idx'),
            models.Index(fields=['customer', 'sent_at'], name='exp_sms_cust_sent_idx'),
        ]


class ExponentialUptake(models.Model):
    """Tracks whether a customer returned after receiving SMS."""
    sms_log = models.OneToOneField(ExponentialSMSLog, on_delete=models.CASCADE, related_name='uptake')
    customer = models.ForeignKey(ExponentialCustomer, on_delete=models.CASCADE, related_name='uptakes')
    return_visit_date = models.DateField()
    days_to_return = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'exp_uptakes'


class SMSTemplate(models.Model):
    """Reusable SMS message template for Exponential campaigns."""
    BUCKET_CHOICES = [
        ('4wk', '4-Week (Low Churn Risk)'),
        ('6wk', '6-Week (Medium Churn Risk)'),
        ('8wk', '8-Week (High Churn Risk)'),
    ]
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE, related_name='sms_templates')
    template_id = models.CharField(max_length=100, help_text='Unique slug identifier e.g. 4wk_default')
    name = models.CharField(max_length=255)
    bucket = models.CharField(max_length=10, choices=BUCKET_CHOICES)
    body = models.TextField(help_text='Template body. Placeholders: {guest_name}, {store_name}, {coupon_value}')
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'sms_templates'
        unique_together = [('tenant', 'template_id')]
        indexes = [
            models.Index(fields=['tenant', 'bucket', 'is_active'], name='sms_tpl_tenant_bucket_idx'),
        ]

    def __str__(self):
        return f"{self.name} ({self.bucket})"



class GuestImport(models.Model):
    """Tracks each guest import batch (CSV/Excel upload)."""
    STATUS_CHOICES = [
        ('pending', 'Pending Mapping'),
        ('mapped', 'Mapped'),
        ('processing', 'Processing'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
    ]
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE, related_name='guest_imports')
    uploaded_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='guest_imports')
    file_name = models.CharField(max_length=255)
    file_size = models.IntegerField(default=0, help_text='File size in bytes')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    total_rows = models.IntegerField(default=0)
    created_count = models.IntegerField(default=0)
    updated_count = models.IntegerField(default=0)
    error_count = models.IntegerField(default=0)
    errors = models.JSONField(default=list, blank=True, help_text='List of row-level errors')
    # Column mapping: user's column name → our field name
    # e.g. {"Client Name": "first_name", "Mobile": "phone", ...}
    column_mapping = models.JSONField(default=dict, blank=True)
    # Store detected headers from the uploaded file
    detected_headers = models.JSONField(default=list, blank=True)
    # Raw parsed rows (stored temporarily for 2-step mapping flow)
    raw_rows = models.JSONField(default=list, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = 'guest_imports'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['tenant', 'status'], name='guest_imp_tenant_status_idx'),
            models.Index(fields=['created_at'], name='guest_imp_created_idx'),
        ]

    def __str__(self):
        return f"{self.file_name} ({self.status}) - {self.tenant.name}"


# ExponentialConfig is managed via AppConfig table with key 'exponential_config'
# See constants.py DEFAULT_EXPONENTIAL_CONFIG for defaults


# ===========================================
# EZRA SCHEDULING - Labor Optimization Models
# ===========================================

class SchedulingTimeBucket(models.Model):
    """Time-bucketed labor and demand data per store per day."""
    BUCKET_CHOICES = [
        ('9AM-12PM', '9AM-12PM'),
        ('12PM-2PM', '12PM-2PM'),
        ('2PM-5PM', '2PM-5PM'),
        ('5PM-9PM', '5PM-9PM'),
    ]
    store = models.ForeignKey(Store, on_delete=models.CASCADE, related_name='sched_time_buckets')
    date = models.DateField()
    time_bucket = models.CharField(max_length=20, choices=BUCKET_CHOICES)
    revenue = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    guest_tickets = models.IntegerField(default=0)
    labor_hours = models.DecimalField(max_digits=8, decimal_places=2, default=0)
    scheduled_hours = models.DecimalField(max_digits=8, decimal_places=2, default=0)
    avg_payroll_rate = models.DecimalField(max_digits=8, decimal_places=2, default=0)
    is_idle = models.BooleanField(default=False)
    idle_hour_count = models.IntegerField(default=0, help_text='Number of individual hours within this bucket where Guest Serviced/Floor Hour == 0')
    total_hour_count = models.IntegerField(default=0, help_text='Total number of hours with data in this bucket')
    idle_hours_detail = models.JSONField(default=dict, blank=True, help_text='Per-hour idle flags keyed by 24h int, e.g. {"9": true, "10": false}')
    work_center = models.CharField(max_length=100, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'sched_time_buckets'
        unique_together = ['store', 'date', 'time_bucket', 'work_center']
        indexes = [
            models.Index(fields=['store', 'date'], name='sched_tb_store_date_idx'),
            models.Index(fields=['time_bucket'], name='sched_tb_bucket_idx'),
            models.Index(fields=['is_idle'], name='sched_tb_idle_idx'),
        ]

    def __str__(self):
        return f"{self.store} - {self.date} {self.time_bucket}"


class SchedulingDailyMetrics(models.Model):
    """Daily aggregated scheduling metrics per store."""
    store = models.ForeignKey(Store, on_delete=models.CASCADE, related_name='sched_daily_metrics')
    date = models.DateField()
    total_revenue = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    total_payroll_hours = models.DecimalField(max_digits=8, decimal_places=2, default=0)
    total_scheduled_hours = models.DecimalField(max_digits=8, decimal_places=2, default=0)
    idle_hours = models.DecimalField(max_digits=8, decimal_places=2, default=0)
    overtime_hours = models.DecimalField(max_digits=8, decimal_places=2, default=0)
    total_guest_tickets = models.IntegerField(default=0)
    avg_payroll_rate = models.DecimalField(max_digits=8, decimal_places=2, default=0)
    srph = models.DecimalField(max_digits=10, decimal_places=2, default=0, help_text='Sales Revenue Per Hour')
    tplh = models.DecimalField(max_digits=8, decimal_places=2, default=0, help_text='Tickets Per Labor Hour')
    pct_idle = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    has_overtime = models.BooleanField(default=False)
    scheduling_quality_score = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    earliest_checkin_hour = models.IntegerField(null=True, blank=True, help_text='Earliest check-in hour (0-23) from Attendance')
    latest_checkout_hour = models.IntegerField(null=True, blank=True, help_text='Latest check-out hour (0-23) from Attendance')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'sched_daily_metrics'
        unique_together = ['store', 'date']
        indexes = [
            models.Index(fields=['store', 'date'], name='sched_dm_store_date_idx'),
            models.Index(fields=['pct_idle'], name='sched_dm_pct_idle_idx'),
        ]

    def __str__(self):
        return f"{self.store} - {self.date} (SRPH: {self.srph})"


class SchedulingRecommendation(models.Model):
    """Generated scheduling recommendations per store."""
    TYPE_CHOICES = [
        ('reduce_idle', 'Reduce Idle Coverage'),
        ('improve_peak', 'Improve Peak Coverage'),
        ('overtime_control', 'Overtime Control'),
        ('time_insight', 'Time-of-Day Insight'),
    ]
    PRIORITY_CHOICES = [
        ('high', 'High'),
        ('medium', 'Medium'),
        ('low', 'Low'),
    ]
    store = models.ForeignKey(Store, on_delete=models.CASCADE, related_name='sched_recommendations')
    date = models.DateField()
    recommendation_type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default='medium')
    title = models.CharField(max_length=255)
    description = models.TextField()
    metric_value = models.CharField(max_length=100, blank=True)
    time_bucket = models.CharField(max_length=20, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'sched_recommendations'
        indexes = [
            models.Index(fields=['store', 'date'], name='sched_rec_store_date_idx'),
            models.Index(fields=['recommendation_type'], name='sched_rec_type_idx'),
        ]

    def __str__(self):
        return f"{self.store} - {self.title}"


# SchedulingConfig is managed via AppConfig table with key 'scheduling_config'
# See constants.py DEFAULT_SCHEDULING_CONFIG for defaults


# ===========================================
# TWILIO CALLBACK LOG - Delivery Status Tracking
# ===========================================

class TwilioCallbackLog(models.Model):
    """
    Logs every Twilio status callback received.
    Pure logging/audit table — one row per webhook POST from Twilio.
    """
    tenant = models.ForeignKey(
        Tenant, on_delete=models.CASCADE, null=True, blank=True,
        related_name='twilio_callback_logs',
    )
    message_sid = models.CharField(max_length=64, db_index=True)
    message_status = models.CharField(max_length=30)
    to_number = models.CharField(max_length=20, blank=True, default='')
    from_number = models.CharField(max_length=20, blank=True, default='')
    error_code = models.CharField(max_length=20, blank=True, default='')
    error_message = models.TextField(blank=True, default='')
    raw_payload = models.JSONField(default=dict, help_text='Full POST body from Twilio')
    # Link to SMS log if found
    sms_log = models.ForeignKey(
        ExponentialSMSLog, on_delete=models.SET_NULL,
        null=True, blank=True, related_name='callback_logs',
    )
    received_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'twilio_callback_logs'
        indexes = [
            models.Index(fields=['tenant'], name='twilio_cb_tenant_idx'),
            models.Index(fields=['message_sid'], name='twilio_cb_sid_idx'),
            models.Index(fields=['received_at'], name='twilio_cb_received_idx'),
            models.Index(fields=['message_status'], name='twilio_cb_status_idx'),
        ]

    def __str__(self):
        return f"{self.message_sid} → {self.message_status} @ {self.received_at}"
