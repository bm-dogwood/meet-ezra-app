'use client';

// ===========================================
// EZRA PORTAL - Ezra Exponential Overview
// ===========================================

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Rocket,
  Users,
  UserCheck,
  Calendar,
  RefreshCw,
  ArrowUpRight,
  Search,
  MessageSquare,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Info,
  Zap,
  Target,
  Send,
  Settings,
  Plus,
  Trash2,
  X,
  Save,
  MapPin,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useExponentialOverview } from '@/hooks/useExponentialData';
import { exponentialApi } from '@/lib/api';
import { formatNumber, formatPercent, formatRelativeTime, formatDate } from '@/lib/formatters';
import { Card } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { ChartCard } from '@/components/charts/ChartCard';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import type { ExponentialSegment, ExponentialLocationSummary, SegmentConfigItem } from '@/types';

// ============ Segment Card ============

interface SegmentCardProps {
  segment: ExponentialSegment;
}

const SegmentCard: React.FC<SegmentCardProps> = ({ segment }) => {
  const colorMap: Record<string, { text: string; bg: string; border: string }> = {
    success: { text: 'text-success-500', bg: 'bg-success-500/10 text-success-500 border-success-500/20', border: 'border-l-success-500' },
    warning: { text: 'text-warning-500', bg: 'bg-warning-500/10 text-warning-500 border-warning-500/20', border: 'border-l-warning-500' },
    danger: { text: 'text-danger-500', bg: 'bg-danger-500/10 text-danger-500 border-danger-500/20', border: 'border-l-danger-500' },
  };

  const riskColorMap: Record<string, string> = {
    low: 'bg-success-500/10 text-success-500 border-success-500/20',
    medium: 'bg-warning-500/10 text-warning-500 border-warning-500/20',
    high: 'bg-danger-500/10 text-danger-500 border-danger-500/20',
  };

  const colors = colorMap[segment.color || 'warning'] || colorMap.warning;

  return (
    <div className={cn(
      'rounded-lg bg-white dark:bg-surface-850 border border-surface-200 dark:border-surface-700/50 p-3 overflow-hidden border-l-4',
      colors.border
    )}>
      <div className="flex items-center justify-between mb-1">
        <h3 className={cn('text-sm font-semibold', colors.text)}>
          {segment.name}
        </h3>
        <span className={cn('px-1.5 py-0.5 rounded-full text-[10px] font-medium border capitalize whitespace-nowrap', riskColorMap[segment.riskLevel] || riskColorMap.medium)}>
          {segment.riskLevel}
        </span>
      </div>
      <div className="flex items-baseline justify-between">
        <p className="text-xl font-bold text-surface-900 dark:text-surface-100">
          {formatNumber(segment.customerCount)}
        </p>
        <div className="flex items-center gap-3 text-[11px]">
          <span className="text-surface-500">Sent <span className="font-medium text-surface-900 dark:text-surface-100">{formatNumber(segment.messagesSent)}</span></span>
          <span className={cn('font-semibold',
            segment.uptakePercent >= 30 ? 'text-success-500' :
            segment.uptakePercent >= 20 ? 'text-warning-500' : 'text-danger-500'
          )}>{segment.uptakePercent.toFixed(1)}%</span>
        </div>
      </div>
      <p className="text-[10px] text-surface-500 mb-2">{segment.description}</p>
      <Link
        href={`/app/exponential/campaigns/new?segment=${encodeURIComponent(segment.name)}`}
        className="flex items-center justify-center gap-1.5 w-full px-2 py-1.5 rounded-md text-[11px] font-medium bg-ezra-500/10 text-ezra-500 hover:bg-ezra-500/20 transition-colors"
      >
        <Send className="w-3 h-3" />
        Start Campaign
      </Link>
    </div>
  );
};

// ============ Campaign Stacked Bar Chart ============

interface CampaignChartProps {
  data: Array<{
    date: string;
    fourWeekSends: number;
    sixWeekSends: number;
    eightWeekSends: number;
  }>;
  activeSegments?: Array<{ slug: string; name: string }>;
}

const SEGMENT_COLORS: Record<string, string> = {
  '4_6wk': '#22c55e', '4_8wk': '#f59e0b', '8wk_plus': '#ef4444',
  success: '#22c55e', warning: '#f59e0b', danger: '#ef4444',
};

// Generate a color for a segment based on its index
const getSegmentColor = (index: number): string => {
  const colors = [
    '#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', 
    '#ec4899', '#14b8a6', '#f97316', '#06b6d4', '#84cc16',
    '#6366f1', '#f43f5e', '#10b981', '#eab308', '#a855f7',
  ];
  return colors[index % colors.length];
};

