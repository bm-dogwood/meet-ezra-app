"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import terrain from "@/assets/hero.jpeg";

// ─── Types ───────────────────────────────────────────────────────────────────

type ColorVariant = "cyan" | "indigo" | "emerald" | "orange";

interface Solution {
  id: string;
  index: string;
  tag: string;
  problem: string;
  headline: string;
  description: string;
  capabilities: string[];
  metric: string;
  metricLabel: string;
  color: ColorVariant;
}

// ─── Data ────────────────────────────────────────────────────────────────────

const solutions: Solution[] = [
  {
    id: "revenue-visibility",
    index: "01",
    tag: "Revenue Visibility",
    problem: "You're flying blind on revenue",
    headline: "Total Revenue\nVisibility",
    description:
      "Most franchise owners wait days or weeks for financial reports. Ezra gives you real-time revenue data from every location — normalized, compared, and trended — the moment it happens.",
    capabilities: [
      "Daily revenue tracking with automated goal comparisons",
      "Service vs. product revenue breakdown by location",
      "Payment mix analysis — know your cash vs. card split",
      "Trend analysis with rolling averages and forecasting",
      "Instant location-to-location benchmarking",
    ],
    metric: "$2.4M+",
    metricLabel: "Average annual revenue tracked per client",
    color: "cyan",
  },
  {
    id: "loss-prevention",
    index: "02",
    tag: "Loss Prevention",
    problem: "Shrinkage is eating your margins",
    headline: "AI-Powered Loss\nPrevention",
    description:
      "Internal shrinkage is the silent margin killer in franchise operations. Ezra LP monitors every transaction for anomalies — unusual refund patterns, discount abuse, suspicious voids.",
    capabilities: [
      "Automated refund and void pattern detection",
      "Employee risk scoring based on transaction behavior",
      "Discount abuse monitoring across locations",
      "Real-time alerts for high-severity anomalies",
      "Historical trend analysis to identify chronic issues",
    ],
    metric: "3.2%",
    metricLabel: "Average shrinkage reduction in first 90 days",
    color: "indigo",
  },
  {
    id: "labor-optimization",
    index: "03",
    tag: "Labor Optimization",
    problem: "Overstaffed when slow, short when busy",
    headline: "Intelligent Labor\nOptimization",
    description:
      "Labor is your biggest controllable expense. Ezra Scheduling analyzes revenue per labor hour across every time slot and location, surfacing recommendations to cut idle time and eliminate unnecessary overtime.",
    capabilities: [
      "Idle time detection — labor hours generating zero revenue",
      "Time-of-day traffic analysis with SRPH tracking",
      "AI shift recommendations based on actual demand patterns",
      "Overtime monitoring and redistribution alerts",
      "Location-by-location labor efficiency rankings",
    ],
    metric: "18%",
    metricLabel: "Average idle hour reduction across clients",
    color: "emerald",
  },
  {
    id: "client-retention",
    index: "04",
    tag: "Client Retention",
    problem: "Your clients are leaving and you don't know why",
    headline: "Automated Client\nRetention",
    description:
      "Traditional CRMs weren't built for franchise operations. Ezra Exponential replaces generic tools with industry-specific retention automation — segmenting guests, triggering re-engagement campaigns, measuring exactly what works.",
    capabilities: [
      "Replaces generic CRMs with franchise-specific workflows",
      "Automated visit-frequency bucketing (4, 6, 8-week segments)",
      "Personalized SMS and email re-engagement campaigns",
      "Uptake rate tracking — know which offers actually work",
      "Retention risk scoring to catch clients before they leave",
    ],
    metric: "24%",
    metricLabel: "Average increase in rebooking rates",
    color: "orange",
  },
];

const painPoints = [
  "No real-time revenue visibility",
  "Unexplained margin erosion",
  "Labor costs eating profits",
  "Clients leaving silently",
  "No location benchmarking",
  "CRMs built for the wrong industry",
];

const posPartners = [
  "Zenoti",
  "Stripe",
  "Toast",
  "Square",
  "Clover",
  "Aloha",
  "Revel",
];

// ─── Brand color map (from brand reference PDF) ───────────────────────────────
// Primary: #06B6D4 (cyan-500)
// Sales/Revenue: cyan  |  LP: #6366F1 indigo  |  Scheduling: #34D399 emerald  |  Exponential: #FB923C orange

