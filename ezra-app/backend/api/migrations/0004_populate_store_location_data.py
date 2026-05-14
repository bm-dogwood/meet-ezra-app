from django.db import migrations
import random
from datetime import datetime, timedelta

def populate_store_data(apps, schema_editor):
    Store = apps.get_model('api', 'Store')
    
    # US cities and states
    locations = [
        ('Los Angeles', 'CA'),
        ('San Francisco', 'CA'),
        ('San Diego', 'CA'),
        ('Sacramento', 'CA'),
        ('Fresno', 'CA'),
        ('Las Vegas', 'NV'),
        ('Reno', 'NV'),
        ('Henderson', 'NV'),
        ('Phoenix', 'AZ'),
        ('Tucson', 'AZ'),
        ('Scottsdale', 'AZ'),
        ('Mesa', 'AZ'),
        ('Tempe', 'AZ'),
        ('Austin', 'TX'),
        ('Houston', 'TX'),
        ('Dallas', 'TX'),
        ('San Antonio', 'TX'),
        ('Fort Worth', 'TX'),
        ('Denver', 'CO'),
        ('Colorado Springs', 'CO'),
        ('Seattle', 'WA'),
        ('Portland', 'OR'),
        ('Salt Lake City', 'UT'),
        ('Minneapolis', 'MN'),
        ('St. Paul', 'MN'),
        ('Chicago', 'IL'),
        ('Miami', 'FL'),
        ('Orlando', 'FL'),
        ('Tampa', 'FL'),
        ('Jacksonville', 'FL'),
        ('Atlanta', 'GA'),
        ('Charlotte', 'NC'),
        ('Raleigh', 'NC'),
        ('Nashville', 'TN'),
        ('New York', 'NY'),
        ('Boston', 'MA'),
        ('Philadelphia', 'PA'),
    ]
    
    statuses = ['active', 'active', 'active', 'active', 'onboarding', 'inactive']  # Weighted towards active
    
    stores = Store.objects.all()
    
    for store in stores:
        city, state = random.choice(locations)
        status = random.choice(statuses)
        
        # Random last_synced_at within last 7 days
        days_ago = random.randint(0, 7)
        hours_ago = random.randint(0, 23)
        last_synced = datetime.now() - timedelta(days=days_ago, hours=hours_ago)
        
        store.city = city
        store.state = state
        store.status = status
        store.last_synced_at = last_synced
        store.save()

def reverse_populate(apps, schema_editor):
    Store = apps.get_model('api', 'Store')
    Store.objects.all().update(city=None, state=None, status='active', last_synced_at=None)

class Migration(migrations.Migration):
    dependencies = [
        ('api', '0003_add_store_location_fields'),
    ]

    operations = [
        migrations.RunPython(populate_store_data, reverse_populate),
    ]
