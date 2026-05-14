# Generated migration for adding cron_expression, report_types fields
# and composite index to ReportSchedule model.

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0019_add_reportschedule_model'),
    ]

    operations = [
        migrations.AddField(
            model_name='reportschedule',
            name='cron_expression',
            field=models.CharField(default='0 0 * * *', max_length=100),
        ),
        migrations.AddField(
            model_name='reportschedule',
            name='report_types',
            field=models.JSONField(default=list),
        ),
        migrations.AlterField(
            model_name='reportschedule',
            name='last_run_status',
            field=models.CharField(
                blank=True,
                choices=[('success', 'Success'), ('failed', 'Failed'), ('partial', 'Partial')],
                max_length=20,
                null=True,
            ),
        ),
        migrations.AddIndex(
            model_name='reportschedule',
            index=models.Index(fields=['cron_expression', 'timezone'], name='rs_cron_tz_idx'),
        ),
    ]
