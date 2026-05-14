'use client';

// ===========================================
// EZRA PORTAL - Report Scheduling Page
// ===========================================

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
  Mail,
  Plus,
  Edit,
  Trash2,
  X,
  CheckCircle,
  AlertCircle,
  Loader2,
  Clock,
  Users,
  Calendar,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { isValidEmail } from '@/lib/validation';
import { Card } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useAuth } from '@/context/AuthContext';
import { schedulesApi } from '@/lib/api';
import { buildCronExpression, cronToHumanReadable } from '@/lib/cronUtils';
import type { FrequencyType } from '@/lib/cronUtils';
import type { ReportSchedule } from '@/types';

// ============ Constants ============

const REPORT_TYPE_OPTIONS = [
  { value: 'daily', label: 'Daily Sales Flash' },
  { value: 'weekly', label: 'Weekly Sales Summary' },
  { value: 'lp', label: 'LP Risk Analysis' },
  { value: 'scheduling', label: 'Scheduling Report' },
  { value: 'exponential', label: 'Exponential Report' },
] as const;

const REPORT_TYPE_LABELS: Record<string, string> = {
  daily: 'Daily Sales Flash',
  weekly: 'Weekly Sales Summary',
  lp: 'LP Risk Analysis',
  scheduling: 'Scheduling Report',
  exponential: 'Exponential Report',
};

const MAX_RECIPIENTS = 5;
const PAGE_SIZE_OPTIONS = [5, 10, 20, 50];

const FREQUENCY_OPTIONS: { value: FrequencyType; label: string }[] = [
  { value: 'daily', label: 'Every day' },
  { value: 'weekdays', label: 'Every weekday (Mon–Fri)' },
  { value: 'specific_days', label: 'Specific days of the week' },
  { value: 'monthly', label: 'Specific day of the month' },
];

const DAY_BUTTONS = [
  { value: 1, label: 'Mon' },
  { value: 2, label: 'Tue' },
  { value: 3, label: 'Wed' },
  { value: 4, label: 'Thu' },
  { value: 5, label: 'Fri' },
  { value: 6, label: 'Sat' },
  { value: 0, label: 'Sun' },
];

const MINUTE_OPTIONS = [0, 15, 30, 45];

const TIMEZONE_OPTIONS = [
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'America/Phoenix',
  'America/Anchorage',
  'Pacific/Honolulu',
  'US/Eastern',
  'US/Central',
  'US/Mountain',
  'US/Pacific',
  'UTC',
];

// ============ Toast Component ============

interface Toast {
  id: number;
  type: 'success' | 'error';
  message: string;
}

function ToastContainer({ toasts, onDismiss }: { toasts: Toast[]; onDismiss: (id: number) => void }) {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            'flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg animate-fade-in min-w-[300px]',
            toast.type === 'success'
              ? 'bg-success-500 text-white'
              : 'bg-danger-500 text-white'
          )}
        >
          {toast.type === 'success' ? (
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
          )}
          <p className="text-sm font-medium flex-1">{toast.message}</p>
          <button onClick={() => onDismiss(toast.id)} className="flex-shrink-0 hover:opacity-80">
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}

// ============ Helper: Parse cron expression back into frequency builder state ============

function parseCronToBuilderState(cronExpression: string): {
  frequency: FrequencyType;
  selectedDays: number[];
  dayOfMonth: number;
  hour12: number;
  minute: number;
  ampm: 'AM' | 'PM';
} {
  const defaults = {
    frequency: 'daily' as FrequencyType,
    selectedDays: [] as number[],
    dayOfMonth: 1,
    hour12: 8,
    minute: 0,
    ampm: 'AM' as 'AM' | 'PM',
  };

  const parts = cronExpression.trim().split(/\s+/);
  if (parts.length !== 5) return defaults;

  const [minuteField, hourField, domField, , dowField] = parts;
  const minute = parseInt(minuteField, 10);
  const hour24 = parseInt(hourField, 10);

  if (isNaN(minute) || isNaN(hour24)) return defaults;

  const ampm: 'AM' | 'PM' = hour24 >= 12 ? 'PM' : 'AM';
  const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;

  if (domField !== '*') {
    const dom = parseInt(domField, 10);
    if (!isNaN(dom) && dom >= 1 && dom <= 28) {
      return { frequency: 'monthly', selectedDays: [], dayOfMonth: dom, hour12, minute, ampm };
    }
  }

  if (dowField === '*') {
    return { frequency: 'daily', selectedDays: [], dayOfMonth: 1, hour12, minute, ampm };
  }

  if (dowField === '1-5') {
    return { frequency: 'weekdays', selectedDays: [], dayOfMonth: 1, hour12, minute, ampm };
  }

  const dayNumbers = dowField.split(',').map((d) => parseInt(d, 10));
  if (dayNumbers.every((d) => !isNaN(d) && d >= 0 && d <= 6)) {
    return { frequency: 'specific_days', selectedDays: dayNumbers, dayOfMonth: 1, hour12, minute, ampm };
  }

  return { ...defaults, hour12, minute, ampm };
}

