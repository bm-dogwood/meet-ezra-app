// ===========================================
// EZRA PORTAL - Mock Scheduling Data
// Uses TSTH (Total Sales / Total Hours) instead of SRPH
// ===========================================

import type {
  SchedulingTimeBucket,
  SchedulingDailySummary,
  SchedulingLocationSummary,
  SchedulingRecommendation,
  TimeWindowInsight,
  SchedulingOverviewData,
  SchedulingStoreData,
  DateRange,
} from '@/types';
import { format, subDays, parseISO, eachDayOfInterval, isWeekend } from 'date-fns';
import { mockLocations } from './mockLocations';
import { randomFloatInRange, randomInRange, generateId } from '@/lib/utils';

// ============ Constants ============
export const SCHEDULING_CONSTANTS = {
  AVG_HOURLY_LABOR_COST: 18.5,
  OVERTIME_THRESHOLD: 40,
  IDLE_THRESHOLD: 0,
  PEAK_HOURS: [14, 15, 16, 17, 18],
  SLOW_HOURS: [9, 10, 11, 20, 21],
  OPERATING_HOURS: { start: 9, end: 21 },
  TIME_WINDOWS: {
    morning: { start: 9, end: 12, label: 'Morning (9AM-12PM)' },
    noon: { start: 12, end: 14, label: 'Noon (12PM-2PM)' },
    afternoon: { start: 14, end: 17, label: 'Afternoon (2PM-5PM)' },
    evening: { start: 17, end: 21, label: 'Evening (5PM-9PM)' },
  },
};

function getTimeLabel(hour: number): string {
  const period = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
  return `${displayHour}:00 ${period}`;
}

function getTimeWindow(hour: number): string {
  const { TIME_WINDOWS } = SCHEDULING_CONSTANTS;
  if (hour >= TIME_WINDOWS.morning.start && hour < TIME_WINDOWS.morning.end) return 'Morning';
  if (hour >= TIME_WINDOWS.noon.start && hour < TIME_WINDOWS.noon.end) return 'Noon';
  if (hour >= TIME_WINDOWS.afternoon.start && hour < TIME_WINDOWS.afternoon.end) return 'Afternoon';
  return 'Evening';
}

function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function generateDayTimeBuckets(
  locationId: string,
  date: string,
  locationSeed: number
): SchedulingTimeBucket[] {
  const { OPERATING_HOURS, PEAK_HOURS, SLOW_HOURS } = SCHEDULING_CONSTANTS;
  const dateNum = new Date(date).getDate();
  const isWeekendDay = isWeekend(parseISO(date));
  const buckets: SchedulingTimeBucket[] = [];

  for (let hour = OPERATING_HOURS.start; hour < OPERATING_HOURS.end; hour++) {
    const seed = locationSeed + dateNum + hour;
    const isPeakHour = PEAK_HOURS.includes(hour);
    const isSlowHour = SLOW_HOURS.includes(hour);

    let baseRevenue = isPeakHour ? 450 : isSlowHour ? 120 : 280;
    let baseTickets = isPeakHour ? 8 : isSlowHour ? 2 : 5;
    let baseLaborHours = isPeakHour ? 3.5 : isSlowHour ? 2 : 2.5;

    if (isWeekendDay) {
      baseRevenue *= 1.25;
      baseTickets = Math.round(baseTickets * 1.2);
      baseLaborHours *= 1.1;
    }

    const variance = seededRandom(seed);
    const revenue = Math.round(baseRevenue * (0.7 + variance * 0.6));
    const tickets = Math.max(0, Math.round(baseTickets * (0.6 + variance * 0.8)));
    const laborHours = Math.round(baseLaborHours * (0.8 + variance * 0.4) * 10) / 10;
    const laborCost = Math.round(laborHours * SCHEDULING_CONSTANTS.AVG_HOURLY_LABOR_COST * 100) / 100;
    const overtimeHours = hour >= 19 && seededRandom(seed + 100) > 0.85
      ? Math.round(seededRandom(seed + 101) * 1.5 * 10) / 10
      : 0;

    buckets.push({ date, hour, timeLabel: getTimeLabel(hour), revenue, guestTickets: tickets, laborHours, laborCost, overtimeHours });
  }
  return buckets;
}

