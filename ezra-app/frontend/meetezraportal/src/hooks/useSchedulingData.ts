'use client';

// ===========================================
// EZRA PORTAL - Scheduling Data Hook (Real API)
// ===========================================

import { useState, useEffect, useCallback } from 'react';
import type {
  SchedulingOverviewData,
  SchedulingStoreData,
  SchedulingLocationSummary,
  TimeWindowInsight,
  SchedulingDailySummary,
  SchedulingRecommendation,
  DateRange,
} from '@/types';
import { schedulingApi } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { format, subDays } from 'date-fns';

// ============ Transform API response to match UI types ============

function transformOverview(raw: any): SchedulingOverviewData {
  return {
    totalRevenue: raw.totalRevenue ?? 0,
    totalLaborHours: raw.totalLaborHours ?? 0,
    totalIdleHours: raw.totalIdleHours ?? 0,
    idlePercent: raw.idlePercent ?? 0,
    avgTSTH: raw.avgTSTH ?? 0,
    overtimeAlerts: raw.overtimeAlerts ?? 0,
    locationSummaries: (raw.locationSummaries || []).map((loc: any) => ({
      locationId: String(loc.locationId),
      storeCode: loc.storeCode || '',
      locationName: loc.locationName || '',
      state: loc.state || '',
      revenue: loc.revenue ?? 0,
      laborHours: loc.laborHours ?? 0,
      laborCost: loc.laborCost ?? 0,
      idleHours: loc.idleHours ?? 0,
      idlePercent: loc.idlePercent ?? 0,
      tsth: loc.tsth ?? 0,
      ticketsPerLaborHour: loc.ticketsPerLaborHour ?? 0,
      overtimeHours: loc.overtimeHours ?? 0,
      hasOvertimeFlag: loc.hasOvertimeFlag ?? false,
      lastSyncAt: loc.lastSyncAt || new Date().toISOString(),
      peakWindow: loc.peakWindow || '',
      slowestWindow: loc.slowestWindow || '',
    })) as SchedulingLocationSummary[],
    revenueTrend: (raw.revenueTrend || []).map((r: any) => ({
      date: r.date,
      revenue: r.revenue ?? 0,
    })),
    idleByLocation: (raw.idleByLocation || []).map((r: any) => ({
      name: r.name,
      idlePercent: r.idlePercent ?? 0,
    })),
  };
}

