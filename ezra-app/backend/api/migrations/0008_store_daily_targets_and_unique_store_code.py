from django.db import migrations, models
from django.db.models import Count


def migrate_latest_date_targets_to_store(apps, schema_editor):
    Store = apps.get_model('api', 'Store')
    StoreTarget = apps.get_model('api', 'StoreTarget')

    for store in Store.objects.all().iterator():
        latest = (
            StoreTarget.objects.filter(store_id=store.id)
            .order_by('-target_date', '-updated_at', '-id')
            .first()
        )
        if not latest:
            continue

        store.daily_revenue_target = latest.revenue_target
        store.daily_labor_target_hours = latest.labor_target_hours
        store.save(update_fields=['daily_revenue_target', 'daily_labor_target_hours'])


def dedupe_store_codes_across_tenants(apps, schema_editor):
    Store = apps.get_model('api', 'Store')
    ReportMetric = apps.get_model('api', 'ReportMetric')
    StoreTarget = apps.get_model('api', 'StoreTarget')

    duplicate_codes = (
        Store.objects.exclude(external_code__isnull=True)
        .exclude(external_code='')
        .values('external_code')
        .annotate(cnt=Count('id'))
        .filter(cnt__gt=1)
    )

    for dup in duplicate_codes.iterator():
        code = dup['external_code']
        stores = list(Store.objects.filter(external_code=code).order_by('id'))
        if len(stores) <= 1:
            continue

        metric_counts = {
            s.id: ReportMetric.objects.filter(store_id=s.id).count()
            for s in stores
        }

        stores_sorted = sorted(stores, key=lambda s: (-metric_counts.get(s.id, 0), s.id))
        canonical = stores_sorted[0]
        others = stores_sorted[1:]
        other_ids = [s.id for s in others]

        if other_ids:
            ReportMetric.objects.filter(store_id__in=other_ids).update(store_id=canonical.id)

            for other_id in other_ids:
                for target in StoreTarget.objects.filter(store_id=other_id).iterator():
                    exists = StoreTarget.objects.filter(
                        store_id=canonical.id,
                        target_date=target.target_date,
                    ).exists()
                    if exists:
                        target.delete()
                    else:
                        target.store_id = canonical.id
                        target.save(update_fields=['store'])

            for other in others:
                other.delete()


class Migration(migrations.Migration):
    # Disable atomic transaction to avoid PostgreSQL "pending trigger events" error
    atomic = False

    dependencies = [
        ('api', '0007_storetarget_date_based'),
    ]

    operations = [
        migrations.AddField(
            model_name='store',
            name='daily_revenue_target',
            field=models.DecimalField(decimal_places=2, default=0, max_digits=15),
        ),
        migrations.AddField(
            model_name='store',
            name='daily_labor_target_hours',
            field=models.DecimalField(decimal_places=2, default=0, max_digits=10),
        ),
        migrations.RunPython(migrate_latest_date_targets_to_store, migrations.RunPython.noop),
        migrations.RunPython(dedupe_store_codes_across_tenants, migrations.RunPython.noop),
        migrations.AlterUniqueTogether(
            name='store',
            unique_together=set(),
        ),
    ]
