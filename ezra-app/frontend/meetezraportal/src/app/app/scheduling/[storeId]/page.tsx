'use client';

// ===========================================
// EZRA PORTAL - Scheduling Store Drilldown
// Modified: SRPH → TSTH, Time-of-Day shows TPLH/Idle Hours/Idle %,
// Hourly chart: Tickets Per Hour (blue) + Idle Payroll Hours (orange),
// Heatmap from current UI preserved, "Summary of Observations"
// ===========================================

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  Calendar,
  ArrowLeft,
  Clock,
  DollarSign,
  Users,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  ArrowUpRight,
  Timer,
  Zap,
  Sun,
  Sunset,
  Moon,
  Sunrise,
  Info,
  CheckCircle,
  AlertCircle,
  Lightbulb,
  Download,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSchedulingStore } from '@/hooks/useSchedulingData';
import { useBreadcrumb } from '@/context/BreadcrumbContext';
import { formatCurrency, formatNumber, formatDate, formatDateRange } from '@/lib/formatters';
import { Card } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { ChartCard } from '@/components/charts/ChartCard';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ComposedChart,
} from 'recharts';
import type { SchedulingRecommendation, TimeWindowInsight, SchedulingDailySummary } from '@/types';

// ============ Time Window Card ============
// Shows TPLH, Idle Hours, Idle % per time window

interface TimeWindowCardProps {
  insight: TimeWindowInsight;
  isHighlight?: 'best' | 'worst' | 'busiest' | 'slowest' | null;
}

const TimeWindowCard: React.FC<TimeWindowCardProps> = ({ insight, isHighlight }) => {
  const getIcon = () => {
    if (insight.window.includes('Morning')) return <Sunrise className="w-5 h-5" />;
    if (insight.window.includes('Noon')) return <Sun className="w-5 h-5" />;
    if (insight.window.includes('Afternoon')) return <Sunset className="w-5 h-5" />;
    return <Moon className="w-5 h-5" />;
  };

  const getBadge = () => {
    switch (isHighlight) {
      case 'best':
        return <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-success-500/10 text-success-500">Best TPLH</span>;
      case 'worst':
        return <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-warning-500/10 text-warning-500">Highest Idle</span>;
      case 'busiest':
        return <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-ezra-500/10 text-ezra-500">Peak Traffic</span>;
      case 'slowest':
        return <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-surface-500/10 text-surface-500">Low Traffic</span>;
      default:
        return null;
    }
  };

  return (
    <Card className={cn(
      'relative',
      isHighlight === 'best' && 'ring-1 ring-success-500/30',
      isHighlight === 'worst' && 'ring-1 ring-warning-500/30'
    )}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5 text-surface-600 dark:text-surface-400">
          {getIcon()}
          <span className="font-medium text-sm">{insight.window}</span>
        </div>
        {getBadge()}
      </div>
      <div className="grid grid-cols-3 gap-2">
        <div>
          <p className="text-xs text-surface-500 mb-0.5 relative group cursor-help inline-flex items-center gap-1">
            TPLH
            <Info className="w-3 h-3 text-surface-400" />
            <span className="absolute bottom-full left-0 mb-2 px-3 py-2 bg-surface-900 dark:bg-surface-100 text-white dark:text-surface-900 text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
              Tickets Per Labor Hour — unique guest visits (from Appointments Report) ÷ labor hours
            </span>
          </p>
          <p className={cn(
            'text-base font-semibold',
            isHighlight === 'best' ? 'text-success-500' : 'text-surface-900 dark:text-surface-100'
          )}>
            {insight.tplh.toFixed(1)}
          </p>
        </div>
        <div>
          <p className="text-xs text-surface-500 mb-0.5">Idle %</p>
          <p className={cn(
            'text-base font-semibold',
            insight.idlePercent > 20 ? 'text-danger-500' :
            insight.idlePercent > 10 ? 'text-warning-500' : 'text-success-500'
          )}>
            {insight.idlePercent.toFixed(1)}%
          </p>
        </div>
        <div>
          <p className="text-xs text-surface-500 mb-0.5">Idle Hours</p>
          <p className="text-base font-semibold text-surface-900 dark:text-surface-100">
            {insight.idleHours.toFixed(1)}
          </p>
        </div>
      </div>
    </Card>
  );
};

