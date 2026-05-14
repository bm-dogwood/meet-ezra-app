'use client';

// ===========================================
// EZRA PORTAL - Sales Data Hook
// ===========================================

import { useState, useEffect, useMemo, useCallback } from 'react';
import type { DailySalesRecord, SalesMetrics, SalesTrend, DateRange } from '@/types';
import { salesApi } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { format, subDays } from 'date-fns';

interface UseSalesDataOptions {
  startDate?: string;
  endDate?: string;
}

interface UseSalesDataReturn {
  data: DailySalesRecord[];
  metrics: SalesMetrics;
  trend: SalesTrend[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
  dateRange: DateRange;
  setDateRange: (range: DateRange) => void;
}

/**
 * Hook to fetch and manage sales data for a store (locationId is actually storeId)
 */
export function useSalesData(
  storeId: string,
  options: UseSalesDataOptions = {}
): UseSalesDataReturn {
  const { isAuthenticated } = useAuth();
  
  // Default to last 30 days
  const defaultEndDate = format(new Date(), 'yyyy-MM-dd');
  const defaultStartDate = format(subDays(new Date(), 30), 'yyyy-MM-dd');

  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: options.startDate || defaultStartDate,
    endDate: options.endDate || defaultEndDate,
  });

  const [data, setData] = useState<DailySalesRecord[]>([]);
  const [metrics, setMetrics] = useState<SalesMetrics>({
    totalRevenue: 0,
    serviceRevenue: 0,
    productRevenue: 0,
    totalTips: 0,
    ticketCount: 0,
    avgTicket: 0,
    cardRevenue: 0,
    cashRevenue: 0,
    goalGapPercent: null,
  });
  const [trend, setTrend] = useState<SalesTrend[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    if (!storeId || !isAuthenticated) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Fetch comprehensive sales report
      const report = await salesApi.getSalesReport(
        storeId,
        dateRange.startDate,
        dateRange.endDate
      );

      // Transform daily breakdown to DailySalesRecord format
      const dailyData: DailySalesRecord[] = report.daily_breakdown.map((day: any) => ({
        id: day.date,
        date: day.date,
        totalRevenue: day.revenue || 0,
        serviceRevenue: day.services || 0,
        productRevenue: day.products || 0,
        ticketCount: day.tickets || 0,
        avgTicket: day.avg_ticket || 0,
        goalGapPercent: day.vs_goal_percent || null,
      }));

      setData(dailyData);

      // Set metrics from summary
      setMetrics({
        totalRevenue: report.summary.total_revenue || 0,
        serviceRevenue: report.summary.services_revenue || 0,
        productRevenue: report.summary.products_revenue || 0,
        totalTips: report.summary.total_tips || 0,
        ticketCount: report.summary.ticket_count || 0,
        avgTicket: report.summary.average_ticket || 0,
        cardRevenue: report.payment_mix.card.revenue || 0,
        cashRevenue: report.payment_mix.cash.revenue || 0,
        goalGapPercent: report.summary.revenue_vs_goal_percent || null,
      });

      // Transform revenue over time to SalesTrend format
      const trendData: SalesTrend[] = report.revenue_over_time.map((item: any) => ({
        date: item.date,
        revenue: item.revenue || 0,
        serviceRevenue: 0, // Not in revenue_over_time, but available in daily_breakdown
        productRevenue: 0, // Not in revenue_over_time, but available in daily_breakdown
      }));

      // Enrich trend data with service/product revenue from daily breakdown
      const enrichedTrend = trendData.map((t) => {
        const dayData = dailyData.find((d) => d.date === t.date);
        return {
          ...t,
          serviceRevenue: dayData?.serviceRevenue || 0,
          productRevenue: dayData?.productRevenue || 0,
        };
      });

      setTrend(enrichedTrend);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch sales data'));
    } finally {
      setIsLoading(false);
    }
  }, [storeId, dateRange, isAuthenticated]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    metrics,
    trend,
    isLoading,
    error,
    refetch: fetchData,
    dateRange,
    setDateRange,
  };
}

/**
 * Hook to fetch sales data for multiple locations
 */
export function useMultiLocationSalesData(
  locationIds: string[],
  dateRange?: DateRange
): {
  data: Record<string, DailySalesRecord[]>;
  isLoading: boolean;
  error: Error | null;
} {
  const [data, setData] = useState<Record<string, DailySalesRecord[]>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchAll = async () => {
      setIsLoading(true);
      setError(null);

      try {
        await sleep(500);

        const results: Record<string, DailySalesRecord[]> = {};
        for (const locId of locationIds) {
          results[locId] = getSalesData(locId, dateRange);
        }
        setData(results);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch sales data'));
      } finally {
        setIsLoading(false);
      }
    };

    if (locationIds.length > 0) {
      fetchAll();
    }
  }, [locationIds, dateRange?.startDate, dateRange?.endDate]);

  return { data, isLoading, error };
}

export default useSalesData;
