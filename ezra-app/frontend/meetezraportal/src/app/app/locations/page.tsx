'use client';

// ===========================================
// EZRA PORTAL - Business Locations Page
// ===========================================

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Search,
  Filter,
  MapPin,
  Clock,
  AlertTriangle,
  CheckCircle,
  ChevronRight,
  Download,
  RefreshCw,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEnhancedLocations, useLocationFilters, useLocationSearch } from '@/hooks/useLocations';
import { formatCurrency, formatDateTime, formatCityState } from '@/lib/formatters';
import { Card } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { DataTable, type Column } from '@/components/ui/DataTable';
import type { Location } from '@/types';

// ============ Extended Location Type ============
interface EnhancedLocation extends Location {
  todayRevenue: number;
  avgTicket: number;
}

// ============ Filter Sidebar ============
interface FilterSidebarProps {
  states: string[];
  selectedState: string | undefined;
  selectedStatus: Location['status'] | undefined;
  onStateChange: (state: string | undefined) => void;
  onStatusChange: (status: Location['status'] | undefined) => void;
  onClear: () => void;
  isOpen: boolean;
  onClose: () => void;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  states,
  selectedState,
  selectedStatus,
  onStateChange,
  onStatusChange,
  onClear,
  isOpen,
  onClose,
}) => {
  const hasFilters = selectedState || selectedStatus;

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          'fixed lg:static inset-y-0 right-0 z-50 lg:z-0',
          'w-full lg:w-auto',
          'transform transition-transform lg:transform-none',
          isOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
        )}
      >
        {/* Filter bar */}
        <div className="flex items-center gap-3 flex-wrap bg-surface-50 dark:bg-surface-800/50 rounded-lg px-4 py-2.5 border border-surface-200 dark:border-surface-700/50">
          <span className="text-sm font-medium text-surface-500 dark:text-surface-400">
            Filters
          </span>
          
          <div className="h-4 w-px bg-surface-300 dark:bg-surface-600" />

          {/* State filter */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-surface-500 dark:text-surface-400">State</span>
            <select
              value={selectedState || ''}
              onChange={(e) => onStateChange(e.target.value || undefined)}
              className="rounded-md border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-900 text-surface-900 dark:text-surface-100 px-2.5 py-1 text-sm focus:ring-2 focus:ring-ezra-500 focus:border-ezra-500 outline-none"
            >
              <option value="">All States</option>
              {states.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
          </div>

          <div className="h-4 w-px bg-surface-300 dark:bg-surface-600" />

          {/* Status filter - pill buttons */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-surface-500 dark:text-surface-400">Status</span>
            <div className="flex items-center bg-surface-200 dark:bg-surface-700 rounded-lg p-0.5">
              <button
                onClick={() => onStatusChange(undefined)}
                className={cn(
                  'px-3 py-1 text-sm font-medium rounded-md transition-all',
                  !selectedStatus
                    ? 'bg-white dark:bg-surface-800 text-surface-900 dark:text-surface-100 shadow-sm'
                    : 'text-surface-600 dark:text-surface-400 hover:text-surface-900 dark:hover:text-surface-200'
                )}
              >
                All
              </button>
              <button
                onClick={() => onStatusChange('active')}
                className={cn(
                  'px-3 py-1 text-sm font-medium rounded-md transition-all',
                  selectedStatus === 'active'
                    ? 'bg-emerald-500 text-white shadow-sm'
                    : 'text-surface-600 dark:text-surface-400 hover:text-surface-900 dark:hover:text-surface-200'
                )}
              >
                Active
              </button>
              <button
                onClick={() => onStatusChange('inactive')}
                className={cn(
                  'px-3 py-1 text-sm font-medium rounded-md transition-all',
                  selectedStatus === 'inactive'
                    ? 'bg-rose-500 text-white shadow-sm'
                    : 'text-surface-600 dark:text-surface-400 hover:text-surface-900 dark:hover:text-surface-200'
                )}
              >
                Inactive
              </button>
            </div>
          </div>

          {hasFilters && (
            <>
              <div className="h-4 w-px bg-surface-300 dark:bg-surface-600" />
              <button
                onClick={onClear}
                className="text-sm text-ezra-500 hover:text-ezra-400 font-medium"
              >
                Clear all
              </button>
            </>
          )}

          <button
            onClick={onClose}
            className="lg:hidden p-1 hover:bg-surface-100 dark:hover:bg-surface-800 rounded ml-auto"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </aside>
    </>
  );
};

// ============ Location Card (Grid View) ============
interface LocationCardProps {
  location: EnhancedLocation;
  onClick: () => void;
}

const LocationCard: React.FC<LocationCardProps> = ({ location, onClick }) => {
  const getRiskBadge = (score?: number) => {
    if (score === undefined) return null;
    if (score >= 30) {
      return (
        <span className="badge-danger flex items-center gap-1">
          <AlertTriangle className="w-3 h-3" />
          High Risk
        </span>
      );
    }
    if (score >= 15) {
      return (
        <span className="badge-warning flex items-center gap-1">
          Medium
        </span>
      );
    }
    return (
      <span className="badge-success flex items-center gap-1">
        <CheckCircle className="w-3 h-3" />
        Low
      </span>
    );
  };

  return (
    <Card
      hover
      className="cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono text-surface-500 bg-surface-100 dark:bg-surface-800 px-2 py-0.5 rounded">
              {location.storeCode}
            </span>
            <span
              className={cn(
                'w-2 h-2 rounded-full',
                location.status === 'active'
                  ? 'bg-success-500'
                  : location.status === 'onboarding'
                  ? 'bg-warning-500'
                  : 'bg-surface-400'
              )}
            />
          </div>
          <h3 className="font-semibold text-surface-900 dark:text-surface-100">
            {location.name}
          </h3>
        </div>
        <ChevronRight className="w-5 h-5 text-surface-400" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-surface-500 mb-1">Yesterday's Revenue</p>
          <p className="text-lg font-semibold text-surface-900 dark:text-surface-100">
            {formatCurrency(location.todayRevenue)}
          </p>
        </div>
        <div>
          <p className="text-xs text-surface-500 mb-1">Avg Ticket</p>
          <p className="text-lg font-semibold text-surface-900 dark:text-surface-100">
            {formatCurrency(location.avgTicket)}
          </p>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-surface-100 dark:border-surface-700 flex items-center justify-between">
        <div className="flex items-center gap-1 text-xs text-surface-500">
          <Clock className="w-3.5 h-3.5" />
          {location.lastSyncAt
            ? `Synced at ${formatDateTime(location.lastSyncAt)}`
            : 'Never synced'}
        </div>
        {getRiskBadge(location.lpRiskScore)}
      </div>
    </Card>
  );
};

// ============ Main Locations Page ============
export default function LocationsPage() {
  const router = useRouter();
  const { locations, isLoading } = useEnhancedLocations({ includeAll: true });
  const { states } = useLocationFilters();
  const { searchTerm, setSearchTerm, debouncedTerm } = useLocationSearch();

  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedState, setSelectedState] = useState<string | undefined>();
  const [selectedStatus, setSelectedStatus] = useState<Location['status'] | undefined>();

  // Filter locations
  const filteredLocations = useMemo(() => {
    return locations.filter((loc) => {
      // Search filter
      if (debouncedTerm) {
        const search = debouncedTerm.toLowerCase();
        const matches =
          loc.name.toLowerCase().includes(search) ||
          loc.storeCode.toLowerCase().includes(search) ||
          loc.city.toLowerCase().includes(search);
        if (!matches) return false;
      }
      // State filter
      if (selectedState && loc.state !== selectedState) return false;
      // Status filter
      if (selectedStatus && loc.status !== selectedStatus) return false;
      return true;
    });
  }, [locations, debouncedTerm, selectedState, selectedStatus]);

  const handleLocationClick = (location: EnhancedLocation) => {
    router.push(`/app/locations/${location.id}`);
  };

  const clearFilters = () => {
    setSelectedState(undefined);
    setSelectedStatus(undefined);
    setSearchTerm('');
  };

  // Table columns
  const columns: Column<EnhancedLocation>[] = [
    {
      key: 'storeCode',
      header: 'Store Code',
      accessor: (row) => (
        <span className="font-mono text-sm">{row.storeCode}</span>
      ),
      sortable: true,
      width: '100px',
    },
    {
      key: 'name',
      header: 'Name',
      accessor: 'name',
      sortable: true,
    },
    {
      key: 'location',
      header: 'Location',
      accessor: (row) => formatCityState(row.city, row.state),
      sortable: true,
    },
    {
      key: 'todayRevenue',
      header: "Yesterday's Revenue",
      accessor: (row) => formatCurrency(row.todayRevenue),
      sortable: true,
      align: 'right',
    },
    {
      key: 'avgTicket',
      header: 'Avg Ticket',
      accessor: (row) => formatCurrency(row.avgTicket),
      sortable: true,
      align: 'right',
    },
    {
      key: 'lpRiskScore',
      header: 'LP Risk',
      accessor: (row) => {
        if (row.lpRiskScore === undefined) return '—';
        return (
          <span
            className={cn(
              'inline-block px-2 py-0.5 rounded-full text-xs font-medium',
              row.lpRiskScore >= 30
                ? 'bg-danger-50 dark:bg-danger-500/10 text-danger-600 dark:text-danger-500'
                : row.lpRiskScore >= 15
                ? 'bg-warning-50 dark:bg-warning-500/10 text-warning-600 dark:text-warning-500'
                : 'bg-success-50 dark:bg-success-500/10 text-success-600 dark:text-success-500'
            )}
          >
            {row.lpRiskScore}
          </span>
        );
      },
      sortable: true,
      align: 'center',
    },
    {
      key: 'lastSync',
      header: 'Last Sync',
      accessor: (row) =>
        row.lastSyncAt ? `Synced at ${formatDateTime(row.lastSyncAt)}` : 'Never',
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-surface-900 dark:text-surface-100">
            Business Locations
          </h1>
          <p className="text-surface-500 dark:text-surface-400 mt-1">
            {filteredLocations.length} of {locations.length} locations
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            size="sm"
            leftIcon={<Download className="w-4 h-4" />}
          >
            Export
          </Button>
        </div>
      </div>

      {/* Search and view toggle */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search by name, code, or city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            leftIcon={<Search className="w-5 h-5" />}
            rightIcon={
              searchTerm ? (
                <button onClick={() => setSearchTerm('')}>
                  <X className="w-4 h-4 hover:text-surface-300" />
                </button>
              ) : undefined
            }
          />
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            leftIcon={<Filter className="w-4 h-4" />}
            onClick={() => setFilterOpen(true)}
            className="lg:hidden"
          >
            Filters
          </Button>
          <div className="flex rounded-lg border border-surface-200 dark:border-surface-700 overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={cn(
                'px-3 py-2 text-sm font-medium transition-colors',
                viewMode === 'grid'
                  ? 'bg-surface-100 dark:bg-surface-800 text-surface-900 dark:text-surface-100'
                  : 'text-surface-500 hover:text-surface-700 dark:hover:text-surface-300'
              )}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={cn(
                'px-3 py-2 text-sm font-medium transition-colors',
                viewMode === 'table'
                  ? 'bg-surface-100 dark:bg-surface-800 text-surface-900 dark:text-surface-100'
                  : 'text-surface-500 hover:text-surface-700 dark:hover:text-surface-300'
              )}
            >
              Table
            </button>
          </div>
        </div>
      </div>

      {/* Horizontal filter bar */}
      <div className="hidden lg:block">
        <FilterSidebar
          states={states}
          selectedState={selectedState}
          selectedStatus={selectedStatus}
          onStateChange={setSelectedState}
          onStatusChange={setSelectedStatus}
          onClear={clearFilters}
          isOpen={filterOpen}
          onClose={() => setFilterOpen(false)}
        />
      </div>

      {/* Mobile filter sidebar */}
      <div className="lg:hidden">
        <FilterSidebar
          states={states}
          selectedState={selectedState}
          selectedStatus={selectedStatus}
          onStateChange={setSelectedState}
          onStatusChange={setSelectedStatus}
          onClear={clearFilters}
          isOpen={filterOpen}
          onClose={() => setFilterOpen(false)}
        />
      </div>

      {/* Locations content - full width */}
      <div className="w-full">
          {isLoading ? (
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-48 skeleton rounded-xl" />
              ))}
            </div>
          ) : filteredLocations.length === 0 ? (
            <Card className="py-12 text-center">
              <MapPin className="w-12 h-12 mx-auto text-surface-300 dark:text-surface-600 mb-4" />
              <h3 className="text-lg font-medium text-surface-900 dark:text-surface-100 mb-2">
                No locations found
              </h3>
              <p className="text-surface-500 mb-4">
                Try adjusting your search or filters
              </p>
              <Button variant="secondary" onClick={clearFilters}>
                Clear filters
              </Button>
            </Card>
          ) : viewMode === 'grid' ? (
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredLocations.map((location) => (
                <LocationCard
                  key={location.id}
                  location={location}
                  onClick={() => handleLocationClick(location)}
                />
              ))}
            </div>
          ) : (
            <Card padding="none">
              <DataTable
                columns={columns}
                data={filteredLocations}
                keyExtractor={(row) => row.id}
                onRowClick={handleLocationClick}
                defaultSort={{ key: 'storeCode', direction: 'asc' }}
              />
            </Card>
          )}
      </div>
    </div>
  );
}
