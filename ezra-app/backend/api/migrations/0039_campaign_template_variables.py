from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0038_remove_draft_campaign_status'),
    ]

    operations = [
        migrations.AddField(
            model_name='exponentialcampaign',
            name='template_variables',
            field=models.JSONField(blank=True, default=dict, help_text='User-supplied template variable values'),
        ),
    ]