// ============ Observation Card (renamed from Recommendation) ============

interface ObservationCardProps {
  recommendation: SchedulingRecommendation;
}

const ObservationCard: React.FC<ObservationCardProps> = ({ recommendation }) => {
  const getIcon = () => {
    switch (recommendation.type) {
      case 'reduce_coverage': return <TrendingDown className="w-5 h-5" />;
      case 'add_coverage': return <TrendingUp className="w-5 h-5" />;
      case 'shift_hours': return <Clock className="w-5 h-5" />;
      case 'overtime_alert': return <AlertTriangle className="w-5 h-5" />;
      case 'efficiency': return <Zap className="w-5 h-5" />;
      default: return <Lightbulb className="w-5 h-5" />;
    }
  };

  const getPriorityColor = () => {
    switch (recommendation.priority) {
      case 'high': return 'bg-danger-500/10 border-danger-500/20 text-danger-500';
      case 'medium': return 'bg-warning-500/10 border-warning-500/20 text-warning-500';
      case 'low': return 'bg-surface-500/10 border-surface-500/20 text-surface-500';
    }
  };

  const getTypeColor = () => {
    switch (recommendation.type) {
      case 'reduce_coverage': return 'text-warning-500';
      case 'add_coverage': return 'text-ezra-500';
      case 'overtime_alert': return 'text-danger-500';
      case 'efficiency': return 'text-success-500';
      default: return 'text-surface-500';
    }
  };

  return (
    <div className={cn(
      'p-4 rounded-lg border transition-all',
      recommendation.priority === 'high' ? 'bg-danger-500/5 border-danger-500/20' :
      recommendation.priority === 'medium' ? 'bg-warning-500/5 border-warning-500/20' :
      'bg-surface-50 dark:bg-surface-800/50 border-surface-200 dark:border-surface-700'
    )}>
      <div className="flex items-start gap-3">
        <div className={cn('mt-0.5', getTypeColor())}>{getIcon()}</div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-medium text-surface-900 dark:text-surface-100">{recommendation.title}</h4>
            <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium capitalize', getPriorityColor())}>
              {recommendation.priority}
            </span>
          </div>
          <p className="text-sm text-surface-600 dark:text-surface-400 mb-2">{recommendation.description}</p>
          {(recommendation.metric || recommendation.impact) && (
            <div className="flex items-center gap-4 text-xs">
              {recommendation.metric && <span className="text-surface-500">📊 {recommendation.metric}</span>}
              {recommendation.impact && <span className="text-success-500 font-medium">💰 {recommendation.impact}</span>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ============ Hourly Chart: Tickets Per Hour (blue) + Idle Payroll Hours (orange) ============

const HourlyChart: React.FC<HourlyChartProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272a" />
        <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: '#71717a', fontSize: 11 }} dy={10} />
        <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fill: '#71717a', fontSize: 12 }} width={50} />
        <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fill: '#71717a', fontSize: 12 }} width={40} />
        <Tooltip
          contentStyle={{ backgroundColor: '#18181b', border: 'none', borderRadius: '8px', padding: '8px 12px' }}
          itemStyle={{ color: '#fff' }}
          labelStyle={{ color: '#a1a1aa' }}
        />
        <Legend />
        <Bar yAxisId="left" dataKey="avgTickets" name="Tickets Per Hour" fill="#06b6d4" radius={[4, 4, 0, 0]} barSize={28} />
        <Line yAxisId="right" type="monotone" dataKey="idlePayrollHours" name="Idle Payroll Hours" stroke="#f59e0b" strokeWidth={2} dot={{ fill: '#f59e0b', r: 4 }} activeDot={{ r: 6 }} />
      </ComposedChart>
    </ResponsiveContainer>
  );
}

// ============ Heatmap Cell (preserved from current UI) ============

const HeatmapCell: React.FC<{ value: number; max: number }> = ({ value, max }) => {
  const intensity = max > 0 ? value / max : 0;
  const bg = intensity > 0.7 ? 'bg-ezra-500' : intensity > 0.4 ? 'bg-ezra-500/60' : intensity > 0.15 ? 'bg-ezra-500/30' : 'bg-surface-200 dark:bg-surface-800';
  const text = intensity > 0.4 ? 'text-white' : 'text-surface-600 dark:text-surface-400';
  return (
    <div className={cn('w-full h-10 rounded flex items-center justify-center text-xs font-medium', bg, text)}>
      {value}
    </div>
  );
};

