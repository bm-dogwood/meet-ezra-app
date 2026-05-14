'use client';

// ===========================================
// EZRA PORTAL - About Page
// ===========================================

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Building2, Users, Briefcase, Target } from 'lucide-react';
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
          <Link href="/platform" className="text-surface-300 hover:text-white transition-colors">Platform</Link>
          <Link href="/about" className="text-white font-medium">About</Link>
          <Link href="/contact" className="text-surface-300 hover:text-white transition-colors">Contact</Link>
        </nav>
        <MobileMenu active={"About"} />
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

export default function AboutPage() {
  const audiences = [
    {
      icon: Building2,
      title: 'Franchisors',
      description: 'Corporate teams who need visibility across hundreds of locations. Track brand-wide performance, identify underperformers, and ensure operational consistency.',
    },
    {
      icon: Briefcase,
      title: 'Franchisees',
      description: 'Multi-unit operators managing 3-50+ locations. Get unified dashboards that work regardless of which POS systems individual locations use.',
    },
    {
      icon: Users,
      title: 'District & Regional Managers',
      description: 'Operations leaders responsible for geographic territories. Monitor real-time performance, receive alerts, and identify coaching opportunities.',
    },
    {
      icon: Target,
      title: 'Store Managers',
      description: 'Front-line leaders who need daily metrics at a glance. Track goals, review trends, and understand performance in context.',
    },
  ];

  return (
    <div className="min-h-screen bg-surface-950">
      <Header />

      <main className="pt-16">
        {/* Hero */}
        <section className="relative py-24 overflow-hidden">
          <div className="absolute inset-0 bg-grid opacity-30" />
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-ezra-500/10 rounded-full blur-[128px]" />

          <div className="relative max-w-7xl mx-auto px-6">
            <div className="max-w-3xl">
              <h1 className="text-display-lg text-white mb-6">
                About <span className="gradient-text">Ezra</span>
              </h1>
              <p className="text-2xl text-surface-400 leading-relaxed">
                Ezra is a managed AI automation platform built specifically for franchise operations.
                We connect to any POS system and transform raw data into actionable insights.
              </p>
            </div>
          </div>
        </section>

        {/* What We Do */}
        <section className="py-24 bg-surface-900">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-display-sm text-white mb-6">
                  Why We Built Ezra
                </h2>
                <div className="space-y-6 text-surface-400">
                  <p>
                    Franchise operations are complex. You have multiple locations, different POS systems,
                    varying staff capabilities, and a constant stream of data that's difficult to normalize
                    and interpret.
                  </p>
                  <p>
                    Many POS systems don't provide adequate APIs—or any API at all. Getting consistent
                    data across locations often requires manual exports, spreadsheets, and hours of
                    aggregation work.
                  </p>
                  <p>
                    Ezra solves this with our intelligent automation layer. When APIs exist,
                    we use them. When they don't, we extract data through secure browser automation.
                    Either way, you get normalized, consistent data in your Ezra dashboard.
                  </p>
                </div>
              </div>
              <div className="bg-surface-850 rounded-2xl p-8 border border-surface-700">
                <h3 className="text-lg font-semibold text-white mb-6">Our Approach</h3>
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-ezra-500/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-ezra-400 font-semibold">1</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-white">Managed Service</h4>
                      <p className="text-surface-400 text-sm mt-1">
                        Not self-serve SaaS. We handle setup, configuration, and ongoing maintenance.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-ezra-500/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-ezra-400 font-semibold">2</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-white">Per-Brand Customization</h4>
                      <p className="text-surface-400 text-sm mt-1">
                        Every dashboard is configured for your specific brand, metrics, and goals.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-ezra-500/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-ezra-400 font-semibold">3</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-white">White-Glove Onboarding</h4>
                      <p className="text-surface-400 text-sm mt-1">
                        Our team works directly with yours to ensure successful implementation.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Who We Serve */}
        <section className="py-24 bg-surface-950">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-display-sm text-white mb-4">Who Ezra Is For</h2>
              <p className="text-lg text-surface-400 max-w-2xl mx-auto">
                Ezra serves everyone in the franchise ecosystem who needs visibility into operational data.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {audiences.map((audience) => {
                const Icon = audience.icon;
                return (
                  <div
                    key={audience.title}
                    className={cn(
                      'p-8 rounded-2xl',
                      'bg-surface-900 border border-surface-800',
                      'hover:border-ezra-500/30 transition-all duration-300'
                    )}
                  >
                    <div className="w-14 h-14 rounded-xl bg-ezra-500/10 flex items-center justify-center mb-6">
                      <Icon className="w-7 h-7 text-ezra-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-3">{audience.title}</h3>
                    <p className="text-surface-400 leading-relaxed">{audience.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 bg-surface-900">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-display-sm text-white mb-6">
              Ready to Learn More?
            </h2>
            <p className="text-lg text-surface-400 mb-10 max-w-2xl mx-auto">
              Every Ezra engagement starts with a conversation. Let's discuss your franchise
              operations and see how we can help.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/contact">
                <Button size="lg" rightIcon={<ArrowRight className="w-5 h-5" />}>
                  Talk to Our Team
                </Button>
              </Link>
              <Link href="/bots">
                <Button variant="outline" size="lg">
                  Meet The Ezra Family
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
