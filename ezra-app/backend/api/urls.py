from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from .views import (
    LoginView, MeView,
    ForgotPasswordRequestView, ForgotPasswordVerifyView, ChangePasswordView,
    TenantViewSet, UserViewSet, StoreViewSet,
    SalesOverviewView, StoreSalesReportView, SalesReportDownloadView,
    TopPerformersView, StoreMetricsView, QuickStatsView,
    LPOverviewView, LPAlertsView, LPFlagsByLocationView,
    LPAlertDetailView, LPConfigView, LPReportDownloadView, LPCalculateView,
    LocationStatesView,
    IngestRawReportView,
    StoreTargetsView, CurrentUserView,
    ReportScheduleViewSet, ScheduleTimeOptionsView,
    # AppConfig
    AppConfigListView,
    # Exponential
    ExponentialOverviewView, ExponentialCampaignsView,
    ExponentialCampaignDetailView, ExponentialCampaignExecuteView,
    ExponentialLocationsView, ExponentialGuestsView, ExponentialGuestImportView,
    ExponentialUptakeView, ExponentialAudienceEstimateView,
    ExponentialCampaignStatusView, ExponentialStoreDrilldownView,
    ExponentialCampaignSyncStatusesView,
    ExponentialReportDownloadView,
    ExponentialServiceTypesView,
    SegmentConfigView,
    StoreDataUploadView,
    TwilioValidateView,
    SMSTemplateListView, SMSTemplateDetailView,
    TwilioSendTestView, SMSTemplatePreviewView,
    TwilioStatusCallbackView, TwilioMessageLookupView, TwilioInboundSMSView,
    GuestImportParseView, GuestImportMapView, GuestImportListView,
    # Scheduling
    SchedulingOverviewView, SchedulingStoreRankingsView, SchedulingStoreDrilldownView,
    SchedulingReportDownloadView,
)

@api_view(['GET'])
@permission_classes([AllowAny])
def health_check(request):
    return Response({'status': 'healthy'})

router = DefaultRouter()
router.register(r'tenants', TenantViewSet)
router.register(r'users', UserViewSet)
router.register(r'stores', StoreViewSet)
router.register(r'schedules', ReportScheduleViewSet, basename='reportschedule')

