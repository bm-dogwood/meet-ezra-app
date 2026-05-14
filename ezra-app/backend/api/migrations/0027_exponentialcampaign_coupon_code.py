from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0026_reportschedule_unique_name_per_tenant'),
    ]

    operations = [
        migrations.AddField(
            model_name='exponentialcampaign',
            name='coupon_code',
            field=models.CharField(blank=True, default='', max_length=50),
        ),
    ]
