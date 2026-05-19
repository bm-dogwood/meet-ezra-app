"use client";

// ===========================================
// EZRA PORTAL - Marketing Home Page
// ===========================================

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Button from "@/components/ui/Button";
import MobileMenu from "@/components/ui/MobileMenu";

// Import new sections
import { Hero } from "@/components/site/Hero";
import { LogoTicker } from "@/components/site/LogoTicker";
import { ProblemSection } from "@/components/site/ProblemSection";
import { BuildingSection } from "@/components/site/BuildingSection";
import { ModulesSection } from "@/components/site/ModulesSection";
import { MetricsSection } from "@/components/site/MetricsSection";
import { ArchitectureSection } from "@/components/site/ArchitectureSection";
import { WhyEzraSection } from "@/components/site/WhyEzraSection";
import { RoadmapSection } from "@/components/site/RoadmapSection";
import { CTAFooter } from "@/components/site/CTAFooter";

import { useState, useEffect } from "react";
import Header from "@/components/site/Header";

// ============ Footer ============
const FOOTER_LINKS = {
  Product: [
    { href: "/bots", label: "The Ezra Family", badge: "NEW" },
    { href: "/solutions", label: "Solutions" },
    { href: "/platform", label: "Platform" },
    { href: "/integrations", label: "Integrations" },
    { href: "/changelog", label: "Changelog" },
  ],
  Company: [
    { href: "/about", label: "About" },
    { href: "/blog", label: "Blog" },
    { href: "/careers", label: "Careers" },
    { href: "/press", label: "Press" },
    { href: "/contact", label: "Contact" },
  ],
  Resources: [
    { href: "/docs", label: "Documentation" },
    { href: "/api", label: "API Reference" },
    { href: "/security", label: "Security" },
    { href: "/status", label: "Status" },
    { href: "/support", label: "Support" },
  ],
};

const SOCIAL_LINKS = [
  { href: "https://twitter.com", label: "Twitter", icon: "𝕏" },
  { href: "https://linkedin.com", label: "LinkedIn", icon: "in" },
  { href: "https://github.com", label: "GitHub", icon: "⌥" },
];

const Footer = () => (
  <footer className="bg-surface-950 border-t border-surface-800/70 relative overflow-hidden">
    {/* Blue glow at top */}
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-px bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />

    {/* Main grid */}
    <div className="max-w-7xl mx-auto px-6 pt-14 pb-10 grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr] gap-12">
      {/* Brand */}
      <div>
        <Link href="/" className="flex items-center gap-2.5 mb-4">
          <div className="w-9 h-9 rounded-[10px] bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-[0_0_0_1px_rgba(59,130,246,0.3)]">
            <span className="text-white font-bold text-lg">E</span>
          </div>
          <span className="text-[18px] font-semibold text-white tracking-tight">
            Ezra
          </span>
        </Link>
        <p className="text-sm text-surface-500 leading-relaxed max-w-[220px] mb-6">
          Intelligent AI assistants built for the way your team actually works.
        </p>
      </div>

      {/* Link columns */}
      {Object.entries(FOOTER_LINKS).map(([section, links]) => (
        <div key={section}>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-surface-600 mb-4">
            {section}
          </p>
          <ul className="flex flex-col gap-2.5">
            {links.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="text-[13.5px] text-surface-500 hover:text-white transition-colors duration-150 flex items-center gap-2"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>

    {/* Bottom bar */}
    <div className="border-t border-surface-800/50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <span className="text-[12.5px] text-surface-600">
          © 2026 Ezra AI, Inc. All rights reserved.
        </span>

        {/* Status indicator */}
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.6)]" />
          <span className="text-[12.5px] text-surface-600">
            All systems operational
          </span>
        </div>

        <div className="flex items-center gap-5">
          {[
            { href: "/privacy", label: "Privacy" },
            { href: "/terms", label: "Terms" },
            { href: "/cookies", label: "Cookies" },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-[12.5px] text-surface-600 hover:text-surface-400 transition-colors"
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  </footer>
);

const organizationLD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Franchise AI, LLC dba Ezra AI",
  url: "https://meetezra.bot",
  logo: "https://meetezra.bot/logo.svg",
  description:
    "Ezra is the AI platform built for franchise and small business operators — automate loss prevention, employee scheduling, CRM, inventory, and sales dashboard across every unit.",
  sameAs: [],
  contactPoint: {
    "@type": "ContactPoint",
    email: "onboarding@meetezra.bot",
    contactType: "sales",
  },
};

const webSiteLD = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Ezra — Franchise Intelligence Platform",
  url: "https://meetezra.bot",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://meetezra.bot/?q={search_term_string}",
    "query-input": "required name=search_term_string",
  },
};

const softwareAppLD = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Ezra Franchise Intelligence Platform",
  url: "https://meetezra.bot",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  description:
    "AI-powered franchise management software for multi-unit operators and small business franchisees. Modules: loss prevention, employee theft detection, shrinkage reduction, inventory management, employee scheduling automation, CRM, and a unified sales dashboard.",
  provider: {
    "@type": "Organization",
    name: "Franchise AI, LLC dba Ezra AI",
    url: "https://meetezra.bot",
  },
  featureList: [
    "Franchise loss prevention and employee theft detection",
    "Shrinkage and inventory monitoring",
    "AI employee scheduling to save money on labor",
    "Multi-unit CRM and customer retention",
    "Real-time sales dashboard across all franchise locations",
    "Automate franchise operations with AI",
    "Small business franchise management",
  ],
  offers: {
    "@type": "Offer",
    url: "https://meetezra.bot/contact",
    description: "Contact for franchise and multi-unit operator pricing",
  },
};

