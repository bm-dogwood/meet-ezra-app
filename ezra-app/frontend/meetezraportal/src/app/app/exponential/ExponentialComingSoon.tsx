'use client';

// ===========================================
// EZRA PORTAL - Ezra Exponential (Under Update)
// Shown when ezra_exponential feature flag is inactive (active !== 1)
// ===========================================

import React from 'react';
import {
  Rocket,
  Wrench,
  Sparkles,
  ArrowUpCircle,
  Clock,
  Zap,
  MessageSquare,
  BarChart3,
  Users,
  TrendingUp,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';

export default function ExponentialComingSoon() {
  const updates = [
    {
      icon: MessageSquare,
      title: 'Smarter SMS Campaigns',
      description: 'Improved targeting, better delivery tracking, and richer analytics.',
    },
    {
      icon: BarChart3,
      title: 'Enhanced Segmentation',
      description: 'More granular customer buckets with AI-powered churn prediction.',
    },
    {
      icon: Users,
      title: 'Audience Insights',
      description: 'Deeper visibility into customer behavior and visit patterns.',
    },
    {
      icon: TrendingUp,
      title: 'ROI Dashboard',
      description: 'Track campaign performance and measure return on every dollar spent.',
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page header */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center">
          <Rocket className="w-6 h-6 text-orange-400" />
        </div>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold text-surface-900 dark:text-surface-100">
              Ezra Exponential
            </h1>
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-500 flex items-center gap-1.5">
              <Wrench className="w-3 h-3" />
              Updating
            </span>
          </div>
          <p className="text-surface-500 dark:text-surface-400">
            Customer retention &amp; follow-up platform
          </p>
        </div>
      </div>

      {/* Main Hero Card */}
      <Card className="bg-gradient-to-br from-orange-500/5 via-amber-500/5 to-surface-900/80 border-orange-500/20 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative text-center py-16 px-4">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-orange-500/20 to-amber-500/10 flex items-center justify-center">
            <ArrowUpCircle className="w-10 h-10 text-orange-400 animate-pulse" />
          </div>
          <h2 className="text-3xl font-bold text-surface-900 dark:text-surface-100 mb-3">
            Exciting Updates in Progress
          </h2>
          <p className="text-lg text-surface-500 dark:text-surface-400 max-w-lg mx-auto mb-6">
            We&apos;re upgrading Ezra Exponential with powerful new features to help you retain more customers and grow faster.
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-400 text-sm">
            <Clock className="w-4 h-4 text-amber-500" />
            We&apos;ll be back shortly — hang tight!
          </div>
        </div>
      </Card>

      {/* What's Coming */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-orange-400" />
          <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-100">
            What&apos;s Coming
          </h3>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {updates.map((item) => {
            const Icon = item.icon;
            return (
              <Card key={item.title} className="group hover:border-orange-500/30 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center mb-3 group-hover:bg-orange-500/20 transition-colors">
                  <Icon className="w-5 h-5 text-orange-400" />
                </div>
                <h4 className="font-semibold text-surface-900 dark:text-surface-100 mb-1.5">
                  {item.title}
                </h4>
                <p className="text-sm text-surface-500">{item.description}</p>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Bottom Banner */}
      <Card className="bg-surface-900 border-surface-800">
        <div className="flex items-center gap-5 py-2">
          <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center flex-shrink-0">
            <Zap className="w-6 h-6 text-orange-400" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-white mb-1">
              Your data is safe
            </h4>
            <p className="text-sm text-surface-400">
              All your customer data, campaigns, and segments are preserved. Everything will be right where you left it once the update is complete.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
