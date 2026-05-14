'use client';

// ===========================================
// EZRA PORTAL - Ezra LP Overview
// ===========================================

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Shield,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  MapPin,
  Bell,
  Eye,
  FileWarning,
  CheckCircle,
  Clock,
  Calendar,
  RefreshCw,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLPData } from '@/hooks/useLPData';
import { useEnhancedLocations } from '@/hooks/useLocations';
import { usePermissions } from '@/hooks/usePermissions';
import { formatCurrency, formatRelativeTime } from '@/lib/formatters';
import { downloadLPReport, lpApi } from '@/lib/api';
import { Card } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { KPIGrid } from '@/components/dashboard/KPICard';
import { DateRangePicker } from '@/components/reports/DateRangePicker';
import type { KPIData } from '@/types';

export default function LPOverviewPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { locations, isLoading: locationsLoading } = useEnhancedLocations();
  const { canConfigureAlerts } = usePermissions();
  const [alertPage, setAlertPage] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [flagsByLocation, setFlagsByLocation] = useState<any[]>([]);
  
  // Daily date state - default to yesterday or date from URL param
  const [selectedDate, setSelectedDate] = useState<Date>(() => {
    const dateParam = searchParams.get('date');
    if (dateParam) {
      const parsed = new Date(dateParam + 'T00:00:00');
      if (!isNaN(parsed.getTime())) {
        return parsed;
      }
    }
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday;
  });
  
  // For DateRangePicker compatibility (uses startDate/endDate format)
  const datePickerValue = useMemo(() => ({
    startDate: selectedDate,
    endDate: selectedDate,
  }), [selectedDate]);
  
  const handleDateChange = (range: { startDate: Date | null; endDate: Date | null }) => {
    if (range.startDate) {
      setSelectedDate(range.startDate);
    }
  };
  
  // Calculate weekly range for KPIs (Mon-Sun week containing the selected date)
  const weeklyRange = useMemo(() => {
    const selected = new Date(selectedDate);
    // Get day of week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
    const dayOfWeek = selected.getDay();
    // Calculate Monday of the week containing selected date
    // If Sunday (0), go back 6 days; otherwise go back (dayOfWeek - 1) days
    const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    const startDate = new Date(selected);
    startDate.setDate(selected.getDate() - daysToMonday);
    // Sunday is 6 days after Monday
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);
    return { startDate, endDate };
  }, [selectedDate]);
  
  // Format date for API calls (YYYY-MM-DD in local timezone)
  const formatDateForApi = (date: Date | null): string | undefined => {
    if (!date) return undefined;
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  
  // Format date for display
  const formatDateDisplay = (date: Date | null): string => {
    if (!date) return '';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };
  
  // Memoize date strings for API calls
  // Weekly dates for KPIs (overview)
  const weeklyStartDateStr = useMemo(() => formatDateForApi(weeklyRange.startDate), [weeklyRange.startDate]);
  const weeklyEndDateStr = useMemo(() => formatDateForApi(weeklyRange.endDate), [weeklyRange.endDate]);
  // Daily date for sections (alerts, risk scores, etc.)
  const dailyDateStr = useMemo(() => formatDateForApi(selectedDate), [selectedDate]);
  
  // Use LP data hook - KPIs use weekly range, alerts use daily date
  const { overview, alerts, isLoading: lpLoading, refetch } = useLPData({
    startDate: weeklyStartDateStr,  // Weekly for KPIs
    endDate: weeklyEndDateStr,
    alertStartDate: dailyDateStr,   // Daily for alerts list
    alertEndDate: dailyDateStr,
  });
  
  // Dynamic disclaimer text
  const disclaimerText = useMemo(() => {
    const weekStart = formatDateDisplay(weeklyRange.startDate);
    const weekEnd = formatDateDisplay(weeklyRange.endDate);
    const daily = formatDateDisplay(selectedDate);
    return `KPI cards: Weekly (${weekStart} - ${weekEnd}). Listings: Daily (${daily}).`;
  }, [weeklyRange, selectedDate]);
  
  // Daily date string for section labels
  const dailyDateDisplay = useMemo(() => {
    return formatDateDisplay(selectedDate);
  }, [selectedDate]);

  const isLoading = lpLoading || locationsLoading;
  const ALERTS_PER_PAGE = 10;

  // Fetch flags by location when daily date changes (for Flags by Location section)
  React.useEffect(() => {
    const fetchFlagsByLocation = async () => {
      try {
        const data = await lpApi.getFlagsByLocation({ 
          report_date: dailyDateStr,
        });
        setFlagsByLocation((data as any).flags_by_location || []);
      } catch (err) {
        console.error('Failed to fetch flags by location:', err);
      }
    };
    if (dailyDateStr) {
      fetchFlagsByLocation();
    }
  }, [dailyDateStr]);
  
  // Initial LP calculation on page load
  React.useEffect(() => {
    const initializeLPData = async () => {
      try {
        // Trigger LP calculations for latest data
        await lpApi.calculate();
      } catch (err) {
        console.error('Failed to calculate LP data:', err);
      }
    };
    initializeLPData();
  }, []);

  const handleDownloadReport = async () => {
    setIsDownloading(true);
    try {
      await downloadLPReport();
    } catch (err) {
      console.error('Failed to download report:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  // Refresh handler - refetch with current date range
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await lpApi.calculate();
      await refetch();
      const data = await lpApi.getFlagsByLocation({ 
        report_date: dailyDateStr,
      });
      setFlagsByLocation((data as any).flags_by_location || []);
    } catch (err) {
      console.error('Failed to refresh LP data:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Calculate LP stats from API data
  const avgFlags = overview?.avg_flags?.count || 0;
  
  // Flag Distribution based on DAILY flagsByLocation data (matching Flags by Location section)
  // High = 2+ flags, Medium = 1 flag, Low = 0 flags
  const dailyFlagDistribution = useMemo(() => {
    let high = 0;
    let medium = 0;
    flagsByLocation.forEach((loc: any) => {
      const highFlags = loc.flags?.filter((f: any) => f.risk_level === 'high').length || 0;
      const mediumFlags = loc.flags?.filter((f: any) => f.risk_level === 'medium').length || 0;
      const totalFlags = highFlags + mediumFlags;
      if (totalFlags >= 2) {
        high++;
      } else if (totalFlags === 1) {
        medium++;
      }
    });
    const totalLocations = locations?.length || 71;
    const low = totalLocations - high - medium;
    return { high, medium, low: Math.max(0, low) };
  }, [flagsByLocation, locations]);
  
  const highFlagCount = dailyFlagDistribution.high;
  const mediumFlagCount = dailyFlagDistribution.medium;
  const lowFlagCount = dailyFlagDistribution.low;

  const kpis: KPIData[] = [
    {
      label: 'Active Alerts',
      value: overview?.active_alerts?.count || 0,
      change: overview?.active_alerts?.change || 0,
      changeLabel: overview?.active_alerts?.change_label || 'vs last week',
      trend: (overview?.active_alerts?.change || 0) < 0 ? 'down' : (overview?.active_alerts?.change || 0) > 0 ? 'up' : 'neutral',
      format: 'number',
      icon: 'alert-triangle',
    },
    {
      label: 'High Flag Locations',
      value: overview?.locations_with_2_plus_alerts || highFlagCount,
      change: overview?.high_risk_locations?.change || 0,
      changeLabel: 'Locations with 2+ Alerts',
      trend: (overview?.high_risk_locations?.change || 0) < 0 ? 'down' : (overview?.high_risk_locations?.change || 0) > 0 ? 'up' : 'neutral',
      format: 'number',
      icon: 'shield',
    },
    {
      label: 'Avg Number of Flags',
      value: avgFlags,
      change: overview?.avg_flags?.change || 0,
      changeLabel: overview?.avg_flags?.change_label || 'vs last week',
      trend: (overview?.avg_flags?.change || 0) < 0 ? 'down' : (overview?.avg_flags?.change || 0) > 0 ? 'up' : 'neutral',
      format: 'number',
      icon: 'flag',
    },
    {
      label: 'Resolved This Week',
      value: overview?.resolved_this_week?.count || 0,
      change: overview?.resolved_this_week?.change || 0,
      changeLabel: overview?.resolved_this_week?.change_label || 'vs last week',
      trend: (overview?.resolved_this_week?.change || 0) > 0 ? 'up' : (overview?.resolved_this_week?.change || 0) < 0 ? 'down' : 'neutral',
      format: 'number',
      icon: 'check-circle',
    },
  ];

  // Get locations with flags (top 10)
  const locationsWithFlags = flagsByLocation.slice(0, 10);

  // Transform alerts for display (all alerts in date range, any status)
  const allAlerts = alerts
    .filter((a) => a.type === 'high' || a.type === 'medium')
    .map((alert: any) => ({
      id: alert.id,
      type: alert.type,
      alertType: alert.alert_type,
      title: alert.title,
      location: alert.location,
      storeCode: alert.store_code,
      description: alert.description,
      timestamp: new Date(alert.detected_at),
      status: alert.status,
    }));
  
  const totalAlertPages = Math.ceil(allAlerts.length / ALERTS_PER_PAGE);
  const displayAlerts = allAlerts.slice(
    alertPage * ALERTS_PER_PAGE,
    (alertPage + 1) * ALERTS_PER_PAGE
  );

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
    <div className="space-y-6 animate-fade-in">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
            <Shield className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-surface-900 dark:text-surface-100">
              Ezra LP
            </h1>
            <p className="text-surface-500 dark:text-surface-400">
              Loss prevention monitoring across {locations.length} locations
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {/* Refresh Button */}
          <Button
            variant="secondary"
            size="sm"
            leftIcon={<RefreshCw className={cn("w-4 h-4", isRefreshing && "animate-spin")} />}
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
          {canConfigureAlerts && (
            <Link href="/app/lp/config">
              <Button variant="secondary" size="sm" leftIcon={<Bell className="w-4 h-4" />}>
                Configure Alerts
              </Button>
            </Link>
          )}
          <Link href="/app/reports?filter=lp">
            <Button 
              size="sm" 
              leftIcon={<FileWarning className="w-4 h-4" />}
            >
              Generate LP Report
            </Button>
          </Link>
        </div>
      </div>

      {/* Date Selector and Disclaimer */}
      <div className="flex items-center justify-between gap-4 px-4 py-3 bg-purple-500/10 border border-purple-500/20 rounded-lg">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-purple-400 flex-shrink-0" />
          <p className="text-sm text-purple-300">
            <span className="font-medium">Data Overview:</span> {disclaimerText}
          </p>
        </div>
        <DateRangePicker
          mode="single"
          value={datePickerValue}
          onChange={handleDateChange}
        />
      </div>

      {/* KPI Cards - Weekly Data */}
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
              <div>
                <span className="text-sm text-surface-500">{kpi.label}</span>
                <p className="text-xs text-purple-400">Weekly data</p>
              </div>
              {kpi.trend === 'down' && kpi.label !== 'Active Alerts' ? (
                <TrendingDown className="w-4 h-4 text-success-500" />
              ) : kpi.trend === 'up' && kpi.label === 'Resolved This Week' ? (
                <TrendingUp className="w-4 h-4 text-success-500" />
              ) : null}
            </div>
            <div className="text-2xl font-semibold text-surface-900 dark:text-surface-100">
              {kpi.format === 'number' && typeof kpi.value === 'number'
                ? Math.round(kpi.value)
                : kpi.value}
            </div>
            {kpi.change !== undefined && kpi.change !== 0 && (
              <span className="text-sm text-surface-500">
                {kpi.change > 0 ? '+' : ''}
                {kpi.change} {kpi.changeLabel}
              </span>
            )}
          </Card>
        ))}
      </KPIGrid>

      {/* Main content */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Active Alerts */}
        <div className="lg:col-span-2 flex flex-col">
          <Card className="flex-1 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-heading-sm text-surface-900 dark:text-surface-100 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-warning-500" />
                  Alerts
                </h3>
                <p className="text-xs text-surface-500 mt-1">Daily data ({dailyDateDisplay})</p>
              </div>
              <Link href={`/app/lp/alerts?date=${dailyDateStr}`}>
                <Button variant="ghost" size="sm">
                  View All
                </Button>
              </Link>
            </div>
            <div className="space-y-4 flex-1">
              {displayAlerts.length === 0 ? (
                <div className="text-center py-8 text-surface-500">
                  No active alerts
                </div>
              ) : (
                displayAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className={cn(
                    'p-4 rounded-lg border transition-all cursor-pointer hover:shadow-sm',
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
                      </div>
                      <p className="text-sm text-surface-500">{alert.description}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-surface-400">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          {alert.location} ({alert.storeCode})
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {formatRelativeTime(alert.timestamp)}
                        </span>
                      </div>
                    </div>
                    <Link href={`/app/lp/alerts/${alert.alertType}?date=${dailyDateStr}`}>
                      <Button variant="ghost" size="sm" leftIcon={<Eye className="w-4 h-4" />}>
                        Review
                      </Button>
                    </Link>
                  </div>
                </div>
                ))
              )}
            </div>
            {/* Pagination - always at bottom */}
            {totalAlertPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-4 mt-auto border-t border-surface-200 dark:border-surface-700">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setAlertPage(Math.max(0, alertPage - 1))}
                  disabled={alertPage === 0}
                >
                  Previous
                </Button>
                <span className="text-sm text-surface-500">
                  Page {alertPage + 1} of {totalAlertPages}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setAlertPage(Math.min(totalAlertPages - 1, alertPage + 1))}
                  disabled={alertPage >= totalAlertPages - 1}
                >
                  Next
                </Button>
              </div>
            )}
          </Card>
        </div>

        {/* Flag Distribution & Flags by Location */}
        <div className="space-y-6">
          {/* Flag Distribution */}
          <Card>
            <div className="mb-4">
              <h3 className="text-heading-sm text-surface-900 dark:text-surface-100">
                Flag Distribution Overview
              </h3>
              <p className="text-xs text-surface-500 mt-1">Daily data ({dailyDateDisplay})</p>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-success-500" />
                  <span className="text-surface-600 dark:text-surface-400">Low (0 flags)</span>
                </div>
                <span className="font-semibold text-surface-900 dark:text-surface-100">
                  {lowFlagCount} {lowFlagCount === 1 ? 'Location' : 'Locations'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-warning-500" />
                  <span className="text-surface-600 dark:text-surface-400">Medium (1 flag)</span>
                </div>
                <span className="font-semibold text-surface-900 dark:text-surface-100">
                  {mediumFlagCount} {mediumFlagCount === 1 ? 'Location' : 'Locations'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-danger-500" />
                  <span className="text-surface-600 dark:text-surface-400">High (2+ flags)</span>
                </div>
                <span className="font-semibold text-surface-900 dark:text-surface-100">
                  {highFlagCount} {highFlagCount === 1 ? 'Location' : 'Locations'}
                </span>
              </div>
              {/* Visual bar */}
              <div className="h-4 rounded-full overflow-hidden bg-surface-100 dark:bg-surface-800 flex">
                <div
                  className="bg-success-500 h-full"
                  style={{ width: `${(lowFlagCount / locations.length) * 100}%` }}
                />
                <div
                  className="bg-warning-500 h-full"
                  style={{ width: `${(mediumFlagCount / locations.length) * 100}%` }}
                />
                <div
                  className="bg-danger-500 h-full"
                  style={{ width: `${(highFlagCount / locations.length) * 100}%` }}
                />
              </div>
            </div>
          </Card>

          {/* Flags by Location */}
          <Card>
            <div className="mb-4">
              <h3 className="text-heading-sm text-surface-900 dark:text-surface-100">
                Top 10 Flags by Location
              </h3>
              <p className="text-xs text-surface-500 mt-1">Daily data ({dailyDateDisplay})</p>
            </div>
            <div className="space-y-3">
              {locationsWithFlags.length === 0 ? (
                <div className="text-center py-8 text-surface-500">
                  No flagged locations
                </div>
              ) : (
                locationsWithFlags.map((location: any) => (
                <Link
                  key={location.store_id}
                  href={`/app/locations/${location.store_id}`}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-colors"
                >
                  <div>
                    <p className="font-medium text-surface-900 dark:text-surface-100">
                      {location.store_name}
                    </p>
                    <p className="text-xs text-surface-500">{location.store_code}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {location.flags?.map((flag: any, idx: number) => (
                      <div
                        key={idx}
                        className={cn(
                          'w-3 h-3 rounded-full',
                          flag.risk_level === 'high'
                            ? 'bg-danger-500'
                            : 'bg-warning-500'
                        )}
                        title={`${flag.label}: ${flag.value.toFixed(1)}%`}
                      />
                    ))}
                  </div>
                </Link>
                ))
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Info Banner */}
      <Card className="bg-purple-500/5 border-purple-500/20">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center flex-shrink-0">
            <Shield className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h3 className="font-semibold text-surface-900 dark:text-surface-100">
              About Ezra LP
            </h3>
            <p className="text-surface-500 dark:text-surface-400 mt-1">
              Ezra LP uses AI-powered anomaly detection to identify unusual patterns in cash ratios,
              tip percentages, and low-ticket services that may indicate loss or fraud. Flags are
              generated based on threshold configurations and updated daily.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