const colorMap: Record<
  ColorVariant,
  {
    accent: string;

    pillBg: string;
    pillText: string;
    pillBorder: string;
  }
> = {
  cyan: {
    accent: "#06B6D4",

    pillBg: "rgba(6,182,212,0.08)",
    pillText: "#22D3EE",
    pillBorder: "rgba(6,182,212,0.22)",
  },
  indigo: {
    accent: "#6366F1",

    pillBg: "rgba(99,102,241,0.08)",
    pillText: "#818CF8",
    pillBorder: "rgba(99,102,241,0.22)",
  },
  emerald: {
    accent: "#34D399",

    pillBg: "rgba(52,211,153,0.08)",
    pillText: "#34D399",
    pillBorder: "rgba(52,211,153,0.22)",
  },
  orange: {
    accent: "#FB923C",

    pillBg: "rgba(251,146,60,0.08)",
    pillText: "#FB923C",
    pillBorder: "rgba(251,146,60,0.22)",
  },
};

// ─── Scroll Reveal ────────────────────────────────────────────────────────────

const useScrollReveal = () => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("is-visible");
        }),
      { threshold: 0.08, rootMargin: "0px 0px -80px 0px" }
    );
    document
      .querySelectorAll(".scroll-reveal")
      .forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
};

// ─── Header ──────────────────────────────────────────────────────────────────

const Header = () => (
  <header className="fixed top-0 left-0 right-0 z-50 h-16 flex items-center border-b border-white/[0.05] bg-[#09090b]/90 backdrop-blur-2xl">
    <div className="max-w-[1360px] w-full mx-auto px-8 flex items-center justify-between">
      {/* Logomark: always cyan gradient, wordmark DM Sans Semibold */}
      <Link href="/" className="flex items-center gap-2.5 no-underline group">
        <div
          className="w-7 h-7 rounded-[7px] flex items-center justify-center text-[13px] font-bold text-white transition-transform group-hover:scale-105"
          style={{ background: "linear-gradient(135deg, #22D3EE, #06B6D4)" }}
        >
          E
        </div>
        <span
          className="text-[17px] tracking-[0.18em] uppercase text-white"
          style={{ fontWeight: 600, letterSpacing: "0.18em" }}
        >
          Ezra
        </span>
      </Link>

      <nav className="hidden md:flex items-center gap-7">
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
            className="text-[13px] font-medium transition-all duration-200 no-underline"
            style={{
              color: href === "/solutions" ? "#06B6D4" : "#71717A",
              fontWeight: href === "/solutions" ? 600 : 400,
            }}
          >
            {label}
          </Link>
        ))}
      </nav>

      <div className="hidden md:flex items-center gap-3">
        <Link
          href="/login"
          className="text-[13px] font-medium px-4 py-2 rounded-lg transition-all duration-200 no-underline"
          style={{ color: "#71717A" }}
        >
          Sign In
        </Link>
        <Link
          href="/contact"
          className="text-[13px] font-semibold text-[#09090b] px-5 py-2 rounded-lg tracking-tight transition-all duration-200 no-underline"
          style={{ background: "linear-gradient(135deg, #22D3EE, #06B6D4)" }}
        >
          Request Demo
        </Link>
      </div>
    </div>
  </header>
);

// ─── Footer ───────────────────────────────────────────────────────────────────

const Footer = () => (
  <footer className="py-10 border-t border-white/[0.05] bg-[#09090b]">
    <div className="max-w-[1360px] mx-auto px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div
          className="w-7 h-7 rounded-[7px] flex items-center justify-center text-[13px] font-bold text-white"
          style={{ background: "linear-gradient(135deg, #22D3EE, #06B6D4)" }}
        >
          E
        </div>
        <span className="text-[12px]" style={{ color: "#3F3F46" }}>
          © 2026 Ezra AI. All rights reserved.
        </span>
      </div>
      <div className="flex gap-6">
        {["Privacy Policy", "Terms of Service"].map((t) => (
          <Link
            key={t}
            href="#"
            className="text-[12px] no-underline transition-colors duration-200 hover:text-[#06B6D4]"
            style={{ color: "#3F3F46" }}
          >
            {t}
          </Link>
        ))}
      </div>
    </div>
  </footer>
);

// ─── Solution Block ───────────────────────────────────────────────────────────

