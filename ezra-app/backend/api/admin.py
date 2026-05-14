from django.contrib import admin
from django.contrib.admin import AdminSite
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.forms import UserCreationForm, UserChangeForm
from django import forms
from django.contrib import messages
from django.http import HttpResponseRedirect
from django.shortcuts import render
from .models import User, Tenant, Store, RawReport, ReportMetric, StoreTarget, LPAlert, LPRiskScore, LPAlertConfig, LowTicketService, AppConfig
from .email_service import send_user_invitation_email
import logging

logger = logging.getLogger(__name__)


def is_super_admin(user):
    """Helper to check if user is super admin (handles AnonymousUser)"""
    if not user.is_authenticated:
        return False
    return user.is_superuser or getattr(user, 'role', None) == 'super_admin'


def is_franchisor_admin(user):
    """Helper to check if user is franchisor admin (handles AnonymousUser)"""
    if not user.is_authenticated:
        return False
    return getattr(user, 'role', None) == 'franchisor_admin'


class EzraAdminSite(AdminSite):
    """Custom admin site that shows franchisee name in title for franchisor admins"""
    site_header = 'Ezra SuperAdmin'
    site_title = 'Ezra SuperAdmin'
    index_title = 'Welcome to Ezra SuperAdmin'
    
    def each_context(self, request):
        context = super().each_context(request)
        if is_franchisor_admin(request.user) and request.user.tenant:
            franchisee_name = request.user.tenant.name
            context['site_header'] = f'Ezra Admin - {franchisee_name}'
            context['site_title'] = f'Ezra Admin - {franchisee_name}'
            context['index_title'] = f'Welcome to Ezra Admin - {franchisee_name}'
        return context


ezra_admin_site = EzraAdminSite(name='ezra_admin')


class CustomUserCreationForm(UserCreationForm):
    """Custom user creation form that includes tenant and role fields"""
    class Meta(UserCreationForm.Meta):
        model = User
        fields = ('username', 'email', 'password1', 'password2', 'tenant', 'role')


class FranchisorUserCreationForm(UserCreationForm):
    """User creation form for franchisor admins - only basic fields"""
    class Meta(UserCreationForm.Meta):
        model = User
        fields = ('username', 'email', 'password1', 'password2', 'first_name', 'last_name')
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Make first_name and last_name optional
        self.fields['first_name'].required = False
        self.fields['last_name'].required = False


class CustomUserChangeForm(UserChangeForm):
    """Custom user change form that includes tenant and role fields"""
    class Meta(UserChangeForm.Meta):
        model = User
        fields = '__all__'


class FranchiseeFilteredAdmin(admin.ModelAdmin):
    """Base admin class that filters queryset by franchisee for Franchisor Admins"""
    
    def get_queryset(self, request):
        qs = super().get_queryset(request)
        if is_super_admin(request.user):
            return qs
        if is_franchisor_admin(request.user) and request.user.tenant:
            return qs.filter(tenant=request.user.tenant)
        return qs.none()
    
    def has_module_permission(self, request):
        if is_super_admin(request.user):
            return True
        if is_franchisor_admin(request.user):
            return True
        return False
    
    def has_add_permission(self, request):
        if is_super_admin(request.user):
            return True
        return False
    
    def has_change_permission(self, request, obj=None):
        if is_super_admin(request.user):
            return True
        return False
    
    def has_delete_permission(self, request, obj=None):
        if is_super_admin(request.user):
            return True
        return False
    
    def has_view_permission(self, request, obj=None):
        if is_super_admin(request.user):
            return True
        if is_franchisor_admin(request.user):
            return True
        return False


class StoreFilteredAdmin(admin.ModelAdmin):
    """Base admin class that filters queryset by store's franchisee for Franchisor Admins"""
    
    def get_queryset(self, request):
        qs = super().get_queryset(request)
        if is_super_admin(request.user):
            return qs
        if is_franchisor_admin(request.user) and request.user.tenant:
            return qs.filter(store__tenant=request.user.tenant)
        return qs.none()
    
    def has_module_permission(self, request):
        if is_super_admin(request.user):
            return True
        if is_franchisor_admin(request.user):
            return True
        return False
    
    def has_add_permission(self, request):
        if is_super_admin(request.user):
            return True
        return False
    
    def has_change_permission(self, request, obj=None):
        if is_super_admin(request.user):
            return True
        return False
    
    def has_delete_permission(self, request, obj=None):
        if is_super_admin(request.user):
            return True
        return False
    
    def has_view_permission(self, request, obj=None):
        if is_super_admin(request.user):
            return True
        if is_franchisor_admin(request.user):
            return True
        return False


