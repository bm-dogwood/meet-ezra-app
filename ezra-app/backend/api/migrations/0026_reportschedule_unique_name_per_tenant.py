"""
Add unique constraint on (tenant, name) for ReportSchedule.
First de-duplicates any existing names within the same tenant.
"""

from django.db import migrations, models


def deduplicate_schedule_names(apps, schema_editor):
    """Ensure no two schedules in the same tenant share the same name."""
    ReportSchedule = apps.get_model('api', 'ReportSchedule')
    # Group by tenant
    tenant_ids = ReportSchedule.objects.values_list('tenant_id', flat=True).distinct()
    for tenant_id in tenant_ids:
        used_names = set()
        schedules = ReportSchedule.objects.filter(tenant_id=tenant_id).order_by('id')
        for schedule in schedules:
            name = schedule.name or ''
            if not name.strip():
                # Generate a name for blank entries
                types = schedule.report_types or []
                labels = {
                    'daily': 'Daily Sales',
                    'weekly': 'Weekly Sales',
                    'lp': 'LP Risk',
                    'scheduling': 'Scheduling',
                }
                parts = [labels.get(t, t) for t in types[:2]]
                name = (' + '.join(parts) + ' Schedule') if parts else 'Report Schedule'

            candidate = name.strip()
            counter = 2
            while candidate in used_names:
                candidate = f"{name.strip()} ({counter})"
                counter += 1
            if candidate != schedule.name:
                schedule.name = candidate
                schedule.save(update_fields=['name'])
            used_names.add(candidate)


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0025_populate_schedule_names'),
    ]

    operations = [
        migrations.RunPython(deduplicate_schedule_names, migrations.RunPython.noop),
        migrations.AddConstraint(
            model_name='reportschedule',
            constraint=models.UniqueConstraint(
                fields=['tenant', 'name'],
                name='rs_unique_name_per_tenant',
            ),
        ),
    ]
