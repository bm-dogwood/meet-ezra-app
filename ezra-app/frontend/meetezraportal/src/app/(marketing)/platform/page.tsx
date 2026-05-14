'use client';

// ===========================================
// EZRA PORTAL - Platform Page
// ===========================================

import React from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  LayoutDashboard,
  ShoppingCart,
  Shield,
  Calendar,
  Rocket,
  MapPin,
  FileText,
  Settings,
  Lock,
  RefreshCw,
  Sparkles,
  ChevronRight,
  TrendingUp,
  BarChart3,
  Users,
  Bell,
  Zap,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Button from '@/components/ui/Button';
import MobileMenu from '@/components/ui/MobileMenu';

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
          <Link href="/platform" className="text-white font-medium">Platform</Link>
          <Link href="/about" className="text-surface-300 hover:text-white transition-colors">About</Link>
          <Link href="/contact" className="text-surface-300 hover:text-white transition-colors">Contact</Link>
        </nav>
        <MobileMenu active={"Platform"} />
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

// Mock Dashboard Preview
const DashboardPreview = () => (
  <div className="rounded-2xl overflow-hidden border border-surface-700 bg-surface-925 shadow-elevated">
    {/* Top bar */}
    <div className="flex items-center gap-3 px-4 py-3 bg-surface-900 border-b border-surface-800">
      <div className="flex gap-1.5">
        <div className="w-3 h-3 rounded-full bg-danger-500/60" />
        <div className="w-3 h-3 rounded-full bg-warning-500/60" />
        <div className="w-3 h-3 rounded-full bg-success-500/60" />
      </div>
      <div className="flex-1 flex justify-center">
        <div className="px-4 py-1 rounded-md bg-surface-800 text-xs text-surface-400">
          app.meetezra.bot/dashboard
        </div>
      </div>
    </div>
    {/* Dashboard body */}
    <div className="flex">
      {/* Sidebar */}
      <div className="w-48 bg-surface-900 border-r border-surface-800 p-4 hidden md:block">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-7 h-7 rounded-md bg-gradient-to-br from-ezra-400 to-ezra-600 flex items-center justify-center">
            <span className="text-white font-bold text-xs">E</span>
          </div>
          <span className="text-white text-sm font-semibold">Ezra</span>
        </div>
        <div className="space-y-1">
          {[
            { icon: LayoutDashboard, label: 'Dashboard', active: true },
            { icon: ShoppingCart, label: 'Ezra Sales', active: false },
            { icon: Shield, label: 'Ezra LP', active: false },
            { icon: Calendar, label: 'Scheduling', active: false },
            { icon: Rocket, label: 'Exponential', active: false },
            { icon: MapPin, label: 'Locations', active: false },
            { icon: FileText, label: 'Reports', active: false },
            { icon: Settings, label: 'Settings', active: false },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className={cn(
                'flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm',
                item.active ? 'bg-ezra-500/10 text-ezra-400' : 'text-surface-400'
              )}>
                <Icon className="w-4 h-4" />
                {item.label}
              </div>
            );
          })}
        </div>
      </div>
      {/* Main content */}
      <div className="flex-1 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-white text-sm font-semibold">Executive Dashboard</h3>
            <p className="text-surface-500 text-xs">Dogwood Franchise Group — 24 Locations</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="px-2 py-1 rounded-md bg-surface-800 text-xs text-surface-400">Today</div>
            <div className="px-2 py-1 rounded-md bg-ezra-500/10 text-xs text-ezra-400">7d</div>
            <div className="px-2 py-1 rounded-md bg-surface-800 text-xs text-surface-400">30d</div>
          </div>
        </div>
        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          {[
            { label: 'Total Revenue', value: '$847,230', change: '+12.4%', up: true },
            { label: 'Avg Ticket', value: '$127.50', change: '+3.2%', up: true },
            { label: 'Labor %', value: '34.8%', change: '-1.1%', up: true },
            { label: 'Rebooking', value: '68%', change: '-2.3%', up: false },
          ].map((kpi) => (
            <div key={kpi.label} className="p-3 rounded-xl bg-surface-850 border border-surface-800">
              <p className="text-surface-500 text-xs mb-1">{kpi.label}</p>
              <p className="text-white font-semibold text-lg">{kpi.value}</p>
              <p className={cn('text-xs mt-0.5', kpi.up ? 'text-success-500' : 'text-danger-500')}>
                {kpi.change}
              </p>
            </div>
          ))}
        </div>
        {/* Chart placeholder */}
        <div className="rounded-xl bg-surface-850 border border-surface-800 p-4 mb-4">
          <p className="text-surface-400 text-xs mb-3">Revenue Trend — Last 7 Days</p>
          <div className="flex items-end gap-2 h-24">
            {[65, 72, 58, 80, 74, 88, 92].map((h, i) => (
              <div key={i} className="flex-1 rounded-t-sm bg-gradient-to-t from-ezra-600 to-ezra-400" style={{ height: `${h}%` }} />
            ))}
          </div>
        </div>
        {/* Alerts */}
        <div className="rounded-xl bg-surface-850 border border-surface-800 p-4">
          <p className="text-surface-400 text-xs mb-2">Active Alerts</p>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs">
              <div className="w-2 h-2 rounded-full bg-danger-500" />
              <span className="text-surface-300">Henderson — refund rate 340% above average</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className="w-2 h-2 rounded-full bg-warning-500" />
              <span className="text-surface-300">Scottsdale — overtime threshold exceeded</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className="w-2 h-2 rounded-full bg-success-500" />
              <span className="text-surface-300">Tempe — highest SRPH in portfolio ($142/hr)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const modules = [
  {
    icon: ShoppingCart,
    name: 'Ezra Sales',
    description: 'Unified revenue dashboards with daily metrics, goal tracking, and location-to-location benchmarking. See service vs. product splits, payment mix, and trend lines.',
    features: ['Revenue tracking', 'Goal comparisons', 'Location rankings', 'Trend analysis'],
    color: 'text-ezra-400',
    bg: 'bg-ezra-500/10',
  },
  {
    icon: Shield,
    name: 'Ezra LP',
    description: 'AI anomaly detection for refunds, voids, and discounts. Risk scoring by employee and location with automated alerts for suspicious patterns.',
    features: ['Anomaly detection', 'Risk scoring', 'Automated alerts', 'Pattern analysis'],
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
  },
  {
    icon: Calendar,
    name: 'Ezra Scheduling',
    description: 'Labor optimization powered by revenue-per-hour data. See idle time, peak periods, and get AI recommendations on shift adjustments.',
    features: ['Idle time detection', 'SRPH tracking', 'Shift recommendations', 'Overtime monitoring'],
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
  },
  {
    icon: Rocket,
    name: 'Ezra Exponential',
    description: 'Client retention engine that replaces your CRM. Automated visit-frequency segmentation, SMS/email campaigns, and uptake rate tracking.',
    features: ['Client segmentation', 'Automated campaigns', 'Uptake tracking', 'Retention scoring'],
    color: 'text-orange-400',
    bg: 'bg-orange-500/10',
  },
];