class TenantAdmin(admin.ModelAdmin):
    list_display = ['name', 'code', 'is_active', 'created_at']
    search_fields = ['name', 'code']
    actions = ['bulk_activate_franchisees', 'bulk_deactivate_franchisees']
    
    def get_queryset(self, request):
        qs = super().get_queryset(request)
        if is_super_admin(request.user):
            return qs
        if is_franchisor_admin(request.user) and request.user.tenant:
            return qs.filter(pk=request.user.tenant.pk)
        return qs.none()
    
    def has_module_permission(self, request):
        if is_super_admin(request.user):
            return True
        if is_franchisor_admin(request.user):
            return True
        return False
    
    def has_add_permission(self, request):
        return is_super_admin(request.user)
    
    def has_change_permission(self, request, obj=None):
        if is_super_admin(request.user):
            return True
        # Franchisor admin can edit their own tenant
        if is_franchisor_admin(request.user):
            if obj is None:
                return True
            return obj == request.user.tenant
        return False
    
    def has_delete_permission(self, request, obj=None):
        return is_super_admin(request.user)
    
    def has_view_permission(self, request, obj=None):
        if is_super_admin(request.user):
            return True
        if is_franchisor_admin(request.user):
            return True
        return False
    
    def bulk_activate_franchisees(self, request, queryset):
        count = queryset.update(is_active=True)
        self.message_user(request, f'Successfully activated {count} franchisees.', messages.SUCCESS)
    
    bulk_activate_franchisees.short_description = "Activate selected franchisees"
    
    def bulk_deactivate_franchisees(self, request, queryset):
        count = queryset.update(is_active=False)
        self.message_user(request, f'Successfully deactivated {count} franchisees.', messages.SUCCESS)
    
    bulk_deactivate_franchisees.short_description = "Deactivate selected franchisees"


