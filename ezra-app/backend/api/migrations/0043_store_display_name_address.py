"""
Migration 0043: Add display_name and address fields to Store for SMS message variables.
"""
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0042_segment_config'),
    ]

    operations = [
        migrations.AddField(
            model_name='store',
            name='display_name',
            field=models.CharField(blank=True, default='', help_text='Client-friendly store name for SMS messages', max_length=255),
        ),
        migrations.AddField(
            model_name='store',
            name='address',
            field=models.CharField(blank=True, default='', help_text='Store address for SMS messages', max_length=500),
        ),
    ]