// ============ Main Page Component ============

export default function ReportSchedulingPage() {
  const { user } = useAuth();

  // Ref for scrolling to form
  const formRef = useRef<HTMLDivElement>(null);

  // Data state
  const [schedules, setSchedules] = useState<ReportSchedule[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<ReportSchedule | null>(null);
  const [formName, setFormName] = useState('');
  const [formReportTypes, setFormReportTypes] = useState<Set<string>>(new Set());
  const [formFrequency, setFormFrequency] = useState<FrequencyType>('daily');
  const [formSelectedDays, setFormSelectedDays] = useState<number[]>([]);
  const [formDayOfMonth, setFormDayOfMonth] = useState(1);
  const [formHour, setFormHour] = useState(8);
  const [formMinute, setFormMinute] = useState(0);
  const [formAmPm, setFormAmPm] = useState<'AM' | 'PM'>('AM');
  const [formTimezone, setFormTimezone] = useState('America/New_York');
  const [formEmails, setFormEmails] = useState<string[]>([]);
  const [emailInput, setEmailInput] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Toast state
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toastIdRef = React.useRef(0);

  // Toggling/deleting state
  const [togglingId, setTogglingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [deleteConfirmSchedule, setDeleteConfirmSchedule] = useState<ReportSchedule | null>(null);

  // ============ Derived ============

  const formHour24 = useMemo(() => {
    if (formAmPm === 'AM') return formHour === 12 ? 0 : formHour;
    return formHour === 12 ? 12 : formHour + 12;
  }, [formHour, formAmPm]);

  const currentCronExpression = useMemo(
    () => buildCronExpression(formFrequency, formSelectedDays, formDayOfMonth, formHour24, formMinute),
    [formFrequency, formSelectedDays, formDayOfMonth, formHour24, formMinute],
  );

  const humanReadableSummary = useMemo(
    () => cronToHumanReadable(currentCronExpression, formTimezone),
    [currentCronExpression, formTimezone],
  );

  const isReportTypesEmpty = formReportTypes.size === 0;

  // ============ Toast Helpers ============

  const showToast = useCallback((type: 'success' | 'error', message: string) => {
    const id = ++toastIdRef.current;
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 5000);
  }, []);

  const dismissToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // ============ Data Fetching ============

  const fetchSchedules = useCallback(async (page?: number, size?: number) => {
    const p = page ?? currentPage;
    const s = size ?? pageSize;
    try {
      const data = await schedulesApi.list({ page: p, page_size: s });
      if (data && data.results) {
        setSchedules(data.results);
        setTotalCount(data.count);
      } else if (Array.isArray(data)) {
        setSchedules(data);
        setTotalCount(data.length);
      }
    } catch (err: any) {
      showToast('error', err.message || 'Failed to load schedules');
    }
  }, [currentPage, pageSize, showToast]);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await fetchSchedules();
      setIsLoading(false);
    };
    loadData();
  }, [fetchSchedules]);

  // ============ Form Helpers ============

  const resetForm = () => {
    setFormName('');
    setFormReportTypes(new Set());
    setFormFrequency('daily');
    setFormSelectedDays([]);
    setFormDayOfMonth(1);
    setFormHour(8);
    setFormMinute(0);
    setFormAmPm('AM');
    setFormTimezone('America/New_York');
    setFormEmails([]);
    setEmailInput('');
    setEmailError('');
    setEditingSchedule(null);
    setShowForm(false);
    setShowAdvanced(false);
  };

  const scrollToForm = () => {
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  const openCreateForm = () => {
    resetForm();
    setShowForm(true);
    scrollToForm();
  };

  const openEditForm = (schedule: ReportSchedule) => {
    setEditingSchedule(schedule);
    setFormName(schedule.name || '');
    setFormReportTypes(new Set(schedule.report_types));

    const parsed = parseCronToBuilderState(schedule.cron_expression);
    setFormFrequency(parsed.frequency);
    setFormSelectedDays(parsed.selectedDays);
    setFormDayOfMonth(parsed.dayOfMonth);
    setFormHour(parsed.hour12);
    setFormMinute(parsed.minute);
    setFormAmPm(parsed.ampm);
    setFormTimezone(schedule.timezone);

    setFormEmails([...schedule.recipients]);
    setEmailInput('');
    setEmailError('');
    setShowAdvanced(false);
    setShowForm(true);
    scrollToForm();
  };

  const handleReportTypeToggle = (value: string) => {
    setFormReportTypes((prev) => {
      const next = new Set(prev);
      if (next.has(value)) next.delete(value);
      else next.add(value);
      return next;
    });
  };

  const handleDayToggle = (day: number) => {
    setFormSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day],
    );
  };

  const handleAddEmail = () => {
    const trimmed = emailInput.trim();
    if (!trimmed) return;
    if (formEmails.length >= MAX_RECIPIENTS) {
      setEmailError(`Maximum ${MAX_RECIPIENTS} recipients allowed`);
      return;
    }
    if (!isValidEmail(trimmed)) {
      setEmailError('Please enter a valid email address');
      return;
    }
    if (formEmails.includes(trimmed)) {
      setEmailError('This email is already added');
      return;
    }
    setFormEmails((prev) => [...prev, trimmed]);
    setEmailInput('');
    setEmailError('');
  };

  const handleEmailKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddEmail();
    }
  };

  const handleRemoveEmail = (email: string) => {
    setFormEmails((prev) => prev.filter((e) => e !== email));
    setEmailError('');
  };

  // ============ CRUD Operations ============

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formName.trim()) {
      showToast('error', 'Please enter a schedule name');
      return;
    }
    if (isReportTypesEmpty) {
      showToast('error', 'Please select at least one report type');
      return;
    }
    if (formEmails.length === 0) {
      showToast('error', 'Please add at least one recipient email');
      return;
    }
    if (formEmails.length > MAX_RECIPIENTS) {
      showToast('error', `Maximum ${MAX_RECIPIENTS} recipients allowed`);
      return;
    }
    if (formFrequency === 'specific_days' && formSelectedDays.length === 0) {
      showToast('error', 'Please select at least one day');
      return;
    }

    const cronExpression = currentCronExpression;
    const scheduleTimeStr = `${String(formHour24).padStart(2, '0')}:${String(formMinute).padStart(2, '0')}:00`;

    setIsSubmitting(true);
    try {
      const payload = {
        name: formName.trim(),
        report_types: Array.from(formReportTypes) as ('daily' | 'weekly' | 'lp' | 'scheduling')[],
        cron_expression: cronExpression,
        schedule_time: scheduleTimeStr,
        timezone: formTimezone,
        recipients: formEmails,
      };

      if (editingSchedule) {
        await schedulesApi.update(editingSchedule.id, payload);
        showToast('success', 'Schedule updated successfully');
      } else {
        await schedulesApi.create(payload);
        showToast('success', 'Schedule created successfully');
      }
      resetForm();
      await fetchSchedules();
    } catch (err: any) {
      showToast('error', err.message || 'Failed to save schedule');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggle = async (schedule: ReportSchedule) => {
    setTogglingId(schedule.id);
    try {
      await schedulesApi.toggle(schedule.id, !schedule.is_active);
      showToast('success', `Schedule ${schedule.is_active ? 'deactivated' : 'activated'} successfully`);
      await fetchSchedules();
    } catch (err: any) {
      showToast('error', err.message || 'Failed to toggle schedule');
    } finally {
      setTogglingId(null);
    }
  };

  const handleDelete = async (schedule: ReportSchedule) => {
    setDeleteConfirmSchedule(null);
    setDeletingId(schedule.id);
    try {
      await schedulesApi.delete(schedule.id);
      showToast('success', 'Schedule deleted successfully');
      await fetchSchedules();
    } catch (err: any) {
      showToast('error', err.message || 'Failed to delete schedule');
    } finally {
      setDeletingId(null);
    }
  };

  // ============ Pagination ============

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
    fetchSchedules(newPage, pageSize);
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setCurrentPage(1);
    fetchSchedules(1, newSize);
  };

  // ============ Display Helpers ============

  const getStatusBadge = (status: string | null) => {
    if (!status) {
      return (
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-surface-500/10 text-surface-400">
          Never run
        </span>
      );
    }
    if (status === 'success') {
      return (
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-success-500/10 text-success-500">
          Success
        </span>
      );
    }
    if (status === 'partial') {
      return (
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-warning-500/10 text-warning-500">
          Partial
        </span>
      );
    }
    return (
      <span className="px-2 py-1 rounded-full text-xs font-medium bg-danger-500/10 text-danger-500">
        Failed
      </span>
    );
  };

  const selectClassName = "w-full px-4 py-2.5 rounded-lg border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-900 text-surface-900 dark:text-surface-100 text-sm focus:outline-none focus:ring-2 focus:ring-ezra-500/20 focus:border-ezra-500 transition-all duration-200";

  // ============ Render ============

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-ezra-500/10 flex items-center justify-center">
            <Mail className="w-6 h-6 text-ezra-400" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-surface-900 dark:text-surface-100">
              Report Scheduling
            </h1>
            <p className="text-surface-500 dark:text-surface-400">
              Schedule automated report delivery to your team
            </p>
          </div>
        </div>
        {!showForm && (
          <Button onClick={openCreateForm} leftIcon={<Plus className="w-4 h-4" />}>
            New Schedule
          </Button>
        )}
      </div>

      {/* Create/Edit Form */}
      {showForm && (
        <div ref={formRef}>
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-surface-900 dark:text-surface-100">
                {editingSchedule ? 'Edit Schedule' : 'Create New Schedule'}
              </h2>
              <button
                onClick={resetForm}
                className="p-1 text-surface-400 hover:text-surface-600 dark:hover:text-surface-300 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Schedule Name */}
              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">
                  Schedule Name
                </label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Daily Sales for West Region"
                  className={cn(selectClassName, 'max-w-md')}
                  maxLength={255}
                />
              </div>

              {/* Report Types */}
              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                  Report Types
                </label>
                <div className="flex flex-wrap gap-3">
                  {REPORT_TYPE_OPTIONS.map((opt) => (
                    <label
                      key={opt.value}
                      className={cn(
                        'flex items-center gap-2 px-4 py-2.5 rounded-lg border cursor-pointer transition-all duration-200 text-sm',
                        formReportTypes.has(opt.value)
                          ? 'border-ezra-500 bg-ezra-500/10 text-ezra-600 dark:text-ezra-400'
                          : 'border-surface-200 dark:border-surface-700 text-surface-600 dark:text-surface-400 hover:border-surface-300 dark:hover:border-surface-600'
                      )}
                    >
                      <input
                        type="checkbox"
                        checked={formReportTypes.has(opt.value)}
                        onChange={() => handleReportTypeToggle(opt.value)}
                        className="sr-only"
                      />
                      <div
                        className={cn(
                          'w-4 h-4 rounded border-2 flex items-center justify-center transition-colors',
                          formReportTypes.has(opt.value)
                            ? 'border-ezra-500 bg-ezra-500'
                            : 'border-surface-300 dark:border-surface-600'
                        )}
                      >
                        {formReportTypes.has(opt.value) && (
                          <CheckCircle className="w-3 h-3 text-white" />
                        )}
                      </div>
                      {opt.label}
                    </label>
                  ))}
                </div>
                {isReportTypesEmpty && (
                  <p className="text-sm text-danger-500 mt-1.5">Select at least one report type</p>
                )}
              </div>

              {/* Frequency Builder */}
              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                  Frequency
                </label>
                <div className="space-y-2">
                  {FREQUENCY_OPTIONS.map((opt) => (
                    <label
                      key={opt.value}
                      className={cn(
                        'flex items-center gap-3 px-4 py-2.5 rounded-lg border cursor-pointer transition-all duration-200 text-sm',
                        formFrequency === opt.value
                          ? 'border-ezra-500 bg-ezra-500/5'
                          : 'border-surface-200 dark:border-surface-700 hover:border-surface-300 dark:hover:border-surface-600'
                      )}
                    >
                      <input type="radio" name="frequency" value={opt.value} checked={formFrequency === opt.value} onChange={() => setFormFrequency(opt.value)} className="sr-only" />
                      <div className={cn('w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors', formFrequency === opt.value ? 'border-ezra-500' : 'border-surface-300 dark:border-surface-600')}>
                        {formFrequency === opt.value && <div className="w-2 h-2 rounded-full bg-ezra-500" />}
                      </div>
                      <span className="text-surface-900 dark:text-surface-100">{opt.label}</span>
                    </label>
                  ))}
                </div>

                {formFrequency === 'specific_days' && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {DAY_BUTTONS.map((day) => (
                      <button key={day.value} type="button" onClick={() => handleDayToggle(day.value)}
                        className={cn('px-3 py-1.5 rounded-lg text-sm font-medium border transition-all duration-200',
                          formSelectedDays.includes(day.value)
                            ? 'border-ezra-500 bg-ezra-500 text-white'
                            : 'border-surface-200 dark:border-surface-700 text-surface-600 dark:text-surface-400 hover:border-surface-300 dark:hover:border-surface-600'
                        )}
                      >{day.label}</button>
                    ))}
                  </div>
                )}

                {formFrequency === 'monthly' && (
                  <div className="mt-3">
                    <label className="block text-xs text-surface-500 dark:text-surface-400 mb-1">Day of month</label>
                    <select value={formDayOfMonth} onChange={(e) => setFormDayOfMonth(parseInt(e.target.value, 10))} className={selectClassName} style={{ maxWidth: '120px' }}>
                      {Array.from({ length: 28 }, (_, i) => i + 1).map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Time Selectors */}
              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">Delivery Time</label>
                <div className="flex flex-wrap items-center gap-2">
                  <select value={formHour} onChange={(e) => setFormHour(parseInt(e.target.value, 10))} className={selectClassName} style={{ width: '80px' }}>
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => (<option key={h} value={h}>{h}</option>))}
                  </select>
                  <span className="text-surface-500 dark:text-surface-400 font-medium">:</span>
                  <select value={formMinute} onChange={(e) => setFormMinute(parseInt(e.target.value, 10))} className={selectClassName} style={{ width: '80px' }}>
                    {MINUTE_OPTIONS.map((m) => (<option key={m} value={m}>{String(m).padStart(2, '0')}</option>))}
                  </select>
                  <select value={formAmPm} onChange={(e) => setFormAmPm(e.target.value as 'AM' | 'PM')} className={selectClassName} style={{ width: '80px' }}>
                    <option value="AM">AM</option>
                    <option value="PM">PM</option>
                  </select>
                </div>
              </div>

              {/* Timezone */}
              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">Timezone</label>
                <select value={formTimezone} onChange={(e) => setFormTimezone(e.target.value)} className={selectClassName}>
                  {TIMEZONE_OPTIONS.map((tz) => (<option key={tz} value={tz}>{tz.replace(/_/g, ' ')}</option>))}
                </select>
              </div>

              {/* Live Schedule Summary */}
              <div className="rounded-lg bg-surface-50 dark:bg-surface-800/50 border border-surface-200 dark:border-surface-700 px-4 py-3">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-ezra-500" />
                  <span className="font-medium text-surface-700 dark:text-surface-300">Schedule:</span>
                  <span className="text-surface-900 dark:text-surface-100">{humanReadableSummary}</span>
                </div>
              </div>

              {/* Advanced */}
              <div>
                <button type="button" onClick={() => setShowAdvanced(!showAdvanced)} className="flex items-center gap-1.5 text-sm text-surface-500 dark:text-surface-400 hover:text-surface-700 dark:hover:text-surface-300 transition-colors">
                  {showAdvanced ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  Advanced
                </button>
                {showAdvanced && (
                  <div className="mt-2">
                    <label className="block text-xs text-surface-500 dark:text-surface-400 mb-1">Cron Expression (read-only)</label>
                    <input type="text" value={currentCronExpression} readOnly className="w-full px-4 py-2 rounded-lg border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800 text-surface-600 dark:text-surface-400 text-sm font-mono cursor-default" />
                  </div>
                )}
              </div>

              {/* Recipients */}
              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">
                  Recipients ({formEmails.length}/{MAX_RECIPIENTS})
                </label>
                {formEmails.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-2">
                    {formEmails.map((email) => (
                      <span key={email} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm bg-ezra-500/10 text-ezra-500 border border-ezra-500/20">
                        {email}
                        <button type="button" onClick={() => handleRemoveEmail(email)} className="hover:text-ezra-700 dark:hover:text-ezra-300">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
                {formEmails.length < MAX_RECIPIENTS && (
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <Input type="email" value={emailInput} onChange={(e) => { setEmailInput(e.target.value); setEmailError(''); }} onKeyDown={handleEmailKeyDown} placeholder="Enter email address and press Enter" error={emailError} />
                    </div>
                    <Button type="button" variant="secondary" onClick={handleAddEmail} className="self-start">Add</Button>
                  </div>
                )}
                {formEmails.length >= MAX_RECIPIENTS && !emailError && (
                  <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">Maximum of {MAX_RECIPIENTS} recipients reached</p>
                )}
              </div>

              {/* Form Actions */}
              <div className="flex gap-3 pt-2">
                <Button type="button" variant="secondary" onClick={resetForm}>Cancel</Button>
                <Button type="submit" isLoading={isSubmitting} disabled={isSubmitting || isReportTypesEmpty || formEmails.length === 0 || !formName.trim()}>
                  {editingSchedule ? 'Update Schedule' : 'Create Schedule'}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* Schedules List */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-surface-900 dark:text-surface-100">
            Schedules {totalCount > 0 && <span className="text-surface-400 font-normal text-sm ml-1">({totalCount})</span>}
          </h2>
          {!showForm && (
            <Button size="sm" variant="secondary" onClick={openCreateForm} leftIcon={<Plus className="w-4 h-4" />}>
              Add
            </Button>
          )}
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-ezra-500" />
            <span className="ml-2 text-surface-500 dark:text-surface-400">Loading schedules...</span>
          </div>
        ) : schedules.length === 0 ? (
          <div className="text-center py-12">
            <Clock className="w-10 h-10 text-surface-300 dark:text-surface-600 mx-auto mb-3" />
            <p className="text-surface-500 dark:text-surface-400">No schedules yet</p>
            <p className="text-sm text-surface-400 dark:text-surface-500 mt-1">Create your first schedule to automate report delivery</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-surface-200 dark:border-surface-700">
                    <th className="text-left py-3 px-3 font-medium text-surface-500 dark:text-surface-400">Name</th>
                    <th className="text-left py-3 px-3 font-medium text-surface-500 dark:text-surface-400">Report Types</th>
                    <th className="text-left py-3 px-3 font-medium text-surface-500 dark:text-surface-400">Delivery Time</th>
                    <th className="text-left py-3 px-3 font-medium text-surface-500 dark:text-surface-400">Recipients</th>
                    <th className="text-left py-3 px-3 font-medium text-surface-500 dark:text-surface-400">Status</th>
                    <th className="text-left py-3 px-3 font-medium text-surface-500 dark:text-surface-400">Last Run</th>
                    <th className="text-right py-3 px-3 font-medium text-surface-500 dark:text-surface-400">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {schedules.map((schedule) => (
                    <tr key={schedule.id} className="border-b border-surface-100 dark:border-surface-800 hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-colors">
                      <td className="py-3 px-3">
                        <span className="font-medium text-surface-900 dark:text-surface-100">{schedule.name || '—'}</span>
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex flex-wrap gap-1">
                          {schedule.report_types.map((rt) => (
                            <span key={rt} className="px-2 py-0.5 rounded text-xs font-medium bg-ezra-500/10 text-ezra-600 dark:text-ezra-400">
                              {REPORT_TYPE_LABELS[rt] || rt}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-3 px-3 text-surface-600 dark:text-surface-400">
                        {cronToHumanReadable(schedule.cron_expression, schedule.timezone)}
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5 text-surface-400" />
                          <span className="text-surface-600 dark:text-surface-400">{schedule.recipients.length}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <button
                          onClick={() => handleToggle(schedule)}
                          disabled={togglingId === schedule.id}
                          className={cn(
                            'relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200 focus:outline-none',
                            schedule.is_active ? 'bg-success-500' : 'bg-surface-300 dark:bg-surface-600',
                            togglingId === schedule.id && 'opacity-50 cursor-not-allowed'
                          )}
                        >
                          <span className={cn(
                            'inline-block h-3.5 w-3.5 rounded-full bg-white transition-transform duration-200',
                            schedule.is_active ? 'translate-x-[18px]' : 'translate-x-[3px]'
                          )} />
                        </button>
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex flex-col gap-0.5">
                          {getStatusBadge(schedule.last_run_status)}
                          {schedule.last_run_at && (
                            <span className="text-xs text-surface-400">
                              {new Date(schedule.last_run_at).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => openEditForm(schedule)}
                            className="p-1.5 rounded-lg text-surface-400 hover:text-ezra-500 hover:bg-ezra-500/10 transition-colors"
                            title="Edit schedule"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirmSchedule(schedule)}
                            disabled={deletingId === schedule.id}
                            className={cn(
                              'p-1.5 rounded-lg text-surface-400 hover:text-danger-500 hover:bg-danger-500/10 transition-colors',
                              deletingId === schedule.id && 'opacity-50 cursor-not-allowed'
                            )}
                            title="Delete schedule"
                          >
                            {deletingId === schedule.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {totalCount > 0 && (
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-surface-200 dark:border-surface-700">
                <div className="flex items-center gap-2 text-sm text-surface-500 dark:text-surface-400">
                  <span>Show</span>
                  <select
                    value={pageSize}
                    onChange={(e) => handlePageSizeChange(parseInt(e.target.value, 10))}
                    className="px-2 py-1 rounded border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-900 text-surface-900 dark:text-surface-100 text-sm focus:outline-none focus:ring-1 focus:ring-ezra-500"
                  >
                    {PAGE_SIZE_OPTIONS.map((size) => (
                      <option key={size} value={size}>{size}</option>
                    ))}
                  </select>
                  <span>per page</span>
                  <span className="ml-2 text-surface-400">
                    {Math.min((currentPage - 1) * pageSize + 1, totalCount)}–{Math.min(currentPage * pageSize, totalCount)} of {totalCount}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage <= 1}
                    className={cn(
                      'p-1.5 rounded-lg transition-colors',
                      currentPage <= 1
                        ? 'text-surface-300 dark:text-surface-600 cursor-not-allowed'
                        : 'text-surface-500 hover:text-surface-700 dark:hover:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800'
                    )}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                    .reduce<(number | string)[]>((acc, p, idx, arr) => {
                      if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push('...');
                      acc.push(p);
                      return acc;
                    }, [])
                    .map((item, idx) =>
                      typeof item === 'string' ? (
                        <span key={`ellipsis-${idx}`} className="px-1 text-surface-400">…</span>
                      ) : (
                        <button
                          key={item}
                          onClick={() => handlePageChange(item)}
                          className={cn(
                            'min-w-[32px] h-8 rounded-lg text-sm font-medium transition-colors',
                            item === currentPage
                              ? 'bg-ezra-500 text-white'
                              : 'text-surface-500 hover:text-surface-700 dark:hover:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800'
                          )}
                        >
                          {item}
                        </button>
                      )
                    )}

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages}
                    className={cn(
                      'p-1.5 rounded-lg transition-colors',
                      currentPage >= totalPages
                        ? 'text-surface-300 dark:text-surface-600 cursor-not-allowed'
                        : 'text-surface-500 hover:text-surface-700 dark:hover:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800'
                    )}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </Card>

      {/* Delete Confirmation Modal */}
      {deleteConfirmSchedule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-fade-in">
          <div className="bg-white dark:bg-surface-900 rounded-xl shadow-xl max-w-md w-full mx-4 p-6">
            <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-100 mb-2">
              Delete Schedule
            </h3>
            <p className="text-surface-600 dark:text-surface-400 text-sm mb-1">
              Are you sure you want to delete <span className="font-medium text-surface-900 dark:text-surface-100">{deleteConfirmSchedule.name || 'this schedule'}</span>?
            </p>
            <p className="text-surface-500 dark:text-surface-500 text-xs mb-5">
              This action cannot be undone. All scheduled deliveries will be cancelled.
            </p>
            <div className="flex justify-end gap-3">
              <Button variant="secondary" size="sm" onClick={() => setDeleteConfirmSchedule(null)}>
                Cancel
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => handleDelete(deleteConfirmSchedule)}
                isLoading={deletingId === deleteConfirmSchedule.id}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
