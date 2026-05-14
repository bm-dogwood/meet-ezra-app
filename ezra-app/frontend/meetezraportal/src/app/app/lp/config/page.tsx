'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Shield, Info, Save, Loader2, Edit2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { lpApi } from '@/lib/api';
import { Card } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';

interface LPConfig {
  thresholds: {
    cash_ratio: {
      yellow_min: number;
      red_min: number;
      description: string;
    };
    tip_percent: {
      green_min: number;
      green_max: number;
      yellow_low: number;
      yellow_high: number;
      description: string;
    };
    low_ticket: {
      yellow_min: number;
      red_min: number;
      description: string;
    };
  };
  low_ticket_services: string[];
}

export default function LPConfigPage() {
  const { user } = useAuth();
  const [config, setConfig] = useState<LPConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // Only franchisor_admin (Franchise Admin) can edit config
  const canEdit = (user?.role as unknown as string) === 'franchisor_admin';
  
  // Editable values
  const [editValues, setEditValues] = useState<{
    cash_ratio: { yellow_min: number; red_min: number };
    tip_percent: { green_min: number; green_max: number; yellow_low: number; yellow_high: number };
    low_ticket: { yellow_min: number; red_min: number };
  } | null>(null);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const data = await lpApi.getConfig();
        setConfig(data as LPConfig);
        // Initialize edit values
        setEditValues({
          cash_ratio: {
            yellow_min: data.thresholds.cash_ratio.yellow_min,
            red_min: data.thresholds.cash_ratio.red_min,
          },
          tip_percent: {
            green_min: data.thresholds.tip_percent.green_min,
            green_max: data.thresholds.tip_percent.green_max,
            yellow_low: data.thresholds.tip_percent.yellow_low,
            yellow_high: data.thresholds.tip_percent.yellow_high,
          },
          low_ticket: {
            yellow_min: data.thresholds.low_ticket.yellow_min,
            red_min: data.thresholds.low_ticket.red_min,
          },
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load configuration');
      } finally {
        setIsLoading(false);
      }
    };
    fetchConfig();
  }, []);
  
  const handleSave = async () => {
    if (!editValues) return;
    
    setIsSaving(true);
    setError(null);
    setSuccessMessage(null);
    
    try {
      await lpApi.updateConfig({ 
        thresholds: {
          cash_ratio: editValues.cash_ratio,
          tip_percent: editValues.tip_percent,
          low_ticket: editValues.low_ticket,
        },
      });
      setSuccessMessage('Configuration saved successfully!');
      setIsEditing(false);
      // Refresh config
      const data = await lpApi.getConfig();
      setConfig(data as LPConfig);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save configuration');
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleCancel = () => {
    if (config) {
      setEditValues({
        cash_ratio: {
          yellow_min: config.thresholds.cash_ratio.yellow_min,
          red_min: config.thresholds.cash_ratio.red_min,
        },
        tip_percent: {
          green_min: config.thresholds.tip_percent.green_min,
          green_max: config.thresholds.tip_percent.green_max,
          yellow_low: config.thresholds.tip_percent.yellow_low,
          yellow_high: config.thresholds.tip_percent.yellow_high,
        },
        low_ticket: {
          yellow_min: config.thresholds.low_ticket.yellow_min,
          red_min: config.thresholds.low_ticket.red_min,
        },
      });
    }
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-danger-500">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/app/lp">
          <Button variant="ghost" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />}>
            Back to LP
          </Button>
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
          <Shield className="w-6 h-6 text-purple-400" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-surface-900 dark:text-surface-100">
            LP Alert Configuration
          </h1>
          <p className="text-surface-500 dark:text-surface-400">
            View risk thresholds and scoring parameters
          </p>
        </div>
      </div>

      {/* Info Banner */}
      {!isEditing && (
        <Card className="bg-blue-500/5 border-blue-500/20">
          <div className="flex items-center justify-between">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-surface-600 dark:text-surface-400">
                {canEdit 
                  ? 'Click "Edit Configuration" to modify the risk thresholds for your organization.'
                  : 'View the risk thresholds and scoring parameters for loss prevention monitoring.'}
              </p>
            </div>
            {canEdit && (
              <Button
                variant="secondary"
                size="sm"
                leftIcon={<Edit2 className="w-4 h-4" />}
                onClick={() => setIsEditing(true)}
              >
                Edit Configuration
              </Button>
            )}
          </div>
        </Card>
      )}
      
      {/* Success Message */}
      {successMessage && (
        <Card className="bg-success-500/10 border-success-500/20">
          <p className="text-sm text-success-600">{successMessage}</p>
        </Card>
      )}
      
      {/* Edit Mode Actions */}
      {isEditing && (
        <Card className="bg-warning-500/5 border-warning-500/20">
          <div className="flex items-center justify-between">
            <p className="text-sm text-warning-600">
              You are in edit mode. Make your changes and click Save.
            </p>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={handleCancel}>
                Cancel
              </Button>
              <Button
                size="sm"
                leftIcon={isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </Card>
      )}

      {config && editValues && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Cash to Credit Ratio */}
          <Card>
            <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-100 mb-4">
              Cash to Credit Ratio
            </h3>
            <p className="text-sm text-surface-500 mb-4">
              {config.thresholds.cash_ratio.description}
            </p>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-success-500/10">
                <span className="text-surface-700 dark:text-surface-300">Low Risk (Green)</span>
                {isEditing ? (
                  <span className="text-success-600">≤ <input
                    type="number"
                    value={editValues.cash_ratio.yellow_min}
                    onChange={(e) => setEditValues({
                      ...editValues,
                      cash_ratio: { ...editValues.cash_ratio, yellow_min: parseFloat(e.target.value) || 0 }
                    })}
                    className="w-16 px-2 py-1 text-sm rounded border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-800"
                  />%</span>
                ) : (
                  <span className="font-medium text-success-600">≤ {config.thresholds.cash_ratio.yellow_min}%</span>
                )}
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-warning-500/10">
                <span className="text-surface-700 dark:text-surface-300">Medium Risk (Yellow)</span>
                {isEditing ? (
                  <span className="text-warning-600">
                    {editValues.cash_ratio.yellow_min}% - <input
                      type="number"
                      value={editValues.cash_ratio.red_min}
                      onChange={(e) => setEditValues({
                        ...editValues,
                        cash_ratio: { ...editValues.cash_ratio, red_min: parseFloat(e.target.value) || 0 }
                      })}
                      className="w-16 px-2 py-1 text-sm rounded border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-800"
                    />%
                  </span>
                ) : (
                  <span className="font-medium text-warning-600">
                    {config.thresholds.cash_ratio.yellow_min}% - {config.thresholds.cash_ratio.red_min}%
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-danger-500/10">
                <span className="text-surface-700 dark:text-surface-300">High Risk (Red)</span>
                <span className="font-medium text-danger-600">&gt; {isEditing ? editValues.cash_ratio.red_min : config.thresholds.cash_ratio.red_min}%</span>
              </div>
            </div>
          </Card>

          {/* Tip Percentage */}
          <Card>
            <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-100 mb-4">
              Tip Percentage
            </h3>
            <p className="text-sm text-surface-500 mb-4">
              {config.thresholds.tip_percent.description}
            </p>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-success-500/10">
                <span className="text-surface-700 dark:text-surface-300">Low Risk (Green)</span>
                {isEditing ? (
                  <span className="text-success-600 flex items-center gap-1">
                    <input
                      type="number"
                      value={editValues.tip_percent.green_min}
                      onChange={(e) => setEditValues({
                        ...editValues,
                        tip_percent: { ...editValues.tip_percent, green_min: parseFloat(e.target.value) || 0 }
                      })}
                      className="w-14 px-2 py-1 text-sm rounded border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-800"
                    />% - <input
                      type="number"
                      value={editValues.tip_percent.green_max}
                      onChange={(e) => setEditValues({
                        ...editValues,
                        tip_percent: { ...editValues.tip_percent, green_max: parseFloat(e.target.value) || 0 }
                      })}
                      className="w-14 px-2 py-1 text-sm rounded border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-800"
                    />%
                  </span>
                ) : (
                  <span className="font-medium text-success-600">
                    {config.thresholds.tip_percent.green_min}% - {config.thresholds.tip_percent.green_max}%
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-warning-500/10">
                <span className="text-surface-700 dark:text-surface-300">Medium Risk (Yellow)</span>
                {isEditing ? (
                  <span className="text-warning-600 flex items-center gap-1 text-xs">
                    <input
                      type="number"
                      value={editValues.tip_percent.yellow_low}
                      onChange={(e) => setEditValues({
                        ...editValues,
                        tip_percent: { ...editValues.tip_percent, yellow_low: parseFloat(e.target.value) || 0 }
                      })}
                      className="w-12 px-1 py-1 text-sm rounded border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-800"
                    />-{editValues.tip_percent.green_min}% or {editValues.tip_percent.green_max}-<input
                      type="number"
                      value={editValues.tip_percent.yellow_high}
                      onChange={(e) => setEditValues({
                        ...editValues,
                        tip_percent: { ...editValues.tip_percent, yellow_high: parseFloat(e.target.value) || 0 }
                      })}
                      className="w-12 px-1 py-1 text-sm rounded border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-800"
                    />%
                  </span>
                ) : (
                  <span className="font-medium text-warning-600">
                    {config.thresholds.tip_percent.yellow_low}%-{config.thresholds.tip_percent.green_min}% or {config.thresholds.tip_percent.green_max}%-{config.thresholds.tip_percent.yellow_high}%
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-danger-500/10">
                <span className="text-surface-700 dark:text-surface-300">High Risk (Red)</span>
                <span className="font-medium text-danger-600">
                  &lt; {isEditing ? editValues.tip_percent.yellow_low : config.thresholds.tip_percent.yellow_low}% or &gt; {isEditing ? editValues.tip_percent.yellow_high : config.thresholds.tip_percent.yellow_high}%
                </span>
              </div>
            </div>
          </Card>

          {/* Low Ticket Services */}
          <Card>
            <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-100 mb-4">
              Low-Ticket-Value Services
            </h3>
            <p className="text-sm text-surface-500 mb-4">
              {config.thresholds.low_ticket.description}
            </p>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-success-500/10">
                <span className="text-surface-700 dark:text-surface-300">Low Risk (Green)</span>
                {isEditing ? (
                  <span className="text-success-600">≤ <input
                    type="number"
                    value={editValues.low_ticket.yellow_min}
                    onChange={(e) => setEditValues({
                      ...editValues,
                      low_ticket: { ...editValues.low_ticket, yellow_min: parseFloat(e.target.value) || 0 }
                    })}
                    className="w-16 px-2 py-1 text-sm rounded border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-800"
                  />%</span>
                ) : (
                  <span className="font-medium text-success-600">≤ {config.thresholds.low_ticket.yellow_min}%</span>
                )}
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-warning-500/10">
                <span className="text-surface-700 dark:text-surface-300">Medium Risk (Yellow)</span>
                {isEditing ? (
                  <span className="text-warning-600">
                    {editValues.low_ticket.yellow_min}% - <input
                      type="number"
                      value={editValues.low_ticket.red_min}
                      onChange={(e) => setEditValues({
                        ...editValues,
                        low_ticket: { ...editValues.low_ticket, red_min: parseFloat(e.target.value) || 0 }
                      })}
                      className="w-16 px-2 py-1 text-sm rounded border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-800"
                    />%
                  </span>
                ) : (
                  <span className="font-medium text-warning-600">
                    {config.thresholds.low_ticket.yellow_min}% - {config.thresholds.low_ticket.red_min}%
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-danger-500/10">
                <span className="text-surface-700 dark:text-surface-300">High Risk (Red)</span>
                <span className="font-medium text-danger-600">&gt; {isEditing ? editValues.low_ticket.red_min : config.thresholds.low_ticket.red_min}%</span>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Low Ticket Services List */}
      {config && config.low_ticket_services.length > 0 && (
        <Card>
          <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-100 mb-4">
            Low-Ticket Services
          </h3>
          <p className="text-sm text-surface-500 mb-4">
            Services classified as low-ticket for risk calculation
          </p>
          <div className="flex flex-wrap gap-2">
            {config.low_ticket_services.map((service) => (
              <span
                key={service}
                className="px-3 py-1 rounded-full bg-surface-100 dark:bg-surface-800 text-surface-700 dark:text-surface-300 text-sm"
              >
                {service}
              </span>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