class UserAdmin(BaseUserAdmin):
    add_form = CustomUserCreationForm
    form = CustomUserChangeForm
    
    list_display = ['username', 'email', 'role', 'get_franchisee', 'is_active']
    actions = ['bulk_update_franchisee', 'bulk_activate_users', 'bulk_deactivate_users']
    
    def get_list_filter(self, request):
        """Show limited filters for franchise admins"""
        if is_franchisor_admin(request.user):
            return [RoleFilter, 'is_active']
        return [RoleFilter, FranchiseeFilter, 'is_active']
    
    # Fields shown when editing an existing user (for SuperAdmin)
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Personal info', {'fields': ('first_name', 'last_name', 'email')}),
        ('Franchisee Info', {'fields': ('tenant', 'role')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )
    
    # Restricted fieldsets for Franchisor Admin (viewing/editing existing users)
    franchisor_fieldsets = (
        (None, {'fields': ('username',)}),
        ('Personal info', {'fields': ('first_name', 'last_name', 'email')}),
        ('Status', {'fields': ('is_active',)}),
    )
    
    # Fields shown when creating a new user (SuperAdmin)
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'email', 'password1', 'password2', 'tenant', 'role'),
        }),
    )
    
    # Restricted add fieldsets for Franchisor Admin - password fields MUST be in first section
    franchisor_add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'password1', 'password2'),
        }),
        ('Personal Info', {
            'classes': ('wide',),
            'fields': ('first_name', 'last_name', 'email'),
        }),
    )
    
    search_fields = ['username', 'email', 'first_name', 'last_name']
    ordering = ['username']
    
    def get_form(self, request, obj=None, **kwargs):
        """Use FranchisorUserCreationForm for franchisor admins when adding users"""
        if obj is None and is_franchisor_admin(request.user):
            kwargs['form'] = FranchisorUserCreationForm
        return super().get_form(request, obj, **kwargs)
    
    def get_queryset(self, request):
        qs = super().get_queryset(request)
        if is_super_admin(request.user):
            return qs
        if is_franchisor_admin(request.user) and request.user.tenant:
            return qs.filter(tenant=request.user.tenant)
        return qs.none()
    
    def get_fieldsets(self, request, obj=None):
        # For ADD view (obj is None), return add_fieldsets
        if obj is None:
            if is_super_admin(request.user):
                return self.add_fieldsets
            return self.franchisor_add_fieldsets
        # For EDIT view, return regular fieldsets
        if is_super_admin(request.user):
            return super().get_fieldsets(request, obj)
        return self.franchisor_fieldsets
    
    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        """Filter franchisee dropdown to show only active franchisees and customize label"""
        if db_field.name == 'tenant':
            if is_franchisor_admin(request.user):
                kwargs['queryset'] = Tenant.objects.filter(pk=request.user.tenant.pk, is_active=True)
            else:
                kwargs['queryset'] = Tenant.objects.filter(is_active=True)
            # Set the label to "Franchisee" instead of "Tenant"
            kwargs['label'] = 'Franchisee'
        return super().formfield_for_foreignkey(db_field, request, **kwargs)
    
    def formfield_for_choice_field(self, db_field, request, **kwargs):
        """Filter role dropdown for franchisor admins - only show Franchise User"""
        if db_field.name == 'role' and is_franchisor_admin(request.user):
            kwargs['choices'] = [('franchise_user', 'Franchise User')]
        return super().formfield_for_choice_field(db_field, request, **kwargs)
    
    def has_add_permission(self, request):
        if is_super_admin(request.user):
            return True
        if is_franchisor_admin(request.user):
            return True
        return False
    
    def has_change_permission(self, request, obj=None):
        if is_super_admin(request.user):
            return True
        if is_franchisor_admin(request.user):
            if obj is None:
                return True
            return obj.tenant == request.user.tenant and obj.role == 'franchise_user'
        return False
    
    def has_delete_permission(self, request, obj=None):
        if is_super_admin(request.user):
            return True
        # Franchisor admin can delete franchise_user in their tenant
        if is_franchisor_admin(request.user):
            if obj is None:
                return False
            return obj.tenant == request.user.tenant and obj.role == 'franchise_user'
        return False
    
    def has_view_permission(self, request, obj=None):
        if is_super_admin(request.user):
            return True
        if is_franchisor_admin(request.user):
            return True
        return False
    
    def has_module_permission(self, request):
        if is_super_admin(request.user):
            return True
        if is_franchisor_admin(request.user):
            return True
        return False
    
    def bulk_update_franchisee(self, request, queryset):
        if 'apply' in request.POST:
            new_franchisee_id = request.POST.get('tenant')
            if new_franchisee_id:
                new_franchisee = Tenant.objects.get(id=new_franchisee_id)
                count = queryset.update(tenant=new_franchisee)
                self.message_user(request, f'Successfully updated {count} users to franchisee {new_franchisee.name}.', messages.SUCCESS)
            return HttpResponseRedirect(request.get_full_path())
        
        # Get active franchisees for the dropdown
        if is_franchisor_admin(request.user):
            franchisees = Tenant.objects.filter(pk=request.user.tenant.pk, is_active=True)
        else:
            franchisees = Tenant.objects.filter(is_active=True)
        
        return render(request, 'admin/bulk_update_tenant.html', {
            'objects': queryset,
            'tenants': franchisees,
            'action_name': 'bulk_update_franchisee',
            'model_name': 'User',
        })
    
    bulk_update_franchisee.short_description = "Update franchisee for selected users"
    
    def bulk_activate_users(self, request, queryset):
        count = queryset.update(is_active=True)
        self.message_user(request, f'Successfully activated {count} users.', messages.SUCCESS)
    
    bulk_activate_users.short_description = "Activate selected users"
    
    def bulk_deactivate_users(self, request, queryset):
        count = queryset.update(is_active=False)
        self.message_user(request, f'Successfully deactivated {count} users.', messages.SUCCESS)
    
    bulk_deactivate_users.short_description = "Deactivate selected users"
    
    def get_franchisee(self, obj):
        """Display franchisee name with proper formatting"""
        if obj.tenant:
            return obj.tenant.name
        return "No Franchisee"
    get_franchisee.short_description = 'Franchisee'
    get_franchisee.admin_order_field = 'tenant'
    
    def save_model(self, request, obj, form, change):
        """Auto-assign tenant and role for franchisor admin created users, and send invitation email"""
        is_new_user = not change  # True if creating new user
        
        if is_franchisor_admin(request.user):
            obj.tenant = request.user.tenant
            obj.role = 'franchise_user'
            obj.is_staff = False
            obj.is_superuser = False
        
        # Set staff status for franchisee admin users
        if is_new_user and obj.role == 'franchisor_admin':
            obj.is_staff = True
        
        # Get the password before saving (only available for new users)
        password = None
        if is_new_user and 'password1' in form.cleaned_data:
            password = form.cleaned_data.get('password1')
        
        super().save_model(request, obj, form, change)
        
        # Send invitation email for new users
        if is_new_user and password and obj.email:
            try:
                success, msg = send_user_invitation_email(obj, password)
                if success:
                    messages.success(request, f"Invitation email sent to {obj.email}")
                else:
                    messages.warning(request, f"User created but email failed: {msg}")
            except Exception as e:
                logger.error(f"Failed to send invitation email: {str(e)}")
                messages.warning(request, f"User created but email failed: {str(e)}")


