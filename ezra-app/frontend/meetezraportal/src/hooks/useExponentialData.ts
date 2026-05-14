'use client';

// ===========================================
// EZRA PORTAL - Exponential Data Hook (Real API)
// ===========================================

import { useState, useEffect, useCallback } from 'react';
import type {
  ExponentialOverviewData,
  ExponentialStoreData,
  ExponentialSegment,
  ExponentialLocationSummary,
  ExponentialDailyCampaign,
  ExponentialRecommendation,
  ExponentialGuestSample,
  DateRange,
} from '@/types';
import { exponentialApi } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { format, subDays } from 'date-fns';

// ============ Transform API response to match UI types ============

function transformOverview(raw: any): ExponentialOverviewData {
  return {
    guestsMTD: raw.guestsMTD ?? 0,
    customersLastMonth: raw.customersLastMonth ?? 0,
    segments: (raw.segments || []).map((s: any) => ({
      name: s.name || '',
      slug: s.slug || '',
      customerCount: s.customerCount ?? 0,
      description: s.description || '',
      riskLevel: s.riskLevel || 'low',
      color: s.color || 'warning',
      uptakePercent: s.uptakePercent ?? 0,
      messagesSent: s.messagesSent ?? 0,
      returns: s.returns ?? 0,
    })) as ExponentialSegment[],
    dailyCampaigns: (raw.dailyCampaigns || []).map((d: any) => ({
      date: d.date || '',
      sendsBySegment: d.sendsBySegment || {},
      totalSends: d.totalSends ?? 0,
    })) as ExponentialDailyCampaign[],
    uptakeBySegment: (raw.uptakeBySegment || []).map((u: any) => ({
      segment: u.segment || '',
      uptake: u.uptake ?? 0,
    })),
    locationSummaries: (raw.locationSummaries || []).map((loc: any) => ({
      locationId: String(loc.locationId),
      storeCode: loc.storeCode || '',
      locationName: loc.locationName || '',
      state: loc.state || '',
      guestsMTD: loc.guestsMTD ?? 0,
      customersLastMonth: loc.customersLastMonth ?? 0,
      segmentCounts: loc.segmentCounts || {},
      followUpsSent: loc.followUpsSent ?? 0,
      overallUptake: loc.overallUptake ?? 0,
      retentionRiskScore: loc.retentionRiskScore ?? 0,
      lastSyncAt: loc.lastSyncAt || new Date().toISOString(),
    })) as ExponentialLocationSummary[],
  };
}

function transformStoreData(raw: any): ExponentialStoreData {
  const s = raw.summary || {};
  return {
    locationId: String(raw.locationId || ''),
    locationName: raw.locationName || '',
    storeCode: raw.storeCode || '',
    summary: {
      guestsMTD: s.guestsMTD ?? 0,
      customersLastMonth: s.customersLastMonth ?? 0,
      segmentCounts: s.segmentCounts || {},
      followUpsSent: s.followUpsSent ?? 0,
      overallUptake: s.overallUptake ?? 0,
    },
    segments: (raw.segments || []).map((seg: any) => ({
      name: seg.name || '',
      slug: seg.slug || '',
      customerCount: seg.customerCount ?? 0,
      description: seg.description || '',
      riskLevel: seg.riskLevel || 'low',
      color: seg.color || 'warning',
      uptakePercent: seg.uptakePercent ?? 0,
      messagesSent: seg.messagesSent ?? 0,
      returns: seg.returns ?? 0,
    })) as ExponentialSegment[],
    dailyCampaigns: (raw.dailyCampaigns || []).map((d: any) => ({
      date: d.date || '',
      sendsBySegment: d.sendsBySegment || {},
      totalSends: d.totalSends ?? 0,
    })) as ExponentialDailyCampaign[],
    recommendations: (raw.recommendations || []).map((r: any) => ({
      id: r.id || '',
      type: r.type || 'increase_outreach',
      priority: r.priority || 'low',
      title: r.title || '',
      description: r.description || '',
      metric: r.metric || '',
      impact: r.impact || '',
    })) as ExponentialRecommendation[],
    guestSamples: (raw.guestSamples || []).map((g: any) => ({
      id: g.id || '',
      guestName: g.guestName || '',
      phone: g.phone || '',
      lastVisitDate: g.lastVisitDate || '',
      daysSinceVisit: g.daysSinceVisit ?? null,
      segment: g.segment || '',
      lastService: g.lastService || '',
      totalVisits: g.totalVisits ?? 0,
      smsOptIn: g.smsOptIn ?? false,
      lastMessageDate: g.lastMessageDate || null,
      status: g.status || 'not_messaged',
    })) as ExponentialGuestSample[],
  };
}

// ============ Overview Hook ============

interface UseExponentialOverviewReturn {
  data: ExponentialOverviewData | null;
  isLoading: boolean;
  error: Error | null;
  dateRange: DateRange;
  setDateRange: (range: DateRange) => void;
  refetch: () => void;
}

export function useExponentialOverview(): UseExponentialOverviewReturn {
  const { user } = useAuth();
  const [data, setData] = useState<ExponentialOverviewData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: format(subDays(new Date(), 30), 'yyyy-MM-dd'),
    endDate: format(new Date(), 'yyyy-MM-dd'),
  });

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const raw = await exponentialApi.getOverview({
        start_date: dateRange.startDate,
        end_date: dateRange.endDate,
      });
      setData(transformOverview(raw));
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch exponential data'));
    } finally {
      setIsLoading(false);
    }
  }, [dateRange]);

  useEffect(() => { fetchData(); }, [fetchData]);

  return { data, isLoading, error, dateRange, setDateRange, refetch: fetchData };
}

// ============ Store Hook ============

interface UseExponentialStoreReturn {
  data: ExponentialStoreData | null;
  isLoading: boolean;
  error: Error | null;
  dateRange: DateRange;
  setDateRange: (range: DateRange) => void;
  refetch: () => void;
}

export function useExponentialStore(locationId: string): UseExponentialStoreReturn {
  const [data, setData] = useState<ExponentialStoreData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: format(subDays(new Date(), 30), 'yyyy-MM-dd'),
    endDate: format(new Date(), 'yyyy-MM-dd'),
  });

  const fetchData = useCallback(async () => {
    if (!locationId) return;
    setIsLoading(true);
    setError(null);
    try {
      const raw = await exponentialApi.getStoreDrilldown(locationId, {
        start_date: dateRange.startDate,
        end_date: dateRange.endDate,
      });
      if (!raw) throw new Error('Location not found');
      setData(transformStoreData(raw));
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch store exponential data'));
    } finally {
      setIsLoading(false);
    }
  }, [locationId, dateRange]);

  useEffect(() => { fetchData(); }, [fetchData]);

  return { data, isLoading, error, dateRange, setDateRange, refetch: fetchData };
}

export default useExponentialOverview;
