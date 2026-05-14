// ===========================================
// EZRA PORTAL - Formatting Utilities
// ===========================================

import { format, formatDistanceToNow, parseISO, isValid } from 'date-fns';

// ============ Currency Formatting ============

/**
 * Formats a number as USD currency
 */
export function formatCurrency(
  value: number,
  options: {
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
    compact?: boolean;
  } = {}
): string {
  const { minimumFractionDigits = 0, maximumFractionDigits = 0, compact = false } = options;

  if (compact && Math.abs(value) >= 1000) {
    return formatCompactNumber(value, { style: 'currency' });
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(value);
}

/**
 * Formats currency with decimals for precise values
 */
export function formatCurrencyPrecise(value: number): string {
  return formatCurrency(value, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// ============ Number Formatting ============

/**
 * Formats a number with thousands separators
 */
export function formatNumber(
  value: number,
  options: {
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
  } = {}
): string {
  const { minimumFractionDigits = 0, maximumFractionDigits = 0 } = options;

  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(value);
}

/**
 * Formats large numbers in compact notation (e.g., 1.2K, 3.4M)
 */
export function formatCompactNumber(
  value: number,
  options: { style?: 'decimal' | 'currency' } = {}
): string {
  const { style = 'decimal' } = options;

  const absValue = Math.abs(value);
  const sign = value < 0 ? '-' : '';

  if (absValue >= 1_000_000_000) {
    const formatted = (absValue / 1_000_000_000).toFixed(1);
    return style === 'currency'
      ? `${sign}$${formatted}B`
      : `${sign}${formatted}B`;
  }

  if (absValue >= 1_000_000) {
    const formatted = (absValue / 1_000_000).toFixed(1);
    return style === 'currency'
      ? `${sign}$${formatted}M`
      : `${sign}${formatted}M`;
  }

  if (absValue >= 1_000) {
    const formatted = (absValue / 1_000).toFixed(1);
    return style === 'currency'
      ? `${sign}$${formatted}K`
      : `${sign}${formatted}K`;
  }

  return style === 'currency' ? `${sign}$${absValue}` : `${sign}${absValue}`;
}

// ============ Percentage Formatting ============

/**
 * Formats a decimal as a percentage
 */
export function formatPercent(
  value: number,
  options: {
    alreadyPercent?: boolean;
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
    showSign?: boolean;
  } = {}
): string {
  const {
    alreadyPercent = false,
    minimumFractionDigits = 1,
    maximumFractionDigits = 1,
    showSign = false,
  } = options;

  const percentValue = alreadyPercent ? value : value * 100;
  const sign = showSign && percentValue > 0 ? '+' : '';

  return `${sign}${new Intl.NumberFormat('en-US', {
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(percentValue)}%`;
}

/**
 * Formats a percent change with color indicator
 */
export function formatPercentChange(value: number): {
  formatted: string;
  trend: 'up' | 'down' | 'neutral';
} {
  const formatted = formatPercent(value, { alreadyPercent: true, showSign: true });
  const trend = value > 0 ? 'up' : value < 0 ? 'down' : 'neutral';
  return { formatted, trend };
}

// ============ Date Formatting ============

/**
 * Formats a date string to a readable format
 */
export function formatDate(
  dateString: string,
  formatStr: string = 'MMM d, yyyy'
): string {
  try {
    const date = parseISO(dateString);
    if (!isValid(date)) return dateString;
    return format(date, formatStr);
  } catch {
    return dateString;
  }
}

/**
 * Formats a date as a short date (Jan 1)
 */
export function formatShortDate(dateString: string): string {
  return formatDate(dateString, 'MMM d');
}

/**
 * Formats a date with time
 */
export function formatDateTime(dateString: string): string {
  return formatDate(dateString, 'MMM d, yyyy h:mm a');
}

/**
 * Formats a date as relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(dateInput: string | Date): string {
  try {
    const date = typeof dateInput === 'string' ? parseISO(dateInput) : dateInput;
    if (!isValid(date)) return String(dateInput);
    return formatDistanceToNow(date, { addSuffix: true });
  } catch {
    return String(dateInput);
  }
}

/**
 * Formats a time string
 */
export function formatTime(dateString: string): string {
  return formatDate(dateString, 'h:mm a');
}

/**
 * Gets the day of week from a date
 */
export function formatDayOfWeek(dateString: string): string {
  return formatDate(dateString, 'EEEE');
}

/**
 * Formats a date range
 */
export function formatDateRange(startDate: string, endDate: string): string {
  const start = parseISO(startDate);
  const end = parseISO(endDate);

  if (!isValid(start) || !isValid(end)) {
    return `${startDate} - ${endDate}`;
  }

  // Same month and year
  if (
    format(start, 'MMM yyyy') === format(end, 'MMM yyyy')
  ) {
    return `${format(start, 'MMM d')} - ${format(end, 'd, yyyy')}`;
  }

  // Same year
  if (format(start, 'yyyy') === format(end, 'yyyy')) {
    return `${format(start, 'MMM d')} - ${format(end, 'MMM d, yyyy')}`;
  }

  // Different years
  return `${format(start, 'MMM d, yyyy')} - ${format(end, 'MMM d, yyyy')}`;
}

// ============ Metric Formatting ============

/**
 * Formats a metric value based on its type
 */
export function formatMetric(
  value: number,
  type: 'currency' | 'percent' | 'number' = 'number'
): string {
  switch (type) {
    case 'currency':
      return formatCurrency(value);
    case 'percent':
      return formatPercent(value, { alreadyPercent: true });
    case 'number':
    default:
      return formatNumber(value);
  }
}

// ============ Store Code Formatting ============

/**
 * Formats a store code consistently
 */
export function formatStoreCode(code: string): string {
  return code.toUpperCase().replace(/[^A-Z0-9]/g, '');
}

// ============ Phone Formatting ============

/**
 * Formats a phone number
 */
export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  return phone;
}

// ============ Address Formatting ============

/**
 * Formats a full address
 */
export function formatAddress(
  address: string,
  city: string,
  state: string,
  zipCode: string
): string {
  return `${address}, ${city}, ${state} ${zipCode}`;
}

/**
 * Formats city and state
 */
export function formatCityState(city: string, state: string): string {
  return `${city}, ${state}`;
}
