from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0040_campaign_recurring_start_time'),
    ]

    operations = [
        migrations.AlterField(
            model_name='exponentialcustomer',
            name='store',
            field=models.ForeignKey(
                blank=True, null=True,
                on_delete=django.db.models.deletion.CASCADE,
                related_name='exp_customers',
                to='api.store',
            ),
        ),
        migrations.AlterField(
            model_name='exponentialcustomer',
            name='tenant',
            field=models.ForeignKey(
                blank=True, null=True,
                on_delete=django.db.models.deletion.CASCADE,
                related_name='exp_customers',
                to='api.tenant',
            ),
        ),
    ]
