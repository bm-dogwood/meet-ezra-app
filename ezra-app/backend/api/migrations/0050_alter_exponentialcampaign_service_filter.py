# Generated manually on 2026-05-12
#
# Widens exp_campaigns.service_filter from varchar(255) to TEXT so that
# campaigns targeting a large number of comma-separated services don't
# trigger StringDataRightTruncation on insert.
#
# In PostgreSQL, ALTER COLUMN ... TYPE text on an existing varchar column
# is a metadata-only change (no table rewrite) and is near-instant even
# on large tables.

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0049_alter_exponentialcampaign_service_filter'),
    ]

    operations = [
        migrations.AlterField(
            model_name='exponentialcampaign',
            name='service_filter',
            field=models.TextField(blank=True, default='', help_text='Filter eligible customers by last_service (comma-separated for OR)'),
        ),
    ]
