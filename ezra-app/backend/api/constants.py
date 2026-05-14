DEFAULT_SCHEDULE_TIME_OPTIONS = [
    # UTC
    {"label": "6:00 AM UTC", "value": "06:00", "timezone": "UTC"},
    {"label": "8:00 AM UTC", "value": "08:00", "timezone": "UTC"},
    {"label": "12:00 PM UTC", "value": "12:00", "timezone": "UTC"},
    # US Eastern
    {"label": "6:00 AM EST", "value": "06:00", "timezone": "America/New_York"},
    {"label": "7:00 AM EST", "value": "07:00", "timezone": "America/New_York"},
    {"label": "8:00 AM EST", "value": "08:00", "timezone": "America/New_York"},
    {"label": "9:00 AM EST", "value": "09:00", "timezone": "America/New_York"},
    # US Central
    {"label": "6:00 AM CST", "value": "06:00", "timezone": "America/Chicago"},
    {"label": "7:00 AM CST", "value": "07:00", "timezone": "America/Chicago"},
    {"label": "8:00 AM CST", "value": "08:00", "timezone": "America/Chicago"},
    {"label": "9:00 AM CST", "value": "09:00", "timezone": "America/Chicago"},
    # US Pacific
    {"label": "6:00 AM PST", "value": "06:00", "timezone": "America/Los_Angeles"},
    {"label": "7:00 AM PST", "value": "07:00", "timezone": "America/Los_Angeles"},
    {"label": "8:00 AM PST", "value": "08:00", "timezone": "America/Los_Angeles"},
    {"label": "9:00 AM PST", "value": "09:00", "timezone": "America/Los_Angeles"},
    # Canadian Mountain
    {"label": "7:00 AM MST (Calgary)", "value": "07:00", "timezone": "America/Edmonton"},
    {"label": "8:00 AM MST (Calgary)", "value": "08:00", "timezone": "America/Edmonton"},
    # European
    {"label": "8:00 AM GMT (London)", "value": "08:00", "timezone": "Europe/London"},
    {"label": "9:00 AM GMT (London)", "value": "09:00", "timezone": "Europe/London"},
    {"label": "8:00 AM CET (Paris)", "value": "08:00", "timezone": "Europe/Paris"},
    {"label": "9:00 AM CET (Paris)", "value": "09:00", "timezone": "Europe/Paris"},
]


# ===========================================
# EZRA EXPONENTIAL - Default Configuration
# Stored in AppConfig with key 'exponential_config'
# ===========================================
DEFAULT_EXPONENTIAL_CONFIG = {
    # Bucket thresholds
    "bucket_4wk_min_visits": 2,          # Min visits in 30 days for 4wk (Low Churn Risk)
    "bucket_6wk_min_days": 31,           # Min days since visit for 6wk (Medium Churn Risk)
    "bucket_6wk_max_days": 42,           # Max days since visit for 6wk
    "bucket_8wk_min_days": 43,           # Min days since visit for 8wk (High Churn Risk)
    # Campaign settings
    "cooldown_days": 0,                 # Days between SMS contacts per customer (0 = no cooldown)
    "uptake_window_days": 14,            # Days to attribute return visit to SMS
    # Coupon escalation by segment
    "coupon_4wk": 5.00,                  # Lowest incentive
    "coupon_6wk": 10.00,                 # Medium incentive
    "coupon_8wk": 15.00,                 # Highest incentive
    # Campaign scope
    "default_campaign_scope": "all",     # 'all' or 'single'
    # SMS settings
    "sms_send_hour": 10,                 # Hour of day to send SMS (24h format)
    "sms_send_minute": 0,
    "max_sms_per_day": 500,              # Max SMS per day per tenant
    # Eligible follow-up threshold
    "followup_days_threshold": 30,       # Customers serviced last month with > X days since visit
}

# ===========================================
# EZRA SCHEDULING - Default Configuration
# Stored in AppConfig with key 'scheduling_config'
# ===========================================
DEFAULT_SCHEDULING_CONFIG = {
    # Time bucket definitions
    "time_buckets": [
        {"label": "9AM-12PM", "start": "09:00", "end": "12:00"},
        {"label": "12PM-2PM", "start": "12:00", "end": "14:00"},
        {"label": "2PM-5PM", "start": "14:00", "end": "17:00"},
        {"label": "5PM-9PM", "start": "17:00", "end": "21:00"},
    ],
    # Thresholds
    "peak_threshold_percentile": 75,     # Top X% buckets considered peak
    "idle_revenue_threshold": 0,         # Revenue below this = idle ($0 default)
    "srph_low_threshold": 30.00,         # SRPH below this is flagged
    "tplh_low_threshold": 1.5,           # Tickets/hour below this = understaffed
    # Overtime
    "daily_overtime_threshold_hours": 8.0,
    "weekly_overtime_threshold_hours": 40.0,
    # Scoring weights
    "idle_score_weight": 0.5,
    "overtime_score_weight": 0.3,
    "srph_score_weight": 0.2,
    # Work centers to track
    "work_centers": ["Styling", "Color", "Front Desk", "Spa"],
}

# ===========================================
# TWILIO - Default Configuration
# Stored in AppConfig with key 'twilio_config'
# ===========================================
DEFAULT_TWILIO_CONFIG = {
    "account_sid": "",
    "auth_token": "",
    "from_number": "",
    "messaging_service_sid": "",         # Optional: use messaging service instead of from_number
    "enabled": False,                    # Master switch for SMS sending
    "base_url": "",                      # Your API domain (e.g. https://api.meetezra.bot)
    "test_phone": "",                    # If set, ALL campaign SMS go to this number instead of real customers
}

# ===========================================
# EXPONENTIAL - SMS Message Templates
# Stored in AppConfig with key 'exponential_sms_templates'
# ===========================================
DEFAULT_SMS_TEMPLATES = [
    {
        "id": "4wk_default",
        "bucket": "4wk",
        "name": "4-Week Re-engagement",
        "body": "Hi {guest_name}! We miss you at {store_name}. Come back and enjoy ${coupon_value} off your next visit! Reply STOP to opt out.",
        "is_active": True,
    },
    {
        "id": "6wk_default",
        "bucket": "6wk",
        "name": "6-Week Re-engagement",
        "body": "Hey {guest_name}, it's been a while! Here's ${coupon_value} off to welcome you back to {store_name}. Reply STOP to opt out.",
        "is_active": True,
    },
    {
        "id": "8wk_default",
        "bucket": "8wk",
        "name": "8-Week Re-engagement",
        "body": "{guest_name}, your stylist misses you! Book now and save ${coupon_value} at {store_name} this week only! Reply STOP to opt out.",
        "is_active": True,
    },
]
