from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0039_campaign_template_variables'),
    ]

    operations = [
        migrations.AddField(
            model_name='exponentialcampaign',
            name='recurring_start_date',
            field=models.DateField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='exponentialcampaign',
            name='recurring_time',
            field=models.CharField(blank=True, default='', help_text='HH:MM in campaign timezone', max_length=5),
        ),
    ]
