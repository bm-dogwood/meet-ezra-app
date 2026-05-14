'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, AlertTriangle, MapPin, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { lpApi } from '@/lib/api';
import { Card } from '@/components/ui/Card';
import Button from '@/components/ui/Button';

interface AlertLocation {
  id: number;
  store_id: number;
  store_name: string;
  store_code: string;
  risk_level: 'medium' | 'high';
  calculated_value: number;
  threshold_min: number | null;
  threshold_max: number | null;
  report_date: string;
  detected_at: string;
  status: string;
}

interface AlertDetail {
  alert_type: string;
  title: string;
  thresholds: Record<string, number>;
  locations: AlertLocation[];
  total: number;
}

export default function AlertDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const alertType = params.type as string;
  const dateParam = searchParams.get('date');
  
  const [data, setData] = useState<AlertDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Build back URL with date parameter preserved
  const backUrl = dateParam ? `/app/lp?date=${dateParam}` : '/app/lp';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await lpApi.getAlertDetail(alertType);
        setData(result as AlertDetail);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load alert details');
      } finally {
        setIsLoading(false);
      }
    };
    
    if (alertType) {
      fetchData();
    }
  }, [alertType]);

  const getAlertIcon = () => {
    switch (alertType) {
      case 'cash_ratio':
        return <TrendingUp className="w-6 h-6 text-warning-500" />;
      case 'tip_percent':
        return <TrendingUp className="w-6 h-6 text-warning-500" />;
      case 'low_ticket':
        return <AlertTriangle className="w-6 h-6 text-warning-500" />;
      default:
        return <AlertTriangle className="w-6 h-6 text-warning-500" />;
    }
  };

  const getValueLabel = () => {
    switch (alertType) {
      case 'cash_ratio':
        return 'Cash %';
      case 'tip_percent':
        return 'Tip %';
      case 'low_ticket':
        return 'Low-Ticket %';
      default:
        return 'Value';
    }
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
        <Link href={backUrl}>
          <Button variant="ghost" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />}>
            Back to LP
          </Button>
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-warning-500/10 flex items-center justify-center">
          {getAlertIcon()}
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-surface-900 dark:text-surface-100">
            {data?.title || 'Alert Details'}
          </h1>
          <p className="text-surface-500 dark:text-surface-400">
            {data?.total || 0} locations with this alert
          </p>
        </div>
      </div>

      {/* Threshold Info */}
      {data?.thresholds && (
        <Card className="bg-surface-50 dark:bg-surface-800/50">
          <h3 className="text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
            Threshold Configuration
          </h3>
          <div className="flex flex-wrap gap-4">
            {Object.entries(data.thresholds).map(([key, value]) => (
              <div key={key} className="flex items-center gap-2">
                <span className="text-sm text-surface-500">{key.replace(/_/g, ' ')}:</span>
                <span className="text-sm font-medium text-surface-900 dark:text-surface-100">
                  {typeof value === 'number' ? `${value}%` : value}
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Locations List */}
      <Card>
        <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-100 mb-4">
          Affected Locations
        </h3>
        
        {data?.locations && data.locations.length === 0 ? (
          <div className="text-center py-8 text-surface-500">
            No locations with this alert type
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-surface-200 dark:border-surface-700">
                  <th className="text-left py-3 px-4 text-sm font-medium text-surface-500">Location</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-surface-500">Store Code</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-surface-500">{getValueLabel()}</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-surface-500">Risk Level</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-surface-500">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-surface-500">Detected</th>
                </tr>
              </thead>
              <tbody>
                {data?.locations.map((location) => (
                  <tr 
                    key={location.id}
                    className="border-b border-surface-100 dark:border-surface-800 hover:bg-surface-50 dark:hover:bg-surface-800/50"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-surface-400" />
                        <span className="font-medium text-surface-900 dark:text-surface-100">
                          {location.store_name}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-surface-600 dark:text-surface-400">
                      {location.store_code || '-'}
                    </td>
                    <td className="py-3 px-4">
                      <span className={cn(
                        'font-semibold',
                        location.risk_level === 'high' ? 'text-danger-500' : 'text-warning-500'
                      )}>
                        {location.calculated_value.toFixed(1)}%
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={cn(
                        'px-2 py-1 rounded-full text-xs font-medium capitalize',
                        location.risk_level === 'high' 
                          ? 'bg-danger-500/10 text-danger-500' 
                          : 'bg-warning-500/10 text-warning-500'
                      )}>
                        {location.risk_level}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={cn(
                        'px-2 py-1 rounded-full text-xs font-medium capitalize',
                        location.status === 'new' && 'bg-danger-500/10 text-danger-500',
                        location.status === 'investigating' && 'bg-warning-500/10 text-warning-500',
                        location.status === 'resolved' && 'bg-success-500/10 text-success-500'
                      )}>
                        {location.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-surface-500 text-sm">
                      {new Date(location.detected_at).toLocaleDateString()}
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
