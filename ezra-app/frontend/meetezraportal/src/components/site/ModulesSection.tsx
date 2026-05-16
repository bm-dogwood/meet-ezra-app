import { useState } from "react";
import { SectionHeader } from "./SectionHeader";

// ── Ezra V2 brand tokens ──────────────────────────────────────────────────
// Colors: Brand Reference May 2026
// Typography: DM Sans 300/400/500/600, DM Mono 400 — Google Fonts
const PAGE_BG = "#09090B"; // dark page background
const CARD_BG = "#141417"; // dark card surface
const CARD_EL = "#18181B"; // elevated element on card
const BORDER = "rgba(255,255,255,0.07)";
const BORDER_STR = "rgba(255,255,255,0.13)";
const TEXT = "rgba(255,255,255,0.92)";
const TEXT_DIM = "rgba(255,255,255,0.55)";
const TEXT_MUTED = "rgba(255,255,255,0.30)";

// Cyan accent — Cyan 500 primary / Cyan 400 hover
const CYAN = "#06B6D4";
const CYAN_LIGHT = "#22D3EE";
const CYAN_PALE = "rgba(6,182,212,0.10)";
const CYAN_BORDER = "rgba(6,182,212,0.28)";

// Module accents — functional, one per component (brand principle: never mix)
// LP & Inventory = Indigo #6366F1
// Scheduling = Emerald #34D399
// Exponential = Orange #FB923C
// Sales = Cyan (same as primary brand)
const MODULES = [
  {
    id: "loss",
    name: "Ezra Loss Prevention",
    tag: "01",
    accent: "#6366F1", // LP & Inventory — indigo
    summary:
      "Anomaly detection across every void, comp, refund and after-hours transaction.",
    bullets: [
      "Behavioral models per cashier, per shift",
      "Auto-flagged ticket clusters & video links",
      "Recovery workflows routed to ops",
    ],
    metric: { v: "$2.41M", l: "recovered YTD" },
  },
  {
    id: "inventory",
    name: "Ezra Inventory",
    tag: "02",
    accent: "#6366F1", // LP & Inventory — indigo
    summary:
      "Theoretical-vs-actual variance, dynamic pars, and spoilage forecasting.",
    bullets: [
      "Real-time variance per SKU",
      "Auto-generated order suggestions",
      "Vendor & contract intelligence",
    ],
    metric: { v: "9.4% → 2.1%", l: "variance closed" },
  },
  {
    id: "scheduling",
    name: "Ezra Scheduling",
    tag: "03",
    accent: "#34D399", // Scheduling — emerald green
    summary:
      "Demand-aware schedules built from POS signal, weather, and event calendars.",
    bullets: [
      "15-min granularity demand curves",
      "Auto-balanced labor % targets",
      "Compliance & break tracking",
    ],
    metric: { v: "$612K", l: "payroll saved" },
  },
  {
    id: "exp",
    name: "Ezra Exponential",
    tag: "04",
    accent: "#FB923C", // Exponential / CRM — warm orange
    summary:
      "Guest CRM and retention — turn one-time tickets into measurable lifetime value.",
    bullets: [
      "Identity resolution across POS",
      "Automated re-engagement journeys",
      "LTV cohorts per unit",
    ],
    metric: { v: "+34%", l: "guest retention" },
  },
  {
    id: "sales",
    name: "Ezra Sales",
    tag: "05",
    accent: CYAN, // Sales — same cyan as primary brand
    summary:
      "Revenue intelligence — daypart, mix, menu engineering, and unit benchmarking.",
    bullets: [
      "Same-store-sales attribution",
      "Menu margin re-engineering",
      "Top-quartile unit replication",
    ],
    metric: { v: "+18.2%", l: "comp revenue lift" },
  },
];