function generateDailySummary(buckets: SchedulingTimeBucket[], date: string): SchedulingDailySummary {
  const totalRevenue = buckets.reduce((sum, b) => sum + b.revenue, 0);
  const totalTickets = buckets.reduce((sum, b) => sum + b.guestTickets, 0);
  const totalLaborHours = buckets.reduce((sum, b) => sum + b.laborHours, 0);
  const totalLaborCost = buckets.reduce((sum, b) => sum + b.laborCost, 0);
  const totalOvertime = buckets.reduce((sum, b) => sum + b.overtimeHours, 0);
  const idleHours = buckets.filter(b => b.laborHours > 0 && b.revenue === 0).reduce((sum, b) => sum + b.laborHours, 0);
  const idlePercent = totalLaborHours > 0 ? (idleHours / totalLaborHours) * 100 : 0;
  const tsth = totalLaborHours > 0 ? totalRevenue / totalLaborHours : 0;
  const ticketsPerLaborHour = totalLaborHours > 0 ? totalTickets / totalLaborHours : 0;
  const sortedByTickets = [...buckets].sort((a, b) => b.guestTickets - a.guestTickets);

  return {
    date,
    dayOfWeek: format(parseISO(date), 'EEEE'),
    revenue: totalRevenue,
    guestTickets: totalTickets,
    laborHours: Math.round(totalLaborHours * 10) / 10,
    laborCost: Math.round(totalLaborCost * 100) / 100,
    idleHours: Math.round(idleHours * 10) / 10,
    idlePercent: Math.round(idlePercent * 10) / 10,
    tsth: Math.round(tsth * 100) / 100,
    ticketsPerLaborHour: Math.round(ticketsPerLaborHour * 100) / 100,
    overtimeHours: Math.round(totalOvertime * 10) / 10,
    peakHour: sortedByTickets[0]?.hour || 14,
    slowestHour: sortedByTickets[sortedByTickets.length - 1]?.hour || 10,
  };
}

function generateLocationSummary(
  locationId: string,
  dailySummaries: SchedulingDailySummary[]
): Omit<SchedulingLocationSummary, 'locationName' | 'storeCode' | 'state'> {
  const totalRevenue = dailySummaries.reduce((sum, d) => sum + d.revenue, 0);
  const totalLaborHours = dailySummaries.reduce((sum, d) => sum + d.laborHours, 0);
  const totalLaborCost = dailySummaries.reduce((sum, d) => sum + d.laborCost, 0);
  const totalIdleHours = dailySummaries.reduce((sum, d) => sum + d.idleHours, 0);
  const totalOvertime = dailySummaries.reduce((sum, d) => sum + d.overtimeHours, 0);
  const totalTickets = dailySummaries.reduce((sum, d) => sum + d.guestTickets, 0);
  const idlePercent = totalLaborHours > 0 ? (totalIdleHours / totalLaborHours) * 100 : 0;
  const tsth = totalLaborHours > 0 ? totalRevenue / totalLaborHours : 0;
  const ticketsPerLaborHour = totalLaborHours > 0 ? totalTickets / totalLaborHours : 0;
  const peakHours = dailySummaries.map(d => d.peakHour);
  const slowHours = dailySummaries.map(d => d.slowestHour);
  const avgPeakHour = Math.round(peakHours.reduce((a, b) => a + b, 0) / peakHours.length);
  const avgSlowHour = Math.round(slowHours.reduce((a, b) => a + b, 0) / slowHours.length);
  const location = mockLocations.find(l => l.id === locationId);

  return {
    locationId,
    revenue: totalRevenue,
    laborHours: Math.round(totalLaborHours * 10) / 10,
    laborCost: Math.round(totalLaborCost * 100) / 100,
    idleHours: Math.round(totalIdleHours * 10) / 10,
    idlePercent: Math.round(idlePercent * 10) / 10,
    tsth: Math.round(tsth * 100) / 100,
    ticketsPerLaborHour: Math.round(ticketsPerLaborHour * 100) / 100,
    overtimeHours: Math.round(totalOvertime * 10) / 10,
    hasOvertimeFlag: totalOvertime > 5,
    lastSyncAt: location?.lastSyncAt || new Date().toISOString(),
    peakWindow: getTimeWindow(avgPeakHour) + ` (${getTimeLabel(avgPeakHour)})`,
    slowestWindow: getTimeWindow(avgSlowHour) + ` (${getTimeLabel(avgSlowHour)})`,
  };
}

