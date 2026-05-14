'use client';

// ===========================================
// EZRA PORTAL - Overview Metrics Hook
// ===========================================

import { useState, useEffect, useMemo, useCallback } from 'react';
import type { KPIData, InsightItem } from '@/types';
import { salesApi } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { formatCurrency, formatPercent } from '@/lib/formatters';

interface OverviewData {
  kpis: KPIData[];
  insights: InsightItem[];
  salesByLocation: { name: string; revenue: number; target: number }[];
  serviceProductMix: { name: string; value: number; fill: string }[];
  paymentMix: { name: string; value: number; fill: string }[];
  revenueTrend: { date: string; revenue: number }[];
  today?: {
    revenue: number;
    ticket_count: number;
    avg_ticket: number;
  };
}

interface UseOverviewMetricsReturn {
  data: OverviewData | null;
  isLoading: boolean;
  error: Error | null;
  refetch: (period?: 'daily' | 'weekly' | 'monthly') => void;
}

/**
 * Hook to fetch executive dashboard overview metrics
 */
export function useOverviewMetrics(): UseOverviewMetricsReturn {
  const { isAuthenticated } = useAuth();

  const [data, setData] = useState<OverviewData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchMetrics = useCallback(async (periodParam?: 'daily' | 'weekly' | 'monthly') => {
    if (!isAuthenticated) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    // Ensure period is a valid string, default to 'daily'
    const period = periodParam || 'daily';

    try {
      // Fetch overview metrics from API
      const overview = await salesApi.getOverview({ days: 30, period: period });

      // Build KPIs from API data (all from report_metrics)
      // Dashboard Metric Mappings:
      // - Total Revenue: Total Net (from sales report)
      // - Average Ticket: Service Net / Total Ticket Count (from production report)
      // - Labor Hours: Total Hours (from production report)
      // - Total Tips: Tip Amount (from sales report)
      const kpis: KPIData[] = [
        {
          label: 'Total Revenue (MTD)',
          value: overview.summary.total_revenue || 0,
          change: overview.summary.period_change_percent || 0,
          changeLabel: 'vs last period',
          trend: (overview.summary.period_change_percent || 0) >= 0 ? 'up' : 'down',
          format: 'currency',
          icon: 'dollar-sign',
        },
        {
          label: 'Average Ticket (MTD)',
          value: overview.summary.average_ticket || 0,
          change: overview.summary.avg_ticket_change_percent || 0,
          changeLabel: 'vs last period',
          trend: (overview.summary.avg_ticket_change_percent || 0) >= 0 ? 'up' : 'down',
          format: 'currency',
          icon: 'receipt',
        },
        {
          label: 'Labor Hours (MTD)',
          value: overview.summary.total_hours || 0,
          change: 0,
          changeLabel: 'total hours',
          trend: 'neutral',
          format: 'number',
          icon: 'users',
        },
        {
          label: 'Total Tips (MTD)',
          value: overview.summary.total_tips || 0,
          change: 0,
          changeLabel: 'from Tip Amount',
          trend: 'up',
          format: 'currency',
          icon: 'dollar-sign',
        },
      ];

      // Transform revenue trend from API
      const revenueTrend = overview.revenue_trend.map((item: any) => ({
        date: item.date,
        revenue: item.revenue,
      }));

      // Transform sales by location from API
      const salesByLocation = overview.sales_by_location.map((item: any) => ({
        name: item.name,
        revenue: item.revenue,
        target: item.target,
      }));

      // Service/Product mix from API (Services Net vs Products Net from MFR)
      const serviceProductMix = overview.service_product_mix ? [
        { name: 'Services', value: overview.service_product_mix.services.percent || 0, fill: '#06b6d4' },
        { name: 'Products', value: overview.service_product_mix.products.percent || 0, fill: '#22c55e' },
      ] : [
        { name: 'Services', value: 70, fill: '#06b6d4' },
        { name: 'Products', value: 30, fill: '#22c55e' },
      ];

      // Payment mix from API (CC vs Cash from MFR)
      const paymentMix = overview.payment_mix ? [
        { name: 'Card', value: overview.payment_mix.card.percent || 0, fill: '#06b6d4' },
        { name: 'Cash', value: overview.payment_mix.cash.percent || 0, fill: '#22c55e' },
      ] : [
        { name: 'Card', value: 65, fill: '#06b6d4' },
        { name: 'Cash', value: 35, fill: '#22c55e' },
      ];

      // Transform insights from API
      const insights: InsightItem[] = (overview.insights || []).map((item: any) => ({
        id: item.id,
        type: item.type as 'positive' | 'warning' | 'info' | 'alert' | 'success',
        title: item.title,
        description: item.description,
        metric: item.metric,
        timestamp: item.timestamp,
      }));

      setData({
        kpis,
        insights,
        salesByLocation,
        serviceProductMix,
        paymentMix,
        revenueTrend,
        today: {
          revenue: overview.today.revenue,
          ticket_count: overview.today.ticket_count,
          avg_ticket: overview.today.avg_ticket,
        },
      });
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch metrics'));
      console.error('Error fetching overview metrics:', err);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchMetrics,
  };
}

/**
 * Hook to get just the insights
 */
export function useInsights(): {
  insights: InsightItem[];
  isLoading: boolean;
} {
  const [insights, setInsights] = useState<InsightItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Insights not available in current API, return empty
    setInsights([]);
    setIsLoading(false);
  }, []);

  return { insights, isLoading };
}

export default useOverviewMetrics;
