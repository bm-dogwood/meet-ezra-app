from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0045_add_last_service_to_customer'),
    ]

    operations = [
        migrations.AddField(
            model_name='exponentialcampaign',
            name='service_filter',
            field=models.CharField(blank=True, default='', help_text='Filter eligible customers by last_service (partial match)', max_length=255),
        ),
    ]