class RoleFilter(admin.SimpleListFilter):
    """Custom filter that hides super_admin role from franchise admins"""
    title = 'role'
    parameter_name = 'role'
    
    def lookups(self, request, model_admin):
        from .models import User
        if is_super_admin(request.user):
            return User.ROLE_CHOICES
        # Franchise admins should not see super_admin option
        return [choice for choice in User.ROLE_CHOICES if choice[0] != 'super_admin']
    
    def queryset(self, request, queryset):
        if self.value():
            return queryset.filter(role=self.value())
        return queryset


class FranchiseeFilter(admin.SimpleListFilter):
    """Custom filter that only shows user's franchisee for franchise admins"""
    title = 'franchisee'
    parameter_name = 'tenant'
    
    def lookups(self, request, model_admin):
        if is_super_admin(request.user):
            return [(t.pk, t.name) for t in Tenant.objects.filter(is_active=True)]
        if is_franchisor_admin(request.user) and request.user.tenant:
            return [(request.user.tenant.pk, request.user.tenant.name)]
        return []
    
    def queryset(self, request, queryset):
        if self.value():
            return queryset.filter(tenant_id=self.value())
        return queryset


class StoreFranchiseeFilter(admin.SimpleListFilter):
    """Custom filter for Store that only shows user's franchisee for franchise admins"""
    title = 'franchisee'
    parameter_name = 'tenant'
    
    def lookups(self, request, model_admin):
        if is_super_admin(request.user):
            return [(t.pk, t.name) for t in Tenant.objects.filter(is_active=True)]
        if is_franchisor_admin(request.user) and request.user.tenant:
            return [(request.user.tenant.pk, request.user.tenant.name)]
        return []
    
    def queryset(self, request, queryset):
        if self.value():
            return queryset.filter(tenant_id=self.value())
        return queryset


class StoreStatusFilter(admin.SimpleListFilter):
    """Custom filter that hides onboarding status"""
    title = 'status'
    parameter_name = 'status'
    
    def lookups(self, request, model_admin):
        return Store.STATUS_CHOICES
    
    def queryset(self, request, queryset):
        if self.value():
            return queryset.filter(status=self.value())
        return queryset


