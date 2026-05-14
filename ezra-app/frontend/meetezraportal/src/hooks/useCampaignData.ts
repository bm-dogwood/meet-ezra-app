'use client';

// ===========================================
// EZRA PORTAL - Campaign Data Hooks (Real API)
// ===========================================

import { useState, useEffect, useCallback, useMemo } from 'react';
import type {
  Campaign,
  CampaignMessage,
  SMSTemplate,
  CampaignSegment,
  CampaignStatus,
  CampaignFormData,
} from '@/types';
import { exponentialApi, smsTemplatesApi } from '@/lib/api';

// ============ Campaign List Hook ============
interface UseCampaignsReturn {
  campaigns: Campaign[];
  isLoading: boolean;
  error: Error | null;
  stats: {
    totalCampaigns: number;
    activeCampaigns: number;
    scheduledCampaigns: number;
    totalMessagesSent: number;
    totalDelivered: number;
    avgDeliveryRate: number;
  };
  filters: {
    status: CampaignStatus | 'all';
    segment: CampaignSegment | 'all';
    serviceFilter: string;
  };
  setFilters: (filters: { status?: CampaignStatus | 'all'; segment?: CampaignSegment | 'all'; serviceFilter?: string }) => void;
  search: string;
  setSearch: (q: string) => void;
  page: number;
  totalPages: number;
  total: number;
  setPage: (page: number) => void;
  refetch: () => void;
}

const DEFAULT_STATS = {
  totalCampaigns: 0,
  activeCampaigns: 0,
  scheduledCampaigns: 0,
  totalMessagesSent: 0,
  totalDelivered: 0,
  avgDeliveryRate: 0,
};

