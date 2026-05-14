from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0047_store_booking_link'),
    ]

    operations = [
        migrations.AddField(
            model_name='exponentialcampaign',
            name='visit_date_from',
            field=models.DateField(blank=True, null=True, help_text='Filter customers with last_visit_date >= this date'),
        ),
        migrations.AddField(
            model_name='exponentialcampaign',
            name='visit_date_to',
            field=models.DateField(blank=True, null=True, help_text='Filter customers with last_visit_date <= this date'),
        ),
    ]
