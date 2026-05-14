'use client';

// ===========================================
// EZRA PORTAL - Reports Page
// ===========================================

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  FileText,
  Download,
  Calendar,
  Clock,
  BarChart3,
  TrendingUp,
  Shield,
  Users,
  Loader2,
  ChevronDown,
  Rocket,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { formatRelativeTime } from '@/lib/formatters';
import { downloadSalesReport, downloadLPReport, downloadSchedulingReport, downloadExponentialReport } from '@/lib/api';
import { DateRangePicker } from '@/components/reports/DateRangePicker';

interface Report {
  id: string;
  name: string;
  description: string;
  type: 'sales' | 'lp' | 'operations' | 'executive' | 'scheduling' | 'exponential';
  frequency: 'daily' | 'weekly' | 'monthly' | 'custom';
  lastGenerated: Date;
  status: 'ready' | 'generating' | 'scheduled';
}

// Default report templates that are always available
const defaultReports: Report[] = [
  {
    id: 'rpt-001',
    name: 'Weekly Sales Summary',
    description: 'Revenue, tickets, and goal performance across all locations',
    type: 'sales',
    frequency: 'weekly',
    lastGenerated: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    status: 'ready',
  },
  {
    id: 'rpt-002',
    name: 'Monthly Executive Report',
    description: 'High-level KPIs and trends for leadership review',
    type: 'executive',
    frequency: 'monthly',
    lastGenerated: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    status: 'ready',
  },
  {
    id: 'rpt-003',
    name: 'LP Risk Analysis',
    description: 'Locations with elevated risk scores and anomaly details',
    type: 'lp',
    frequency: 'weekly',
    lastGenerated: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    status: 'ready',
  },
  {
    id: 'rpt-004',
    name: 'Daily Sales Flash',
    description: "Quick snapshot of yesterday's performance",
    type: 'sales',
    frequency: 'daily',
    lastGenerated: new Date(Date.now() - 12 * 60 * 60 * 1000),
    status: 'ready',
  },
  {
    id: 'rpt-005',
    name: 'Location Comparison',
    description: 'Side-by-side performance metrics for all locations',
    type: 'operations',
    frequency: 'custom',
    lastGenerated: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    status: 'ready',
  },
  {
    id: 'rpt-006',
    name: 'Scheduling Report',
    description: 'Labor hours, idle time, overtime, and scheduling quality across all locations',
    type: 'scheduling',
    frequency: 'custom',
    lastGenerated: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    status: 'ready',
  },
  {
    id: 'rpt-007',
    name: 'Exponential Report',
    description: 'Customer retention segments, SMS campaign activity, uptake rates, and location risk scores',
    type: 'exponential',
    frequency: 'custom',
    lastGenerated: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    status: 'ready',
  },
];

const reportTemplates = [
  {
    id: 'tpl-sales',
    name: 'Sales Report',
    icon: BarChart3,
    description: 'Revenue, tickets, and performance metrics',
  },
  {
    id: 'tpl-executive',
    name: 'Executive Summary',
    icon: TrendingUp,
    description: 'High-level KPIs for leadership',
  },
  {
    id: 'tpl-lp',
    name: 'LP Analysis',
    icon: Shield,
    description: 'Risk scores and anomaly detection',
  },
  {
    id: 'tpl-labor',
    name: 'Labor Report',
    icon: Users,
    description: 'Staffing and labor cost analysis',
  },
  {
    id: 'tpl-scheduling',
    name: 'Scheduling Report',
    icon: Clock,
    description: 'Idle hours, overtime, and labor optimization',
  },
  {
    id: 'tpl-exponential',
    name: 'Exponential Report',
    icon: Rocket,
    description: 'Customer retention, SMS campaigns, and uptake',
  },
];

