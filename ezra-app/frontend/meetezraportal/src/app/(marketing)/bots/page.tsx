'use client';

// ===========================================
// EZRA PORTAL - Bots Overview Page
// ===========================================

import React from 'react';
import Link from 'next/link';
import {
  ShoppingCart,
  Shield,
  Calendar,
  Rocket,
  ArrowRight,
  Check,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Button from '@/components/ui/Button';
import MobileMenu from '@/components/ui/MobileMenu';

// Header component (reused from home)
const Header = () => (
  <header className="fixed top-0 left-0 right-0 z-50 bg-surface-950/80 backdrop-blur-xl border-b border-surface-800/50">
    <div className="max-w-7xl mx-auto px-6">
      <div className="flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-ezra-400 to-ezra-600 flex items-center justify-center shadow-glow">
            <span className="text-white font-bold text-lg">E</span>
          </div>
          <span className="text-xl font-semibold text-white tracking-tight">
            Ezra
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/bots" className="text-white font-medium">The Ezra Family</Link>
          <Link href="/solutions" className="text-surface-300 hover:text-white transition-colors">Solutions</Link>
          <Link href="/platform" className="text-surface-300 hover:text-white transition-colors">Platform</Link>
          <Link href="/about" className="text-surface-300 hover:text-white transition-colors">About</Link>
          <Link href="/contact" className="text-surface-300 hover:text-white transition-colors">Contact</Link>
        </nav>
        <MobileMenu active={"The Ezra Family"} />
        <div className="hidden md:flex items-center gap-4">
          <Link href="/login">
            <Button variant="ghost">Sign In</Button>
          </Link>
          <Link href="/contact">
            <Button>Request Demo</Button>
          </Link>
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
          <Link href="/privacy" className="text-surface-400 hover:text-surface-300 text-sm">
            Privacy Policy
          </Link>
          <Link href="/terms" className="text-surface-400 hover:text-surface-300 text-sm">
            Terms of Service
          </Link>
        </div>
      </div>
    </div>
  </footer>
);

const bots = [
  {
    id: 'ezra-sales',
    name: 'Ezra Sales',
    icon: ShoppingCart,
    tagline: 'Real-time sales intelligence',
    description:
      'Track daily revenue, average tickets, goal performance, and trends across all your locations. Ezra Sales normalizes data from any POS system into unified dashboards.',
    features: [
      'Daily revenue tracking with goal comparisons',
      'Service vs product revenue breakdown',
      'Payment mix analysis (cash vs card)',
      'Location comparison and ranking',
      'Trend analysis and forecasting',
      'Real-time sync status monitoring',
    ],
    status: 'Active',
    href: '/bots/ezra-sales',
    color: 'ezra',
  },
  {
    id: 'ezra-lp',
    name: 'Ezra LP',
    icon: Shield,
    tagline: 'Loss prevention monitoring',
    description:
      'AI-powered anomaly detection for refunds, discounts, and suspicious transaction patterns. Protect your franchise from internal shrinkage and fraud.',
    features: [
      'Unusual refund pattern detection',
      'High-risk employee activity flagging',
      'Discount abuse monitoring',
      'Void transaction analysis',
      'Risk scoring by location',
      'Automated alert notifications',
    ],
    status: 'Active',
    href: '/bots',
    color: 'purple',
  },
  {
    id: 'ezra-scheduling',
    name: 'Ezra Scheduling',
    icon: Calendar,
    tagline: 'Intelligent labor optimization',
    description:
      'Pinpoint idle hours, optimize shift coverage, and eliminate overtime surprises across every location. Ezra Scheduling analyzes real revenue-per-labor-hour data to surface AI-driven staffing recommendations — so you staff for demand, not guesswork.',
    features: [
      'Idle time detection with revenue correlation',
      'Time-of-day traffic and SRPH analysis',
      'AI-generated shift recommendations',
      'Overtime monitoring and redistribution alerts',
      'Location rankings by labor efficiency',
      'Multi-location scheduling insights',
    ],
    status: 'Active',
    href: '/bots',
    color: 'green',
  },
  {
    id: 'ezra-exponential',
    name: 'Ezra Exponential',
    icon: Rocket,
    tagline: 'Your CRM replacement — built for franchises',
    description:
      'Stop paying for a CRM that wasn\'t built for your industry. Ezra Exponential replaces traditional CRMs with intelligent, automated client retention — segmenting guests by visit frequency, triggering personalized SMS and email re-engagement campaigns, and tracking uptake rates so you know exactly what\'s working and what\'s not.',
    features: [
      'Replaces generic CRMs with franchise-specific automation',
      'Visit-frequency bucketing (4-week, 6-week, 8-week segments)',
      'Automated SMS & email follow-up campaigns',
      'Uptake rate tracking per segment and location',
      'Retention risk scoring — know who\'s about to leave',
      'AI-powered offer and timing recommendations',
    ],
    status: 'Active',
    href: '/bots',
    color: 'orange',
  },
];

export default function BotsPage() {
  return (
    <div className="min-h-screen bg-surface-950">
      <Header />

      <main className="pt-24 pb-16">
        {/* Hero */}
        <section className="max-w-7xl mx-auto px-6 py-16">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface-800/50 border border-surface-700/50 mb-8">
              <Sparkles className="w-4 h-4 text-ezra-400" />
              <span className="text-sm text-surface-300">Purpose-Built AI Solutions</span>
            </div>
            <h1 className="text-display-md md:text-display-lg text-white mb-6">
              Meet the <span className="gradient-text">Ezra Family</span>
            </h1>
            <p className="text-xl text-surface-400 max-w-2xl mx-auto">
              Each Ezra product is designed to solve a specific operational challenge.
              Customized for your brand, configured to your needs.
            </p>
          </div>
        </section>

        {/* Bot Cards */}
        <section className="max-w-7xl mx-auto px-6">
          <div className="space-y-8">
            {bots.map((bot, index) => {
              const Icon = bot.icon;
              const isEven = index % 2 === 0;

              return (
                <div
                  key={bot.id}
                  className={cn(
                    'grid lg:grid-cols-2 gap-8 items-center p-8 rounded-2xl',
                    'bg-surface-900 border border-surface-800',
                    'hover:border-ezra-500/30 transition-all duration-300'
                  )}
                >
                  <div className={cn(!isEven && 'lg:order-2')}>
                    <div className="flex items-center gap-4 mb-4">
                      <div
                        className={cn(
                          'w-14 h-14 rounded-xl flex items-center justify-center',
                          bot.color === 'ezra' && 'bg-ezra-500/10',
                          bot.color === 'purple' && 'bg-purple-500/10',
                          bot.color === 'green' && 'bg-emerald-500/10',
                          bot.color === 'orange' && 'bg-orange-500/10'
                        )}
                      >
                        <Icon
                          className={cn(
                            'w-7 h-7',
                            bot.color === 'ezra' && 'text-ezra-400',
                            bot.color === 'purple' && 'text-purple-400',
                            bot.color === 'green' && 'text-emerald-400',
                            bot.color === 'orange' && 'text-orange-400'
                          )}
                        />
                      </div>
                      <div>
                        <h2 className="text-2xl font-semibold text-white">
                          {bot.name}
                        </h2>
                        <p className="text-surface-400">{bot.tagline}</p>
                      </div>
                      <span
                        className={cn(
                          'ml-auto px-3 py-1 rounded-full text-xs font-medium',
                          bot.status === 'Active'
                            ? 'bg-success-500/10 text-success-500'
                            : 'bg-surface-700 text-surface-400'
                        )}
                      >
                        {bot.status}
                      </span>
                    </div>
                    <p className="text-surface-400 mb-6 leading-relaxed">
                      {bot.description}
                    </p>
                    <Link href={bot.href}>
                      <Button
                        variant={bot.status === 'Active' ? 'primary' : 'secondary'}
                        rightIcon={<ArrowRight className="w-4 h-4" />}
                      >
                        {bot.status === 'Active' ? 'Learn More' : 'Coming Soon'}
                      </Button>
                    </Link>
                  </div>
                  <div
                    className={cn(
                      'bg-surface-850 rounded-xl p-6',
                      !isEven && 'lg:order-1'
                    )}
                  >
                    <h3 className="text-sm font-medium text-surface-300 mb-4">
                      Key Capabilities
                    </h3>
                    <ul className="space-y-3">
                      {bot.features.map((feature) => (
                        <li
                          key={feature}
                          className="flex items-start gap-3 text-surface-400"
                        >
                          <Check className="w-5 h-5 text-ezra-400 flex-shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* CTA */}
        <section className="max-w-7xl mx-auto px-6 py-24">
          <div className="text-center">
            <h2 className="text-display-sm text-white mb-6">
              Ready to See Ezra in Action?
            </h2>
            <p className="text-lg text-surface-400 mb-8 max-w-2xl mx-auto">
              Every Ezra implementation is custom-tailored to your franchise. Let's discuss
              how we can help transform your operations.
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
