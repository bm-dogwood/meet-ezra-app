"""
Ezra Exponential - Twilio SMS Service

Sends SMS messages via Twilio for customer follow-up campaigns.
Handles status callbacks for delivery tracking.
Configuration is read from AppConfig table with key 'twilio_config'.

STATUS CALLBACK FLOW:
  1. When sending an SMS, we attach a status_callback URL so Twilio knows
     where to POST delivery updates (queued → sent → delivered/failed).
  2. Set `base_url` in AppConfig → twilio_config:
       {"base_url": "https://api.meetezra.bot", ...}
     The callback path (/api/exponential/twilio/status-callback/) is
     appended automatically. That's it — one field to set.
  3. Dev: use your ngrok/tunnel URL as base_url.
     Prod: use https://api.meetezra.bot as base_url.
  4. Every callback received is logged to TwilioCallbackLog for audit.
"""
import logging

from django.conf import settings
from django.utils import timezone

from api.models import AppConfig, ExponentialSMSLog
from api.constants import DEFAULT_TWILIO_CONFIG

logger = logging.getLogger(__name__)

# Path to the status callback endpoint (must match urls.py)
STATUS_CALLBACK_PATH = '/api/exponential/twilio/status-callback/'
INBOUND_SMS_PATH = '/api/exponential/twilio/inbound/'


def get_twilio_config():
    """Retrieve Twilio configuration from AppConfig, with env var fallback."""
    config = AppConfig.get_config_value('twilio_config', DEFAULT_TWILIO_CONFIG)

    if not config.get('account_sid'):
        config['account_sid'] = getattr(settings, 'TWILIO_ACCOUNT_SID', '')
    if not config.get('auth_token'):
        config['auth_token'] = getattr(settings, 'TWILIO_AUTH_TOKEN', '')
    if not config.get('from_number'):
        config['from_number'] = getattr(settings, 'TWILIO_FROM_NUMBER', '')
    if not config.get('messaging_service_sid'):
        config['messaging_service_sid'] = getattr(settings, 'TWILIO_MESSAGING_SERVICE_SID', '')
    if not config.get('enabled') and config.get('account_sid') and config.get('auth_token'):
        config['enabled'] = True

    return config


def get_status_callback_url():
    """
    Resolve the status callback URL for Twilio.

    Set via AppConfig → twilio_config → base_url
    Example: {"base_url": "https://api.meetezra.bot", ...}

    The callback path is appended automatically.
    """
    config = get_twilio_config()
    base_url = config.get('base_url', '')
    if base_url:
        return base_url.rstrip('/') + STATUS_CALLBACK_PATH
    return ''


def get_inbound_sms_url():
    """Resolve the inbound SMS webhook URL for Twilio."""
    config = get_twilio_config()
    base_url = config.get('base_url', '')
    if base_url:
        return base_url.rstrip('/') + INBOUND_SMS_PATH
    return ''


def get_twilio_client():
    """Create and return a Twilio REST client. Returns None if not configured."""
    config = get_twilio_config()

    if not config.get('enabled', False):
        logger.info("Twilio SMS is disabled in AppConfig")
        return None

    account_sid = config.get('account_sid', '')
    auth_token = config.get('auth_token', '')

    if not account_sid or not auth_token:
        logger.warning("Twilio account_sid or auth_token not configured")
        return None

    try:
        from twilio.rest import Client
        return Client(account_sid, auth_token)
    except ImportError:
        logger.error("twilio package not installed. Run: pip install twilio")
        return None
    except Exception as e:
        logger.error(f"Failed to create Twilio client: {e}")
        return None


