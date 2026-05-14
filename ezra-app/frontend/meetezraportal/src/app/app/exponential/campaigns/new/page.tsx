'use client';

// ===========================================
// EZRA PORTAL - New Campaign Creation Page
// Single-Page Design - All Steps Merged
// ===========================================

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  MessageSquare,
  ArrowLeft,
  Send,
  Clock,
  Users,
  MapPin,
  User,
  DollarSign,
  FileText,
  Check,
  Info,
  AlertTriangle,
  Calendar,
  Search,
  Phone,
  X,
  Upload,
  ChevronDown,
  ChevronUp,
  Link2,
  Filter,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAudienceEstimate, useCampaignActions, useCampaign } from '@/hooks/useCampaignData';
import { Card } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { exponentialApi } from '@/lib/api';
import type { CampaignSegment, CampaignAudienceType, CampaignFormData } from '@/types';

// ============ Constants ============
const TIMEZONE_OPTIONS = [
  { value: 'America/New_York', label: 'Eastern Time (ET)', short: 'ET' },
  { value: 'America/Chicago', label: 'Central Time (CT)', short: 'CT' },
  { value: 'America/Denver', label: 'Mountain Time (MT)', short: 'MT' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (PT)', short: 'PT' },
  { value: 'America/Anchorage', label: 'Alaska Time (AKT)', short: 'AKT' },
  { value: 'Pacific/Honolulu', label: 'Hawaii Time (HT)', short: 'HT' },
  { value: 'Asia/Kolkata', label: 'India Standard Time (IST)', short: 'IST' },
  { value: 'Europe/London', label: 'Greenwich Mean Time (GMT)', short: 'GMT' },
  { value: 'Europe/Paris', label: 'Central European Time (CET)', short: 'CET' },
  { value: 'Asia/Tokyo', label: 'Japan Standard Time (JST)', short: 'JST' },
  { value: 'Australia/Sydney', label: 'Australian Eastern Time (AET)', short: 'AET' },
  { value: 'UTC', label: 'UTC', short: 'UTC' },
];

// ============ Collapsible Section Component ============
interface CollapsibleSectionProps {
  number: number;
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  isExpanded: boolean;
  onToggle: () => void;
  isComplete?: boolean;
}

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
  number,
  title,
  icon,
  children,
  isExpanded,
  onToggle,
  isComplete,
}) => (
  <Card className="overflow-hidden">
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between p-4 hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-colors"
    >
      <div className="flex items-center gap-3">
        <div className={cn(
          'w-8 h-8 rounded-lg flex items-center justify-center font-semibold text-sm',
          isComplete ? 'bg-success-500/10 text-success-500' : 'bg-ezra-500/10 text-ezra-500'
        )}>
          {isComplete ? <Check className="w-5 h-5" /> : number}
        </div>
        <div className="flex items-center gap-2">
          {icon}
          <h2 className="text-lg font-semibold text-surface-900 dark:text-surface-100">{title}</h2>
        </div>
      </div>
      {isExpanded ? (
        <ChevronUp className="w-5 h-5 text-surface-500" />
      ) : (
        <ChevronDown className="w-5 h-5 text-surface-500" />
      )}
    </button>
    {isExpanded && (
      <div className="p-4 pt-0 border-t border-surface-100 dark:border-surface-800">
        {children}
      </div>
    )}
  </Card>
);

// ============ Audience Option Card ============
interface AudienceOptionProps {
  type: CampaignAudienceType;
  icon: React.ReactNode;
  title: string;
  description: string;
  isSelected: boolean;
  onSelect: () => void;
}

const AudienceOption: React.FC<AudienceOptionProps> = ({
  type, icon, title, description, isSelected, onSelect
}) => (
  <button
    onClick={onSelect}
    className={cn(
      'flex items-start gap-4 p-4 rounded-xl border-2 transition-all text-left',
      isSelected
        ? 'border-ezra-500 bg-ezra-500/5'
        : 'border-surface-200 dark:border-surface-700 hover:border-surface-300 dark:hover:border-surface-600'
    )}
  >
    <div className={cn(
      'w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0',
      isSelected ? 'bg-ezra-500/10' : 'bg-surface-100 dark:bg-surface-800'
    )}>
      {icon}
    </div>
    <div className="flex-1">
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-surface-900 dark:text-surface-100">{title}</h4>
        {isSelected && (
          <div className="w-5 h-5 rounded-full bg-ezra-500 flex items-center justify-center">
            <Check className="w-3 h-3 text-white" />
          </div>
        )}
      </div>
      <p className="text-sm text-surface-500 mt-1">{description}</p>
    </div>
  </button>
);

// ============ Guest Selector Component ============
interface GuestItem {
  id: string;
  name: string;
  phone: string;
  smsOptIn: boolean;
  storeName: string;
  segment: string;
  daysSinceLastVisit: number;
}

interface GuestSelectorProps {
  selectedGuestIds: string[];
  onSelectionChange: (ids: string[]) => void;
  segment: string;
  source?: string;
  smsStatus?: 'all' | 'opted_in' | 'opted_out';
  onTotalChange?: (total: number) => void;
}