const CampaignChart: React.FC<CampaignChartProps> = ({ data, activeSegments }) => {
  const [selectedSegments, setSelectedSegments] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<'stacked' | 'grouped'>('stacked');
  const [hoveredDay, setHoveredDay] = useState<string | null>(null);

  // Show last 14 days for readability
  const chartData = useMemo(() => data.slice(-14).map(d => ({
    date: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    fullDate: d.date,
    totalSends: d.totalSends,
    ...d.sendsBySegment,
  })), [data]);

  // Get unique segment keys from the data with their totals
  const segmentStats = useMemo(() => {
    const stats = new Map<string, { total: number; color: string }>();
    data.forEach(d => {
      Object.entries(d.sendsBySegment || {}).forEach(([key, value]) => {
        const current = stats.get(key) || { total: 0, color: '' };
        stats.set(key, { total: current.total + (value as number), color: current.color });
      });
    });
    
    // Sort by total sends (descending) and assign colors
    return Array.from(stats.entries())
      .sort((a, b) => b[1].total - a[1].total)
      .map(([key, stat], index) => ({
        key,
        total: stat.total,
        color: SEGMENT_COLORS[key] || getSegmentColor(index),
        name: key.replace(/_/g, '-'),
      }));
  }, [data]);

  // Initialize with all segments visible
  useEffect(() => {
    if (selectedSegments.size === 0 && segmentStats.length > 0) {
      setSelectedSegments(new Set(segmentStats.map(s => s.key)));
    }
  }, [segmentStats]);

  // Toggle segment selection - remove to hide
  const toggleSegment = (key: string) => {
    const newSelected = new Set(selectedSegments);
    if (newSelected.has(key)) {
      if (newSelected.size > 1) {
        newSelected.delete(key);
      }
    } else {
      newSelected.add(key);
    }
    setSelectedSegments(newSelected);
  };

  // Isolate a single segment - show only this one
  const isolateSegment = (key: string) => {
    setSelectedSegments(new Set([key]));
  };

  // Sync with active Customer Segments from the sidebar
  const syncWithActiveSegments = () => {
    if (!activeSegments || activeSegments.length === 0) return;
    const activeKeys = new Set<string>();
    // Build a set of lowercase names and slugs from sidebar segments
    const nameSet = new Set(activeSegments.map(s => s.name.toLowerCase().trim()));
    const slugSet = new Set(activeSegments.map(s => s.slug.toLowerCase().trim()));
    segmentStats.forEach(seg => {
      const chartKey = seg.key.toLowerCase().trim();
      // Only exact match on name or slug — no partial matching
      if (nameSet.has(chartKey) || slugSet.has(chartKey)) {
        activeKeys.add(seg.key);
      }
    });
    if (activeKeys.size > 0) {
      setSelectedSegments(activeKeys);
    }
  };

  // Filter segments to display - only show selected ones
  const displaySegments = segmentStats.filter(s => selectedSegments.has(s.key));

  // Calculate max value for scaling
  const maxValue = useMemo(() => {
    return Math.max(...chartData.map(d => {
      if (viewMode === 'stacked') {
        return displaySegments.reduce((sum, seg) => sum + ((d as any)[seg.key] || 0), 0);
      } else {
        return Math.max(...displaySegments.map(seg => (d as any)[seg.key] || 0));
      }
    }));
  }, [chartData, displaySegments, viewMode]);

  return (
    <div className="flex flex-col h-full">
      {/* Controls */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-surface-100 dark:border-surface-800">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('stacked')}
            className={cn(
              'px-3 py-1.5 text-xs font-medium rounded-lg transition-colors',
              viewMode === 'stacked'
                ? 'bg-ezra-500 text-white'
                : 'bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-400 hover:bg-surface-200 dark:hover:bg-surface-700'
            )}
          >
            Stacked
          </button>
          <button
            onClick={() => setViewMode('grouped')}
            className={cn(
              'px-3 py-1.5 text-xs font-medium rounded-lg transition-colors',
              viewMode === 'grouped'
                ? 'bg-ezra-500 text-white'
                : 'bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-400 hover:bg-surface-200 dark:hover:bg-surface-700'
            )}
          >
            Grouped
          </button>
        </div>
        
        <div className="flex items-center gap-2 text-xs text-surface-500">
          <span>{displaySegments.length} of {segmentStats.length} segment{segmentStats.length !== 1 ? 's' : ''}</span>
          {activeSegments && activeSegments.length > 0 && (
            <button
              onClick={syncWithActiveSegments}
              className="px-2 py-1 rounded-md bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-400 hover:bg-surface-200 dark:hover:bg-surface-700 font-medium transition-colors"
              title="Keep only segments matching your active Customer Segments"
            >
              Sync
            </button>
          )}
          {displaySegments.length < segmentStats.length && (
            <button
              onClick={() => setSelectedSegments(new Set(segmentStats.map(s => s.key)))}
              className="px-2 py-1 rounded-md bg-ezra-500/10 text-ezra-500 hover:bg-ezra-500/20 font-medium transition-colors"
            >
              Reset All
            </button>
          )}
        </div>
      </div>

      {/* Segment Legend - Pills (only active segments shown) */}
      <div className="mb-4">
        <div className="flex flex-wrap gap-2 px-1 py-1">
          {displaySegments.map((segment) => (
            <div
              key={segment.key}
              className="group flex items-center gap-1.5 pl-3 pr-1.5 py-1.5 rounded-full text-xs font-medium transition-all border-2 border-transparent flex-shrink-0"
              style={{
                backgroundColor: `${segment.color}20`,
                color: segment.color,
              }}
            >
              <div
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: segment.color }}
              />
              <span className="whitespace-nowrap">{segment.name}</span>
              <span className="text-surface-500 dark:text-surface-400 ml-0.5 whitespace-nowrap">
                {segment.total.toLocaleString()}
              </span>
              {/* Only button - isolate this segment */}
              <button
                onClick={() => isolateSegment(segment.key)}
                className={cn(
                  'ml-1 px-1.5 py-0.5 rounded text-[10px] font-semibold transition-all',
                  'opacity-0 group-hover:opacity-100',
                  'bg-surface-900/80 dark:bg-surface-100/80 text-white dark:text-surface-900',
                  'hover:bg-surface-900 dark:hover:bg-surface-100'
                )}
                title={`Show only ${segment.name}`}
              >
                Only
              </button>
              {/* X button - remove this segment from chart */}
              {selectedSegments.size > 1 && (
                <button
                  onClick={() => toggleSegment(segment.key)}
                  className={cn(
                    'ml-0.5 w-4 h-4 flex items-center justify-center rounded-full transition-all',
                    'opacity-0 group-hover:opacity-100',
                    'hover:bg-surface-900/20 dark:hover:bg-surface-100/20'
                  )}
                  title={`Remove ${segment.name} from chart`}
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Custom Bar Chart */}
      <div className="flex-1 relative min-h-[200px] max-h-[280px]">
        <div className="absolute inset-0 flex items-end justify-between gap-1 px-2 pb-6">
          {chartData.map((day, dayIndex) => {
            const dayTotal = displaySegments.reduce((sum, seg) => sum + ((day as any)[seg.key] || 0), 0);
            const isHovered = hoveredDay === day.date;
            const barHeightPercent = maxValue > 0 ? (dayTotal / maxValue) * 100 : 0;
            
            return (
              <div
                key={dayIndex}
                className="flex-1 flex flex-col items-center gap-1 min-w-0 h-full"
                onMouseEnter={() => setHoveredDay(day.date)}
                onMouseLeave={() => setHoveredDay(null)}
              >
                {/* Bar Container */}
                <div className="w-full flex flex-col items-center justify-end relative group h-full">
                  {/* Tooltip */}
                  {isHovered && (
                    <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 z-10 bg-surface-900 dark:bg-surface-800 text-white rounded-lg shadow-xl p-3 min-w-[180px] border border-surface-700">
                      <div className="text-xs font-semibold mb-2 text-surface-300">{day.date}</div>
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-surface-400">Total:</span>
                          <span className="font-bold text-white">{dayTotal.toLocaleString()}</span>
                        </div>
                        <div className="border-t border-surface-700 pt-1.5 space-y-1">
                          {displaySegments
                            .filter(seg => (day as any)[seg.key] > 0)
                            .sort((a, b) => ((day as any)[b.key] || 0) - ((day as any)[a.key] || 0))
                            .map(seg => (
                              <div key={seg.key} className="flex items-center justify-between text-xs">
                                <div className="flex items-center gap-1.5">
                                  <div
                                    className="w-2 h-2 rounded-full"
                                    style={{ backgroundColor: seg.color }}
                                  />
                                  <span className="text-surface-300">{seg.name}</span>
                                </div>
                                <span className="font-medium text-white">
                                  {((day as any)[seg.key] || 0).toLocaleString()}
                                </span>
                              </div>
                            ))}
                        </div>
                      </div>
                      {/* Arrow */}
                      <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px">
                        <div className="border-4 border-transparent border-t-surface-900 dark:border-t-surface-800" />
                      </div>
                    </div>
                  )}
                  
                  {/* Total label on hover */}
                  {isHovered && dayTotal > 0 && (
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-ezra-500 whitespace-nowrap z-10">
                      {dayTotal.toLocaleString()}
                    </div>
                  )}
                  
                  {/* Bar */}
                  <div
                    className={cn(
                      'w-full rounded-t-lg transition-all duration-200 overflow-hidden',
                      isHovered ? 'ring-2 ring-ezra-500 ring-offset-2 ring-offset-surface-50 dark:ring-offset-surface-900' : ''
                    )}
                    style={{
                      height: dayTotal > 0 ? `${Math.max(barHeightPercent, 1)}%` : '0%',
                      maxHeight: '100%',
                    }}
                  >
                    {viewMode === 'stacked' ? (
                      // Stacked bars
                      <div className="h-full flex flex-col-reverse">
                        {displaySegments.map((seg) => {
                          const value = (day as any)[seg.key] || 0;
                          const percentage = dayTotal > 0 ? (value / dayTotal) * 100 : 0;
                          return value > 0 ? (
                            <div
                              key={seg.key}
                              style={{
                                height: `${percentage}%`,
                                backgroundColor: seg.color,
                              }}
                              className="transition-all duration-200"
                            />
                          ) : null;
                        })}
                      </div>
                    ) : (
                      // Grouped bars - show dominant segment
                      <div
                        className="h-full"
                        style={{
                          backgroundColor: displaySegments.reduce((max, seg) => {
                            const value = (day as any)[seg.key] || 0;
                            const maxValue = (day as any)[max.key] || 0;
                            return value > maxValue ? seg : max;
                          }, displaySegments[0])?.color || '#666',
                        }}
                      />
                    )}
                  </div>
                </div>
                
                {/* Date label */}
                <div className="text-[10px] text-surface-500 dark:text-surface-400 text-center truncate w-full">
                  {day.date}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ============ Uptake Bar Chart ============

interface UptakeChartProps {
  data: Array<{ segment: string; uptake: number }>;
}

const UptakeChart: React.FC<UptakeChartProps> = ({ data }) => {
  const hasData = data.some(d => d.uptake > 0);

  if (!hasData) {
    return (
      <div className="flex items-center justify-center h-full text-surface-500 text-sm">
        <div className="text-center">
          <Target className="w-8 h-8 mx-auto mb-2 text-surface-400" />
          <p>No uptake data yet</p>
          <p className="text-xs text-surface-400 mt-1">Uptake is tracked when messaged customers return within 14 days</p>
        </div>
      </div>
    );
  }

  const chartData = data.map(d => ({
    ...d,
    fill: d.segment === '4-week' ? '#22c55e' : d.segment === '6-week' ? '#f59e0b' : '#ef4444',
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={chartData} layout="vertical" margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#27272a" />
        <XAxis
          type="number"
          tickFormatter={(v) => `${v}%`}
          axisLine={false}
          tickLine={false}
          tick={{ fill: '#71717a', fontSize: 12 }}
          domain={[0, 60]}
        />
        <YAxis
          type="category"
          dataKey="segment"
          axisLine={false}
          tickLine={false}
          tick={{ fill: '#a1a1aa', fontSize: 12 }}
          width={70}
        />
        <Tooltip
          formatter={(value: number) => [`${value.toFixed(1)}%`, 'Uptake']}
          contentStyle={{
            backgroundColor: '#18181b',
            border: 'none',
            borderRadius: '8px',
            padding: '8px 12px',
          }}
          itemStyle={{ color: '#fff' }}
          labelStyle={{ color: '#a1a1aa' }}
        />
        <Bar dataKey="uptake" radius={[0, 4, 4, 0]} barSize={28}>
          {chartData.map((entry, index) => (
            <rect key={index} fill={entry.fill} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

// ============ Location Table Row ============

interface LocationRowProps {
  location: ExponentialLocationSummary;
  rank: number;
  segmentKeys: string[];
}

const LocationRow: React.FC<LocationRowProps> = ({ location, rank, segmentKeys }) => {
  const riskColor = location.retentionRiskScore >= 50
    ? 'text-danger-500'
    : location.retentionRiskScore >= 30
      ? 'text-warning-500'
      : 'text-success-500';

  const segColors = ['text-success-500', 'text-warning-500', 'text-danger-500'];

  return (
    <Link
      href={`/app/exponential/${location.locationId}`}
      className="flex gap-4 px-4 py-3 hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-colors border-b border-surface-100 dark:border-surface-800 last:border-0"
    >
      <div className="w-[22%] flex items-center gap-3 min-w-0">
        <span className={cn(
          'w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0',
          rank <= 3 ? 'bg-danger-500/10 text-danger-500' : 'bg-surface-100 dark:bg-surface-800 text-surface-500'
        )}>
          {rank}
        </span>
        <div className="min-w-0">
          <p className="font-medium text-surface-900 dark:text-surface-100 truncate">
            {location.locationName}
          </p>
          <p className="text-xs text-surface-500">{location.storeCode} · {location.state}</p>
        </div>
      </div>
      <div className="w-[8%] flex items-center justify-end text-surface-900 dark:text-surface-100">
        {formatNumber(location.guestsMTD)}
      </div>
      <div className="w-[8%] flex items-center justify-end text-surface-600 dark:text-surface-400">
        {formatNumber(location.customersLastMonth)}
      </div>
      {segmentKeys.map((key, i) => (
        <div key={key} className={cn('w-[8%] flex items-center justify-end', segColors[i % segColors.length])}>
          {formatNumber((location.segmentCounts || {})[key] || 0)}
        </div>
      ))}
      <div className="w-[8%] flex items-center justify-end text-surface-600 dark:text-surface-400">
        {formatNumber(location.followUpsSent)}
      </div>
      <div className="w-[8%] flex items-center justify-end">
        <span className={cn(
          'font-medium',
          location.overallUptake >= 30 ? 'text-success-500' :
          location.overallUptake >= 20 ? 'text-warning-500' : 'text-danger-500'
        )}>
          {location.overallUptake.toFixed(1)}%
        </span>
      </div>
      <div className={cn('w-[8%] flex items-center justify-end font-semibold', riskColor)}>
        {location.retentionRiskScore}
      </div>
      <div className="w-[8%] flex items-center justify-end text-xs text-surface-500">
        {formatRelativeTime(location.lastSyncAt)}
      </div>
    </Link>
  );
};

// ============ Main Component ============

export default function ExponentialOverviewPage() {
  const router = useRouter();
  const { data, isLoading, refetch, dateRange, setDateRange } = useExponentialOverview();
  const [searchQuery, setSearchQuery] = useState('');
  const [stateFilter, setStateFilter] = useState<string>('all');
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | 'mtd'>('30d');

  // Segment config state
  const [showSegmentSettings, setShowSegmentSettings] = useState(false);
  const [segmentConfigs, setSegmentConfigs] = useState<SegmentConfigItem[]>([]);
  const [segmentLoading, setSegmentLoading] = useState(false);
  const [segmentSaving, setSegmentSaving] = useState(false);

  const loadSegmentConfigs = async () => {
    setSegmentLoading(true);
    try {
      const res = await exponentialApi.getSegmentConfigs();
      setSegmentConfigs((res as any).segments || []);
    } catch { /* ignore */ }
    setSegmentLoading(false);
  };

  const handleOpenSegmentSettings = () => {
    setShowSegmentSettings(true);
    loadSegmentConfigs();
  };

  const handleAddSegment = () => {
    setSegmentConfigs(prev => [...prev, {
      name: '', slug: '', minDays: 0, maxDays: null,
      riskLevel: 'medium', color: 'warning', sortOrder: prev.length, isActive: true,
    }]);
  };

  const handleResetDefaults = () => {
    setSegmentConfigs([
      { name: '4-6 weeks', slug: '4_6wk', minDays: 28, maxDays: 42, riskLevel: 'low', color: 'success', sortOrder: 0, isActive: true },
      { name: '4-8 weeks', slug: '4_8wk', minDays: 28, maxDays: 56, riskLevel: 'medium', color: 'warning', sortOrder: 1, isActive: true },
      { name: '8+ weeks', slug: '8wk_plus', minDays: 57, maxDays: null, riskLevel: 'high', color: 'danger', sortOrder: 2, isActive: true },
    ]);
  };

  const handleUpdateSegment = (index: number, field: string, value: any) => {
    setSegmentConfigs(prev => {
      const updated = [...prev];
      (updated[index] as any)[field] = value;
      // Always regenerate slug from name
      if (field === 'name') {
        updated[index].slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
      }
      return updated;
    });
  };

  const handleRemoveSegment = (index: number) => {
    const cfg = segmentConfigs[index];
    setSegmentConfigs(prev => prev.filter((_, i) => i !== index));
    if (cfg.id) {
      exponentialApi.deleteSegmentConfig(cfg.id).catch(() => {});
    }
  };

  const handleSaveSegments = async () => {
    setSegmentSaving(true);
    try {
      const segments = segmentConfigs
        .filter(cfg => cfg.name)
        .map((cfg, i) => ({
          name: cfg.name,
          slug: cfg.slug || cfg.name.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, ''),
          minDays: cfg.minDays,
          maxDays: cfg.maxDays,
          riskLevel: cfg.riskLevel,
          color: cfg.color,
          sortOrder: i,
          isActive: cfg.isActive,
        }));
      await exponentialApi.replaceSegmentConfigs(segments);
      setShowSegmentSettings(false);
      refetch();
    } catch { /* ignore */ }
    setSegmentSaving(false);
  };

  // Filter locations
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

  // Get unique states
  const states = useMemo(() => {
    if (!data) return [];
    const stateSet = new Set(data.locationSummaries.map(l => l.state));
    return Array.from(stateSet).sort();
  }, [data]);

  // Get segment keys from the segments data for table columns
  const segmentKeys = useMemo(() => {
    if (!data?.segments) return [];
    return data.segments.map(s => s.slug || s.name).filter(Boolean);
  }, [data]);

  // Segment display names for table headers
  const segmentNames = useMemo(() => {
    if (!data?.segments) return {};
    const map: Record<string, string> = {};
    data.segments.forEach(s => { map[s.slug || s.name] = s.name; });
    return map;
  }, [data]);

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
      // MTD - first day of current month
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
        <div className="grid grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 skeleton rounded-xl" />
          ))}
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
          <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center">
            <Rocket className="w-6 h-6 text-orange-400" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-surface-900 dark:text-surface-100">
              Ezra Exponential
            </h1>
            <p className="text-surface-500 dark:text-surface-400">
              Customer retention & follow-up across {data?.locationSummaries.length || 0} locations
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {/* Period selector */}
          <div className="flex items-center rounded-lg border border-surface-200 dark:border-surface-700 overflow-hidden">
            {(['7d', '30d', 'mtd'] as const).map((period) => (
              <button
                key={period}
                onClick={() => handlePeriodChange(period)}
                className={cn(
                  'px-2.5 py-1 text-xs font-medium transition-colors uppercase',
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
          <Button
            variant="secondary"
            size="sm"
            onClick={refetch}
            leftIcon={<RefreshCw className="w-4 h-4" />}
          >
            Refresh
          </Button>
          <Link href="/app/exponential/campaigns">
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<MessageSquare className="w-4 h-4" />}
            >
              Campaigns
            </Button>
          </Link>
          <Link href="/app/exponential/store-data">
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<MapPin className="w-4 h-4" />}
            >
              Store Data
            </Button>
          </Link>
          <Link href="/app/exponential/campaigns/import">
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<Users className="w-4 h-4" />}
            >
              CRM
            </Button>
          </Link>
          <Button size="sm" rightIcon={<ArrowUpRight className="w-4 h-4" />} onClick={() => router.push('/app/reports?filter=exponential')}>
            Export Report
          </Button>
        </div>
      </div>

      {/* Top Metrics Row */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <div className="flex items-center gap-2 text-sm text-surface-500 mb-1">
            <Users className="w-4 h-4" />
            Total Salon Guests (MTD)
          </div>
          <p className="text-3xl font-bold text-surface-900 dark:text-surface-100">
            {formatNumber(data?.guestsMTD || 0)}
          </p>
          <p className="text-sm text-surface-500 mt-1">
            Unique guests this month
          </p>
        </Card>
        <Card>
          <div className="flex items-center gap-2 text-sm text-surface-500 mb-1">
            <UserCheck className="w-4 h-4" />
            Total Customers (Last Month)
          </div>
          <p className="text-3xl font-bold text-surface-900 dark:text-surface-100">
            {formatNumber(data?.customersLastMonth || 0)}
          </p>
          <p className="text-sm text-surface-500 mt-1">
            Eligible for follow-up
          </p>
        </Card>
        <Card>
          <div className="flex items-center gap-2 text-sm text-surface-500 mb-1">
            <Target className="w-4 h-4" />
            Bucket Breakdown
          </div>
          <div className="flex flex-wrap items-center gap-3 mt-2">
            {data?.segments.map((seg, i) => {
              const colorClass = seg.color === 'success' ? 'text-success-500' :
                seg.color === 'danger' ? 'text-danger-500' : 'text-warning-500';
              return (
                <div key={seg.slug || seg.name} className="text-center min-w-0">
                  <p className={cn('text-lg font-bold', colorClass)}>
                    {formatNumber(seg.customerCount)}
                  </p>
                  <p className="text-[10px] text-surface-500 truncate">{seg.name}</p>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* 3x3 Grid Layout */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column - Segments */}
        <div className="lg:col-span-1 min-w-0">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-heading-sm text-surface-900 dark:text-surface-100 flex items-center gap-2">
              <Target className="w-5 h-5 text-orange-400" />
              Customer Segments
            </h2>
            <button
              onClick={handleOpenSegmentSettings}
              className="p-1.5 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
              title="Configure segments"
            >
              <Settings className="w-4 h-4 text-surface-400 hover:text-surface-600" />
            </button>
          </div>

          {/* Segment Settings Panel */}
          {showSegmentSettings && (
            <Card className="mb-4 border-ezra-500/30 overflow-visible">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-surface-900 dark:text-surface-100">Segment Configuration</h3>
                <button onClick={() => setShowSegmentSettings(false)} className="p-1 rounded hover:bg-surface-100 dark:hover:bg-surface-800">
                  <X className="w-4 h-4 text-surface-400" />
                </button>
              </div>
              {segmentLoading ? (
                <div className="py-4 text-center text-surface-500 text-sm">Loading...</div>
              ) : (
                <div className="space-y-2">
                  {segmentConfigs.map((cfg, i) => (
                    <div key={i} className="p-2 rounded-lg bg-surface-50 dark:bg-surface-800/50">
                      <div className="flex items-center gap-1 mb-1.5">
                        <input
                          value={cfg.name}
                          onChange={(e) => handleUpdateSegment(i, 'name', e.target.value)}
                          placeholder="Name"
                          className="flex-1 min-w-0 px-2 py-1 text-xs font-medium rounded border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-surface-900 dark:text-surface-100"
                        />
                        <button onClick={() => handleRemoveSegment(i)} className="p-1 rounded hover:bg-danger-500/10 flex-shrink-0">
                          <Trash2 className="w-3 h-3 text-danger-500" />
                        </button>
                      </div>
                      <div className="grid grid-cols-[auto_1fr_auto_1fr_auto_auto_auto] items-center gap-1">
                        <span className="text-[10px] text-surface-400">days</span>
                        <input type="number" value={cfg.minDays}
                          onChange={(e) => handleUpdateSegment(i, 'minDays', parseInt(e.target.value) || 0)}
                          maxLength={3}
                          placeholder="min"
                          className="w-full px-1.5 py-0.5 text-[11px] rounded border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-surface-900 dark:text-surface-100 text-center" />
                        <span className="text-[10px] text-surface-400">to</span>
                        <input type="number" value={cfg.maxDays ?? ''}
                          onChange={(e) => handleUpdateSegment(i, 'maxDays', e.target.value ? parseInt(e.target.value) : null)}
                          placeholder="∞"
                          maxLength={3}
                          className="w-full px-1.5 py-0.5 text-[11px] rounded border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-surface-900 dark:text-surface-100 text-center" />
                        <span className="text-[10px] text-surface-400">days</span>
                        <select value={cfg.riskLevel} onChange={(e) => handleUpdateSegment(i, 'riskLevel', e.target.value)}
                          className="px-1 py-0.5 text-[11px] rounded border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-surface-900 dark:text-surface-100">
                          <option value="low">Low</option>
                          <option value="medium">Med</option>
                          <option value="high">High</option>
                        </select>
                        <select value={cfg.color} onChange={(e) => handleUpdateSegment(i, 'color', e.target.value)}
                          className="px-1 py-0.5 text-[11px] rounded border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-surface-900 dark:text-surface-100">
                          <option value="success">🟢</option>
                          <option value="warning">🟠</option>
                          <option value="danger">🔴</option>
                        </select>
                      </div>
                    </div>
                  ))}
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-2">
                      <button onClick={handleAddSegment} className="flex items-center gap-1 text-[11px] text-ezra-500 hover:text-ezra-600">
                        <Plus className="w-3 h-3" /> Add
                      </button>
                      <button onClick={handleResetDefaults} className="text-[11px] text-surface-400 hover:text-surface-600">
                        Reset defaults
                      </button>
                    </div>
                    <button onClick={handleSaveSegments} disabled={segmentSaving}
                      className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium rounded-md bg-ezra-500 text-white hover:bg-ezra-600 disabled:opacity-50">
                      <Save className="w-3 h-3" />
                      {segmentSaving ? 'Saving...' : 'Save & Apply'}
                    </button>
                  </div>
                </div>
              )}
            </Card>
          )}
          <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
            {data?.segments.map(segment => (
              <SegmentCard key={segment.name} segment={segment} />
            ))}
          </div>
        </div>

        {/* Right Column - Campaign Activity */}
        <div className="lg:col-span-2 min-w-0 space-y-6">
          {data && (
            <ChartCard
              title="Daily Follow-ups by Segment"
              subtitle="SMS messages sent per day"
              height={360}
            >
              <CampaignChart data={data.dailyCampaigns} activeSegments={data.segments.map(s => ({ slug: s.slug || '', name: s.name }))} />
            </ChartCard>
          )}

          {/* Uptake Effectiveness */}
          {data && (
            <ChartCard
              title="Uptake Effectiveness by Segment"
              subtitle="% of messaged customers who returned within 14 days"
              height={180}
              action={
                <span className="group relative">
                  <Info className="w-4 h-4 text-surface-400 cursor-help" />
                  <span className="absolute bottom-full right-0 mb-2 px-3 py-2 text-xs bg-surface-900 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                    Uptake % = Customers returned ÷ Customers messaged
                  </span>
                </span>
              }
            >
              <UptakeChart data={data.uptakeBySegment} />
            </ChartCard>
          )}
        </div>
      </div>

      {/* Location Rankings Table */}
      <Card className="overflow-hidden">
        <div className="p-4 border-b border-surface-100 dark:border-surface-800">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-heading-sm text-surface-900 dark:text-surface-100 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-400" />
                Location Rankings by Retention Risk
              </h3>
              <p className="text-sm text-surface-500 mt-0.5">
                Ranked by retention risk score (highest risk first)
              </p>
            </div>
            <div className="flex items-center gap-3">
              {/* Search */}
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
              {/* State filter */}
              <select
                value={stateFilter}
                onChange={(e) => setStateFilter(e.target.value)}
                className="px-3 py-2 text-sm rounded-lg border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-surface-900 dark:text-surface-100 focus:outline-none focus:ring-2 focus:ring-ezra-500"
              >
                <option value="all">All States</option>
                {states.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Table Header */}
        <div className="flex gap-4 px-4 py-3 bg-surface-50 dark:bg-surface-800/50 text-xs font-medium text-surface-500 uppercase tracking-wider border-b border-surface-100 dark:border-surface-800">
          <div className="w-[22%]">Location</div>
          <div className="w-[8%] text-right">Guests MTD</div>
          <div className="w-[8%] text-right">Last Mo.</div>
          {segmentKeys.map(key => (
            <div key={key} className="w-[8%] text-right">{segmentNames[key] || key}</div>
          ))}
          <div className="w-[8%] text-right">Sent</div>
          <div className="w-[8%] text-right">Uptake</div>
          <div className="w-[8%] text-right">Risk</div>
          <div className="w-[8%] text-right">Synced</div>
        </div>

        {/* Table Body */}
        <div className="max-h-[500px] overflow-y-auto">
          {filteredLocations.map((location, index) => (
            <LocationRow
              key={location.locationId}
              location={location}
              rank={index + 1}
              segmentKeys={segmentKeys}
            />
          ))}
          {filteredLocations.length === 0 && (
            <div className="px-4 py-8 text-center text-surface-500">
              No locations match your search criteria.
            </div>
          )}
        </div>
      </Card>

      {/* Info Banner */}
      <Card className="bg-orange-500/5 border-orange-500/20">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center flex-shrink-0">
            <Zap className="w-5 h-5 text-orange-400" />
          </div>
          <div>
            <h3 className="font-semibold text-surface-900 dark:text-surface-100">
              About Ezra Exponential
            </h3>
            <p className="text-surface-500 dark:text-surface-400 mt-1">
              Ezra Exponential segments customers by visit frequency and automates SMS follow-ups via Twilio.
              Customers with 2+ visits in 30 days are in the 4-week bucket (lowest churn risk).
              Single-visit customers are placed in 6-week (31-42 days) or 8-week (43+ days) buckets based on time since last visit.
              Offer values increase with time to maximize re-engagement.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
