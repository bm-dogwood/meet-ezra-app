'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowLeft, MapPin, Save, Download, Upload, Check, Search,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { exponentialApi } from '@/lib/api';
import { Card } from '@/components/ui/Card';
import Button from '@/components/ui/Button';

interface StoreRow {
  id: number;
  name: string;
  externalCode: string;
  displayName: string;
  address: string;
  bookingLink: string;
  city: string;
  state: string;
  dirty: boolean;
}

export default function StoreDataPage() {
  const [stores, setStores] = useState<StoreRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [search, setSearch] = useState('');
  const [uploadMsg, setUploadMsg] = useState('');

  useEffect(() => {
    exponentialApi.getStoreData()
      .then((res: any) => {
        setStores((res.stores || []).map((s: any) => ({ ...s, dirty: false })));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleUpdate = (id: number, field: 'displayName' | 'address' | 'bookingLink', value: string) => {
    setStores(prev => prev.map(s =>
      s.id === id ? { ...s, [field]: value, dirty: true } : s
    ));
    setSaved(false);
  };

  const handleSave = async () => {
    setSaving(true);
    const dirtyStores = stores.filter(s => s.dirty);
    try {
      await exponentialApi.uploadStoreData(
        dirtyStores.map(s => ({
          name: s.name,
          externalCode: s.externalCode,
          displayName: s.displayName,
          address: s.address,
          bookingLink: s.bookingLink,
        }))
      );
      setStores(prev => prev.map(s => ({ ...s, dirty: false })));
      setSaved(true);
    } catch {}
    setSaving(false);
  };

  const handleDownloadTemplate = () => {
    const headers = ['Store Name', 'Store Code', 'Display Name', 'Address', 'Booking Link'];
    const rows = stores.map(s => [s.name, s.externalCode, s.displayName, s.address, s.bookingLink]);
    const csv = [headers, ...rows].map(r => r.map(c => `"${(c || '').replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'store_data_template.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadMsg('Processing...');
    try {
      const text = await file.text();
      const lines = text.split('\n').filter(l => l.trim());
      if (lines.length < 2) { setUploadMsg('File is empty'); return; }

      const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim().toLowerCase());
      const nameIdx = headers.findIndex(h => h.includes('store name') || h === 'name');
      const codeIdx = headers.findIndex(h => h.includes('store code') || h.includes('external') || h === 'code');
      const displayIdx = headers.findIndex(h => h.includes('display'));
      const addrIdx = headers.findIndex(h => h.includes('address'));
      const bookingIdx = headers.findIndex(h => h.includes('booking'));

      if (displayIdx === -1 && addrIdx === -1 && bookingIdx === -1) {
        setUploadMsg('CSV must have "Display Name", "Address", or "Booking Link" column');
        return;
      }

      const updates: StoreRow[] = [];
      for (let i = 1; i < lines.length; i++) {
        const cols = lines[i].match(/(".*?"|[^,]+)/g)?.map(c => c.replace(/^"|"$/g, '').trim()) || [];
        const storeName = nameIdx >= 0 ? cols[nameIdx] : '';
        const storeCode = codeIdx >= 0 ? cols[codeIdx] : '';
        const displayName = displayIdx >= 0 ? cols[displayIdx] : '';
        const address = addrIdx >= 0 ? cols[addrIdx] : '';
        const bookingLink = bookingIdx >= 0 ? cols[bookingIdx] : '';

        const match = stores.find(s =>
          (storeCode && s.externalCode === storeCode) || (storeName && s.name === storeName)
        );
        if (match) {
          updates.push({ ...match, displayName: displayName || match.displayName, address: address || match.address, bookingLink: bookingLink || match.bookingLink, dirty: true });
        }
      }

      if (updates.length === 0) {
        setUploadMsg('No matching stores found in file');
        return;
      }

      setStores(prev => prev.map(s => {
        const upd = updates.find(u => u.id === s.id);
        return upd || s;
      }));
      setUploadMsg(`${updates.length} stores updated from file. Click Save to apply.`);
      setSaved(false);
    } catch {
      setUploadMsg('Error reading file');
    }
    e.target.value = '';
  };

  const filtered = stores.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.externalCode.toLowerCase().includes(search.toLowerCase())
  );

  const dirtyCount = stores.filter(s => s.dirty).length;

  return (
    <div className="space-y-6 animate-fade-in max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/app/exponential" className="p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors">
            <ArrowLeft className="w-5 h-5 text-surface-500" />
          </Link>
          <div>
            <h1 className="text-2xl font-semibold text-surface-900 dark:text-surface-100">Store Data</h1>
            <p className="text-surface-500">Manage display names and addresses for your locations</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" size="sm" leftIcon={<Download className="w-4 h-4" />} onClick={handleDownloadTemplate}>
            Download Template
          </Button>
          <label className="cursor-pointer">
            <Button variant="secondary" size="sm" leftIcon={<Upload className="w-4 h-4" />} onClick={() => document.getElementById('store-upload')?.click()}>
              Upload CSV
            </Button>
            <input id="store-upload" type="file" accept=".csv,.xlsx" className="hidden" onChange={handleFileUpload} />
          </label>
          <Button size="sm" leftIcon={saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            onClick={handleSave} disabled={saving || dirtyCount === 0}>
            {saving ? 'Saving...' : saved ? 'Saved' : `Save (${dirtyCount})`}
          </Button>
        </div>
      </div>

      {uploadMsg && (
        <div className="px-4 py-2 rounded-lg bg-ezra-500/10 text-ezra-500 text-sm">{uploadMsg}</div>
      )}

      <Card>
        <div className="p-4 border-b border-surface-100 dark:border-surface-800">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
            <input type="text" placeholder="Search stores..." value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-surface-900 dark:text-surface-100 placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-ezra-500" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-surface-50 dark:bg-surface-800/50 text-xs font-medium text-surface-500 uppercase tracking-wider">
                <th className="px-4 py-3 text-left">Store Name</th>
                <th className="px-4 py-3 text-left">Code</th>
                <th className="px-4 py-3 text-left">City</th>
                <th className="px-4 py-3 text-left">State</th>
                <th className="px-4 py-3 text-left">Display Name</th>
                <th className="px-4 py-3 text-left">Address</th>
                <th className="px-4 py-3 text-left">Booking Link</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} className="px-4 py-8 text-center text-surface-500">Loading...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={7} className="px-4 py-8 text-center text-surface-500">No stores found</td></tr>
              ) : filtered.map(store => (
                <tr key={store.id} className={cn('border-b border-surface-100 dark:border-surface-800', store.dirty && 'bg-ezra-500/5')}>
                  <td className="px-4 py-2 font-medium text-surface-900 dark:text-surface-100">{store.name}</td>
                  <td className="px-4 py-2 text-surface-500">{store.externalCode}</td>
                  <td className="px-4 py-2 text-surface-500">{store.city}</td>
                  <td className="px-4 py-2 text-surface-500">{store.state}</td>
                  <td className="px-4 py-2">
                    <input value={store.displayName} onChange={(e) => handleUpdate(store.id, 'displayName', e.target.value)}
                      placeholder="Enter display name"
                      className="w-full px-2 py-1 text-sm rounded border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-surface-900 dark:text-surface-100 placeholder-surface-400 focus:outline-none focus:ring-1 focus:ring-ezra-500" />
                  </td>
                  <td className="px-4 py-2">
                    <input value={store.address} onChange={(e) => handleUpdate(store.id, 'address', e.target.value)}
                      placeholder="Enter address"
                      className="w-full px-2 py-1 text-sm rounded border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-surface-900 dark:text-surface-100 placeholder-surface-400 focus:outline-none focus:ring-1 focus:ring-ezra-500" />
                  </td>
                  <td className="px-4 py-2">
                    <input value={store.bookingLink} onChange={(e) => handleUpdate(store.id, 'bookingLink', e.target.value)}
                      placeholder="Enter booking link"
                      className="w-full px-2 py-1 text-sm rounded border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-surface-900 dark:text-surface-100 placeholder-surface-400 focus:outline-none focus:ring-1 focus:ring-ezra-500" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