const GuestSelector: React.FC<GuestSelectorProps> = ({ selectedGuestIds, onSelectionChange, segment, source, smsStatus = 'all', onTotalChange }) => {
  const [search, setSearch] = useState('');
  const [guests, setGuests] = useState<GuestItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const limit = 20;

  useEffect(() => {
    setLoading(true);
    const params: Record<string, any> = { page, limit };
    if (search) params.search = search;
    if (segment && segment !== 'all' && source !== 'imported') params.bucket = segment;
    if (source) params.source = source;
    if (smsStatus !== 'all') params.sms_status = smsStatus;

    exponentialApi.getGuests(params)
      .then((res: any) => {
        setGuests(res.guests || []);
        const totalCount = res.total || 0;
        setTotal(totalCount);
        // Notify parent of total count change
        if (onTotalChange) {
          onTotalChange(totalCount);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [search, segment, page, source, smsStatus, onTotalChange]);

  const toggleGuest = (guestId: string) => {
    onSelectionChange(
      selectedGuestIds.includes(guestId)
        ? selectedGuestIds.filter(id => id !== guestId)
        : [...selectedGuestIds, guestId]
    );
  };

  const selectAll = () => {
    const allIds = guests.map(g => g.id);
    const newIds = [...new Set([...selectedGuestIds, ...allIds])];
    onSelectionChange(newIds);
  };

  const deselectAll = () => {
    const pageIds = new Set(guests.map(g => g.id));
    onSelectionChange(selectedGuestIds.filter(id => !pageIds.has(id)));
  };

  const totalPages = Math.ceil(total / limit);
  const optedInCount = guests.filter(g => g.smsOptIn).length;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            placeholder="Search by name, code, or phone..."
            className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-surface-900 dark:text-surface-100 placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-ezra-500"
          />
        </div>
        {selectedGuestIds.length > 0 && (
          <span className="text-xs font-medium text-ezra-400 whitespace-nowrap">
            {selectedGuestIds.length} selected
          </span>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex gap-2 text-xs">
          <button onClick={selectAll} className="text-ezra-500 hover:text-ezra-400">Select all on page</button>
          <button onClick={deselectAll} className="text-surface-500 hover:text-surface-400">Deselect page</button>
        </div>
        <div className="text-xs text-surface-500">
          Eligible: <span className="font-medium text-success-500">{optedInCount} opted in</span>
          {guests.length - optedInCount > 0 && (
            <>, <span className="font-medium text-danger-500">{guests.length - optedInCount} opted out</span></>
          )}
        </div>
      </div>

      <div className="max-h-72 overflow-y-auto border border-surface-200 dark:border-surface-700 rounded-lg divide-y divide-surface-100 dark:divide-surface-800">
        {loading ? (
          <div className="p-4 text-center text-sm text-surface-500">Loading guests...</div>
        ) : guests.length === 0 ? (
          <div className="p-4 text-center text-sm text-surface-500">No guests found</div>
        ) : guests.map((guest) => (
          <button
            key={guest.id}
            onClick={() => toggleGuest(guest.id)}
            className={cn(
              'w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors hover:bg-surface-50 dark:hover:bg-surface-800/50',
              selectedGuestIds.includes(guest.id) && 'bg-ezra-500/5'
            )}
          >
            <div className={cn(
              'w-4 h-4 rounded border flex items-center justify-center flex-shrink-0',
              selectedGuestIds.includes(guest.id)
                ? 'bg-ezra-500 border-ezra-500'
                : 'border-surface-300 dark:border-surface-600'
            )}>
              {selectedGuestIds.includes(guest.id) && <Check className="w-3 h-3 text-white" />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-surface-900 dark:text-surface-100 truncate">{guest.name}</span>
                <span className={cn(
                  'px-1.5 py-0.5 rounded text-[10px] font-medium',
                  guest.segment === '4-week' ? 'bg-success-500/10 text-success-500' :
                  guest.segment === '6-week' ? 'bg-warning-500/10 text-warning-500' :
                  guest.segment === '8-week' ? 'bg-danger-500/10 text-danger-500' :
                  'bg-surface-200 dark:bg-surface-700 text-surface-500'
                )}>
                  {guest.segment}
                </span>
              </div>
              <div className="flex items-center gap-3 mt-0.5">
                {guest.phone && (
                  <span className="text-xs text-surface-500 flex items-center gap-1">
                    <Phone className="w-3 h-3" />{guest.phone}
                  </span>
                )}
                <span className="text-xs text-surface-500">{guest.storeName}</span>
              </div>
            </div>
            {!guest.smsOptIn && (
              <span className="text-[10px] font-semibold text-danger-500 bg-danger-500/10 px-2 py-1 rounded uppercase">
                Opted Out
              </span>
            )}
          </button>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between text-xs text-surface-500">
          <span>Page {page + 1} of {totalPages} ({total} guests)</span>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(p => Math.max(0, p - 1))}
              disabled={page === 0}
              className="px-2 py-1 rounded border border-surface-300 dark:border-surface-700 disabled:opacity-40 hover:bg-surface-100 dark:hover:bg-surface-800"
            >
              Prev
            </button>
            <button
              onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              className="px-2 py-1 rounded border border-surface-300 dark:border-surface-700 disabled:opacity-40 hover:bg-surface-100 dark:hover:bg-surface-800"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ============ Main Component ============
export default function NewCampaignPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { createCampaign, updateCampaign, isSubmitting } = useCampaignActions();
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Section expansion state
  const [expandedSections, setExpandedSections] = useState({
    message: true,
    audience: true,
    schedule: true,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // Check for imported guests from URL params
  const importedGuests = useMemo(() => {
    const raw = searchParams.get('imported_guests');
    if (!raw) return null;
    try { return JSON.parse(decodeURIComponent(raw)) as string[]; } catch { return null; }
  }, [searchParams]);

  const preSelectedSegment = searchParams.get('segment') as CampaignSegment | null;

  // CRM filter params (when redirected from CRM page)
  const fromCrm = searchParams.get('from_crm') === '1';
  const crmLocationIds = searchParams.get('location_ids')?.split(',').filter(Boolean) || [];
  const crmLocationId = searchParams.get('location_id'); // legacy single
  const crmServiceTypes = searchParams.get('service_types')?.split(',').filter(Boolean) || [];
  const crmServiceType = searchParams.get('service_type'); // legacy single
  const crmGuestType = searchParams.get('guest_type');
  const crmTotal = searchParams.get('crm_total');
  const crmDateFrom = searchParams.get('date_from');
  const crmDateTo = searchParams.get('date_to');

  // Resolved arrays (support both old single and new multi params)
  const resolvedLocationIds = crmLocationIds.length ? crmLocationIds : (crmLocationId ? [crmLocationId] : []);
  const resolvedServiceTypes = crmServiceTypes.length ? crmServiceTypes : (crmServiceType ? [crmServiceType] : []);

  // Fetch locations and segments
  const [locations, setLocations] = useState<{ id: string; name: string; storeCode: string; customerCount: number }[]>([]);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [segmentOptions, setSegmentOptions] = useState<string[]>(['all']);
  
  useEffect(() => {
    exponentialApi.getLocations()
      .then((res: any) => {
        setLocations(res.locations || []);
        setTotalCustomers(res.totalCustomers || 0);
      })
      .catch(() => {});
    exponentialApi.getSegmentConfigs()
      .then((res: any) => {
        const names = (res.segments || []).map((s: any) => s.name);
        if (names.length) setSegmentOptions(['all', ...names]);
      })
      .catch(() => {});
  }, []);

  // Determine initial audience type from CRM params
  const initialAudienceType = useMemo(() => {
    if (importedGuests?.length) return 'imported_guests';
    if (fromCrm && resolvedLocationIds.length) return 'select_locations';
    return 'all_locations';
  }, []);

  // Form state
  const [formData, setFormData] = useState<CampaignFormData>({
    name: '',
    templateId: null,
    customMessage: '',
    segment: preSelectedSegment || 'all',
    couponValue: '',
    couponCode: '',
    audienceType: initialAudienceType,
    locationIds: resolvedLocationIds,
    guestIds: importedGuests || [],
    scheduleType: 'immediate',
    scheduledAt: null,
    recurringFrequency: 'daily',
    recurringStartDate: null,
    recurringEndDate: null,
    recurringTime: '10:00',
    recurringDayOfWeek: null,
    campaignTimezone: 'America/New_York',
    templateVariables: resolvedServiceTypes.length ? { service_filter: resolvedServiceTypes.join(',') } : {},
    visitDateFrom: crmDateFrom || null,
    visitDateTo: crmDateTo || null,
  });

  const [selectedLocationIds, setSelectedLocationIds] = useState<string[]>(resolvedLocationIds);
  const [smsStatusFilter, setSmsStatusFilter] = useState<'all' | 'opted_in' | 'opted_out'>('opted_in');
  const [importedGuestsTotal, setImportedGuestsTotal] = useState<number>(0);
  const [crmFilteredTotal, setCrmFilteredTotal] = useState<number | null>(null);

  // Message Builder toggles
  const [builderOptions, setBuilderOptions] = useState({
    includeGuestName: true,
    useFirstNameOnly: true,
    includeStoreName: true,
    includeStoreAddress: false,
    includeBookingLink: false,
    includeDiscount: false,
    includeExpiration: false,
  });

  // Auto-generate message from builder options
  useEffect(() => {
    const parts: string[] = [];
    const nameVar = builderOptions.useFirstNameOnly ? '{first_name}' : '{guest_name}';

    if (builderOptions.includeGuestName) {
      parts.push(`Hi ${nameVar}!`);
    } else {
      parts.push('Hi there!');
    }

    if (builderOptions.includeStoreName && builderOptions.includeStoreAddress) {
      parts.push('We miss you at {store_name}, {store_address}.');
    } else if (builderOptions.includeStoreName) {
      parts.push('We miss you at {store_name}.');
    }

    if (builderOptions.includeDiscount) {
      parts.push('Enjoy a discount with code {coupon_code}.');
    }

    if (builderOptions.includeExpiration) {
      parts.push('Offer expires {expiration_date}.');
    }

    parts.push('Come on in or book online.');

    if (builderOptions.includeBookingLink) {
      parts.push('Book here: {booking_link}');
    }

    parts.push('Reply STOP to opt out.');

    setFormData(prev => ({ ...prev, customMessage: parts.join(' ') }));
  }, [builderOptions]);

  // Parse template variables
  const isImportedAudience = formData.audienceType === 'imported_guests';
  const autoFilledVars = useMemo(() => {
    const base = new Set(['first_name', 'guest_name', 'booking_link']);
    if (!isImportedAudience) {
      base.add('location_name');
      base.add('store_name');
      base.add('store_address');
    }
    return base;
  }, [isImportedAudience]);

  const requiredTemplateVars = useMemo(() => {
    const content = formData.customMessage;
    const matches = content.match(/\{(\w+)\}/g);
    if (!matches) return [];
    const vars = [...new Set(matches.map(m => m.slice(1, -1)))];
    return vars.filter(v => !autoFilledVars.has(v));
  }, [formData.customMessage, autoFilledVars]);

  // Fetch actual audience count from API
  const [actualRecipientCount, setActualRecipientCount] = useState<number | null>(null);
  const [loadingCount, setLoadingCount] = useState(false);

  useEffect(() => {
    // When from CRM, use the guests API with same filters for accurate count
    if (fromCrm) {
      setLoadingCount(true);
      const params: Record<string, any> = { limit: 1, page: 0 };
      if (preSelectedSegment && preSelectedSegment !== 'all') params.bucket = preSelectedSegment;
      if (resolvedLocationIds.length === 1) params.store_id = resolvedLocationIds[0];
      else if (resolvedLocationIds.length > 1) params.location_ids = resolvedLocationIds.join(',');
      if (resolvedServiceTypes.length === 1) params.last_service = resolvedServiceTypes[0];
      else if (resolvedServiceTypes.length > 1) params.last_services = resolvedServiceTypes.join(',');
      if (crmGuestType) params.guest_type = crmGuestType;
      if (crmDateFrom) params.date_from = crmDateFrom;
      if (crmDateTo) params.date_to = crmDateTo;
      params.sms_status = 'opted_in';
      exponentialApi.getGuests(params)
        .then((res: any) => {
          setActualRecipientCount(res.total || 0);
          setCrmFilteredTotal(res.total || 0);
        })
        .catch(() => setActualRecipientCount(crmFilteredTotal))
        .finally(() => setLoadingCount(false));
      return;
    }
    // Standard audience estimate for non-CRM flows
    if (formData.audienceType === 'all_locations' || formData.audienceType === 'select_locations' || formData.audienceType === 'select_guests') {
      setLoadingCount(true);
      const params: Record<string, any> = {};
      if (formData.segment && formData.segment !== 'all') params.segment = formData.segment;
      if (formData.audienceType === 'select_locations' && selectedLocationIds.length > 0) {
        params.location_ids = selectedLocationIds.join(',');
      }
      params.sms_status = smsStatusFilter;

      // Pass service type filter if set
      const serviceFilter = formData.templateVariables?.service_filter;
      if (serviceFilter) params.last_service = serviceFilter;

      exponentialApi.getAudienceEstimate(params)
        .then((res: any) => {
          const counts = res.counts || [];
          const targetSegment = formData.segment === 'all' ? 'all' : formData.segment;
          const match = counts.find((c: any) => c.segment === targetSegment);
          setActualRecipientCount(match ? match.count : 0);
        })
        .catch(() => setActualRecipientCount(null))
        .finally(() => setLoadingCount(false));
    }
  }, [fromCrm, formData.audienceType, formData.segment, selectedLocationIds, smsStatusFilter, formData.templateVariables?.service_filter]);

  // Estimated recipients
  const estimatedRecipients = useMemo(() => {
    // When from CRM, lock to the CRM-matched count — never use the generic estimate
    if (fromCrm) {
      return crmFilteredTotal ?? 0;
    }
    if (formData.audienceType === 'select_guests') {
      return actualRecipientCount ?? 0;
    }
    if (formData.audienceType === 'imported_guests') {
      return importedGuestsTotal;
    }
    if (formData.audienceType === 'all_locations' || formData.audienceType === 'select_locations') {
      return actualRecipientCount ?? 0;
    }
    return 0;
  }, [formData.audienceType, actualRecipientCount, importedGuestsTotal, crmFilteredTotal, fromCrm]);

  // Message preview — always show variable placeholders as-is
  const messagePreview = useMemo(() => {
    return formData.customMessage;
  }, [formData.customMessage]);

  // Handle location toggle
  const handleLocationToggle = (locationId: string) => {
    setSelectedLocationIds(prev => 
      prev.includes(locationId)
        ? prev.filter(id => id !== locationId)
        : [...prev, locationId]
    );
  };

  useEffect(() => {
    setFormData(prev => ({ ...prev, locationIds: selectedLocationIds }));
  }, [selectedLocationIds]);

  // Validation
  const isValid = useMemo(() => {
    if (!formData.name.length) return false;
    if (formData.customMessage.length < 20) return false;
    if (formData.audienceType === 'select_locations' && selectedLocationIds.length === 0) return false;
    if ((formData.audienceType === 'select_guests' || formData.audienceType === 'imported_guests') && formData.guestIds.length === 0) return false;
    
    const vars = formData.templateVariables || {};
    for (const v of requiredTemplateVars) {
      if (!vars[v]?.trim()) return false;
    }
    
    if (formData.scheduleType === 'scheduled' && !formData.scheduledAt) return false;
    if (formData.scheduleType === 'recurring' && (!formData.recurringStartDate || !formData.recurringEndDate)) return false;
    
    return true;
  }, [formData, selectedLocationIds, requiredTemplateVars]);

  // Handle submit
  const handleSubmit = async () => {
    setSubmitError(null);
    try {
      const submitData = { ...formData };
      const tv = submitData.templateVariables || {};
      if (tv.coupon_code) submitData.couponCode = tv.coupon_code;

      await createCampaign(submitData);
      router.push('/app/exponential/campaigns');
    } catch (error: any) {
      setSubmitError(error?.message || 'Failed to create campaign.');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link 
            href="/app/exponential/campaigns"
            className="p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-surface-500" />
          </Link>
          <div>
            <h1 className="text-2xl font-semibold text-surface-900 dark:text-surface-100">
              New Campaign
            </h1>
            <p className="text-surface-500 dark:text-surface-400">
              Create a new SMS campaign for your guests
            </p>
          </div>
        </div>
      </div>

      {submitError && (
        <div className="flex items-center gap-2 p-3 bg-danger-500/10 text-danger-500 rounded-lg text-sm">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          {submitError}
        </div>
      )}

      {/* Campaign Name - Top Level */}
      <Card>
        <div className="flex items-center gap-3">
          <FileText className="w-5 h-5 text-ezra-500 flex-shrink-0" />
          <div className="flex-1">
            <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
              Campaign Name
            </label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., February Win-Back Campaign"
              className="text-base"
            />
          </div>
        </div>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Form Area */}
        <div className="lg:col-span-2 space-y-4">

          {/* CRM Filter Banner (shown at top when redirected from CRM) */}
          {fromCrm && (
            <div className="p-4 bg-ezra-500/5 border border-ezra-500/20 rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-surface-900 dark:text-surface-100 flex items-center gap-2">
                    <Filter className="w-4 h-4 text-ezra-500" />
                    Campaign from CRM Filters
                  </p>
                  <p className="text-xs text-surface-500 mt-0.5">Your audience is pre-filtered based on CRM selections</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {preSelectedSegment && preSelectedSegment !== 'all' && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-300">Segment: {preSelectedSegment}</span>
                    )}
                    {resolvedLocationIds.length > 0 && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-300">
                        {resolvedLocationIds.length === 1
                          ? `Location: ${locations.find(l => l.id === resolvedLocationIds[0])?.name || resolvedLocationIds[0]}`
                          : `${resolvedLocationIds.length} Locations`}
                      </span>
                    )}
                    {resolvedServiceTypes.length > 0 && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-300">
                        {resolvedServiceTypes.length === 1 ? `Service: ${resolvedServiceTypes[0]}` : `${resolvedServiceTypes.length} Services`}
                      </span>
                    )}
                    {crmGuestType && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-300">Type: {crmGuestType === 'imported' ? 'CRM Guests' : 'Store Guests'}</span>
                    )}
                    {crmDateFrom && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-300">From: {crmDateFrom}</span>
                    )}
                    {crmDateTo && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-300">To: {crmDateTo}</span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-lg font-bold text-ezra-500">
                    {crmFilteredTotal !== null ? crmFilteredTotal.toLocaleString() : (loadingCount ? '...' : '—')}
                  </span>
                  <p className="text-xs text-surface-500">eligible guests</p>
                </div>
              </div>
            </div>
          )}

          {/* Section 1: Message Elements */}
          <CollapsibleSection
            number={1}
            title="Message Elements"
            icon={<MessageSquare className="w-5 h-5 text-ezra-500" />}
            isExpanded={expandedSections.message}
            onToggle={() => toggleSection('message')}
            isComplete={formData.customMessage.length >= 20}
          >
            <div className="space-y-4">
              {/* Segment Selector (hidden when from CRM since segment is pre-set) */}
              {!fromCrm && (
              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                  Target Segment
                </label>
                <div className="flex flex-wrap gap-2">
                  {segmentOptions.map((seg) => (
                    <button
                      key={seg}
                      onClick={() => setFormData(prev => ({ ...prev, segment: seg }))}
                      className={cn(
                        'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                        formData.segment === seg
                          ? 'bg-ezra-500 text-white'
                          : 'bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-400 hover:bg-surface-200 dark:hover:bg-surface-700'
                      )}
                    >
                      {seg === 'all' ? 'All Segments' : seg}
                    </button>
                  ))}
                </div>
              </div>
              )}

              {/* Message Builder Toggles */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300">
                  Message Elements
                </label>

                {/* Guest Name */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 rounded-lg border border-surface-200 dark:border-surface-700">
                    <div className="flex items-center gap-3">
                      <User className="w-4 h-4 text-surface-400" />
                      <span className="text-sm text-surface-900 dark:text-surface-100">Include guest name</span>
                    </div>
                    <div className="flex items-center gap-3">
                      {builderOptions.includeGuestName && (
                        <select
                          value={builderOptions.useFirstNameOnly ? 'first' : 'full'}
                          onChange={(e) => setBuilderOptions(prev => ({ ...prev, useFirstNameOnly: e.target.value === 'first' }))}
                          className="text-xs px-2 py-1 rounded border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-surface-700 dark:text-surface-300"
                        >
                          <option value="first">First name</option>
                          <option value="full">Full name</option>
                        </select>
                      )}
                      <button
                        onClick={() => setBuilderOptions(prev => ({ ...prev, includeGuestName: !prev.includeGuestName }))}
                        className={cn('w-10 h-6 rounded-full transition-colors relative', builderOptions.includeGuestName ? 'bg-ezra-500' : 'bg-surface-300 dark:bg-surface-600')}
                      >
                        <div className={cn('w-4 h-4 rounded-full bg-white absolute top-1 transition-transform', builderOptions.includeGuestName ? 'translate-x-5' : 'translate-x-1')} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Store Name */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 rounded-lg border border-surface-200 dark:border-surface-700">
                    <div className="flex items-center gap-3">
                      <MapPin className="w-4 h-4 text-surface-400" />
                      <span className="text-sm text-surface-900 dark:text-surface-100">Include store name</span>
                    </div>
                    <button
                      onClick={() => setBuilderOptions(prev => ({ ...prev, includeStoreName: !prev.includeStoreName }))}
                      className={cn('w-10 h-6 rounded-full transition-colors relative', builderOptions.includeStoreName ? 'bg-ezra-500' : 'bg-surface-300 dark:bg-surface-600')}
                    >
                      <div className={cn('w-4 h-4 rounded-full bg-white absolute top-1 transition-transform', builderOptions.includeStoreName ? 'translate-x-5' : 'translate-x-1')} />
                    </button>
                  </div>
                  {builderOptions.includeStoreName && isImportedAudience && (
                    <div className="ml-7 p-3 bg-amber-500/5 border border-amber-500/20 rounded-lg">
                      <label className="block text-xs font-medium text-surface-700 dark:text-surface-300 mb-1.5">
                        Store Name (for CRM guests)
                      </label>
                      <Input
                        value={(formData.templateVariables || {}).store_name || ''}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          templateVariables: { ...prev.templateVariables, store_name: e.target.value },
                        }))}
                        placeholder="e.g., Supercuts Downtown"
                        className="text-sm"
                      />
                    </div>
                  )}
                </div>

                {/* Store Address */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 rounded-lg border border-surface-200 dark:border-surface-700">
                    <div className="flex items-center gap-3">
                      <MapPin className="w-4 h-4 text-surface-400" />
                      <span className="text-sm text-surface-900 dark:text-surface-100">Include store address</span>
                    </div>
                    <button
                      onClick={() => setBuilderOptions(prev => ({ ...prev, includeStoreAddress: !prev.includeStoreAddress }))}
                      className={cn('w-10 h-6 rounded-full transition-colors relative', builderOptions.includeStoreAddress ? 'bg-ezra-500' : 'bg-surface-300 dark:bg-surface-600')}
                    >
                      <div className={cn('w-4 h-4 rounded-full bg-white absolute top-1 transition-transform', builderOptions.includeStoreAddress ? 'translate-x-5' : 'translate-x-1')} />
                    </button>
                  </div>
                  {builderOptions.includeStoreAddress && isImportedAudience && (
                    <div className="ml-7 p-3 bg-amber-500/5 border border-amber-500/20 rounded-lg">
                      <label className="block text-xs font-medium text-surface-700 dark:text-surface-300 mb-1.5">
                        Store Address (for CRM guests)
                      </label>
                      <Input
                        value={(formData.templateVariables || {}).store_address || ''}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          templateVariables: { ...prev.templateVariables, store_address: e.target.value },
                        }))}
                        placeholder="e.g., 123 Main St, Minneapolis, MN 55401"
                        className="text-sm"
                      />
                    </div>
                  )}
                </div>

                {/* Booking Link */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 rounded-lg border border-surface-200 dark:border-surface-700">
                    <div className="flex items-center gap-3">
                      <Link2 className="w-4 h-4 text-surface-400" />
                      <span className="text-sm text-surface-900 dark:text-surface-100">Include booking link</span>
                    </div>
                    <button
                      onClick={() => setBuilderOptions(prev => ({ ...prev, includeBookingLink: !prev.includeBookingLink }))}
                      className={cn('w-10 h-6 rounded-full transition-colors relative', builderOptions.includeBookingLink ? 'bg-ezra-500' : 'bg-surface-300 dark:bg-surface-600')}
                    >
                      <div className={cn('w-4 h-4 rounded-full bg-white absolute top-1 transition-transform', builderOptions.includeBookingLink ? 'translate-x-5' : 'translate-x-1')} />
                    </button>
                  </div>
                </div>

                {/* Discount Code */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 rounded-lg border border-surface-200 dark:border-surface-700">
                    <div className="flex items-center gap-3">
                      <DollarSign className="w-4 h-4 text-surface-400" />
                      <span className="text-sm text-surface-900 dark:text-surface-100">Include discount code</span>
                    </div>
                    <button
                      onClick={() => setBuilderOptions(prev => ({ ...prev, includeDiscount: !prev.includeDiscount }))}
                      className={cn('w-10 h-6 rounded-full transition-colors relative', builderOptions.includeDiscount ? 'bg-ezra-500' : 'bg-surface-300 dark:bg-surface-600')}
                    >
                      <div className={cn('w-4 h-4 rounded-full bg-white absolute top-1 transition-transform', builderOptions.includeDiscount ? 'translate-x-5' : 'translate-x-1')} />
                    </button>
                  </div>
                  {builderOptions.includeDiscount && (
                    <div className="ml-7 p-3 bg-ezra-500/5 border border-ezra-500/20 rounded-lg">
                      <label className="block text-xs font-medium text-surface-700 dark:text-surface-300 mb-1.5">
                        🏷️ Discount Code
                      </label>
                      <Input
                          value={(formData.templateVariables || {}).coupon_code || ''}
                          onChange={(e) => {
                            const val = e.target.value.toUpperCase().slice(0, 15);
                            setFormData(prev => ({
                              ...prev,
                              templateVariables: { ...prev.templateVariables, coupon_code: val },
                            }));
                          }}
                          placeholder="SAVE20"
                          className="text-sm uppercase"
                        />
                    </div>
                  )}
                </div>

                {/* Expiration Date */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 rounded-lg border border-surface-200 dark:border-surface-700">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-4 h-4 text-surface-400" />
                      <span className="text-sm text-surface-900 dark:text-surface-100">Include expiration date</span>
                    </div>
                    <button
                      onClick={() => setBuilderOptions(prev => ({ ...prev, includeExpiration: !prev.includeExpiration }))}
                      className={cn('w-10 h-6 rounded-full transition-colors relative', builderOptions.includeExpiration ? 'bg-ezra-500' : 'bg-surface-300 dark:bg-surface-600')}
                    >
                      <div className={cn('w-4 h-4 rounded-full bg-white absolute top-1 transition-transform', builderOptions.includeExpiration ? 'translate-x-5' : 'translate-x-1')} />
                    </button>
                  </div>
                  {builderOptions.includeExpiration && (
                    <div className="ml-7 p-3 bg-ezra-500/5 border border-ezra-500/20 rounded-lg">
                      <label className="block text-xs font-medium text-surface-700 dark:text-surface-300 mb-1.5">
                        📅 Expiration Date
                      </label>
                      <Input
                        type="date"
                        min={new Date().toISOString().split('T')[0]}
                        value={(formData.templateVariables || {}).expiration_date || ''}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          templateVariables: { ...prev.templateVariables, expiration_date: e.target.value },
                        }))}
                        className="text-sm [color-scheme:dark]"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Editable Message */}
              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                  Edit Message
                </label>
                <textarea
                  value={formData.customMessage}
                  onChange={(e) => setFormData(prev => ({ ...prev, customMessage: e.target.value }))}
                  className="w-full px-4 py-3 rounded-lg border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-surface-900 dark:text-surface-100 placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-ezra-500 resize-vertical max-h-64 overflow-y-auto font-mono text-sm"
                  rows={5}
                />
                <div className="flex items-center justify-between mt-2">
                  <p className="text-xs text-surface-500">
                    Variables in {'{braces}'} are auto-filled per recipient
                  </p>
                  <span className={cn('text-xs font-medium', formData.customMessage.length > 160 ? 'text-warning-500' : 'text-surface-400')}>
                    {formData.customMessage.length} chars
                  </span>
                </div>
                <div className="mt-2 p-2.5 bg-amber-500/5 border border-amber-500/20 rounded-lg">
                  <p className="text-xs text-amber-600 dark:text-amber-400">
                    <Info className="w-3 h-3 inline mr-1 -mt-0.5" />
                    Do not edit the variable names inside {'{braces}'} (e.g. {'{first_name}'}, {'{store_name}'}). Edit everything around them to customize your message.
                  </p>
                </div>
              </div>
            </div>
          </CollapsibleSection>

          {/* Section 2: Select Audience */}
          <CollapsibleSection
            number={2}
            title="Select Audience"
            icon={<Users className="w-5 h-5 text-ezra-500" />}
            isExpanded={expandedSections.audience}
            onToggle={() => toggleSection('audience')}
            isComplete={
              formData.audienceType === 'all_locations' ||
              (formData.audienceType === 'select_locations' && selectedLocationIds.length > 0) ||
              ((formData.audienceType === 'select_guests' || formData.audienceType === 'imported_guests') && formData.guestIds.length > 0)
            }
          >
            <div className="space-y-4">
              {/* Audience Type Selection */}
              <div className="space-y-3">
                <AudienceOption
                  type="all_locations"
                  icon={<MapPin className={cn('w-5 h-5', formData.audienceType === 'all_locations' ? 'text-ezra-500' : 'text-surface-500')} />}
                  title="All Locations"
                  description={`Send to all guests across all ${locations.length} locations (${totalCustomers.toLocaleString()} customers)`}
                  isSelected={formData.audienceType === 'all_locations'}
                  onSelect={() => setFormData(prev => ({ ...prev, audienceType: 'all_locations' }))}
                />
                <AudienceOption
                  type="select_locations"
                  icon={<MapPin className={cn('w-5 h-5', formData.audienceType === 'select_locations' ? 'text-ezra-500' : 'text-surface-500')} />}
                  title="Select Locations"
                  description="Choose specific locations to target"
                  isSelected={formData.audienceType === 'select_locations'}
                  onSelect={() => setFormData(prev => ({ ...prev, audienceType: 'select_locations' }))}
                />
                <AudienceOption
                  type="select_guests"
                  icon={<User className={cn('w-5 h-5', formData.audienceType === 'select_guests' ? 'text-ezra-500' : 'text-surface-500')} />}
                  title="All Guests"
                  description="Select from all guests across your database"
                  isSelected={formData.audienceType === 'select_guests'}
                  onSelect={() => setFormData(prev => ({ ...prev, audienceType: 'select_guests' }))}
                />
                <AudienceOption
                  type="imported_guests"
                  icon={<Upload className={cn('w-5 h-5', formData.audienceType === 'imported_guests' ? 'text-ezra-500' : 'text-surface-500')} />}
                  title="CRM Guests"
                  description="Guests imported from your CRM system"
                  isSelected={formData.audienceType === 'imported_guests'}
                  onSelect={() => setFormData(prev => ({ ...prev, audienceType: 'imported_guests' }))}
                />
              </div>

              {/* Filters Section - Show for guest selection modes (except imported guests) */}
              {(formData.audienceType === 'select_guests' || formData.audienceType === 'all_locations' || formData.audienceType === 'select_locations') && (
                <div className="border-t border-surface-200 dark:border-surface-700 pt-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Info className="w-4 h-4 text-ezra-500" />
                    <h4 className="text-sm font-semibold text-surface-900 dark:text-surface-100">
                      Audience Filters
                    </h4>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    {/* Segment Filter */}
                    <div>
                      <label className="block text-xs font-medium text-surface-700 dark:text-surface-300 mb-1.5">
                        Segment
                      </label>
                      <select
                        value={formData.segment}
                        onChange={(e) => setFormData(prev => ({ ...prev, segment: e.target.value }))}
                        className="w-full px-3 py-2 text-sm rounded-lg border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-surface-900 dark:text-surface-100 focus:outline-none focus:ring-2 focus:ring-ezra-500"
                      >
                        <option value="all">All Segments</option>
                        {segmentOptions.filter(s => s !== 'all').map((seg) => (
                          <option key={seg} value={seg}>{seg}</option>
                        ))}
                      </select>
                    </div>

                    {/* Opt-in Status Filter */}
                    <div>
                      <label className="block text-xs font-medium text-surface-700 dark:text-surface-300 mb-1.5">
                        SMS Status
                      </label>
                      <select
                        value={smsStatusFilter}
                        onChange={(e) => setSmsStatusFilter(e.target.value as 'all' | 'opted_in' | 'opted_out')}
                        className="w-full px-3 py-2 text-sm rounded-lg border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-surface-900 dark:text-surface-100 focus:outline-none focus:ring-2 focus:ring-ezra-500"
                      >
                        <option value="all">All Guests</option>
                        <option value="opted_in">Opted In Only</option>
                        <option value="opted_out">Opted Out Only</option>
                      </select>
                    </div>

                    {/* Service Type Filter */}
                    <div className="col-span-2">
                      <label className="block text-xs font-medium text-surface-700 dark:text-surface-300 mb-1.5">
                        Service Type
                      </label>
                      <input
                        type="text"
                        value={formData.templateVariables?.service_filter || ''}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          templateVariables: { ...prev.templateVariables, service_filter: e.target.value },
                        }))}
                        placeholder="Filter by service (e.g. Supercut, Highlights...)"
                        className="w-full px-3 py-2 text-sm rounded-lg border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-surface-900 dark:text-surface-100 placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-ezra-500"
                      />
                    </div>
                  </div>

                  {/* Eligible Recipients Summary */}
                  <div className="flex items-center justify-between p-3 bg-ezra-500/5 border border-ezra-500/20 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-ezra-500" />
                      <span className="text-sm font-medium text-surface-900 dark:text-surface-100">
                        Eligible Recipients
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-ezra-500">
                        {estimatedRecipients.toLocaleString()}
                      </div>
                      <div className="text-xs text-surface-500">
                        Based on current filters
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Location Selection */}
              {formData.audienceType === 'select_locations' && (
                <div className="border-t border-surface-200 dark:border-surface-700 pt-4">
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-medium text-surface-700 dark:text-surface-300">
                      Select Locations
                    </label>
                    <button
                      onClick={() => setSelectedLocationIds(
                        selectedLocationIds.length === locations.length ? [] : locations.map(l => l.id)
                      )}
                      className="text-sm text-ezra-500 hover:text-ezra-600"
                    >
                      {selectedLocationIds.length === locations.length ? 'Deselect All' : 'Select All'}
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
                    {locations.map((location) => (
                      <button
                        key={location.id}
                        onClick={() => handleLocationToggle(location.id)}
                        className={cn(
                          'flex items-center gap-2 p-3 rounded-lg border text-left transition-colors',
                          selectedLocationIds.includes(location.id)
                            ? 'border-ezra-500 bg-ezra-500/5'
                            : 'border-surface-200 dark:border-surface-700 hover:border-surface-300 dark:hover:border-surface-600'
                        )}
                      >
                        <div className={cn(
                          'w-4 h-4 rounded border flex items-center justify-center flex-shrink-0',
                          selectedLocationIds.includes(location.id)
                            ? 'bg-ezra-500 border-ezra-500'
                            : 'border-surface-300 dark:border-surface-600'
                        )}>
                          {selectedLocationIds.includes(location.id) && (
                            <Check className="w-3 h-3 text-white" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-surface-900 dark:text-surface-100 truncate">
                            {location.name}
                          </p>
                          <div className="flex items-center justify-between">
                            <p className="text-xs text-surface-500">{location.storeCode}</p>
                            <p className="text-xs font-medium text-ezra-400">{location.customerCount?.toLocaleString() || 0} guests</p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Guest Selection */}
              {formData.audienceType === 'select_guests' && (
                <div className="border-t border-surface-200 dark:border-surface-700 pt-4">
                  <GuestSelector
                    selectedGuestIds={formData.guestIds}
                    onSelectionChange={(ids) => setFormData(prev => ({ ...prev, guestIds: ids }))}
                    segment={formData.segment}
                    smsStatus={smsStatusFilter}
                    onTotalChange={setActualRecipientCount}
                  />
                </div>
              )}

              {/* Imported Guest Selection */}
              {formData.audienceType === 'imported_guests' && (
                <div className="border-t border-surface-200 dark:border-surface-700 pt-4 space-y-4">
                  {/* Eligible Recipients Summary for Imported Guests */}
                  <div className="flex items-center justify-between p-3 bg-ezra-500/5 border border-ezra-500/20 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-ezra-500" />
                      <span className="text-sm font-medium text-surface-900 dark:text-surface-100">
                        Eligible Recipients
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-ezra-500">
                        {importedGuestsTotal.toLocaleString()}
                      </div>
                      <div className="text-xs text-surface-500">
                        Total CRM guests
                      </div>
                    </div>
                  </div>
                  
                  <GuestSelector
                    selectedGuestIds={formData.guestIds}
                    onSelectionChange={(ids) => setFormData(prev => ({ ...prev, guestIds: ids }))}
                    segment="all"
                    source="imported"
                    smsStatus="all"
                    onTotalChange={setImportedGuestsTotal}
                  />
                </div>
              )}
            </div>
          </CollapsibleSection>

          {/* Section 3: Schedule */}
          <CollapsibleSection
            number={3}
            title="Schedule"
            icon={<Calendar className="w-5 h-5 text-ezra-500" />}
            isExpanded={expandedSections.schedule}
            onToggle={() => toggleSection('schedule')}
            isComplete={
              formData.scheduleType === 'immediate' ||
              (formData.scheduleType === 'scheduled' && formData.scheduledAt !== null) ||
              (formData.scheduleType === 'recurring' && formData.recurringStartDate !== null && formData.recurringEndDate !== null)
            }
          >
            <div className="space-y-4">
              {/* Send Immediately */}
              <button
                onClick={() => setFormData(prev => ({ ...prev, scheduleType: 'immediate', scheduledAt: null }))}
                className={cn(
                  'w-full p-4 rounded-xl border-2 text-left transition-all',
                  formData.scheduleType === 'immediate'
                    ? 'border-ezra-500 bg-ezra-500/5'
                    : 'border-surface-200 dark:border-surface-700 hover:border-surface-300 dark:hover:border-surface-600'
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    'w-10 h-10 rounded-lg flex items-center justify-center',
                    formData.scheduleType === 'immediate' ? 'bg-ezra-500/10' : 'bg-surface-100 dark:bg-surface-800'
                  )}>
                    <Send className={cn('w-5 h-5', formData.scheduleType === 'immediate' ? 'text-ezra-500' : 'text-surface-500')} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-surface-900 dark:text-surface-100">Send Immediately</h4>
                    <p className="text-sm text-surface-500">Send to all recipients as soon as you confirm</p>
                  </div>
                  {formData.scheduleType === 'immediate' && (
                    <div className="w-5 h-5 rounded-full bg-ezra-500 flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
              </button>

              {/* Schedule for Later */}
              <button
                onClick={() => setFormData(prev => ({ ...prev, scheduleType: 'scheduled' }))}
                className={cn(
                  'w-full p-4 rounded-xl border-2 text-left transition-all',
                  (formData.scheduleType === 'scheduled' || formData.scheduleType === 'recurring')
                    ? 'border-ezra-500 bg-ezra-500/5'
                    : 'border-surface-200 dark:border-surface-700 hover:border-surface-300 dark:hover:border-surface-600'
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    'w-10 h-10 rounded-lg flex items-center justify-center',
                    (formData.scheduleType === 'scheduled' || formData.scheduleType === 'recurring') ? 'bg-ezra-500/10' : 'bg-surface-100 dark:bg-surface-800'
                  )}>
                    <Clock className={cn('w-5 h-5', (formData.scheduleType === 'scheduled' || formData.scheduleType === 'recurring') ? 'text-ezra-500' : 'text-surface-500')} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-surface-900 dark:text-surface-100">Schedule for Later</h4>
                    <p className="text-sm text-surface-500">Choose when to send your campaign</p>
                  </div>
                  {(formData.scheduleType === 'scheduled' || formData.scheduleType === 'recurring') && (
                    <div className="w-5 h-5 rounded-full bg-ezra-500 flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
              </button>

              {/* Schedule for Later - Sub Options */}
              {(formData.scheduleType === 'scheduled' || formData.scheduleType === 'recurring') && (
                <div className="ml-4 pl-4 border-l-2 border-ezra-500/30 space-y-4">
                  <p className="text-sm font-medium text-surface-700 dark:text-surface-300">
                    Choose scheduling type:
                  </p>
                  
                  {/* Sub-option cards */}
                  <div className="grid grid-cols-2 gap-3">
                    {/* Specific Date/Time */}
                    <button
                      onClick={() => setFormData(prev => ({ ...prev, scheduleType: 'scheduled' }))}
                      className={cn(
                        'p-4 rounded-xl border-2 text-left transition-all',
                        formData.scheduleType === 'scheduled'
                          ? 'border-ezra-500 bg-white dark:bg-surface-900'
                          : 'border-surface-200 dark:border-surface-700 hover:border-surface-300 dark:hover:border-surface-600 bg-white dark:bg-surface-900'
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <div className={cn(
                          'w-4 h-4 mt-0.5 rounded-full border-2 flex items-center justify-center flex-shrink-0',
                          formData.scheduleType === 'scheduled'
                            ? 'border-ezra-500 bg-ezra-500'
                            : 'border-surface-300 dark:border-surface-600'
                        )}>
                          {formData.scheduleType === 'scheduled' && (
                            <div className="w-1.5 h-1.5 rounded-full bg-white" />
                          )}
                        </div>
                        <div>
                          <h4 className="font-medium text-surface-900 dark:text-surface-100 text-sm">Specific Date & Time</h4>
                          <p className="text-xs text-surface-500 mt-0.5">Send once at a scheduled time</p>
                        </div>
                      </div>
                    </button>

                    {/* Time Period */}
                    <button
                      onClick={() => setFormData(prev => ({ ...prev, scheduleType: 'recurring' }))}
                      className={cn(
                        'p-4 rounded-xl border-2 text-left transition-all',
                        formData.scheduleType === 'recurring'
                          ? 'border-ezra-500 bg-white dark:bg-surface-900'
                          : 'border-surface-200 dark:border-surface-700 hover:border-surface-300 dark:hover:border-surface-600 bg-white dark:bg-surface-900'
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <div className={cn(
                          'w-4 h-4 mt-0.5 rounded-full border-2 flex items-center justify-center flex-shrink-0',
                          formData.scheduleType === 'recurring'
                            ? 'border-ezra-500 bg-ezra-500'
                            : 'border-surface-300 dark:border-surface-600'
                        )}>
                          {formData.scheduleType === 'recurring' && (
                            <div className="w-1.5 h-1.5 rounded-full bg-white" />
                          )}
                        </div>
                        <div>
                          <h4 className="font-medium text-surface-900 dark:text-surface-100 text-sm">Set Time Period</h4>
                          <p className="text-xs text-surface-500 mt-0.5">Run over a date range</p>
                        </div>
                      </div>
                    </button>
                  </div>

                  {/* Specific Date/Time Options */}
                  {formData.scheduleType === 'scheduled' && (
                    <div className="p-4 bg-surface-50 dark:bg-surface-800/50 rounded-xl space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                          Send Date & Time
                        </label>
                        <Input
                          type="datetime-local"
                          value={formData.scheduledAt || ''}
                          onChange={(e) => setFormData(prev => ({ ...prev, scheduledAt: e.target.value }))}
                          min={new Date().toISOString().slice(0, 16)}
                          className="[color-scheme:dark]"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                          Timezone
                        </label>
                        <select
                          value={formData.campaignTimezone || 'America/New_York'}
                          onChange={(e) => setFormData(prev => ({ ...prev, campaignTimezone: e.target.value }))}
                          className="w-full px-4 py-2 rounded-lg border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-surface-900 dark:text-surface-100 focus:outline-none focus:ring-2 focus:ring-ezra-500"
                        >
                          {TIMEZONE_OPTIONS.map((tz) => (
                            <option key={tz.value} value={tz.value}>
                              {tz.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      <p className="text-xs text-surface-500">
                        Campaign will be sent at the specified date/time in the chosen timezone.
                      </p>
                    </div>
                  )}

                  {/* Time Period Options */}
                  {formData.scheduleType === 'recurring' && (
                    <div className="p-4 bg-surface-50 dark:bg-surface-800/50 rounded-xl space-y-4">
                      {/* Frequency */}
                      <div>
                        <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                          Send Frequency
                        </label>
                        <div className="grid grid-cols-4 gap-2">
                          {[
                            { value: 'daily', label: 'Daily' },
                            { value: 'weekly', label: 'Weekly' },
                            { value: 'biweekly', label: 'Bi-Weekly' },
                            { value: 'monthly', label: 'Monthly' },
                          ].map((freq) => (
                            <button
                              key={freq.value}
                              onClick={() => setFormData(prev => ({ ...prev, recurringFrequency: freq.value as 'daily' | 'weekly' | 'biweekly' | 'monthly' }))}
                              className={cn(
                                'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                                formData.recurringFrequency === freq.value
                                  ? 'bg-ezra-500 text-white'
                                  : 'bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-700 text-surface-600 dark:text-surface-400 hover:border-surface-300'
                              )}
                            >
                              {freq.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Day of Week for Weekly/Bi-Weekly */}
                      {(formData.recurringFrequency === 'weekly' || formData.recurringFrequency === 'biweekly') && (
                        <div>
                          <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                            Day of Week to Send
                          </label>
                          <div className="grid grid-cols-7 gap-2">
                            {[
                              { value: 0, label: 'Sun' },
                              { value: 1, label: 'Mon' },
                              { value: 2, label: 'Tue' },
                              { value: 3, label: 'Wed' },
                              { value: 4, label: 'Thu' },
                              { value: 5, label: 'Fri' },
                              { value: 6, label: 'Sat' },
                            ].map((day) => (
                              <button
                                key={day.value}
                                onClick={() => setFormData(prev => ({ ...prev, recurringDayOfWeek: day.value }))}
                                className={cn(
                                  'px-2 py-2 rounded-lg text-xs font-medium transition-colors',
                                  formData.recurringDayOfWeek === day.value
                                    ? 'bg-ezra-500 text-white'
                                    : 'bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-700 text-surface-600 dark:text-surface-400 hover:border-surface-300'
                                )}
                              >
                                {day.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Day of Month for Monthly */}
                      {formData.recurringFrequency === 'monthly' && (
                        <div>
                          <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                            Day of Month to Send
                          </label>
                          <select
                            value={formData.recurringDayOfWeek ?? 1}
                            onChange={(e) => setFormData(prev => ({ ...prev, recurringDayOfWeek: parseInt(e.target.value) }))}
                            className="w-full px-4 py-2 rounded-lg border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-surface-900 dark:text-surface-100 focus:outline-none focus:ring-2 focus:ring-ezra-500"
                          >
                            {Array.from({ length: 28 }, (_, i) => i + 1).map((day) => (
                              <option key={day} value={day}>
                                {day}{day === 1 ? 'st' : day === 2 ? 'nd' : day === 3 ? 'rd' : 'th'} of the month
                              </option>
                            ))}
                          </select>
                          <p className="text-xs text-surface-500 mt-1">
                            Campaign will send on this day each month (max 28th to ensure all months are covered)
                          </p>
                        </div>
                      )}

                      {/* Date Range */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                            Start Date
                          </label>
                          <Input
                            type="date"
                            value={formData.recurringStartDate || ''}
                            onChange={(e) => setFormData(prev => ({ ...prev, recurringStartDate: e.target.value }))}
                            min={new Date().toISOString().split('T')[0]}
                            className="[color-scheme:dark]"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                            End Date
                          </label>
                          <Input
                            type="date"
                            value={formData.recurringEndDate || ''}
                            onChange={(e) => setFormData(prev => ({ ...prev, recurringEndDate: e.target.value }))}
                            min={formData.recurringStartDate || new Date().toISOString().split('T')[0]}
                            className="[color-scheme:dark]"
                          />
                        </div>
                      </div>

                      {/* Send Time */}
                      <div>
                        <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                          Send Time
                        </label>
                        <Input
                          type="time"
                          value={formData.recurringTime || '10:00'}
                          onChange={(e) => setFormData(prev => ({ ...prev, recurringTime: e.target.value }))}
                          className="[color-scheme:dark]"
                        />
                      </div>

                      {/* Timezone */}
                      <div>
                        <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                          Timezone
                        </label>
                        <select
                          value={formData.campaignTimezone || 'America/New_York'}
                          onChange={(e) => setFormData(prev => ({ ...prev, campaignTimezone: e.target.value }))}
                          className="w-full px-4 py-2 rounded-lg border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-surface-900 dark:text-surface-100 focus:outline-none focus:ring-2 focus:ring-ezra-500"
                        >
                          {TIMEZONE_OPTIONS.map((tz) => (
                            <option key={tz.value} value={tz.value}>
                              {tz.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Summary */}
                      {formData.recurringStartDate && formData.recurringEndDate && (
                        <div className="flex items-start gap-3 p-3 bg-ezra-500/10 rounded-lg">
                          <Info className="w-4 h-4 text-ezra-500 flex-shrink-0 mt-0.5" />
                          <p className="text-sm text-ezra-700 dark:text-ezra-400">
                            Campaign will send <strong>{formData.recurringFrequency || 'daily'}</strong>
                            {(formData.recurringFrequency === 'weekly' || formData.recurringFrequency === 'biweekly') && formData.recurringDayOfWeek !== null && (
                              <> on <strong>{['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][formData.recurringDayOfWeek]}</strong></>
                            )}
                            {formData.recurringFrequency === 'monthly' && formData.recurringDayOfWeek !== null && (
                              <> on the <strong>{formData.recurringDayOfWeek}{formData.recurringDayOfWeek === 1 ? 'st' : formData.recurringDayOfWeek === 2 ? 'nd' : formData.recurringDayOfWeek === 3 ? 'rd' : 'th'}</strong></>
                            )} at{' '}
                            <strong>{formData.recurringTime || '10:00'}</strong> from{' '}
                            <strong>{new Date(formData.recurringStartDate).toLocaleDateString()}</strong> to{' '}
                            <strong>{new Date(formData.recurringEndDate).toLocaleDateString()}</strong>.
                            New guests entering the segment will automatically receive the message.
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Warning for immediate send */}
              {formData.scheduleType === 'immediate' && (
                <div className="flex items-start gap-3 p-4 bg-warning-500/10 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-warning-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-warning-700 dark:text-warning-400">
                      Immediate Send Warning
                    </p>
                    <p className="text-sm text-warning-600 dark:text-warning-500 mt-1">
                      Messages will start sending immediately after you click "Send Campaign". 
                      This action cannot be undone once sending begins.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CollapsibleSection>
        </div>

        {/* Right Sidebar - Message Preview & Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-6 space-y-4">
          {/* Message Preview */}
          <Card>
            <div className="p-4 border-b border-surface-100 dark:border-surface-800">
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare className="w-4 h-4 text-ezra-500" />
                <h3 className="font-semibold text-surface-900 dark:text-surface-100">Message Preview</h3>
              </div>
              <p className="text-xs text-surface-500">Sample with dynamic variables</p>
            </div>
            <div className="p-4">
              <div className="bg-surface-50 dark:bg-surface-800/50 rounded-lg p-4 border border-surface-200 dark:border-surface-700">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-ezra-500/10 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-4 h-4 text-ezra-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-surface-500 mb-1">SMS Preview</p>
                    <p className="text-sm text-surface-900 dark:text-surface-100 whitespace-pre-wrap break-words">
                      {messagePreview}
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-3 p-2 bg-amber-500/5 border border-amber-500/20 rounded text-xs text-surface-600 dark:text-surface-400">
                <Info className="w-3 h-3 inline mr-1" />
                Variables in <span className="font-mono font-semibold">{'{braces}'}</span> are replaced with actual values when sent
              </div>
            </div>
          </Card>

          {/* Campaign Summary */}
          <Card>
            <div className="p-4 border-b border-surface-100 dark:border-surface-800">
              <h3 className="font-semibold text-surface-900 dark:text-surface-100">Campaign Summary</h3>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex items-start justify-between">
                <span className="text-sm text-surface-500">Segment</span>
                <span className="text-sm font-medium text-surface-900 dark:text-surface-100 text-right">
                  {formData.segment === 'all' ? 'All Segments' : formData.segment}
                </span>
              </div>
              <div className="flex items-start justify-between">
                <span className="text-sm text-surface-500">Audience</span>
                <span className="text-sm font-medium text-surface-900 dark:text-surface-100 text-right">
                  {formData.audienceType === 'all_locations' && 'All Locations'}
                  {formData.audienceType === 'select_locations' && `${selectedLocationIds.length} Location${selectedLocationIds.length !== 1 ? 's' : ''}`}
                  {formData.audienceType === 'select_guests' && 'Selected Guests'}
                  {formData.audienceType === 'imported_guests' && 'CRM Guests'}
                </span>
              </div>
              <div className="flex items-start justify-between">
                <span className="text-sm text-surface-500">Recipients</span>
                <span className="text-sm font-semibold text-ezra-500">
                  {estimatedRecipients.toLocaleString()}
                </span>
              </div>
              <div className="flex items-start justify-between">
                <span className="text-sm text-surface-500">Delivery</span>
                <span className="text-sm font-medium text-surface-900 dark:text-surface-100 text-right">
                  {formData.scheduleType === 'immediate' && 'Immediate'}
                  {formData.scheduleType === 'scheduled' && formData.scheduledAt && (
                    new Date(formData.scheduledAt).toLocaleString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: 'numeric',
                      minute: '2-digit',
                    })
                  )}
                  {formData.scheduleType === 'scheduled' && !formData.scheduledAt && 'Not set'}
                  {formData.scheduleType === 'recurring' && `${formData.recurringFrequency || 'Daily'}`}
                </span>
              </div>
              {formData.scheduleType === 'recurring' && formData.recurringStartDate && formData.recurringEndDate && (
                <>
                  <div className="flex items-start justify-between">
                    <span className="text-sm text-surface-500">Period</span>
                    <span className="text-sm text-surface-900 dark:text-surface-100 text-right">
                      {new Date(formData.recurringStartDate).toLocaleDateString()} - {new Date(formData.recurringEndDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-start justify-between">
                    <span className="text-sm text-surface-500">Send Time</span>
                    <span className="text-sm text-surface-900 dark:text-surface-100 text-right">
                      {formData.recurringTime || '10:00'}
                    </span>
                  </div>
                </>
              )}
              {formData.name && (
                <div className="flex items-start justify-between">
                  <span className="text-sm text-surface-500">Name</span>
                  <span className="text-sm font-medium text-surface-900 dark:text-surface-100 text-right max-w-[60%] truncate">
                    {formData.name}
                  </span>
                </div>
              )}
            </div>
            <div className="p-4 border-t border-surface-100 dark:border-surface-800">
              <div className="flex items-center justify-center gap-2 text-xs text-surface-400">
                <MessageSquare className="w-3 h-3" />
                <span>Powered by Twilio</span>
              </div>
            </div>
          </Card>
          </div>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="sticky bottom-0 bg-white dark:bg-surface-900 border-t border-surface-200 dark:border-surface-800 p-4 -mx-6 -mb-6 mt-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/app/exponential/campaigns">
            <Button variant="outline" size="lg">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            {!isValid && (
              <p className="text-sm text-surface-500">
                Complete all required fields to send
              </p>
            )}
            <Button
              onClick={handleSubmit}
              disabled={!isValid || isSubmitting}
              size="lg"
              className="min-w-[180px]"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Send Campaign
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