function generateTimeWindowInsights(buckets: SchedulingTimeBucket[]): TimeWindowInsight[] {
  const { TIME_WINDOWS } = SCHEDULING_CONSTANTS;
  const windows = Object.entries(TIME_WINDOWS);

  return windows.map(([key, config]) => {
    const windowBuckets = buckets.filter(b => b.hour >= config.start && b.hour < config.end);
    if (windowBuckets.length === 0) {
      return { window: config.label, avgTickets: 0, avgRevenue: 0, avgLaborHours: 0, tplh: 0, idleHours: 0, idlePercent: 0 };
    }
    const totalTickets = windowBuckets.reduce((sum, b) => sum + b.guestTickets, 0);
    const totalRevenue = windowBuckets.reduce((sum, b) => sum + b.revenue, 0);
    const totalLaborHours = windowBuckets.reduce((sum, b) => sum + b.laborHours, 0);
    const idleBuckets = windowBuckets.filter(b => b.laborHours > 0 && b.revenue === 0);
    const idleHoursTotal = idleBuckets.reduce((sum, b) => sum + b.laborHours, 0);
    const days = new Set(windowBuckets.map(b => b.date)).size;

    return {
      window: config.label,
      avgTickets: Math.round((totalTickets / days) * 10) / 10,
      avgRevenue: Math.round(totalRevenue / days),
      avgLaborHours: Math.round((totalLaborHours / days) * 10) / 10,
      tplh: totalLaborHours > 0 ? Math.round((totalTickets / totalLaborHours) * 100) / 100 : 0,
      idleHours: Math.round(idleHoursTotal * 10) / 10,
      idlePercent: totalLaborHours > 0 ? Math.round((idleHoursTotal / totalLaborHours) * 1000) / 10 : 0,
    };
  });
}

function generateRecommendations(
  summary: SchedulingLocationSummary,
  windowInsights: TimeWindowInsight[],
  dailyData: SchedulingDailySummary[]
): SchedulingRecommendation[] {
  const recommendations: SchedulingRecommendation[] = [];
  const highestIdleWindow = [...windowInsights].sort((a, b) => b.idlePercent - a.idlePercent)[0];
  const lowestTPLHWindow = [...windowInsights].sort((a, b) => a.tplh - b.tplh)[0];
  const highestTPLHWindow = [...windowInsights].sort((a, b) => b.tplh - a.tplh)[0];
  const busiestWindow = [...windowInsights].sort((a, b) => b.avgTickets - a.avgTickets)[0];

  if (summary.idlePercent > 15) {
    recommendations.push({
      id: generateId(),
      type: 'reduce_coverage',
      priority: 'high',
      title: `Reduce coverage during ${highestIdleWindow.window}`,
      description: `High idle time detected: ${summary.idlePercent.toFixed(1)}% of labor hours have zero revenue. Consider reducing staffing during ${highestIdleWindow.window} when idle rate is ${highestIdleWindow.idlePercent.toFixed(1)}%.`,
      metric: `${summary.idleHours.toFixed(1)} idle hours / ${summary.laborHours.toFixed(1)} total`,
      impact: `Potential savings: $${Math.round(summary.idleHours * SCHEDULING_CONSTANTS.AVG_HOURLY_LABOR_COST * 0.5)}/period`,
    });
  }

  if (lowestTPLHWindow.tplh < summary.ticketsPerLaborHour * 0.7) {
    recommendations.push({
      id: generateId(),
      type: 'shift_hours',
      priority: 'medium',
      title: `Optimize staffing for ${lowestTPLHWindow.window}`,
      description: `${lowestTPLHWindow.window} has the lowest revenue per labor hour ($${(summary.tsth * lowestTPLHWindow.tplh / summary.ticketsPerLaborHour).toFixed(2)}/hr vs $${summary.tsth.toFixed(2)}/hr average). Consider shifting staff to busier periods.`,
      metric: `TSTH: $${summary.tsth.toFixed(2)} vs avg $${summary.tsth.toFixed(2)}`,
    });
  }

  if (busiestWindow.avgTickets > 25) {
    recommendations.push({
      id: generateId(),
      type: 'add_coverage',
      priority: 'medium',
      title: `Ensure adequate coverage during ${busiestWindow.window}`,
      description: `${busiestWindow.window} is the busiest period with ${busiestWindow.avgTickets.toFixed(1)} average tickets and $${busiestWindow.avgRevenue.toLocaleString()} average revenue. Ensure sufficient coverage to maximize conversion.`,
      metric: `${busiestWindow.avgTickets.toFixed(1)} tickets/day during peak`,
    });
  }

  if (summary.hasOvertimeFlag) {
    recommendations.push({
      id: generateId(),
      type: 'overtime_alert',
      priority: 'high',
      title: 'Overtime hours detected',
      description: `${summary.overtimeHours.toFixed(1)} overtime hours recorded this period. Consider redistributing hours across the week or adding part-time staff to reduce overtime costs.`,
      metric: `${summary.overtimeHours.toFixed(1)} OT hours`,
      impact: `Overtime premium cost: ~$${Math.round(summary.overtimeHours * SCHEDULING_CONSTANTS.AVG_HOURLY_LABOR_COST * 0.5)}`,
    });
  }

  if (summary.tsth > 150) {
    recommendations.push({
      id: generateId(),
      type: 'efficiency',
      priority: 'low',
      title: 'Strong revenue efficiency',
      description: `This location has excellent TSTH ($${summary.tsth.toFixed(2)}). ${highestTPLHWindow.window} performs best. Consider this location as a model for scheduling best practices.`,
      metric: `TSTH: $${summary.tsth.toFixed(2)}`,
    });
  }

  if (recommendations.length < 3) {
    const slowestDays = dailyData.filter(d => d.tsth < summary.tsth * 0.8).map(d => d.dayOfWeek);
    if (slowestDays.length > 0) {
      const uniqueDays = [...new Set(slowestDays)];
      recommendations.push({
        id: generateId(),
        type: 'shift_hours',
        priority: 'low',
        title: `Review ${uniqueDays[0]} scheduling`,
        description: `${uniqueDays.join(' and ')} tend to have lower efficiency. Consider adjusting staffing levels based on historical demand patterns.`,
        metric: `Lower TSTH on ${uniqueDays.length} day(s)`,
      });
    }
  }

  return recommendations.slice(0, 6);
}

