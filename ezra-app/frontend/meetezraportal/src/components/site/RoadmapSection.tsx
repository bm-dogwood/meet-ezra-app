import { SectionHeader } from "./SectionHeader";

const BLUE = "#378ADD";
const BLUE_DEEP = "#185FA5";
const BLUE_LIGHT = "#B5D4F4";
const BLUE_PALE = "rgba(55,138,221,0.12)";
const BLUE_BORDER = "rgba(55,138,221,0.30)";

const ROADMAP = [
  {
    q: "Q2 2025",
    s: "Shipped",
    title: "Loss Prevention v2 + Inventory variance engine",
    items: [
      "Per-cashier behavioral models",
      "Theoretical-vs-actual at SKU level",
    ],
  },
  {
    q: "Q3 2025",
    s: "Shipped",
    title: "Scheduling & Exponential CRM",
    items: [
      "Demand-aware shift builder",
      "Identity resolution across POS",
      "Retention journeys",
    ],
  },
  {
    q: "Q4 2025",
    s: "In flight",
    title: "Sales intelligence & menu engineering",
    items: [
      "Margin re-engineering",
      "Top-quartile unit replication",
      "Aloha & Revel native",
    ],
  },
  {
    q: "Q1 2026",
    s: "Planned",
    title: "Vendor intelligence & off-contract recovery",
    items: [
      "Invoice OCR + reconciliation",
      "Vendor benchmarking",
      "Auto-renegotiation packs",
    ],
  },
  {
    q: "Q2 2026",
    s: "Planned",
    title: "Multi-brand portfolio console",
    items: [
      "Holding-company view",
      "Cross-brand benchmarks",
      "Acquisition diligence module",
    ],
  },
];

const STATUS_CONFIG = {
  Shipped: {
    dot: BLUE,
    dotShadow: `0 0 8px ${BLUE}`,
    label: BLUE_LIGHT,
    cardBorder: BLUE_BORDER,
    cardBg: BLUE_PALE,
  },
  "In flight": {
    dot: "#ffffff",
    dotShadow: "0 0 6px rgba(255,255,255,0.4)",
    label: "rgba(255,255,255,0.70)",
    cardBorder: "rgba(255,255,255,0.14)",
    cardBg: "rgba(255,255,255,0.05)",
  },
  Planned: {
    dot: "rgba(255,255,255,0.20)",
    dotShadow: "none",
    label: "rgba(255,255,255,0.30)",
    cardBorder: "rgba(255,255,255,0.07)",
    cardBg: "transparent",
  },
};

export function RoadmapSection() {
  return (
    <section id="roadmap" className="relative bg-surface py-28 lg:py-40">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <SectionHeader
          eyebrow="Roadmap"
          title="Where Ezra is going."
          description="A multi-year build to become the operating system of multi-unit businesses."
        />

        <div className="mt-20 relative">
          {/* Timeline rail */}
          <div
            className="absolute left-0 right-0 top-[42px] hidden h-px lg:block"
            style={{
              background: `linear-gradient(to right, ${BLUE_BORDER}, ${BLUE_BORDER} 40%, rgba(55,138,221,0.08) 100%)`,
            }}
          />

          <div className="grid gap-10 lg:grid-cols-5">
            {ROADMAP.map((r) => {
              const cfg = STATUS_CONFIG[r.s as keyof typeof STATUS_CONFIG];
              return (
                <div key={r.q} className="relative">
                  {/* Status marker */}
                  <div className="flex items-center gap-2">
                    <span
                      className="h-2 w-2 rounded-full flex-shrink-0"
                      style={{
                        background: cfg.dot,
                        boxShadow: cfg.dotShadow,
                      }}
                    />
                    <span
                      className="font-mono text-[10px] uppercase tracking-[0.22em]"
                      style={{ color: cfg.label }}
                    >
                      {r.q} · {r.s}
                    </span>
                  </div>

                  {/* Card */}
                  <div
                    className="mt-6 lg:mt-12 rounded-xl p-4"
                    style={{
                      background: cfg.cardBg,
                      border: `1px solid ${cfg.cardBorder}`,
                    }}
                  >
                    <h4
                      className="font-display text-[18px] leading-tight tracking-tight"
                      style={{
                        color:
                          r.s === "Planned"
                            ? "rgba(255,255,255,0.40)"
                            : r.s === "In flight"
                            ? "rgba(255,255,255,0.85)"
                            : "#ffffff",
                      }}
                    >
                      {r.title}
                    </h4>

                    <ul className="mt-4 space-y-1.5">
                      {r.items.map((item) => (
                        <li
                          key={item}
                          className="flex items-start gap-1.5 text-[12px] leading-relaxed"
                          style={{
                            color:
                              r.s === "Shipped"
                                ? BLUE_LIGHT
                                : r.s === "In flight"
                                ? "rgba(255,255,255,0.45)"
                                : "rgba(255,255,255,0.22)",
                          }}
                        >
                          <span
                            className="mt-[5px] h-1 w-1 rounded-full flex-shrink-0"
                            style={{
                              background:
                                r.s === "Shipped"
                                  ? BLUE
                                  : "rgba(255,255,255,0.25)",
                            }}
                          />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
