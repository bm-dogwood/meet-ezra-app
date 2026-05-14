'use client';

// ===========================================
// EZRA PORTAL - App Configuration Hook
// ===========================================

import { useState, useEffect } from 'react';
import { appConfigApi } from '@/lib/api';

interface AppConfigValue {
  active?: number;
  [key: string]: any;
}

interface UseAppConfigResult {
  value: AppConfigValue | null;
  isLoading: boolean;
  error: string | null;
}

/**
 * Hook to fetch an application configuration by name.
 * Used for feature flags like ezra_exponential.
 */
export function useAppConfig(name: string): UseAppConfigResult {
  const [value, setValue] = useState<AppConfigValue | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchConfig() {
      try {
        setIsLoading(true);
        setError(null);
        const response = await appConfigApi.get(name);
        if (!cancelled) {
          // The API may return the value as a JSON string or object
          const raw = (response as any)?.value ?? response;
          const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
          setValue(parsed);
        }
      } catch (err: any) {
        if (!cancelled) {
          setError(err?.message || 'Failed to fetch config');
          // Default to inactive on error so the feature stays gated
          setValue({ active: 0 });
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    fetchConfig();
    return () => { cancelled = true; };
  }, [name]);

  return { value, isLoading, error };
}
