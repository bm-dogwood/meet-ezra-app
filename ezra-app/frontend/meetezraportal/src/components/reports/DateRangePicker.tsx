'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Calendar, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DateRange {
  startDate: Date | null;
  endDate: Date | null;
}

type PresetOption = 'yesterday' | 'thisWeek' | 'lastWeek' | 'thisMonth' | 'lastMonth' | 'custom';

type PickerMode = 'single' | 'range';

interface DateRangePickerProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
  maxDate?: Date;
  minDate?: Date;
  className?: string;
  mode?: PickerMode; // 'single' for daily reports, 'range' for weekly reports
}

const RANGE_PRESET_OPTIONS: { value: PresetOption; label: string }[] = [
  { value: 'thisWeek', label: 'This Week' },
  { value: 'lastWeek', label: 'Last Week' },
  { value: 'thisMonth', label: 'This Month' },
  { value: 'lastMonth', label: 'Last Month' },
  { value: 'custom', label: 'Custom Range' },
];

const SINGLE_PRESET_OPTIONS: { value: PresetOption; label: string }[] = [
  { value: 'yesterday', label: 'Yesterday' },
  { value: 'custom', label: 'Select Date' },
];

function getPresetRange(preset: PresetOption): DateRange {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  switch (preset) {
    case 'yesterday':
      return { startDate: yesterday, endDate: yesterday };
    
    case 'thisWeek': {
      const startOfWeek = new Date(yesterday);
      const dayOfWeek = yesterday.getDay();
      const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
      startOfWeek.setDate(yesterday.getDate() - daysToMonday);
      return { startDate: startOfWeek, endDate: yesterday };
    }
    
    case 'lastWeek': {
      const endOfLastWeek = new Date(yesterday);
      const dayOfWeek = yesterday.getDay();
      const daysToLastSunday = dayOfWeek === 0 ? 7 : dayOfWeek;
      endOfLastWeek.setDate(yesterday.getDate() - daysToLastSunday);
      const startOfLastWeek = new Date(endOfLastWeek);
      startOfLastWeek.setDate(endOfLastWeek.getDate() - 6);
      return { startDate: startOfLastWeek, endDate: endOfLastWeek };
    }
    
    case 'thisMonth': {
      const startOfMonth = new Date(yesterday.getFullYear(), yesterday.getMonth(), 1);
      return { startDate: startOfMonth, endDate: yesterday };
    }
    
    case 'lastMonth': {
      const startOfLastMonth = new Date(yesterday.getFullYear(), yesterday.getMonth() - 1, 1);
      const endOfLastMonth = new Date(yesterday.getFullYear(), yesterday.getMonth(), 0);
      return { startDate: startOfLastMonth, endDate: endOfLastMonth };
    }
    
    case 'custom':
    default:
      return { startDate: null, endDate: null };
  }
}

function formatDate(date: Date | null): string {
  if (!date) return '';
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  });
}

function formatDateISO(date: Date): string {
  return date.toISOString().split('T')[0];
}

