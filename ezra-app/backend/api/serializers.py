from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Tenant, Store, RawReport, ReportMetric, StoreTarget, ReportSchedule, SMSTemplate

User = get_user_model()


class TenantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tenant
        fields = ['id', 'name', 'code', 'is_active', 'created_at']


class UserSerializer(serializers.ModelSerializer):
    tenant_name = serializers.CharField(source='tenant.name', read_only=True)
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'role', 'tenant', 'tenant_name']
        read_only_fields = ['id']


class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)
    tenant_code = serializers.CharField(write_only=True, required=False)
    
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'first_name', 'last_name', 'role', 'tenant_code']
    
    def create(self, validated_data):
        tenant_code = validated_data.pop('tenant_code', None)
        password = validated_data.pop('password')
        
        tenant = None
        if tenant_code:
            tenant, _ = Tenant.objects.get_or_create(
                code=tenant_code,
                defaults={'name': tenant_code.replace('-', ' ').title()}
            )
        
        user = User.objects.create_user(
            **validated_data,
            tenant=tenant
        )
        user.set_password(password)
        user.save()
        return user


class StoreSerializer(serializers.ModelSerializer):
    store_name = serializers.CharField(source='name', read_only=True)
    store_code = serializers.CharField(source='external_code', read_only=True)
    
    class Meta:
        model = Store
        fields = ['id', 'name', 'external_code', 'store_name', 'store_code', 
                  'city', 'state', 'status', 'is_active', 'last_synced_at', 'created_at']


class RawReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = RawReport
        fields = ['id', 'report_type', 'report_date', 'raw_data', 'ingested_at']


class ReportMetricSerializer(serializers.ModelSerializer):
    store_name = serializers.CharField(source='store.name', read_only=True)
    
    class Meta:
        model = ReportMetric
        fields = ['id', 'store', 'store_name', 'report_type', 'report_date', 'metric_name', 'metric_value', 'metric_text']


class RawReportIngestionSerializer(serializers.Serializer):
    type = serializers.CharField()
    date = serializers.CharField()
    rows = serializers.ListField(child=serializers.DictField(), required=False)
    raw_value = serializers.ListField(child=serializers.DictField(), required=False)
    
    def validate(self, data):
        if not data.get('rows') and not data.get('raw_value'):
            raise serializers.ValidationError("Either 'rows' or 'raw_value' must be provided")
        return data


class StoreTargetSerializer(serializers.ModelSerializer):
    store_name = serializers.CharField(source='store.name', read_only=True)
    store_code = serializers.CharField(source='store.external_code', read_only=True)
    
    class Meta:
        model = StoreTarget
        fields = ['id', 'store', 'store_name', 'store_code', 'target_date',
                  'revenue_target', 'labor_target_hours', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

class ReportScheduleSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReportSchedule
        fields = [
            'id', 'name', 'report_types', 'cron_expression', 'schedule_time', 'timezone',
            'recipients', 'is_active', 'last_run_at',
            'last_run_status', 'last_run_error', 'created_at', 'updated_at',
        ]
        read_only_fields = [
            'id', 'last_run_at', 'last_run_status',
            'last_run_error', 'created_at', 'updated_at',
        ]

    def validate_name(self, value):
        if not value or not value.strip():
            raise serializers.ValidationError("Schedule name is required.")
        value = value.strip()
        # Check uniqueness within tenant
        request = self.context.get('request')
        if request and request.user:
            tenant = request.user.tenant
            qs = ReportSchedule.objects.filter(tenant=tenant, name=value)
            # Exclude current instance on update
            if self.instance:
                qs = qs.exclude(pk=self.instance.pk)
            if qs.exists():
                raise serializers.ValidationError(
                    f"A schedule named '{value}' already exists. Please use a unique name."
                )
        return value

    def validate_report_types(self, value):
        valid_types = {'daily', 'weekly', 'lp', 'scheduling', 'exponential'}
        if not isinstance(value, list) or len(value) < 1:
            raise serializers.ValidationError("Must select at least one report type.")
        for rt in value:
            if rt not in valid_types:
                raise serializers.ValidationError(f"Invalid report type: {rt}")
        return list(set(value))  # deduplicate

    def validate_cron_expression(self, value):
        from api.utils.cron_utils import validate_cron_expression
        if not validate_cron_expression(value):
            raise serializers.ValidationError("Invalid cron expression.")
        return value

    def validate_recipients(self, value):
        if not isinstance(value, list) or len(value) < 1 or len(value) > 5:
            raise serializers.ValidationError("Must provide 1-5 email addresses.")
        import re
        email_re = re.compile(r'^[^\s@]+@[^\s@]+\.[^\s@]+$')
        for email in value:
            if not isinstance(email, str) or not email_re.match(email):
                raise serializers.ValidationError(f"Invalid email address: {email}")
        return value

    def validate_timezone(self, value):
        import zoneinfo
        try:
            zoneinfo.ZoneInfo(value)
        except (KeyError, Exception):
            raise serializers.ValidationError(f"Invalid timezone: {value}")
        return value



class SMSTemplateSerializer(serializers.ModelSerializer):
    class Meta:
        model = SMSTemplate
        fields = [
            'id', 'template_id', 'name', 'bucket', 'body',
            'is_active', 'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def validate_body(self, value):
        # Ensure template has at least one placeholder
        valid_placeholders = ['{first_name}', '{guest_name}', '{store_name}', '{location_name}', '{coupon_value}', '{coupon_code}', '{booking_link}']
        if not any(p in value for p in valid_placeholders):
            raise serializers.ValidationError(
                "Template body must contain at least one placeholder: {first_name}, {guest_name}, {store_name}, {location_name}, {coupon_value}, {coupon_code}, or {booking_link}"
            )
        return value

