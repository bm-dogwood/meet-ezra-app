'use client';

// ===========================================
// EZRA PORTAL - Ezra Sales Product Page
// ===========================================

import React from 'react';
import Link from 'next/link';
import {
  ShoppingCart,
  ArrowRight,
  Check,
  BarChart3,
  Globe,
  Zap,
  Shield,
  Clock,
  TrendingUp,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Button from '@/components/ui/Button';

// Reuse header/footer
const Header = () => (
  <header className="fixed top-0 left-0 right-0 z-50 bg-surface-950/80 backdrop-blur-xl border-b border-surface-800/50">
    <div className="max-w-7xl mx-auto px-6">
      <div className="flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-ezra-400 to-ezra-600 flex items-center justify-center shadow-glow">
            <span className="text-white font-bold text-lg">E</span>
          </div>
          <span className="text-xl font-semibold text-white tracking-tight">Ezra</span>
        </Link>
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/bots" className="text-surface-300 hover:text-white transition-colors">The Ezra Family</Link>
          <Link href="/solutions" className="text-surface-300 hover:text-white transition-colors">Solutions</Link>
          <Link href="/platform" className="text-surface-300 hover:text-white transition-colors">Platform</Link>
          <Link href="/about" className="text-surface-300 hover:text-white transition-colors">About</Link>
          <Link href="/contact" className="text-surface-300 hover:text-white transition-colors">Contact</Link>
        </nav>
        <div className="hidden md:flex items-center gap-4">
          <Link href="/login"><Button variant="ghost">Sign In</Button></Link>
          <Link href="/contact"><Button>Request Demo</Button></Link>
        </div>
      </div>
    </div>
  </header>
);

const Footer = () => (
  <footer className="py-12 bg-surface-950 border-t border-surface-800">
    <div className="max-w-7xl mx-auto px-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-ezra-400 to-ezra-600 flex items-center justify-center">
            <span className="text-white font-bold">E</span>
          </div>
          <span className="text-surface-400">© 2026 Ezra AI. All rights reserved.</span>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/privacy" className="text-surface-400 hover:text-surface-300 text-sm">Privacy Policy</Link>
          <Link href="/terms" className="text-surface-400 hover:text-surface-300 text-sm">Terms of Service</Link>
        </div>
      </div>
    </div>
  </footer>
);

export default function EzraSalesPage() {
  const metrics = [
    { label: 'Daily Revenue', value: 'Real-time' },
    { label: 'Locations Supported', value: '200+' },
    { label: 'POS Systems', value: '5+' },
    { label: 'Data Freshness', value: '< 15 min' },
  ];

  const features = [
    {
      icon: BarChart3,
      title: 'Unified Dashboards',
      description: 'See all your locations on one screen. Compare performance, identify trends, and drill down to individual stores.',
    },
    {
      icon: Globe,
      title: 'Universal POS Support',
      description: 'Zenoti, Stripe, Toast, Square—Ezra Sales works with any POS system through APIs or intelligent automation.',
    },
    {
      icon: TrendingUp,
      title: 'Goal Tracking',
      description: 'Set revenue goals per location and track real-time progress. Get alerted when stores fall behind.',
    },
    {
      icon: Clock,
      title: 'Near Real-Time Data',
      description: 'Data syncs automatically throughout the day. Most locations see data within 15 minutes of transactions.',
    },
    {
      icon: Shield,
      title: 'Enterprise Security',
      description: 'Role-based access control, audit logging, and brand isolation. Your data stays yours.',
    },
    {
      icon: Zap,
      title: 'AI Insights',
      description: 'Automated anomaly detection highlights issues before they become problems. Let AI do the monitoring.',
    },
  ];

  const posSystems = [
    { name: 'Zenoti', method: 'Secure Automation', status: 'Active' },
    { name: 'Stripe', method: 'Direct API', status: 'Active' },
    { name: 'Toast', method: 'API Integration', status: 'Coming Soon' },
    { name: 'Square', method: 'API Integration', status: 'Planned' },
    { name: 'Clover', method: 'API Integration', status: 'Planned' },
  ];

  return (
    <div className="min-h-screen bg-surface-950">
      <Header />

      <main className="pt-16">
        {/* Hero */}
        <section className="relative py-24 overflow-hidden">
          <div className="absolute inset-0 bg-grid opacity-30" />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-ezra-500/20 rounded-full blur-[128px]" />

          <div className="relative max-w-7xl mx-auto px-6">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-ezra-500/10 border border-ezra-500/20 mb-8">
                <ShoppingCart className="w-4 h-4 text-ezra-400" />
                <span className="text-sm text-ezra-400 font-medium">Sales Intelligence Bot</span>
              </div>

              <h1 className="text-display-lg text-white mb-6">
                Ezra Sales
              </h1>
              <p className="text-2xl text-surface-400 mb-8 leading-relaxed">
                Real-time sales intelligence across all your franchise locations.
                One dashboard, any POS system, complete visibility.
              </p>

              <div className="flex flex-wrap gap-4 mb-12">
                <Link href="/contact">
                  <Button size="lg" rightIcon={<ArrowRight className="w-5 h-5" />}>
                    Request a Demo
                  </Button>
                </Link>
                <Link href="/bots">
                  <Button variant="outline" size="lg">
                    View All Bots
                  </Button>
                </Link>
              </div>

              {/* Quick stats */}
              <div className="grid grid-cols-4 gap-6">
                {metrics.map((metric) => (
                  <div key={metric.label}>
                    <p className="text-2xl font-semibold text-white">{metric.value}</p>
                    <p className="text-sm text-surface-500">{metric.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* POS Systems */}
        <section className="py-24 bg-surface-900">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-display-sm text-white mb-4">Universal POS Integration</h2>
              <p className="text-lg text-surface-400 max-w-2xl mx-auto">
                Ezra Sales is POS-agnostic. We connect to your existing system—no migration required.
              </p>
            </div>

            <div className="grid md:grid-cols-5 gap-4">
              {posSystems.map((pos) => (
                <div
                  key={pos.name}
                  className={cn(
                    'p-6 rounded-xl text-center',
                    'border border-surface-800 bg-surface-850/50',
                    'hover:border-ezra-500/50 transition-all duration-300'
                  )}
                >
                  <div className="w-12 h-12 mx-auto mb-4 rounded-lg bg-surface-800 flex items-center justify-center">
                    <Globe className="w-6 h-6 text-ezra-400" />
                  </div>
                  <h3 className="font-semibold text-white mb-1">{pos.name}</h3>
                  <p className="text-xs text-surface-500 mb-2">{pos.method}</p>
                  <span
                    className={cn(
                      'inline-block px-2 py-0.5 rounded-full text-xs font-medium',
                      pos.status === 'Active'
                        ? 'bg-success-500/10 text-success-500'
                        : pos.status === 'Coming Soon'
                        ? 'bg-warning-500/10 text-warning-500'
                        : 'bg-surface-700 text-surface-400'
                    )}
                  >
                    {pos.status}
                  </span>
                </div>
              ))}
            </div>

            <p className="text-center text-surface-500 mt-8">
              Don't see your POS? <Link href="/contact" className="text-ezra-400 hover:text-ezra-300">Contact us</Link> — we're adding new integrations regularly.
            </p>
          </div>
        </section>

        {/* Features */}
        <section className="py-24 bg-surface-950">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-display-sm text-white mb-4">Everything You Need</h2>
              <p className="text-lg text-surface-400 max-w-2xl mx-auto">
                Ezra Sales gives you complete visibility into your franchise performance.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={feature.title}
                    className={cn(
                      'p-6 rounded-xl',
                      'bg-surface-900 border border-surface-800',
                      'hover:border-ezra-500/30 transition-all duration-300'
                    )}
                  >
                    <div className="w-12 h-12 rounded-xl bg-ezra-500/10 flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-ezra-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                    <p className="text-surface-400">{feature.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Data Fields */}
        <section className="py-24 bg-surface-900">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-display-sm text-white mb-6">Comprehensive Data Model</h2>
                <p className="text-lg text-surface-400 mb-8">
                  Every metric you need, normalized from any POS system into a consistent schema.
                </p>

                <div className="space-y-4">
                  {[
                    'Total Revenue (daily, weekly, monthly)',
                    'Service Revenue vs Product Revenue',
                    'Guest Count & Ticket Count',
                    'Average Ticket Value',
                    'Tips by Service Provider',
                    'Cash vs Card Revenue',
                    'Refunds & Discounts',
                    'Goal Tracking & Variance',
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-ezra-400" />
                      <span className="text-surface-300">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-surface-850 rounded-2xl p-8 border border-surface-700">
                <h3 className="text-lg font-semibold text-white mb-6">Sample Data Schema</h3>
                <pre className="text-sm text-surface-400 font-mono overflow-x-auto">
{`{
  "date": "2024-01-15",
  "location_id": "loc-80660",
  "total_revenue": 4250.00,
  "service_revenue": 3400.00,
  "product_revenue": 850.00,
  "guest_count": 48,
  "ticket_count": 52,
  "avg_ticket": 81.73,
  "total_tips": 612.00,
  "cash_revenue": 850.00,
  "card_revenue": 3400.00,
  "refund_amount": 75.00,
  "discount_amount": 125.00,
  "goal_revenue": 4000.00,
  "goal_gap": 250.00,
  "goal_gap_percent": 6.25
}`}
                </pre>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 bg-surface-950">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-display-sm text-white mb-6">
              Ready to Transform Your Sales Visibility?
            </h2>
            <p className="text-lg text-surface-400 mb-10 max-w-2xl mx-auto">
              Ezra Sales is custom-configured for each client. Let's talk about how we can
              connect to your POS system and get you real-time insights.
            </p>
            <Link href="/contact">
              <Button size="lg" rightIcon={<ArrowRight className="w-5 h-5" />}>
                Schedule a Demo
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