export default function ReportsPage() {
  const searchParams = useSearchParams();
  const filterParam = searchParams.get('filter');
  
  const [selectedType, setSelectedType] = useState<string>('all');
  const [downloadingReport, setDownloadingReport] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Report type for sales/LP (daily or weekly)
  const [reportMode, setReportMode] = useState<'daily' | 'weekly'>('daily');
  const [showModeDropdown, setShowModeDropdown] = useState(false);
  
  // Date state - single date for daily, range for weekly
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const [singleDate, setSingleDate] = useState<Date>(yesterday);
  const [dateRange, setDateRange] = useState<{
    startDate: Date | null;
    endDate: Date | null;
  }>(() => {
    // Default to this week (Monday to yesterday)
    const startOfWeek = new Date(yesterday);
    const dayOfWeek = yesterday.getDay();
    const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    startOfWeek.setDate(yesterday.getDate() - daysToMonday);
    return { startDate: startOfWeek, endDate: yesterday };
  });
  
  // Read URL filter param on mount
  useEffect(() => {
    if (filterParam) {
      setSelectedType(filterParam);
    }
  }, [filterParam]);

  // Format date to YYYY-MM-DD in LOCAL timezone (not UTC)
  // toISOString() converts to UTC which shifts the date back by 1 day
  const formatDateLocal = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleDownload = async (reportId: string, reportType: 'daily' | 'weekly' | 'lp' | 'scheduling' | 'exponential') => {
    setDownloadingReport(reportId);
    setError(null);
    
    try {
      if (reportType === 'exponential') {
        const options: { startDate?: string; endDate?: string } = {};
        if (dateRange.startDate && dateRange.endDate) {
          options.startDate = formatDateLocal(dateRange.startDate);
          options.endDate = formatDateLocal(dateRange.endDate);
        } else {
          options.startDate = formatDateLocal(singleDate);
          options.endDate = formatDateLocal(singleDate);
        }
        await downloadExponentialReport(options);
      } else if (reportType === 'scheduling') {
        const options: { startDate?: string; endDate?: string } = {};
        if (dateRange.startDate && dateRange.endDate) {
          options.startDate = formatDateLocal(dateRange.startDate);
          options.endDate = formatDateLocal(dateRange.endDate);
        } else {
          options.startDate = formatDateLocal(singleDate);
          options.endDate = formatDateLocal(singleDate);
        }
        await downloadSchedulingReport(options);
      } else if (reportType === 'lp') {
        // LP reports use current reportMode
        const options: {
          reportType: 'daily' | 'weekly';
          reportDate?: string;
          startDate?: string;
          endDate?: string;
        } = { reportType: reportMode };
        
        if (reportMode === 'daily') {
          options.reportDate = formatDateLocal(singleDate);
        } else if (dateRange.startDate && dateRange.endDate) {
          options.startDate = formatDateLocal(dateRange.startDate);
          options.endDate = formatDateLocal(dateRange.endDate);
        }
        await downloadLPReport(options);
      } else {
        // Sales reports - use reportType passed in (daily/weekly from report item)
        const effectiveType = reportType === 'daily' ? 'daily' : 'weekly';
        const options: { 
          reportType: 'daily' | 'weekly';
          date?: string;
          startDate?: string;
          endDate?: string;
        } = { reportType: effectiveType };
        
        if (effectiveType === 'daily') {
          options.date = formatDateLocal(singleDate);
        } else if (dateRange.startDate && dateRange.endDate) {
          options.startDate = formatDateLocal(dateRange.startDate);
          options.endDate = formatDateLocal(dateRange.endDate);
        }
        await downloadSalesReport(options);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to download report';
      setError(errorMessage);
      // Auto-clear error after 5 seconds
      setTimeout(() => setError(null), 5000);
    } finally {
      setDownloadingReport(null);
    }
  };

  const handleQuickGenerate = (templateId: string) => {
    switch (templateId) {
      case 'tpl-sales':
        setSelectedType('sales');
        break;
      case 'tpl-executive':
        setSelectedType('executive');
        break;
      case 'tpl-lp':
        setSelectedType('lp');
        break;
      case 'tpl-labor':
        setSelectedType('operations');
        break;
      case 'tpl-scheduling':
        setSelectedType('scheduling');
        break;
      case 'tpl-exponential':
        setSelectedType('exponential');
        break;
      default:
        setSelectedType('all');
    }
  };

  const filteredReports =
    selectedType === 'all'
      ? defaultReports
      : defaultReports.filter((r: Report) => r.type === selectedType);

  const getTypeIcon = (type: Report['type']) => {
    switch (type) {
      case 'sales':
        return <BarChart3 className="w-4 h-4" />;
      case 'lp':
        return <Shield className="w-4 h-4" />;
      case 'executive':
        return <TrendingUp className="w-4 h-4" />;
      case 'scheduling':
        return <Clock className="w-4 h-4" />;
      case 'exponential':
        return <Rocket className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getTypeBadgeColor = (type: Report['type']) => {
    switch (type) {
      case 'sales':
        return 'bg-ezra-500/10 text-ezra-500';
      case 'lp':
        return 'bg-purple-500/10 text-purple-500';
      case 'executive':
        return 'bg-amber-500/10 text-amber-500';
      case 'scheduling':
        return 'bg-cyan-500/10 text-cyan-500';
      case 'exponential':
        return 'bg-orange-500/10 text-orange-500';
      default:
        return 'bg-surface-500/10 text-surface-500';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-surface-900 dark:text-surface-100">
            Reports
          </h1>
          <p className="text-surface-500 dark:text-surface-400 mt-1">
            Generate and download reports for your franchise operations
          </p>
        </div>
        <Button leftIcon={<FileText className="w-4 h-4" />}>
          Create Custom Report
        </Button>
      </div>

      {/* Report Templates */}
      <div>
        <h2 className="text-lg font-semibold text-surface-900 dark:text-surface-100 mb-4">
          Quick Generate
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {reportTemplates.map((template) => {
            const Icon = template.icon;
            return (
              <Card
                key={template.id}
                hover
                className="cursor-pointer"
                onClick={() => handleQuickGenerate(template.id)}
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-ezra-500/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-ezra-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-surface-900 dark:text-surface-100">
                      {template.name}
                    </h3>
                    <p className="text-sm text-surface-500 mt-1">
                      {template.description}
                    </p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-surface-500">Filter:</span>
        <div className="flex rounded-lg border border-surface-200 dark:border-surface-700 overflow-hidden">
          {['all', 'sales', 'lp', 'scheduling', 'exponential', 'executive', 'operations'].map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={cn(
                'px-4 py-2 text-sm font-medium transition-colors capitalize',
                selectedType === type
                  ? 'bg-surface-100 dark:bg-surface-800 text-surface-900 dark:text-surface-100'
                  : 'text-surface-500 hover:text-surface-700 dark:hover:text-surface-300'
              )}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Error Toast */}
      {error && (
        <div className="fixed bottom-4 right-4 bg-red-500 text-white px-4 py-3 rounded-lg shadow-lg z-50 animate-fade-in">
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {/* Reports List */}
      <Card padding="none">
        <div className="divide-y divide-surface-100 dark:divide-surface-800">
          {filteredReports.map((report) => (
            <div
              key={report.id}
              className="p-4 flex items-center justify-between hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-surface-100 dark:bg-surface-800 flex items-center justify-center">
                  {getTypeIcon(report.type)}
                </div>
                <div>
                  <h3 className="font-medium text-surface-900 dark:text-surface-100">
                    {report.name}
                  </h3>
                  <p className="text-sm text-surface-500 mt-0.5">
                    {report.description}
                  </p>
                  <div className="flex items-center gap-3 mt-2">
                    <span
                      className={cn(
                        'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium capitalize',
                        getTypeBadgeColor(report.type)
                      )}
                    >
                      {report.type}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-surface-500">
                      <Clock className="w-3 h-3" />
                      {formatRelativeTime(report.lastGenerated)}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-surface-500 capitalize">
                      <Calendar className="w-3 h-3" />
                      {report.frequency}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {/* LP Report: Mode selector + Date picker inline */}
                {report.status === 'ready' && report.name === 'LP Risk Analysis' && (
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <button
                        onClick={() => setShowModeDropdown(!showModeDropdown)}
                        className="flex items-center gap-1 px-2 py-1 text-xs border border-surface-200 dark:border-surface-700 rounded bg-white dark:bg-surface-800"
                      >
                        <span>{reportMode === 'daily' ? 'Daily' : 'Weekly'}</span>
                        <ChevronDown className="w-3 h-3" />
                      </button>
                      {showModeDropdown && (
                        <div className="absolute top-full left-0 mt-1 bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded shadow-lg z-10 min-w-[80px]">
                          <button
                            onClick={() => { setReportMode('daily'); setShowModeDropdown(false); }}
                            className={cn(
                              'block w-full text-left px-3 py-1 text-xs hover:bg-surface-100 dark:hover:bg-surface-700',
                              reportMode === 'daily' && 'bg-surface-100 dark:bg-surface-700'
                            )}
                          >
                            Daily
                          </button>
                          <button
                            onClick={() => { setReportMode('weekly'); setShowModeDropdown(false); }}
                            className={cn(
                              'block w-full text-left px-3 py-1 text-xs hover:bg-surface-100 dark:hover:bg-surface-700',
                              reportMode === 'weekly' && 'bg-surface-100 dark:bg-surface-700'
                            )}
                          >
                            Weekly
                          </button>
                        </div>
                      )}
                    </div>
                    {reportMode === 'daily' ? (
                      <DateRangePicker
                        mode="single"
                        value={{ startDate: singleDate, endDate: singleDate }}
                        onChange={(range) => {
                          if (range.startDate) setSingleDate(range.startDate);
                        }}
                      />
                    ) : (
                      <DateRangePicker
                        mode="range"
                        value={dateRange}
                        onChange={setDateRange}
                      />
                    )}
                  </div>
                )}
                {/* Sales Reports: Date picker based on frequency */}
                {report.status === 'ready' && (report.name === 'Daily Sales Flash' || report.name === 'Weekly Sales Summary') && (
                  <div className="flex items-center gap-2">
                    {report.frequency === 'daily' ? (
                      <DateRangePicker
                        mode="single"
                        value={{ startDate: singleDate, endDate: singleDate }}
                        onChange={(range) => {
                          if (range.startDate) setSingleDate(range.startDate);
                        }}
                      />
                    ) : (
                      <DateRangePicker
                        mode="range"
                        value={dateRange}
                        onChange={setDateRange}
                      />
                    )}
                  </div>
                )}
                {/* Scheduling Report: Date range picker */}
                {report.status === 'ready' && report.name === 'Scheduling Report' && (
                  <div className="flex items-center gap-2">
                    <DateRangePicker
                      mode="range"
                      value={dateRange}
                      onChange={setDateRange}
                    />
                  </div>
                )}
                {/* Exponential Report: Date range picker */}
                {report.status === 'ready' && report.name === 'Exponential Report' && (
                  <div className="flex items-center gap-2">
                    <DateRangePicker
                      mode="range"
                      value={dateRange}
                      onChange={setDateRange}
                    />
                  </div>
                )}
                {report.status === 'ready' && (
                  <>
                    {/* Sales, LP, and Scheduling reports get functional download buttons */}
                    {(report.name === 'Daily Sales Flash' || report.name === 'Weekly Sales Summary' || report.name === 'LP Risk Analysis' || report.name === 'Scheduling Report' || report.name === 'Exponential Report') ? (
                      <Button
                        variant="secondary"
                        size="sm"
                        leftIcon={
                          downloadingReport === report.id 
                            ? <Loader2 className="w-4 h-4 animate-spin" />
                            : <Download className="w-4 h-4" />
                        }
                        onClick={() => handleDownload(
                          report.id, 
                          report.name === 'Daily Sales Flash' ? 'daily' : 
                          report.name === 'LP Risk Analysis' ? 'lp' :
                          report.name === 'Scheduling Report' ? 'scheduling' :
                          report.name === 'Exponential Report' ? 'exponential' : 'weekly'
                        )}
                        disabled={downloadingReport === report.id}
                      >
                        {downloadingReport === report.id ? 'Downloading...' : 'Download'}
                      </Button>
                    ) : (
                      <Button
                        variant="secondary"
                        size="sm"
                        leftIcon={<Download className="w-4 h-4" />}
                      >
                        Download
                      </Button>
                    )}
                  </>
                )}
                {report.status === 'generating' && (
                  <span className="text-sm text-surface-500">Generating...</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Empty state for filtered results */}
      {filteredReports.length === 0 && (
        <Card className="py-12 text-center">
          <FileText className="w-12 h-12 mx-auto text-surface-300 dark:text-surface-600 mb-4" />
          <h3 className="text-lg font-medium text-surface-900 dark:text-surface-100 mb-2">
            No reports found
          </h3>
          <p className="text-surface-500">
            No reports match the selected filter.
          </p>
        </Card>
      )}
    </div>
  );
}
