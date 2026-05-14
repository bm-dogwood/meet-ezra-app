"""
Migration 0042: SegmentConfig model for customizable customer segments per tenant.
"""
import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0041_customer_store_nullable'),
    ]

    operations = [
        migrations.CreateModel(
            name='SegmentConfig',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100, help_text='Display name, e.g. "4-6 weeks"')),
                ('slug', models.SlugField(help_text='Unique key, e.g. "4_6wk"')),
                ('min_days', models.IntegerField(help_text='Minimum days since last visit (inclusive)')),
                ('max_days', models.IntegerField(blank=True, null=True, help_text='Maximum days since last visit (inclusive). Null = no upper limit.')),
                ('risk_level', models.CharField(choices=[('low', 'Low'), ('medium', 'Medium'), ('high', 'High')], default='medium', max_length=20)),
                ('color', models.CharField(default='warning', help_text='UI color key: success, warning, danger', max_length=20)),
                ('sort_order', models.IntegerField(default=0)),
                ('is_active', models.BooleanField(default=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('tenant', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='segment_configs', to='api.tenant')),
            ],
            options={
                'db_table': 'segment_configs',
                'ordering': ['sort_order'],
                'unique_together': {('tenant', 'slug')},
            },
        ),
    ]