// ============ Public API ============

export function getSchedulingOverview(
  clientId: string,
  dateRange?: DateRange
): SchedulingOverviewData {
  const endDate = dateRange?.endDate || format(new Date(), 'yyyy-MM-dd');
  const startDate = dateRange?.startDate || format(subDays(parseISO(endDate), 30), 'yyyy-MM-dd');
  const days = eachDayOfInterval({ start: parseISO(startDate), end: parseISO(endDate) });
  const locations = mockLocations.filter(l => l.clientId === clientId && l.status === 'active');

  const locationSummaries: SchedulingLocationSummary[] = locations.map(location => {
    const locationSeed = location.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const allBuckets = days.flatMap(day => generateDayTimeBuckets(location.id, format(day, 'yyyy-MM-dd'), locationSeed));
    const dailySummaries = days.map(day => {
      const dayStr = format(day, 'yyyy-MM-dd');
      return generateDailySummary(allBuckets.filter(b => b.date === dayStr), dayStr);
    });
    const summary = generateLocationSummary(location.id, dailySummaries);
    return { ...summary, locationName: location.name, storeCode: location.storeCode, state: location.state };
  });

  const totalRevenue = locationSummaries.reduce((sum, l) => sum + l.revenue, 0);
  const totalLaborHours = locationSummaries.reduce((sum, l) => sum + l.laborHours, 0);
  const totalIdleHours = locationSummaries.reduce((sum, l) => sum + l.idleHours, 0);
  const idlePercent = totalLaborHours > 0 ? (totalIdleHours / totalLaborHours) * 100 : 0;
  const avgTSTH = totalLaborHours > 0 ? totalRevenue / totalLaborHours : 0;
  const overtimeAlerts = locationSummaries.filter(l => l.hasOvertimeFlag).length;

  const revenueTrend = days.map(day => {
    const dayStr = format(day, 'yyyy-MM-dd');
    const dayRevenue = locationSummaries.reduce((sum, loc) => {
      const seed = loc.locationId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) + day.getDate();
      const baseRevenue = loc.revenue / days.length;
      const variance = (seededRandom(seed) - 0.5) * baseRevenue * 0.3;
      const weekendMultiplier = isWeekend(day) ? 1.2 : 1;
      return sum + (baseRevenue + variance) * weekendMultiplier;
    }, 0);
    return { date: dayStr, revenue: Math.round(dayRevenue) };
  });

  const idleByLocation = [...locationSummaries]
    .sort((a, b) => b.idlePercent - a.idlePercent)
    .slice(0, 10)
    .map(l => ({ name: l.locationName, idlePercent: l.idlePercent }));

  return {
    totalRevenue,
    totalLaborHours: Math.round(totalLaborHours * 10) / 10,
    totalIdleHours: Math.round(totalIdleHours * 10) / 10,
    idlePercent: Math.round(idlePercent * 10) / 10,
    avgTSTH: Math.round(avgTSTH * 100) / 100,
    overtimeAlerts,
    locationSummaries: locationSummaries.sort((a, b) => b.idlePercent - a.idlePercent),
    revenueTrend,
    idleByLocation,
  };
}