const platformFeatures = [
  {
    icon: LayoutDashboard,
    title: 'Executive Dashboard',
    description: 'Portfolio-wide KPIs, revenue trends, and performance rankings at a glance. The first thing you see when you log in.',
  },
  {
    icon: MapPin,
    title: 'Location Management',
    description: 'Drill down into any location for detailed metrics, staff performance, and operational health. Compare side-by-side.',
  },
  {
    icon: FileText,
    title: 'Automated Reports',
    description: 'Daily, weekly, and monthly reports generated and delivered to your inbox. No manual data pulls required.',
  },
  {
    icon: Bell,
    title: 'Smart Alerts',
    description: 'Real-time notifications for anomalies, goal milestones, overtime thresholds, and retention risks. Only what matters.',
  },
  {
    icon: Lock,
    title: 'Role-Based Access',
    description: 'Franchisors see everything. Franchisees see their locations. Managers see their store. Everyone gets exactly what they need.',
  },
  {
    icon: RefreshCw,
    title: 'Automated Data Sync',
    description: 'Ezra syncs with your systems continuously. No manual imports, no stale data. Always up-to-date, always accurate.',
  },
];

export default function PlatformPage() {
  return (
    <div className="min-h-screen bg-surface-950">
      <Header />

      <main className="pt-24 pb-16">
        {/* Hero */}
        <section className="relative py-24 overflow-hidden">
          <div className="absolute inset-0 bg-grid opacity-20" />
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-ezra-500/8 rounded-full blur-[128px]" />

          <div className="relative max-w-7xl mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface-800/50 border border-surface-700/50 mb-8">
                <Sparkles className="w-4 h-4 text-ezra-400" />
                <span className="text-sm text-surface-300">The Ezra Platform</span>
              </div>
              <h1 className="text-display-lg text-white mb-6">
                Your entire franchise,{' '}
                <span className="gradient-text">one login</span>
              </h1>
              <p className="text-xl text-surface-400 leading-relaxed">
                The Ezra portal gives franchise operators a single, unified command center for
                revenue, loss prevention, labor, and client retention — across every location.
              </p>
            </div>

            {/* Dashboard Preview */}
            <div className="max-w-5xl mx-auto">
              <DashboardPreview />
            </div>
          </div>
        </section>

        {/* Modules Grid */}
        <section className="py-24 bg-surface-900">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-display-sm text-white mb-4">
                Four Modules, One Platform
              </h2>
              <p className="text-lg text-surface-400 max-w-2xl mx-auto">
                Every Ezra module lives inside a single portal. No switching between tools,
                no duplicate logins, no disconnected data.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {modules.map((mod) => {
                const Icon = mod.icon;
                return (
                  <div
                    key={mod.name}
                    className="p-8 rounded-2xl bg-surface-850 border border-surface-800 hover:border-ezra-500/30 transition-all duration-300"
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center', mod.bg)}>
                        <Icon className={cn('w-6 h-6', mod.color)} />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-white mb-2">{mod.name}</h3>
                        <p className="text-surface-400 text-sm leading-relaxed">{mod.description}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-4">
                      {mod.features.map((f) => (
                        <span key={f} className="px-3 py-1 rounded-full bg-surface-800 text-surface-400 text-xs">
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Platform Features */}
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-display-sm text-white mb-4">
                Built for Multi-Unit Operations
              </h2>
              <p className="text-lg text-surface-400 max-w-2xl mx-auto">
                Every feature in the platform is designed for operators managing 3 to 200+ locations.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {platformFeatures.map((feature) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={feature.title}
                    className="p-6 rounded-xl bg-surface-900 border border-surface-800 hover:border-surface-700 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-lg bg-ezra-500/10 flex items-center justify-center mb-4">
                      <Icon className="w-5 h-5 text-ezra-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                    <p className="text-surface-400 text-sm leading-relaxed">{feature.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Security Strip */}
        <section className="py-16 bg-surface-900 border-y border-surface-800">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1">
                <h3 className="text-heading-lg text-white mb-2">Enterprise-Grade Security</h3>
                <p className="text-surface-400">
                  Dedicated credentials per client, role-based access controls, encrypted data
                  in transit and at rest, and full audit trails for every action.
                </p>
              </div>
              <div className="flex flex-wrap justify-center md:justify-start gap-6">
                {['SOC 2', 'Encrypted', 'RBAC', 'Audit Logs'].map((label) => (
                  <div key={label} className="text-center">
                    <div className="w-12 h-12 rounded-xl bg-ezra-500/10 flex items-center justify-center mx-auto mb-2">
                      <Lock className="w-5 h-5 text-ezra-400" />
                    </div>
                    <p className="text-surface-300 text-xs">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-ezra-500/10 rounded-full blur-[150px]" />
          </div>
          <div className="relative max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-display-sm text-white mb-6">
              See the Platform in Action
            </h2>
            <p className="text-lg text-surface-400 mb-10 max-w-2xl mx-auto">
              Book a 20-minute walkthrough and we&rsquo;ll show you the exact portal your
              team would use — configured for your brand, your locations, your data.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/contact">
                <Button size="lg" rightIcon={<ArrowRight className="w-5 h-5" />}>
                  Schedule a Demo
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="ghost" size="lg">
                  Client Login
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
