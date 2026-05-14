"""
Migration: Add TwilioCallbackLog model and guest-opt-outs report type.
"""
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0032_fix_smslog_error_message_default'),
    ]

    operations = [
        # Add TwilioCallbackLog model
        migrations.CreateModel(
            name='TwilioCallbackLog',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('message_sid', models.CharField(db_index=True, max_length=64)),
                ('message_status', models.CharField(max_length=30)),
                ('to_number', models.CharField(blank=True, default='', max_length=20)),
                ('from_number', models.CharField(blank=True, default='', max_length=20)),
                ('error_code', models.CharField(blank=True, default='', max_length=20)),
                ('error_message', models.TextField(blank=True, default='')),
                ('raw_payload', models.JSONField(default=dict, help_text='Full POST body from Twilio')),
                ('sms_log', models.ForeignKey(
                    blank=True, null=True,
                    on_delete=django.db.models.deletion.SET_NULL,
                    related_name='callback_logs',
                    to='api.exponentialsmslog',
                )),
                ('received_at', models.DateTimeField(auto_now_add=True)),
            ],
            options={
                'db_table': 'twilio_callback_logs',
            },
        ),
        migrations.AddIndex(
            model_name='twiliocallbacklog',
            index=models.Index(fields=['message_sid'], name='twilio_cb_sid_idx'),
        ),
        migrations.AddIndex(
            model_name='twiliocallbacklog',
            index=models.Index(fields=['received_at'], name='twilio_cb_received_idx'),
        ),
        migrations.AddIndex(
            model_name='twiliocallbacklog',
            index=models.Index(fields=['message_status'], name='twilio_cb_status_idx'),
        ),
        # Update RawReport report_type choices to include guest-opt-outs
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
                    ('guest-opt-outs', 'Guest Opt-outs'),
                ],
                max_length=50,
            ),
        ),
    ]