def send_sms(to_number, message_body, campaign_id=None):
    """
    Send a single SMS message via Twilio.

    Automatically attaches the status callback URL so Twilio reports
    delivery status back to our webhook endpoint.

    Returns dict with keys: success, message_sid, status, error
    """
    config = get_twilio_config()
    client = get_twilio_client()

    if client is None:
        return {
            'success': False,
            'message_sid': None,
            'status': 'failed',
            'error': 'Twilio not configured or disabled',
        }

    from_number = config.get('from_number', '')
    messaging_service_sid = config.get('messaging_service_sid', '')

    if not from_number and not messaging_service_sid:
        return {
            'success': False,
            'message_sid': None,
            'status': 'failed',
            'error': 'No from_number or messaging_service_sid configured',
        }

    try:
        kwargs = {
            'body': message_body,
            'to': to_number,
        }

        if messaging_service_sid:
            kwargs['messaging_service_sid'] = messaging_service_sid
        else:
            kwargs['from_'] = from_number

        # Always attach callback URL so we get delivery tracking
        callback_url = get_status_callback_url()
        if callback_url:
            kwargs['status_callback'] = callback_url

        message = client.messages.create(**kwargs)

        logger.info(
            f"SMS sent: sid={message.sid}, to={to_number}, "
            f"campaign={campaign_id}, status={message.status}, "
            f"callback={'yes' if callback_url else 'no'}"
        )

        return {
            'success': True,
            'message_sid': message.sid,
            'status': message.status,  # 'queued', 'sent', etc.
            'error': None,
        }

    except Exception as e:
        logger.error(f"Failed to send SMS to {to_number}: {e}")
        return {
            'success': False,
            'message_sid': None,
            'status': 'failed',
            'error': str(e),
        }


def _resolve_to_number(original_number):
    """
    If twilio_config.test_phone is set, redirect ALL campaign SMS to that number.
    This allows testing full campaign flows without messaging real customers.
    Also covers customers with no phone — test_phone is used as fallback.
    """
    config = get_twilio_config()
    test_phone = (config.get('test_phone') or '').strip()
    if test_phone:
        if original_number:
            logger.info(f"test_phone override: {original_number} → {test_phone}")
        else:
            logger.info(f"test_phone fallback (customer has no phone): → {test_phone}")
        return test_phone
    return original_number or ''


def send_campaign_sms(customer, campaign, template_body, coupon_value, store_name):
    """
    Send a campaign SMS to a customer with template variable substitution.

    Supported placeholders:
      {first_name}, {guest_name}, {location_name}, {store_name},
      {coupon_value}, {coupon_code}, {booking_link}
    """
    to_number = _resolve_to_number(customer.phone)

    if not to_number:
        return {
            'success': False, 'message_sid': None,
            'error': 'Customer has no phone number and no test_phone configured',
            'message_body': '', 'status': 'failed',
        }

    if not customer.sms_opt_in:
        return {
            'success': False, 'message_sid': None,
            'error': 'Customer has not opted in to SMS',
            'message_body': '', 'status': 'failed',
        }

    # Build substitution context
    first_name = (customer.guest_name or '').split()[0] if customer.guest_name else ''
    coupon_str = f"{coupon_value:.0f}" if coupon_value == int(coupon_value) else f"{coupon_value:.2f}"

    # Use display_name if set, otherwise fall back to store name
    store = customer.store
    friendly_store_name = (store.display_name if store and store.display_name else store_name) if store else store_name
    store_address = (store.address if store and store.address else '') if store else ''
    store_booking_link = (store.booking_link if store and store.booking_link else '') if store else ''

    subs = {
        'first_name': first_name,
        'guest_name': customer.guest_name or first_name,
        'location_name': friendly_store_name,
        'store_name': friendly_store_name,
        'store_address': store_address,
        'coupon_value': coupon_str,
        'coupon_code': campaign.coupon_code or '',
        'booking_link': campaign.booking_link or store_booking_link,
    }

    # Merge any user-supplied template variables (custom vars override defaults)
    if hasattr(campaign, 'template_variables') and campaign.template_variables:
        subs.update(campaign.template_variables)

    try:
        message_body = template_body.format(**subs)
    except (KeyError, IndexError) as e:
        logger.warning(f"Template substitution failed: {e}")
        message_body = template_body  # send raw if substitution fails

    result = send_sms(
        to_number=to_number,
        message_body=message_body,
        campaign_id=campaign.id,
    )

    result['message_body'] = message_body
    return result