export function ModulesSection() {
  const [active, setActive] = useState(MODULES[0].id);
  const current = MODULES.find((m) => m.id === active)!;
  const A = current.accent; // active module's accent — one color per component
  const A_PALE = `${A}1A`; // ~10% opacity
  const A_BORDER = `${A}48`; // ~28% opacity

  return (
    <section
      id="modules"
      className="relative py-16 md:py-28 lg:py-40 overflow-x-hidden"
      style={{ background: PAGE_BG }}
    >
      {/* Subtle ambient — not a blob, just a soft horizon */}
      <div
        className="pointer-events-none absolute right-0 top-0 h-[500px] w-[500px] translate-x-1/4 -translate-y-1/4 rounded-full lg:translate-x-1/3"
        style={{
          background: `radial-gradient(closest-side, rgba(6,182,212,0.06), transparent 80%)`,
        }}
      />

      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl xl:max-w-7xl">
          <div className="flex flex-col gap-12 lg:flex-row lg:gap-8">
            {/* ── LEFT: nav ── */}
            <div className="w-full lg:w-5/12 xl:w-5/12">
              {/* Eyebrow — DM Mono */}
              <div className="flex items-center gap-2">
                <span
                  className="h-px w-6 flex-shrink-0"
                  style={{ background: CYAN_BORDER }}
                />
                <span
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    fontWeight: 400,
                    fontSize: "10px",
                    textTransform: "uppercase",
                    letterSpacing: "0.22em",
                    color: CYAN,
                    opacity: 0.8,
                  }}
                >
                  The platform
                </span>
              </div>

              {/* Section heading — DM Sans 300 Light */}
              <h2
                className="mt-5"
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 300,
                  fontSize: "clamp(32px, 5vw, 64px)",
                  lineHeight: 1.05,
                  letterSpacing: "-0.035em",
                  color: TEXT,
                }}
              >
                Five modules. <span style={{ color: CYAN }}>One</span> operating
                layer.
              </h2>

              {/* Body — DM Sans Regular */}
              <p
                className="mt-5 max-w-md"
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 400,
                  fontSize: "16px",
                  lineHeight: 1.55,
                  color: TEXT_DIM,
                }}
              >
                Each module ships independently and composes into a single
                executive view. Adopt what your operation needs first — extend
                at your own pace.
              </p>

              {/* Module list — hairline cyan border container */}
              <div
                className="mt-8 sm:mt-10 overflow-hidden rounded-xl"
                style={{ border: `1px solid ${CYAN_BORDER}` }}
              >
                {MODULES.map((m, idx) => {
                  const isActive = m.id === active;
                  return (
                    <button
                      key={m.id}
                      onMouseEnter={() => setActive(m.id)}
                      onClick={() => setActive(m.id)}
                      className="flex w-full items-center justify-between px-4 sm:px-5 py-3 sm:py-4 text-left transition-all duration-300"
                      style={{
                        background: isActive
                          ? CYAN_PALE
                          : idx % 2 === 0
                          ? CARD_BG
                          : CARD_EL,
                        borderBottom:
                          idx < MODULES.length - 1
                            ? `1px solid ${isActive ? CYAN_BORDER : BORDER}`
                            : "none",
                        // Active: left accent bar using module color
                        boxShadow: isActive
                          ? `inset 3px 0 0 ${m.accent}`
                          : "none",
                      }}
                    >
                      <div className="flex items-center gap-3 sm:gap-4">
                        {/* Tag — DM Mono */}
                        <span
                          style={{
                            fontFamily: "'DM Mono', monospace",
                            fontSize: "10px",
                            color: isActive ? m.accent : TEXT_MUTED,
                            flexShrink: 0,
                          }}
                        >
                          {m.tag}
                        </span>
                        {/* Name — DM Sans Medium */}
                        <span
                          style={{
                            fontFamily: "'DM Sans', sans-serif",
                            fontWeight: 500,
                            fontSize: "14px",
                            letterSpacing: "-0.01em",
                            color: isActive ? TEXT : TEXT_DIM,
                          }}
                          className="truncate"
                        >
                          {m.name}
                        </span>
                      </div>
                      <span
                        style={{
                          fontFamily: "'DM Mono', monospace",
                          fontSize: "14px",
                          color: isActive ? m.accent : TEXT_MUTED,
                          flexShrink: 0,
                          marginLeft: "8px",
                        }}
                      >
                        {isActive ? "—" : "+"}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ── RIGHT: detail card ── */}
            <div className="w-full lg:w-7/12 xl:w-7/12">
              <div
                key={current.id}
                className="rounded-2xl p-6 sm:p-8 lg:p-10 xl:p-12"
                style={{
                  background: CARD_BG,
                  // Border uses the active module's accent — functional signal
                  border: `1px solid ${A_BORDER}`,
                  // No drop shadow — brand principle 03
                }}
              >
                {/* Card header */}
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 sm:gap-6">
                  <div className="flex-1 min-w-0">
                    {/* Module tag — DM Mono */}
                    <div
                      style={{
                        fontFamily: "'DM Mono', monospace",
                        fontSize: "10px",
                        textTransform: "uppercase",
                        letterSpacing: "0.22em",
                        color: A,
                        opacity: 0.75,
                      }}
                    >
                      Module {current.tag}
                    </div>
                    {/* Module name — DM Sans Semibold, H3 scale */}
                    <h3
                      className="mt-2 break-words"
                      style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontWeight: 600,
                        fontSize: "clamp(28px, 4vw, 40px)",
                        lineHeight: 1.1,
                        letterSpacing: "-0.01em",
                        color: TEXT,
                      }}
                    >
                      {current.name}
                    </h3>
                  </div>

                  {/* Metric chip — module accent, DM Sans */}
                  <div
                    className="rounded-xl px-4 py-3 text-right flex-shrink-0 self-start"
                    style={{
                      background: A_PALE,
                      border: `1px solid ${A_BORDER}`,
                    }}
                  >
                    <div
                      style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontWeight: 300,
                        fontSize: "clamp(20px, 3vw, 28px)",
                        lineHeight: 1,
                        letterSpacing: "-0.02em",
                        color: A,
                        fontVariantNumeric: "tabular-nums",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {current.metric.v}
                    </div>
                    <div
                      style={{
                        marginTop: "4px",
                        fontFamily: "'DM Mono', monospace",
                        fontSize: "10px",
                        textTransform: "uppercase",
                        letterSpacing: "0.14em",
                        color: TEXT_MUTED,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {current.metric.l}
                    </div>
                  </div>
                </div>

                {/* Summary — DM Sans Regular */}
                <p
                  className="mt-6 sm:mt-8 max-w-xl"
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: 400,
                    fontSize: "clamp(15px, 2vw, 17px)",
                    lineHeight: 1.55,
                    color: TEXT_DIM,
                  }}
                >
                  {current.summary}
                </p>

                {/* Divider — gradient from module accent */}
                <div
                  className="mt-6 sm:mt-8 h-px w-full"
                  style={{
                    background: `linear-gradient(90deg, ${A_BORDER}, transparent)`,
                  }}
                />

                {/* Bullets — DM Sans Regular */}
                <ul className="mt-6 sm:mt-8 space-y-3 sm:space-y-4">
                  {current.bullets.map((b, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3"
                      style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontWeight: 400,
                        fontSize: "14px",
                        lineHeight: 1.55,
                      }}
                    >
                      <span
                        className="mt-2 h-px w-5 flex-shrink-0"
                        style={{ background: A }}
                      />
                      <span
                        className="flex-1 break-words"
                        style={{ color: TEXT_DIM }}
                      >
                        {b}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* Sparkline card — no drop shadow, hairline border */}
                <div
                  className="mt-8 sm:mt-10 rounded-xl p-4 sm:p-5 overflow-x-auto"
                  style={{
                    background: CARD_EL,
                    border: `1px solid ${BORDER_STR}`,
                  }}
                >
                  <div className="mb-3 flex items-center justify-between flex-wrap gap-2">
                    <span
                      style={{
                        fontFamily: "'DM Mono', monospace",
                        fontSize: "10px",
                        textTransform: "uppercase",
                        letterSpacing: "0.16em",
                        color: TEXT_MUTED,
                      }}
                    >
                      {current.name} · live signal
                    </span>
                    <span
                      className="inline-block h-1.5 w-1.5 rounded-full flex-shrink-0"
                      style={{ background: A }}
                    />
                  </div>
                  <div className="min-w-[280px] w-full">
                    <svg viewBox="0 0 600 90" className="h-20 w-full">
                      <defs>
                        <linearGradient
                          id="spark-fill"
                          x1="0"
                          x2="0"
                          y1="0"
                          y2="1"
                        >
                          <stop offset="0%" stopColor={A} stopOpacity="0.22" />
                          <stop offset="100%" stopColor={A} stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      {[20, 45, 70].map((yVal) => (
                        <line
                          key={yVal}
                          x1="0"
                          x2="600"
                          y1={yVal}
                          y2={yVal}
                          stroke="rgba(255,255,255,0.05)"
                          strokeWidth="0.5"
                        />
                      ))}
                      <path
                        d={`M0,60 ${Array.from({ length: 30 }, (_, i) => {
                          const x = (i + 1) * 20;
                          const yVal =
                            30 +
                            Math.sin(i / 2 + current.id.length) * 20 +
                            Math.cos(i / 3) * 8;
                          return `L${x},${yVal}`;
                        }).join(" ")} L600,90 L0,90 Z`}
                        fill="url(#spark-fill)"
                      />
                      <path
                        d={`M0,60 ${Array.from({ length: 30 }, (_, i) => {
                          const x = (i + 1) * 20;
                          const yVal =
                            30 +
                            Math.sin(i / 2 + current.id.length) * 20 +
                            Math.cos(i / 3) * 8;
                          return `L${x},${yVal}`;
                        }).join(" ")}`}
                        fill="none"
                        stroke={CYAN_LIGHT}
                        strokeWidth="1.5"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
