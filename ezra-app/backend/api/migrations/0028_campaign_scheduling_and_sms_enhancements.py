"""
Add scheduling, multi-location, guest targeting, recurring fields to ExponentialCampaign.
Add enhanced status tracking fields to ExponentialSMSLog.
"""
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0027_exponentialcampaign_coupon_code'),
    ]

    operations = [
        # --- ExponentialCampaign new fields ---
        migrations.AddField(
            model_name='exponentialcampaign',
            name='booking_link',
            field=models.URLField(blank=True, default='', max_length=500),
        ),
        migrations.AddField(
            model_name='exponentialcampaign',
            name='location_ids',
            field=models.JSONField(blank=True, default=list, help_text='List of store IDs for multi-location scope'),
        ),
        migrations.AddField(
            model_name='exponentialcampaign',
            name='guest_ids',
            field=models.JSONField(blank=True, default=list, help_text='List of guest codes for guest-targeted scope'),
        ),
        migrations.AddField(
            model_name='exponentialcampaign',
            name='scheduled_at',
            field=models.DateTimeField(blank=True, help_text='When the campaign should be sent', null=True),
        ),
        migrations.AddField(
            model_name='exponentialcampaign',
            name='is_recurring',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='exponentialcampaign',
            name='recurring_frequency',
            field=models.CharField(blank=True, default='', help_text='daily|weekly|biweekly|monthly', max_length=20),
        ),
        migrations.AddField(
            model_name='exponentialcampaign',
            name='recurring_end_date',
            field=models.DateField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='exponentialcampaign',
            name='last_recurring_run',
            field=models.DateTimeField(blank=True, null=True),
        ),
        # Update scope choices
        migrations.AlterField(
            model_name='exponentialcampaign',
            name='scope',
            field=models.CharField(
                choices=[('all', 'All Locations'), ('single', 'Single Location'), ('multi', 'Multiple Locations'), ('guests', 'Specific Guests')],
                default='all', max_length=10,
            ),
        ),
        # Update status choices
        migrations.AlterField(
            model_name='exponentialcampaign',
            name='status',
            field=models.CharField(
                choices=[('draft', 'Draft'), ('scheduled', 'Scheduled'), ('active', 'Active'), ('paused', 'Paused'), ('completed', 'Completed')],
                default='draft', max_length=20,
            ),
        ),
        # Add index on scheduled_at
        migrations.AddIndex(
            model_name='exponentialcampaign',
            index=models.Index(fields=['scheduled_at'], name='exp_camp_scheduled_idx'),
        ),
        # --- ExponentialSMSLog enhancements ---
        migrations.AlterField(
            model_name='exponentialsmslog',
            name='status',
            field=models.CharField(
                choices=[('queued', 'Queued'), ('sent', 'Sent'), ('delivered', 'Delivered'), ('undelivered', 'Undelivered'), ('failed', 'Failed')],
                default='queued', max_length=20,
            ),
        ),
        migrations.AlterField(
            model_name='exponentialsmslog',
            name='twilio_message_sid',
            field=models.CharField(blank=True, db_index=True, help_text='Twilio message SID', max_length=64, null=True),
        ),
        migrations.AddField(
            model_name='exponentialsmslog',
            name='twilio_error_code',
            field=models.CharField(blank=True, default='', max_length=20),
        ),
        migrations.AddField(
            model_name='exponentialsmslog',
            name='price',
            field=models.DecimalField(blank=True, decimal_places=4, help_text='SMS cost from Twilio', max_digits=8, null=True),
        ),
    ]