# ------------------------------------------------------------------
# Twilio Status Callback Handler
# ------------------------------------------------------------------

# Twilio status progression
TWILIO_TERMINAL_STATUSES = {'delivered', 'undelivered', 'failed', 'canceled'}
TWILIO_STATUS_MAP = {
    'queued': 'queued',
    'accepted': 'queued',
    'sending': 'sent',
    'sent': 'sent',
    'delivered': 'delivered',
    'undelivered': 'undelivered',
    'failed': 'failed',
    'canceled': 'failed',
}


def handle_status_callback(data):
    """
    Process a Twilio status callback webhook POST.
    Logs every callback to TwilioCallbackLog for audit, then updates SMS log.

    Expected data keys (from Twilio):
      MessageSid, MessageStatus, To, From, ErrorCode, ErrorMessage
    """
    from api.models import TwilioCallbackLog

    message_sid = data.get('MessageSid', '')
    message_status = data.get('MessageStatus', '')
    error_code = data.get('ErrorCode', '')
    error_message = data.get('ErrorMessage', '')
    to_number = data.get('To', '')
    from_number = data.get('From', '')

    # Find linked SMS log (may be None if SID not found)
    sms_log = None
    tenant = None
    if message_sid:
        sms_log = ExponentialSMSLog.objects.select_related('campaign__tenant').filter(
            twilio_message_sid=message_sid
        ).first()
        if sms_log and sms_log.campaign:
            tenant = sms_log.campaign.tenant

    # Always log the callback for audit
    TwilioCallbackLog.objects.create(
        tenant=tenant,
        message_sid=message_sid,
        message_status=message_status,
        to_number=to_number,
        from_number=from_number,
        error_code=str(error_code) if error_code else '',
        error_message=error_message or '',
        raw_payload=data,
        sms_log=sms_log,
    )

    if not message_sid:
        logger.warning("Status callback missing MessageSid")
        return {'error': 'Missing MessageSid'}

    mapped_status = TWILIO_STATUS_MAP.get(message_status, message_status)

    if not sms_log:
        logger.warning(f"SMS log not found for SID: {message_sid}")
        return {'error': 'SMS log not found', 'logged': True}

    # Only update if the new status is a progression (don't go backwards)
    status_order = {'queued': 0, 'sent': 1, 'delivered': 2, 'undelivered': 2, 'failed': 2}
    current_order = status_order.get(sms_log.status, 0)
    new_order = status_order.get(mapped_status, 0)

    if new_order < current_order:
        logger.debug(f"Ignoring status regression: {sms_log.status} -> {mapped_status}")
        return {'status': 'ignored', 'reason': 'status regression'}

    update_fields = ['status']
    sms_log.status = mapped_status

    if mapped_status == 'delivered':
        sms_log.delivered_at = timezone.now()
        update_fields.append('delivered_at')

    if error_code:
        sms_log.twilio_error_code = str(error_code)
        update_fields.append('twilio_error_code')

    if error_message:
        sms_log.error_message = error_message
        update_fields.append('error_message')

    sms_log.save(update_fields=update_fields)

    # Update campaign aggregate counters if terminal status
    if mapped_status in TWILIO_TERMINAL_STATUSES:
        _update_campaign_counters(sms_log.campaign_id)

    logger.info(f"SMS {message_sid} status updated: {mapped_status}")
    return {'status': 'updated', 'new_status': mapped_status}


