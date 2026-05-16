import { Metadata } from "next";
import Link from "next/link";
import { DM_Sans } from "next/font/google";
import {
  ShoppingCart,
  Shield,
  Calendar,
  Rocket,
  ArrowRight,
  Check,
  Sparkles,
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
  title: "Ezra Bots — AI Solutions for Franchises",
  description:
    "Purpose-built AI bots for franchise operations. Sales intelligence, loss prevention, scheduling optimization, and CRM replacement.",
};

// Module-specific accents
const MODULE_ACCENTS = {
  sales: {
    name: "Sales",
    primary: "#06B6D4",
    light: "#22D3EE",
    border: "rgba(6, 182, 212, 0.3)",
    bg: "rgba(6, 182, 212, 0.1)",
    text: "#22D3EE",
    tailwind: "cyan",
  },
  lp: {
    name: "Loss Prevention",
    primary: "#6366F1",
    light: "#818CF8",
    border: "rgba(99, 102, 241, 0.3)",
    bg: "rgba(99, 102, 241, 0.1)",
    text: "#818CF8",
    tailwind: "indigo",
  },
  scheduling: {
    name: "Scheduling",
    primary: "#34D399",
    light: "#6EE7B7",
    border: "rgba(52, 211, 153, 0.3)",
    bg: "rgba(52, 211, 153, 0.1)",
    text: "#6EE7B7",
    tailwind: "emerald",
  },
  exponential: {
    name: "Exponential",
    primary: "#FB923C",
    light: "#FDBA74",
    border: "rgba(251, 146, 60, 0.3)",
    bg: "rgba(251, 146, 60, 0.1)",
    text: "#FDBA74",
    tailwind: "orange",
  },
};

const bots = [
  {
    id: "ezra-sales",
    name: "Ezra Sales",
    icon: ShoppingCart,
    tagline: "Real-time sales intelligence",
    description:
      "Track daily revenue, average tickets, goal performance, and trends across all your locations. Ezra Sales normalizes data from any POS system into unified dashboards.",
    features: [
      "Daily revenue tracking with goal comparisons",
      "Service vs product revenue breakdown",
      "Payment mix analysis (cash vs card)",
      "Location comparison and ranking",
      "Trend analysis and forecasting",
      "Real-time sync status monitoring",
    ],
    status: "Active",
    href: "/bots/ezra-sales",
    accent: MODULE_ACCENTS.sales,
  },
  {
    id: "ezra-lp",
    name: "Ezra LP",
    icon: Shield,
    tagline: "Loss prevention monitoring",
    description:
      "AI-powered anomaly detection for refunds, discounts, and suspicious transaction patterns. Protect your franchise from internal shrinkage and fraud.",
    features: [
      "Unusual refund pattern detection",
      "High-risk employee activity flagging",
      "Discount abuse monitoring",
      "Void transaction analysis",
      "Risk scoring by location",
      "Automated alert notifications",
    ],
    status: "Active",
    href: "/bots/ezra-lp",
    accent: MODULE_ACCENTS.lp,
  },
  {
    id: "ezra-scheduling",
    name: "Ezra Scheduling",
    icon: Calendar,
    tagline: "Intelligent labor optimization",
    description:
      "Pinpoint idle hours, optimize shift coverage, and eliminate overtime surprises across every location. Ezra Scheduling analyzes real revenue-per-labor-hour data to surface AI-driven staffing recommendations.",
    features: [
      "Idle time detection with revenue correlation",
      "Time-of-day traffic and SRPH analysis",
      "AI-generated shift recommendations",
      "Overtime monitoring and redistribution alerts",
      "Location rankings by labor efficiency",
      "Multi-location scheduling insights",
    ],
    status: "Active",
    href: "/bots/ezra-scheduling",
    accent: MODULE_ACCENTS.scheduling,
  },
  {
    id: "ezra-exponential",
    name: "Ezra Exponential",
    icon: Rocket,
    tagline: "Your CRM replacement — built for franchises",
    description:
      "Stop paying for a CRM that wasn't built for your industry. Ezra Exponential replaces traditional CRMs with intelligent, automated client retention — segmenting guests by visit frequency and triggering personalized re-engagement campaigns.",
    features: [
      "Replaces generic CRMs with franchise-specific automation",
      "Visit-frequency bucketing (4-week, 6-week, 8-week segments)",
      "Automated SMS & email follow-up campaigns",
      "Uptake rate tracking per segment and location",
      "Retention risk scoring — know who's about to leave",
      "AI-powered offer and timing recommendations",
    ],
    status: "Active",
    href: "/bots/ezra-exponential",
    accent: MODULE_ACCENTS.exponential,
  },
];

function StatusBadge({
  status,
  accent,
}: {
  status: string;
  accent: typeof MODULE_ACCENTS.sales;
}) {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider"
      style={{
        borderColor: accent.border,
        backgroundColor: accent.bg,
        color: accent.text,
      }}
    >
      <span
        className="h-1.5 w-1.5 rounded-full"
        style={{ backgroundColor: accent.primary }}
      />
      {status}
    </span>
  );
}

