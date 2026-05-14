"""
Migration: Add default='' to ExponentialSMSLog.error_message field.
Fixes IntegrityError when SMS sends successfully and error_message is None.
"""
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0031_add_appointments_report_type'),
    ]

    operations = [
        migrations.AlterField(
            model_name='exponentialsmslog',
            name='error_message',
            field=models.TextField(blank=True, default=''),
        ),
    ]
