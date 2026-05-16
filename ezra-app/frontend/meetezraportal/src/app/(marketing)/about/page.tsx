"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  Building2,
  Users,
  Briefcase,
  Target,
  Shield,
  Zap,
  Cpu,
  ChevronRight,
  Star,
} from "lucide-react";
import terrain from "@/assets/hero.jpeg";

// ─── Brand tokens (from brand reference PDF, V2 May 2026) ──────────────────
// Primary accent: #06B6D4 (cyan-500) / hover: #22D3EE (cyan-400)
// Page bg: #09090B | Card surface: #141417 | Dark border: #27272A
// Text primary: #FAFAFA | Secondary: #71717A | Tertiary/meta: #3F3F46
// Typography: DM Sans 300/400/500/600/700 | DM Mono 400/500 (code & numbers only)

const Footer = () => (
  <footer
    className="py-10 border-t"
    style={{ background: "#09090b", borderColor: "#27272A" }}
  >
    <div className="max-w-[1200px] mx-auto px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div
          className="w-7 h-7 rounded-[7px] flex items-center justify-center text-sm font-semibold text-[#09090b]"
          style={{ background: "linear-gradient(135deg, #22D3EE, #06B6D4)" }}
        >
          E
        </div>
        <span className="text-[12px]" style={{ color: "#3F3F46" }}>
          © 2026 Ezra AI. All rights reserved.
        </span>
      </div>
      <div className="flex gap-6">
        {["/privacy", "/terms"].map((href, i) => (
          <Link
            key={href}
            href={href}
            className="text-[12px] no-underline transition-colors duration-200"
            style={{ color: "#3F3F46" }}
          >
            {i === 0 ? "Privacy Policy" : "Terms of Service"}
          </Link>
        ))}
      </div>
    </div>
  </footer>
);

// ─── Animated Stat ────────────────────────────────────────────────────────────

const AnimatedStat = ({
  value,
  label,
  suffix = "",
}: {
  value: string;
  label: string;
  suffix?: string;
}) => {
  const [count, setCount] = React.useState(0);
  const target = parseInt(value) || 0;

  React.useEffect(() => {
    const steps = 60;
    const stepValue = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += stepValue;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else setCount(Math.floor(current));
    }, 2000 / steps);
    return () => clearInterval(timer);
  }, [target]);

  const display = value.includes("days")
    ? `${count} days`
    : value.includes(".")
    ? `$${count.toLocaleString()}`
    : count.toString();

  return (
    <div
      className="px-8 py-8 text-center group"
      style={{ background: "#141417" }}
    >
      {/* DM Mono for numeric spec */}
      <p
        className="text-[36px] font-normal leading-none mb-1"
        style={{ fontFamily: "'DM Mono', monospace", color: "#06B6D4" }}
      >
        {display}
        {suffix}
      </p>
      <p
        className="text-[10px] tracking-[0.12em] uppercase font-medium"
        style={{ color: "#3F3F46" }}
      >
        {label}
      </p>
    </div>
  );
};

// ─── Data ─────────────────────────────────────────────────────────────────────

const audiences = [
  {
    icon: Building2,
    title: "Franchisors",
    description:
      "Corporate teams who need visibility across hundreds of locations. Track brand-wide performance, identify underperformers, and ensure operational consistency.",
  },
  {
    icon: Briefcase,
    title: "Franchisees",
    description:
      "Multi-unit operators managing 3–50+ locations. Get unified dashboards that work regardless of which POS systems individual locations use.",
  },
  {
    icon: Users,
    title: "District & Regional Managers",
    description:
      "Operations leaders responsible for geographic territories. Monitor real-time performance, receive alerts, and identify coaching opportunities.",
  },
  {
    icon: Target,
    title: "Store Managers",
    description:
      "Front-line leaders who need daily metrics at a glance. Track goals, review trends, and understand performance in context.",
  },
];

const approachSteps = [
  {
    n: "01",
    title: "Managed Service",
    body: "Not self-serve SaaS. We handle setup, configuration, and ongoing maintenance.",
    icon: Shield,
  },
  {
    n: "02",
    title: "Per-Brand Customization",
    body: "Every dashboard is configured for your specific brand, metrics, and goals.",
    icon: Zap,
  },
  {
    n: "03",
    title: "White-Glove Onboarding",
    body: "Our team works directly with yours to ensure successful implementation.",
  },
];

