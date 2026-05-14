"""Cron expression utilities for report scheduling.

Provides validation, timezone conversion, human-readable formatting,
and cron expression assembly from UI frequency selections.
"""

import re
from datetime import datetime, timedelta
from zoneinfo import ZoneInfo, ZoneInfoNotFoundError


# Valid ranges for each cron field (min, max)
CRON_FIELD_RANGES = {
    'minute': (0, 59),
    'hour': (0, 23),
    'day_of_month': (1, 31),
    'month': (1, 12),
    'day_of_week': (0, 7),  # 0 and 7 are both Sunday
}

FIELD_NAMES = ['minute', 'hour', 'day_of_month', 'month', 'day_of_week']

# Pattern for a single cron token: *, number, range, step, or list
_CRON_TOKEN_RE = re.compile(
    r'^(\*|(\d+(-\d+)?))(/\d+)?$'
)

DAY_NAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
DAY_ABBREVS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']


def _validate_field(field: str, field_name: str) -> bool:
    """Validate a single cron field against its allowed range."""
    min_val, max_val = CRON_FIELD_RANGES[field_name]

    # A field can be a comma-separated list of tokens
    parts = field.split(',')
    if not parts or any(p == '' for p in parts):
        return False

    for part in parts:
        match = _CRON_TOKEN_RE.match(part)
        if not match:
            return False

        base = match.group(1)
        step = match.group(4)  # e.g. /15

        if base != '*':
            if '-' in base:
                range_parts = base.split('-')
                try:
                    lo, hi = int(range_parts[0]), int(range_parts[1])
                except ValueError:
                    return False
                if lo < min_val or hi > max_val or lo > hi:
                    return False
            else:
                try:
                    val = int(base)
                except ValueError:
                    return False
                if val < min_val or val > max_val:
                    return False

        if step:
            try:
                step_val = int(step[1:])  # strip leading /
            except ValueError:
                return False
            if step_val < 1:
                return False

    return True


def validate_cron_expression(expr: str) -> bool:
    """Validate a 5-field cron expression.

    Each field can contain numbers, ranges (1-5), steps (*/15),
    lists (1,3,5), or wildcards (*).

    Fields: minute hour day-of-month month day-of-week

    Returns True if valid, False otherwise.
    """
    if not isinstance(expr, str):
        return False

    expr = expr.strip()
    fields = expr.split()
    if len(fields) != 5:
        return False

    for field, field_name in zip(fields, FIELD_NAMES):
        if not _validate_field(field, field_name):
            return False

    return True


def local_cron_to_utc(cron_expression: str, timezone: str) -> str:
    """Convert a cron expression from local timezone to UTC.

    For simple cases (fixed hour/minute), shifts the hour by the UTC offset.
    For complex cases (e.g., */2 in hour field, ranges, lists), returns the
    expression as-is and relies on K8s spec.timeZone field.

    Args:
        cron_expression: A valid 5-field cron expression.
        timezone: An IANA timezone string (e.g., 'America/Chicago').

    Returns:
        The cron expression adjusted to UTC, or the original expression
        if conversion is not straightforward.
    """
    if timezone == 'UTC':
        return cron_expression

    fields = cron_expression.strip().split()
    if len(fields) != 5:
        return cron_expression

    minute_field, hour_field = fields[0], fields[1]

    # Only convert simple fixed hour/minute (no wildcards, ranges, steps, lists)
    if not minute_field.isdigit() or not hour_field.isdigit():
        return cron_expression

    try:
        tz = ZoneInfo(timezone)
    except (ZoneInfoNotFoundError, KeyError):
        return cron_expression

    local_hour = int(hour_field)
    local_minute = int(minute_field)

    # Use a reference date to compute the UTC offset
    ref_date = datetime(2024, 1, 15, local_hour, local_minute, tzinfo=tz)
    utc_offset = ref_date.utcoffset()
    if utc_offset is None:
        return cron_expression

    utc_time = ref_date - utc_offset
    utc_hour = utc_time.hour
    utc_minute = utc_time.minute

    fields[0] = str(utc_minute)
    fields[1] = str(utc_hour)
    return ' '.join(fields)


def cron_to_human_readable(cron_expression: str, timezone: str) -> str:
    """Convert a cron expression to a human-readable string.

    Examples:
        '0 8 * * *', 'America/Chicago' -> 'Every day at 8:00 AM CST'
        '0 8 * * 1-5', 'America/New_York' -> 'Every weekday at 8:00 AM EST'
        '30 9 * * 1,3', 'US/Pacific' -> 'Every Mon, Wed at 9:30 AM PST'
        '0 7 15 * *', 'UTC' -> 'On day 15 of every month at 7:00 AM UTC'

    Args:
        cron_expression: A valid 5-field cron expression.
        timezone: An IANA timezone string.

    Returns:
        A human-readable description of the schedule.
    """
    fields = cron_expression.strip().split()
    if len(fields) != 5:
        return cron_expression

    minute_f, hour_f, dom_f, month_f, dow_f = fields

    # Format time portion
    time_str = _format_time(hour_f, minute_f)

    # Format timezone abbreviation
    tz_abbrev = _get_tz_abbreviation(timezone)

    # Determine frequency description
    freq_str = _describe_frequency(dom_f, dow_f)

    if time_str:
        return f"{freq_str} at {time_str} {tz_abbrev}".strip()
    return f"{freq_str} {tz_abbrev}".strip()


