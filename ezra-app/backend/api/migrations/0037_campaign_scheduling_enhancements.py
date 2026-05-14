from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0036_guest_import'),
    ]

    operations = [
        migrations.AddField(
            model_name='exponentialcampaign',
            name='recurring_day_of_week',
            field=models.IntegerField(blank=True, help_text='0=Monday, 6=Sunday. Used for weekly/biweekly/monthly.', null=True),
        ),
        migrations.AddField(
            model_name='exponentialcampaign',
            name='campaign_timezone',
            field=models.CharField(blank=True, default='America/New_York', help_text='IANA timezone for scheduling', max_length=50),
        ),
    ]
