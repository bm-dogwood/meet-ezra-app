# Generated migration for StoreTarget date-based targets

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0006_rename_revenue_target_to_daily'),
    ]

    operations = [
        # Drop the old table and create fresh since we're changing the schema significantly
        migrations.RunSQL(
            sql="DROP TABLE IF EXISTS api_storetarget;",
            reverse_sql="SELECT 1;"  # No-op for reverse
        ),
        migrations.CreateModel(
            name='StoreTarget',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('target_date', models.DateField()),
                ('revenue_target', models.DecimalField(decimal_places=2, default=0, max_digits=15)),
                ('labor_target_hours', models.DecimalField(decimal_places=2, default=0, max_digits=10)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('store', models.ForeignKey(on_delete=models.deletion.CASCADE, related_name='targets', to='api.store')),
            ],
            options={
                'unique_together': {('store', 'target_date')},
                'indexes': [models.Index(fields=['store', 'target_date'], name='api_storeta_store_i_target_idx')],
            },
        ),
    ]
