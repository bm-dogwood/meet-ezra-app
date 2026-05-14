'use client';

/**
 * Hook for managing locations with org_id, city, and state filtering
 */

import { useState, useEffect, useCallback } from 'react';
import { locationsApi, salesApi } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

export interface Location {
  id: string;
  org_id: string;
  location_code: string;
  location_name: string;
  city: string;
  state: string;
  address?: string;
  postal_code?: string;
  country: string;
  status: string;
  phone?: string;
  email?: string;
  last_synced_at?: string;
  created_at: string;
  updated_at: string;
}

export interface LocationFilters {
  city?: string;
  state?: string;
  status?: string;
}

export interface UseLocationsReturn {
  locations: Location[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
  filters: LocationFilters;
  setFilters: (filters: LocationFilters) => void;
  cities: string[];
  states: string[];
  cityStateCombinations: Array<{ city: string; state: string }>;
}

export function useLocations(filters: LocationFilters = {}): UseLocationsReturn {
  const { isAuthenticated } = useAuth();
  const [locations, setLocations] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [currentFilters, setCurrentFilters] = useState<LocationFilters>(filters);
  const [cities, setCities] = useState<string[]>([]);
  const [states, setStates] = useState<string[]>([]);
  const [cityStateCombinations, setCityStateCombinations] = useState<Array<{ city: string; state: string }>>([]);

  const fetchLocations = useCallback(async () => {
    if (!isAuthenticated) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await locationsApi.list({
        ...currentFilters,
        limit: 1000,
      });
      setLocations(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch locations'));
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, currentFilters]);

  const fetchFilterOptions = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      const [citiesData, statesData, combinationsData] = await Promise.all([
        locationsApi.getCities(),
        locationsApi.getStates(),
        locationsApi.getCityStateCombinations(),
      ]);
      setCities(citiesData.map((c: any) => c.city));
      setStates(statesData.map((s: any) => s.state));
      setCityStateCombinations(combinationsData);
    } catch (err) {
      console.error('Failed to fetch filter options:', err);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchLocations();
    fetchFilterOptions();
  }, [fetchLocations, fetchFilterOptions]);

  return {
    locations,
    isLoading,
    error,
    refetch: fetchLocations,
    filters: currentFilters,
    setFilters: setCurrentFilters,
    cities,
    states,
    cityStateCombinations,
  };
}

export interface DailySalesPerformance {
  id: string;
  org_id: string;
  location_id: string;
  date: string;
  total_revenue: number;
  services_revenue: number;
  products_revenue: number;
  total_tips: number;
  ticket_count: number;
  average_ticket: number;
  card_revenue: number;
  cash_revenue: number;
  other_revenue: number;
  revenue_goal?: number;
  revenue_vs_goal_percent?: number;
  location_name?: string;
  city?: string;
  state?: string;
}

export interface LocationSummary {
  total_revenue: number;
  services_revenue: number;
  products_revenue: number;
  total_tips: number;
  ticket_count: number;
  average_ticket: number;
  card_revenue: number;
  cash_revenue: number;
}

export interface UseLocationSalesReturn {
  dailyData: DailySalesPerformance[];
  summary: LocationSummary | null;
  dailyBreakdown: Array<{
    date: string;
    revenue: number;
    services: number;
    products: number;
    tickets: number;
    avg_ticket: number;
    vs_goal_percent?: number;
  }>;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

export function useLocationSales(
  locationId: string | null,
  startDate: string,
  endDate: string
): UseLocationSalesReturn {
  const { isAuthenticated } = useAuth();
  const [dailyData, setDailyData] = useState<DailySalesPerformance[]>([]);
  const [summary, setSummary] = useState<LocationSummary | null>(null);
  const [dailyBreakdown, setDailyBreakdown] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    if (!isAuthenticated || !locationId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const [data, summaryData, breakdownData] = await Promise.all([
        salesApi.dailyPerformance.list({
          location_id: locationId,
          start_date: startDate,
          end_date: endDate,
        }),
        salesApi.dailyPerformance.getSummary(locationId, {
          start_date: startDate,
          end_date: endDate,
        }),
        salesApi.dailyPerformance.getDailyBreakdown(locationId, startDate, endDate),
      ]);

      setDailyData(data);
      setSummary(summaryData);
      setDailyBreakdown(breakdownData);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch sales data'));
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, locationId, startDate, endDate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    dailyData,
    summary,
    dailyBreakdown,
    isLoading,
    error,
    refetch: fetchData,
  };
}
