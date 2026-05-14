'use client';

/**
 * Hook for managing locations organized by state with status management
 */

import { useState, useEffect, useCallback } from 'react';
import { statesApi, locationsApi } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

export type LocationStatus = 'active' | 'inactive' | 'onboarding' | 'pending' | 'suspended' | 'closed';

export interface StateSummary {
  state: string;
  state_region: string | null;
  total_locations: number;
  active_locations: number;
  inactive_locations: number;
  onboarding_locations: number;
  pending_locations: number;
  suspended_locations: number;
  closed_locations: number;
  last_synced_at: string | null;
}

export interface StateLocation {
  id: string;
  location_code: string;
  location_name: string;
  city: string;
  state: string;
  state_region: string | null;
  status: LocationStatus;
  status_changed_at: string;
  last_synced_at: string | null;
  created_at: string;
  onboarding_started_at?: string | null;
  onboarding_completed_at?: string | null;
}

export interface UseStatesDataReturn {
  statesSummary: StateSummary[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

export interface UseStateLocationsReturn {
  locations: StateLocation[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
  updateStatus: (locationId: string, status: LocationStatus) => Promise<void>;
}

/**
 * Hook to fetch state-level summaries with location counts by status
 */
export function useStatesData(state?: string): UseStatesDataReturn {
  const { isAuthenticated } = useAuth();
  const [statesSummary, setStatesSummary] = useState<StateSummary[]>([]);
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
      const data = await statesApi.getSummary(state);
      setStatesSummary(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch states summary'));
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, state]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    statesSummary,
    isLoading,
    error,
    refetch: fetchData,
  };
}

/**
 * Hook to fetch locations for a specific state, optionally filtered by status
 */
export function useStateLocations(
  state: string,
  status?: LocationStatus
): UseStateLocationsReturn {
  const { isAuthenticated } = useAuth();
  const [locations, setLocations] = useState<StateLocation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    if (!isAuthenticated || !state) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await locationsApi.getStateLocations(state, status);
      setLocations(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch state locations'));
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, state, status]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const updateStatus = useCallback(async (locationId: string, newStatus: LocationStatus) => {
    try {
      await locationsApi.updateStatus(locationId, newStatus);
      await fetchData(); // Refresh list
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update location status'));
      throw err;
    }
  }, [fetchData]);

  return {
    locations,
    isLoading,
    error,
    refetch: fetchData,
    updateStatus,
  };
}
