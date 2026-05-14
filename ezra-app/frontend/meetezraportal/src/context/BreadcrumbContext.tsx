'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';

interface BreadcrumbOverrides {
  [segment: string]: string; // URL segment → display label
}

interface BreadcrumbContextType {
  overrides: BreadcrumbOverrides;
  setOverride: (segment: string, label: string) => void;
  clearOverrides: () => void;
}

const BreadcrumbContext = createContext<BreadcrumbContextType>({
  overrides: {},
  setOverride: () => {},
  clearOverrides: () => {},
});

export function BreadcrumbProvider({ children }: { children: React.ReactNode }) {
  const [overrides, setOverrides] = useState<BreadcrumbOverrides>({});

  const setOverride = useCallback((segment: string, label: string) => {
    setOverrides((prev) => ({ ...prev, [segment]: label }));
  }, []);

  const clearOverrides = useCallback(() => {
    setOverrides({});
  }, []);

  return (
    <BreadcrumbContext.Provider value={{ overrides, setOverride, clearOverrides }}>
      {children}
    </BreadcrumbContext.Provider>
  );
}

export function useBreadcrumb() {
  return useContext(BreadcrumbContext);
}