export function DateRangePicker({ 
  value, 
  onChange, 
  maxDate,
  minDate,
  className,
  mode = 'range'
}: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<PresetOption>(mode === 'single' ? 'yesterday' : 'thisWeek');
  const presetOptions = mode === 'single' ? SINGLE_PRESET_OPTIONS : RANGE_PRESET_OPTIONS;
  const [showCalendar, setShowCalendar] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(new Date());
  const [selectingStart, setSelectingStart] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Default maxDate to yesterday if not provided
  const effectiveMaxDate = maxDate || (() => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday;
  })();
  
  // Default minDate to 90 days ago if not provided
  const effectiveMinDate = minDate || (() => {
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 91);
    return ninetyDaysAgo;
  })();
  
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setShowCalendar(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  const handlePresetSelect = (preset: PresetOption) => {
    setSelectedPreset(preset);
    if (preset === 'custom') {
      setShowCalendar(true);
      setSelectingStart(true);
    } else {
      const range = getPresetRange(preset);
      onChange(range);
      setIsOpen(false);
      setShowCalendar(false);
    }
  };
  
  const handleDateClick = (date: Date) => {
    if (mode === 'single') {
      // Single date mode - set both start and end to same date
      onChange({ startDate: date, endDate: date });
      setIsOpen(false);
      setShowCalendar(false);
    } else {
      // Range mode - select start then end
      if (selectingStart) {
        onChange({ startDate: date, endDate: null });
        setSelectingStart(false);
      } else {
        if (value.startDate && date < value.startDate) {
          onChange({ startDate: date, endDate: value.startDate });
        } else {
          onChange({ startDate: value.startDate, endDate: date });
        }
        setIsOpen(false);
        setShowCalendar(false);
        setSelectingStart(true);
      }
    }
  };
  
  const isDateDisabled = (date: Date) => {
    return date > effectiveMaxDate || date < effectiveMinDate;
  };
  
  const isDateInRange = (date: Date) => {
    if (!value.startDate || !value.endDate) return false;
    return date >= value.startDate && date <= value.endDate;
  };
  
  const isDateSelected = (date: Date) => {
    if (value.startDate && formatDateISO(date) === formatDateISO(value.startDate)) return true;
    if (value.endDate && formatDateISO(date) === formatDateISO(value.endDate)) return true;
    return false;
  };
  
  const renderCalendar = () => {
    const year = calendarMonth.getFullYear();
    const month = calendarMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startPadding = firstDay.getDay();
    
    const days = [];
    
    // Add padding for days before month starts
    for (let i = 0; i < startPadding; i++) {
      days.push(<div key={`pad-${i}`} className="w-8 h-8" />);
    }
    
    // Add days of month
    for (let d = 1; d <= lastDay.getDate(); d++) {
      const date = new Date(year, month, d);
      const disabled = isDateDisabled(date);
      const selected = isDateSelected(date);
      const inRange = isDateInRange(date);
      
      days.push(
        <button
          key={d}
          type="button"
          disabled={disabled}
          onClick={() => handleDateClick(date)}
          className={cn(
            'w-8 h-8 rounded-full text-sm font-medium transition-colors',
            disabled && 'text-surface-300 dark:text-surface-600 cursor-not-allowed',
            !disabled && !selected && !inRange && 'hover:bg-surface-100 dark:hover:bg-surface-700',
            selected && 'bg-ezra-500 text-white',
            inRange && !selected && 'bg-ezra-100 dark:bg-ezra-900'
          )}
        >
          {d}
        </button>
      );
    }
    
    return days;
  };
  
  const displayValue = () => {
    if (mode === 'single') {
      if (value.startDate) {
        return formatDate(value.startDate);
      }
      return 'Select date';
    }
    
    if (value.startDate && value.endDate) {
      if (formatDateISO(value.startDate) === formatDateISO(value.endDate)) {
        return formatDate(value.startDate);
      }
      return `${formatDate(value.startDate)} - ${formatDate(value.endDate)}`;
    }
    if (value.startDate) {
      return `${formatDate(value.startDate)} - Select end date`;
    }
    return 'Select date range';
  };
  
  return (
    <div className={cn('relative', className)} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center gap-2 px-4 py-2 rounded-lg border',
          'bg-white dark:bg-surface-800',
          'border-surface-200 dark:border-surface-700',
          'hover:border-surface-300 dark:hover:border-surface-600',
          'text-surface-900 dark:text-surface-100',
          'transition-colors',
          mode === 'single' ? 'min-w-[180px]' : 'min-w-[280px]'
        )}
      >
        <Calendar className="w-4 h-4 text-surface-500" />
        <span className="flex-1 text-left text-sm">{displayValue()}</span>
        <ChevronDown className={cn(
          'w-4 h-4 text-surface-500 transition-transform',
          isOpen && 'rotate-180'
        )} />
      </button>
      
      {isOpen && (
        <div className={cn(
          'absolute top-full right-0 mt-2 z-50',
          'bg-white dark:bg-surface-800',
          'border border-surface-200 dark:border-surface-700',
          'rounded-lg shadow-lg',
          'min-w-[320px]'
        )}>
          {!showCalendar ? (
            <div className="p-2">
              {presetOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handlePresetSelect(option.value)}
                  className={cn(
                    'w-full text-left px-3 py-2 rounded-md text-sm',
                    'hover:bg-surface-100 dark:hover:bg-surface-700',
                    'text-surface-900 dark:text-surface-100',
                    selectedPreset === option.value && 'bg-ezra-50 dark:bg-ezra-900/20 text-ezra-600'
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          ) : (
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <button
                  type="button"
                  onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1))}
                  className="p-1 rounded hover:bg-surface-100 dark:hover:bg-surface-700"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="font-medium text-surface-900 dark:text-surface-100">
                  {calendarMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </span>
                <button
                  type="button"
                  onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1))}
                  className="p-1 rounded hover:bg-surface-100 dark:hover:bg-surface-700"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
              
              <div className="grid grid-cols-7 gap-1 text-center mb-2">
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
                  <div key={day} className="w-8 h-8 flex items-center justify-center text-xs text-surface-500">
                    {day}
                  </div>
                ))}
              </div>
              
              <div className="grid grid-cols-7 gap-1">
                {renderCalendar()}
              </div>
              
              <div className="mt-4 pt-4 border-t border-surface-200 dark:border-surface-700 flex justify-between">
                <button
                  type="button"
                  onClick={() => {
                    setShowCalendar(false);
                    setSelectingStart(true);
                  }}
                  className="text-sm text-surface-500 hover:text-surface-700"
                >
                  Back to presets
                </button>
                <span className="text-xs text-surface-400">
                  {mode === 'single' ? 'Select date' : (selectingStart ? 'Select start date' : 'Select end date')}
                </span>
              </div>
            </div>
          )}
          
          <div className="px-4 py-2 border-t border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900 rounded-b-lg">
            <p className="text-xs text-surface-500">
              Reports available for up to 90 days. Dates max out at yesterday.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default DateRangePicker;