const faqLD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How does Ezra help with franchise loss prevention and employee theft?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Ezra's loss prevention module analyzes every POS transaction in real time, flagging behavioral anomalies that signal internal theft, void abuse, discount manipulation, and shrinkage. Operators get an alert-driven dashboard showing exactly which employees, shifts, and locations have elevated risk — without manually reviewing thousands of transactions.",
      },
    },
    {
      "@type": "Question",
      name: "Can Ezra automate employee scheduling for franchise locations?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Ezra's scheduling module uses historical sales patterns and labor data to optimize shift deployment before idle hours compound. It surfaces overtime risks, understaffed periods, and scheduling inefficiencies — helping multi-unit operators save money on labor across every unit.",
      },
    },
    {
      "@type": "Question",
      name: "Does Ezra include a CRM for franchise customer retention?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Ezra Exponential is the built-in franchise CRM module. It identifies lapsed guests based on visit frequency, then automates SMS re-engagement campaigns to bring them back — without manual outreach. It's built specifically for multi-unit franchise operators.",
      },
    },
    {
      "@type": "Question",
      name: "What does the Ezra sales dashboard show?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The Ezra sales dashboard provides real-time revenue intelligence broken down by location, service provider, and service type. Multi-unit operators can compare performance across units, spot underperformers, and act on the data the same day — not at the end of the month.",
      },
    },
    {
      "@type": "Question",
      name: "Is Ezra right for small business franchise operators?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Ezra is designed for operators running 3 to 100+ franchise locations. Small business franchisees get the same AI tools used by large multi-unit operators: loss prevention, inventory insights, employee scheduling, CRM, and a unified dashboard — all without replacing existing POS or scheduling software.",
      },
    },
    {
      "@type": "Question",
      name: "How does Ezra reduce shrinkage and inventory loss?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Ezra's inventory and loss prevention modules use financial-proxy modeling to detect supply cost anomalies and consumption patterns that indicate shrinkage. Rather than waiting for a physical count, Ezra flags potential shrinkage in real time so operators can investigate and act immediately.",
      },
    },
    {
      "@type": "Question",
      name: "How much can franchise operators save using Ezra?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Savings vary by operator, but Ezra typically helps franchise and small business operators recover value across three areas: reducing employee theft and shrinkage losses, cutting idle labor hours through smarter scheduling, and recovering lapsed customer revenue through automated CRM. Operators with 10+ locations often see measurable returns within the first 60 days.",
      },
    },
  ],
};

// ============ Main Page ============
export default function HomePage() {
  return (
    <div className="min-h-screen bg-surface-950">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLD) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteLD) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareAppLD) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLD) }}
      />
      <Header />
      <main className="relative bg-background text-foreground antialiased">
        <Hero />
        <LogoTicker />
        <div id="platform">
          <ProblemSection />
        </div>
        <BuildingSection />
        <ModulesSection />
        {/* <RoadmapSection /> */}
        <ArchitectureSection />
        <WhyEzraSection />

        <CTAFooter />
      </main>
    </div>
  );
}