// ============ Main Component ============

export default function SchedulingStorePage() {
  const router = useRouter();
  const params = useParams();
  const storeId = params.storeId as string;
  const { data, isLoading, error, refetch, dateRange, setDateRange } = useSchedulingStore(storeId);
  const { setOverride } = useBreadcrumb();
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '14d' | '30d'>('30d');

  // Set breadcrumb override when store data loads
  useEffect(() => {
    if (data?.locationName) {
      setOverride(storeId, data.locationName);
    }
  }, [data?.locationName, storeId, setOverride]);

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

  const getWindowHighlight = (insight: TimeWindowInsight): 'best' | 'worst' | 'busiest' | 'slowest' | null => {
    if (!data) return null;
    const byTPLH = [...data.timeWindowInsights].sort((a, b) => b.tplh - a.tplh);
    const byIdle = [...data.timeWindowInsights].sort((a, b) => b.idlePercent - a.idlePercent);
    const byTickets = [...data.timeWindowInsights].sort((a, b) => b.avgTickets - a.avgTickets);

    if (insight.window === byTPLH[0].window) return 'best';
    if (insight.window === byIdle[0].window && byIdle[0].idlePercent > 10) return 'worst';
    if (insight.window === byTickets[0].window) return 'busiest';
    if (insight.window === byTickets[byTickets.length - 1].window) return 'slowest';
    return null;
  };

  // Heatmap max value
  const maxHeatmapValue = data?.heatmap
    ? Math.max(...data.heatmap.flatMap(d => [d['9AM-12PM'], d['12PM-2PM'], d['2PM-5PM'], d['5PM-9PM']]))
    : 0;

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

  if (error || !data) {
    return (
      <div className="space-y-6">
        <Link href="/app/scheduling" className="flex items-center gap-2 text-surface-500 hover:text-surface-700 dark:hover:text-surface-300">
          <ArrowLeft className="w-4 h-4" /> Back to Scheduling
        </Link>
        <Card className="py-12 text-center">
          <AlertCircle className="w-12 h-12 text-danger-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-surface-900 dark:text-surface-100 mb-2">Location Not Found</h2>
          <p className="text-surface-500">The location you&apos;re looking for doesn&apos;t exist or has been removed.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Back link & header */}
      <div className="flex items-center justify-between">
        <div>
          <Link href="/app/scheduling" className="flex items-center gap-2 text-surface-500 hover:text-surface-700 dark:hover:text-surface-300 mb-3">
            <ArrowLeft className="w-4 h-4" /> Back to Scheduling
          </Link>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-surface-900 dark:text-surface-100">{data.locationName}</h1>
              <p className="text-surface-500 dark:text-surface-400">Store {data.storeCode} · Scheduling Intelligence</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
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
          </div>
          <Button variant="secondary" size="sm" onClick={refetch} leftIcon={<RefreshCw className="w-4 h-4" />}>
            Refresh
          </Button>
        </div>
      </div>

      {/* Summary KPIs - 6 cards: Revenue, Labor Hours, Idle Hours, TSTH (MTD), Labor Cost, Unscheduled Hours */}
      <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        <Card>
          <div className="flex items-center gap-2 text-sm text-surface-500 mb-1">
            <DollarSign className="w-4 h-4" /> Revenue (MTD)
          </div>
          <p className="text-2xl font-semibold text-surface-900 dark:text-surface-100">
            {formatCurrency(data.summary.revenue, { compact: true })}
          </p>
        </Card>
        <Card>
          <div className="flex items-center gap-2 text-sm text-surface-500 mb-1">
            <Clock className="w-4 h-4" /> Labor Hours (MTD)
          </div>
          <p className="text-2xl font-semibold text-surface-900 dark:text-surface-100">
            {formatNumber(data.summary.laborHours, { maximumFractionDigits: 1 })}h
          </p>
        </Card>
        <Card>
          <div className="flex items-center gap-2 text-sm text-surface-500 mb-1">
            <Timer className="w-4 h-4" /> Idle Hours (MTD)
          </div>
          <p className={cn(
            'text-2xl font-semibold',
            data.summary.idlePercent > 15 ? 'text-danger-500' : 'text-surface-900 dark:text-surface-100'
          )}>
            {formatNumber(data.summary.idleHours, { maximumFractionDigits: 1 })}h
            <span className="text-sm font-normal text-surface-500 ml-1">({data.summary.idlePercent.toFixed(1)}%)</span>
          </p>
        </Card>
        <Card>
          <div className="flex items-center gap-2 text-sm text-surface-500 mb-1">
            <TrendingUp className="w-4 h-4" /> TSTH (MTD)
          </div>
          <p className="text-2xl font-semibold text-surface-900 dark:text-surface-100">
            ${data.summary.tsth.toFixed(0)}
          </p>
        </Card>
        <Card>
          <div className="flex items-center gap-2 text-sm text-surface-500 mb-1">
            <Users className="w-4 h-4" /> Labor Cost (MTD)
          </div>
          <p className="text-2xl font-semibold text-surface-900 dark:text-surface-100">
            {formatCurrency(data.summary.laborCost, { compact: true })}
          </p>
        </Card>
        <Card>
          <div className="flex items-center gap-2 text-sm text-surface-500 mb-1">
            <Clock className="w-4 h-4" /> Unscheduled Hours (MTD)
          </div>
          <p className="text-xs text-surface-400 mb-1">Difference between scheduled and actual hours worked</p>
          <p className={cn(
            'text-2xl font-semibold',
            data.summary.overtimeHours > 0 ? 'text-warning-500' : 'text-surface-900 dark:text-surface-100'
          )}>
            {formatNumber(data.summary.overtimeHours, { maximumFractionDigits: 1 })}h
          </p>
        </Card>
      </div>

      {/* Time-of-Day Insights: TPLH, Idle Hours, Idle % */}
      <div>
        <h2 className="text-heading-sm text-surface-900 dark:text-surface-100 mb-1 flex items-center gap-2">
          <Sun className="w-5 h-5 text-emerald-400" /> Time-of-Day Insights
        </h2>
        <p className="text-xs text-surface-500 mb-4">
          {formatDate(dateRange.startDate, 'MMM d')} – {formatDate(dateRange.endDate, 'MMM d')}
          <span className="ml-2 text-surface-400 italic">· Values are approximate and may vary by 5–10% due to rounding and partial-hour overlaps</span>
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {data.timeWindowInsights.map((insight) => (
            <TimeWindowCard key={insight.window} insight={insight} isHighlight={getWindowHighlight(insight)} />
          ))}
        </div>
      </div>

      {/* Charts: Hourly Performance + Daily Breakdown */}
      <div className="grid lg:grid-cols-2 gap-6">
        <ChartCard title="Hourly Performance" subtitle="Average idle payroll hours and tickets per hour" height={320}>
          <HourlyChart data={data.hourlyTrend} />
        </ChartCard>

        {/* Daily Breakdown Table */}
        <Card>
          <h3 className="text-heading-sm text-surface-900 dark:text-surface-100 mb-4">
            Daily Breakdown
            <span className="text-xs font-normal text-surface-500 ml-2">
              {formatDate(dateRange.startDate, 'MMM d')} – {formatDate(dateRange.endDate, 'MMM d')}
            </span>
            <span className="text-xs font-normal text-surface-400 ml-1">
              ({data.dailyBreakdown.length} days)
            </span>
          </h3>
          <div className="overflow-x-auto max-h-[420px] overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-white dark:bg-surface-850 z-10">
                <tr className="text-surface-500 border-b border-surface-100 dark:border-surface-800">
                  <th className="text-left py-2 font-medium">Date</th>
                  <th className="text-right py-2 font-medium">Revenue</th>
                  <th className="text-right py-2 font-medium">Labor</th>
                  <th className="text-right py-2 font-medium">Idle %</th>
                  <th className="text-right py-2 font-medium">TSTH</th>
                </tr>
              </thead>
              <tbody>
                {data.dailyBreakdown.map((day) => (
                  <tr key={day.date} className="border-b border-surface-100 dark:border-surface-800 last:border-0">
                    <td className="py-2">
                      <span className="text-surface-900 dark:text-surface-100">{formatDate(day.date, 'MMM d')}</span>
                      <span className="text-surface-500 ml-1 text-xs">{day.dayOfWeek.slice(0, 3)}</span>
                    </td>
                    <td className="text-right py-2 text-surface-900 dark:text-surface-100">{formatCurrency(day.revenue)}</td>
                    <td className="text-right py-2 text-surface-600 dark:text-surface-400">{day.laborHours.toFixed(1)}h</td>
                    <td className={cn(
                      'text-right py-2 font-medium',
                      day.idlePercent > 20 ? 'text-danger-500' : day.idlePercent > 10 ? 'text-warning-500' : 'text-success-500'
                    )}>
                      {day.idlePercent.toFixed(1)}%
                    </td>
                    <td className="text-right py-2 text-surface-900 dark:text-surface-100">${day.tsth.toFixed(0)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Guest Traffic Heatmap (preserved from current UI) */}
      <Card>
        <h3 className="text-heading-sm text-surface-900 dark:text-surface-100 mb-4">
          Guest Traffic Heatmap
          <span className="relative inline-block ml-2 group cursor-help">
            <Info className="w-4 h-4 text-surface-400 inline" />
            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-surface-900 dark:bg-surface-100 text-white dark:text-surface-900 text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
              Data source: Zenoti Appointments Report (Closed appointments, unique guest visits by start time)
            </span>
          </span>
          <span className="text-xs font-normal text-surface-500 ml-2">
            Last 7 days ({formatDate((() => { const d = new Date(dateRange.endDate); d.setDate(d.getDate() - 6); return d.toISOString().split('T')[0]; })(), 'MMM d')} – {formatDate(dateRange.endDate, 'MMM d')})
          </span>
        </h3>
        <div className="overflow-x-auto">
          <div className="min-w-[500px]">
            <div className="grid grid-cols-5 gap-2 mb-2">
              <div className="text-xs text-surface-500 font-medium" />
              {['9AM-12PM', '12PM-2PM', '2PM-5PM', '5PM-9PM'].map((b) => (
                <div key={b} className="text-xs text-surface-500 font-medium text-center">{b}</div>
              ))}
            </div>
            {data.heatmap.map((row) => (
              <div key={row.day} className="grid grid-cols-5 gap-2 mb-2">
                <div className="text-xs text-surface-500 font-medium flex items-center">{row.day}</div>
                <HeatmapCell value={row['9AM-12PM']} max={maxHeatmapValue} />
                <HeatmapCell value={row['12PM-2PM']} max={maxHeatmapValue} />
                <HeatmapCell value={row['2PM-5PM']} max={maxHeatmapValue} />
                <HeatmapCell value={row['5PM-9PM']} max={maxHeatmapValue} />
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-4 mt-4 text-xs text-surface-500">
          <span>Unique guest visits per time bucket</span>
          <div className="flex items-center gap-2">
            <div className="w-4 h-3 rounded bg-surface-200 dark:bg-surface-800" /> Low
            <div className="w-4 h-3 rounded bg-ezra-500/30" /> Medium
            <div className="w-4 h-3 rounded bg-ezra-500/60" /> High
            <div className="w-4 h-3 rounded bg-ezra-500" /> Peak
          </div>
        </div>
      </Card>

      {/* Summary of Observations (renamed from Recommendations) */}
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb className="w-5 h-5 text-emerald-400" />
          <h2 className="text-heading-sm text-surface-900 dark:text-surface-100">
            Summary of Observations
          </h2>
        </div>
        <div className="space-y-3">
          {data.recommendations.length > 0 ? (
            data.recommendations.map((rec) => (
              <ObservationCard key={rec.id} recommendation={rec} />
            ))
          ) : (
            <div className="py-8 text-center">
              <CheckCircle className="w-12 h-12 text-success-500 mx-auto mb-3" />
              <p className="text-surface-600 dark:text-surface-400">
                No significant scheduling issues detected for this location.
              </p>
            </div>
          )}
        </div>
      </Card>

      {/* Action buttons */}
      <div className="flex items-center justify-end gap-3">
        <Button variant="secondary" size="sm" leftIcon={<Download className="w-4 h-4" />} onClick={() => router.push('/app/reports?filter=scheduling')}>
          Download Report
        </Button>
      </div>
    </div>
  );
}
