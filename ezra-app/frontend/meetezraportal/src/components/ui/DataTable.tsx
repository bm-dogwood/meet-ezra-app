'use client';

// ===========================================
// EZRA PORTAL - Data Table Component
// ===========================================

import React, { useState, useMemo } from 'react';
import { ChevronUp, ChevronDown, ChevronsUpDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

// ============ Types ============

export interface Column<T> {
  key: string;
  header: string;
  accessor: keyof T | ((row: T) => React.ReactNode);
  sortValue?: keyof T | ((row: T) => number | string | null);  // Raw value for sorting
  sortable?: boolean;
  align?: 'left' | 'center' | 'right';
  width?: string;
  className?: string;
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (row: T) => string;
  onRowClick?: (row: T) => void;
  isLoading?: boolean;
  emptyMessage?: string;
  className?: string;
  // Pagination
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
    onPageChange: (page: number) => void;
  };
  // Sorting (client-side)
  defaultSort?: { key: string; direction: 'asc' | 'desc' };
}

// ============ Component ============

export function DataTable<T extends object>({
  columns,
  data,
  keyExtractor,
  onRowClick,
  isLoading = false,
  emptyMessage = 'No data available',
  className,
  pagination,
  defaultSort,
}: DataTableProps<T>) {
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'asc' | 'desc';
  } | null>(defaultSort || null);

  // Handle sorting
  const handleSort = (key: string) => {
    setSortConfig((current) => {
      if (current?.key === key) {
        return {
          key,
          direction: current.direction === 'asc' ? 'desc' : 'asc',
        };
      }
      return { key, direction: 'asc' };
    });
  };

  // Get sort value for a row
  const getSortValue = (row: T, col: Column<T>): number | string | null => {
    // Use sortValue if provided, otherwise use accessor
    if (col.sortValue) {
      if (typeof col.sortValue === 'function') {
        return col.sortValue(row);
      }
      return row[col.sortValue] as number | string | null;
    }
    // Fall back to raw accessor value (not the rendered version)
    if (typeof col.accessor === 'string') {
      return row[col.accessor] as number | string | null;
    }
    // For function accessors without sortValue, use the key to access raw data
    return row[col.key as keyof T] as number | string | null;
  };

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortConfig) return data;

    return [...data].sort((a, b) => {
      const col = columns.find((c) => c.key === sortConfig.key);
      if (!col) return 0;

      const aVal = getSortValue(a, col);
      const bVal = getSortValue(b, col);

      // Handle nulls
      if (aVal === null && bVal === null) return 0;
      if (aVal === null) return sortConfig.direction === 'asc' ? 1 : -1;
      if (bVal === null) return sortConfig.direction === 'asc' ? -1 : 1;

      // Handle different types
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortConfig.direction === 'asc' ? aVal - bVal : bVal - aVal;
      }

      const aStr = String(aVal);
      const bStr = String(bVal);
      return sortConfig.direction === 'asc'
        ? aStr.localeCompare(bStr)
        : bStr.localeCompare(aStr);
    });
  }, [data, sortConfig, columns]);

  // Get sort icon
  const getSortIcon = (key: string) => {
    if (sortConfig?.key !== key) {
      return <ChevronsUpDown className="w-4 h-4 text-surface-400" />;
    }
    return sortConfig.direction === 'asc' ? (
      <ChevronUp className="w-4 h-4 text-ezra-500" />
    ) : (
      <ChevronDown className="w-4 h-4 text-ezra-500" />
    );
  };

  // Render cell value
  const renderCell = (row: T, column: Column<T>) => {
    if (typeof column.accessor === 'function') {
      return column.accessor(row);
    }
    return row[column.accessor as keyof T] as React.ReactNode;
  };

  return (
    <div className={cn('w-full', className)}>
      {/* Table container with horizontal scroll */}
      <div className="overflow-x-auto rounded-lg border border-surface-200 dark:border-surface-700/50">
        <table className="w-full text-sm">
          {/* Header */}
          <thead>
            <tr className="bg-surface-50 dark:bg-surface-800/50">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={cn(
                    'px-4 py-3 text-left font-semibold text-surface-700 dark:text-surface-300',
                    'border-b border-surface-200 dark:border-surface-700/50',
                    column.sortable && 'cursor-pointer select-none hover:bg-surface-100 dark:hover:bg-surface-700/50',
                    column.align === 'center' && 'text-center',
                    column.align === 'right' && 'text-right',
                    column.className
                  )}
                  style={{ width: column.width }}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div
                    className={cn(
                      'flex items-center gap-2',
                      column.align === 'center' && 'justify-center',
                      column.align === 'right' && 'justify-end'
                    )}
                  >
                    <span>{column.header}</span>
                    {column.sortable && getSortIcon(column.key)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          {/* Body */}
          <tbody className="bg-white dark:bg-surface-850">
            {isLoading ? (
              // Loading skeleton
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-4">
                      <div className="h-4 bg-surface-200 dark:bg-surface-700 rounded animate-pulse" />
                    </td>
                  ))}
                </tr>
              ))
            ) : sortedData.length === 0 ? (
              // Empty state
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-12 text-center text-surface-500 dark:text-surface-400"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              // Data rows
              sortedData.map((row) => (
                <tr
                  key={keyExtractor(row)}
                  className={cn(
                    'border-b border-surface-100 dark:border-surface-800 last:border-0',
                    'transition-colors',
                    onRowClick &&
                      'cursor-pointer hover:bg-surface-50 dark:hover:bg-surface-800/50'
                  )}
                  onClick={() => onRowClick?.(row)}
                >
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={cn(
                        'px-4 py-4 text-surface-700 dark:text-surface-300',
                        column.align === 'center' && 'text-center',
                        column.align === 'right' && 'text-right',
                        column.className
                      )}
                    >
                      {renderCell(row, column)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && pagination.total > pagination.pageSize && (
        <div className="flex items-center justify-between mt-4 px-2">
          <span className="text-sm text-surface-500 dark:text-surface-400">
            Showing {(pagination.page - 1) * pagination.pageSize + 1} to{' '}
            {Math.min(pagination.page * pagination.pageSize, pagination.total)} of{' '}
            {pagination.total} results
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => pagination.onPageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className={cn(
                'p-2 rounded-lg transition-colors',
                'hover:bg-surface-100 dark:hover:bg-surface-800',
                'disabled:opacity-50 disabled:cursor-not-allowed'
              )}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from(
              { length: Math.ceil(pagination.total / pagination.pageSize) },
              (_, i) => i + 1
            )
              .filter(
                (p) =>
                  p === 1 ||
                  p === Math.ceil(pagination.total / pagination.pageSize) ||
                  Math.abs(p - pagination.page) <= 1
              )
              .map((p, i, arr) => (
                <React.Fragment key={p}>
                  {i > 0 && arr[i - 1] !== p - 1 && (
                    <span className="text-surface-400">...</span>
                  )}
                  <button
                    onClick={() => pagination.onPageChange(p)}
                    className={cn(
                      'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                      p === pagination.page
                        ? 'bg-ezra-500 text-white'
                        : 'hover:bg-surface-100 dark:hover:bg-surface-800 text-surface-600 dark:text-surface-400'
                    )}
                  >
                    {p}
                  </button>
                </React.Fragment>
              ))}
            <button
              onClick={() => pagination.onPageChange(pagination.page + 1)}
              disabled={
                pagination.page ===
                Math.ceil(pagination.total / pagination.pageSize)
              }
              className={cn(
                'p-2 rounded-lg transition-colors',
                'hover:bg-surface-100 dark:hover:bg-surface-800',
                'disabled:opacity-50 disabled:cursor-not-allowed'
              )}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DataTable;
