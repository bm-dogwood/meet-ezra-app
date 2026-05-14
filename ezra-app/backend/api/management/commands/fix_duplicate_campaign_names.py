"""
Fix duplicate campaign names within the same tenant by appending a suffix.
"""
from django.core.management.base import BaseCommand
from django.db.models import Count

from api.models import ExponentialCampaign


class Command(BaseCommand):
    help = 'Fix duplicate campaign names by appending a numeric suffix'

    def handle(self, *args, **options):
        # Find duplicate names per tenant
        dupes = (
            ExponentialCampaign.objects
            .values('tenant_id', 'name')
            .annotate(cnt=Count('id'))
            .filter(cnt__gt=1)
        )

        total_fixed = 0
        for dupe in dupes:
            campaigns = list(
                ExponentialCampaign.objects
                .filter(tenant_id=dupe['tenant_id'], name=dupe['name'])
                .order_by('created_at')
            )
            # Keep the first one as-is, rename the rest
            for i, c in enumerate(campaigns[1:], start=2):
                new_name = f"{c.name} ({i})"
                # Ensure the new name is also unique
                while ExponentialCampaign.objects.filter(tenant_id=c.tenant_id, name=new_name).exists():
                    i += 1
                    new_name = f"{c.name} ({i})"
                self.stdout.write(f"  Renaming campaign {c.id}: '{c.name}' -> '{new_name}'")
                c.name = new_name
                c.save(update_fields=['name'])
                total_fixed += 1

        self.stdout.write(self.style.SUCCESS(f'Fixed {total_fixed} duplicate campaign names.'))
