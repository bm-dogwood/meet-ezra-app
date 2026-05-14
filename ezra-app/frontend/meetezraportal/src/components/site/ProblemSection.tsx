import { useState } from "react";
import { SectionHeader } from "./SectionHeader";

const BLUE = "oklch(0.58 0.22 245)";
const BLUE_DIM = "oklch(0.58 0.22 245 / 0.15)";
const BLUE_MID = "oklch(0.58 0.22 245 / 0.4)";
const BLUE_GLOW = "0 0 20px oklch(0.58 0.22 245 / 0.3)";

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
        background: "oklch(0.10 0.015 245)",
        transition: "background 300ms",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div
          className="font-mono text-[11px] uppercase tracking-[0.2em]"
          style={{ color: BLUE, opacity: 0.85 }}
        >
          {p.code} / {p.title}
        </div>
        <div
          className="rounded-full px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider"
          style={{
            background: BLUE_DIM,
            color: BLUE,
            border: `1px solid ${BLUE_MID}`,
          }}
        >
          observed
        </div>
      </div>

      {/* Bar chart — fixed 60px tall so bars are always visible */}
      <div className="mt-8 flex items-end gap-1.5" style={{ height: "60px" }}>
        {p.bars.map((h, i) => (
          <div
            key={i}
            className="flex-1 rounded-sm"
            style={{
              height: `${h * 0.6}px`,
              background: hovered ? BLUE : BLUE_DIM,
              border: `1px solid ${hovered ? BLUE : BLUE_MID}`,
              boxShadow: hovered ? BLUE_GLOW : "none",
              transition: [
                `background 400ms ${i * 25}ms`,
                `border-color 400ms ${i * 25}ms`,
                `box-shadow 400ms ${i * 25}ms`,
              ].join(", "),
            }}
          />
        ))}
      </div>

      {/* Metric */}
      <div className="mt-8 flex items-baseline gap-3">
        <div
          className="font-display text-[44px] leading-none tracking-tight"
          style={{
            fontVariantNumeric: "tabular-nums",
            color: BLUE,
            textShadow: hovered ? BLUE_GLOW : "none",
            transition: "text-shadow 300ms",
          }}
        >
          {p.metric}
        </div>
        <div className="text-[12px] text-muted-foreground">{p.metricLabel}</div>
      </div>

      <p className="mt-5 max-w-md text-[14px] leading-relaxed text-muted-foreground">
        {p.body}
      </p>
    </article>
  );
}

export function ProblemSection() {
  return (
    <section className="relative py-28 lg:py-40">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <SectionHeader
          eyebrow="The operational tax"
          title="Every multi-unit business pays it. Most never measure it."
          description="Four categories of compounding waste sit beneath every franchise P&L. Ezra surfaces them — and closes them — without adding headcount."
        />

        <div
          className="mt-16 grid overflow-hidden rounded-2xl md:grid-cols-2"
          style={{
            border: `1px solid ${BLUE_MID}`,
            gap: "1px",
            background: BLUE_MID,
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
