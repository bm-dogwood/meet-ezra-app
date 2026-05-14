'use client';

// ===========================================
// EZRA PORTAL - Exponential Store Drilldown
// ===========================================

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  Rocket,
  ArrowLeft,
  Users,
  UserCheck,
  MessageSquare,
  TrendingUp,
  RefreshCw,
  Target,
  AlertCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useExponentialStore } from '@/hooks/useExponentialData';
import { useBreadcrumb } from '@/context/BreadcrumbContext';
import { formatNumber, formatDate } from '@/lib/formatters';
import { Card } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import type { ExponentialSegment, ExponentialGuestSample } from '@/types';

// ============ Segment Detail Card ============

interface SegmentDetailCardProps {
  segment: ExponentialSegment;
}

const SegmentDetailCard: React.FC<SegmentDetailCardProps> = ({ segment }) => {
  const colorMap: Record<string, { bg: string; border: string; text: string }> = {
    success: { bg: 'bg-success-500/10', border: 'border-success-500/20', text: 'text-success-500' },
    warning: { bg: 'bg-warning-500/10', border: 'border-warning-500/20', text: 'text-warning-500' },
    danger: { bg: 'bg-danger-500/10', border: 'border-danger-500/20', text: 'text-danger-500' },
  };

  const riskToColor: Record<string, string> = { low: 'success', medium: 'warning', high: 'danger' };
  const colors = colorMap[segment.color || riskToColor[segment.riskLevel] || 'warning'] || colorMap.warning;

  return (
    <Card className={cn('border', colors.border)}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center', colors.bg)}>
            <Target className={cn('w-5 h-5', colors.text)} />
          </div>
          <div>
            <h3 className={cn('text-lg font-semibold', colors.text)}>
              {segment.name} Segment
            </h3>
            <p className="text-sm text-surface-500">{segment.customerCount} customers</p>
          </div>
        </div>
      </div>

      <p className="text-sm text-surface-600 dark:text-surface-400 mb-4">
        {segment.description}
      </p>

      <div className="grid grid-cols-3 gap-4 p-3 rounded-lg bg-surface-50 dark:bg-surface-800/50">
        <div className="text-center">
          <p className="text-2xl font-bold text-surface-900 dark:text-surface-100">
            {formatNumber(segment.messagesSent)}
          </p>
          <p className="text-xs text-surface-500">Messages Sent</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-surface-900 dark:text-surface-100">
            {formatNumber(segment.returns)}
          </p>
          <p className="text-xs text-surface-500">Returned</p>
        </div>
        <div className="text-center">
          <p className={cn(
            'text-2xl font-bold',
            segment.uptakePercent >= 30 ? 'text-success-500' :
            segment.uptakePercent >= 20 ? 'text-warning-500' : 'text-danger-500'
          )}>
            {segment.uptakePercent.toFixed(1)}%
          </p>
          <p className="text-xs text-surface-500">Uptake Rate</p>
        </div>
      </div>
    </Card>
  );
};

// ============ Guest Records Table ============

interface GuestTableProps {
  guests: ExponentialGuestSample[];
}