def _format_time(hour_field: str, minute_field: str) -> str:
    """Format hour and minute fields into a human-readable time string."""
    if not hour_field.isdigit() or not minute_field.isdigit():
        return ''

    hour = int(hour_field)
    minute = int(minute_field)

    if hour == 0:
        display_hour = 12
        ampm = 'AM'
    elif hour < 12:
        display_hour = hour
        ampm = 'AM'
    elif hour == 12:
        display_hour = 12
        ampm = 'PM'
    else:
        display_hour = hour - 12
        ampm = 'PM'

    return f"{display_hour}:{minute:02d} {ampm}"


def _get_tz_abbreviation(timezone: str) -> str:
    """Get a timezone abbreviation for display."""
    if timezone == 'UTC':
        return 'UTC'
    try:
        tz = ZoneInfo(timezone)
        ref = datetime(2024, 1, 15, 12, 0, tzinfo=tz)
        return ref.strftime('%Z') or timezone
    except (ZoneInfoNotFoundError, KeyError):
        return timezone


def _describe_frequency(dom_field: str, dow_field: str) -> str:
    """Describe the frequency portion of a cron expression."""
    # Monthly: specific day of month
    if dom_field != '*' and dow_field == '*':
        if dom_field.isdigit():
            day = int(dom_field)
            suffix = _ordinal_suffix(day)
            return f"On the {day}{suffix} of every month"
        return f"On day {dom_field} of every month"

    # Day-of-week patterns
    if dom_field == '*' and dow_field != '*':
        if dow_field == '1-5':
            return 'Every weekday'
        if dow_field == '0-6' or dow_field == '*':
            return 'Every day'

        # Parse specific days
        day_nums = _parse_dow_field(dow_field)
        if day_nums is not None:
            day_names = [_dow_to_name(d) for d in day_nums]
            return f"Every {', '.join(day_names)}"

        return f"On days {dow_field}"

    # Default: every day
    return 'Every day'


def _parse_dow_field(dow_field: str) -> list | None:
    """Parse a day-of-week field into a list of day numbers."""
    try:
        parts = dow_field.split(',')
        days = []
        for part in parts:
            if '-' in part:
                lo, hi = part.split('-')
                days.extend(range(int(lo), int(hi) + 1))
            else:
                days.append(int(part))
        return days
    except (ValueError, TypeError):
        return None


def _dow_to_name(day_num: int) -> str:
    """Convert a cron day-of-week number to abbreviated name.

    0 and 7 = Sunday, 1 = Monday, ..., 6 = Saturday.
    """
    # Map: 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat, 7=Sun
    names = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    if 0 <= day_num <= 7:
        return names[day_num]
    return str(day_num)


def _ordinal_suffix(n: int) -> str:
    """Return the ordinal suffix for a number (st, nd, rd, th)."""
    if 11 <= (n % 100) <= 13:
        return 'th'
    return {1: 'st', 2: 'nd', 3: 'rd'}.get(n % 10, 'th')


def build_cron_expression(
    frequency: str,
    days: list | None = None,
    day_of_month: int | None = None,
    hour: int = 0,
    minute: int = 0,
) -> str:
    """Assemble a 5-field cron expression from UI frequency selections.

    Args:
        frequency: One of 'daily', 'weekdays', 'specific_days', 'monthly'.
        days: List of day-of-week numbers (0-7) for 'specific_days' frequency.
        day_of_month: Day of month (1-31) for 'monthly' frequency.
        hour: Hour (0-23).
        minute: Minute (0-59).

    Returns:
        A valid 5-field cron expression string.

    Raises:
        ValueError: If frequency is invalid or required parameters are missing.
    """
    if frequency == 'daily':
        return f"{minute} {hour} * * *"

    if frequency == 'weekdays':
        return f"{minute} {hour} * * 1-5"

    if frequency == 'specific_days':
        if not days:
            raise ValueError("'days' is required for 'specific_days' frequency.")
        day_str = ','.join(str(d) for d in sorted(set(days)))
        return f"{minute} {hour} * * {day_str}"

    if frequency == 'monthly':
        if day_of_month is None:
            raise ValueError("'day_of_month' is required for 'monthly' frequency.")
        return f"{minute} {hour} {day_of_month} * *"

    raise ValueError(f"Invalid frequency: {frequency}")
