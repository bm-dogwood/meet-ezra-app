"""
Migration 0035: Add tenant FK to TwilioCallbackLog for tenant isolation.
"""
import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0034_auto_detect_remaining'),
    ]

    operations = [
        migrations.AddField(
            model_name='twiliocallbacklog',
            name='tenant',
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                related_name='twilio_callback_logs',
                to='api.tenant',
            ),
        ),
        migrations.AddIndex(
            model_name='twiliocallbacklog',
            index=models.Index(fields=['tenant'], name='twilio_cb_tenant_idx'),
        ),
    ]