const GuestTable: React.FC<GuestTableProps> = ({ guests }) => {
  const getStatusBadge = (status: ExponentialGuestSample['status']) => {
    switch (status) {
      case 'not_messaged':
        return 'bg-surface-500/10 text-surface-500';
      case 'messaged':
        return 'bg-ezra-500/10 text-ezra-500';
      case 'returned':
        return 'bg-success-500/10 text-success-500';
      case 'no_response':
        return 'bg-warning-500/10 text-warning-500';
    }
  };

  const getSegmentColor = (segment: string) => {
    const s = segment.toLowerCase();
    if (s.includes('4-6') || s.includes('4_6')) return 'text-success-500';
    if (s.includes('4-8') || s.includes('4_8')) return 'text-warning-500';
    if (s.includes('8+') || s.includes('8wk')) return 'text-danger-500';
    return 'text-surface-500';
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-surface-50 dark:bg-surface-800/50 text-xs font-medium text-surface-500 uppercase tracking-wider">
            <th className="text-left px-4 py-3">Name</th>
            <th className="text-left px-4 py-3">Last Visit</th>
            <th className="text-left px-4 py-3">Days Since</th>
            <th className="text-left px-4 py-3">Segment</th>
            <th className="text-left px-4 py-3">Last Service</th>
            <th className="text-left px-4 py-3">Visits</th>
            <th className="text-left px-4 py-3">SMS</th>
            <th className="text-left px-4 py-3">Last Message</th>
            <th className="text-left px-4 py-3">Status</th>
          </tr>
        </thead>
        <tbody>
          {guests.map((guest) => (
            <tr
              key={guest.id}
              className="border-b border-surface-100 dark:border-surface-800 last:border-0 hover:bg-surface-50 dark:hover:bg-surface-800/30 transition-colors"
            >
              <td className="px-4 py-2.5">
                <div className="font-medium text-surface-900 dark:text-surface-100">
                  {guest.guestName || '—'}
                </div>
                <div className="text-xs text-surface-400 font-mono">{guest.id}</div>
              </td>
              <td className="px-4 py-2.5 text-surface-900 dark:text-surface-100">
                {guest.lastVisitDate ? formatDate(guest.lastVisitDate, 'MMM d, yyyy') : '—'}
              </td>
              <td className="px-4 py-2.5 text-surface-600 dark:text-surface-400">
                {guest.daysSinceVisit != null ? `${guest.daysSinceVisit}d` : '—'}
              </td>
              <td className={cn('px-4 py-2.5 font-medium', getSegmentColor(guest.segment))}>
                {guest.segment}
              </td>
              <td className="px-4 py-2.5 text-surface-600 dark:text-surface-400 max-w-[160px] truncate">
                {guest.lastService || '—'}
              </td>
              <td className="px-4 py-2.5 text-surface-600 dark:text-surface-400">
                {guest.totalVisits || '—'}
              </td>
              <td className="px-4 py-2.5">
                {guest.smsOptIn ? (
                  <span className="text-xs px-1.5 py-0.5 rounded bg-success-500/10 text-success-500">Opted In</span>
                ) : (
                  <span className="text-xs px-1.5 py-0.5 rounded bg-surface-500/10 text-surface-500">No</span>
                )}
              </td>
              <td className="px-4 py-2.5 text-surface-600 dark:text-surface-400">
                {guest.lastMessageDate ? formatDate(guest.lastMessageDate, 'MMM d') : '—'}
              </td>
              <td className="px-4 py-2.5">
                <span className={cn(
                  'px-2 py-0.5 rounded-full text-xs font-medium capitalize',
                  getStatusBadge(guest.status)
                )}>
                  {guest.status.replace(/_/g, ' ')}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// ============ Daily Campaign Chart ============

interface DailyCampaignChartProps {
  data: ExponentialDailyCampaign[];
}

// ============ Main Component ============

export default function ExponentialStorePage() {
  const params = useParams();
  const storeId = params.storeId as string;
  const { data, isLoading, error, refetch, dateRange, setDateRange } = useExponentialStore(storeId);
  const { setOverride } = useBreadcrumb();
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | 'mtd'>('30d');

  // Set breadcrumb override when store data loads
  useEffect(() => {
    if (data?.locationName) {
      setOverride(storeId, data.locationName);
    }
  }, [data?.locationName, storeId, setOverride]);

  // Handle period change
  const handlePeriodChange = (period: '7d' | '30d' | 'mtd') => {
    setSelectedPeriod(period);
    const endDate = new Date();
    let startDate = new Date();

    if (period === '7d') {
      startDate.setDate(startDate.getDate() - 7);
    } else if (period === '30d') {
      startDate.setDate(startDate.getDate() - 30);
    } else {
      startDate = new Date(endDate.getFullYear(), endDate.getMonth(), 1);
    }

    setDateRange({
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-64 skeleton" />
        <div className="grid grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 skeleton rounded-xl" />
          ))}
        </div>
        <div className="h-96 skeleton rounded-xl" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="space-y-6">
        <Link
          href="/app/exponential"
          className="flex items-center gap-2 text-surface-500 hover:text-surface-700 dark:hover:text-surface-300"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Exponential
        </Link>
        <Card className="py-12 text-center">
          <AlertCircle className="w-12 h-12 text-danger-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-surface-900 dark:text-surface-100 mb-2">
            Location Not Found
          </h2>
          <p className="text-surface-500">
            The location you're looking for doesn't exist or has been removed.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Back link & header */}
      <div className="flex items-center justify-between">
        <div>
          <Link
            href="/app/exponential"
            className="flex items-center gap-2 text-surface-500 hover:text-surface-700 dark:hover:text-surface-300 mb-3"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Exponential
          </Link>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center">
              <Rocket className="w-6 h-6 text-orange-400" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-surface-900 dark:text-surface-100">
                {data.locationName}
              </h1>
              <p className="text-surface-500 dark:text-surface-400">
                Store {data.storeCode} · Customer Retention
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {/* Period selector */}
          <div className="flex items-center rounded-lg border border-surface-200 dark:border-surface-700 overflow-hidden">
            {(['7d', '30d', 'mtd'] as const).map((period) => (
              <button
                key={period}
                onClick={() => handlePeriodChange(period)}
                className={cn(
                  'px-3 py-1.5 text-sm font-medium transition-colors uppercase',
                  selectedPeriod === period
                    ? 'bg-ezra-500 text-white'
                    : 'text-surface-600 dark:text-surface-400 hover:bg-surface-50 dark:hover:bg-surface-800'
                )}
              >
                {period}
              </button>
            ))}
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={refetch}
            leftIcon={<RefreshCw className="w-4 h-4" />}
          >
            Refresh
          </Button>
        </div>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
        <Card>
          <div className="flex items-center gap-2 text-sm text-surface-500 mb-1">
            <Users className="w-4 h-4" />
            Guests MTD
          </div>
          <p className="text-2xl font-semibold text-surface-900 dark:text-surface-100">
            {formatNumber(data.summary.guestsMTD)}
          </p>
        </Card>
        <Card>
          <div className="flex items-center gap-2 text-sm text-surface-500 mb-1">
            <UserCheck className="w-4 h-4" />
            Last Month
          </div>
          <p className="text-2xl font-semibold text-surface-900 dark:text-surface-100">
            {formatNumber(data.summary.customersLastMonth)}
          </p>
        </Card>
        {data.segments.map((seg, i) => {
          const colorClasses = ['text-success-500 bg-success-500', 'text-warning-500 bg-warning-500', 'text-danger-500 bg-danger-500'];
          const colorIdx = i % colorClasses.length;
          const [textColor, bgColor] = colorClasses[colorIdx].split(' ');
          return (
            <Card key={seg.slug || seg.name}>
              <div className="flex items-center gap-2 text-sm text-surface-500 mb-1">
                <span className={cn('w-2 h-2 rounded-full', bgColor)} />
                {seg.name}
              </div>
              <p className={cn('text-2xl font-semibold', textColor)}>
                {formatNumber((data.summary.segmentCounts || {})[seg.slug] ?? seg.customerCount)}
              </p>
            </Card>
          );
        })}
        <Card>
          <div className="flex items-center gap-2 text-sm text-surface-500 mb-1">
            <MessageSquare className="w-4 h-4" />
            Follow-ups
          </div>
          <p className="text-2xl font-semibold text-surface-900 dark:text-surface-100">
            {formatNumber(data.summary.followUpsSent)}
          </p>
        </Card>
        <Card>
          <div className="flex items-center gap-2 text-sm text-surface-500 mb-1">
            <TrendingUp className="w-4 h-4" />
            Uptake
          </div>
          <p className={cn(
            'text-2xl font-semibold',
            data.summary.overallUptake >= 30 ? 'text-success-500' :
            data.summary.overallUptake >= 20 ? 'text-warning-500' : 'text-danger-500'
          )}>
            {data.summary.overallUptake.toFixed(1)}%
          </p>
        </Card>
      </div>

      {/* Segment Detail Panels */}
      <div>
        <h2 className="text-heading-sm text-surface-900 dark:text-surface-100 mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-orange-400" />
          Segment Details
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
          {data.segments.map(segment => (
            <SegmentDetailCard key={segment.name} segment={segment} />
          ))}
        </div>
      </div>

      {/* Charts Row */}
      <div>
        {/* Guest Sample Table */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-heading-sm text-surface-900 dark:text-surface-100 flex items-center gap-2">
              <Users className="w-5 h-5 text-orange-400" />
              Guest Records
            </h3>
            <span className="text-xs text-surface-500">
              Top guests per segment
            </span>
          </div>
          <GuestTable guests={data.guestSamples} />
        </Card>
      </div>
    </div>
  );
}
