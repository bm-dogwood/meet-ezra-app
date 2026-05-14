'use client';

// ===========================================
// EZRA PORTAL - Settings Page
// ===========================================

import React, { useState } from 'react';
import {
  User,
  Bell,
  Lock,
  Palette,
  Globe,
  Building2,
  Mail,
  Shield,
  Check,
  Moon,
  Sun,
  Monitor,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';

type SettingsTab = 'profile' | 'notifications' | 'appearance' | 'security';

export default function SettingsPage() {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const [isSaving, setIsSaving] = useState(false);

  const tabs = [
    { id: 'profile' as const, label: 'Profile', icon: User },
    { id: 'notifications' as const, label: 'Notifications', icon: Bell },
    { id: 'appearance' as const, label: 'Appearance', icon: Palette },
    { id: 'security' as const, label: 'Security', icon: Lock },
  ];

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-semibold text-surface-900 dark:text-surface-100">
          Settings
        </h1>
        <p className="text-surface-500 dark:text-surface-400 mt-1">
          Manage your account preferences and configuration
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar tabs */}
        <div className="lg:w-64 flex-shrink-0">
          <Card padding="sm">
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg',
                      'transition-colors text-left',
                      activeTab === tab.id
                        ? 'bg-ezra-500/10 text-ezra-500'
                        : 'text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800'
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </Card>
        </div>

        {/* Settings content */}
        <div className="flex-1">
          {/* Profile Settings */}
          {activeTab === 'profile' && (
            <Card>
              <div className="flex items-center gap-4 mb-6">
                <User className="w-6 h-6 text-surface-500" />
                <div>
                  <h2 className="text-lg font-semibold text-surface-900 dark:text-surface-100">
                    Profile Settings
                  </h2>
                  <p className="text-sm text-surface-500">
                    Update your personal information
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-ezra-400 to-ezra-600 flex items-center justify-center">
                    <span className="text-white text-2xl font-semibold">
                      {user?.name?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <div>
                    <Button variant="secondary" size="sm">
                      Change Photo
                    </Button>
                    <p className="text-xs text-surface-500 mt-2">
                      JPG, PNG or GIF. Max 2MB.
                    </p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <Input
                    label="Full Name"
                    defaultValue={user?.name || 'Demo User'}
                  />
                  <Input
                    label="Email"
                    type="email"
                    defaultValue={user?.email || 'demo@ezra.ai'}
                    disabled
                    hint="Contact support to change email"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <Input
                    label="Job Title"
                    defaultValue="Operations Manager"
                  />
                  <Input
                    label="Phone"
                    type="tel"
                    defaultValue="+1 (555) 123-4567"
                  />
                </div>

                <div className="flex items-center gap-4 p-4 rounded-lg bg-surface-50 dark:bg-surface-800/50">
                  <Building2 className="w-5 h-5 text-surface-500" />
                  <div>
                    <p className="font-medium text-surface-900 dark:text-surface-100">
                      {user?.clientName || 'Glow Spa Franchise'}
                    </p>
                    <p className="text-sm text-surface-500">Your organization</p>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleSave} isLoading={isSaving}>
                    Save Changes
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* Notifications Settings */}
          {activeTab === 'notifications' && (
            <Card>
              <div className="flex items-center gap-4 mb-6">
                <Bell className="w-6 h-6 text-surface-500" />
                <div>
                  <h2 className="text-lg font-semibold text-surface-900 dark:text-surface-100">
                    Notification Preferences
                  </h2>
                  <p className="text-sm text-surface-500">
                    Control how you receive alerts and updates
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                {[
                  {
                    title: 'Sales Alerts',
                    description: 'Daily summaries and goal notifications',
                    email: true,
                    push: true,
                  },
                  {
                    title: 'LP Alerts',
                    description: 'High-risk activity and anomaly detection',
                    email: true,
                    push: true,
                  },
                  {
                    title: 'System Updates',
                    description: 'Platform updates and maintenance notices',
                    email: true,
                    push: false,
                  },
                  {
                    title: 'Weekly Reports',
                    description: 'Automated weekly performance summaries',
                    email: true,
                    push: false,
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-4 border-b border-surface-100 dark:border-surface-800 last:border-0"
                  >
                    <div>
                      <h3 className="font-medium text-surface-900 dark:text-surface-100">
                        {item.title}
                      </h3>
                      <p className="text-sm text-surface-500">{item.description}</p>
                    </div>
                    <div className="flex items-center gap-6">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          defaultChecked={item.email}
                          className="w-4 h-4 rounded border-surface-300 text-ezra-500 focus:ring-ezra-500"
                        />
                        <span className="text-sm text-surface-600 dark:text-surface-400">
                          <Mail className="w-4 h-4" />
                        </span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          defaultChecked={item.push}
                          className="w-4 h-4 rounded border-surface-300 text-ezra-500 focus:ring-ezra-500"
                        />
                        <span className="text-sm text-surface-600 dark:text-surface-400">
                          <Bell className="w-4 h-4" />
                        </span>
                      </label>
                    </div>
                  </div>
                ))}

                <div className="flex justify-end">
                  <Button onClick={handleSave} isLoading={isSaving}>
                    Save Preferences
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* Appearance Settings */}
          {activeTab === 'appearance' && (
            <Card>
              <div className="flex items-center gap-4 mb-6">
                <Palette className="w-6 h-6 text-surface-500" />
                <div>
                  <h2 className="text-lg font-semibold text-surface-900 dark:text-surface-100">
                    Appearance
                  </h2>
                  <p className="text-sm text-surface-500">
                    Customize how Ezra looks for you
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="font-medium text-surface-900 dark:text-surface-100 mb-4">
                    Theme
                  </h3>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { id: 'light', label: 'Light', icon: Sun },
                      { id: 'dark', label: 'Dark', icon: Moon },
                      { id: 'system', label: 'System', icon: Monitor },
                    ].map((option) => {
                      const Icon = option.icon;
                      return (
                        <button
                          key={option.id}
                          onClick={() => setTheme(option.id as 'light' | 'dark' | 'system')}
                          className={cn(
                            'flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all',
                            theme === option.id
                              ? 'border-ezra-500 bg-ezra-500/5'
                              : 'border-surface-200 dark:border-surface-700 hover:border-surface-300 dark:hover:border-surface-600'
                          )}
                        >
                          <Icon
                            className={cn(
                              'w-6 h-6',
                              theme === option.id
                                ? 'text-ezra-500'
                                : 'text-surface-500'
                            )}
                          />
                          <span
                            className={cn(
                              'font-medium',
                              theme === option.id
                                ? 'text-ezra-500'
                                : 'text-surface-700 dark:text-surface-300'
                            )}
                          >
                            {option.label}
                          </span>
                          {theme === option.id && (
                            <Check className="w-4 h-4 text-ezra-500" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-6 border-t border-surface-100 dark:border-surface-800">
                  <h3 className="font-medium text-surface-900 dark:text-surface-100 mb-4">
                    Display Options
                  </h3>
                  <div className="space-y-4">
                    <label className="flex items-center justify-between">
                      <span className="text-surface-700 dark:text-surface-300">
                        Compact view
                      </span>
                      <input
                        type="checkbox"
                        className="w-4 h-4 rounded border-surface-300 text-ezra-500 focus:ring-ezra-500"
                      />
                    </label>
                    <label className="flex items-center justify-between">
                      <span className="text-surface-700 dark:text-surface-300">
                        Show tooltips
                      </span>
                      <input
                        type="checkbox"
                        defaultChecked
                        className="w-4 h-4 rounded border-surface-300 text-ezra-500 focus:ring-ezra-500"
                      />
                    </label>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Security Settings */}
          {activeTab === 'security' && (
            <Card>
              <div className="flex items-center gap-4 mb-6">
                <Lock className="w-6 h-6 text-surface-500" />
                <div>
                  <h2 className="text-lg font-semibold text-surface-900 dark:text-surface-100">
                    Security
                  </h2>
                  <p className="text-sm text-surface-500">
                    Manage your security settings
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="p-4 rounded-lg bg-surface-50 dark:bg-surface-800/50">
                  <div className="flex items-center gap-3 mb-2">
                    <Shield className="w-5 h-5 text-success-500" />
                    <span className="font-medium text-surface-900 dark:text-surface-100">
                      Account Protected
                    </span>
                  </div>
                  <p className="text-sm text-surface-500">
                    Your account is secured with enterprise-grade authentication.
                  </p>
                </div>

                <div>
                  <h3 className="font-medium text-surface-900 dark:text-surface-100 mb-4">
                    Change Password
                  </h3>
                  <div className="space-y-4 max-w-md">
                    <Input
                      label="Current Password"
                      type="password"
                      placeholder="Enter current password"
                    />
                    <Input
                      label="New Password"
                      type="password"
                      placeholder="Enter new password"
                    />
                    <Input
                      label="Confirm Password"
                      type="password"
                      placeholder="Confirm new password"
                    />
                    <Button>Update Password</Button>
                  </div>
                </div>

                <div className="pt-6 border-t border-surface-100 dark:border-surface-800">
                  <h3 className="font-medium text-surface-900 dark:text-surface-100 mb-4">
                    Two-Factor Authentication
                  </h3>
                  <p className="text-sm text-surface-500 mb-4">
                    Add an extra layer of security to your account by enabling 2FA.
                  </p>
                  <Button variant="secondary">Enable 2FA</Button>
                </div>

                <div className="pt-6 border-t border-surface-100 dark:border-surface-800">
                  <h3 className="font-medium text-surface-900 dark:text-surface-100 mb-4">
                    Active Sessions
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-surface-50 dark:bg-surface-800/50">
                      <div className="flex items-center gap-3">
                        <Globe className="w-5 h-5 text-surface-500" />
                        <div>
                          <p className="font-medium text-surface-900 dark:text-surface-100">
                            Chrome on macOS
                          </p>
                          <p className="text-xs text-surface-500">
                            Current session • San Francisco, CA
                          </p>
                        </div>
                      </div>
                      <span className="text-xs text-success-500">Active</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
