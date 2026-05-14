'use client';

/**
 * Example hook showing how to use the DSR API endpoints
 * This can be used as a template for other hooks
 */

import { useState, useEffect, useCallback } from 'react';
import { dsrApi } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

interface UseDSRDataReturn {
  data: any[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
  create: (data: any) => Promise<void>;
  update: (id: number, data: any) => Promise<void>;
  remove: (id: number) => Promise<void>;
}

/**
 * Hook to fetch and manage DSR Regular TL data
 */
export function useDSRRegularTL(): UseDSRDataReturn {
  const { isAuthenticated } = useAuth();
  const [data, setData] = useState<any[]>([]);
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
      const result = await dsrApi.regular.tl.list({ skip: 0, limit: 100 });
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch DSR data'));
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const create = useCallback(async (newData: any) => {
    try {
      await dsrApi.regular.tl.create(newData);
      await fetchData(); // Refresh list
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to create DSR data'));
      throw err;
    }
  }, [fetchData]);

  const update = useCallback(async (id: number, updatedData: any) => {
    try {
      await dsrApi.regular.tl.update(id, updatedData);
      await fetchData(); // Refresh list
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update DSR data'));
      throw err;
    }
  }, [fetchData]);

  const remove = useCallback(async (id: number) => {
    try {
      await dsrApi.regular.tl.delete(id);
      await fetchData(); // Refresh list
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to delete DSR data'));
      throw err;
    }
  }, [fetchData]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchData,
    create,
    update,
    remove,
  };
}

/**
 * Hook to fetch and manage DSR Regular Input data
 */
export function useDSRRegularInput(): UseDSRDataReturn {
  const { isAuthenticated } = useAuth();
  const [data, setData] = useState<any[]>([]);
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
      const result = await dsrApi.regular.input.list({ skip: 0, limit: 100 });
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch DSR input data'));
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const create = useCallback(async (newData: any) => {
    try {
      await dsrApi.regular.input.create(newData);
      await fetchData();
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to create DSR input data'));
      throw err;
    }
  }, [fetchData]);

  const update = useCallback(async (id: number, updatedData: any) => {
    try {
      await dsrApi.regular.input.update(id, updatedData);
      await fetchData();
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update DSR input data'));
      throw err;
    }
  }, [fetchData]);

  const remove = useCallback(async (id: number) => {
    try {
      await dsrApi.regular.input.delete(id);
      await fetchData();
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to delete DSR input data'));
      throw err;
    }
  }, [fetchData]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchData,
    create,
    update,
    remove,
  };
}

// Similar hooks can be created for:
// - useDSRCaliTL()
// - useDSRCaliInput()
// - useDSRNVAZTL()
// - useDSRNVAZInput()
// - useDHRRegularTracker()
// - useDHRRegularInput()
// - useDHRCaliTracker()
// - useDHRCaliInput()
// - useDHRNVAZTracker()
// - useDHRNVAZInput()
