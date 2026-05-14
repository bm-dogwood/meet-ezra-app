"""
Seed the 8 preset SMS templates per the spec (Section 3.2).

Usage:
  python manage.py seed_sms_templates
  python manage.py seed_sms_templates --tenant-id 1
"""
from django.core.management.base import BaseCommand
from api.models import SMSTemplate, Tenant


PRESET_TEMPLATES = [
    {
        'template_id': '4wk_gentle_reminder',
        'name': '4-Week Gentle Reminder',
        'bucket': '4wk',
        'body': (
            "Hi {guest_name}, it's been a little while! "
            "We'd love to see you back at {store_name}. "
            "Enjoy ${coupon_value} off your next visit. "
            "Book now: {booking_link}"
        ),
    },
    {
        'template_id': '4wk_loyalty_thankyou',
        'name': '4-Week Loyalty Thank You',
        'bucket': '4wk',
        'body': (
            "Thanks for being a loyal guest, {guest_name}! "
            "Here's ${coupon_value} off your next visit at {store_name} "
            "as a thank you. See you soon!"
        ),
    },
    {
        'template_id': '6wk_winback_offer',
        'name': '6-Week Win-Back Offer',
        'bucket': '6wk',
        'body': (
            "{guest_name}, we miss you at {store_name}! "
            "Come back and save ${coupon_value} on your next service. "
            "This offer won't last long — book today: {booking_link}"
        ),
    },
    {
        'template_id': '6wk_exclusive_deal',
        'name': '6-Week Exclusive Deal',
        'bucket': '6wk',
        'body': (
            "Exclusive for you, {guest_name}! "
            "Get ${coupon_value} off at {store_name}. "
            "We've saved your favorite spot. "
            "Book now: {booking_link}"
        ),
    },
    {
        'template_id': '8wk_urgent_reengagement',
        'name': '8-Week Urgent Re-engagement',
        'bucket': '8wk',
        'body': (
            "{guest_name}, it's been too long! "
            "We have a special ${coupon_value} offer just for you at {store_name}. "
            "Don't miss out — book your visit: {booking_link}"
        ),
    },
    {
        'template_id': '8wk_vip_recovery',
        'name': '8-Week VIP Recovery',
        'bucket': '8wk',
        'body': (
            "{guest_name}, as a valued guest, we're offering you "
            "${coupon_value} off your next visit at {store_name}. "
            "We'd love to welcome you back! "
            "Book now: {booking_link}"
        ),
    },
    {
        'template_id': 'general_promotion',
        'name': 'General Promotion',
        'bucket': '4wk',  # general — use 4wk as default bucket
        'body': (
            "Hey {guest_name}! {store_name} has a special offer for you: "
            "${coupon_value} off any service. "
            "Book your appointment today: {booking_link}"
        ),
    },
    {
        'template_id': 'seasonal_special',
        'name': 'Seasonal Special',
        'bucket': '4wk',  # general — use 4wk as default bucket
        'body': (
            "{guest_name}, celebrate the season with ${coupon_value} off "
            "at {store_name}! Limited time only. "
            "Book now: {booking_link}"
        ),
    },
]


class Command(BaseCommand):
    help = 'Seed the 8 preset SMS templates for Exponential campaigns'

    def add_arguments(self, parser):
        parser.add_argument('--tenant-id', type=int, help='Specific tenant ID (default: all tenants)')

    def handle(self, *args, **options):
        tenant_id = options.get('tenant_id')
        tenants = Tenant.objects.filter(id=tenant_id) if tenant_id else Tenant.objects.all()

        for tenant in tenants:
            created = 0
            for tpl in PRESET_TEMPLATES:
                _, was_created = SMSTemplate.objects.get_or_create(
                    tenant=tenant,
                    template_id=tpl['template_id'],
                    defaults={
                        'name': tpl['name'],
                        'bucket': tpl['bucket'],
                        'body': tpl['body'],
                        'is_active': True,
                    },
                )
                if was_created:
                    created += 1
            self.stdout.write(
                self.style.SUCCESS(f"Tenant '{tenant.name}': {created} templates created, "
                                   f"{len(PRESET_TEMPLATES) - created} already existed")
            )
