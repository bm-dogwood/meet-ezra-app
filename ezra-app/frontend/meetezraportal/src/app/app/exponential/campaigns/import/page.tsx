'use client';

// ===========================================
// EZRA PORTAL - CRM Page
// Primary: Exponential Customers listing (paginated)
// Secondary: CRM Guest Import (collapsible)
// ===========================================

import { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  Upload, Download, ArrowLeft, ArrowRight, FileText, CheckCircle, XCircle,
  AlertTriangle, Users, RefreshCw, Info, FileSpreadsheet, History, ChevronDown,
  ChevronUp, Search, Phone, MapPin, Calendar, Scissors, Send, X, Filter,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { formatNumber } from '@/lib/formatters';
import { exponentialApi } from '@/lib/api';

// ============ Types ============
type Step = 'upload' | 'mapping' | 'complete';

interface OurField { key: string; label: string; required: boolean; }

interface ParseResult {
  import_id: number; file_name: string; total_rows: number;
  detected_headers: string[]; suggested_mapping: Record<string, string>;
  needs_manual_mapping: boolean; our_fields: OurField[]; sample_rows: Record<string, string>[];
}

interface ImportResult {
  import_id?: number; created: number; updated: number;
  errors: Array<{ row: number; error: string }>; total: number; guest_codes?: string[];
}

interface ImportHistoryItem {
  id: number; fileName: string; fileSize: number; status: string; totalRows: number;
  created: number; updated: number; errors: number; uploadedBy: string;
  createdAt: string; completedAt: string | null;
}

interface CustomerRow {
  id: string; name: string; phone: string; lastVisitDate: string | null;
  segment: string; lastService: string; storeName: string; daysSinceLastVisit: number;
  smsOptIn: boolean;
}

// ============ CSV Template ============
const CSV_TEMPLATE = `first_name,last_name,phone,email,location_code,segment
John,Smith,+15551234567,john.smith@email.com,MN-001,6-week
Jane,Doe,+15559876543,jane.doe@email.com,MN-002,4-week`;

const OUR_FIELD_OPTIONS: { key: string; label: string }[] = [
  { key: '', label: '— Skip this column —' },
  { key: 'first_name', label: 'First Name' },
  { key: 'last_name', label: 'Last Name' },
  { key: 'phone', label: 'Phone Number' },
  { key: 'email', label: 'Email' },
  { key: 'location_code', label: 'Location Code' },
  { key: 'segment', label: 'Segment' },
];

const SEGMENT_COLORS: Record<string, string> = {
  'active': 'bg-blue-500/15 text-blue-400',
  'imported': 'bg-purple-500/15 text-purple-400',
};

function getSegmentColor(seg: string): string {
  if (SEGMENT_COLORS[seg]) return SEGMENT_COLORS[seg];
  if (seg.includes('8+') || seg.includes('8wk')) return 'bg-danger-500/15 text-danger-400';
  if (seg.includes('4-8') || seg.includes('6')) return 'bg-warning-500/15 text-warning-400';
  if (seg.includes('4-6') || seg.includes('4')) return 'bg-success-500/15 text-success-400';
  return 'bg-surface-700 text-surface-400';
}

// ============ Main Component ============
export default function GuestImportPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Customer listing state
  const [customers, setCustomers] = useState<CustomerRow[]>([]);
  const [customerTotal, setCustomerTotal] = useState(0);
  const [customerPage, setCustomerPage] = useState(0);
  const [customerSearch, setCustomerSearch] = useState('');
  const [customerSearchInput, setCustomerSearchInput] = useState('');
  const [customerLoading, setCustomerLoading] = useState(false);
  const CUSTOMER_LIMIT = 25;

  // Filter state
  const [filterSegment, setFilterSegment] = useState('');
  const [filterLocations, setFilterLocations] = useState<string[]>([]);
  const [filterServices, setFilterServices] = useState<string[]>([]);
  const [filterGuestType, setFilterGuestType] = useState('');
  const [filterSmsStatus, setFilterSmsStatus] = useState('');
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');
  const [sortOrder, setSortOrder] = useState('last_visit_desc');

  // Multi-select dropdown open state
  const [locationDropdownOpen, setLocationDropdownOpen] = useState(false);
  const [serviceDropdownOpen, setServiceDropdownOpen] = useState(false);
  const locationDropdownRef = useRef<HTMLDivElement>(null);
  const serviceDropdownRef = useRef<HTMLDivElement>(null);

  // Segment options and location options
  const [segmentOptions, setSegmentOptions] = useState<string[]>([]);
  const [locationOptions, setLocationOptions] = useState<{ id: string; name: string }[]>([]);
  const [serviceOptions, setServiceOptions] = useState<string[]>([]);

  // Import section state
  const [showImport, setShowImport] = useState(false);
  const [step, setStep] = useState<Step>('upload');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [parseResult, setParseResult] = useState<ParseResult | null>(null);
  const [columnMapping, setColumnMapping] = useState<Record<string, string>>({});
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [importHistory, setImportHistory] = useState<ImportHistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  // Load filter options
  useEffect(() => {
    exponentialApi.getSegmentConfigs()
      .then((res: any) => {
        const names = (res.segments || []).map((s: any) => s.name);
        setSegmentOptions(names);
      }).catch(() => {});
    exponentialApi.getLocations()
      .then((res: any) => {
        setLocationOptions((res.locations || []).map((l: any) => ({ id: l.id, name: l.name })));
      }).catch(() => {});
    // Get distinct service types
    exponentialApi.getServiceTypes()
      .then((res: any) => {
        setServiceOptions(res.services || []);
      }).catch(() => {});
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (locationDropdownRef.current && !locationDropdownRef.current.contains(e.target as Node)) setLocationDropdownOpen(false);
      if (serviceDropdownRef.current && !serviceDropdownRef.current.contains(e.target as Node)) setServiceDropdownOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Fetch customers with filters
  useEffect(() => {
    setCustomerLoading(true);
    exponentialApi.getGuests({
      search: customerSearch || undefined,
      page: customerPage,
      limit: CUSTOMER_LIMIT,
      bucket: filterSegment || undefined,
      store_id: filterLocations.length === 1 ? filterLocations[0] : undefined,
      location_ids: filterLocations.length > 1 ? filterLocations.join(',') : undefined,
      last_service: filterServices.length === 1 ? filterServices[0] : undefined,
      last_services: filterServices.length > 1 ? filterServices.join(',') : undefined,
      guest_type: filterGuestType || undefined,
      sms_status: filterSmsStatus || undefined,
      sort: sortOrder || undefined,
      date_from: filterDateFrom || undefined,
      date_to: filterDateTo || undefined,
    })
      .then((res: any) => {
        setCustomers(res.guests || []);
        setCustomerTotal(res.total || 0);
      })
      .catch(() => {})
      .finally(() => setCustomerLoading(false));
  }, [customerPage, customerSearch, filterSegment, filterLocations, filterServices, filterGuestType, filterSmsStatus, sortOrder, filterDateFrom, filterDateTo]);

  const hasActiveFilters = !!(filterSegment || filterLocations.length || filterServices.length || filterGuestType || filterSmsStatus || customerSearch || filterDateFrom || filterDateTo);

  // Fetch eligible count (matches execution logic: opted-in, has phone, etc.)
  const [eligibleCount, setEligibleCount] = useState<number | null>(null);
  useEffect(() => {
    if (!hasActiveFilters) { setEligibleCount(null); return; }
    const params: Record<string, any> = {};
    if (filterSegment) params.segment = filterSegment;
    if (filterLocations.length) params.location_ids = filterLocations.join(',');
    if (filterServices.length) params.last_service = filterServices.join(',');
    if (filterDateFrom) params.date_from = filterDateFrom;
    if (filterDateTo) params.date_to = filterDateTo;
    params.sms_status = 'opted_in';
    exponentialApi.getAudienceEstimate(params)
      .then((res: any) => {
        const counts = res.counts || [];
        const seg = filterSegment || 'all';
        const match = counts.find((c: any) => c.segment === seg);
        setEligibleCount(match ? match.count : 0);
      })
      .catch(() => setEligibleCount(null));
  }, [filterSegment, filterLocations, filterServices, filterDateFrom, filterDateTo, hasActiveFilters]);

  const clearFilters = () => {
    setFilterSegment(''); setFilterLocations([]); setFilterServices([]);
    setFilterGuestType(''); setFilterSmsStatus(''); setFilterDateFrom(''); setFilterDateTo('');
    setCustomerSearch(''); setCustomerSearchInput('');
    setCustomerPage(0);
  };

  // Build campaign URL with current filters
  const campaignUrl = useMemo(() => {
    const params = new URLSearchParams();
    if (filterSegment) params.set('segment', filterSegment);
    if (filterLocations.length) params.set('location_ids', filterLocations.join(','));
    if (filterServices.length) params.set('service_types', filterServices.join(','));
    if (filterGuestType) params.set('guest_type', filterGuestType);
    if (filterDateFrom) params.set('date_from', filterDateFrom);
    if (filterDateTo) params.set('date_to', filterDateTo);
    if (customerSearch) params.set('search', customerSearch);
    params.set('crm_total', String(eligibleCount ?? customerTotal));
    params.set('from_crm', '1');
    const qs = params.toString();
    return `/app/exponential/campaigns/new${qs ? `?${qs}` : ''}`;
  }, [filterSegment, filterLocations, filterServices, filterGuestType, filterDateFrom, filterDateTo, customerSearch, eligibleCount, customerTotal]);

  // Load import history when import section is shown
  useEffect(() => {
    if (showImport) {
      exponentialApi.getImportHistory({ limit: 20 })
        .then((res: any) => setImportHistory(res.imports || []))
        .catch(() => {});
    }
  }, [showImport, importResult]);

  const totalPages = Math.ceil(customerTotal / CUSTOMER_LIMIT);

  const handleSearchSubmit = () => {
    setCustomerPage(0);
    setCustomerSearch(customerSearchInput);
  };

  // ============ Import Handlers ============
  const handleDownloadTemplate = useCallback(() => {
    const blob = new Blob([CSV_TEMPLATE], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'ezra_guest_import_template.csv'; a.click();
    URL.revokeObjectURL(url);
  }, []);

  const handleFileUpload = useCallback(async (file: File) => {
    setError(null); setIsProcessing(true);
    try {
      const result = await exponentialApi.parseImportFile(file) as ParseResult;
      setParseResult(result);
      setColumnMapping(result.suggested_mapping || {});
      setStep('mapping');
    } catch (err: any) {
      setError(err?.message || 'Failed to parse file.');
    } finally { setIsProcessing(false); }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileUpload(file);
  }, [handleFileUpload]);

  const handleDragOver = useCallback((e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); }, []);
  const handleDragLeave = useCallback(() => setIsDragging(false), []);

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileUpload(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }, [handleFileUpload]);

  const handleMappingChange = useCallback((sourceHeader: string, targetField: string) => {
    setColumnMapping(prev => ({ ...prev, [sourceHeader]: targetField }));
  }, []);

  const handleSubmitMapping = useCallback(async () => {
    if (!parseResult) return;
    setError(null); setIsProcessing(true);
    try {
      const result = await exponentialApi.submitImportMapping({
        import_id: parseResult.import_id, column_mapping: columnMapping,
      }) as ImportResult;
      setImportResult(result); setStep('complete');
      // Refresh customer list after import
      setCustomerPage(0); setCustomerSearch('');
    } catch (err: any) {
      setError(err?.message || 'Import failed.');
    } finally { setIsProcessing(false); }
  }, [parseResult, columnMapping]);

  const handleReset = useCallback(() => {
    setStep('upload'); setParseResult(null); setColumnMapping({}); setImportResult(null); setError(null);
  }, []);

  const phoneMapped = Object.values(columnMapping).includes('phone');

  // ============ Render ============
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/app/exponential/campaigns" className="p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors">
            <ArrowLeft className="w-5 h-5 text-surface-500" />
          </Link>
          <div>
            <h1 className="text-xl font-semibold text-surface-900 dark:text-surface-100">CRM</h1>
            <p className="text-sm text-surface-500 dark:text-surface-400">
              {formatNumber(customerTotal)} customers{hasActiveFilters ? ' (filtered)' : ' across all locations'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={showImport ? 'secondary' : 'outline'}
            size="sm"
            onClick={() => setShowImport(!showImport)}
            leftIcon={<Upload className="w-4 h-4" />}
          >
            {showImport ? 'Hide Import' : 'Import Guests'}
          </Button>
        </div>
      </div>

      {/* Search bar (moved up) */}
      <div className="flex items-center gap-3">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-surface-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={customerSearchInput}
            onChange={(e) => setCustomerSearchInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearchSubmit()}
            placeholder="Search by name, phone, or guest code..."
            className="w-full pl-9 pr-4 py-2.5 text-sm rounded-lg border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-surface-900 dark:text-surface-100 placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-ezra-500"
          />
        </div>
        <Button variant="secondary" size="sm" onClick={handleSearchSubmit}>Search</Button>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters} leftIcon={<X className="w-3.5 h-3.5" />}>Clear All</Button>
        )}
      </div>

      {/* Banner */}
      <div className="px-4 py-2.5 rounded-lg bg-ezra-500/5 border border-ezra-500/20 flex items-center justify-between">
        <p className="text-sm text-surface-600 dark:text-surface-300 flex items-center gap-2">
          <Filter className="w-4 h-4 text-ezra-500" />
          Set filters for CRM campaigns.
        </p>
        {hasActiveFilters && customerTotal > 0 && (
          <Link href={campaignUrl}>
            <Button variant="primary" size="sm" leftIcon={<Send className="w-4 h-4" />}>
              Send Campaign ({eligibleCount !== null ? formatNumber(eligibleCount) : formatNumber(customerTotal)} eligible)
            </Button>
          </Link>
        )}
      </div>

      {/* ============ IMPORT SECTION (collapsible) ============ */}
      {showImport && (
        <Card className="border-surface-600 dark:border-surface-700">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Upload className="w-4 h-4 text-ezra-400" />
                <h3 className="text-sm font-medium text-surface-200">Import CRM Guests</h3>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => setShowHistory(!showHistory)} leftIcon={<History className="w-3.5 h-3.5" />}>
                  {showHistory ? 'Hide' : 'Show'} History
                </Button>
                {step !== 'upload' && (
                  <Button variant="ghost" size="sm" onClick={handleReset} leftIcon={<RefreshCw className="w-3.5 h-3.5" />}>
                    Start Over
                  </Button>
                )}
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-start gap-2 p-3 mb-4 bg-danger-500/10 border border-danger-500/30 rounded-lg">
                <XCircle className="w-4 h-4 text-danger-400 mt-0.5 shrink-0" />
                <p className="text-sm text-danger-300">{error}</p>
              </div>
            )}

            {/* Step 1: Upload */}
            {step === 'upload' && (
              <div className="space-y-4">
                <div
                  className={cn(
                    'border-2 border-dashed rounded-lg cursor-pointer transition-all p-6 text-center',
                    isDragging ? 'border-ezra-400 bg-ezra-500/10' : 'border-surface-600 hover:border-surface-500'
                  )}
                  onClick={() => fileInputRef.current?.click()}
                  onDrop={handleDrop} onDragOver={handleDragOver} onDragLeave={handleDragLeave}
                >
                  {isProcessing ? (
                    <RefreshCw className="w-8 h-8 text-ezra-400 animate-spin mx-auto" />
                  ) : (
                    <>
                      <Upload className="w-8 h-8 text-surface-500 mx-auto mb-2" />
                      <p className="text-sm text-surface-300">Drag & drop CSV/Excel file, or click to browse</p>
                    </>
                  )}
                  <input ref={fileInputRef} type="file" accept=".csv,.xlsx,.xls" className="hidden" onChange={handleFileInputChange} />
                </div>
                <div className="flex items-center gap-3">
                  <Button variant="outline" size="sm" onClick={handleDownloadTemplate} leftIcon={<Download className="w-3.5 h-3.5" />}>
                    Download Template
                  </Button>
                  <span className="text-xs text-surface-500">Phone number is the only required field</span>
                </div>
              </div>
            )}

            {/* Step 2: Mapping */}
            {step === 'mapping' && parseResult && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-surface-300">
                    <FileSpreadsheet className="w-4 h-4 inline mr-1" />
                    {parseResult.file_name} — {formatNumber(parseResult.total_rows)} rows
                  </p>
                  {!phoneMapped && (
                    <span className="text-xs text-warning-400 flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5" /> Phone column must be mapped
                    </span>
                  )}
                </div>
                <div className="border border-surface-700 rounded-lg overflow-hidden max-h-64 overflow-y-auto">
                  <div className="grid grid-cols-12 gap-0 bg-surface-800/80 text-xs font-medium text-surface-400 uppercase tracking-wide sticky top-0">
                    <div className="col-span-3 px-3 py-2 border-r border-surface-700">Your Column</div>
                    <div className="col-span-4 px-3 py-2 border-r border-surface-700">Sample</div>
                    <div className="col-span-1 px-3 py-2 border-r border-surface-700 text-center">→</div>
                    <div className="col-span-4 px-3 py-2">Map To</div>
                  </div>
                  {parseResult.detected_headers.map((header, idx) => (
                    <div key={header} className={cn('grid grid-cols-12 gap-0 items-center border-t border-surface-700/50', idx % 2 === 0 ? 'bg-surface-850' : 'bg-surface-900/50')}>
                      <div className="col-span-3 px-3 py-2 border-r border-surface-700/50 text-xs font-mono text-surface-200 truncate">{header}</div>
                      <div className="col-span-4 px-3 py-2 border-r border-surface-700/50">
                        <div className="flex flex-wrap gap-1">
                          {parseResult.sample_rows.slice(0, 2).map(row => row[header]).filter(Boolean).map((val, i) => (
                            <span key={i} className="text-xs bg-surface-800 text-surface-400 px-1.5 py-0.5 rounded truncate max-w-[120px]">{val}</span>
                          ))}
                        </div>
                      </div>
                      <div className="col-span-1 px-3 py-2 border-r border-surface-700/50 text-center"><ArrowRight className="w-3 h-3 text-surface-600 mx-auto" /></div>
                      <div className="col-span-4 px-3 py-2">
                        <select value={columnMapping[header] || ''} onChange={(e) => handleMappingChange(header, e.target.value)}
                          className={cn('w-full text-xs rounded border px-2 py-1 bg-surface-800 focus:outline-none focus:ring-1 focus:ring-ezra-500/50',
                            columnMapping[header] ? 'border-ezra-500/40 text-surface-200' : 'border-surface-700 text-surface-500')}>
                          {OUR_FIELD_OPTIONS.map(opt => (<option key={opt.key} value={opt.key}>{opt.label}</option>))}
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <Button variant="ghost" size="sm" onClick={handleReset} leftIcon={<ArrowLeft className="w-3.5 h-3.5" />}>Back</Button>
                  <Button variant="primary" size="sm" onClick={handleSubmitMapping} isLoading={isProcessing} disabled={!phoneMapped} leftIcon={<Upload className="w-3.5 h-3.5" />}>
                    Import {formatNumber(parseResult.total_rows)} Guests
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Complete */}
            {step === 'complete' && importResult && (
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-success-500/5 border border-success-500/30 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-success-400 shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-surface-200">Import Complete</p>
                    <p className="text-xs text-surface-400 mt-1">
                      {formatNumber(importResult.created)} created, {formatNumber(importResult.updated)} updated
                      {importResult.errors?.length > 0 && `, ${importResult.errors.length} errors`}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={handleReset} leftIcon={<Upload className="w-3.5 h-3.5" />}>Import More</Button>
                </div>
              </div>
            )}

            {/* Import History */}
            {showHistory && importHistory.length > 0 && (
              <div className="mt-4 border border-surface-700 rounded-lg overflow-hidden">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-surface-800/80 text-surface-400 uppercase tracking-wide">
                      <th className="text-left px-3 py-2">File</th>
                      <th className="text-center px-3 py-2">Status</th>
                      <th className="text-right px-3 py-2">Rows</th>
                      <th className="text-right px-3 py-2">Created</th>
                      <th className="text-right px-3 py-2">Errors</th>
                      <th className="text-right px-3 py-2">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {importHistory.map((item) => (
                      <tr key={item.id} className="border-t border-surface-700/50 hover:bg-surface-800/30">
                        <td className="px-3 py-2 text-surface-300 truncate max-w-[180px]">{item.fileName}</td>
                        <td className="px-3 py-2 text-center">
                          <span className={cn('px-1.5 py-0.5 rounded-full text-xs',
                            item.status === 'completed' ? 'bg-success-500/15 text-success-400' :
                            item.status === 'failed' ? 'bg-danger-500/15 text-danger-400' : 'bg-surface-700 text-surface-400'
                          )}>{item.status}</span>
                        </td>
                        <td className="px-3 py-2 text-right text-surface-400">{formatNumber(item.totalRows)}</td>
                        <td className="px-3 py-2 text-right text-success-400">{formatNumber(item.created)}</td>
                        <td className="px-3 py-2 text-right text-danger-400">{item.errors > 0 ? formatNumber(item.errors) : '—'}</td>
                        <td className="px-3 py-2 text-right text-surface-500">{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* ============ CUSTOMER LISTING (primary) ============ */}
      <Card>
        {/* Filters */}
        <div className="p-4 border-b border-surface-200 dark:border-surface-700 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            {/* Segment */}
            <select
              value={filterSegment}
              onChange={(e) => { setFilterSegment(e.target.value); setCustomerPage(0); }}
              className="text-xs px-3 py-1.5 rounded-lg border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-surface-900 dark:text-surface-100 focus:outline-none focus:ring-2 focus:ring-ezra-500"
            >
              <option value="">All Segments</option>
              {segmentOptions.map(s => <option key={s} value={s}>{s}</option>)}
            </select>

            {/* Location Multi-select */}
            <div className="relative" ref={locationDropdownRef}>
              <button
                onClick={() => setLocationDropdownOpen(!locationDropdownOpen)}
                className={cn(
                  'text-xs px-3 py-1.5 rounded-lg border bg-white dark:bg-surface-800 text-surface-900 dark:text-surface-100 focus:outline-none focus:ring-2 focus:ring-ezra-500 flex items-center gap-1.5 min-w-[140px]',
                  filterLocations.length > 0 ? 'border-ezra-500/50' : 'border-surface-200 dark:border-surface-700'
                )}
              >
                <MapPin className="w-3 h-3 text-surface-400" />
                {filterLocations.length === 0 ? 'All Locations' : `${filterLocations.length} Location${filterLocations.length > 1 ? 's' : ''}`}
                <ChevronDown className="w-3 h-3 text-surface-400 ml-auto" />
              </button>
              {locationDropdownOpen && (
                <div className="absolute z-50 mt-1 w-72 max-h-64 overflow-y-auto rounded-lg border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 shadow-lg">
                  <div className="p-2 border-b border-surface-100 dark:border-surface-700 flex items-center justify-between">
                    <span className="text-xs text-surface-500">{filterLocations.length} selected</span>
                    {filterLocations.length > 0 && (
                      <button onClick={() => { setFilterLocations([]); setCustomerPage(0); }} className="text-xs text-ezra-500 hover:underline">Clear</button>
                    )}
                  </div>
                  {locationOptions.map(l => (
                    <label key={l.id} className="flex items-center gap-2 px-3 py-1.5 hover:bg-surface-50 dark:hover:bg-surface-700/50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filterLocations.includes(l.id)}
                        onChange={(e) => {
                          setFilterLocations(prev => e.target.checked ? [...prev, l.id] : prev.filter(id => id !== l.id));
                          setCustomerPage(0);
                        }}
                        className="rounded border-surface-300 text-ezra-500 focus:ring-ezra-500"
                      />
                      <span className="text-xs text-surface-900 dark:text-surface-100 truncate">{l.name}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Service Multi-select */}
            <div className="relative" ref={serviceDropdownRef}>
              <button
                onClick={() => setServiceDropdownOpen(!serviceDropdownOpen)}
                className={cn(
                  'text-xs px-3 py-1.5 rounded-lg border bg-white dark:bg-surface-800 text-surface-900 dark:text-surface-100 focus:outline-none focus:ring-2 focus:ring-ezra-500 flex items-center gap-1.5 min-w-[130px]',
                  filterServices.length > 0 ? 'border-ezra-500/50' : 'border-surface-200 dark:border-surface-700'
                )}
              >
                <Scissors className="w-3 h-3 text-surface-400" />
                {filterServices.length === 0 ? 'All Services' : `${filterServices.length} Service${filterServices.length > 1 ? 's' : ''}`}
                <ChevronDown className="w-3 h-3 text-surface-400 ml-auto" />
              </button>
              {serviceDropdownOpen && (
                <div className="absolute z-50 mt-1 w-64 max-h-64 overflow-y-auto rounded-lg border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 shadow-lg">
                  <div className="p-2 border-b border-surface-100 dark:border-surface-700 flex items-center justify-between">
                    <span className="text-xs text-surface-500">{filterServices.length} selected</span>
                    {filterServices.length > 0 && (
                      <button onClick={() => { setFilterServices([]); setCustomerPage(0); }} className="text-xs text-ezra-500 hover:underline">Clear</button>
                    )}
                  </div>
                  {serviceOptions.map(s => (
                    <label key={s} className="flex items-center gap-2 px-3 py-1.5 hover:bg-surface-50 dark:hover:bg-surface-700/50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filterServices.includes(s)}
                        onChange={(e) => {
                          setFilterServices(prev => e.target.checked ? [...prev, s] : prev.filter(v => v !== s));
                          setCustomerPage(0);
                        }}
                        className="rounded border-surface-300 text-ezra-500 focus:ring-ezra-500"
                      />
                      <span className="text-xs text-surface-900 dark:text-surface-100 truncate">{s}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Guest Type */}
            <select
              value={filterGuestType}
              onChange={(e) => { setFilterGuestType(e.target.value); setCustomerPage(0); }}
              className="text-xs px-3 py-1.5 rounded-lg border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-surface-900 dark:text-surface-100 focus:outline-none focus:ring-2 focus:ring-ezra-500"
            >
              <option value="">All Guests</option>
              <option value="normal">Store Guests</option>
              <option value="imported">Imported (CRM)</option>
            </select>

            {/* SMS Opt-in */}
            <select
              value={filterSmsStatus}
              onChange={(e) => { setFilterSmsStatus(e.target.value); setCustomerPage(0); }}
              className="text-xs px-3 py-1.5 rounded-lg border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-surface-900 dark:text-surface-100 focus:outline-none focus:ring-2 focus:ring-ezra-500"
            >
              <option value="">All Opt-in</option>
              <option value="opted_in">Opted In</option>
              <option value="opted_out">Opted Out</option>
            </select>

            {/* Last Visit Date Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-surface-400 whitespace-nowrap">Last Visit</span>
              <input
                type="date"
                value={filterDateFrom}
                onChange={(e) => { setFilterDateFrom(e.target.value); setCustomerPage(0); }}
                placeholder="From"
                className="text-xs px-2 py-1.5 rounded-lg border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-surface-900 dark:text-surface-100 focus:outline-none focus:ring-2 focus:ring-ezra-500 [color-scheme:dark] w-[120px]"
              />
              <span className="text-xs text-surface-400">to</span>
              <input
                type="date"
                value={filterDateTo}
                onChange={(e) => { setFilterDateTo(e.target.value); setCustomerPage(0); }}
                placeholder="To"
                className="text-xs px-2 py-1.5 rounded-lg border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-surface-900 dark:text-surface-100 focus:outline-none focus:ring-2 focus:ring-ezra-500 [color-scheme:dark] w-[120px]"
              />
            </div>

            {/* Sort */}
            <select
              value={sortOrder}
              onChange={(e) => { setSortOrder(e.target.value); setCustomerPage(0); }}
              className="text-xs px-3 py-1.5 rounded-lg border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-surface-900 dark:text-surface-100 focus:outline-none focus:ring-2 focus:ring-ezra-500"
            >
              <option value="last_visit_desc">Last Visit ↓</option>
              <option value="last_visit_asc">Last Visit ↑</option>
              <option value="name_asc">Name A-Z</option>
              <option value="name_desc">Name Z-A</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-surface-50 dark:bg-surface-800/80 text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wide">
                <th className="text-left px-4 py-3">Name</th>
                <th className="text-left px-4 py-3">Phone</th>
                <th className="text-left px-4 py-3">Last Visit</th>
                <th className="text-left px-4 py-3">Segment</th>
                <th className="text-left px-4 py-3">Last Service</th>
                <th className="text-left px-4 py-3">Location</th>
              </tr>
            </thead>
            <tbody>
              {customerLoading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-surface-500">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2" />
                    Loading customers...
                  </td>
                </tr>
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-surface-500">
                    No customers found
                  </td>
                </tr>
              ) : (
                customers.map((c, idx) => (
                  <tr key={c.id + idx} className="border-t border-surface-100 dark:border-surface-700/50 hover:bg-surface-50 dark:hover:bg-surface-800/30 transition-colors">
                    <td className="px-4 py-3">
                      <span className="font-medium text-surface-900 dark:text-surface-100">{c.name || '—'}</span>
                    </td>
                    <td className="px-4 py-3 text-surface-600 dark:text-surface-400 font-mono text-xs">
                      {c.phone || '—'}
                    </td>
                    <td className="px-4 py-3 text-surface-600 dark:text-surface-400">
                      {c.lastVisitDate ? (
                        <div>
                          <span className="text-xs">{new Date(c.lastVisitDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                          <span className="text-xs text-surface-500 ml-1">({c.daysSinceLastVisit}d ago)</span>
                        </div>
                      ) : '—'}
                    </td>
                    <td className="px-4 py-3">
                      {c.segment && c.segment !== 'active' ? (
                        <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', getSegmentColor(c.segment))}>
                          {c.segment}
                        </span>
                      ) : (
                        <span className="text-xs text-surface-500">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-surface-600 dark:text-surface-400 text-xs max-w-[160px] truncate">
                      {c.lastService || '—'}
                    </td>
                    <td className="px-4 py-3 text-surface-500 text-xs max-w-[140px] truncate">
                      {c.storeName || '—'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-surface-200 dark:border-surface-700">
            <p className="text-xs text-surface-500">
              Showing {customerPage * CUSTOMER_LIMIT + 1}–{Math.min((customerPage + 1) * CUSTOMER_LIMIT, customerTotal)} of {formatNumber(customerTotal)}
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost" size="sm"
                disabled={customerPage === 0}
                onClick={() => setCustomerPage(p => Math.max(0, p - 1))}
              >
                Previous
              </Button>
              <span className="text-xs text-surface-400">
                Page {customerPage + 1} of {totalPages}
              </span>
              <Button
                variant="ghost" size="sm"
                disabled={customerPage >= totalPages - 1}
                onClick={() => setCustomerPage(p => p + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