class StoreAdmin(FranchiseeFilteredAdmin):
    list_display = ['name', 'get_franchisee', 'external_code', 'status', 'created_at']
    list_filter = [StoreFranchiseeFilter, StoreStatusFilter]
    search_fields = ['name', 'external_code']
    actions = ['bulk_update_franchisee', 'bulk_update_status']
    
    def get_franchisee(self, obj):
        """Display franchisee name with proper formatting"""
        return obj.tenant.name if obj.tenant else "No Franchisee"
    get_franchisee.short_description = 'Franchisee'
    get_franchisee.admin_order_field = 'tenant'
    
    def formfield_for_choice_field(self, db_field, request, **kwargs):
        """Hide onboarding status from dropdown"""
        if db_field.name == 'status':
            kwargs['choices'] = Store.STATUS_CHOICES
        return super().formfield_for_choice_field(db_field, request, **kwargs)
    
    def bulk_update_franchisee(self, request, queryset):
        if 'apply' in request.POST:
            new_franchisee_id = request.POST.get('tenant')
            if new_franchisee_id:
                new_franchisee = Tenant.objects.get(id=new_franchisee_id)
                count = queryset.update(tenant=new_franchisee)
                self.message_user(request, f'Successfully updated {count} stores to franchisee {new_franchisee.name}.', messages.SUCCESS)
            return HttpResponseRedirect(request.get_full_path())
        
        # Get active franchisees for the dropdown
        if is_franchisor_admin(request.user):
            franchisees = Tenant.objects.filter(pk=request.user.tenant.pk, is_active=True)
        else:
            franchisees = Tenant.objects.filter(is_active=True)
        
        return render(request, 'admin/bulk_update_tenant.html', {
            'objects': queryset,
            'tenants': franchisees,
            'action_name': 'bulk_update_franchisee',
            'model_name': 'Store',
        })
    
    bulk_update_franchisee.short_description = "Update franchisee for selected stores"
    
    def bulk_update_status(self, request, queryset):
        if 'apply' in request.POST:
            new_status = request.POST.get('status')
            if new_status:
                count = queryset.update(status=new_status)
                self.message_user(request, f'Successfully updated {count} stores to status "{new_status}".', messages.SUCCESS)
            return HttpResponseRedirect(request.get_full_path())
        
        from .models import Store
        status_choices = Store.STATUS_CHOICES
        
        return render(request, 'admin/bulk_update_status.html', {
            'objects': queryset,
            'status_choices': status_choices,
            'action_name': 'bulk_update_status',
            'model_name': 'Store',
        })
    
    bulk_update_status.short_description = "Update status for selected stores"
    
    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        """Filter franchisee dropdown to show only active franchisees"""
        if db_field.name == 'tenant':
            if is_franchisor_admin(request.user):
                kwargs['queryset'] = Tenant.objects.filter(pk=request.user.tenant.pk, is_active=True)
            else:
                kwargs['queryset'] = Tenant.objects.filter(is_active=True)
            kwargs['label'] = 'Franchisee'
        return super().formfield_for_foreignkey(db_field, request, **kwargs)


class RawReportAdmin(FranchiseeFilteredAdmin):
    list_display = ['get_franchisee', 'report_type', 'report_date', 'ingested_at']
    list_filter = [FranchiseeFilter, 'report_type']
    date_hierarchy = 'report_date'
    actions = ['bulk_update_franchisee']
    
    def get_franchisee(self, obj):
        """Display franchisee name with proper formatting"""
        return obj.tenant.name if obj.tenant else "No Franchisee"
    get_franchisee.short_description = 'Franchisee'
    get_franchisee.admin_order_field = 'tenant'
    
    def bulk_update_franchisee(self, request, queryset):
        if 'apply' in request.POST:
            new_franchisee_id = request.POST.get('tenant')
            if new_franchisee_id:
                new_franchisee = Tenant.objects.get(id=new_franchisee_id)
                count = queryset.update(tenant=new_franchisee)
                self.message_user(request, f'Successfully updated {count} raw reports to franchisee {new_franchisee.name}.', messages.SUCCESS)
            return HttpResponseRedirect(request.get_full_path())
        
        # Get active franchisees for the dropdown
        if is_franchisor_admin(request.user):
            franchisees = Tenant.objects.filter(pk=request.user.tenant.pk, is_active=True)
        else:
            franchisees = Tenant.objects.filter(is_active=True)
        
        return render(request, 'admin/bulk_update_tenant.html', {
            'objects': queryset,
            'tenants': franchisees,
            'action_name': 'bulk_update_franchisee',
            'model_name': 'RawReport',
        })
    
    bulk_update_franchisee.short_description = "Update franchisee for selected raw reports"
    
    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        """Filter franchisee dropdown to show only active franchisees"""
        if db_field.name == 'tenant':
            if is_franchisor_admin(request.user):
                kwargs['queryset'] = Tenant.objects.filter(pk=request.user.tenant.pk, is_active=True)
            else:
                kwargs['queryset'] = Tenant.objects.filter(is_active=True)
            kwargs['label'] = 'Franchisee'
        return super().formfield_for_foreignkey(db_field, request, **kwargs)
    
    def has_module_permission(self, request):
        # Only super_admin can see RawReport
        return is_super_admin(request.user)
    
    def has_view_permission(self, request, obj=None):
        return is_super_admin(request.user)


