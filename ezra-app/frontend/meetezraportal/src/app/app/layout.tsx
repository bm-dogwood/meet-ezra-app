'use client';

// ===========================================
// EZRA PORTAL - App Layout
// ===========================================

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { BreadcrumbProvider } from '@/context/BreadcrumbContext';
import Sidebar from '@/components/layout/Sidebar';
import TopBar from '@/components/layout/TopBar';

// Demo email that triggers the demo banner (partner preview)
const DEMO_BANNER_EMAIL = 'rob@breezemarketing.ca';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();

  // Check if this is a demo account (only rob@breezemarketing.ca sees demo banner)
  const isDemoAccount = user?.email?.toLowerCase() === DEMO_BANNER_EMAIL.toLowerCase();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-950">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-ezra-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-surface-400 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  return (
    <BreadcrumbProvider>
    <div className="min-h-screen bg-surface-100 dark:bg-surface-950">
      {/* Demo Banner - only shown for demo accounts */}
      {isDemoAccount && (
        <div className="fixed top-0 left-0 right-0 z-[100] bg-gradient-to-r from-ezra-600 to-ezra-500 text-white text-center py-2 px-4">
          <p className="text-sm font-medium">
            🚀 This is a demo account of Ezra — Experience the future of franchise intelligence
          </p>
        </div>
      )}

      {/* Sidebar */}
      <Sidebar isDemoMode={isDemoAccount} />

      {/* Main content area */}
      <div className={`lg:pl-[260px] min-h-screen flex flex-col transition-all duration-300 ${isDemoAccount ? 'pt-10' : ''}`}>
        {/* Top bar */}
        <TopBar />

        {/* Page content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
    </BreadcrumbProvider>
  );
}
