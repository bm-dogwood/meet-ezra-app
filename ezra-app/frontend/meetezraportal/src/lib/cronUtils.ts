/**
 * Cron expression builder and human-readable formatter for the frequency builder UI.
 *
 * Frequency types map to cron patterns:
 *   daily:         {minute} {hour} * * *
 *   weekdays:      {minute} {hour} * * 1-5
 *   specific_days: {minute} {hour} * * {comma-separated day numbers}
 *   monthly:       {minute} {hour} {day_of_month} * *
 */

export type FrequencyType = 'daily' | 'weekdays' | 'specific_days' | 'monthly';

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;

/**
 * Assemble a 5-field cron expression from UI selections.
 *
 * @param frequency     - One of the preset frequency types
 * @param selectedDays  - Day-of-week numbers (0=Sun … 6=Sat), used when frequency is 'specific_days'
 * @param dayOfMonth    - Day of the month (1-28), used when frequency is 'monthly'
 * @param hour          - Hour in 24-hour format (0-23)
 * @param minute        - Minute (0, 15, 30, or 45)
 */
export function buildCronExpression(
  frequency: FrequencyType,
  selectedDays: number[],
  dayOfMonth: number,
  hour: number,
  minute: number,
): string {
  switch (frequency) {
    case 'daily':
      return `${minute} ${hour} * * *`;

    case 'weekdays':
      return `${minute} ${hour} * * 1-5`;

    case 'specific_days': {
      const sorted = [...selectedDays].sort((a, b) => a - b);
      const days = sorted.length > 0 ? sorted.join(',') : '*';
      return `${minute} ${hour} * * ${days}`;
    }

    case 'monthly':
      return `${minute} ${hour} ${dayOfMonth} * *`;

    default:
      return `${minute} ${hour} * * *`;
  }
}

/**
 * Convert a cron expression + timezone into a plain-English description.
 *
 * Examples:
 *   "Every day at 8:00 AM CST"
 *   "Every weekday at 8:00 AM EST"
 *   "Every Mon, Wed at 9:30 AM PST"
 *   "On the 1st of every month at 7:00 AM UTC"
 */
export function cronToHumanReadable(cronExpression: string, timezone: string): string {
  const parts = cronExpression.trim().split(/\s+/);
  if (parts.length !== 5) {
    return cronExpression;
  }

  const [minuteField, hourField, domField, , dowField] = parts;

  const minute = parseInt(minuteField, 10);
  const hour = parseInt(hourField, 10);

  // If hour or minute aren't simple numbers, fall back to raw expression
  if (isNaN(hour) || isNaN(minute)) {
    return cronExpression;
  }

  const timeStr = formatTime(hour, minute);
  const tzAbbr = getTimezoneAbbreviation(timezone);

  // Monthly: specific day-of-month
  if (domField !== '*') {
    const dom = parseInt(domField, 10);
    if (!isNaN(dom)) {
      return `On the ${ordinal(dom)} of every month at ${timeStr} ${tzAbbr}`;
    }
  }

  // Day-of-week patterns
  if (dowField === '*') {
    return `Every day at ${timeStr} ${tzAbbr}`;
  }

  if (dowField === '1-5') {
    return `Every weekday at ${timeStr} ${tzAbbr}`;
  }

  // Comma-separated days
  const dayNumbers = dowField.split(',').map((d) => parseInt(d, 10));
  if (dayNumbers.every((d) => !isNaN(d) && d >= 0 && d <= 6)) {
    const dayLabels = dayNumbers.map((d) => DAY_NAMES[d]);
    return `Every ${dayLabels.join(', ')} at ${timeStr} ${tzAbbr}`;
  }

  return cronExpression;
}

/** Format hour (0-23) and minute into "H:MM AM/PM". */
function formatTime(hour: number, minute: number): string {
  const period = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  const displayMinute = minute.toString().padStart(2, '0');
  return `${displayHour}:${displayMinute} ${period}`;
}

/** Get a short timezone abbreviation from an IANA timezone string. */
function getTimezoneAbbreviation(timezone: string): string {
  try {
    // Use Intl to derive the short abbreviation (e.g. "CST", "EST")
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      timeZoneName: 'short',
    });
    const parts = formatter.formatToParts(new Date());
    const tzPart = parts.find((p) => p.type === 'timeZoneName');
    return tzPart?.value ?? timezone;
  } catch {
    return timezone;
  }
}

/** Return ordinal suffix for a day number (1st, 2nd, 3rd, 4th …). */
function ordinal(n: number): string {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}
