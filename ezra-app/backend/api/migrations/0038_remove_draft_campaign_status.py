"""
Remove 'draft' campaign status — all campaigns are now 'scheduled' or later.
"""
from django.db import migrations, models


def convert_draft_to_scheduled(apps, schema_editor):
    Campaign = apps.get_model('api', 'ExponentialCampaign')
    Campaign.objects.filter(status='draft').update(status='scheduled')


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0037_campaign_scheduling_enhancements'),
    ]

    operations = [
        migrations.RunPython(convert_draft_to_scheduled, migrations.RunPython.noop),
        migrations.AlterField(
            model_name='exponentialcampaign',
            name='status',
            field=models.CharField(
                choices=[('scheduled', 'Scheduled'), ('active', 'Active'), ('paused', 'Paused'), ('completed', 'Completed')],
                default='scheduled', max_length=20,
            ),
        ),
    ]