function transformStoreData(raw: any): SchedulingStoreData {
  const s = raw.summary || {};
  return {
    locationId: String(raw.locationId || raw.store_id || ''),
    locationName: raw.locationName || raw.store_name || '',
    storeCode: raw.storeCode || raw.store_code || '',
    summary: {
      revenue: s.revenue ?? s.total_revenue ?? 0,
      laborHours: s.laborHours ?? s.payroll_hours ?? 0,
      laborCost: s.laborCost ?? s.estimated_labor_cost ?? 0,
      idleHours: s.idleHours ?? s.idle_hours ?? 0,
      idlePercent: s.idlePercent ?? s.pct_idle ?? 0,
      tsth: s.tsth ?? s.srph ?? 0,
      ticketsPerLaborHour: s.ticketsPerLaborHour ?? s.tplh ?? 0,
      overtimeHours: s.overtimeHours ?? s.overtime_hours ?? 0,
      hasOvertimeFlag: s.hasOvertimeFlag ?? s.has_overtime ?? false,
    },
    timeWindowInsights: (raw.timeWindowInsights || raw.time_windows || []).map((w: any) => ({
      window: w.window || w.time_bucket || '',
      avgTickets: w.avgTickets ?? w.avg_tickets ?? 0,
      avgRevenue: w.avgRevenue ?? w.avg_revenue ?? 0,
      avgLaborHours: w.avgLaborHours ?? w.avg_labor_hours ?? 0,
      tplh: w.tplh ?? 0,
      idleHours: w.idleHours ?? w.idle_hours ?? 0,
      idlePercent: w.idlePercent ?? w.idle_percent ?? 0,
    })) as TimeWindowInsight[],
    dailyBreakdown: (raw.dailyBreakdown || raw.daily_breakdown || []).map((d: any) => ({
      date: d.date || '',
      dayOfWeek: d.dayOfWeek || d.day_of_week || '',
      revenue: d.revenue ?? 0,
      guestTickets: d.guestTickets ?? d.guest_tickets ?? 0,
      laborHours: d.laborHours ?? d.labor_hours ?? 0,
      laborCost: d.laborCost ?? d.labor_cost ?? 0,
      idleHours: d.idleHours ?? d.idle_hours ?? 0,
      idlePercent: d.idlePercent ?? d.idle_percent ?? 0,
      tsth: d.tsth ?? d.srph ?? 0,
      ticketsPerLaborHour: d.ticketsPerLaborHour ?? d.tplh ?? 0,
      overtimeHours: d.overtimeHours ?? d.overtime_hours ?? 0,
      peakHour: d.peakHour ?? 0,
      slowestHour: d.slowestHour ?? 0,
    })) as SchedulingDailySummary[],
    hourlyTrend: (raw.hourlyTrend || raw.hourly_trend || []).map((h: any) => ({
      hour: h.hour ?? 0,
      label: h.label || '',
      avgTickets: h.avgTickets ?? h.avg_tickets ?? 0,
      avgRevenue: h.avgRevenue ?? h.avg_revenue ?? 0,
      avgLaborHours: h.avgLaborHours ?? h.avg_labor_hours ?? 0,
      idlePayrollHours: h.idlePayrollHours ?? h.idle_payroll_hours ?? 0,
    })),
    heatmap: (raw.heatmap || []).map((h: any) => ({
      day: h.day || '',
      '9AM-12PM': h['9AM-12PM'] ?? 0,
      '12PM-2PM': h['12PM-2PM'] ?? 0,
      '2PM-5PM': h['2PM-5PM'] ?? 0,
      '5PM-9PM': h['5PM-9PM'] ?? 0,
    })),
    recommendations: (raw.recommendations || []).map((r: any) => ({
      id: r.id || '',
      type: r.type || 'efficiency',
      priority: r.priority || 'low',
      title: r.title || '',
      description: r.description || '',
      metric: r.metric || '',
      impact: r.impact || '',
    })) as SchedulingRecommendation[],
  };
}

// ============ Overview Hook ============

interface UseSchedulingOverviewReturn {
  data: SchedulingOverviewData | null;
  isLoading: boolean;
  error: Error | null;
  dateRange: DateRange;
  setDateRange: (range: DateRange) => void;
  refetch: () => void;
}

export function useSchedulingOverview(): UseSchedulingOverviewReturn {
  const { user } = useAuth();
  const [data, setData] = useState<SchedulingOverviewData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: format(subDays(new Date(), 30), 'yyyy-MM-dd'),
    endDate: format(new Date(), 'yyyy-MM-dd'),
  });

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const raw = await schedulingApi.getOverview({
        start_date: dateRange.startDate,
        end_date: dateRange.endDate,
      });
      setData(transformOverview(raw));
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch scheduling data'));
    } finally {
      setIsLoading(false);
    }
  }, [dateRange]);

  useEffect(() => { fetchData(); }, [fetchData]);

  return { data, isLoading, error, dateRange, setDateRange, refetch: fetchData };
}

// ============ Store Hook ============

interface UseSchedulingStoreReturn {
  data: SchedulingStoreData | null;
  isLoading: boolean;
  error: Error | null;
  dateRange: DateRange;
  setDateRange: (range: DateRange) => void;
  refetch: () => void;
}

export function useSchedulingStore(locationId: string): UseSchedulingStoreReturn {
  const [data, setData] = useState<SchedulingStoreData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: format(subDays(new Date(), 30), 'yyyy-MM-dd'),
    endDate: format(new Date(), 'yyyy-MM-dd'),
  });

  const fetchData = useCallback(async () => {
    if (!locationId) return;
    setIsLoading(true);
    setError(null);
    try {
      const raw = await schedulingApi.getStoreDrilldown(locationId, {
        start_date: dateRange.startDate,
        end_date: dateRange.endDate,
      });
      if (!raw) throw new Error('Location not found');
      setData(transformStoreData(raw));
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch store scheduling data'));
    } finally {
      setIsLoading(false);
    }
  }, [locationId, dateRange]);

  useEffect(() => { fetchData(); }, [fetchData]);

  return { data, isLoading, error, dateRange, setDateRange, refetch: fetchData };
}

export default useSchedulingOverview;
