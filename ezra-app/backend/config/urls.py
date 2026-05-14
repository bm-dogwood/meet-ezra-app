from django.contrib import admin
from django.urls import path, include
from api.views import IngestRawReportView
from api.admin import ezra_admin_site

urlpatterns = [
    path('admin/', ezra_admin_site.urls),
    path('api/', include('api.urls')),
    # Internal ingestion endpoint at root level (no /api prefix)
    path('internal/reports/raw', IngestRawReportView.as_view(), name='ingest_raw_root'),
]
