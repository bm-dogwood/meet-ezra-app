'use client';

// ===========================================
// EZRA PORTAL - Solutions Page
// ===========================================

import React from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  TrendingUp,
  Shield,
  Clock,
  Users,
  Target,
  BarChart3,
  AlertTriangle,
  CheckCircle,
  Sparkles,
  DollarSign,
  Repeat,
  Eye,
  Zap,
  ChevronRight,
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
          <Link href="/solutions" className="text-white font-medium">Solutions</Link>
          <Link href="/platform" className="text-surface-300 hover:text-white transition-colors">Platform</Link>
          <Link href="/about" className="text-surface-300 hover:text-white transition-colors">About</Link>
          <Link href="/contact" className="text-surface-300 hover:text-white transition-colors">Contact</Link>
        </nav>
        <MobileMenu active={"Solutions"} />
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

const solutions = [
  {
    id: 'revenue-visibility',
    icon: TrendingUp,
    problem: 'You\'re flying blind on revenue',
    headline: 'Total Revenue Visibility',
    description: 'Most franchise owners wait days or weeks for financial reports. Ezra gives you real-time revenue data from every location — normalized, compared, and trended — the moment it happens. No more spreadsheets. No more guessing which location is underperforming.',
    capabilities: [
      'Daily revenue tracking with automated goal comparisons',
      'Service vs. product revenue breakdown by location',
      'Payment mix analysis — know your cash vs. card split',
      'Trend analysis with rolling averages and forecasting',
      'Instant location-to-location benchmarking',
    ],
    metric: '$2.4M+',
    metricLabel: 'Average annual revenue tracked per client',
    color: 'ezra',
  },
  {
    id: 'loss-prevention',
    icon: Shield,
    problem: 'Shrinkage is eating your margins',
    headline: 'AI-Powered Loss Prevention',
    description: 'Internal shrinkage is the silent margin killer in franchise operations. Ezra LP monitors every transaction for anomalies — unusual refund patterns, discount abuse, suspicious voids — and alerts you before small issues become big losses.',
    capabilities: [
      'Automated refund and void pattern detection',
      'Employee risk scoring based on transaction behavior',
      'Discount abuse monitoring across locations',
      'Real-time alerts for high-severity anomalies',
      'Historical trend analysis to identify chronic issues',
    ],
    metric: '3.2%',
    metricLabel: 'Average shrinkage reduction in first 90 days',
    color: 'purple',
  },
  {
    id: 'labor-optimization',
    icon: Clock,
    problem: 'You\'re overstaffed when it\'s slow and short when it\'s busy',
    headline: 'Intelligent Labor Optimization',
    description: 'Labor is your biggest controllable expense. Ezra Scheduling analyzes revenue per labor hour across every time slot and location, then surfaces specific recommendations to cut idle time, redistribute shifts, and eliminate unnecessary overtime.',
    capabilities: [
      'Idle time detection — labor hours generating zero revenue',
      'Time-of-day traffic analysis with SRPH tracking',
      'AI shift recommendations based on actual demand patterns',
      'Overtime monitoring and redistribution alerts',
      'Location-by-location labor efficiency rankings',
    ],
    metric: '18%',
    metricLabel: 'Average idle hour reduction across clients',
    color: 'green',
  },
  {
    id: 'client-retention',
    icon: Repeat,
    problem: 'Your clients are leaving and you don\'t know why',
    headline: 'Automated Client Retention',
    description: 'Traditional CRMs weren\'t built for franchise operations. Ezra Exponential replaces generic tools with industry-specific retention automation — segmenting your guests by visit frequency, triggering personalized re-engagement campaigns, and measuring exactly which offers bring people back.',
    capabilities: [
      'Replaces generic CRMs with franchise-specific workflows',
      'Automated visit-frequency bucketing (4, 6, 8-week segments)',
      'Personalized SMS and email re-engagement campaigns',
      'Uptake rate tracking — know which offers actually work',
      'Retention risk scoring to catch clients before they leave',
    ],
    metric: '24%',
    metricLabel: 'Average increase in rebooking rates',
    color: 'orange',
  },
];

const painPoints = [
  { icon: Eye, text: 'No visibility into real-time revenue' },
  { icon: DollarSign, text: 'Unexplained margin erosion' },
  { icon: Clock, text: 'Labor costs eating into profits' },
  { icon: Users, text: 'Clients leaving without a follow-up' },
  { icon: AlertTriangle, text: 'No way to benchmark locations' },
  { icon: Target, text: 'Paying for CRMs that don\'t fit your industry' },
];