class ReportMetricFranchiseeFilter(admin.SimpleListFilter):
    """Custom filter for ReportMetric that only shows user's franchisee for franchise admins"""
    title = 'franchisee'
    parameter_name = 'store__tenant'
    
    def lookups(self, request, model_admin):
        if is_super_admin(request.user):
            return [(t.pk, t.name) for t in Tenant.objects.filter(is_active=True)]
        if is_franchisor_admin(request.user) and request.user.tenant:
            return [(request.user.tenant.pk, request.user.tenant.name)]
        return []
    
    def queryset(self, request, queryset):
        if self.value():
            return queryset.filter(store__tenant_id=self.value())
        return queryset


class ReportMetricAdmin(StoreFilteredAdmin):
    list_display = ['get_franchisee', 'store', 'report_type', 'report_date', 'metric_name', 'metric_value']
    list_filter = [ReportMetricFranchiseeFilter, 'report_type', 'metric_name']
    search_fields = ['metric_name', 'store__name']
    date_hierarchy = 'report_date'
    
    def get_franchisee(self, obj):
        return obj.store.tenant if obj.store else None
    get_franchisee.short_description = 'Franchisee'
    get_franchisee.admin_order_field = 'store__tenant'


class StoreTargetAdmin(StoreFilteredAdmin):
    list_display = ['store', 'get_franchisee', 'target_date', 'revenue_target', 'labor_target_hours', 'created_at']
    list_filter = [ReportMetricFranchiseeFilter, 'target_date']
    search_fields = ['store__name']
    date_hierarchy = 'target_date'
    
    def get_franchisee(self, obj):
        return obj.store.tenant if obj.store else None
    get_franchisee.short_description = 'Franchisee'
    get_franchisee.admin_order_field = 'store__tenant'


class LPAlertAdmin(StoreFilteredAdmin):
    list_display = ['store', 'alert_type', 'risk_level', 'status', 'calculated_value', 'detected_at']
    list_filter = ['alert_type', 'risk_level', 'status', 'report_date']
    search_fields = ['store__name', 'store__external_code']
    date_hierarchy = 'report_date'
    readonly_fields = ['detected_at', 'resolved_at']


class LPRiskScoreAdmin(StoreFilteredAdmin):
    list_display = ['store', 'report_date', 'total_score', 'cash_ratio_risk', 'tip_percent_risk', 'low_ticket_risk']
    list_filter = ['report_date', 'cash_ratio_risk', 'tip_percent_risk', 'low_ticket_risk']
    search_fields = ['store__name', 'store__external_code']
    date_hierarchy = 'report_date'


class LPAlertConfigAdmin(FranchiseeFilteredAdmin):
    list_display = ['tenant', 'cash_ratio_red_min', 'tip_percent_green_min', 'low_ticket_red_min', 'updated_at']
    
    def get_queryset(self, request):
        qs = super().get_queryset(request)
        if is_super_admin(request.user):
            return qs
        if is_franchisor_admin(request.user) and request.user.tenant:
            return qs.filter(tenant=request.user.tenant)
        return qs.none()


class LowTicketServiceAdmin(FranchiseeFilteredAdmin):
    list_display = ['service_name', 'tenant', 'is_active', 'created_at']
    list_filter = ['is_active', 'tenant']
    search_fields = ['service_name']


# Register all models with custom admin site
ezra_admin_site.register(Tenant, TenantAdmin)
ezra_admin_site.register(User, UserAdmin)
ezra_admin_site.register(Store, StoreAdmin)
ezra_admin_site.register(RawReport, RawReportAdmin)
ezra_admin_site.register(ReportMetric, ReportMetricAdmin)
ezra_admin_site.register(StoreTarget, StoreTargetAdmin)
ezra_admin_site.register(LPAlert, LPAlertAdmin)
ezra_admin_site.register(LPRiskScore, LPRiskScoreAdmin)
ezra_admin_site.register(LPAlertConfig, LPAlertConfigAdmin)
ezra_admin_site.register(LowTicketService, LowTicketServiceAdmin)


