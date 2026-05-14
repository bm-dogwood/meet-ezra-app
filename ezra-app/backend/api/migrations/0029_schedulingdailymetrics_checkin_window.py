from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0028_campaign_scheduling_and_sms_enhancements'),
    ]

    operations = [
        migrations.AddField(
            model_name='schedulingdailymetrics',
            name='earliest_checkin_hour',
            field=models.IntegerField(blank=True, help_text='Earliest check-in hour (0-23) from Attendance', null=True),
        ),
        migrations.AddField(
            model_name='schedulingdailymetrics',
            name='latest_checkout_hour',
            field=models.IntegerField(blank=True, help_text='Latest check-out hour (0-23) from Attendance', null=True),
        ),
        migrations.AddField(
            model_name='schedulingtimebucket',
            name='idle_hour_count',
            field=models.IntegerField(default=0, help_text='Number of individual hours within this bucket where Guest Serviced/Floor Hour == 0'),
        ),
        migrations.AddField(
            model_name='schedulingtimebucket',
            name='total_hour_count',
            field=models.IntegerField(default=0, help_text='Total number of hours with data in this bucket'),
        ),
    ]
