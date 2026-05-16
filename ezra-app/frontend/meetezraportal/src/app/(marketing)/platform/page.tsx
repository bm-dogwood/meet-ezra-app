"use client";

import React from "react";
import Link from "next/link";
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
  Bell,
  Zap,
  Cpu,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Button from "@/components/ui/Button";
import MobileMenu from "@/components/ui/MobileMenu";

// ─── Brand tokens (V2, May 2026) ─────────────────────────────────────────────
// Primary: #06B6D4 / Hover: #22D3EE | Page: #09090B | Card: #141417 | Border: #27272A
// Module accents → Sales: cyan | LP: #6366F1 | Scheduling: #34D399 | Exponential: #FB923C
// DM Sans 300–700 | DM Mono 400/500 (numbers & code only)

// ─── Header ──────────────────────────────────────────────────────────────────

const Header = () => (
  <header
    className="fixed top-0 left-0 right-0 z-50 h-16 flex items-center border-b backdrop-blur-xl"
    style={{ background: "rgba(9,9,11,0.85)", borderColor: "#27272A" }}
  >
    <div className="max-w-7xl w-full mx-auto px-6 flex items-center justify-between">
      <Link href="/" className="group flex items-center gap-2.5 no-underline">
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold text-[#09090b] transition-transform group-hover:scale-105"
          style={{ background: "linear-gradient(135deg, #22D3EE, #06B6D4)" }}
        >
          E
        </div>
        <span
          style={{
            fontWeight: 600,
            letterSpacing: "0.18em",
            fontSize: "14px",
            color: "#FAFAFA",
            textTransform: "uppercase",
          }}
        >
          Ezra
        </span>
      </Link>

      <nav className="hidden md:flex items-center gap-8">
        {[
          { label: "The Ezra Family", href: "/bots" },
          { label: "Solutions", href: "/solutions" },
          { label: "Platform", href: "/platform" },
          { label: "About", href: "/about" },
          { label: "Contact", href: "/contact" },
        ].map(({ label, href }) => (
          <Link
            key={href}
            href={href}
            className="text-[13px] transition-all duration-200 no-underline relative"
            style={{
              color: href === "/platform" ? "#06B6D4" : "#71717A",
              fontWeight: href === "/platform" ? 600 : 400,
            }}
          >
            {label}
            {href === "/platform" && (
              <span
                className="absolute -bottom-1 left-0 right-0 h-px rounded-full"
                style={{
                  background: "linear-gradient(90deg, #22D3EE, #06B6D4)",
                }}
              />
            )}
          </Link>
        ))}
      </nav>

      <MobileMenu active="Platform" />

      <div className="hidden md:flex items-center gap-3">
        <Link
          href="/login"
          className="text-[13px] px-3.5 py-1.5 rounded-lg no-underline transition-colors duration-200"
          style={{ color: "#71717A" }}
        >
          Sign In
        </Link>
        <Link
          href="/contact"
          className="text-[13px] font-semibold px-5 py-2 rounded-lg no-underline"
          style={{
            background: "linear-gradient(135deg, #22D3EE, #06B6D4)",
            color: "#09090b",
          }}
        >
          Request Demo
        </Link>
      </div>
    </div>
  </header>
);

// ─── Footer ───────────────────────────────────────────────────────────────────

const Footer = () => (
  <footer
    className="py-10 border-t"
    style={{ background: "#09090b", borderColor: "#27272A" }}
  >
    <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div
          className="w-7 h-7 rounded-[7px] flex items-center justify-center text-sm font-bold text-[#09090b]"
          style={{ background: "linear-gradient(135deg, #22D3EE, #06B6D4)" }}
        >
          E
        </div>
        <span className="text-[12px]" style={{ color: "#3F3F46" }}>
          © 2026 Ezra AI. All rights reserved.
        </span>
      </div>
      <div className="flex gap-6">
        {[
          { label: "Privacy Policy", href: "/privacy" },
          { label: "Terms of Service", href: "/terms" },
        ].map(({ label, href }) => (
          <Link
            key={href}
            href={href}
            className="text-[12px] no-underline transition-colors duration-200"
            style={{ color: "#3F3F46" }}
          >
            {label}
          </Link>
        ))}
      </div>
    </div>
  </footer>
);

// ─── Dashboard Preview (UNCHANGED) ───────────────────────────────────────────

const DashboardPreview = () => (
  <div className="rounded-2xl overflow-hidden border border-surface-700 bg-surface-925 shadow-elevated">
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
    <div className="flex">
      <div className="w-48 bg-surface-900 border-r border-surface-800 p-4 hidden md:block">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-7 h-7 rounded-md bg-gradient-to-br from-ezra-400 to-ezra-600 flex items-center justify-center">
            <span className="text-white font-bold text-xs">E</span>
          </div>
          <span className="text-white text-sm font-semibold">Ezra</span>
        </div>
        <div className="space-y-1">
          {[
            { icon: LayoutDashboard, label: "Dashboard", active: true },
            { icon: ShoppingCart, label: "Ezra Sales", active: false },
            { icon: Shield, label: "Ezra LP", active: false },
            { icon: Calendar, label: "Scheduling", active: false },
            { icon: Rocket, label: "Exponential", active: false },
            { icon: MapPin, label: "Locations", active: false },
            { icon: FileText, label: "Reports", active: false },
            { icon: Settings, label: "Settings", active: false },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className={cn(
                  "flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm",
                  item.active
                    ? "bg-ezra-500/10 text-ezra-400"
                    : "text-surface-400"
                )}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </div>
            );
          })}
        </div>
      </div>
      <div className="flex-1 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-white text-sm font-semibold">
              Executive Dashboard
            </h3>
            <p className="text-surface-500 text-xs">
              Dogwood Franchise Group — 24 Locations
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="px-2 py-1 rounded-md bg-surface-800 text-xs text-surface-400">
              Today
            </div>
            <div className="px-2 py-1 rounded-md bg-ezra-500/10 text-xs text-ezra-400">
              7d
            </div>
            <div className="px-2 py-1 rounded-md bg-surface-800 text-xs text-surface-400">
              30d
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          {[
            {
              label: "Total Revenue",
              value: "$847,230",
              change: "+12.4%",
              up: true,
            },
            {
              label: "Avg Ticket",
              value: "$127.50",
              change: "+3.2%",
              up: true,
            },
            { label: "Labor %", value: "34.8%", change: "-1.1%", up: true },
            { label: "Rebooking", value: "68%", change: "-2.3%", up: false },
          ].map((kpi) => (
            <div
              key={kpi.label}
              className="p-3 rounded-xl bg-surface-850 border border-surface-800"
            >
              <p className="text-surface-500 text-xs mb-1">{kpi.label}</p>
              <p className="text-white font-semibold text-lg">{kpi.value}</p>
              <p
                className={cn(
                  "text-xs mt-0.5",
                  kpi.up ? "text-success-500" : "text-danger-500"
                )}
              >
                {kpi.change}
              </p>
            </div>
          ))}
        </div>
        <div className="rounded-xl bg-surface-850 border border-surface-800 p-4 mb-4">
          <p className="text-surface-400 text-xs mb-3">
            Revenue Trend — Last 7 Days
          </p>
          <div className="flex items-end gap-2 h-24">
            {[65, 72, 58, 80, 74, 88, 92].map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-t-sm bg-gradient-to-t from-ezra-600 to-ezra-400"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
        </div>
        <div className="rounded-xl bg-surface-850 border border-surface-800 p-4">
          <p className="text-surface-400 text-xs mb-2">Active Alerts</p>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs">
              <div className="w-2 h-2 rounded-full bg-danger-500" />
              <span className="text-surface-300">
                Henderson — refund rate 340% above average
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className="w-2 h-2 rounded-full bg-warning-500" />
              <span className="text-surface-300">
                Scottsdale — overtime threshold exceeded
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className="w-2 h-2 rounded-full bg-success-500" />
              <span className="text-surface-300">
                Tempe — highest SRPH in portfolio ($142/hr)
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// ─── Module data — corrected accent colors per brand spec ─────────────────────

const modules = [
  {
    name: "Ezra Sales",
    description:
      "Unified revenue dashboards with daily metrics, goal tracking, and location-to-location benchmarking. See service vs. product splits, payment mix, and trend lines.",
    features: [
      "Revenue tracking",
      "Goal comparisons",
      "Location rankings",
      "Trend analysis",
    ],
    accent: "#06B6D4", // cyan — Sales module
    accentBg: "rgba(6,182,212,0.08)",
  },
  {
    icon: Shield,
    name: "Ezra LP",
    description:
      "AI anomaly detection for refunds, voids, and discounts. Risk scoring by employee and location with automated alerts for suspicious patterns.",
    features: [
      "Anomaly detection",
      "Risk scoring",
      "Automated alerts",
      "Pattern analysis",
    ],
    accent: "#6366F1", // indigo — LP module
    accentBg: "rgba(99,102,241,0.08)",
  },
  {
    icon: Calendar,
    name: "Ezra Scheduling",
    description:
      "Labor optimization powered by revenue-per-hour data. See idle time, peak periods, and get AI recommendations on shift adjustments.",
    features: [
      "Idle time detection",
      "SRPH tracking",
      "Shift recommendations",
      "Overtime monitoring",
    ],
    accent: "#34D399", // emerald — Scheduling module
    accentBg: "rgba(52,211,153,0.08)",
  },
  {
    icon: Rocket,
    name: "Ezra Exponential",
    description:
      "Client retention engine that replaces your CRM. Automated visit-frequency segmentation, SMS/email campaigns, and uptake rate tracking.",
    features: [
      "Client segmentation",
      "Automated campaigns",
      "Uptake tracking",
      "Retention scoring",
    ],
    accent: "#FB923C", // orange — Exponential module
    accentBg: "rgba(251,146,60,0.08)",
  },
];

const platformFeatures = [
  {
    title: "Executive Dashboard",
    description:
      "Portfolio-wide KPIs, revenue trends, and performance rankings at a glance. The first thing you see when you log in.",
  },
  {
    icon: MapPin,
    title: "Location Management",
    description:
      "Drill down into any location for detailed metrics, staff performance, and operational health. Compare side-by-side.",
  },
  {
    icon: FileText,
    title: "Automated Reports",
    description:
      "Daily, weekly, and monthly reports generated and delivered to your inbox. No manual data pulls required.",
  },
  {
    icon: Bell,
    title: "Smart Alerts",
    description:
      "Real-time notifications for anomalies, goal milestones, overtime thresholds, and retention risks. Only what matters.",
  },
  {
    icon: Lock,
    title: "Role-Based Access",
    description:
      "Franchisors see everything. Franchisees see their locations. Managers see their store. Everyone gets exactly what they need.",
  },
  {
    icon: RefreshCw,
    title: "Automated Data Sync",
    description:
      "Ezra syncs with your systems continuously. No manual imports, no stale data. Always up-to-date, always accurate.",
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PlatformPage() {
  return (
    <div
      className="min-h-screen"
      style={{
        background: "#09090b",
        color: "#FAFAFA",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,300;1,9..40,400&family=DM+Mono:wght@400;500&display=swap");
        *,
        *::before,
        *::after {
          box-sizing: border-box;
        }
        body {
          font-family: "DM Sans", sans-serif;
        }

        @keyframes float-up {
          from {
            opacity: 0;
            transform: translateY(24px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .reveal {
          animation: float-up 0.7s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        .reveal-1 {
          animation-delay: 0.1s;
        }
        .reveal-2 {
          animation-delay: 0.22s;
        }
        .reveal-3 {
          animation-delay: 0.34s;
        }

        @keyframes shimmer {
          0% {
            background-position: -200% center;
          }
          100% {
            background-position: 200% center;
          }
        }
        .shimmer-text {
          background: linear-gradient(
            90deg,
            #22d3ee 0%,
            #cffafe 30%,
            #06b6d4 55%,
            #cffafe 75%,
            #22d3ee 100%
          );
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          animation: shimmer 4.5s linear infinite;
        }

        .brand-grid {
          background-image: linear-gradient(
              rgba(6, 182, 212, 0.03) 1px,
              transparent 1px
            ),
            linear-gradient(90deg, rgba(6, 182, 212, 0.03) 1px, transparent 1px);
          background-size: 72px 72px;
        }

        .module-card {
          transition: border-color 0.25s ease, transform 0.25s ease;
        }
        .module-card:hover {
          transform: translateY(-2px);
        }

        .feature-card {
          transition: border-color 0.25s ease;
        }
      `}</style>

      <main className="pt-16">
        {/* ── Hero ── */}
        <section className="relative py-24 overflow-hidden">
          <div className="absolute inset-0 brand-grid opacity-50 pointer-events-none" />
          {/* Single restrained orb */}
          <div
            className="pointer-events-none absolute top-1/4 left-1/2 -translate-x-1/2 h-[500px] w-[900px] rounded-full"
            style={{
              background:
                "radial-gradient(closest-side, rgba(6,182,212,0.1) 0%, transparent 70%)",
              filter: "blur(60px)",
            }}
          />

          <div className="relative max-w-7xl mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
              {/* Eyebrow: DM Sans Medium, tracked, all-caps */}
              <div className="reveal inline-flex items-center gap-2 mb-8">
                <div
                  className="w-8 h-px rounded-full"
                  style={{ background: "#06B6D4" }}
                />
                <span
                  className="text-[10px] tracking-[0.22em] uppercase font-medium"
                  style={{ color: "#06B6D4" }}
                >
                  The Ezra Platform
                </span>
                <div
                  className="w-8 h-px rounded-full"
                  style={{ background: "#06B6D4" }}
                />
              </div>

              {/* Hero headline: DM Sans Light (300) */}
              <h1
                className="reveal reveal-1 text-balance"
                style={{
                  fontWeight: 300,
                  fontSize: "clamp(44px, 7vw, 84px)",
                  lineHeight: 0.98,
                  letterSpacing: "-0.035em",
                  color: "#FAFAFA",
                }}
              >
                Your entire franchise,{" "}
                <em className="shimmer-text not-italic">one login.</em>
              </h1>

              <p
                className="reveal reveal-2 mx-auto mt-8 max-w-xl text-pretty"
                style={{
                  fontSize: "16px",
                  color: "#71717A",
                  fontWeight: 400,
                  lineHeight: 1.55,
                }}
              >
                The Ezra portal gives franchise operators a single, unified
                command center for revenue, loss prevention, labor, and client
                retention — across every location.
              </p>
            </div>

            {/* Dashboard Preview — UNCHANGED */}
            <div className="reveal reveal-3 max-w-5xl mx-auto">
              <DashboardPreview />
            </div>
          </div>
        </section>

        {/* ── Four Modules ── */}
        <section
          className="py-24 border-y"
          style={{ background: "#141417", borderColor: "#27272A" }}
        >
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-14">
              <p
                className="text-[10px] tracking-[0.22em] uppercase font-medium mb-3"
                style={{ color: "#06B6D4" }}
              >
                Product Suite
              </p>
              {/* Section heading: DM Sans Regular -0.025em */}
              <h2
                style={{
                  fontWeight: 400,
                  fontSize: "clamp(26px, 4vw, 38px)",
                  letterSpacing: "-0.025em",
                  color: "#FAFAFA",
                }}
              >
                Four modules, one platform
              </h2>
              <p
                className="mt-3 max-w-lg mx-auto"
                style={{ fontSize: "15px", color: "#71717A", lineHeight: 1.6 }}
              >
                Every Ezra module lives inside a single portal. No switching
                between tools, no duplicate logins, no disconnected data.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              {modules.map((mod) => {
                const Icon = mod.icon;
                return (
                  <div
                    key={mod.name}
                    className="module-card p-8 rounded-2xl border"
                    style={{ background: "#09090b", borderColor: "#27272A" }}
                    onMouseEnter={(e) => {
                      (
                        e.currentTarget as HTMLElement
                      ).style.borderColor = `${mod.accent}40`;
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor =
                        "#27272A";
                    }}
                  >
                    <div className="flex items-start gap-4 mb-5">
                      <div>
                        {/* Card title: DM Sans Semibold (600) */}
                        <h3
                          style={{
                            fontSize: "17px",
                            fontWeight: 600,
                            color: "#FAFAFA",
                            marginBottom: "6px",
                          }}
                        >
                          {mod.name}
                        </h3>
                        <p
                          style={{
                            fontSize: "13px",
                            color: "#71717A",
                            lineHeight: 1.65,
                          }}
                        >
                          {mod.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {mod.features.map((f) => (
                        <span
                          key={f}
                          className="px-3 py-1 rounded-full text-[12px]"
                          style={{
                            background: mod.accentBg,
                            color: mod.accent,
                            border: `1px solid ${mod.accent}22`,
                          }}
                        >
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

        {/* ── Platform Features ── */}
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-14">
              <p
                className="text-[10px] tracking-[0.22em] uppercase font-medium mb-3"
                style={{ color: "#06B6D4" }}
              >
                Built-In Capabilities
              </p>
              <h2
                style={{
                  fontWeight: 400,
                  fontSize: "clamp(26px, 4vw, 38px)",
                  letterSpacing: "-0.025em",
                  color: "#FAFAFA",
                }}
              >
                Built for multi-unit operations
              </h2>
              <p
                className="mt-3 max-w-lg mx-auto"
                style={{ fontSize: "15px", color: "#71717A", lineHeight: 1.6 }}
              >
                Every feature in the platform is designed for operators managing
                3 to 200+ locations.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {platformFeatures.map((feature) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={feature.title}
                    className="feature-card p-6 rounded-xl border"
                    style={{ background: "#141417", borderColor: "#27272A" }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor =
                        "rgba(6,182,212,0.3)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor =
                        "#27272A";
                    }}
                  >
                    <h3
                      style={{
                        fontSize: "15px",
                        fontWeight: 600,
                        color: "#FAFAFA",
                        marginBottom: "6px",
                      }}
                    >
                      {feature.title}
                    </h3>
                    <p
                      style={{
                        fontSize: "13px",
                        color: "#71717A",
                        lineHeight: 1.65,
                      }}
                    >
                      {feature.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── Security Strip ── */}
        <section
          className="py-14 border-y"
          style={{ background: "#141417", borderColor: "#27272A" }}
        >
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row items-center gap-10">
              <div className="flex-1">
                <p
                  className="text-[10px] tracking-[0.22em] uppercase font-medium mb-2"
                  style={{ color: "#06B6D4" }}
                >
                  Security
                </p>
                <h3
                  style={{
                    fontSize: "clamp(20px, 3vw, 28px)",
                    fontWeight: 400,
                    letterSpacing: "-0.02em",
                    color: "#FAFAFA",
                    marginBottom: "10px",
                  }}
                >
                  Enterprise-grade security
                </h3>
                <p
                  style={{
                    fontSize: "14px",
                    color: "#71717A",
                    lineHeight: 1.7,
                    maxWidth: "480px",
                  }}
                >
                  Dedicated credentials per client, role-based access controls,
                  encrypted data in transit and at rest, and full audit trails
                  for every action.
                </p>
              </div>
              <div className="flex flex-wrap justify-center md:justify-start gap-5">
                {["SOC 2", "AES-256", "RBAC", "Audit Logs"].map((label) => (
                  <div key={label} className="text-center">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-2"
                      style={{
                        background: "rgba(6,182,212,0.08)",
                        border: "1px solid rgba(6,182,212,0.15)",
                      }}
                    >
                      <Lock className="w-5 h-5" style={{ color: "#06B6D4" }} />
                    </div>
                    {/* DM Mono for spec labels */}
                    <p
                      className="text-[11px]"
                      style={{
                        color: "#71717A",
                        fontFamily: "'DM Mono', monospace",
                      }}
                    >
                      {label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="relative py-32 overflow-hidden">
          <div className="absolute inset-0 brand-grid opacity-30 pointer-events-none" />

          <div className="relative max-w-7xl mx-auto px-6">
            <div className="max-w-[520px] mx-auto text-center">
              {/* Thin vertical accent */}
              <div
                className="w-px h-12 mx-auto mb-8"
                style={{
                  background:
                    "linear-gradient(to bottom, transparent, rgba(6,182,212,0.5))",
                }}
              />

              <h2
                style={{
                  fontWeight: 300,
                  fontSize: "clamp(28px, 5vw, 46px)",
                  letterSpacing: "-0.025em",
                  color: "#FAFAFA",
                  lineHeight: 1.08,
                  marginBottom: "16px",
                }}
              >
                See the platform in action
              </h2>
              <p
                style={{
                  fontSize: "15px",
                  color: "#71717A",
                  lineHeight: 1.85,
                  marginBottom: "40px",
                }}
              >
                Book a 20-minute walkthrough and we'll show you the exact portal
                your team would use — configured for your brand, your locations,
                your data.
              </p>

              <div className="flex flex-wrap justify-center gap-3">
                <Link
                  href="/contact"
                  className="group inline-flex items-center gap-2 px-7 py-3 rounded-xl no-underline font-semibold transition-all duration-200 hover:scale-[1.02]"
                  style={{
                    background: "linear-gradient(135deg, #22D3EE, #06B6D4)",
                    color: "#09090b",
                    fontSize: "13px",
                  }}
                >
                  Schedule a Demo
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 duration-200" />
                </Link>
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 px-7 py-3 rounded-xl no-underline border transition-all duration-200"
                  style={{
                    color: "#71717A",
                    borderColor: "#27272A",
                    fontSize: "13px",
                  }}
                >
                  Client Login
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
