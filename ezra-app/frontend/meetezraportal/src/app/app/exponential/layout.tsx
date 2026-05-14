'use client';

// ===========================================
// EZRA PORTAL - Exponential Feature Gate Layout
// ===========================================
// Uses the ezra_exponential app config to gate access.
// When active=0, shows the original Coming Soon page.
// When active=1, renders the full Exponential UI.

import React from 'react';
import { useAppConfig } from '@/hooks/useAppConfig';
import ExponentialComingSoon from './ExponentialComingSoon';

export default function ExponentialLayout({ children }: { children: React.ReactNode }) {
  const { value, isLoading } = useAppConfig('ezra_exponential');

  // Show loading skeleton while fetching config
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-64 skeleton" />
        <div className="grid grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 skeleton rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  // Feature is inactive — show the original Coming Soon page
  if (!value?.active || value.active === 0) {
    return <ExponentialComingSoon />;
  }

  // Feature is active — render the full UI
  return <>{children}</>;
}
