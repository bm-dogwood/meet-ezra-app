'use client';

// ===========================================
// EZRA PORTAL - Store Sales Dashboard
// ===========================================

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ArrowLeft,
  Calendar,
  Download,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  MapPin,
  Clock,
  AlertTriangle,
  Shield,
  Eye,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLocation } from '@/hooks/useLocations';
import { useSalesData } from '@/hooks/useSalesData';
import { lpApi } from '@/lib/api';
import {
  formatCurrency,
  formatPercent,
  formatDate,
  formatCityState,
  formatDateTime,
  formatRelativeTime,
} from '@/lib/formatters';
import { Card } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { DataTable, type Column } from '@/components/ui/DataTable';
import { KPICard, KPIGrid } from '@/components/dashboard/KPICard';
import {
  ChartCard,
  RevenueLineChart,
  ServiceProductChart,
  DonutChart,
} from '@/components/charts/ChartCard';
import type { DailySalesRecord, KPIData } from '@/types';

// ============ Date Range Picker ============
interface DateRangePickerProps {
  startDate: string;
  endDate: string;
  onChange: (start: string, end: string) => void;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({
  startDate,
  endDate,
  onChange,
}) => {
  const presets = [
    { label: 'Last 7 days', days: 7 },
    { label: 'Last 30 days', days: 30 },
    { label: 'Last 90 days', days: 90 },
  ];

  const selectPreset = (days: number) => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - days);
    onChange(
      start.toISOString().split('T')[0],
      end.toISOString().split('T')[0]
    );
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex rounded-lg border border-surface-200 dark:border-surface-700 overflow-hidden">
        {presets.map((preset) => {
          const expectedStart = new Date();
          expectedStart.setDate(expectedStart.getDate() - preset.days);
          const isActive =
            startDate === expectedStart.toISOString().split('T')[0];

          return (
            <button
              key={preset.days}
              onClick={() => selectPreset(preset.days)}
              className={cn(
                'px-3 py-1.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-ezra-500 text-white'
                  : 'text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800'
              )}
            >
              {preset.label}
            </button>
          );
        })}
      </div>
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-900">
        <Calendar className="w-4 h-4 text-surface-500" />
        <input
          type="date"
          value={startDate}
          onChange={(e) => onChange(e.target.value, endDate)}
          className="bg-transparent text-sm text-surface-700 dark:text-surface-300 outline-none"
        />
        <span className="text-surface-400">–</span>
        <input
          type="date"
          value={endDate}
          onChange={(e) => onChange(startDate, e.target.value)}
          className="bg-transparent text-sm text-surface-700 dark:text-surface-300 outline-none"
        />
      </div>
    </div>
  );
};

// ============ Tab Navigation ============
interface TabNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  storeId: string;
}

const TabNav: React.FC<TabNavProps> = ({ activeTab, onTabChange, storeId }) => {
  const tabs = [
    { id: 'sales', label: 'Ezra Sales', href: `/app/locations/${storeId}` },
    { id: 'lp', label: 'Ezra LP', href: `/app/locations/${storeId}/lp` },
    { id: 'scheduling', label: 'Scheduling', href: `/app/locations/${storeId}/scheduling` },
    { id: 'exponential', label: 'Exponential', href: `/app/locations/${storeId}/exponential` },
  ];

  return (
    <div className="border-b border-surface-200 dark:border-surface-700">
      <nav className="flex gap-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              'pb-3 text-sm font-medium transition-colors relative',
              activeTab === tab.id
                ? 'text-ezra-500'
                : 'text-surface-500 hover:text-surface-700 dark:hover:text-surface-300'
            )}
          >
            {tab.label}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-ezra-500 rounded-full" />
            )}
          </button>
        ))}
      </nav>
    </div>
  );
};

// ============ LP Alert Interface ============
interface LPAlert {
  id: number;
  type: 'high' | 'medium' | 'low';
  alert_type: string;
  title: string;
  location: string;
  store_code: string;
  description: string;
  detected_at: string;
  status: string;
  metadata?: {
    threshold_min?: number;
    threshold_max?: number;
    report_date?: string;
  };
}