export default function BotsPage() {
  return (
    <div
      className={`${dmSans.variable} min-h-screen bg-[#09090B] font-sans text-[#FAFAFA] antialiased`}
    >
      <Header />

      <main className="pt-16">
        {/* Hero */}
        <section className="relative isolate overflow-hidden pt-24 pb-20 lg:pt-36 lg:pb-28">
          <div className="relative mx-auto max-w-[1100px] px-6 text-center lg:px-10">
            <h1 className="animate-fade-up animation-delay-100 mx-auto max-w-[16ch] text-[42px]  leading-[0.98] tracking-[-0.02em] text-balance md:text-[60px] lg:text-[84px]">
              Meet the{" "}
              <span className="italic text-cyan-400">Ezra Family.</span>
            </h1>

            <p className="animate-fade-up animation-delay-200 mx-auto mt-8 max-w-xl text-pretty text-[17px] leading-relaxed text-zinc-400">
              Each Ezra product is designed to solve a specific operational
              challenge. Customized for your brand, configured to your needs.
            </p>

            <div className="animate-fade-up animation-delay-200 mx-auto mt-12 flex items-center justify-center gap-4">
              <div className="flex gap-1.5">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-1 w-1 rounded-full bg-cyan-400/60"
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Bot cards */}
        <section className="relative border-t border-zinc-800 py-20 lg:py-28">
          <div className="mx-auto max-w-[1200px] space-y-6 px-6 lg:px-10">
            {bots.map((bot, i) => {
              const reverse = i % 2 === 1;
              const a = bot.accent;
              return (
                <article
                  key={bot.id}
                  className="group relative grid gap-10 rounded-xl border border-zinc-800 bg-[#141417] p-8 transition-all duration-300 hover:border-opacity-50 lg:grid-cols-12 lg:gap-12 lg:p-12"
                  style={{ borderColor: "rgba(113, 113, 122, 1)" }}
                >
                  {/* Left / content column */}
                  <div
                    className={`lg:col-span-7 ${reverse ? "lg:order-2" : ""}`}
                  >
                    <div className="flex items-start gap-5">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-3">
                          <h2 className="text-[36px] font-semibold leading-tight tracking-tight text-white transition-colors duration-300 md:text-[44px] group-hover:text-[${a.text}]">
                            {bot.name}
                          </h2>
                        </div>
                        <p
                          className="mt-1 font-mono text-[12px] uppercase tracking-[0.18em]"
                          style={{ color: a.text }}
                        >
                          {bot.tagline}
                        </p>
                      </div>
                    </div>

                    <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-zinc-400">
                      {bot.description}
                    </p>

                    <div
                      className="mt-6 h-px w-16 transition-all duration-300 group-hover:w-32"
                      style={{ backgroundColor: a.primary }}
                    />

                    <div className="mt-6">
                      <Link
                        href={bot.href}
                        className="group/btn inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-[13px] transition-all duration-300 hover:bg-opacity-10"
                        style={{
                          borderColor: a.border,
                          color: a.text,
                        }}
                      >
                        Learn More
                        <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover/btn:translate-x-1" />
                      </Link>
                    </div>
                  </div>

                  {/* Right / features column */}
                  <div
                    className={`lg:col-span-5 ${reverse ? "lg:order-1" : ""}`}
                  >
                    <div
                      className="rounded-lg border p-6 transition-all duration-300"
                      style={{
                        borderColor: a.border,
                        backgroundColor: "rgba(0, 0, 0, 0.4)",
                      }}
                    >
                      <p
                        className="mb-4 font-mono text-[10px] uppercase tracking-[0.2em]"
                        style={{ color: a.text }}
                      >
                        Key Capabilities
                      </p>
                      <ul className="space-y-3">
                        {bot.features.map((f) => (
                          <li
                            key={f}
                            className="flex items-start gap-2.5 text-[13.5px] leading-relaxed"
                          >
                            <div
                              className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border"
                              style={{
                                borderColor: a.border,
                                backgroundColor: a.bg,
                              }}
                            >
                              <Check
                                className="h-2.5 w-2.5"
                                style={{ color: a.text }}
                              />
                            </div>
                            <span className="text-white/80 transition-colors duration-200 group-hover:text-white/95">
                              {f}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </article>
              );
            })}
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
            <h2 className="mx-auto max-w-[18ch] text-[44px] font-semibold leading-[1.02] tracking-[-0.02em] text-balance text-white md:text-[64px] lg:text-[80px]">
              Ready to see Ezra in{" "}
              <span className="italic text-cyan-400">action?</span>
            </h2>
            <p className="mx-auto mt-8 max-w-xl text-pretty text-[16px] leading-relaxed text-zinc-400">
              Every Ezra implementation is custom-tailored to your franchise.
              Let's discuss how we can help transform your operations.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <a
                href="#demo"
                className="group inline-flex items-center gap-2 rounded-full bg-cyan-500 px-6 py-3 text-[14px] font-medium text-black transition-all hover:bg-cyan-400"
              >
                Schedule a Demo
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
              </a>
              <Link
                href="#learn"
                className="inline-flex items-center gap-2 rounded-full border border-cyan-500/50 px-6 py-3 text-[14px] text-cyan-400 transition-all duration-300 hover:bg-cyan-500/10"
              >
                See All Products
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
