'use client';

// ===========================================
// EZRA PORTAL - Executive Dashboard
// ===========================================

import React from 'react';
import Link from 'next/link';
import {
  ArrowUpRight,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useOverviewMetrics } from '@/hooks/useOverviewMetrics';
import { KPICard, KPIGrid } from '@/components/dashboard/KPICard';
import {
  ChartCard,
  RevenueLineChart,
  LocationBarChart,
  DonutChart,
} from '@/components/charts/ChartCard';
import { Card } from '@/components/ui/Card';
import Button from '@/components/ui/Button';

// ============ Quick Actions ============
const QuickActions = () => {
  const actions = [
    { label: 'View All Locations', href: '/app/locations' },
    { label: 'Generate Report', href: '/app/reports' },
    { label: 'LP Alerts', href: '/app/lp' },
    { label: 'Settings', href: '/app/settings' },
  ];

  return (
    <Card padding="sm">
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-surface-500 dark:text-surface-400">
          Quick actions:
        </span>
        <div className="flex gap-2">
          {actions.map((action) => (
            <Link key={action.href} href={action.href}>
              <Button variant="ghost" size="sm">
                {action.label}
              </Button>
            </Link>
          ))}
        </div>
      </div>
    </Card>
  );
};

// ============ Main Dashboard Page ============
export default function DashboardPage() {
  const [salesPeriod, setSalesPeriod] = React.useState<'daily' | 'weekly' | 'monthly'>('daily');
  const { data, isLoading, error, refetch } = useOverviewMetrics();

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Loading skeleton */}
        <div className="flex items-center justify-between">
          <div>
            <div className="h-8 w-48 skeleton mb-2" />
            <div className="h-4 w-64 skeleton" />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-32 skeleton rounded-xl" />
          ))}
        </div>
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-80 skeleton rounded-xl" />
          <div className="h-80 skeleton rounded-xl" />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <AlertTriangle className="w-12 h-12 text-warning-500 mb-4" />
        <h2 className="text-xl font-semibold text-surface-900 dark:text-surface-100 mb-2">
          Failed to load dashboard
        </h2>
        <p className="text-surface-500 mb-6">{error?.message || 'An error occurred'}</p>
        <Button onClick={refetch} leftIcon={<RefreshCw className="w-4 h-4" />}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-surface-900 dark:text-surface-100">
            Executive Dashboard
          </h1>
          <p className="text-surface-500 dark:text-surface-400 mt-1">
            Overview of your franchise performance across all locations
          </p>
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
          <Button size="sm">
            Export Report
          </Button>
        </div>
      </div>

      {/* Quick actions */}
      <QuickActions />

      {/* KPI Cards */}
      <KPIGrid columns={5}>
        {data.kpis.map((kpi, index) => (
          <KPICard
            key={kpi.label}
            data={kpi}
            className={cn(
              'animate-fade-in-up',
              index === 1 && 'animation-delay-100',
              index === 2 && 'animation-delay-200',
              index === 3 && 'animation-delay-300',
              index === 4 && 'animation-delay-400'
            )}
          />
        ))}
      </KPIGrid>

      {/* Revenue Trend - Full Width */}
      <ChartCard
        title="Revenue Trend (MTD)"
        subtitle="Last 30 days"
        height={320}
      >
        <RevenueLineChart data={data.revenueTrend} />
      </ChartCard>

      {/* Charts Row - Sales by Location and Metrics */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ChartCard
            title="Sales by Location"
            subtitle="Top 10 locations by revenue"
            height={512}
            className="h-full"
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
        </div>
        <div className="flex flex-col gap-6">
          <ChartCard title="Revenue Mix" subtitle="Services vs Products" height={200} className="flex-1">
            <DonutChart data={data.serviceProductMix} showLegend />
          </ChartCard>
          <ChartCard title="Payment Methods" subtitle="Card vs Cash" height={200} className="flex-1">
            <DonutChart data={data.paymentMix} showLegend />
          </ChartCard>
        </div>
      </div>

      {/* Bottom CTA */}
      <Card className="bg-gradient-to-r from-ezra-500/10 to-purple-500/10 border-ezra-500/20">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-100">
              Want deeper insights?
            </h3>
            <p className="text-surface-500 dark:text-surface-400 mt-1">
              Explore individual location dashboards for detailed breakdowns and trends.
            </p>
          </div>
          <Link href="/app/locations">
            <Button rightIcon={<ArrowUpRight className="w-4 h-4" />}>
              View All Locations
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
