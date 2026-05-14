"""
Data migration to populate cron_expression and report_types from existing data,
then remove the old report_type CharField and rs_time_idx index.

Requirements: 2.5, 8.3, 8.4, 8.5
"""

import logging

from django.db import migrations

logger = logging.getLogger(__name__)


def populate_cron_and_report_types(apps, schema_editor):
    """
    For each existing ReportSchedule record:
    - Set report_types = [report_type]
    - Set cron_expression from schedule_time (minute hour * * *)
    - Handle null/invalid schedule_time with default '0 0 * * *'
    """
    ReportSchedule = apps.get_model('api', 'ReportSchedule')

    for schedule in ReportSchedule.objects.all():
        # Populate report_types from the old report_type field
        if schedule.report_type:
            schedule.report_types = [schedule.report_type]
        else:
            schedule.report_types = []
            logger.warning(
                "ReportSchedule id=%s has empty report_type, setting report_types to []",
                schedule.pk,
            )

        # Populate cron_expression from schedule_time
        try:
            if schedule.schedule_time is not None:
                minute = schedule.schedule_time.minute
                hour = schedule.schedule_time.hour
                schedule.cron_expression = f"{minute} {hour} * * *"
            else:
                schedule.cron_expression = "0 0 * * *"
                logger.warning(
                    "ReportSchedule id=%s has null schedule_time, "
                    "assigning default cron_expression '0 0 * * *'",
                    schedule.pk,
                )
        except (AttributeError, ValueError) as exc:
            schedule.cron_expression = "0 0 * * *"
            logger.warning(
                "ReportSchedule id=%s has invalid schedule_time (%s), "
                "assigning default cron_expression '0 0 * * *': %s",
                schedule.pk,
                schedule.schedule_time,
                exc,
            )

        schedule.save(update_fields=["report_types", "cron_expression"])


def reverse_populate(apps, schema_editor):
    """
    Reverse: restore report_type from report_types[0] if available.
    """
    ReportSchedule = apps.get_model('api', 'ReportSchedule')

    for schedule in ReportSchedule.objects.all():
        if schedule.report_types:
            schedule.report_type = schedule.report_types[0]
        else:
            schedule.report_type = "daily"
        schedule.save(update_fields=["report_type"])


class Migration(migrations.Migration):

    dependencies = [
        ("api", "0020_reportschedule_cron_expression_and_report_types"),
    ]

    operations = [
        # Step 1: Data migration — populate cron_expression and report_types
        migrations.RunPython(
            populate_cron_and_report_types,
            reverse_code=reverse_populate,
        ),
        # Step 2: Remove old report_type CharField
        migrations.RemoveField(
            model_name="reportschedule",
            name="report_type",
        ),
        # Step 3: Remove old rs_time_idx index on schedule_time
        migrations.RemoveIndex(
            model_name="reportschedule",
            name="rs_time_idx",
        ),
    ]