export function getSchedulingStore(
  locationId: string,
  dateRange?: DateRange
): SchedulingStoreData | null {
  const location = mockLocations.find(l => l.id === locationId);
  if (!location) return null;

  const endDate = dateRange?.endDate || format(new Date(), 'yyyy-MM-dd');
  const startDate = dateRange?.startDate || format(subDays(parseISO(endDate), 14), 'yyyy-MM-dd');
  const days = eachDayOfInterval({ start: parseISO(startDate), end: parseISO(endDate) });
  const locationSeed = location.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const allBuckets = days.flatMap(day => generateDayTimeBuckets(location.id, format(day, 'yyyy-MM-dd'), locationSeed));

  const dailyBreakdown = days.map(day => {
    const dayStr = format(day, 'yyyy-MM-dd');
    return generateDailySummary(allBuckets.filter(b => b.date === dayStr), dayStr);
  });

  const summaryData = generateLocationSummary(location.id, dailyBreakdown);
  const timeWindowInsights = generateTimeWindowInsights(allBuckets);

  // Hourly trend with idle payroll hours
  const { OPERATING_HOURS } = SCHEDULING_CONSTANTS;
  const hourlyTrend = [];
  for (let hour = OPERATING_HOURS.start; hour < OPERATING_HOURS.end; hour++) {
    const hourBuckets = allBuckets.filter(b => b.hour === hour);
    const avgTickets = hourBuckets.reduce((sum, b) => sum + b.guestTickets, 0) / hourBuckets.length;
    const avgRevenue = hourBuckets.reduce((sum, b) => sum + b.revenue, 0) / hourBuckets.length;
    const avgLaborHours = hourBuckets.reduce((sum, b) => sum + b.laborHours, 0) / hourBuckets.length;
    // Idle payroll hours: hours where guests serviced = 0
    const idleBuckets = hourBuckets.filter(b => b.guestTickets === 0);
    const idlePayrollHours = idleBuckets.length > 0
      ? idleBuckets.reduce((sum, b) => sum + b.laborHours, 0) / hourBuckets.length
      : 0;

    hourlyTrend.push({
      hour,
      label: getTimeLabel(hour),
      avgTickets: Math.round(avgTickets * 10) / 10,
      avgRevenue: Math.round(avgRevenue),
      avgLaborHours: Math.round(avgLaborHours * 10) / 10,
      idlePayrollHours: Math.round(idlePayrollHours * 10) / 10,
    });
  }

  // Generate heatmap from last 7 days
  const last7Days = days.slice(-7);
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const heatmap = last7Days.map(day => {
    const dayStr = format(day, 'yyyy-MM-dd');
    const dayBuckets = allBuckets.filter(b => b.date === dayStr);
    const morning = dayBuckets.filter(b => b.hour >= 9 && b.hour < 12).reduce((s, b) => s + b.guestTickets, 0);
    const noon = dayBuckets.filter(b => b.hour >= 12 && b.hour < 14).reduce((s, b) => s + b.guestTickets, 0);
    const afternoon = dayBuckets.filter(b => b.hour >= 14 && b.hour < 17).reduce((s, b) => s + b.guestTickets, 0);
    const evening = dayBuckets.filter(b => b.hour >= 17 && b.hour < 21).reduce((s, b) => s + b.guestTickets, 0);
    return {
      day: dayNames[day.getDay()],
      '9AM-12PM': morning,
      '12PM-2PM': noon,
      '2PM-5PM': afternoon,
      '5PM-9PM': evening,
    };
  });

  const fullSummary: SchedulingLocationSummary = {
    ...summaryData,
    locationName: location.name,
    storeCode: location.storeCode,
    state: location.state,
  };

  const recommendations = generateRecommendations(fullSummary, timeWindowInsights, dailyBreakdown);

  return {
    locationId,
    locationName: location.name,
    storeCode: location.storeCode,
    summary: {
      revenue: summaryData.revenue,
      laborHours: summaryData.laborHours,
      laborCost: summaryData.laborCost,
      idleHours: summaryData.idleHours,
      idlePercent: summaryData.idlePercent,
      tsth: summaryData.tsth,
      ticketsPerLaborHour: summaryData.ticketsPerLaborHour,
      overtimeHours: summaryData.overtimeHours,
      hasOvertimeFlag: summaryData.hasOvertimeFlag,
    },
    timeWindowInsights,
    dailyBreakdown,
    hourlyTrend,
    heatmap,
    recommendations,
  };
}