urlpatterns = [
    # Health check for K8s probes
    path('health/', health_check, name='health'),
    
    # Auth endpoints
    path('auth/login/', LoginView.as_view(), name='login'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/me/', MeView.as_view(), name='me'),
    path('auth/forgot-password/request/', ForgotPasswordRequestView.as_view(), name='forgot_password_request'),
    path('auth/forgot-password/verify/', ForgotPasswordVerifyView.as_view(), name='forgot_password_verify'),
    path('auth/change-password/', ChangePasswordView.as_view(), name='change_password'),
    
    # Sales endpoints
    path('sales/overview/', SalesOverviewView.as_view(), name='sales_overview'),
    path('sales/top-performers/', TopPerformersView.as_view(), name='top_performers'),
    path('sales/quick-stats/', QuickStatsView.as_view(), name='quick_stats'),
    path('stores/<int:store_id>/sales-report/', StoreSalesReportView.as_view(), name='store_sales_report'),
    path('stores/metrics/', StoreMetricsView.as_view(), name='store_metrics'),
    
    # Reports endpoints
    path('reports/sales/download/', SalesReportDownloadView.as_view(), name='sales_report_download'),
    
    # Location endpoints
    path('locations/filter/states/', LocationStatesView.as_view(), name='location_states'),
    
    # LP (Loss Prevention) endpoints
    path('lp/overview/', LPOverviewView.as_view(), name='lp_overview'),
    path('lp/alerts/', LPAlertsView.as_view(), name='lp_alerts'),
    path('lp/alerts/<str:alert_type>/', LPAlertDetailView.as_view(), name='lp_alert_detail'),
    path('lp/flags-by-location/', LPFlagsByLocationView.as_view(), name='lp_flags_by_location'),
    path('lp/config/', LPConfigView.as_view(), name='lp_config'),
    path('lp/report/download/', LPReportDownloadView.as_view(), name='lp_report_download'),
    path('lp/calculate/', LPCalculateView.as_view(), name='lp_calculate'),
    path('reports/lp/download/', LPReportDownloadView.as_view(), name='reports_lp_download'),
    
    # Internal endpoints (API key auth)
    path('internal/reports/raw/', IngestRawReportView.as_view(), name='ingest_raw'),
    
    # Store Targets (Set Goals)
    path('stores/targets/', StoreTargetsView.as_view(), name='store_targets'),
    
    # User profile with tenant
    path('users/me/', CurrentUserView.as_view(), name='current_user'),
    
    # Schedule time options
    path('schedules/time-options/', ScheduleTimeOptionsView.as_view(), name='schedule_time_options'),
    
    # Exponential (Customer Follow-up) endpoints
    path('exponential/overview/', ExponentialOverviewView.as_view(), name='exponential_overview'),
    path('exponential/campaigns/', ExponentialCampaignsView.as_view(), name='exponential_campaigns'),
    path('exponential/campaigns/<int:campaign_id>/status/', ExponentialCampaignStatusView.as_view(), name='exponential_campaign_status'),
    path('exponential/campaigns/<int:campaign_id>/detail/', ExponentialCampaignDetailView.as_view(), name='exponential_campaign_detail'),
    path('exponential/campaigns/<int:campaign_id>/execute/', ExponentialCampaignExecuteView.as_view(), name='exponential_campaign_execute'),
    path('exponential/campaigns/<int:campaign_id>/sync-statuses/', ExponentialCampaignSyncStatusesView.as_view(), name='exponential_campaign_sync_statuses'),
    path('exponential/locations/', ExponentialLocationsView.as_view(), name='exponential_locations'),
    path('exponential/segment-configs/', SegmentConfigView.as_view(), name='segment_configs'),
    path('exponential/store-data/', StoreDataUploadView.as_view(), name='store_data_upload'),
    path('exponential/guests/', ExponentialGuestsView.as_view(), name='exponential_guests'),
    path('exponential/guests/service-types/', ExponentialServiceTypesView.as_view(), name='exponential_service_types'),
    path('exponential/guests/import/', ExponentialGuestImportView.as_view(), name='exponential_guest_import'),
    path('exponential/guests/import/parse/', GuestImportParseView.as_view(), name='guest_import_parse'),
    path('exponential/guests/import/map/', GuestImportMapView.as_view(), name='guest_import_map'),
    path('exponential/guests/imports/', GuestImportListView.as_view(), name='guest_import_list'),
    path('exponential/uptake/', ExponentialUptakeView.as_view(), name='exponential_uptake'),
    path('exponential/audience-estimate/', ExponentialAudienceEstimateView.as_view(), name='exponential_audience_estimate'),
    path('exponential/stores/<int:store_id>/', ExponentialStoreDrilldownView.as_view(), name='exponential_store_drilldown'),
    path('exponential/twilio/validate/', TwilioValidateView.as_view(), name='twilio_validate'),
    path('exponential/twilio/send-test/', TwilioSendTestView.as_view(), name='twilio_send_test'),
    path('exponential/twilio/status-callback/', TwilioStatusCallbackView.as_view(), name='twilio_status_callback'),
    path('exponential/twilio/inbound/', TwilioInboundSMSView.as_view(), name='twilio_inbound_sms'),
    path('exponential/twilio/messages/<str:message_sid>/', TwilioMessageLookupView.as_view(), name='twilio_message_lookup'),
    path('exponential/templates/', SMSTemplateListView.as_view(), name='sms_template_list'),
    path('exponential/templates/preview/', SMSTemplatePreviewView.as_view(), name='sms_template_preview'),
    path('exponential/templates/<int:template_id>/', SMSTemplateDetailView.as_view(), name='sms_template_detail'),
    path('exponential/report/download/', ExponentialReportDownloadView.as_view(), name='exponential_report_download'),
    
    # Scheduling (Labor Optimization) endpoints
    path('scheduling/overview/', SchedulingOverviewView.as_view(), name='scheduling_overview'),
    path('scheduling/rankings/', SchedulingStoreRankingsView.as_view(), name='scheduling_rankings'),
    path('scheduling/stores/<int:store_id>/', SchedulingStoreDrilldownView.as_view(), name='scheduling_store_drilldown'),
    path('scheduling/report/download/', SchedulingReportDownloadView.as_view(), name='scheduling_report_download'),
    
    # AppConfig API
    path('config/', AppConfigListView.as_view(), name='app_config'),
    
    # Router URLs
    path('', include(router.urls)),
]
