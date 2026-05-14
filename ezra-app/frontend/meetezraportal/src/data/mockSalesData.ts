// ===========================================
// EZRA PORTAL - Mock Sales Data
// ===========================================

import type { DailySalesRecord, SalesMetrics, SalesTrend, DateRange, InsightItem } from '@/types';
import { format, subDays, parseISO, eachDayOfInterval, isWeekend } from 'date-fns';
import { randomFloatInRange, randomInRange, generateId } from '@/lib/utils';

/**
 * Generate a single day's sales record
 */
function generateDailySales(
  locationId: string,
  date: string,
  baseRevenue: number = 3500
): DailySalesRecord {
  // Add some deterministic variance based on date and location
  const dateNum = new Date(date).getDate();
  const locSeed = locationId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const dayOfWeek = new Date(date).getDay();
  
  // Weekends typically have higher revenue
  const weekendMultiplier = isWeekend(parseISO(date)) ? 1.25 : 1;
  
  // Some variance by day of month
  const monthVariance = 1 + (Math.sin(dateNum / 5) * 0.15);
  
  // Location-specific variance
  const locVariance = 0.8 + ((locSeed % 40) / 100);
  
  const totalRevenue = Math.round(
    baseRevenue * weekendMultiplier * monthVariance * locVariance + randomInRange(-300, 500)
  );
  
  // Service typically 70-85% of revenue for spa businesses
  const servicePercent = randomFloatInRange(0.70, 0.85, 2);
  const serviceRevenue = Math.round(totalRevenue * servicePercent);
  const productRevenue = totalRevenue - serviceRevenue;
  
  // Ticket counts
  const ticketCount = Math.round(totalRevenue / randomInRange(70, 95));
  const guestCount = Math.round(ticketCount * randomFloatInRange(0.85, 1.05, 2));
  const avgTicket = ticketCount > 0 ? Math.round((totalRevenue / ticketCount) * 100) / 100 : 0;
  
  // Tips (typically 15-22% of service revenue)
  const tipPercent = randomFloatInRange(0.15, 0.22, 2);
  const totalTips = Math.round(serviceRevenue * tipPercent);
  
  // Payment mix (70-85% card)
  const cardPercent = randomFloatInRange(0.70, 0.85, 2);
  const cardRevenue = Math.round(totalRevenue * cardPercent);
  const cashRevenue = totalRevenue - cardRevenue;
  
  // Refunds (0-3% on some days)
  const hasRefund = Math.random() > 0.85;
  const refundAmount = hasRefund ? Math.round(totalRevenue * randomFloatInRange(0.01, 0.03, 3)) : 0;
  
  // Discounts (1-5%)
  const discountAmount = Math.round(totalRevenue * randomFloatInRange(0.01, 0.05, 3));
  
  // Goals (most locations have goals)
  const hasGoal = Math.random() > 0.1;
  const goalRevenue = hasGoal ? Math.round(baseRevenue * locVariance * weekendMultiplier) : null;
  const goalGap = goalRevenue ? totalRevenue - goalRevenue : null;
  const goalGapPercent = goalRevenue && goalGap ? (goalGap / goalRevenue) * 100 : null;
  
  return {
    id: `sales-${locationId}-${date}`,
    locationId,
    date,
    totalRevenue,
    serviceRevenue,
    productRevenue,
    guestCount,
    ticketCount,
    avgTicket,
    totalTips,
    cashRevenue,
    cardRevenue,
    refundAmount,
    discountAmount,
    goalRevenue,
    goalGap,
    goalGapPercent: goalGapPercent ? Math.round(goalGapPercent * 10) / 10 : null,
    createdAt: new Date(date).toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Generate sales data for a date range
 */
export function generateSalesData(
  locationId: string,
  dateRange: DateRange
): DailySalesRecord[] {
  const startDate = parseISO(dateRange.startDate);
  const endDate = parseISO(dateRange.endDate);
  
  const days = eachDayOfInterval({ start: startDate, end: endDate });
  
  return days.map((day) => {
    const dateStr = format(day, 'yyyy-MM-dd');
    return generateDailySales(locationId, dateStr);
  });
}

/**
 * Get sales data for a specific location and date range
 */
export function getSalesData(
  locationId: string,
  dateRange?: DateRange
): DailySalesRecord[] {
  // Default to last 30 days if no range specified
  const endDate = dateRange?.endDate || format(new Date(), 'yyyy-MM-dd');
  const startDate = dateRange?.startDate || format(subDays(parseISO(endDate), 30), 'yyyy-MM-dd');
  
  return generateSalesData(locationId, { startDate, endDate });
}

/**
 * Calculate aggregated metrics from sales data
 */
export function calculateMetrics(salesData: DailySalesRecord[]): SalesMetrics {
  if (salesData.length === 0) {
    return {
      totalRevenue: 0,
      serviceRevenue: 0,
      productRevenue: 0,
      avgTicket: 0,
      ticketCount: 0,
      guestCount: 0,
      totalTips: 0,
      cashRevenue: 0,
      cardRevenue: 0,
      refundAmount: 0,
      discountAmount: 0,
      goalRevenue: 0,
      goalGap: 0,
      goalGapPercent: 0,
    };
  }
  
  const sum = salesData.reduce(
    (acc, day) => ({
      totalRevenue: acc.totalRevenue + day.totalRevenue,
      serviceRevenue: acc.serviceRevenue + day.serviceRevenue,
      productRevenue: acc.productRevenue + day.productRevenue,
      ticketCount: acc.ticketCount + day.ticketCount,
      guestCount: acc.guestCount + day.guestCount,
      totalTips: acc.totalTips + day.totalTips,
      cashRevenue: acc.cashRevenue + day.cashRevenue,
      cardRevenue: acc.cardRevenue + day.cardRevenue,
      refundAmount: acc.refundAmount + day.refundAmount,
      discountAmount: acc.discountAmount + day.discountAmount,
      goalRevenue: acc.goalRevenue + (day.goalRevenue || 0),
    }),
    {
      totalRevenue: 0,
      serviceRevenue: 0,
      productRevenue: 0,
      ticketCount: 0,
      guestCount: 0,
      totalTips: 0,
      cashRevenue: 0,
      cardRevenue: 0,
      refundAmount: 0,
      discountAmount: 0,
      goalRevenue: 0,
    }
  );
  
  const avgTicket = sum.ticketCount > 0 ? sum.totalRevenue / sum.ticketCount : 0;
  const goalGap = sum.totalRevenue - sum.goalRevenue;
  const goalGapPercent = sum.goalRevenue > 0 ? (goalGap / sum.goalRevenue) * 100 : 0;
  
  return {
    ...sum,
    avgTicket: Math.round(avgTicket * 100) / 100,
    goalGap,
    goalGapPercent: Math.round(goalGapPercent * 10) / 10,
  };
}

/**
 * Get sales trend data for charts
 */
export function getSalesTrend(salesData: DailySalesRecord[]): SalesTrend[] {
  return salesData.map((day) => ({
    date: day.date,
    revenue: day.totalRevenue,
    serviceRevenue: day.serviceRevenue,
    productRevenue: day.productRevenue,
    ticketCount: day.ticketCount,
  }));
}

/**
 * Generate overview metrics for all locations
 */
export function generateOverviewMetrics(locationIds: string[]): {
  totalRevenue: number;
  avgTicket: number;
  laborPercent: number;
  lpRiskCount: number;
  marketingROI: number;
  periodChange: number;
} {
  // Generate deterministic but realistic-looking metrics
  const baseRevenue = locationIds.length * 3200; // ~$3.2k per location per day
  const periodDays = 30;
  
  return {
    totalRevenue: Math.round(baseRevenue * periodDays * randomFloatInRange(0.95, 1.05, 2)),
    avgTicket: Math.round(randomFloatInRange(78, 92, 2) * 100) / 100,
    laborPercent: Math.round(randomFloatInRange(28, 35, 1) * 10) / 10,
    lpRiskCount: randomInRange(2, 8),
    marketingROI: Math.round(randomFloatInRange(3.2, 4.8, 1) * 10) / 10,
    periodChange: Math.round(randomFloatInRange(-5, 12, 1) * 10) / 10,
  };
}

/**
 * Generate AI insights
 */
export function generateInsights(): InsightItem[] {
  const insights: InsightItem[] = [
    {
      id: generateId(),
      type: 'warning',
      title: 'Revenue Trend Alert',
      description: '3 locations are trending 8%+ below target this week. Eden Prairie, Beverly Hills, and Miami - Brickell need attention.',
      locationId: 'loc-80662',
      timestamp: new Date().toISOString(),
    },
    {
      id: generateId(),
      type: 'alert',
      title: 'LP Risk Detected',
      description: 'Unusual refund patterns detected at Beverly Hills location. 4 high-value refunds processed by same employee in 2 days.',
      locationId: 'loc-70001',
      actionUrl: '/app/locations/loc-70001/lp',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: generateId(),
      type: 'success',
      title: 'Goal Achievement',
      description: 'Palo Alto location exceeded weekly goal by 12.4%. Strong performance in premium services.',
      locationId: 'loc-70004',
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: generateId(),
      type: 'info',
      title: 'POS Insight',
      description: 'Stripe locations showing 8% higher average tickets than Zenoti locations. Consider reviewing service pricing parity.',
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: generateId(),
      type: 'warning',
      title: 'Real-time Alert',
      description: 'Location 80660 (Apple Valley) is currently 5.8% below today\'s revenue goal as of 2:30 PM.',
      locationId: 'loc-80660',
      timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    },
  ];
  
  return insights;
}

/**
 * Generate sales by location data for charts
 */
export function generateSalesByLocation(
  locationIds: string[],
  locationNames: Record<string, string>
): { name: string; revenue: number; target: number }[] {
  return locationIds.slice(0, 10).map((id) => {
    const revenue = randomInRange(85000, 125000);
    const target = Math.round(revenue * randomFloatInRange(0.92, 1.08, 2));
    return {
      name: locationNames[id] || id,
      revenue,
      target,
    };
  });
}

/**
 * Generate service vs product mix data
 */
export function generateServiceProductMix(): { name: string; value: number; fill: string }[] {
  const servicePercent = randomInRange(72, 82);
  return [
    { name: 'Services', value: servicePercent, fill: '#06b6d4' },
    { name: 'Products', value: 100 - servicePercent, fill: '#8b5cf6' },
  ];
}

/**
 * Generate payment mix data
 */
export function generatePaymentMix(): { name: string; value: number; fill: string }[] {
  const cardPercent = randomInRange(75, 85);
  return [
    { name: 'Card', value: cardPercent, fill: '#06b6d4' },
    { name: 'Cash', value: 100 - cardPercent, fill: '#22c55e' },
  ];
}
