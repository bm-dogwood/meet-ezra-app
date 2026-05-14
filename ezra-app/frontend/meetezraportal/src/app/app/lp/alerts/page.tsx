'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, AlertTriangle, MapPin, Clock, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';
import { lpApi } from '@/lib/api';
import { Card } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { formatRelativeTime } from '@/lib/formatters';

interface Alert {
  id: number;
  type: 'high' | 'medium' | 'low';
  alert_type: string;
  title: string;
  location: string;
  store_code: string;
  description: string;
  detected_at: string;
  status: string;
}

const ALERTS_PER_PAGE = 25;

export default function AllAlertsPage() {
  const searchParams = useSearchParams();
  const dateParam = searchParams.get('date');
  
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);

  const backUrl = dateParam ? `/app/lp?date=${dateParam}` : '/app/lp';

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const data = await lpApi.getAlerts({
          start_date: dateParam || undefined,
          end_date: dateParam || undefined,
          limit: 100,
        });
        setAlerts((data as any).alerts || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load alerts');
      } finally {
        setIsLoading(false);
      }
    };
    fetchAlerts();
  }, [dateParam]);

  const filteredAlerts = alerts.filter((a) => a.type === 'high' || a.type === 'medium');
  const totalPages = Math.ceil(filteredAlerts.length / ALERTS_PER_PAGE);
  const displayAlerts = filteredAlerts.slice(
    page * ALERTS_PER_PAGE,
    (page + 1) * ALERTS_PER_PAGE
  );

  const getAlertBadge = (type: 'high' | 'medium' | 'low') => {
    switch (type) {
      case 'high':
        return 'bg-danger-500/10 text-danger-500 border-danger-500/20';
      case 'medium':
        return 'bg-warning-500/10 text-warning-500 border-warning-500/20';
      case 'low':
        return 'bg-surface-500/10 text-surface-500 border-surface-500/20';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-danger-500/10 text-danger-500';
      case 'investigating':
        return 'bg-warning-500/10 text-warning-500';
      case 'resolved':
        return 'bg-success-500/10 text-success-500';
      default:
        return 'bg-surface-500/10 text-surface-500';
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
          <AlertTriangle className="w-6 h-6 text-warning-500" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-surface-900 dark:text-surface-100">
            All Alerts
          </h1>
          <p className="text-surface-500 dark:text-surface-400">
            {filteredAlerts.length} total alerts {dateParam && `for ${dateParam}`}
          </p>
        </div>
      </div>

      {/* Alerts List */}
      <Card>
        <div className="space-y-4">
          {displayAlerts.length === 0 ? (
            <div className="text-center py-8 text-surface-500">
              No alerts found
            </div>
          ) : (
            displayAlerts.map((alert) => (
              <div
                key={alert.id}
                className={cn(
                  'p-4 rounded-lg border transition-all',
                  getAlertBadge(alert.type)
                )}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-surface-900 dark:text-surface-100">
                        {alert.title}
                      </h4>
                      <span
                        className={cn(
                          'px-2 py-0.5 rounded-full text-xs font-medium capitalize',
                          getStatusBadge(alert.status)
                        )}
                      >
                        {alert.status}
                      </span>
                    </div>
                    <p className="text-sm text-surface-500">{alert.description}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-surface-400">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {alert.location} ({alert.store_code})
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {formatRelativeTime(new Date(alert.detected_at))}
                      </span>
                    </div>
                  </div>
                  <Link href={`/app/lp/alerts/${alert.alert_type}?date=${dateParam || ''}`}>
                    <Button variant="ghost" size="sm" leftIcon={<Eye className="w-4 h-4" />}>
                      Review
                    </Button>
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 pt-4 mt-4 border-t border-surface-200 dark:border-surface-700">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setPage(Math.max(0, page - 1))}
              disabled={page === 0}
            >
              Previous
            </Button>
            <span className="text-sm text-surface-500">
              Page {page + 1} of {totalPages}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
              disabled={page >= totalPages - 1}
            >
              Next
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