class AppConfigAdmin(admin.ModelAdmin):
    list_display = ['name', 'updated_at']
    search_fields = ['name']
    readonly_fields = ['created_at', 'updated_at']


ezra_admin_site.register(AppConfig, AppConfigAdmin)


# ===========================================
# EZRA EXPONENTIAL - Admin Registration
# ===========================================

from .models import (
    ExponentialCustomer, ExponentialVisit, ExponentialSegment,
    ExponentialCampaign, ExponentialSMSLog, ExponentialUptake,
)


class ExponentialCustomerAdmin(FranchiseeFilteredAdmin):
    list_display = ['guest_name', 'guest_code', 'store', 'phone', 'sms_opt_in', 'total_visits', 'last_visit_date']
    list_filter = ['sms_opt_in', 'store']
    search_fields = ['guest_name', 'guest_code', 'phone']
    readonly_fields = ['created_at', 'updated_at']
    list_per_page = 50


class ExponentialVisitAdmin(admin.ModelAdmin):
    list_display = ['customer', 'store', 'visit_date', 'center_name']
    list_filter = ['store', 'visit_date']
    search_fields = ['customer__guest_name', 'customer__guest_code']
    readonly_fields = ['created_at']
    list_per_page = 50


class ExponentialSegmentAdmin(admin.ModelAdmin):
    list_display = ['customer', 'store', 'bucket', 'days_since_last_visit', 'visits_last_30_days', 'assigned_at']
    list_filter = ['bucket', 'store', 'assigned_at']
    search_fields = ['customer__guest_name']
    readonly_fields = ['created_at']
    list_per_page = 50


class ExponentialCampaignAdmin(FranchiseeFilteredAdmin):
    list_display = ['name', 'target_bucket', 'scope', 'status', 'messages_sent', 'messages_delivered', 'messages_failed', 'created_at']
    list_filter = ['status', 'target_bucket', 'scope']
    search_fields = ['name']
    readonly_fields = ['created_at', 'updated_at', 'started_at', 'completed_at']
    list_per_page = 25


class ExponentialSMSLogAdmin(admin.ModelAdmin):
    list_display = ['campaign', 'customer', 'segment_at_send', 'status', 'twilio_message_sid', 'sent_at']
    list_filter = ['status', 'segment_at_send']
    search_fields = ['customer__guest_name', 'twilio_message_sid']
    readonly_fields = ['sent_at', 'delivered_at']
    list_per_page = 50


class ExponentialUptakeAdmin(admin.ModelAdmin):
    list_display = ['customer', 'return_visit_date', 'days_to_return', 'created_at']
    list_filter = ['return_visit_date']
    search_fields = ['customer__guest_name']
    readonly_fields = ['created_at']
    list_per_page = 50


ezra_admin_site.register(ExponentialCustomer, ExponentialCustomerAdmin)
ezra_admin_site.register(ExponentialVisit, ExponentialVisitAdmin)
ezra_admin_site.register(ExponentialSegment, ExponentialSegmentAdmin)
ezra_admin_site.register(ExponentialCampaign, ExponentialCampaignAdmin)
ezra_admin_site.register(ExponentialSMSLog, ExponentialSMSLogAdmin)
ezra_admin_site.register(ExponentialUptake, ExponentialUptakeAdmin)


# ===========================================
# SMS Templates - Admin Registration
# ===========================================

from .models import SMSTemplate


class SMSTemplateAdmin(FranchiseeFilteredAdmin):
    list_display = ['name', 'template_id', 'bucket', 'is_active', 'created_at', 'updated_at']
    list_filter = ['bucket', 'is_active']
    search_fields = ['name', 'template_id', 'body']
    readonly_fields = ['created_at', 'updated_at']
    list_per_page = 25


ezra_admin_site.register(SMSTemplate, SMSTemplateAdmin)


# ===========================================
# EZRA SCHEDULING - Admin Registration
# ===========================================

from .models import (
    SchedulingTimeBucket, SchedulingDailyMetrics, SchedulingRecommendation,
)


