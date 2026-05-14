"""
Management command to wipe all data from the dev database except Users and Tenants.
Users and Tenants are preserved so users can still log in.

Usage:
    python manage.py wipe_dev_data
    python manage.py wipe_dev_data --confirm   (skip interactive prompt)
"""

from django.core.management.base import BaseCommand
from django.db import connection


class Command(BaseCommand):
    help = 'Wipe all dev data except users and tenants'

    def add_arguments(self, parser):
        parser.add_argument(
            '--confirm',
            action='store_true',
            help='Skip interactive confirmation prompt',
        )

    def handle(self, *args, **options):
        if not options['confirm']:
            answer = input(
                '\n⚠️  This will DELETE ALL DATA except Users and Tenants.\n'
                'Type "yes" to proceed: '
            )
            if answer.strip().lower() != 'yes':
                self.stdout.write(self.style.WARNING('Aborted.'))
                return

        from api.models import (
            ExponentialSMSLog, ExponentialUptake, ExponentialCampaign,
            ExponentialVisit, ExponentialCustomer, ExponentialSegment,
            SMSTemplate,
            SchedulingRecommendation, SchedulingDailyMetrics, SchedulingTimeBucket,
            LPAlert, LPRiskScore, LowTicketService, LPAlertConfig,
            ReportSchedule, StoreTarget, ReportMetric, RawReport,
            PasswordResetOTP, AppConfig, Store,
        )

        # Ordered from leaf tables (no dependents) to parent tables.
        # Users and Tenants are intentionally excluded.
        models_to_wipe = [
            # Exponential
            ('ExponentialSMSLog', ExponentialSMSLog),
            ('ExponentialUptake', ExponentialUptake),
            ('ExponentialCampaign', ExponentialCampaign),
            ('ExponentialVisit', ExponentialVisit),
            ('ExponentialCustomer', ExponentialCustomer),
            ('ExponentialSegment', ExponentialSegment),
            ('SMSTemplate', SMSTemplate),
            # Scheduling
            ('SchedulingRecommendation', SchedulingRecommendation),
            ('SchedulingDailyMetrics', SchedulingDailyMetrics),
            ('SchedulingTimeBucket', SchedulingTimeBucket),
            # LP
            ('LPAlert', LPAlert),
            ('LPRiskScore', LPRiskScore),
            ('LowTicketService', LowTicketService),
            ('LPAlertConfig', LPAlertConfig),
            # Reports & Schedules
            ('ReportSchedule', ReportSchedule),
            ('StoreTarget', StoreTarget),
            ('ReportMetric', ReportMetric),
            ('RawReport', RawReport),
            # Misc
            ('PasswordResetOTP', PasswordResetOTP),
            ('AppConfig', AppConfig),
            # Stores (parent of many, delete last)
            ('Store', Store),
        ]

        total_deleted = 0
        for name, model in models_to_wipe:
            count = model.objects.count()
            if count > 0:
                model.objects.all().delete()
                self.stdout.write(f'  ✓ {name}: deleted {count} rows')
                total_deleted += count
            else:
                self.stdout.write(f'  - {name}: already empty')

        self.stdout.write('')
        self.stdout.write(self.style.SUCCESS(
            f'Done. Deleted {total_deleted} total rows. '
            f'Users and Tenants preserved.'
        ))
