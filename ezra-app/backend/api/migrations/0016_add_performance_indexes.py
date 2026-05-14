# Generated migration for performance indexes

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0015_alter_tenant_options'),
    ]

    operations = [
        # Tenant model indexes
        migrations.AddIndex(
            model_name='tenant',
            index=models.Index(fields=['code'], name='api_tenant_code_idx'),
        ),
        migrations.AddIndex(
            model_name='tenant',
            index=models.Index(fields=['is_active'], name='api_tenant_active_idx'),
        ),
        
        # User model indexes
        migrations.AddIndex(
            model_name='user',
            index=models.Index(fields=['tenant'], name='api_user_tenant_idx'),
        ),
        migrations.AddIndex(
            model_name='user',
            index=models.Index(fields=['email'], name='api_user_email_idx'),
        ),
        migrations.AddIndex(
            model_name='user',
            index=models.Index(fields=['role'], name='api_user_role_idx'),
        ),
        migrations.AddIndex(
            model_name='user',
            index=models.Index(fields=['tenant', 'role'], name='api_user_tenant_role_idx'),
        ),
        
        # Store model indexes
        migrations.AddIndex(
            model_name='store',
            index=models.Index(fields=['tenant'], name='api_store_tenant_idx'),
        ),
        migrations.AddIndex(
            model_name='store',
            index=models.Index(fields=['status'], name='api_store_status_idx'),
        ),
        migrations.AddIndex(
            model_name='store',
            index=models.Index(fields=['tenant', 'status'], name='api_store_tenant_status_idx'),
        ),
        migrations.AddIndex(
            model_name='store',
            index=models.Index(fields=['external_code'], name='api_store_external_code_idx'),
        ),
        migrations.AddIndex(
            model_name='store',
            index=models.Index(fields=['last_synced_at'], name='api_store_last_synced_idx'),
        ),
        
        # RawReport model indexes - CRITICAL for duplicate prevention
        migrations.AddIndex(
            model_name='rawreport',
            index=models.Index(fields=['tenant', 'report_type', 'report_date'], name='api_rawreport_unique_idx'),
        ),
        migrations.AddIndex(
            model_name='rawreport',
            index=models.Index(fields=['tenant'], name='api_rawreport_tenant_idx'),
        ),
        migrations.AddIndex(
            model_name='rawreport',
            index=models.Index(fields=['report_type'], name='api_rawreport_type_idx'),
        ),
        migrations.AddIndex(
            model_name='rawreport',
            index=models.Index(fields=['report_date'], name='api_rawreport_date_idx'),
        ),
        migrations.AddIndex(
            model_name='rawreport',
            index=models.Index(fields=['ingested_at'], name='api_rawreport_ingested_idx'),
        ),
    ]
