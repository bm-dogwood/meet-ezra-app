'use client';

// ===========================================
// EZRA PORTAL - Locations Hook
// ===========================================

import { useState, useEffect, useCallback, useMemo } from 'react';
import type { Location, LocationFilters, PaginatedResponse } from '@/types';
import { locationsApi, storesApi, storeMetricsApi } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { sleep, debounce } from '@/lib/utils';

interface UseLocationsOptions {
  initialFilters?: LocationFilters;
  pageSize?: number;
  includeAll?: boolean; // When true, fetches all stores including inactive
}

interface UseLocationsReturn {
  locations: Location[];
  total: number;
  page: number;
  totalPages: number;
  isLoading: boolean;
  error: Error | null;
  filters: LocationFilters;
  setFilters: (filters: LocationFilters) => void;
  setPage: (page: number) => void;
  refetch: () => void;
}

/**
 * Hook to fetch and manage locations list with filtering and pagination
 */
export function useLocations(options: UseLocationsOptions = {}): UseLocationsReturn {
  const { pageSize = 10, initialFilters = {}, includeAll = false } = options;
  const { isAuthenticated } = useAuth();

  const [locations, setLocations] = useState<Location[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [filters, setFilters] = useState<LocationFilters>(initialFilters);

  const fetchLocations = useCallback(async () => {
    if (!isAuthenticated) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Fetch stores and metrics in parallel
      const [storesResult, metricsResult] = await Promise.all([
        storesApi.list({
          state: filters.state,
          status: filters.status,
          city: filters.city,
          skip: (page - 1) * pageSize,
          limit: pageSize,
          include_all: includeAll,
        }),
        storeMetricsApi.getAll().catch((err) => {
          // Let auth errors propagate (they trigger redirect via emitAuthError)
          if (err?.message?.includes('Session expired')) throw err;
          return { stores: [] };
        }),
      ]);

      // Create a map of store metrics by store_id for quick lookup
      const metricsMap = new Map<number, any>();
      if (metricsResult?.stores) {
        metricsResult.stores.forEach((m: any) => {
          metricsMap.set(m.store_id, m);
        });
      }

      // Transform stores to Location format for compatibility
      // Merge with metrics data for todayRevenue, avgTicket
      const transformedLocations: any[] = (storesResult as any[]).map((store: any) => {
        const metrics = metricsMap.get(store.id);
        return {
          id: store.id,
          name: store.name || store.store_name,
          storeCode: store.external_code || store.store_code,
          city: store.city || '',
          state: store.state || '',
          status: store.is_active ? 'active' : 'inactive',
          lastSyncAt: store.last_synced_at || null,
          lpRiskScore: 0,
          todayRevenue: metrics?.today_revenue || 0,
          avgTicket: metrics?.avg_ticket || 0,
          changePercent: metrics?.change_percent || 0,
        };
      });

      setLocations(transformedLocations);
      setTotal(transformedLocations.length);
      setTotalPages(Math.ceil(transformedLocations.length / pageSize));
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch locations'));
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, filters, page, pageSize, includeAll]);

  useEffect(() => {
    fetchLocations();
  }, [fetchLocations]);

  // Reset page when filters change
  const handleSetFilters = useCallback((newFilters: LocationFilters) => {
    setFilters(newFilters);
    setPage(1);
  }, []);

  return {
    locations,
    total,
    page,
    totalPages,
    isLoading,
    error,
    filters,
    setFilters: handleSetFilters,
    setPage,
    refetch: fetchLocations,
  };
}

/**
 * Hook to get a single store by ID (used as location in UI)
 */
export function useLocation(storeId: string): {
  location: Location | null;
  isLoading: boolean;
  error: Error | null;
} {
  const { isAuthenticated } = useAuth();
  const [location, setLocation] = useState<Location | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetch = async () => {
      if (!storeId || !isAuthenticated) {
        setLocation(null);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const store = await storesApi.get(storeId);
        
        // Transform store to Location format
        const transformedLocation: Location = {
          id: store.id,
          name: store.store_name,
          storeCode: store.store_code,
          city: store.city || '',
          state: store.state || '',
          status: store.status,
          lastSyncAt: store.last_synced_at,
          lpRiskScore: undefined,
        };

        setLocation(transformedLocation);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch location'));
        setLocation(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetch();
  }, [storeId, isAuthenticated]);

  return { location, isLoading, error };
}

/**
 * Hook to get location filter options
 */
export function useLocationFilters(): {
  states: string[];
  stateCounts: { state: string; count: number }[];
  isLoading: boolean;
} {
  const { isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [states, setStates] = useState<string[]>([]);
  const [stateCounts, setStateCounts] = useState<{ state: string; count: number }[]>([]);

  useEffect(() => {
    const fetch = async () => {
      if (!isAuthenticated) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const statesData = await locationsApi.getStates();
        const statesList = (statesData as any)?.states || [];
        setStates(statesList);

        // Set state counts based on states list (placeholder - API doesn't provide counts yet)
        setStateCounts(
          statesList.map((state: string) => ({
            state: state,
            count: 0,
          }))
        );
      } catch (err) {
        console.error('Failed to fetch filter options:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetch();
  }, [isAuthenticated]);

  return { states, stateCounts, isLoading };
}

/**
 * Hook to get enhanced location data with today's metrics
 */
export function useEnhancedLocations(options?: { includeAll?: boolean }): {
  locations: (Location & { todayRevenue: number; avgTicket: number })[];
  isLoading: boolean;
} {
  const { locations, isLoading } = useLocations({ pageSize: 100, includeAll: options?.includeAll });

  const enhanced = useMemo(() => {
    // Locations already include todayRevenue and avgTicket from the API response
    // The useLocations hook maps these from store.today_revenue and store.today_avg_ticket
    return locations.map((loc: any) => ({
      ...loc,
      todayRevenue: Number(loc.todayRevenue) || 0,
      avgTicket: Number(loc.avgTicket) || 0,
    }));
  }, [locations]);

  return { locations: enhanced, isLoading };
}

/**
 * Hook for debounced search
 */
export function useLocationSearch(delay = 300): {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  debouncedTerm: string;
} {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedTerm, setDebouncedTerm] = useState('');

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedTerm(searchTerm);
    }, delay);

    return () => clearTimeout(handler);
  }, [searchTerm, delay]);

  return { searchTerm, setSearchTerm, debouncedTerm };
}

export default useLocations;
