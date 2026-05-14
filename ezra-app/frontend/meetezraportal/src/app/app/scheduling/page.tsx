'use client';

// ===========================================
// EZRA PORTAL - Ezra Scheduling Overview
// Copied from meetezraportal with SRPH → TSTH changes
// ===========================================

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Calendar,
  Clock,
  DollarSign,
  Users,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  ArrowUpRight,
  Search,
  ChevronDown,
  Timer,
  Zap,
  Info,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSchedulingOverview } from '@/hooks/useSchedulingData';
import { formatCurrency, formatPercent, formatNumber, formatRelativeTime, formatDate } from '@/lib/formatters';
import { Card } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { KPIGrid } from '@/components/dashboard/KPICard';
import { ChartCard, RevenueLineChart } from '@/components/charts/ChartCard';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { SchedulingLocationSummary, KPIData } from '@/types';

// ============ Custom Idle Bar Chart ============

interface IdleBarChartProps {
  data: Array<{ name: string; idlePercent: number }>;
}

const IdleBarChart: React.FC<IdleBarChartProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} layout="vertical" margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#27272a" />
        <XAxis type="number" tickFormatter={(v) => `${v}%`} axisLine={false} tickLine={false} tick={{ fill: '#71717a', fontSize: 12 }} domain={[0, 'auto']} />
        <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#a1a1aa', fontSize: 11 }} width={160} interval={0} />
        <Tooltip
          formatter={(value: number) => [`${value.toFixed(1)}%`, 'Idle %']}
          contentStyle={{ backgroundColor: '#18181b', border: 'none', borderRadius: '8px', padding: '8px 12px' }}
          itemStyle={{ color: '#fff' }}
          labelStyle={{ color: '#a1a1aa' }}
        />
        <Bar dataKey="idlePercent" fill="#f59e0b" radius={[0, 4, 4, 0]} barSize={20} />
      </BarChart>
    </ResponsiveContainer>
  );
};

// ============ Location Table Row ============

interface LocationRowProps {
  location: SchedulingLocationSummary;
  rank: number;
}

const LocationRow: React.FC<LocationRowProps> = ({ location, rank }) => {
  const idleColor = location.idlePercent >= 20
    ? 'text-danger-500'
    : location.idlePercent >= 10
      ? 'text-warning-500'
      : 'text-success-500';

  return (
    <Link
      href={`/app/scheduling/${location.locationId}`}
      className="grid grid-cols-11 gap-4 px-4 py-3 hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-colors border-b border-surface-100 dark:border-surface-800 last:border-0"
    >
      <div className="col-span-3 flex items-center gap-3">
        <span className={cn(
          'w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold',
          rank <= 3 ? 'bg-warning-500/10 text-warning-500' : 'bg-surface-100 dark:bg-surface-800 text-surface-500'
        )}>
          {rank}
        </span>
        <div className="min-w-0">
          <p className="font-medium text-surface-900 dark:text-surface-100 truncate">{location.locationName}</p>
          <p className="text-xs text-surface-500">{location.storeCode} · {location.state}</p>
        </div>
      </div>
      <div className="col-span-1 flex items-center justify-end text-surface-900 dark:text-surface-100">
        {formatCurrency(location.revenue, { compact: true })}
      </div>
      <div className="col-span-1 flex items-center justify-end text-surface-600 dark:text-surface-400">
        {formatNumber(location.laborHours, { maximumFractionDigits: 1 })}h
      </div>
      <div className="col-span-1 flex items-center justify-end text-surface-600 dark:text-surface-400">
        {formatNumber(location.idleHours, { maximumFractionDigits: 1 })}h
      </div>
      <div className={cn('col-span-1 flex items-center justify-end font-semibold', idleColor)}>
        {location.idlePercent.toFixed(1)}%
      </div>
      <div className="col-span-1 flex items-center justify-end text-surface-900 dark:text-surface-100">
        ${location.tsth.toFixed(0)}
      </div>
      <div className="col-span-1 flex items-center justify-end text-surface-600 dark:text-surface-400">
        {location.ticketsPerLaborHour.toFixed(1)}
      </div>
      <div className="col-span-1 flex items-center justify-end text-surface-600 dark:text-surface-400">
        {formatCurrency(location.laborCost, { compact: true })}
      </div>
      <div className="col-span-1 flex items-center justify-end text-xs text-surface-500">
        {formatRelativeTime(location.lastSyncAt)}
      </div>
    </Link>
  );
};

