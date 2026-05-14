from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0030_add_idle_hours_detail'),
    ]

    operations = [
        migrations.AlterField(
            model_name='rawreport',
            name='report_type',
            field=models.CharField(
                choices=[
                    ('sales', 'Sales'),
                    ('production', 'Production'),
                    ('sales-accrual', 'Sales Accrual'),
                    ('attendance', 'Attendance'),
                    ('business-kpi', 'Business KPI'),
                    ('performance-by-hour', 'Performance By Hour'),
                    ('statutory-pay', 'Statutory Pay'),
                    ('appointments', 'Appointments'),
                ],
                max_length=50,
            ),
        ),
    ]
