import { useState } from "react";
import { SectionHeader } from "./SectionHeader";

// ── Explicit palette — no CSS vars that can silently fail ──────────────────
const BG = "#000";
const SURFACE = "#111318";
const SURFACE_EL = "#161920";
const BORDER = "rgba(255,255,255,0.07)";
const BORDER_STR = "rgba(255,255,255,0.13)";
const TEXT = "rgba(255,255,255,0.90)";
const TEXT_DIM = "rgba(255,255,255,0.60)";
const TEXT_MUTED = "rgba(255,255,255,0.38)";

// ── Blue tokens ───────────────────────────────────────────────────────────
const BLUE = "oklch(0.58 0.22 245)";
const BLUE_DIM = "oklch(0.58 0.22 245 / 0.14)";
const BLUE_MID = "oklch(0.58 0.22 245 / 0.38)";
const BLUE_GLOW = "0 0 20px oklch(0.58 0.22 245 / 0.35)";

const MODULES = [
  {
    id: "loss",
    name: "Ezra Loss Prevention",
    tag: "01",
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

  return (
    <section
      id="modules"
      className="relative py-16 md:py-28 lg:py-40 overflow-x-hidden"
      style={{ background: BG }}
    >
      {/* Ambient blue glow top-right - repositioned to prevent overflow */}
      <div
        className="pointer-events-none absolute right-0 top-0 h-[500px] w-[500px] translate-x-1/4 -translate-y-1/4 rounded-full lg:translate-x-1/3"
        style={{
          background: `radial-gradient(closest-side, oklch(0.55 0.22 245 / 0.08), transparent 80%)`,
        }}
      />

      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl xl:max-w-7xl">
          <div className="flex flex-col gap-12 lg:flex-row lg:gap-8">
            {/* ── LEFT: nav ── */}
            <div className="w-full lg:w-5/12 xl:w-5/12">
              <div className="flex items-center gap-2">
                <span
                  className="h-px w-6 flex-shrink-0"
                  style={{ background: BLUE_MID }}
                />
                <span
                  className="font-mono text-[10px] uppercase tracking-[0.22em]"
                  style={{ color: BLUE, opacity: 0.8 }}
                >
                  The platform
                </span>
              </div>

              <h2
                className="mt-5 font-display text-3xl sm:text-4xl md:text-[44px] lg:text-5xl xl:text-[64px] leading-[1.1] sm:leading-[1.08] md:leading-[1.05] lg:leading-[1.02] tracking-[-0.02em]"
                style={{ color: TEXT }}
              >
                Five modules. <span style={{ color: BLUE }}>One</span> operating
                layer.
              </h2>

              <p
                className="mt-5 max-w-md text-[15px] sm:text-[16px] leading-relaxed"
                style={{ color: TEXT_DIM }}
              >
                Each module ships independently and composes into a single
                executive view. Adopt what your operation needs first — extend
                at your own pace.
              </p>

              {/* Module list */}
              <div
                className="mt-8 sm:mt-10 overflow-hidden rounded-xl"
                style={{ border: `1px solid ${BLUE_MID}` }}
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
                          ? BLUE_DIM
                          : idx % 2 === 0
                          ? SURFACE
                          : SURFACE_EL,
                        borderBottom:
                          idx < MODULES.length - 1
                            ? `1px solid ${isActive ? BLUE_MID : BORDER}`
                            : "none",
                        boxShadow: isActive ? `inset 3px 0 0 ${BLUE}` : "none",
                      }}
                    >
                      <div className="flex items-center gap-3 sm:gap-4">
                        <span
                          className="font-mono text-[10px] flex-shrink-0"
                          style={{ color: isActive ? BLUE : TEXT_MUTED }}
                        >
                          {m.tag}
                        </span>
                        <span
                          className="text-[14px] sm:text-[15px] font-medium tracking-tight truncate"
                          style={{ color: isActive ? TEXT : TEXT_DIM }}
                        >
                          {m.name}
                        </span>
                      </div>
                      <span
                        className="font-mono text-[14px] flex-shrink-0 ml-2"
                        style={{ color: isActive ? BLUE : TEXT_MUTED }}
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
                  background: SURFACE,
                  border: `1px solid ${BLUE_MID}`,
                  boxShadow: `0 0 0 1px ${BLUE_DIM}, 0 40px 80px -20px rgba(0,0,0,0.5), ${BLUE_GLOW}`,
                }}
              >
                {/* Card header */}
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 sm:gap-6">
                  <div className="flex-1 min-w-0">
                    <div
                      className="font-mono text-[10px] uppercase tracking-[0.22em]"
                      style={{ color: BLUE, opacity: 0.75 }}
                    >
                      Module {current.tag}
                    </div>
                    <h3
                      className="mt-2 font-display text-3xl sm:text-[32px] md:text-[36px] lg:text-[40px] leading-tight tracking-tight break-words"
                      style={{ color: TEXT }}
                    >
                      {current.name}
                    </h3>
                  </div>

                  {/* Metric chip */}
                  <div
                    className="rounded-xl px-4 py-3 text-right flex-shrink-0 self-start"
                    style={{
                      background: BLUE_DIM,
                      border: `1px solid ${BLUE_MID}`,
                    }}
                  >
                    <div
                      className="font-display text-2xl sm:text-[24px] md:text-[26px] lg:text-[28px] leading-none tracking-tight whitespace-nowrap"
                      style={{
                        color: BLUE,
                        fontVariantNumeric: "tabular-nums",
                        textShadow: BLUE_GLOW,
                      }}
                    >
                      {current.metric.v}
                    </div>
                    <div
                      className="mt-1 font-mono text-[10px] uppercase tracking-wider whitespace-nowrap"
                      style={{ color: TEXT_MUTED }}
                    >
                      {current.metric.l}
                    </div>
                  </div>
                </div>

                <p
                  className="mt-6 sm:mt-8 max-w-xl text-[15px] sm:text-[16px] md:text-[17px] leading-relaxed"
                  style={{ color: TEXT_DIM }}
                >
                  {current.summary}
                </p>

                {/* Divider */}
                <div
                  className="mt-6 sm:mt-8 h-px w-full"
                  style={{
                    background: `linear-gradient(90deg, ${BLUE_MID}, transparent)`,
                  }}
                />

                {/* Bullets */}
                <ul className="mt-6 sm:mt-8 space-y-3 sm:space-y-4">
                  {current.bullets.map((b, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 text-[13px] sm:text-[14px]"
                    >
                      <span
                        className="mt-2 h-px w-5 flex-shrink-0"
                        style={{ background: BLUE }}
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

                {/* Mini sparkline card */}
                <div
                  className="mt-8 sm:mt-10 rounded-xl p-4 sm:p-5 overflow-x-auto"
                  style={{
                    background: SURFACE_EL,
                    border: `1px solid ${BORDER_STR}`,
                  }}
                >
                  <div className="mb-3 flex items-center justify-between flex-wrap gap-2">
                    <span
                      className="font-mono text-[10px] uppercase tracking-wider"
                      style={{ color: TEXT_MUTED }}
                    >
                      {current.name} · live signal
                    </span>
                    <span
                      className="inline-block h-1.5 w-1.5 rounded-full flex-shrink-0"
                      style={{ background: BLUE, boxShadow: BLUE_GLOW }}
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
                          <stop
                            offset="0%"
                            stopColor="oklch(0.58 0.22 245)"
                            stopOpacity="0.25"
                          />
                          <stop
                            offset="100%"
                            stopColor="oklch(0.58 0.22 245)"
                            stopOpacity="0"
                          />
                        </linearGradient>
                      </defs>
                      {/* Grid lines */}
                      {[20, 45, 70].map((y) => (
                        <line
                          key={y}
                          x1="0"
                          x2="600"
                          y1={y}
                          y2={y}
                          stroke="rgba(255,255,255,0.05)"
                          strokeWidth="0.5"
                        />
                      ))}
                      {/* Area fill */}
                      <path
                        d={`M0,60 ${Array.from({ length: 30 }, (_, i) => {
                          const x = (i + 1) * 20;
                          const y =
                            30 +
                            Math.sin(i / 2 + current.id.length) * 20 +
                            Math.cos(i / 3) * 8;
                          return `L${x},${y}`;
                        }).join(" ")} L600,90 L0,90 Z`}
                        fill="url(#spark-fill)"
                      />
                      {/* Line */}
                      <path
                        d={`M0,60 ${Array.from({ length: 30 }, (_, i) => {
                          const x = (i + 1) * 20;
                          const y =
                            30 +
                            Math.sin(i / 2 + current.id.length) * 20 +
                            Math.cos(i / 3) * 8;
                          return `L${x},${y}`;
                        }).join(" ")}`}
                        fill="none"
                        stroke="oklch(0.68 0.22 245)"
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