export default function SolutionsPage() {
  return (
    <div className="min-h-screen bg-surface-950">
      <Header />

      <main className="pt-24 pb-16">
        {/* Hero */}
        <section className="relative py-24 overflow-hidden">
          <div className="absolute inset-0 bg-grid opacity-20" />
          <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-ezra-500/10 rounded-full blur-[128px]" />
          <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-purple-500/5 rounded-full blur-[128px]" />

          <div className="relative max-w-7xl mx-auto px-6">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface-800/50 border border-surface-700/50 mb-8">
                <Sparkles className="w-4 h-4 text-ezra-400" />
                <span className="text-sm text-surface-300">Solutions for Franchise Operators</span>
              </div>
              <h1 className="text-display-lg text-white mb-6">
                Every problem you face,{' '}
                <span className="gradient-text">Ezra solves</span>
              </h1>
              <p className="text-xl text-surface-400 leading-relaxed">
                Running a multi-unit franchise means juggling revenue tracking, loss prevention,
                staffing, and client retention — usually across disconnected tools. Ezra brings
                it all into one intelligent platform.
              </p>
            </div>
          </div>
        </section>

        {/* Pain Points Strip */}
        <section className="py-12 bg-surface-900 border-y border-surface-800">
          <div className="max-w-7xl mx-auto px-6">
            <p className="text-sm text-surface-500 uppercase tracking-wider mb-6 font-medium">
              Sound familiar?
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {painPoints.map((point) => {
                const Icon = point.icon;
                return (
                  <div key={point.text} className="flex items-start gap-3">
                    <Icon className="w-5 h-5 text-danger-500 flex-shrink-0 mt-0.5" />
                    <span className="text-surface-300 text-sm">{point.text}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Solution Deep Dives */}
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-6">
            <div className="space-y-32">
              {solutions.map((solution, index) => {
                const Icon = solution.icon;
                const isEven = index % 2 === 0;
                const colorMap: Record<string, { bg: string; text: string; border: string }> = {
                  ezra: { bg: 'bg-ezra-500/10', text: 'text-ezra-400', border: 'border-ezra-500/20' },
                  purple: { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/20' },
                  green: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20' },
                  orange: { bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/20' },
                };
                const colors = colorMap[solution.color];

                return (
                  <div key={solution.id} className="grid lg:grid-cols-2 gap-16 items-center">
                    {/* Content */}
                    <div className={cn(!isEven && 'lg:order-2')}>
                      <p className="text-danger-500 text-sm font-medium uppercase tracking-wider mb-3">
                        The Problem
                      </p>
                      <h3 className="text-lg text-surface-300 mb-6 italic">
                        &ldquo;{solution.problem}&rdquo;
                      </h3>
                      <h2 className="text-display-sm text-white mb-4">
                        {solution.headline}
                      </h2>
                      <p className="text-surface-400 leading-relaxed mb-8 text-lg">
                        {solution.description}
                      </p>
                      <Link href="/contact">
                        <Button rightIcon={<ArrowRight className="w-4 h-4" />}>
                          See How It Works
                        </Button>
                      </Link>
                    </div>

                    {/* Capabilities Card */}
                    <div className={cn(
                      'rounded-2xl p-8 border',
                      'bg-surface-900 border-surface-800',
                      !isEven && 'lg:order-1'
                    )}>
                      <div className="flex items-center gap-4 mb-6">
                        <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center', colors.bg)}>
                          <Icon className={cn('w-6 h-6', colors.text)} />
                        </div>
                        <div>
                          <p className="text-sm text-surface-500 uppercase tracking-wider">Capabilities</p>
                        </div>
                      </div>
                      <ul className="space-y-4 mb-8">
                        {solution.capabilities.map((cap) => (
                          <li key={cap} className="flex items-start gap-3">
                            <CheckCircle className={cn('w-5 h-5 flex-shrink-0 mt-0.5', colors.text)} />
                            <span className="text-surface-300">{cap}</span>
                          </li>
                        ))}
                      </ul>
                      <div className={cn('rounded-xl p-6 border', colors.bg, colors.border)}>
                        <p className={cn('text-3xl font-bold mb-1', colors.text)}>
                          {solution.metric}
                        </p>
                        <p className="text-surface-400 text-sm">{solution.metricLabel}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Integration Strip */}
        <section className="py-24 bg-surface-900">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <h2 className="text-display-sm text-white mb-4">
              Works With Your Existing POS
            </h2>
            <p className="text-lg text-surface-400 max-w-2xl mx-auto mb-12">
              Ezra doesn&rsquo;t replace your POS — it connects to it. Our intelligent automation
              layer extracts data from any system, with or without an API.
            </p>
            <div className="inline-flex flex-wrap justify-center gap-4">
              {['Zenoti', 'Stripe', 'Toast', 'Square', 'Clover'].map((pos) => (
                <div key={pos} className="px-6 py-3 rounded-xl bg-surface-850 border border-surface-700 text-surface-300">
                  {pos}
                </div>
              ))}
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
              Ready to See the Difference?
            </h2>
            <p className="text-lg text-surface-400 mb-10 max-w-2xl mx-auto">
              Every Ezra implementation is custom-configured for your franchise. Tell us what
              you&rsquo;re dealing with and we&rsquo;ll show you exactly how Ezra fixes it.
            </p>
            <Link href="/contact">
              <Button size="lg" rightIcon={<ArrowRight className="w-5 h-5" />}>
                Talk to Our Team
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
