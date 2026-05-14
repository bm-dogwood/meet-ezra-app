# Generated migration for StoreTarget model changes

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0005_add_store_target_model'),
    ]

    operations = [
        migrations.RenameField(
            model_name='storetarget',
            old_name='revenue_target',
            new_name='daily_revenue_target',
        ),
    ]