def _update_campaign_counters(campaign_id):
    """Recompute campaign delivery counters from SMS logs."""
    from django.db.models import Count, Q
    from api.models import ExponentialCampaign

    try:
        campaign = ExponentialCampaign.objects.get(id=campaign_id)
    except ExponentialCampaign.DoesNotExist:
        return

    stats = ExponentialSMSLog.objects.filter(campaign=campaign).aggregate(
        total=Count('id'),
        delivered=Count('id', filter=Q(status='delivered')),
        failed=Count('id', filter=Q(status__in=['failed', 'undelivered'])),
    )

    campaign.messages_sent = stats['total']
    campaign.messages_delivered = stats['delivered']
    campaign.messages_failed = stats['failed']
    campaign.save(update_fields=['messages_sent', 'messages_delivered', 'messages_failed'])


def sync_campaign_statuses(campaign_id, tenant=None):
    """
    Fetch current status of all SMS messages for a campaign from Twilio
    and update our DB records. Useful when callbacks fail or are missed.

    Returns summary dict with counts of updated/unchanged/errors.
    """
    from api.models import ExponentialCampaign
    from decimal import Decimal

    qs = ExponentialSMSLog.objects.filter(campaign_id=campaign_id).exclude(
        twilio_message_sid__isnull=True
    ).exclude(twilio_message_sid='')
    if tenant:
        qs = qs.filter(campaign__tenant=tenant)

    client = get_twilio_client()
    if not client:
        return {'error': 'Twilio client not configured'}

    updated = 0
    unchanged = 0
    errors = 0
    details = []

    for log in qs:
        try:
            msg = client.messages(log.twilio_message_sid).fetch()
            twilio_status = msg.status  # queued, sent, delivered, undelivered, failed, etc.
            mapped = TWILIO_STATUS_MAP.get(twilio_status, twilio_status)
            old_status = log.status

            changed = False
            update_fields = []

            if log.status != mapped:
                log.status = mapped
                update_fields.append('status')
                changed = True

            if mapped == 'delivered' and not log.delivered_at and msg.date_sent:
                log.delivered_at = msg.date_sent
                update_fields.append('delivered_at')
                changed = True

            if msg.error_code and not log.twilio_error_code:
                log.twilio_error_code = str(msg.error_code)
                update_fields.append('twilio_error_code')
                changed = True

            if msg.error_message and not log.error_message:
                log.error_message = msg.error_message
                update_fields.append('error_message')
                changed = True

            if msg.price is not None and not log.price:
                log.price = Decimal(str(msg.price))
                update_fields.append('price')
                changed = True

            if changed:
                log.save(update_fields=update_fields)
                updated += 1
                details.append({
                    'sid': log.twilio_message_sid,
                    'old_status': old_status,
                    'new_status': mapped,
                    'action': 'updated',
                })
            else:
                unchanged += 1

        except Exception as e:
            errors += 1
            logger.error(f"Failed to sync status for {log.twilio_message_sid}: {e}")
            details.append({
                'sid': log.twilio_message_sid,
                'action': 'error',
                'error': str(e),
            })

    # Recompute campaign counters after sync
    _update_campaign_counters(campaign_id)

    return {
        'total': updated + unchanged + errors,
        'updated': updated,
        'unchanged': unchanged,
        'errors': errors,
        'details': details,
    }


def validate_twilio_signature(url, params, signature):
    """Validate that a webhook request actually came from Twilio."""
    config = get_twilio_config()
    auth_token = config.get('auth_token', '')
    if not auth_token:
        return False

    try:
        from twilio.request_validator import RequestValidator
        validator = RequestValidator(auth_token)
        return validator.validate(url, params, signature)
    except ImportError:
        logger.error("twilio package not installed for signature validation")
        return False
    except Exception as e:
        logger.error(f"Twilio signature validation error: {e}")
        return False


# ------------------------------------------------------------------
# Twilio Message Status Lookup
# ------------------------------------------------------------------

