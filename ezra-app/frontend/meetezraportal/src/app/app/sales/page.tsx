'use client';

// ===========================================
// EZRA PORTAL - Ezra Sales Overview
// ===========================================

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShoppingCart,
  ArrowUpRight,
  TrendingUp,
  TrendingDown,
  MapPin,
  Calendar,
  RefreshCw,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useOverviewMetrics } from '@/hooks/useOverviewMetrics';
import { useEnhancedLocations } from '@/hooks/useLocations';
import { formatCurrency, formatPercent } from '@/lib/formatters';
import { Card } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { KPICard, KPIGrid } from '@/components/dashboard/KPICard';
import { ChartCard, RevenueLineChart, LocationBarChart } from '@/components/charts/ChartCard';
import { salesApi } from '@/lib/api';

interface QuickStats {
  active_locations: number;
  onboarding: number;
  avg_ticket_today: number;
  total_revenue_today: number;
}

interface TopPerformer {
  store_id: number;
  store_name: string;
  revenue: number;
}

export default function SalesOverviewPage() {
  const [salesPeriod, setSalesPeriod] = React.useState<'daily' | 'weekly' | 'monthly'>('daily');
  const { data, isLoading, refetch } = useOverviewMetrics();
  const { locations } = useEnhancedLocations();
  
  // State for API data
  const [quickStats, setQuickStats] = useState<QuickStats | null>(null);
  const [topPerformers, setTopPerformers] = useState<TopPerformer[]>([]);
  const [needsAttention, setNeedsAttention] = useState<TopPerformer[]>([]);

  // Fetch Quick Stats and Top Performers from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsResponse, performersResponse] = await Promise.all([
          salesApi.getQuickStats(),
          salesApi.getTopPerformers({ limit: 5 }),
        ]);
        setQuickStats(statsResponse);
        setTopPerformers(performersResponse.top_performers || []);
        setNeedsAttention(performersResponse.needs_attention || []);
      } catch (error) {
        console.error('Error fetching sales data:', error);
      }
    };
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-64 skeleton" />
        <div className="grid grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 skeleton rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-ezra-500/10 flex items-center justify-center">
            <ShoppingCart className="w-6 h-6 text-ezra-400" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-surface-900 dark:text-surface-100">
              Ezra Sales
            </h1>
            <p className="text-surface-500 dark:text-surface-400">
              Sales intelligence across all {locations.length} locations
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            size="sm"
            onClick={refetch}
            leftIcon={<RefreshCw className="w-4 h-4" />}
          >
            Refresh
          </Button>
          <Link href="/app/reports?filter=sales">
            <Button size="sm" rightIcon={<ArrowUpRight className="w-4 h-4" />}>
              Generate Report
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      {data && (
        <KPIGrid columns={4}>
          {data.kpis.slice(0, 4).map((kpi, index) => (
            <KPICard
              key={kpi.label}
              data={kpi}
              className={cn(
                'animate-fade-in-up',
                index === 1 && 'animation-delay-100',
                index === 2 && 'animation-delay-200',
                index === 3 && 'animation-delay-300'
              )}
            />
          ))}
        </KPIGrid>
      )}

      {/* Charts */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {data && (
            <ChartCard title="Revenue Trend (MTD)" subtitle="Last 30 days" height={320}>
              <RevenueLineChart data={data.revenueTrend} />
            </ChartCard>
          )}
        </div>
        <Card>
          <h3 className="text-heading-sm text-surface-900 dark:text-surface-100 mb-4">
            Quick Stats
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-surface-100 dark:border-surface-800">
              <span className="text-surface-500">Active Locations</span>
              <span className="font-semibold text-surface-900 dark:text-surface-100">
                {quickStats?.active_locations || 0}
              </span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-surface-100 dark:border-surface-800">
              <span className="text-surface-500">Avg Ticket (Yesterday)</span>
              <span className="font-semibold text-surface-900 dark:text-surface-100">
                {formatCurrency(quickStats?.avg_ticket_today || 0)}
              </span>
            </div>
            <div className="flex items-center justify-between py-3">
              <span className="text-surface-500">Total Revenue (Yesterday)</span>
              <span className="font-semibold text-surface-900 dark:text-surface-100">
                {formatCurrency(quickStats?.total_revenue_today || 0)}
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* Location Rankings */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top Performers */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-heading-sm text-surface-900 dark:text-surface-100 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-success-500" />
              Top Performers
            </h3>
            <span className="text-sm text-surface-500">Yesterday's revenue</span>
          </div>
          <div className="space-y-3">
            {topPerformers.map((performer, index) => (
              <Link
                key={performer.store_id}
                href={`/app/locations/${performer.store_id}`}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      'w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold',
                      index === 0
                        ? 'bg-amber-500/10 text-amber-500'
                        : 'bg-surface-100 dark:bg-surface-800 text-surface-500'
                    )}
                  >
                    {index + 1}
                  </span>
                  <div>
                    <p className="font-medium text-surface-900 dark:text-surface-100">
                      {performer.store_name}
                    </p>
                  </div>
                </div>
                <span className="font-semibold text-success-500">
                  {formatCurrency(performer.revenue)}
                </span>
              </Link>
            ))}
            {topPerformers.length === 0 && (
              <p className="text-surface-500 text-center py-4">No data available</p>
            )}
          </div>
        </Card>

        {/* Needs Attention */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-heading-sm text-surface-900 dark:text-surface-100 flex items-center gap-2">
              <TrendingDown className="w-5 h-5 text-warning-500" />
              Needs Attention
            </h3>
            <span className="text-sm text-surface-500">Lowest revenue yesterday</span>
          </div>
          <div className="space-y-3">
            {needsAttention.map((performer, index) => (
              <Link
                key={performer.store_id}
                href={`/app/locations/${performer.store_id}`}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-surface-100 dark:bg-surface-800 flex items-center justify-center text-xs font-bold text-surface-500">
                    {(quickStats?.active_locations || 0) - needsAttention.length + index + 1}
                  </span>
                  <div>
                    <p className="font-medium text-surface-900 dark:text-surface-100">
                      {performer.store_name}
                    </p>
                  </div>
                </div>
                <span className="font-semibold text-warning-500">
                  {formatCurrency(performer.revenue)}
                </span>
              </Link>
            ))}
            {needsAttention.length === 0 && (
              <p className="text-surface-500 text-center py-4">No data available</p>
            )}
          </div>
        </Card>
      </div>

      {/* Sales by Location Chart */}
      {data && (
        <ChartCard
          title="Sales by Location"
          subtitle="Revenue comparison across all locations"
          height={400}
          action={
            <div className="flex gap-1 bg-surface-100 dark:bg-surface-800 p-1 rounded-lg">
              <button
                onClick={() => {
                  setSalesPeriod('daily');
                  refetch('daily');
                }}
                className={cn(
                  'px-3 py-1 text-sm rounded transition-colors',
                  salesPeriod === 'daily'
                    ? 'bg-surface-900 dark:bg-surface-700 text-white'
                    : 'text-surface-600 hover:text-surface-900 dark:text-surface-400'
                )}
              >
                Daily
              </button>
              <button
                onClick={() => {
                  setSalesPeriod('weekly');
                  refetch('weekly');
                }}
                className={cn(
                  'px-3 py-1 text-sm rounded transition-colors',
                  salesPeriod === 'weekly'
                    ? 'bg-surface-900 dark:bg-surface-700 text-white'
                    : 'text-surface-600 hover:text-surface-900 dark:text-surface-400'
                )}
              >
                Weekly
              </button>
              <button
                onClick={() => {
                  setSalesPeriod('monthly');
                  refetch('monthly');
                }}
                className={cn(
                  'px-3 py-1 text-sm rounded transition-colors',
                  salesPeriod === 'monthly'
                    ? 'bg-surface-900 dark:bg-surface-700 text-white'
                    : 'text-surface-600 hover:text-surface-900 dark:text-surface-400'
                )}
              >
                Monthly
              </button>
            </div>
          }
        >
          <LocationBarChart data={data.salesByLocation} />
        </ChartCard>
      )}

      {/* View All Locations CTA */}
      <Card className="bg-gradient-to-r from-ezra-500/10 to-purple-500/10 border-ezra-500/20">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-100">
              Want detailed breakdowns?
            </h3>
            <p className="text-surface-500 dark:text-surface-400 mt-1">
              View individual location dashboards for daily trends, service mix, and more.
            </p>
          </div>
          <Link href="/app/locations">
            <Button rightIcon={<MapPin className="w-4 h-4" />}>
              View All Locations
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
