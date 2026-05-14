'use client';

/**
 * Hook for fetching comprehensive sales report data for a business location
 * This hook provides all data points needed for the sales dashboard
 */

import { useState, useEffect, useCallback } from 'react';
import { salesApi } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

export interface SalesReportStore {
  id: string;
  name: string;
  code: string;
  status: string;
  last_synced_at: string | null;
}

export interface SalesReportLocation {
  id: string;
  name: string;
  city: string;
  state: string;
  state_region: string | null;
}

export interface SalesReportSummary {
  total_revenue: number;
  services_revenue: number;
  products_revenue: number;
  total_tips: number;
  ticket_count: number;
  average_ticket: number;
  revenue_vs_goal_percent: number | null;
  vs_last_period: {
    total_revenue?: number | null;
    average_ticket?: number | null;
    ticket_count?: number | null;
    total_tips?: number | null;
  };
}

export interface DailyBreakdownItem {
  date: string;
  revenue: number;
  services: number;
  products: number;
  tickets: number;
  avg_ticket: number;
  vs_goal_percent: number | null;
}

export interface RevenueOverTimeItem {
  date: string;
  revenue: number;
}

export interface PaymentMix {
  card: {
    revenue: number;
    percentage: number;
  };
  cash: {
    revenue: number;
    percentage: number;
  };
  other: {
    revenue: number;
    percentage: number;
  };
}

export interface SalesReport {
  store: SalesReportStore;
  location: SalesReportLocation;
  date_range: {
    start_date: string;
    end_date: string;
    days: number;
  };
  summary: SalesReportSummary;
  daily_breakdown: DailyBreakdownItem[];
  revenue_over_time: RevenueOverTimeItem[];
  payment_mix: PaymentMix;
  goals: {
    revenue_goal?: number;
    ticket_count_goal?: number;
    average_ticket_goal?: number;
  } | null;
}

export interface UseSalesReportReturn {
  report: SalesReport | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

/**
 * Hook to fetch comprehensive sales report for a store
 * 
 * @param storeId - The store ID
 * @param startDate - Start date in YYYY-MM-DD format
 * @param endDate - End date in YYYY-MM-DD format
 */
export function useSalesReport(
  storeId: string | null,
  startDate: string,
  endDate: string
): UseSalesReportReturn {
  const { isAuthenticated } = useAuth();
  const [report, setReport] = useState<SalesReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchReport = useCallback(async () => {
    if (!isAuthenticated || !storeId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await salesApi.getSalesReport(storeId, startDate, endDate);
      setReport(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch sales report'));
      setReport(null);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, storeId, startDate, endDate]);

  useEffect(() => {
    fetchReport();
  }, [fetchReport]);

  return {
    report,
    isLoading,
    error,
    refetch: fetchReport,
  };
}