export function useCampaigns(): UseCampaignsReturn {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [stats, setStats] = useState(DEFAULT_STATS);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [page, setPageState] = useState(0);
  const [total, setTotal] = useState(0);
  const limit = 20;
  const [filters, setFiltersState] = useState<{ status: CampaignStatus | 'all'; segment: CampaignSegment | 'all'; serviceFilter: string }>({
    status: 'all',
    segment: 'all',
    serviceFilter: '',
  });
  const [search, setSearchState] = useState('');

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const params: Record<string, any> = { page, limit };
      if (filters.status !== 'all') params.status = filters.status;
      if (filters.segment !== 'all') params.segment = filters.segment;
      if (filters.serviceFilter) params.service_filter = filters.serviceFilter;
      if (search) params.search = search;

      const res = await exponentialApi.getCampaigns(params) as {
        campaigns: Campaign[];
        stats: Record<string, any>;
        total: number;
        page: number;
        limit: number;
      };

      setCampaigns(res.campaigns || []);
      setTotal(res.total || 0);
      if (res.stats) {
        const s = res.stats;
        setStats({
          totalCampaigns: s.totalCampaigns ?? s.total_campaigns ?? 0,
          activeCampaigns: s.activeCampaigns ?? s.active_campaigns ?? 0,
          scheduledCampaigns: s.scheduledCampaigns ?? s.scheduled_campaigns ?? 0,
          totalMessagesSent: s.totalMessagesSent ?? s.total_messages_sent ?? 0,
          totalDelivered: s.totalDelivered ?? s.total_delivered ?? 0,
          avgDeliveryRate: s.avgDeliveryRate ?? s.avg_delivery_rate ?? 0,
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch campaigns'));
    } finally {
      setIsLoading(false);
    }
  }, [filters, page, search]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const setFilters = useCallback((newFilters: { status?: CampaignStatus | 'all'; segment?: CampaignSegment | 'all'; serviceFilter?: string }) => {
    setFiltersState(prev => ({ ...prev, ...newFilters }));
    setPageState(0);
  }, []);

  const setPage = useCallback((p: number) => setPageState(p), []);

  const setSearch = useCallback((q: string) => {
    setSearchState(q);
    setPageState(0);
  }, []);

  const totalPages = Math.ceil(total / limit);

  return {
    campaigns,
    isLoading,
    error,
    stats,
    filters,
    setFilters,
    search,
    setSearch,
    page,
    totalPages,
    total,
    setPage,
    refetch: fetchData,
  };
}

// ============ Single Campaign Hook ============
interface UseCampaignReturn {
  campaign: Campaign | null;
  messages: CampaignMessage[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

export function useCampaign(campaignId: string): UseCampaignReturn {
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [messages, setMessages] = useState<CampaignMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    if (!campaignId) return;

    setIsLoading(true);
    setError(null);

    try {
      const res = await exponentialApi.getCampaignDetail(campaignId) as {
        campaign: Campaign;
        messages: CampaignMessage[];
        messagesTotal: number;
        messagesPage: number;
      };

      setCampaign(res.campaign || null);
      setMessages(res.messages || []);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch campaign'));
    } finally {
      setIsLoading(false);
    }
  }, [campaignId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    campaign,
    messages,
    isLoading,
    error,
    refetch: fetchData,
  };
}

// ============ Templates Hook ============
interface UseTemplatesReturn {
  templates: SMSTemplate[];
  getTemplatesBySegment: (segment: CampaignSegment) => SMSTemplate[];
  isLoading: boolean;
}

export function useTemplates(): UseTemplatesReturn {
  const [templates, setTemplates] = useState<SMSTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const res = await smsTemplatesApi.list() as any;
        // Map backend template shape to frontend SMSTemplate
        const list = (res.templates || res || []) as any[];
        const mapped: SMSTemplate[] = list.map((t: any) => ({
          id: String(t.id),
          name: t.name || '',
          content: t.body || t.content || '',
          segment: mapBucketToSegment(t.bucket) as CampaignSegment,
          suggestedCouponRange: t.suggested_coupon_range || getCouponRange(t.bucket),
          isPreset: t.is_preset ?? true,
          createdAt: t.created_at || new Date().toISOString(),
        }));
        setTemplates(mapped);
      } catch {
        // Fallback: empty list
        setTemplates([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTemplates();
  }, []);

  const getTemplatesBySegment = useCallback((segment: CampaignSegment) => {
    if (segment === 'all') return templates;
    return templates.filter(t => t.segment === segment || t.segment === 'all');
  }, [templates]);

  return {
    templates,
    getTemplatesBySegment,
    isLoading,
  };
}


// ============ Audience Estimation Hook ============
interface UseAudienceEstimateReturn {
  counts: { segment: CampaignSegment; count: number }[];
  getCountForSegment: (segment: CampaignSegment) => number;
  getTotalForLocations: (locationIds: string[], segment: CampaignSegment) => number;
  isLoading: boolean;
}

export function useAudienceEstimate(locationIds?: string[]): UseAudienceEstimateReturn {
  const [counts, setCounts] = useState<{ segment: CampaignSegment; count: number }[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCounts = async () => {
      setIsLoading(true);
      try {
        const params: Record<string, string> = {};
        if (locationIds && locationIds.length > 0) {
          params.location_ids = locationIds.join(',');
        }
        const res = await exponentialApi.getAudienceEstimate(params) as {
          counts: { segment: string; count: number }[];
        };
        const mapped = (res.counts || []).map((c: any) => ({
          segment: c.segment as CampaignSegment,
          count: c.count,
        }));
        setCounts(mapped);
      } catch {
        setCounts([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCounts();
  }, [locationIds?.join(',')]); // eslint-disable-line react-hooks/exhaustive-deps

  const getCountForSegment = useCallback((segment: CampaignSegment) => {
    if (segment === 'all') {
      return counts.reduce((sum, c) => sum + c.count, 0);
    }
    const found = counts.find(c => c.segment === segment);
    return found?.count || 0;
  }, [counts]);

  const getTotalForLocations = useCallback((_locIds: string[], segment: CampaignSegment) => {
    // The counts are already filtered by locationIds from the API call
    return getCountForSegment(segment);
  }, [getCountForSegment]);

  return {
    counts,
    getCountForSegment,
    getTotalForLocations,
    isLoading,
  };
}

// ============ Campaign Actions Hook ============
interface UseCampaignActionsReturn {
  createCampaign: (data: CampaignFormData) => Promise<Campaign>;
  updateCampaign: (id: string, data: Partial<CampaignFormData>) => Promise<Campaign>;
  deleteCampaign: (id: string) => Promise<void>;
  sendCampaign: (id: string) => Promise<void>;
  cancelCampaign: (id: string) => Promise<void>;
  isSubmitting: boolean;
  error: Error | null;
}

export function useCampaignActions(): UseCampaignActionsReturn {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createCampaign = useCallback(async (data: CampaignFormData): Promise<Campaign> => {
    setIsSubmitting(true);
    setError(null);

    try {
      // Send segment as-is — no mapping needed
      const payload = {
        name: data.name,
        target_bucket: data.segment || 'all',
        message_template: data.customMessage || '',
        coupon_value: parseCouponValue(data.couponValue),
        coupon_code: data.couponCode || '',
        booking_link: data.templateVariables?.booking_link || '',
        scope: data.audienceType === 'all_locations' ? 'all' :
               (data.audienceType === 'select_guests' || data.audienceType === 'imported_guests') ? 'guests' :
               data.audienceType === 'select_locations' ? (data.locationIds.length > 1 ? 'multi' : 'single') : 'all',
        store_id: data.locationIds.length === 1 ? (parseInt(data.locationIds[0], 10) || undefined) : undefined,
        location_ids: data.locationIds.map(id => parseInt(id, 10)).filter(Boolean),
        guest_ids: data.guestIds || [],
        schedule_type: data.scheduleType || 'immediate',
        scheduled_at: data.scheduledAt || null,
        execute_now: data.scheduleType === 'immediate',
        is_recurring: data.scheduleType === 'recurring',
        recurring_frequency: data.recurringFrequency || '',
        recurring_start_date: data.recurringStartDate || null,
        recurring_end_date: data.recurringEndDate || null,
        recurring_time: data.recurringTime || '',
        recurring_day_of_week: data.recurringDayOfWeek ?? null,
        campaign_timezone: data.campaignTimezone || 'America/New_York',
        template_variables: data.templateVariables || {},
        visit_date_from: data.visitDateFrom || null,
        visit_date_to: data.visitDateTo || null,
      };

      const res = await exponentialApi.createCampaign(payload) as {
        status: string;
        campaign_id: number;
        name: string;
      };

      // No need to call executeCampaign separately — backend handles it when execute_now=true

      // Return a Campaign-shaped object for the caller
      const campaign: Campaign = {
        id: String(res.campaign_id),
        name: res.name || data.name,
        templateId: data.templateId,
        templateName: data.templateId ? 'Template' : 'Custom Message',
        messageContent: data.customMessage,
        segment: data.segment,
        couponValue: data.couponValue,
        couponCode: data.couponCode,
        audienceType: data.audienceType,
        locationIds: data.locationIds,
        guestIds: data.guestIds,
        recipientCount: 0,
        scheduledAt: data.scheduleType === 'scheduled' ? data.scheduledAt : null,
        sentAt: null,
        completedAt: null,
        status: data.scheduleType === 'immediate' ? 'sending' : 'draft',
        stats: { total: 0, pending: 0, sent: 0, delivered: 0, failed: 0, deliveryRate: 0 },
        createdAt: new Date().toISOString(),
        createdBy: '',
      };

      return campaign;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to create campaign');
      setError(error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const updateCampaign = useCallback(async (id: string, data: Partial<CampaignFormData>): Promise<Campaign> => {
    setIsSubmitting(true);
    setError(null);

    try {
      const payload: Record<string, any> = {};
      if (data.name !== undefined) payload.name = data.name;
      if (data.segment !== undefined) payload.target_bucket = data.segment;
      if (data.customMessage !== undefined) payload.message_template = data.customMessage;
      if (data.couponValue !== undefined) payload.coupon_value = parseCouponValue(data.couponValue);
      if (data.couponCode !== undefined) payload.coupon_code = data.couponCode;
      if (data.locationIds !== undefined) payload.location_ids = data.locationIds;
      if (data.guestIds !== undefined) payload.guest_ids = data.guestIds;
      if (data.scheduleType !== undefined) payload.schedule_type = data.scheduleType;
      if (data.scheduledAt !== undefined) payload.scheduled_at = data.scheduledAt;
      if (data.recurringFrequency !== undefined) payload.recurring_frequency = data.recurringFrequency;
      if (data.recurringStartDate !== undefined) payload.recurring_start_date = data.recurringStartDate;
      if (data.recurringEndDate !== undefined) payload.recurring_end_date = data.recurringEndDate;
      if (data.recurringTime !== undefined) payload.recurring_time = data.recurringTime;
      if (data.recurringDayOfWeek !== undefined) payload.recurring_day_of_week = data.recurringDayOfWeek;
      if (data.campaignTimezone !== undefined) payload.campaign_timezone = data.campaignTimezone;
      if (data.templateVariables !== undefined) payload.template_variables = data.templateVariables;
      if (data.templateVariables?.booking_link !== undefined) payload.booking_link = data.templateVariables.booking_link;

      await exponentialApi.updateCampaign(parseInt(id, 10), payload);
      const res = await exponentialApi.getCampaignDetail(id) as { campaign: Campaign };
      return res.campaign;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to update campaign');
      setError(error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const deleteCampaign = useCallback(async (id: string): Promise<void> => {
    setIsSubmitting(true);
    setError(null);

    try {
      await exponentialApi.deleteCampaign(parseInt(id, 10));
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to delete campaign');
      setError(error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const sendCampaign = useCallback(async (id: string): Promise<void> => {
    setIsSubmitting(true);
    setError(null);

    try {
      await exponentialApi.executeCampaign(parseInt(id, 10));
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to send campaign');
      setError(error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const cancelCampaign = useCallback(async (id: string): Promise<void> => {
    setIsSubmitting(true);
    setError(null);

    try {
      await exponentialApi.updateCampaignStatus(parseInt(id, 10), 'paused');
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to cancel campaign');
      setError(error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  return {
    createCampaign,
    updateCampaign,
    deleteCampaign,
    sendCampaign,
    cancelCampaign,
    isSubmitting,
    error,
  };
}

// ============ Helpers ============
function mapBucketToSegment(bucket: string): string {
  const map: Record<string, string> = { '4wk': '4-week', '6wk': '6-week', '8wk': '8-week' };
  return map[bucket] || bucket || 'all';
}

function getCouponRange(bucket: string): string {
  const ranges: Record<string, string> = {
    '4wk': '$10-$15', '6wk': '$15-$25', '8wk': '$25-$40',
  };
  return ranges[bucket] || '$10-$40';
}

function parseCouponValue(val: string): number {
  const num = parseFloat(val.replace(/[^0-9.]/g, ''));
  return isNaN(num) ? 0 : num;
}
