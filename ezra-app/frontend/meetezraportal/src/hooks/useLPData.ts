'use client';

// ===========================================
// EZRA PORTAL - LP (Loss Prevention) Hook
// ===========================================

import { useState, useEffect, useCallback } from 'react';
import { lpApi } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

interface LPOverview {
  active_alerts: {
    count: number;
    change: number;
    change_label: string;
  };
  high_risk_locations: {
    count: number;
    change: number;
    change_label: string;
  };
  avg_risk_score: {
    score: number;
    change: number;
    change_label: string;
  };
  resolved_this_week: {
    count: number;
    change: number;
    change_label: string;
  };
  risk_distribution: {
    low: number;
    medium: number;
    high: number;
    total: number;
  };
}

interface LPAlert {
  id: string;
  store_id: string;
  type: 'high' | 'medium' | 'low';
  alert_type: 'cash_ratio' | 'tip_percent' | 'low_ticket';
  status: 'new' | 'investigating' | 'resolved' | 'dismissed';
  title: string;
  description: string;
  calculated_value: number;
  severity_score: number | null;
  detected_at: string;
  resolved_at: string | null;
  location: string;
  store_code: string;
  store_name: string;
  metadata: Record<string, unknown>;
}

interface UseLPDataParams {
  startDate?: string;      // Weekly start for overview/KPIs
  endDate?: string;        // Weekly end for overview/KPIs
  alertStartDate?: string; // Daily date for alerts list
  alertEndDate?: string;   // Daily date for alerts list
}

interface UseLPDataReturn {
  overview: LPOverview | null;
  alerts: LPAlert[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

/**
 * Hook to fetch LP dashboard data with optional date filtering
 */
export function useLPData(params?: UseLPDataParams): UseLPDataReturn {
  const { isAuthenticated } = useAuth();
  const [overview, setOverview] = useState<LPOverview | null>(null);
  const [alerts, setAlerts] = useState<LPAlert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    if (!isAuthenticated) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Build params with date filtering
      // Overview uses weekly date range for KPIs
      const overviewParams = {
        start_date: params?.startDate,
        end_date: params?.endDate,
      };
      // Alerts use daily date (or fall back to weekly dates)
      const alertParams = {
        start_date: params?.alertStartDate || params?.startDate,
        end_date: params?.alertEndDate || params?.endDate,
      };
      
      // Fetch overview and alerts in parallel with respective date filters
      const [overviewData, alertsData] = await Promise.all([
        lpApi.getOverview(overviewParams),
        lpApi.getAlerts({ limit: 50, ...alertParams }),
      ]);

      setOverview(overviewData);
      setAlerts(alertsData?.alerts || []);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch LP data'));
      console.error('Error fetching LP data:', err);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, params?.startDate, params?.endDate, params?.alertStartDate, params?.alertEndDate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    overview,
    alerts,
    isLoading,
    error,
    refetch: fetchData,
  };
}

export default useLPData;
