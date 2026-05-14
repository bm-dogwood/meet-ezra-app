"""
Migration 0036: GuestImport model for tracking guest import batches with column mapping.
"""
import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0035_twilio_callback_log_tenant'),
    ]

    operations = [
        migrations.CreateModel(
            name='GuestImport',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('file_name', models.CharField(max_length=255)),
                ('file_size', models.IntegerField(default=0, help_text='File size in bytes')),
                ('status', models.CharField(choices=[
                    ('pending', 'Pending Mapping'),
                    ('mapped', 'Mapped'),
                    ('processing', 'Processing'),
                    ('completed', 'Completed'),
                    ('failed', 'Failed'),
                ], default='pending', max_length=20)),
                ('total_rows', models.IntegerField(default=0)),
                ('created_count', models.IntegerField(default=0)),
                ('updated_count', models.IntegerField(default=0)),
                ('error_count', models.IntegerField(default=0)),
                ('errors', models.JSONField(blank=True, default=list, help_text='List of row-level errors')),
                ('column_mapping', models.JSONField(blank=True, default=dict)),
                ('detected_headers', models.JSONField(blank=True, default=list)),
                ('raw_rows', models.JSONField(blank=True, default=list)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('completed_at', models.DateTimeField(blank=True, null=True)),
                ('tenant', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='guest_imports', to='api.tenant')),
                ('uploaded_by', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='guest_imports', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'db_table': 'guest_imports',
                'ordering': ['-created_at'],
            },
        ),
        migrations.AddIndex(
            model_name='guestimport',
            index=models.Index(fields=['tenant', 'status'], name='guest_imp_tenant_status_idx'),
        ),
        migrations.AddIndex(
            model_name='guestimport',
            index=models.Index(fields=['created_at'], name='guest_imp_created_idx'),
        ),
    ]
