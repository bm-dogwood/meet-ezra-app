"""
Django management command to generate 30 days of dummy sales and production data.
Date range: Nov 25, 2025 to Dec 23, 2025
"""

import random
from datetime import datetime, timedelta
from decimal import Decimal
from django.core.management.base import BaseCommand
from api.models import Store, ReportMetric, RawReport


class Command(BaseCommand):
    help = 'Generate 30 days of dummy sales and production data for all stores'

    def add_arguments(self, parser):
        parser.add_argument(
            '--clear',
            action='store_true',
            help='Clear existing metrics before generating new data',
        )

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('=' * 60))
        self.stdout.write(self.style.SUCCESS('DUMMY DATA GENERATOR - 30 Days Sales & Production'))
        self.stdout.write(self.style.SUCCESS('=' * 60))

        if options['clear']:
            self.stdout.write('Clearing existing metrics...')
            ReportMetric.objects.all().delete()
            RawReport.objects.all().delete()
            self.stdout.write(self.style.SUCCESS('Cleared!'))

        # Date range: Nov 25, 2025 to Dec 23, 2025
        start_date = datetime(2025, 11, 25).date()
        end_date = datetime(2025, 12, 23).date()

        stores = Store.objects.filter(status='active')
        self.stdout.write(f'Found {stores.count()} active stores')
        self.stdout.write(f'Date range: {start_date} to {end_date}')
        self.stdout.write('-' * 60)

        current_date = start_date
        total_days = (end_date - start_date).days + 1
        day_count = 0
        total_metrics = 0

        while current_date <= end_date:
            day_count += 1
            self.stdout.write(f'\n[Day {day_count}/{total_days}] Processing {current_date}...')

            day_metrics = 0
            for store in stores:
                # Generate and save sales metrics
                sales_metrics = self.generate_sales_metrics(store, current_date)
                day_metrics += sales_metrics

                # Generate and save production metrics
                prod_metrics = self.generate_production_metrics(store, current_date)
                day_metrics += prod_metrics

            self.stdout.write(f'  ✓ Created {day_metrics} metrics for {stores.count()} stores')
            total_metrics += day_metrics
            current_date += timedelta(days=1)

        self.stdout.write('\n' + '=' * 60)
        self.stdout.write(self.style.SUCCESS(f'DONE! Created {total_metrics} total metrics'))
        self.stdout.write(self.style.SUCCESS('=' * 60))

    def generate_sales_metrics(self, store, date):
        """Generate sales metrics for a store on a given date"""
        metrics_created = 0

        # Base values with randomization
        base_service_sales = random.uniform(800, 2500)
        base_product_sales = random.uniform(150, 500)

        # Day of week adjustment
        day_of_week = date.weekday()
        if day_of_week in [5, 6]:  # Weekend
            multiplier = random.uniform(1.2, 1.4)
        elif day_of_week == 0:  # Monday
            multiplier = random.uniform(0.7, 0.9)
        else:
            multiplier = random.uniform(0.9, 1.1)

        service_sales = round(base_service_sales * multiplier, 2)
        product_sales = round(base_product_sales * multiplier, 2)

        service_discount = round(service_sales * random.uniform(0.005, 0.02), 2)
        product_discount = round(product_sales * random.uniform(0.02, 0.05), 2)

        service_net = round(service_sales - service_discount, 2)
        product_net = round(product_sales - product_discount, 2)
        total_net = round(service_net + product_net, 2)
        total_sales = round(service_sales + product_sales, 2)

        tip_amount = round(service_net * random.uniform(0.08, 0.15), 2)

        card_ratio = random.uniform(0.75, 0.92)
        cc_amount = round(total_net * card_ratio, 2)
        cash_amount = round(total_net * (1 - card_ratio), 2)

        # Sales metrics to create
        sales_data = {
            'Total Sales': total_sales,
            'Total Net': total_net,
            'Service Sales': service_sales,
            'Service Discount': service_discount,
            'Service Net': service_net,
            'Product Sales': product_sales,
            'Product Discount': product_discount,
            'Product Net': product_net,
            'Tip Amount': tip_amount,
            'CC': cc_amount,
            'Cash': cash_amount,
            'Sales Net': total_net,  # Alias used in API
        }

        for metric_name, metric_value in sales_data.items():
            ReportMetric.objects.create(
                store=store,
                report_type='sales',
                report_date=date,
                metric_name=metric_name,
                metric_value=Decimal(str(metric_value))
            )
            metrics_created += 1

        return metrics_created

    def generate_production_metrics(self, store, date):
        """Generate production metrics for a store on a given date"""
        metrics_created = 0

        # Generate for 2-5 employees
        num_employees = random.randint(2, 5)

        total_ticket_count = 0
        total_guest_count = 0
        total_hours = 0

        for _ in range(num_employees):
            prod_hours = round(random.uniform(4, 9), 2)
            total_hours += prod_hours

            guests = random.randint(5, 15)
            total_guest_count += guests

            tickets = random.randint(5, 15)
            total_ticket_count += tickets

        # Store-level production metrics
        prod_data = {
            'Total Ticket Count': total_ticket_count,
            'Total Guest Count': total_guest_count,
            'Total Hours': round(total_hours, 2),
            'Production Hours': round(total_hours * 0.9, 2),
        }

        for metric_name, metric_value in prod_data.items():
            ReportMetric.objects.create(
                store=store,
                report_type='production',
                report_date=date,
                metric_name=metric_name,
                metric_value=Decimal(str(metric_value))
            )
            metrics_created += 1

        return metrics_created
