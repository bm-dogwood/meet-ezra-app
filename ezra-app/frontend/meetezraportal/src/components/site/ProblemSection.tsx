import { useState } from "react";
import { SectionHeader } from "./SectionHeader";

// ── Ezra V2 brand tokens ──────────────────────────────────────────────────
// Colors: Brand Reference May 2026
// Typography: DM Sans 300/400/500/600, DM Mono 400
const PAGE_BG = "#09090B";
const CARD_BG = "#141417"; // dark card surface

const CYAN = "#06B6D4"; // Cyan 500 — primary accent
const CYAN_LIGHT = "#22D3EE"; // Cyan 400
const CYAN_PALE = "rgba(6,182,212,0.10)";
const CYAN_BORDER = "rgba(6,182,212,0.28)";

const TEXT = "rgba(255,255,255,0.92)";
const TEXT_DIM = "rgba(255,255,255,0.55)";
const TEXT_MUTED = "rgba(255,255,255,0.30)";

const PROBLEMS = [
  {
    code: "01",
    title: "Theft & Voids",
    metric: "$84K",
    metricLabel: "avg. annual leakage / unit",
    bars: [40, 65, 55, 85, 72, 90, 68, 95, 78, 88],
    body: "Repeat void clusters, comped tickets, and after-hours anomalies hide in plain sight across thousands of weekly transactions.",
  },
  {
    code: "02",
    title: "Idle Hours",
    metric: "21%",
    metricLabel: "of scheduled labor mis-aligned",
    bars: [60, 70, 50, 45, 35, 40, 55, 70, 85, 92],
    body: "Schedules built on instinct rather than demand signal. Over-staffed mornings, under-staffed peaks, and uncovered closes.",
  },
  {
    code: "03",
    title: "Over-Ordering",
    metric: "9.4%",
    metricLabel: "inventory variance vs. theoretical",
    bars: [80, 60, 75, 55, 70, 65, 80, 55, 70, 60],
    body: "Manager-driven pars decoupled from real consumption. Spoilage, write-offs, and working capital trapped on the shelf.",
  },
  {
    code: "04",
    title: "Wasted Spend",
    metric: "$1.2M",
    metricLabel: "recoverable across 25 units / yr",
    bars: [45, 55, 65, 70, 60, 75, 80, 70, 85, 78],
    body: "Vendor drift, off-contract pricing, and duplicate SKUs accumulate quietly in the P&L until quarter-close.",
  },
];

function ProblemCard({ p }: { p: (typeof PROBLEMS)[number] }) {
  const [hovered, setHovered] = useState(false);

  return (
    <article
      className="relative p-8 lg:p-10"
      style={{
        background: CARD_BG,
        transition: "background 300ms",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        {/* Code / Title — DM Mono eyebrow */}
        <div
          style={{
            fontFamily: "'DM Mono', monospace",
            fontWeight: 400,
            fontSize: "11px",
            textTransform: "uppercase",
            letterSpacing: "0.20em",
            color: CYAN,
            opacity: 0.85,
          }}
        >
          {p.code} / {p.title}
        </div>

        {/* "Observed" badge — DM Mono, subtle cyan tint */}
        <div
          style={{
            fontFamily: "'DM Mono', monospace",
            fontWeight: 400,
            fontSize: "9px",
            textTransform: "uppercase",
            letterSpacing: "0.16em",
            background: CYAN_PALE,
            color: CYAN,
            border: `1px solid ${CYAN_BORDER}`,
            borderRadius: "9999px",
            padding: "2px 8px",
          }}
        >
          observed
        </div>
      </div>

      {/* Bar chart — 60px tall, bars animate on hover */}
      <div className="mt-8 flex items-end gap-1.5" style={{ height: "60px" }}>
        {p.bars.map((h, i) => (
          <div
            key={i}
            className="flex-1 rounded-sm"
            style={{
              height: `${h * 0.6}px`,
              // Hover: Cyan 500; rest: subtle cyan pale fill
              background: hovered ? CYAN : CYAN_PALE,
              border: `1px solid ${hovered ? CYAN : CYAN_BORDER}`,
              // No box-shadow — brand principle 03; glow removed
              transition: [
                `background 400ms ${i * 25}ms`,
                `border-color 400ms ${i * 25}ms`,
              ].join(", "),
            }}
          />
        ))}
      </div>

      {/* Metric — DM Sans 300 Light, editorial scale */}
      <div className="mt-8 flex items-baseline gap-3">
        <div
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 300,
            fontSize: "44px",
            lineHeight: 1,
            letterSpacing: "-0.03em",
            fontVariantNumeric: "tabular-nums",
            color: CYAN,
            // No text-shadow glow — brand principle 03
          }}
        >
          {p.metric}
        </div>
        {/* Metric label — DM Sans Regular */}
        <div
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 400,
            fontSize: "12px",
            lineHeight: 1.4,
            color: TEXT_MUTED,
          }}
        >
          {p.metricLabel}
        </div>
      </div>

      {/* Body — DM Sans Regular, ≤52ch measure */}
      <p
        className="mt-5 max-w-md"
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontWeight: 400,
          fontSize: "14px",
          lineHeight: 1.55,
          color: TEXT_DIM,
        }}
      >
        {p.body}
      </p>
    </article>
  );
}

export function ProblemSection() {
  return (
    <section
      className="relative py-28 lg:py-40"
      style={{ background: PAGE_BG }}
    >
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        {/* Eyebrow — DM Mono */}
        <div
          style={{
            fontFamily: "'DM Mono', monospace",
            fontWeight: 400,
            fontSize: "10px",
            textTransform: "uppercase",
            letterSpacing: "0.22em",
            color: CYAN,
            marginBottom: "20px",
          }}
        >
          The operational tax
        </div>

        {/* Section heading — DM Sans 300 Light */}
        <h2
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 300,
            fontSize: "clamp(36px, 5vw, 64px)",
            lineHeight: 1.05,
            letterSpacing: "-0.035em",
            color: TEXT,
            maxWidth: "22ch",
          }}
        >
          Every multi-unit business pays it. Most never measure it.
        </h2>

        {/* Description — DM Sans Regular */}
        <p
          style={{
            marginTop: "16px",
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 400,
            fontSize: "16px",
            lineHeight: 1.55,
            color: TEXT_DIM,
            maxWidth: "56ch",
          }}
        >
          Four categories of compounding waste sit beneath every franchise P&L.
          Ezra surfaces them — and closes them — without adding headcount.
        </p>

        {/* Card grid — hairline cyan border, 1px gap between cards */}
        <div
          className="mt-16 grid overflow-hidden rounded-2xl md:grid-cols-2"
          style={{
            border: `1px solid ${CYAN_BORDER}`,
            gap: "1px",
            // Gap color = hairline cyan — creates the divider lines between cards
            background: CYAN_BORDER,
          }}
        >
          {PROBLEMS.map((p) => (
            <ProblemCard key={p.code} p={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