// ============ Main Component ============

export default function SchedulingOverviewPage() {
  const router = useRouter();
  const { data, isLoading, refetch, dateRange, setDateRange } = useSchedulingOverview();
  const [searchQuery, setSearchQuery] = useState('');
  const [stateFilter, setStateFilter] = useState<string>('all');
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '14d' | '30d'>('30d');

  const filteredLocations = useMemo(() => {
    if (!data) return [];
    return data.locationSummaries.filter(loc => {
      const matchesSearch = searchQuery === '' ||
        loc.locationName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        loc.storeCode.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesState = stateFilter === 'all' || loc.state === stateFilter;
      return matchesSearch && matchesState;
    });
  }, [data, searchQuery, stateFilter]);

  const states = useMemo(() => {
    if (!data) return [];
    const stateSet = new Set(data.locationSummaries.map(l => l.state));
    return Array.from(stateSet).sort();
  }, [data]);

  const handlePeriodChange = (period: '7d' | '14d' | '30d') => {
    setSelectedPeriod(period);
    const days = period === '7d' ? 7 : period === '14d' ? 14 : 30;
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    setDateRange({
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
    });
  };

  const kpis: KPIData[] = data ? [
    { label: 'Total Revenue', value: data.totalRevenue, format: 'currency', icon: 'dollar-sign' },
    { label: 'Total Labor Hours', value: `${formatNumber(data.totalLaborHours, { maximumFractionDigits: 0 })}h`, format: 'number', icon: 'clock' },
    { label: '% Hours With No Revenue', value: data.idlePercent, format: 'percent', trend: data.idlePercent > 15 ? 'down' : 'up', icon: 'timer' },
  ] : [];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-64 skeleton" />
        <div className="grid grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <div key={i} className="h-32 skeleton rounded-xl" />)}
        </div>
        <div className="h-96 skeleton rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
            <Calendar className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-surface-900 dark:text-surface-100">Ezra Scheduling</h1>
            <p className="text-surface-500 dark:text-surface-400">
              Labor optimization across {data?.locationSummaries.length || 0} locations
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center rounded-lg border border-surface-200 dark:border-surface-700 overflow-hidden">
            {(['7d', '14d', '30d'] as const).map((period) => (
              <button
                key={period}
                onClick={() => handlePeriodChange(period)}
                className={cn(
                  'px-3 py-1.5 text-sm font-medium transition-colors',
                  selectedPeriod === period
                    ? 'bg-ezra-500 text-white'
                    : 'text-surface-600 dark:text-surface-400 hover:bg-surface-50 dark:hover:bg-surface-800'
                )}
              >
                {period}
              </button>
            ))}
          </div>
          <span className="text-xs text-surface-500">
            {formatDate(dateRange.startDate, 'MMM d')} – {formatDate(dateRange.endDate, 'MMM d')}
          </span>
          <Button variant="secondary" size="sm" onClick={refetch} leftIcon={<RefreshCw className="w-4 h-4" />}>
            Refresh
          </Button>
          <Button size="sm" rightIcon={<ArrowUpRight className="w-4 h-4" />} onClick={() => router.push('/app/reports?filter=scheduling')}>Export Report</Button>
        </div>
      </div>

      {/* KPI Cards */}
      {data && (
        <KPIGrid columns={4}>
          {kpis.map((kpi, index) => (
            <Card
              key={kpi.label}
              className={cn(
                'animate-fade-in-up',
                index === 1 && 'animation-delay-100',
                index === 2 && 'animation-delay-200',
                index === 3 && 'animation-delay-300'
              )}
            >
              <div className="flex items-start justify-between mb-2">
                <span className="text-sm text-surface-500 flex items-center gap-1">
                  {kpi.label}
                  {kpi.label === '% Hours With No Revenue' && (
                    <span className="group relative">
                      <Info className="w-3.5 h-3.5 text-surface-400 cursor-help" />
                      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs bg-surface-900 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                        Labor hours with zero revenue generated
                      </span>
                    </span>
                  )}
                </span>
                {kpi.trend === 'down' && kpi.label.includes('Idle') && (
                  <TrendingDown className="w-4 h-4 text-warning-500" />
                )}
              </div>
              <div className="text-2xl font-semibold text-surface-900 dark:text-surface-100">
                {kpi.format === 'currency' && typeof kpi.value === 'number'
                  ? formatCurrency(kpi.value, { compact: true })
                  : kpi.format === 'percent' && typeof kpi.value === 'number'
                  ? `${kpi.value.toFixed(1)}%`
                  : kpi.value}
              </div>
            </Card>
          ))}
        </KPIGrid>
      )}

      {/* Charts Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {data && (
            <ChartCard title="Revenue Trend" subtitle={`${formatDate(dateRange.startDate, 'MMM d')} – ${formatDate(dateRange.endDate, 'MMM d')}`} height={300}>
              <RevenueLineChart data={data.revenueTrend} />
            </ChartCard>
          )}
        </div>
        {data && (
          <ChartCard title="Idle % by Location" subtitle="Top 10 by idle percentage" height={300}>
            <IdleBarChart data={data.idleByLocation} />
          </ChartCard>
        )}
      </div>

      {/* Location Rankings Table */}
      <Card className="overflow-hidden">
        <div className="p-4 border-b border-surface-100 dark:border-surface-800">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-heading-sm text-surface-900 dark:text-surface-100 flex items-center gap-2">
                <Timer className="w-5 h-5 text-emerald-400" />
                Location Rankings
              </h3>
              <p className="text-sm text-surface-500 mt-0.5">Ranked by idle percentage (highest to lowest)</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
                <input
                  type="text"
                  placeholder="Search locations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-2 text-sm rounded-lg border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-surface-900 dark:text-surface-100 placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-ezra-500"
                />
              </div>
              <select
                value={stateFilter}
                onChange={(e) => setStateFilter(e.target.value)}
                className="px-3 py-2 text-sm rounded-lg border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-surface-900 dark:text-surface-100 focus:outline-none focus:ring-2 focus:ring-ezra-500"
              >
                <option value="all">All States</option>
                {states.map(state => <option key={state} value={state}>{state}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Table Header */}
        <div className="grid grid-cols-11 gap-4 px-4 py-3 bg-surface-50 dark:bg-surface-800/50 text-xs font-medium text-surface-500 uppercase tracking-wider border-b border-surface-100 dark:border-surface-800">
          <div className="col-span-3">Location</div>
          <div className="col-span-1 text-right">Revenue</div>
          <div className="col-span-1 text-right">Labor Hrs</div>
          <div className="col-span-1 text-right">Idle Hrs</div>
          <div className="col-span-1 text-right">Idle %</div>
          <div className="col-span-1 text-right">TSTH</div>
          <div className="col-span-1 text-right">Tix/Hr</div>
          <div className="col-span-1 text-right">Labor $</div>
          <div className="col-span-1 text-right">Synced</div>
        </div>

        {/* Table Body */}
        <div className="max-h-[500px] overflow-y-auto">
          {filteredLocations.map((location, index) => (
            <LocationRow key={location.locationId} location={location} rank={index + 1} />
          ))}
          {filteredLocations.length === 0 && (
            <div className="px-4 py-8 text-center text-surface-500">No locations match your search criteria.</div>
          )}
        </div>
      </Card>

      {/* Info Banner */}
      <Card className="bg-emerald-500/5 border-emerald-500/20">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
            <Zap className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h3 className="font-semibold text-surface-900 dark:text-surface-100">About Scheduling Intelligence</h3>
            <p className="text-surface-500 dark:text-surface-400 mt-1">
              Ezra Scheduling analyzes traffic patterns, revenue data, and labor hours to identify
              optimization opportunities. Idle hours are defined as labor hours with zero revenue
              generated. Click on any location to see detailed observations and time-of-day insights.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