// ============ Main Store Dashboard ============
export default function StoreDashboardPage() {
  const params = useParams();
  const storeId = params.storeId as string;

  const { location, isLoading: locationLoading } = useLocation(storeId);
  const { data, metrics, trend, isLoading: salesLoading, dateRange, setDateRange, refetch } =
    useSalesData(storeId);

  const [activeTab, setActiveTab] = useState('sales');
  
  // LP Alerts state
  const [lpAlerts, setLpAlerts] = useState<LPAlert[]>([]);
  const [lpAlertsLoading, setLpAlertsLoading] = useState(false);
  const [lpAlertsError, setLpAlertsError] = useState<string | null>(null);

  // Fetch LP alerts when LP tab is selected
  useEffect(() => {
    if (activeTab === 'lp' && location?.storeCode) {
      const fetchLpAlerts = async () => {
        setLpAlertsLoading(true);
        setLpAlertsError(null);
        try {
          const data = await lpApi.getAlerts({
            store_code: location.storeCode,
            limit: 100,
          });
          setLpAlerts((data as any).alerts || []);
        } catch (err) {
          setLpAlertsError(err instanceof Error ? err.message : 'Failed to load LP alerts');
        } finally {
          setLpAlertsLoading(false);
        }
      };
      fetchLpAlerts();
    }
  }, [activeTab, location?.storeCode]);

  const isLoading = locationLoading || salesLoading;

  // Generate KPI data from metrics
  const kpis: KPIData[] = useMemo(() => {
    if (!metrics) return [];
    return [
      {
        label: 'Total Revenue (MTD)',
        value: metrics.totalRevenue,
        change: metrics.goalGapPercent || 0,
        changeLabel: 'vs goal',
        trend: (metrics.goalGapPercent || 0) >= 0 ? 'up' : 'down',
        format: 'currency',
        icon: 'dollar-sign',
      },
      {
        label: 'Average Ticket (MTD)',
        value: metrics.avgTicket,
        change: 2.3,
        changeLabel: 'vs last period',
        trend: 'up',
        format: 'currency',
        icon: 'receipt',
      },
      {
        label: 'Ticket Count (MTD)',
        value: metrics.ticketCount,
        change: -1.5,
        changeLabel: 'vs last period',
        trend: 'down',
        format: 'number',
        icon: 'users',
      },
      {
        label: 'Total Tips (MTD)',
        value: metrics.totalTips,
        change: 4.8,
        changeLabel: 'vs last period',
        trend: 'up',
        format: 'currency',
        icon: 'trending-up',
      },
    ];
  }, [metrics]);

  // Prepare chart data
  const revenueTrendData = useMemo(() => {
    return trend.map((t) => ({
      date: t.date,
      revenue: t.revenue,
    }));
  }, [trend]);

  const serviceProductData = useMemo(() => {
    return trend.map((t) => ({
      date: t.date,
      serviceRevenue: t.serviceRevenue,
      productRevenue: t.productRevenue,
    }));
  }, [trend]);

  const paymentMixData = useMemo(() => {
    if (!metrics) return [];
    const total = metrics.cashRevenue + metrics.cardRevenue;
    if (total === 0) return [];
    return [
      {
        name: 'Card',
        value: Math.round((metrics.cardRevenue / total) * 100),
        fill: '#06b6d4',
      },
      {
        name: 'Cash',
        value: Math.round((metrics.cashRevenue / total) * 100),
        fill: '#22c55e',
      },
    ];
  }, [metrics]);

  // Table columns for daily breakdown
  const columns: Column<DailySalesRecord>[] = [
    {
      key: 'date',
      header: 'Date',
      accessor: (row) => formatDate(row.date, 'EEE, MMM d'),
      sortable: true,
    },
    {
      key: 'totalRevenue',
      header: 'Revenue',
      accessor: (row) => formatCurrency(row.totalRevenue),
      sortable: true,
      align: 'right',
    },
    {
      key: 'serviceRevenue',
      header: 'Services',
      accessor: (row) => formatCurrency(row.serviceRevenue),
      sortable: true,
      align: 'right',
    },
    {
      key: 'productRevenue',
      header: 'Products',
      accessor: (row) => formatCurrency(row.productRevenue),
      sortable: true,
      align: 'right',
    },
    {
      key: 'ticketCount',
      header: 'Tickets',
      accessor: 'ticketCount',
      sortable: true,
      align: 'center',
    },
    {
      key: 'avgTicket',
      header: 'Avg Ticket',
      accessor: (row) => formatCurrency(row.avgTicket),
      sortable: true,
      align: 'right',
    },
    {
      key: 'goalGapPercent',
      header: 'vs Goal',
      accessor: (row) => {
        if (row.goalGapPercent === null) return '—';
        const isPositive = row.goalGapPercent >= 0;
        return (
          <span
            className={cn(
              'inline-flex items-center gap-1',
              isPositive ? 'text-success-500' : 'text-danger-500'
            )}
          >
            {isPositive ? (
              <TrendingUp className="w-3.5 h-3.5" />
            ) : (
              <TrendingDown className="w-3.5 h-3.5" />
            )}
            {formatPercent(Math.abs(row.goalGapPercent), { alreadyPercent: true })}
          </span>
        );
      },
      sortable: true,
      align: 'center',
    },
  ];

  if (isLoading && !location) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 skeleton" />
        <div className="h-6 w-64 skeleton" />
        <div className="grid grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 skeleton rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!location) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <AlertTriangle className="w-12 h-12 text-warning-500 mb-4" />
        <h2 className="text-xl font-semibold text-surface-900 dark:text-surface-100 mb-2">
          Location not found
        </h2>
        <p className="text-surface-500 mb-6">
          The location you're looking for doesn't exist or has been removed.
        </p>
        <Link href="/app/locations">
          <Button leftIcon={<ArrowLeft className="w-4 h-4" />}>
            Back to Locations
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Back link and header */}
      <div className="flex items-center gap-4">
        <Link
          href="/app/locations"
          className="p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-surface-500" />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold text-surface-900 dark:text-surface-100">
              {location.name}
            </h1>
            <span className="font-mono text-sm text-surface-500 bg-surface-100 dark:bg-surface-800 px-2 py-0.5 rounded">
              {location.storeCode}
            </span>
            <span
              className={cn(
                'px-2 py-0.5 rounded-full text-xs font-medium',
                location.status === 'active'
                  ? 'bg-success-50 dark:bg-success-500/10 text-success-600 dark:text-success-500'
                  : 'bg-surface-100 dark:bg-surface-800 text-surface-500'
              )}
            >
              {location.status}
            </span>
          </div>
          <div className="flex items-center gap-4 mt-1 text-sm text-surface-500">
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {location.lastSyncAt
                ? `Synced at ${formatDateTime(location.lastSyncAt)}`
                : 'Never synced'}
            </span>
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
          <Button size="sm" leftIcon={<Download className="w-4 h-4" />}>
            Export
          </Button>
        </div>
      </div>

      {/* Tab navigation */}
      <TabNav activeTab={activeTab} onTabChange={setActiveTab} storeId={storeId} />

      {/* Sales Tab Content */}
      {activeTab === 'sales' && (
        <>
          {/* Date range picker */}
          <div className="flex items-center justify-between">
            <DateRangePicker
              startDate={dateRange.startDate}
              endDate={dateRange.endDate}
              onChange={(start, end) => setDateRange({ startDate: start, endDate: end })}
            />
          </div>

          {/* KPI Cards */}
          <KPIGrid columns={4}>
            {kpis.map((kpi, index) => (
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

          {/* Charts Row */}
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <ChartCard
                title="Revenue Over Time"
                subtitle={`${formatDate(dateRange.startDate)} – ${formatDate(dateRange.endDate)}`}
                height={320}
              >
                <RevenueLineChart data={revenueTrendData} />
              </ChartCard>
            </div>
            <ChartCard title="Payment Mix" subtitle="Card vs Cash" height={320}>
              <DonutChart data={paymentMixData} />
            </ChartCard>
          </div>

          {/* Service vs Product Chart */}
          <ChartCard
            title="Service vs Product Revenue"
            subtitle="Daily breakdown"
            height={300}
          >
            <ServiceProductChart data={serviceProductData} />
          </ChartCard>

          {/* Daily Breakdown Table */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-heading-sm text-surface-900 dark:text-surface-100">
                Daily Breakdown
              </h3>
              <span className="text-sm text-surface-500">
                {data.length} days
              </span>
            </div>
            <DataTable
              columns={columns}
              data={data}
              keyExtractor={(row) => row.id}
              isLoading={salesLoading}
              defaultSort={{ key: 'date', direction: 'desc' }}
            />
          </Card>
        </>
      )}

      {/* LP Tab Content */}
      {activeTab === 'lp' && (
        <div className="space-y-6">
          {/* LP Header */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-warning-500/10 flex items-center justify-center">
              <Shield className="w-6 h-6 text-warning-500" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-surface-900 dark:text-surface-100">
                LP Alerts for {location?.name}
              </h2>
              <p className="text-surface-500">
                {lpAlerts.length} alert{lpAlerts.length !== 1 ? 's' : ''} found
              </p>
            </div>
          </div>

          {/* LP Alerts List */}
          <Card>
            {lpAlertsLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ezra-500" />
              </div>
            ) : lpAlertsError ? (
              <div className="text-center py-12 text-danger-500">
                {lpAlertsError}
              </div>
            ) : lpAlerts.length === 0 ? (
              <div className="text-center py-12">
                <Shield className="w-12 h-12 text-success-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-surface-900 dark:text-surface-100 mb-2">
                  No LP Alerts
                </h3>
                <p className="text-surface-500">
                  This location has no active loss prevention alerts.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {lpAlerts.map((alert) => {
                  const getAlertBadge = (type: 'high' | 'medium' | 'low') => {
                    switch (type) {
                      case 'high':
                        return 'bg-danger-500/10 text-danger-500 border-danger-500/20';
                      case 'medium':
                        return 'bg-warning-500/10 text-warning-500 border-warning-500/20';
                      case 'low':
                        return 'bg-surface-500/10 text-surface-500 border-surface-500/20';
                    }
                  };

                  const getStatusBadge = (status: string) => {
                    switch (status) {
                      case 'new':
                        return 'bg-danger-500/10 text-danger-500';
                      case 'investigating':
                        return 'bg-warning-500/10 text-warning-500';
                      case 'resolved':
                        return 'bg-success-500/10 text-success-500';
                      default:
                        return 'bg-surface-500/10 text-surface-500';
                    }
                  };

                  return (
                    <div
                      key={alert.id}
                      className={cn(
                        'p-4 rounded-lg border transition-all',
                        getAlertBadge(alert.type)
                      )}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-surface-900 dark:text-surface-100">
                              {alert.title}
                            </h4>
                            <span
                              className={cn(
                                'px-2 py-0.5 rounded-full text-xs font-medium capitalize',
                                getStatusBadge(alert.status)
                              )}
                            >
                              {alert.status}
                            </span>
                            <span
                              className={cn(
                                'px-2 py-0.5 rounded-full text-xs font-medium capitalize',
                                alert.type === 'high' ? 'bg-danger-500/20 text-danger-500' : 'bg-warning-500/20 text-warning-500'
                              )}
                            >
                              {alert.type} risk
                            </span>
                          </div>
                          <p className="text-sm text-surface-500">{alert.description}</p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-surface-400">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" />
                              {formatRelativeTime(new Date(alert.detected_at))}
                            </span>
                            {alert.metadata?.report_date && (
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3.5 h-3.5" />
                                Report Date: {alert.metadata.report_date}
                              </span>
                            )}
                          </div>
                        </div>
                        <Link href={`/app/lp/alerts/${alert.alert_type}`}>
                          <Button variant="ghost" size="sm" leftIcon={<Eye className="w-4 h-4" />}>
                            Review
                          </Button>
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </div>
      )}

      {/* Scheduling Tab Content - Coming Soon */}
      {activeTab === 'scheduling' && (
        <div className="flex flex-col items-center justify-center py-24">
          <Clock className="w-12 h-12 text-surface-400 mb-4" />
          <h2 className="text-xl font-semibold text-surface-900 dark:text-surface-100 mb-2">
            Scheduling Coming Soon
          </h2>
          <p className="text-surface-500">
            Scheduling features for this location will be available soon.
          </p>
        </div>
      )}

      {/* Exponential Tab Content - Coming Soon */}
      {activeTab === 'exponential' && (
        <div className="flex flex-col items-center justify-center py-24">
          <TrendingUp className="w-12 h-12 text-surface-400 mb-4" />
          <h2 className="text-xl font-semibold text-surface-900 dark:text-surface-100 mb-2">
            Exponential Coming Soon
          </h2>
          <p className="text-surface-500">
            Exponential growth features for this location will be available soon.
          </p>
        </div>
      )}
    </div>
  );
}
