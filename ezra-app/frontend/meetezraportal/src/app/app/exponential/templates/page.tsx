'use client';

import React, { useState, useEffect } from 'react';
import {
  MessageSquare, Plus, Pencil, Trash2, X, Check,
  AlertTriangle, Shield, Clock, ArrowLeft,
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { smsTemplatesApi } from '@/lib/api';

interface SMSTemplate {
  id: number;
  template_id: string;
  name: string;
  bucket: string;
  body: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const BUCKET_OPTIONS = [
  { value: '4wk', label: '4-Week (Low Churn Risk)', color: 'bg-success-500/10 text-success-500' },
  { value: '6wk', label: '6-Week (Medium Churn Risk)', color: 'bg-warning-500/10 text-warning-500' },
  { value: '8wk', label: '8-Week (High Churn Risk)', color: 'bg-danger-500/10 text-danger-500' },
];

const PLACEHOLDERS = ['{guest_name}', '{store_name}', '{coupon_value}'];

// Dummy data for dev/demo
const DUMMY_TEMPLATES: SMSTemplate[] = [
  {
    id: 1, template_id: '4wk_default', name: '4-Week Re-engagement', bucket: '4wk',
    body: 'Hi {guest_name}! We miss you at {store_name}. Come back and enjoy ${coupon_value} off your next visit! Reply STOP to opt out.',
    is_active: true, created_at: '2026-01-15T10:00:00Z', updated_at: '2026-01-15T10:00:00Z',
  },
  {
    id: 2, template_id: '6wk_default', name: '6-Week Re-engagement', bucket: '6wk',
    body: "Hey {guest_name}, it's been a while! Here's ${coupon_value} off to welcome you back to {store_name}. Reply STOP to opt out.",
    is_active: true, created_at: '2026-01-15T10:00:00Z', updated_at: '2026-01-15T10:00:00Z',
  },
  {
    id: 3, template_id: '8wk_default', name: '8-Week Re-engagement', bucket: '8wk',
    body: '{guest_name}, your stylist misses you! Book now and save ${coupon_value} at {store_name} this week only! Reply STOP to opt out.',
    is_active: true, created_at: '2026-01-15T10:00:00Z', updated_at: '2026-01-15T10:00:00Z',
  },
  {
    id: 4, template_id: '4wk_promo', name: '4-Week Promo Special', bucket: '4wk',
    body: '{guest_name}, we have a special offer just for you! Visit {store_name} and save ${coupon_value}. Limited time! Reply STOP to opt out.',
    is_active: false, created_at: '2026-02-01T10:00:00Z', updated_at: '2026-02-01T10:00:00Z',
  },
];

const EMPTY_FORM = { template_id: '', name: '', bucket: '4wk', body: '', is_active: true };

export default function SMSTemplatesPage() {
  const [templates, setTemplates] = useState<SMSTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<SMSTemplate | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [filterBucket, setFilterBucket] = useState<string>('all');

  const fetchTemplates = async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (filterBucket !== 'all') params.bucket = filterBucket;
      const res = await smsTemplatesApi.list(params) as { templates: SMSTemplate[] };
      setTemplates(res.templates || []);
    } catch {
      // Fallback to dummy templates in dev/demo mode
      setTemplates(DUMMY_TEMPLATES);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, [filterBucket]);

  const openCreate = () => {
    setEditingTemplate(null);
    setForm(EMPTY_FORM);
    setError('');
    setShowModal(true);
  };

  const openEdit = (t: SMSTemplate) => {
    setEditingTemplate(t);
    setForm({ template_id: t.template_id, name: t.name, bucket: t.bucket, body: t.body, is_active: t.is_active });
    setError('');
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.template_id.trim() || !form.name.trim() || !form.body.trim()) {
      setError('All fields are required');
      return;
    }
    if (!PLACEHOLDERS.some(p => form.body.includes(p))) {
      setError('Body must contain at least one placeholder: {guest_name}, {store_name}, or {coupon_value}');
      return;
    }
    setSaving(true);
    setError('');
    try {
      if (editingTemplate) {
        await smsTemplatesApi.update(editingTemplate.id, form);
      } else {
        await smsTemplatesApi.create(form);
      }
      setShowModal(false);
      fetchTemplates();
    } catch (e: any) {
      setError(e.message || 'Failed to save template');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await smsTemplatesApi.delete(id);
      setDeleteConfirm(null);
      fetchTemplates();
    } catch {
      // Fallback: remove from local state
      setTemplates(prev => prev.filter(t => t.id !== id));
      setDeleteConfirm(null);
    }
  };

  const bucketIcon = (bucket: string) => {
    if (bucket === '4wk') return <Shield className="w-4 h-4 text-success-500" />;
    if (bucket === '6wk') return <Clock className="w-4 h-4 text-warning-500" />;
    return <AlertTriangle className="w-4 h-4 text-danger-500" />;
  };

  const bucketColor = (bucket: string) => {
    return BUCKET_OPTIONS.find(b => b.value === bucket)?.color || '';
  };

  const filtered = filterBucket === 'all' ? templates : templates.filter(t => t.bucket === filterBucket);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/app/exponential" className="p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors">
            <ArrowLeft className="w-5 h-5 text-surface-500" />
          </Link>
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
            <MessageSquare className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-surface-900 dark:text-surface-100">SMS Templates</h1>
            <p className="text-surface-500 dark:text-surface-400">Manage message templates for Exponential campaigns</p>
          </div>
        </div>
        <Button size="sm" leftIcon={<Plus className="w-4 h-4" />} onClick={openCreate}>
          New Template
        </Button>
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        {[{ value: 'all', label: 'All Buckets' }, ...BUCKET_OPTIONS].map(opt => (
          <button
            key={opt.value}
            onClick={() => setFilterBucket(opt.value)}
            className={cn(
              'px-3 py-1.5 text-sm font-medium rounded-lg transition-colors',
              filterBucket === opt.value
                ? 'bg-ezra-500/10 text-ezra-500 border border-ezra-500/30'
                : 'text-surface-500 hover:text-surface-700 dark:hover:text-surface-300 border border-transparent'
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Template Cards */}
      {filtered.length === 0 ? (
        <Card className="text-center py-12">
          <MessageSquare className="w-12 h-12 text-surface-300 mx-auto mb-3" />
          <p className="text-surface-500">No templates found. Create your first template to get started.</p>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filtered.map(t => (
            <Card key={t.id} className="relative">
              {deleteConfirm === t.id && (
                <div className="absolute inset-0 bg-surface-900/80 backdrop-blur-sm rounded-xl flex items-center justify-center z-10">
                  <div className="text-center">
                    <p className="text-white font-medium mb-3">Delete "{t.name}"?</p>
                    <div className="flex gap-2 justify-center">
                      <Button size="sm" variant="danger" onClick={() => handleDelete(t.id)}>Delete</Button>
                      <Button size="sm" variant="secondary" onClick={() => setDeleteConfirm(null)}>Cancel</Button>
                    </div>
                  </div>
                </div>
              )}
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="mt-0.5">{bucketIcon(t.bucket)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-semibold text-surface-900 dark:text-surface-100 truncate">{t.name}</h3>
                      <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', bucketColor(t.bucket))}>
                        {t.bucket.toUpperCase()}
                      </span>
                      <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium',
                        t.is_active ? 'bg-success-500/10 text-success-500' : 'bg-surface-500/10 text-surface-500'
                      )}>
                        {t.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <p className="text-xs text-surface-400 mb-2">ID: {t.template_id}</p>
                    <div className="p-3 rounded-lg bg-surface-50 dark:bg-surface-900 border border-surface-200 dark:border-surface-700">
                      <p className="text-sm text-surface-600 dark:text-surface-400 italic">"{t.body}"</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1 ml-4">
                  <button onClick={() => openEdit(t)} className="p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors" aria-label="Edit template">
                    <Pencil className="w-4 h-4 text-surface-400 hover:text-ezra-500" />
                  </button>
                  <button onClick={() => setDeleteConfirm(t.id)} className="p-2 rounded-lg hover:bg-danger-500/10 transition-colors" aria-label="Delete template">
                    <Trash2 className="w-4 h-4 text-surface-400 hover:text-danger-500" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" role="dialog" aria-modal="true">
          <div className="bg-white dark:bg-surface-850 rounded-xl border border-surface-200 dark:border-surface-700 w-full max-w-lg shadow-xl">
            <div className="flex items-center justify-between p-6 border-b border-surface-200 dark:border-surface-700">
              <h2 className="text-lg font-semibold text-surface-900 dark:text-surface-100">
                {editingTemplate ? 'Edit Template' : 'New Template'}
              </h2>
              <button onClick={() => setShowModal(false)} className="p-1 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800" aria-label="Close">
                <X className="w-5 h-5 text-surface-400" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {error && (
                <div className="p-3 rounded-lg bg-danger-500/10 border border-danger-500/20 text-danger-500 text-sm">{error}</div>
              )}
              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Template ID</label>
                <input
                  type="text" value={form.template_id} placeholder="e.g. 4wk_holiday_promo"
                  onChange={e => setForm(f => ({ ...f, template_id: e.target.value }))}
                  disabled={!!editingTemplate}
                  className="w-full px-3 py-2 rounded-lg border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-900 text-surface-900 dark:text-surface-100 text-sm focus:ring-2 focus:ring-ezra-500 focus:border-transparent disabled:opacity-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Name</label>
                <input
                  type="text" value={form.name} placeholder="e.g. Holiday Re-engagement"
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-900 text-surface-900 dark:text-surface-100 text-sm focus:ring-2 focus:ring-ezra-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Bucket</label>
                <select
                  value={form.bucket} onChange={e => setForm(f => ({ ...f, bucket: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-900 text-surface-900 dark:text-surface-100 text-sm focus:ring-2 focus:ring-ezra-500 focus:border-transparent"
                >
                  {BUCKET_OPTIONS.map(b => <option key={b.value} value={b.value}>{b.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Message Body</label>
                <textarea
                  value={form.body} rows={4} placeholder="Hi {guest_name}! Visit {store_name} and save ${coupon_value}..."
                  onChange={e => setForm(f => ({ ...f, body: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-900 text-surface-900 dark:text-surface-100 text-sm focus:ring-2 focus:ring-ezra-500 focus:border-transparent resize-none"
                />
                <div className="flex gap-2 mt-1.5">
                  {PLACEHOLDERS.map(p => (
                    <button key={p} type="button" onClick={() => setForm(f => ({ ...f, body: f.body + p }))}
                      className="px-2 py-0.5 text-xs rounded bg-surface-100 dark:bg-surface-800 text-surface-500 hover:text-ezra-500 transition-colors">
                      {p}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox" id="is_active" checked={form.is_active}
                  onChange={e => setForm(f => ({ ...f, is_active: e.target.checked }))}
                  className="rounded border-surface-300 text-ezra-500 focus:ring-ezra-500"
                />
                <label htmlFor="is_active" className="text-sm text-surface-700 dark:text-surface-300">Active</label>
              </div>
            </div>
            <div className="flex justify-end gap-3 p-6 border-t border-surface-200 dark:border-surface-700">
              <Button variant="secondary" size="sm" onClick={() => setShowModal(false)}>Cancel</Button>
              <Button size="sm" isLoading={saving} onClick={handleSave} leftIcon={<Check className="w-4 h-4" />}>
                {editingTemplate ? 'Update' : 'Create'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
