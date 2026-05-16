import { Metadata } from "next";
import Link from "next/link";
import { DM_Sans } from "next/font/google";
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
} from "lucide-react";
import Header from "@/components/site/Header";

import terrain from "@/assets/hero.jpeg";
import ctaImage from "@/assets/cta.jpeg";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-dm-sans",
});

export const metadata: Metadata = {
  title: "Ezra Sales — Real-time Franchise Sales Intelligence",
  description:
    "One dashboard, any POS system, complete visibility. Ezra Sales unifies revenue across all your franchise locations in near real-time.",
};

// Sales module accent: CYAN
const ACCENT = {
  primary: "#06B6D4",
  light: "#22D3EE",
  muted: "rgba(6, 182, 212, 0.1)",
  border: "rgba(6, 182, 212, 0.3)",
  text: "#22D3EE",
  gradient: "from-cyan-500 to-cyan-400",
};

const metrics = [
  { label: "Daily Revenue", value: "Real-time" },
  { label: "Locations Supported", value: "200+" },
  { label: "POS Systems", value: "5+" },
  { label: "Data Freshness", value: "< 15 min" },
];

const features = [
  {
    icon: BarChart3,
    title: "Unified Dashboards",
    description:
      "See all your locations on one screen. Compare performance, identify trends, and drill down to individual stores.",
  },
  {
    icon: Globe,
    title: "Universal POS Support",
    description:
      "Zenoti, Stripe, Toast, Square—Ezra Sales works with any POS system through APIs or intelligent automation.",
  },
  {
    icon: TrendingUp,
    title: "Goal Tracking",
    description:
      "Set revenue goals per location and track real-time progress. Get alerted when stores fall behind.",
  },
  {
    icon: Clock,
    title: "Near Real-Time Data",
    description:
      "Data syncs automatically throughout the day. Most locations see data within 15 minutes of transactions.",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description:
      "Role-based access control, audit logging, and brand isolation. Your data stays yours.",
  },
  {
    icon: Zap,
    title: "AI Insights",
    description:
      "Automated anomaly detection highlights issues before they become problems. Let AI do the monitoring.",
  },
];

const posSystems = [
  { name: "Zenoti", method: "Secure Automation", status: "Active" },
  { name: "Stripe", method: "Direct API", status: "Active" },
  { name: "Toast", method: "API Integration", status: "Coming Soon" },
  { name: "Square", method: "API Integration", status: "Planned" },
  { name: "Clover", method: "API Integration", status: "Planned" },
];

const dataFields = [
  "Total Revenue (daily, weekly, monthly)",
  "Service Revenue vs Product Revenue",
  "Guest Count & Ticket Count",
  "Average Ticket Value",
  "Tips by Service Provider",
  "Cash vs Card Revenue",
  "Refunds & Discounts",
  "Goal Tracking & Variance",
];

const sampleSchema = `{
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
}`;

function statusStyles(status: string) {
  if (status === "Active")
    return "border-cyan-500/30 bg-cyan-500/10 text-cyan-400";
  if (status === "Coming Soon")
    return "border-yellow-500/30 bg-yellow-500/10 text-yellow-400";
  return "border-zinc-700 bg-zinc-800/40 text-zinc-400";
}

