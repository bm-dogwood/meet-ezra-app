// ===========================================
// EZRA PORTAL - KPI Card Component
// ===========================================

import React from 'react';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  DollarSign,
  Receipt,
  Users,
  AlertTriangle,
  Activity,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatCurrency, formatPercent, formatNumber } from '@/lib/formatters';
import type { KPIData } from '@/types';

const iconMap: Record<string, React.FC<{ className?: string }>> = {
  'dollar-sign': DollarSign,
  'receipt': Receipt,
  'users': Users,
  'alert-triangle': AlertTriangle,
  'trending-up': Activity,
};

export interface KPICardProps {
  data: KPIData;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const KPICard: React.FC<KPICardProps> = ({ data, className, size = 'md' }) => {
  const { label, value, change, changeLabel, trend, format, icon } = data;

  const formatValue = (val: number | string) => {
    if (typeof val === 'string') return val;
    switch (format) {
      case 'currency':
        return formatCurrency(val, { compact: val >= 10000 });
      case 'percent':
        return formatPercent(val, { alreadyPercent: true });
      default:
        return formatNumber(val);
    }
  };

  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4" />;
      case 'down':
        return <TrendingDown className="w-4 h-4" />;
      default:
        return <Minus className="w-4 h-4" />;
    }
  };

  const getTrendColor = () => {
    // For metrics where down is good (like LP risk count), invert the color
    const isInverted = label.toLowerCase().includes('risk') || label.toLowerCase().includes('labor');
    
    if (trend === 'up') {
      return isInverted
        ? 'text-danger-500 bg-danger-50 dark:bg-danger-500/10'
        : 'text-success-500 bg-success-50 dark:bg-success-500/10';
    }
    if (trend === 'down') {
      return isInverted
        ? 'text-success-500 bg-success-50 dark:bg-success-500/10'
        : 'text-danger-500 bg-danger-50 dark:bg-danger-500/10';
    }
    return 'text-surface-500 bg-surface-100 dark:bg-surface-800';
  };

  const IconComponent = icon ? iconMap[icon] : null;

  const sizes = {
    sm: {
      card: 'p-4',
      value: 'text-xl',
      label: 'text-xs',
      change: 'text-xs',
    },
    md: {
      card: 'p-5',
      value: 'text-2xl',
      label: 'text-sm',
      change: 'text-xs',
    },
    lg: {
      card: 'p-6',
      value: 'text-3xl',
      label: 'text-base',
      change: 'text-sm',
    },
  };

  return (
    <div
      className={cn(
        'rounded-xl bg-white dark:bg-surface-850',
        'border border-surface-200 dark:border-surface-700/50',
        'transition-all duration-300',
        'hover:shadow-card-hover hover:border-surface-300 dark:hover:border-surface-600',
        sizes[size].card,
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <span
          className={cn(
            'font-medium text-surface-500 dark:text-surface-400',
            sizes[size].label
          )}
        >
          {label}
        </span>
        {IconComponent && (
          <div className="p-2 rounded-lg bg-ezra-500/10 text-ezra-500">
            <IconComponent className="w-4 h-4" />
          </div>
        )}
      </div>

      {/* Value */}
      <div
        className={cn(
          'font-semibold text-surface-900 dark:text-surface-100 tracking-tight',
          sizes[size].value
        )}
      >
        {formatValue(value)}
      </div>

      {/* Change indicator */}
      {change !== undefined && (
        <div className="flex items-center gap-2 mt-3">
          <span
            className={cn(
              'inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-medium',
              getTrendColor(),
              sizes[size].change
            )}
          >
            {getTrendIcon()}
            {formatPercent(Math.abs(change), { alreadyPercent: true })}
          </span>
          {changeLabel && (
            <span
              className={cn(
                'text-surface-400 dark:text-surface-500',
                sizes[size].change
              )}
            >
              {changeLabel}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

// Grid wrapper for KPI cards
export interface KPIGridProps {
  children: React.ReactNode;
  columns?: 2 | 3 | 4 | 5;
  className?: string;
}

export const KPIGrid: React.FC<KPIGridProps> = ({
  children,
  columns = 4,
  className,
}) => {
  const gridCols = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
    5: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5',
  };

  return (
    <div className={cn('grid gap-4', gridCols[columns], className)}>
      {children}
    </div>
  );
};

export default KPICard;