def fetch_message_status(message_sid):
    """
    Fetch the current status of a message from Twilio API.
    Useful for manual status checks / reconciliation.
    """
    client = get_twilio_client()
    if not client:
        return None

    try:
        message = client.messages(message_sid).fetch()
        return {
            'sid': message.sid,
            'status': message.status,
            'error_code': message.error_code,
            'error_message': message.error_message,
            'date_sent': message.date_sent.isoformat() if message.date_sent else None,
            'date_updated': message.date_updated.isoformat() if message.date_updated else None,
            'price': str(message.price) if message.price else None,
            'price_unit': message.price_unit,
        }
    except Exception as e:
        logger.error(f"Failed to fetch message {message_sid}: {e}")
        return None


def validate_twilio_config():
    """Validate that Twilio is properly configured and can connect."""
    config = get_twilio_config()

    issues = []
    if not config.get('enabled'):
        issues.append('Twilio is disabled')
    if not config.get('account_sid'):
        issues.append('account_sid is missing')
    if not config.get('auth_token'):
        issues.append('auth_token is missing')
    if not config.get('from_number') and not config.get('messaging_service_sid'):
        issues.append('Neither from_number nor messaging_service_sid is configured')

    if issues:
        return {'valid': False, 'issues': issues}

    client = get_twilio_client()
    if client is None:
        return {'valid': False, 'issues': ['Failed to create Twilio client']}

    try:
        account = client.api.accounts(config['account_sid']).fetch()
        callback_url = get_status_callback_url()
        return {
            'valid': True,
            'issues': [],
            'account_name': account.friendly_name,
            'account_status': account.status,
            'status_callback_url': callback_url or '(not configured — set base_url in twilio_config via AppConfig API)',
        }
    except Exception as e:
        return {'valid': False, 'issues': [f'Connection test failed: {str(e)}']}


# ------------------------------------------------------------------
# Inbound SMS (opt-out / opt-in handling)
# ------------------------------------------------------------------

# Twilio Advanced Opt-Out keywords (case-insensitive)
OPT_OUT_KEYWORDS = {'stop', 'stopall', 'unsubscribe', 'cancel', 'end', 'quit'}
OPT_IN_KEYWORDS = {'start', 'unstop', 'subscribe', 'yes'}


def handle_inbound_sms(data):
    """
    Process an inbound SMS webhook from Twilio.
    Updates sms_opt_in on matching ExponentialCustomer records.

    Twilio POST params include: From, To, Body, MessageSid, etc.
    """
    from api.models import ExponentialCustomer

    from_number = data.get('From', '').strip()
    body = (data.get('Body', '') or '').strip().lower()
    message_sid = data.get('MessageSid', '')

    if not from_number:
        logger.warning("Inbound SMS missing From number")
        return {'error': 'Missing From number'}

    # Normalize phone: strip leading + and any non-digit chars
    normalized = ''.join(c for c in from_number if c.isdigit())

    # Match customers by phone (may match multiple across tenants)
    customers = ExponentialCustomer.objects.filter(phone=normalized)
    if not customers.exists():
        # Try with + prefix stripped variants
        customers = ExponentialCustomer.objects.filter(phone__endswith=normalized[-10:])

    if not customers.exists():
        logger.info("Inbound SMS from %s — no matching customer found", from_number)
        return {'status': 'no_match', 'phone': from_number}

    if body in OPT_OUT_KEYWORDS:
        count = customers.update(sms_opt_in=False)
        logger.info("Opt-out: %s customers updated for phone %s (body=%s)", count, from_number, body)
        return {'status': 'opted_out', 'phone': from_number, 'customers_updated': count}

    if body in OPT_IN_KEYWORDS:
        count = customers.update(sms_opt_in=True)
        logger.info("Opt-in: %s customers updated for phone %s (body=%s)", count, from_number, body)
        return {'status': 'opted_in', 'phone': from_number, 'customers_updated': count}

    logger.info("Inbound SMS from %s: '%s' (not an opt keyword, ignoring)", from_number, body[:50])
    return {'status': 'ignored', 'phone': from_number, 'body': body[:50]}