export default function EzraSalesPage() {
  return (
    <div
      className={`${dmSans.variable} min-h-screen bg-[#09090B] font-sans text-[#FAFAFA] antialiased`}
    >
      <Header />

      <main className="pt-16">
        {/* Hero */}
        <section className="relative isolate overflow-hidden pt-24 pb-20 lg:pt-32 lg:pb-28">
          <div className="pointer-events-none absolute inset-0 -z-10">
            <img
              src={terrain.src}
              alt=""
              className="h-full w-full object-cover object-center opacity-30 brightness-[0.7] contrast-[1.1] saturate-[0.8]"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#09090B] via-transparent to-[#09090B]" />
          </div>

          <div className="relative mx-auto max-w-[1200px] px-6 lg:px-10">
            <div className="animate-fade-up mb-8 inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/5 px-3 py-1.5">
              <ShoppingCart className="h-3.5 w-3.5 text-cyan-400" />
              <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-cyan-400/80">
                Sales Intelligence Bot
              </span>
            </div>

            <h1 className="animate-fade-up animation-delay-100 max-w-[14ch] text-[64px] font-semibold leading-[0.95] tracking-[-0.02em] text-balance md:text-[96px] lg:text-[120px]">
              Ezra <span className="italic text-cyan-400">Sales.</span>
            </h1>

            <p className="animate-fade-up animation-delay-200 mt-8 max-w-2xl text-[18px] leading-relaxed text-zinc-400">
              Real-time sales intelligence across all your franchise locations.
              One dashboard, any POS system, complete visibility.
            </p>

            <div className="animate-fade-up animation-delay-300 mt-10 flex flex-wrap items-center gap-3">
              <a
                href="#demo"
                className="group inline-flex items-center gap-2 rounded-full bg-cyan-500 px-5 py-2.5 text-[13px] font-medium text-black transition-all hover:bg-cyan-400"
              >
                Request a Demo
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </a>
              <Link
                href="/bots"
                className="inline-flex items-center gap-2 rounded-full border border-cyan-500/50 px-5 py-2.5 text-[13px] text-cyan-400 transition-colors hover:bg-cyan-500/10"
              >
                View All Bots
              </Link>
            </div>

            <div className="animate-fade-up animation-delay-400 mt-16 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-zinc-800 bg-zinc-800/50 md:grid-cols-4">
              {metrics.map((m) => (
                <div key={m.label} className="bg-[#141417] p-6">
                  <div className="text-[28px] font-medium leading-tight text-white md:text-[32px]">
                    {m.value}
                  </div>
                  <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-500">
                    {m.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* POS Systems */}
        <section className="border-t border-zinc-800 py-20 lg:py-24">
          <div className="mx-auto max-w-[1200px] px-6 lg:px-10">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-[40px] font-medium leading-tight tracking-tight text-white md:text-[56px]">
                Universal POS Integration
              </h2>
              <p className="mt-4 text-[15px] leading-relaxed text-zinc-400">
                Ezra Sales is POS-agnostic. We connect to your existing
                system—no migration required.
              </p>
            </div>

            <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {posSystems.map((pos) => (
                <div
                  key={pos.name}
                  className="rounded-xl border border-zinc-800 bg-[#141417] p-6 transition-colors hover:border-cyan-500/40"
                >
                  <div className="grid h-10 w-10 place-items-center rounded-lg border border-cyan-500/30 bg-cyan-500/10 font-mono text-[16px] text-cyan-400">
                    {pos.name[0]}
                  </div>
                  <p className="mt-4 text-[20px] font-medium text-white">
                    {pos.name}
                  </p>
                  <p className="mt-1 text-[12px] text-zinc-500">{pos.method}</p>
                  <span
                    className={`mt-4 inline-flex items-center rounded-full border px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider ${statusStyles(
                      pos.status
                    )}`}
                  >
                    {pos.status}
                  </span>
                </div>
              ))}
            </div>

            <p className="mt-10 text-center text-[13px] text-zinc-500">
              Don't see your POS?{" "}
              <a
                href="#demo"
                className="text-cyan-400 underline-offset-4 hover:underline"
              >
                Contact us
              </a>{" "}
              — we're adding new integrations regularly.
            </p>
          </div>
        </section>

        {/* Features */}
        <section className="border-t border-zinc-800 py-20 lg:py-28">
          <div className="mx-auto max-w-[1200px] px-6 lg:px-10">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-[40px] font-medium leading-tight tracking-tight text-white md:text-[56px]">
                Everything You Need
              </h2>
              <p className="mt-4 text-[15px] leading-relaxed text-zinc-400">
                Ezra Sales gives you complete visibility into your franchise
                performance.
              </p>
            </div>

            <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {features.map((f) => {
                const Icon = f.icon;
                return (
                  <div
                    key={f.title}
                    className="group rounded-xl border border-zinc-800 bg-[#141417] p-7 transition-colors hover:border-cyan-500/40"
                  >
                    <div className="grid h-11 w-11 place-items-center rounded-lg border border-cyan-500/30 bg-cyan-500/10 text-cyan-400">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="mt-5 text-[22px] font-medium leading-tight text-white">
                      {f.title}
                    </h3>
                    <p className="mt-2.5 text-[14px] leading-relaxed text-zinc-400">
                      {f.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Data model */}
        <section className="border-t border-zinc-800 py-20 lg:py-28">
          <div className="mx-auto max-w-[1200px] px-6 lg:px-10">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
              <div>
                <h2 className="text-[40px] font-medium leading-tight tracking-tight text-white md:text-[52px]">
                  Comprehensive Data Model
                </h2>
                <p className="mt-4 text-[15px] leading-relaxed text-zinc-400">
                  Every metric you need, normalized from any POS system into a
                  consistent schema.
                </p>
                <ul className="mt-8 space-y-3">
                  {dataFields.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2.5 text-[14px] text-white/90"
                    >
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-cyan-400" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">
                  Sample Data Schema
                </p>
                <pre className="overflow-x-auto rounded-xl border border-zinc-800 bg-black/40 p-6 font-mono text-[12.5px] leading-relaxed text-white/80">
                  {sampleSchema}
                </pre>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="relative isolate overflow-hidden border-t border-zinc-800 py-28 lg:py-36">
          <div className="pointer-events-none absolute inset-0 -z-10">
            <img
              src={ctaImage.src}
              alt=""
              className="h-full w-full object-cover object-center opacity-20 brightness-[0.6] saturate-[0.7]"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#09090B] via-transparent to-[#09090B]" />
            <div className="absolute inset-0 opacity-30 bg-radial-gradient from-cyan-500 via-transparent to-transparent" />
          </div>

          <div className="relative mx-auto max-w-[1100px] px-6 text-center lg:px-10">
            <h2 className="mx-auto max-w-[20ch] text-[44px] font-medium leading-[1.02] tracking-[-0.02em] text-balance text-white md:text-[64px] lg:text-[76px]">
              Ready to transform your sales{" "}
              <span className="italic text-cyan-400">visibility?</span>
            </h2>
            <p className="mx-auto mt-8 max-w-xl text-pretty text-[16px] leading-relaxed text-zinc-400">
              Ezra Sales is custom-configured for each client. Let's talk about
              how we can connect to your POS system and get you real-time
              insights.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <a
                href="#demo"
                className="inline-flex items-center gap-2 rounded-full bg-cyan-500 px-6 py-3 text-[14px] font-medium text-black transition-all hover:bg-cyan-400"
              >
                Schedule a Demo <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