class SchedulingTimeBucketAdmin(admin.ModelAdmin):
    list_display = ['store', 'date', 'time_bucket', 'work_center', 'revenue', 'guest_tickets', 'labor_hours', 'is_idle']
    list_filter = ['time_bucket', 'is_idle', 'work_center', 'store']
    search_fields = ['store__name', 'work_center']
    readonly_fields = ['created_at']
    list_per_page = 50


class SchedulingDailyMetricsAdmin(admin.ModelAdmin):
    list_display = ['store', 'date', 'total_revenue', 'total_payroll_hours', 'idle_hours', 'pct_idle', 'srph', 'tplh', 'has_overtime', 'scheduling_quality_score']
    list_filter = ['has_overtime', 'store']
    search_fields = ['store__name']
    readonly_fields = ['created_at']
    list_per_page = 50


class SchedulingRecommendationAdmin(admin.ModelAdmin):
    list_display = ['store', 'date', 'recommendation_type', 'priority', 'title', 'time_bucket']
    list_filter = ['recommendation_type', 'priority', 'store']
    search_fields = ['store__name', 'title']
    readonly_fields = ['created_at']
    list_per_page = 50


ezra_admin_site.register(SchedulingTimeBucket, SchedulingTimeBucketAdmin)
ezra_admin_site.register(SchedulingDailyMetrics, SchedulingDailyMetricsAdmin)
ezra_admin_site.register(SchedulingRecommendation, SchedulingRecommendationAdmin)


# ===========================================
# Missing Models - Admin Registration
# ===========================================

from .models import ReportSchedule, TwilioCallbackLog, GuestImport


class ReportScheduleAdmin(FranchiseeFilteredAdmin):
    list_display = ['name', 'tenant', 'cron_expression', 'schedule_time', 'timezone', 'is_active', 'last_run_at', 'last_run_status']
    list_filter = ['is_active', 'last_run_status']
    search_fields = ['name', 'tenant__name']
    readonly_fields = ['created_at', 'updated_at', 'last_run_at', 'last_run_status', 'last_run_error']
    list_per_page = 25


class TwilioCallbackLogAdmin(admin.ModelAdmin):
    list_display = ['message_sid', 'message_status', 'to_number', 'from_number', 'error_code', 'received_at', 'tenant']
    list_filter = ['message_status', 'tenant']
    search_fields = ['message_sid', 'to_number']
    readonly_fields = ['message_sid', 'message_status', 'to_number', 'from_number', 'error_code', 'error_message', 'raw_payload', 'sms_log', 'tenant', 'received_at']
    list_per_page = 50

    def has_add_permission(self, request):
        return False  # Read-only audit log

    def has_change_permission(self, request, obj=None):
        return False

    def has_delete_permission(self, request, obj=None):
        return request.user.is_superuser


class GuestImportAdmin(FranchiseeFilteredAdmin):
    list_display = ['file_name', 'tenant', 'status', 'total_rows', 'created_count', 'updated_count', 'error_count', 'uploaded_by', 'created_at', 'completed_at']
    list_filter = ['status', 'tenant']
    search_fields = ['file_name', 'tenant__name']
    readonly_fields = ['tenant', 'uploaded_by', 'file_name', 'file_size', 'status', 'total_rows', 'created_count', 'updated_count', 'error_count', 'errors', 'column_mapping', 'detected_headers', 'created_at', 'completed_at']
    list_per_page = 25

    def has_add_permission(self, request):
        return False  # Created via API only


ezra_admin_site.register(ReportSchedule, ReportScheduleAdmin)
ezra_admin_site.register(TwilioCallbackLog, TwilioCallbackLogAdmin)
ezra_admin_site.register(GuestImport, GuestImportAdmin)


# ===========================================
# New Models - SegmentConfig
# ===========================================

from .models import SegmentConfig


class SegmentConfigAdmin(FranchiseeFilteredAdmin):
    list_display = ['name', 'slug', 'tenant', 'min_days', 'max_days', 'risk_level', 'color', 'sort_order', 'is_active']
    list_filter = ['tenant', 'risk_level', 'is_active']
    search_fields = ['name', 'slug', 'tenant__name']
    list_editable = ['min_days', 'max_days', 'risk_level', 'sort_order', 'is_active']
    ordering = ['tenant', 'sort_order']
    list_per_page = 50


ezra_admin_site.register(SegmentConfig, SegmentConfigAdmin)