const SolutionBlock = ({
  solution,
  index,
}: {
  solution: Solution;
  index: number;
}) => {
  const c = colorMap[solution.color];
  const flip = index % 2 !== 0;

  return (
    <div
      className="scroll-reveal opacity-0 translate-y-10 transition-all duration-700 ease-out border-b py-28"
      style={{ borderColor: "#27272A" }}
    >
      <div className="max-w-[1360px] mx-auto px-8">
        <div
          className={`grid lg:grid-cols-[1fr_1fr] gap-20 items-center ${
            flip ? "lg:[direction:rtl]" : ""
          }`}
        >
          {/* Text Side */}
          <div className={flip ? "[direction:ltr]" : ""}>
            {/* Index + Tag */}
            <div className="flex items-center gap-3 mb-6">
              <span
                className="text-[11px] tracking-[0.18em] uppercase font-bold"
                style={{ color: "#3F3F46" }}
              >
                {solution.index}
              </span>
              <span className="w-5 h-px" style={{ background: "#27272A" }} />
              <span
                className="text-[11px] tracking-[0.12em] uppercase font-medium px-2.5 py-1 rounded-full border"
                style={{
                  background: c.pillBg,
                  color: c.pillText,
                  borderColor: c.pillBorder,
                }}
              >
                {solution.tag}
              </span>
            </div>

            {/* Problem Quote */}
            <div className="mb-5 flex items-start gap-3">
              <span
                className="text-[28px] leading-none mt-[-4px] font-serif"
                style={{ color: "rgba(239,68,68,0.5)" }}
              >
                "
              </span>
              <p
                className="text-[15px] italic leading-relaxed"
                style={{ color: "#71717A" }}
              >
                {solution.problem}"
              </p>
            </div>

            {/* Headline — DM Sans Light, editorial scale */}
            <h2
              className="text-[clamp(30px,4vw,46px)] leading-[1.08] tracking-[-0.035em] mb-5 whitespace-pre-line"
              style={{ fontWeight: 300, color: "#FAFAFA" }}
            >
              {solution.headline}
            </h2>

            <p
              className="text-[15px] leading-[1.85] mb-8 max-w-[460px]"
              style={{ color: "#71717A" }}
            >
              {solution.description}
            </p>

            <Link
              href="/contact"
              className="group inline-flex items-center gap-2 text-[13px] font-medium no-underline transition-all duration-200"
              style={{ color: c.accent }}
            >
              See How It Works
              <ArrowUpRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>

          {/* Card Side */}
          <div className={flip ? "[direction:ltr]" : ""}>
            <div
              className="relative rounded-2xl border p-8 transition-all duration-500 hover:-translate-y-1 overflow-hidden"
              style={{
                background: "#141417",
                borderColor: "#27272A",
              }}
            >
              {/* Hairline corner accent */}
              <div
                className="absolute top-0 right-0 w-24 h-24 pointer-events-none"
                style={{
                  background: `radial-gradient(circle at top right, ${c.accent}12 0%, transparent 70%)`,
                }}
              />

              {/* Header row */}
              <div
                className="flex items-center justify-between mb-7 pb-5 border-b"
                style={{ borderColor: "#27272A" }}
              >
                <div className="flex items-center gap-2.5">
                  {/* Eyebrow label: DM Sans Medium, uppercase, tracked */}
                  <span
                    className="text-[10px] tracking-[0.18em] uppercase font-medium"
                    style={{ color: "#3F3F46" }}
                  >
                    Capabilities
                  </span>
                </div>
                {/* Numeric spec: DM Mono */}
                <span
                  className="text-[11px]"
                  style={{
                    color: "#3F3F46",
                    fontFamily: "'DM Mono', monospace",
                  }}
                >
                  {solution.index} / 04
                </span>
              </div>

              {/* Capabilities */}
              <ul className="flex flex-col gap-3.5 mb-8">
                {solution.capabilities.map((cap) => (
                  <li
                    key={cap}
                    className="flex items-start gap-3 text-[14px] leading-[1.6]"
                    style={{ color: "#71717A" }}
                  >
                    <span
                      className="mt-[3px] shrink-0 text-[10px]"
                      style={{ color: c.accent }}
                    >
                      ◆
                    </span>
                    {cap}
                  </li>
                ))}
              </ul>

              {/* Metric — DM Mono for the number */}
              <div
                className="rounded-xl border p-5 flex items-center justify-between"
                style={{ background: "#09090b", borderColor: "#27272A" }}
              >
                <div>
                  <p
                    className="text-[38px] leading-none mb-1 tracking-[-0.04em]"
                    style={{
                      color: c.accent,
                      fontFamily: "'DM Mono', monospace",
                      fontWeight: 400,
                    }}
                  >
                    {solution.metric}
                  </p>
                  <p
                    className="text-[12px] max-w-[200px]"
                    style={{ color: "#3F3F46" }}
                  >
                    {solution.metricLabel}
                  </p>
                </div>
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                  style={{
                    background: `${c.accent}10`,
                    border: `1px solid ${c.accent}22`,
                  }}
                >
                  <span className="text-base" style={{ color: c.accent }}>
                    ↑
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SolutionsPage() {
  useScrollReveal();

  return (
    <>
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

        .scroll-reveal {
          will-change: opacity, transform;
        }
        .scroll-reveal.is-visible {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }

        @keyframes float-up {
          0% {
            opacity: 0;
            transform: translateY(28px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .reveal {
          animation: float-up 0.7s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        .reveal-delay-1 {
          animation-delay: 0.1s;
        }
        .reveal-delay-2 {
          animation-delay: 0.22s;
        }

        /* Brand grid — subtle, non-animated to stay restrained */

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
      `}</style>

      <div
        className="min-h-screen"
        style={{
          background: "#09090b",
          color: "#FAFAFA",
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        <main className="pt-16">
          {/* ── Hero ── */}
          <section
            className="relative isolate overflow-hidden pt-24 pb-20 lg:pt-36 lg:pb-28"
            style={{ maxHeight: "70vh" }}
          >
            <div className="pointer-events-none absolute inset-0 -z-10">
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(9,9,11,0.5) 0%, transparent 45%, #09090b 100%)",
                }}
              />
            </div>

            <div className="relative mx-auto max-w-[1100px] px-6 text-center lg:px-10">
              {/* Hero headline: DM Sans Light (300), editorial scale */}

              <h1
                className="reveal reveal-delay-1 mx-auto max-w-[16ch] leading-[0.98] tracking-[-0.035em] text-balance"
                style={{
                  fontWeight: 300,
                  fontSize: "clamp(48px, 8vw, 96px)",
                  color: "#FAFAFA",
                }}
              >
                Every problem you face,{" "}
                <em className="shimmer-text not-italic">Ezra solves.</em>
              </h1>

              <p
                className="reveal reveal-delay-2 mx-auto mt-8 max-w-xl text-pretty leading-relaxed"
                style={{
                  fontSize: "16px",
                  color: "#71717A",
                  fontWeight: 400,
                  lineHeight: 1.55,
                }}
              >
                Multi-unit franchises juggle revenue tracking, loss prevention,
                staffing, and retention — usually across disconnected tools.
                Ezra brings it all into one intelligent platform.
              </p>

              {/* Minimal divider — hairline, restrained */}
              <div className="reveal reveal-delay-2 mx-auto mt-10 flex items-center gap-4 justify-center">
                <div
                  className="h-px w-16"
                  style={{
                    background:
                      "linear-gradient(to right, transparent, rgba(6,182,212,0.4))",
                  }}
                />
                <div className="flex gap-1.5">
                  {[0, 1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="h-1 w-1 rounded-full"
                      style={{ background: "rgba(6,182,212,0.5)" }}
                    />
                  ))}
                </div>
                <div
                  className="h-px w-16"
                  style={{
                    background:
                      "linear-gradient(to left, transparent, rgba(6,182,212,0.4))",
                  }}
                />
              </div>
            </div>
          </section>

          {/* ── Pain Bar ── */}
          <section
            className="py-10 border-b"
            style={{ background: "#141417", borderColor: "#27272A" }}
          >
            <div className="max-w-[1360px] mx-auto px-8">
              {/* Eyebrow label: DM Sans Medium, all-caps, tracked */}
              <p
                className="text-[10px] tracking-[0.22em] uppercase font-medium mb-5"
                style={{ color: "#3F3F46" }}
              >
                Sound familiar?
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-x-8 gap-y-3">
                {painPoints.map((pt) => (
                  <div
                    key={pt}
                    className="flex items-center gap-2.5 group cursor-default"
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full shrink-0 transition-colors duration-200"
                      style={{ background: "rgba(239,68,68,0.55)" }}
                    />
                    <span
                      className="text-[13px] leading-snug transition-colors duration-200 group-hover:text-[#A1A1AA]"
                      style={{ color: "#3F3F46", fontWeight: 400 }}
                    >
                      {pt}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── Solution Blocks ── */}
          <div>
            {solutions.map((s, i) => (
              <SolutionBlock key={s.id} solution={s} index={i} />
            ))}
          </div>

          {/* ── POS Integration ── */}
          <section
            className="py-24 border-b"
            style={{ background: "#141417", borderColor: "#27272A" }}
          >
            <div className="max-w-[1360px] mx-auto px-8 scroll-reveal opacity-0 translate-y-10 transition-all duration-700">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10">
                <div className="max-w-[420px]">
                  {/* Eyebrow */}
                  <p
                    className="text-[10px] tracking-[0.22em] uppercase font-medium mb-3"
                    style={{ color: "#06B6D4" }}
                  >
                    Integrations
                  </p>
                  {/* Section heading: DM Sans Regular, -0.025em */}
                  <h2
                    className="mb-3 leading-[1.15] tracking-[-0.025em]"
                    style={{
                      fontWeight: 400,
                      fontSize: "clamp(22px, 3.5vw, 34px)",
                      color: "#FAFAFA",
                    }}
                  >
                    Works with your existing POS
                  </h2>
                  <p
                    className="text-[14px] leading-[1.8]"
                    style={{ color: "#71717A" }}
                  >
                    Ezra doesn't replace your POS — it connects to it. Our
                    automation layer extracts data from any system, with or
                    without an API.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {posPartners.map((pos) => (
                    <span
                      key={pos}
                      className="text-[13px] font-medium rounded-lg px-5 py-2.5 border transition-all duration-200 cursor-default hover:-translate-y-0.5"
                      style={{
                        color: "#71717A",
                        background: "#09090b",
                        borderColor: "#27272A",
                      }}
                      onMouseEnter={(e) => {
                        (e.target as HTMLElement).style.borderColor =
                          "rgba(6,182,212,0.35)";
                        (e.target as HTMLElement).style.color = "#06B6D4";
                      }}
                      onMouseLeave={(e) => {
                        (e.target as HTMLElement).style.borderColor = "#27272A";
                        (e.target as HTMLElement).style.color = "#71717A";
                      }}
                    >
                      {pos}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ── CTA ── */}
          <section className="relative py-32 overflow-hidden">
            <div className="absolute inset-0 pointer-events-none brand-grid opacity-40" />

            <div className="relative max-w-[1360px] mx-auto px-8 scroll-reveal opacity-0 translate-y-10 transition-all duration-700">
              <div className="max-w-[520px] mx-auto text-center">
                {/* Thin vertical accent line */}
                <div
                  className="w-px h-12 mx-auto mb-8"
                  style={{
                    background:
                      "linear-gradient(to bottom, transparent, rgba(6,182,212,0.5))",
                  }}
                />

                <h2
                  className="leading-[1.08] tracking-[-0.025em] mb-4"
                  style={{
                    fontWeight: 300,
                    fontSize: "clamp(28px, 5vw, 46px)",
                    color: "#FAFAFA",
                  }}
                >
                  Ready to see the difference?
                </h2>
                <p
                  className="text-[15px] mb-10 leading-[1.85]"
                  style={{ color: "#71717A" }}
                >
                  Every Ezra implementation is custom-configured for your
                  franchise. Tell us what you're dealing with and we'll show you
                  exactly how we fix it.
                </p>

                <div className="flex justify-center gap-3 flex-wrap">
                  <Link
                    href="/contact"
                    className="group inline-flex items-center gap-2 text-[13px] font-semibold px-7 py-3 rounded-xl no-underline transition-all duration-200 hover:scale-[1.02]"
                    style={{
                      background: "linear-gradient(135deg, #22D3EE, #06B6D4)",
                      color: "#09090b",
                    }}
                  >
                    Talk to Our Team
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 duration-200" />
                  </Link>
                  <Link
                    href="/platform"
                    className="inline-flex items-center gap-2 text-[13px] border px-7 py-3 rounded-xl no-underline transition-all duration-200"
                    style={{ color: "#71717A", borderColor: "#27272A" }}
                  >
                    See the Platform
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
