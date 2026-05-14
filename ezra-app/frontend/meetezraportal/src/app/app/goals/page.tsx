'use client';

// ===========================================
// EZRA PORTAL - Set Goals Page
// ===========================================

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Edit2, Check, X, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { targetsApi } from '@/lib/api';
import { Card } from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import { formatCurrency } from '@/lib/formatters';

interface StoreTarget {
  store_id: number;
  store_name: string;
  store_code: string;
  city: string | null;
  state: string | null;
  daily_revenue_target: number;
  daily_labor_target_hours: number;
  has_target: boolean;
}

interface TargetsResponse {
  target_date: string;
  targets: StoreTarget[];
  total_stores: number;
}

// ============ Editable Cell ============
interface EditableCellProps {
  value: number;
  onSave: (value: number) => void;
  format?: 'currency' | 'hours';
}

const EditableCell: React.FC<EditableCellProps> = ({ value, onSave, format = 'currency' }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(String(value));

  const handleSave = () => {
    const numValue = parseFloat(editValue) || 0;
    onSave(numValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(String(value));
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="flex items-center gap-1">
        <Input
          type="number"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          className="w-24 h-8 text-sm"
          min={0}
          autoFocus
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSave();
            if (e.key === 'Escape') handleCancel();
          }}
        />
        <button
          onClick={handleSave}
          className="p-1 text-success-500 hover:bg-success-50 dark:hover:bg-success-500/10 rounded"
        >
          <Check className="w-4 h-4" />
        </button>
        <button
          onClick={handleCancel}
          className="p-1 text-danger-500 hover:bg-danger-50 dark:hover:bg-danger-500/10 rounded"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setIsEditing(true)}
      className="flex items-center gap-2 px-2 py-1 rounded hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors group"
    >
      <span className="text-sm">
        {format === 'currency' ? formatCurrency(value) : `${value} Hours`}
      </span>
      <Edit2 className="w-3 h-3 text-surface-400 opacity-0 group-hover:opacity-100 transition-opacity" />
    </button>
  );
};

// ============ Main Set Goals Page ============
export default function SetGoalsPage() {
  const { isAuthenticated } = useAuth();
  const [targets, setTargets] = useState<StoreTarget[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchTargets = useCallback(async () => {
    if (!isAuthenticated) return;
    
    setIsLoading(true);
    try {
      const data: TargetsResponse = await targetsApi.getTargets();
      setTargets(data.targets || []);
    } catch (error) {
      console.error('Error fetching targets:', error);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  // Filter targets based on search term
  const filteredTargets = useMemo(() => {
    if (!searchTerm) return targets;
    
    const search = searchTerm.toLowerCase();
    return targets.filter((target) =>
      target.store_name.toLowerCase().includes(search) ||
      target.store_code.toLowerCase().includes(search) ||
      (target.city && target.city.toLowerCase().includes(search)) ||
      (target.state && target.state.toLowerCase().includes(search))
    );
  }, [targets, searchTerm]);

  useEffect(() => {
    fetchTargets();
  }, [fetchTargets]);

  const handleSaveTarget = async (
    storeId: number,
    field: 'daily_revenue_target' | 'daily_labor_target_hours',
    value: number
  ) => {
    setIsSaving(storeId);
    try {
      const currentTarget = targets.find((t) => t.store_id === storeId);
      await targetsApi.setTarget({
        store_id: storeId,
        daily_revenue_target: field === 'daily_revenue_target' ? value : (currentTarget?.daily_revenue_target || 0),
        daily_labor_target_hours: field === 'daily_labor_target_hours' ? value : (currentTarget?.daily_labor_target_hours || 0),
      });
      
      // Update local state
      setTargets((prev) =>
        prev.map((t) =>
          t.store_id === storeId
            ? { ...t, [field]: value, has_target: true }
            : t
        )
      );
    } catch (error) {
      console.error('Error saving target:', error);
    } finally {
      setIsSaving(null);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-surface-900 dark:text-surface-100">
            Set Goals
          </h1>
          <p className="text-surface-500 dark:text-surface-400 mt-1">
            Set daily revenue and labor targets by location.
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="w-full">
        <Input
          placeholder="Search by store name, code, or city..."
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

      {/* Targets Card */}
      <Card>
        <div className="p-4 border-b border-surface-200 dark:border-surface-700">
          <h2 className="font-semibold text-surface-900 dark:text-surface-100">
            Location Targets
          </h2>
          <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">
            Click Edit to change values.
          </p>
        </div>

        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ezra-500 mx-auto" />
            <p className="mt-4 text-surface-500">Loading targets...</p>
          </div>
        ) : filteredTargets.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-surface-500">No stores found matching "{searchTerm}"</p>
            <button 
              onClick={() => setSearchTerm('')}
              className="mt-2 text-ezra-500 hover:text-ezra-400"
            >
              Clear search
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-surface-200 dark:border-surface-700">
                  <th className="text-left px-4 py-3 text-sm font-medium text-surface-500 dark:text-surface-400">
                    LOCATION
                  </th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-surface-500 dark:text-surface-400">
                    DAILY REVENUE TARGET
                  </th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-surface-500 dark:text-surface-400">
                    LABOR TARGET
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredTargets.map((target) => (
                  <tr
                    key={target.store_id}
                    className={cn(
                      'border-b border-surface-100 dark:border-surface-800 hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-colors',
                      isSaving === target.store_id && 'opacity-50'
                    )}
                  >
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-surface-900 dark:text-surface-100">
                          {target.store_name}
                        </p>
                        <p className="text-sm text-surface-500">
                          {[target.city, target.state, target.store_code]
                            .filter(Boolean)
                            .join(', ')}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <EditableCell
                        value={target.daily_revenue_target}
                        onSave={(value) => handleSaveTarget(target.store_id, 'daily_revenue_target', value)}
                        format="currency"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <EditableCell
                        value={target.daily_labor_target_hours}
                        onSave={(value) => handleSaveTarget(target.store_id, 'daily_labor_target_hours', value)}
                        format="hours"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