const features = [
  {
    title: "Real-time Analytics",
    description:
      "Get instant insights across all your locations with live data feeds.",
    icon: Cpu,
  },
  {
    title: "POS Agnostic",
    description:
      "Works with any POS system — API or no API, we've got you covered.",
    icon: Shield,
  },
  {
    title: "Predictive Insights",
    description: "AI-powered forecasts that help you stay ahead of trends.",
    icon: Zap,
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AboutPage() {
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

      <main className="pt-16">
        {/* ── Hero ── */}
        <section className="relative isolate overflow-hidden pt-24 pb-20 lg:pt-36 lg:pb-28">
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
            {/* Eyebrow */}
            <div className="reveal mb-8 inline-flex items-center gap-2">
              <span
                className="text-[10px] tracking-[0.22em] uppercase font-medium"
                style={{ color: "#06B6D4" }}
              >
                Purpose-Built AI Solutions
              </span>
            </div>

            {/* Hero headline: DM Sans Light (300), -0.035em tracking, editorial */}
            <h1
              className="reveal reveal-1 mx-auto max-w-[16ch] text-balance"
              style={{
                fontWeight: 300,
                fontSize: "clamp(48px, 8vw, 96px)",
                lineHeight: 0.98,
                letterSpacing: "-0.035em",
                color: "#FAFAFA",
              }}
            >
              Built for the way{" "}
              <em className="shimmer-text not-italic">
                franchises actually run.
              </em>
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
              Each Ezra product is designed to solve a specific operational
              challenge. Customized for your brand, configured to your needs.
            </p>
          </div>
        </section>

        {/* ── Why We Built Ezra ── */}
        <section
          className="py-28 border-b"
          style={{ background: "#141417", borderColor: "#27272A" }}
        >
          <div className="max-w-[1200px] mx-auto px-8">
            <div className="grid lg:grid-cols-2 gap-20 items-start">
              {/* Left */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div
                    className="w-8 h-px rounded-full"
                    style={{ background: "#06B6D4" }}
                  />
                  {/* Eyebrow: DM Sans Medium, tracked, all-caps */}
                  <p
                    className="text-[10px] tracking-[0.22em] uppercase font-medium"
                    style={{ color: "#06B6D4" }}
                  >
                    Our Origin
                  </p>
                </div>
                {/* Section heading: DM Sans Regular, -0.025em */}
                <h2
                  className="mb-8 tracking-[-0.025em] leading-[1.2]"
                  style={{
                    fontWeight: 400,
                    fontSize: "clamp(28px, 4vw, 40px)",
                    color: "#FAFAFA",
                  }}
                >
                  Why We Built <span className="shimmer-text">Ezra</span>
                </h2>
                <div
                  className="flex flex-col gap-5"
                  style={{
                    fontSize: "15px",
                    color: "#71717A",
                    lineHeight: 1.7,
                  }}
                >
                  <p style={{ color: "#A1A1AA", fontWeight: 500 }}>
                    Franchise operations are complex.
                  </p>
                  <p>
                    Multiple locations, different POS systems, varying staff
                    capabilities, and a constant stream of data that's difficult
                    to normalize and interpret.
                  </p>
                  <p>
                    Many POS systems don't provide adequate APIs — or any API at
                    all. Getting consistent data across locations often requires
                    manual exports, spreadsheets, and hours of aggregation work.
                  </p>
                  <div className="pt-4">
                    <div
                      className="rounded-xl p-5 border-l-2"
                      style={{
                        background: "rgba(6,182,212,0.04)",
                        borderLeftColor: "#06B6D4",
                      }}
                    >
                      <p style={{ color: "#A1A1AA", fontStyle: "italic" }}>
                        "Ezra solves this with our intelligent automation layer.
                        When APIs exist, we use them. When they don't, we
                        extract data through secure browser automation."
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right — approach card */}
              <div>
                <div
                  className="rounded-2xl border p-8"
                  style={{ background: "#09090b", borderColor: "#27272A" }}
                >
                  <div className="flex items-center gap-2 mb-6">
                    <p
                      className="text-[10px] tracking-[0.22em] uppercase font-medium"
                      style={{ color: "#06B6D4" }}
                    >
                      Our Approach
                    </p>
                  </div>
                  <div className="flex flex-col gap-8">
                    {approachSteps.map((step) => {
                      const Icon = step.icon;
                      return (
                        <div key={step.n} className="flex gap-5 group">
                          <div className="flex-shrink-0 flex flex-col items-center gap-2">
                            {step.n !== "03" && (
                              <div
                                className="w-px flex-1"
                                style={{
                                  background:
                                    "linear-gradient(to bottom, rgba(6,182,212,0.2), transparent)",
                                }}
                              />
                            )}
                          </div>
                          <div className="pb-1">
                            <div className="flex items-center gap-2 mb-1">
                              {/* DM Mono for the step number */}
                              <span
                                className="text-[11px]"
                                style={{
                                  fontFamily: "'DM Mono', monospace",
                                  color: "rgba(6,182,212,0.55)",
                                }}
                              >
                                {step.n}
                              </span>
                              <h4
                                className="text-[15px] font-semibold"
                                style={{ color: "#FAFAFA" }}
                              >
                                {step.title}
                              </h4>
                            </div>
                            <p
                              className="text-[13px] leading-relaxed"
                              style={{ color: "#71717A" }}
                            >
                              {step.body}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Features Grid ── */}
        <section className="py-20 border-b" style={{ borderColor: "#27272A" }}>
          <div className="max-w-[1200px] mx-auto px-8">
            <div className="text-center mb-12">
              <p
                className="text-[10px] tracking-[0.22em] uppercase font-medium mb-3"
                style={{ color: "#06B6D4" }}
              >
                Core Capabilities
              </p>
              <h2
                className="tracking-[-0.025em]"
                style={{
                  fontWeight: 400,
                  fontSize: "clamp(24px, 3.5vw, 36px)",
                  color: "#FAFAFA",
                }}
              >
                What Makes Ezra <span className="shimmer-text">Different</span>
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-5">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={feature.title}
                    className="group rounded-xl p-7 border transition-all duration-300 hover:-translate-y-1"
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
                      className="text-[16px] font-semibold mb-2"
                      style={{ color: "#FAFAFA" }}
                    >
                      {feature.title}
                    </h3>
                    <p
                      className="text-[13px] leading-relaxed"
                      style={{ color: "#71717A" }}
                    >
                      {feature.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── Who We Serve ── */}
        <section className="py-28 border-b" style={{ borderColor: "#27272A" }}>
          <div className="max-w-[1200px] mx-auto px-8">
            <div className="mb-14 text-center">
              <div
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full border mb-4"
                style={{
                  background: "rgba(6,182,212,0.06)",
                  borderColor: "rgba(6,182,212,0.2)",
                }}
              >
                <Users className="w-3.5 h-3.5" style={{ color: "#06B6D4" }} />
                <span
                  className="text-[10px] tracking-[0.18em] uppercase font-medium"
                  style={{ color: "#06B6D4" }}
                >
                  Our Audience
                </span>
              </div>
              <h2
                className="mb-4 tracking-[-0.025em]"
                style={{
                  fontWeight: 400,
                  fontSize: "clamp(28px, 4vw, 40px)",
                  color: "#FAFAFA",
                }}
              >
                Who <span className="shimmer-text">Ezra Is For</span>
              </h2>
              <p
                className="max-w-[500px] mx-auto"
                style={{ fontSize: "16px", color: "#71717A", lineHeight: 1.6 }}
              >
                Ezra is a managed AI automation platform built specifically for
                franchise operations. We connect to any POS system and transform
                raw data into actionable insights.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              {audiences.map((audience) => {
                const Icon = audience.icon;
                return (
                  <div
                    key={audience.title}
                    className="group rounded-xl p-8 border transition-all duration-300 hover:-translate-y-1"
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
                    <div className="flex items-start gap-4">
                      <div>
                        <h3
                          className="text-[16px] font-semibold mb-2"
                          style={{ color: "#FAFAFA" }}
                        >
                          {audience.title}
                        </h3>
                        <p
                          className="text-[13px] leading-relaxed"
                          style={{ color: "#71717A" }}
                        >
                          {audience.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── Stats strip ── */}
        <section className="py-0 border-b" style={{ borderColor: "#27272A" }}>
          <div className="max-w-[1200px] mx-auto px-8">
            {/* 1px hairline between cells */}
            <div
              className="grid grid-cols-2 md:grid-cols-4 divide-x"
              style={{ borderColor: "#27272A" }}
            >
              <AnimatedStat value="110" label="Active stores" />
              <AnimatedStat value="14 days" label="Avg. deployment time" />
              <AnimatedStat
                value="2.41"
                label="Revenue recovered YTD"
                suffix="M"
              />
              <AnimatedStat value="4" label="Core modules" />
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="relative py-36 overflow-hidden text-center">
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, transparent, rgba(6,182,212,0.04), transparent)",
            }}
          />

          <div className="relative max-w-[1200px] mx-auto px-8">
            {/* Thin vertical accent */}
            <div
              className="w-px h-12 mx-auto mb-8"
              style={{
                background:
                  "linear-gradient(to bottom, transparent, rgba(6,182,212,0.5))",
              }}
            />

            <h2
              className="mb-4 tracking-[-0.025em]"
              style={{
                fontWeight: 300,
                fontSize: "clamp(28px, 5vw, 48px)",
                color: "#FAFAFA",
              }}
            >
              Ready to Transform Your{" "}
              <span className="shimmer-text">Franchise Operations?</span>
            </h2>
            <p
              className="max-w-[460px] mx-auto mb-10"
              style={{ fontSize: "16px", color: "#71717A", lineHeight: 1.65 }}
            >
              Every Ezra engagement starts with a conversation. Let's discuss
              your franchise operations and see how we can help.
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              <Link
                href="/contact"
                className="group inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold no-underline transition-all duration-300 hover:-translate-y-0.5"
                style={{
                  background: "linear-gradient(135deg, #22D3EE, #06B6D4)",
                  color: "#09090b",
                  fontSize: "13px",
                }}
              >
                Talk to Our Team
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/bots"
                className="group inline-flex items-center gap-2 px-8 py-3.5 rounded-xl no-underline border transition-all duration-300 hover:-translate-y-0.5"
                style={{
                  color: "#A1A1AA",
                  borderColor: "#27272A",
                  fontSize: "13px",
                }}
              >
                Meet The Ezra Family
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
