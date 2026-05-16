import { SectionHeader } from "./SectionHeader";

// ── Ezra V2 brand tokens ──────────────────────────────────────────────────
// Colors: Brand Reference May 2026
// Typography: DM Sans 300/400/500/600, DM Mono 400
const PAGE_BG = "#09090B";

// Cyan scale — primary brand accent
const CYAN = "#06B6D4"; // Cyan 500
const CYAN_LIGHT = "#22D3EE"; // Cyan 400
const CYAN_100 = "#CFFAFE"; // Cyan 100 — light fill label
const CYAN_PALE = "rgba(6,182,212,0.10)";
const CYAN_BG = "rgba(6,182,212,0.06)";
const CYAN_BORDER = "rgba(6,182,212,0.28)";

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

// Status config — uses brand cyan for Shipped; white/muted for others
const STATUS_CONFIG = {
  Shipped: {
    dot: CYAN,
    dotShadow: "none", // no glow — brand principle 03
    label: CYAN_100,
    cardBorder: CYAN_BORDER,
    cardBg: CYAN_BG,
    titleColor: "#ffffff",
    itemColor: CYAN_LIGHT,
    itemDot: CYAN,
  },
  "In flight": {
    dot: "#ffffff",
    dotShadow: "none",
    label: "rgba(255,255,255,0.70)",
    cardBorder: "rgba(255,255,255,0.14)",
    cardBg: "rgba(255,255,255,0.04)",
    titleColor: "rgba(255,255,255,0.85)",
    itemColor: "rgba(255,255,255,0.45)",
    itemDot: "rgba(255,255,255,0.30)",
  },
  Planned: {
    dot: "rgba(255,255,255,0.20)",
    dotShadow: "none",
    label: "rgba(255,255,255,0.28)",
    cardBorder: "rgba(255,255,255,0.07)",
    cardBg: "transparent",
    titleColor: "rgba(255,255,255,0.38)",
    itemColor: "rgba(255,255,255,0.20)",
    itemDot: "rgba(255,255,255,0.18)",
  },
};

export function RoadmapSection() {
  return (
    <section
      id="roadmap"
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
          Roadmap
        </div>

        {/* Section heading — DM Sans 300 Light, editorial */}
        <h2
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 300,
            fontSize: "clamp(40px, 6vw, 72px)",
            lineHeight: 1.02,
            letterSpacing: "-0.035em",
            color: "rgba(255,255,255,0.92)",
            maxWidth: "18ch",
          }}
        >
          Where Ezra is going.
        </h2>

        {/* Description — DM Sans Regular */}
        <p
          style={{
            marginTop: "16px",
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 400,
            fontSize: "16px",
            lineHeight: 1.55,
            color: "rgba(255,255,255,0.55)",
            maxWidth: "52ch",
          }}
        >
          A multi-year build to become the operating system of multi-unit
          businesses.
        </p>

        <div className="mt-20 relative">
          {/* Timeline rail — hairline, gradient fade */}
          <div
            className="absolute left-0 right-0 top-[42px] hidden h-px lg:block"
            style={{
              background: `linear-gradient(to right, ${CYAN_BORDER}, ${CYAN_BORDER} 40%, rgba(6,182,212,0.06) 100%)`,
            }}
          />

          <div className="grid gap-10 lg:grid-cols-5">
            {ROADMAP.map((r) => {
              const cfg = STATUS_CONFIG[r.s as keyof typeof STATUS_CONFIG];
              return (
                <div key={r.q} className="relative">
                  {/* Status marker — DM Mono label */}
                  <div className="flex items-center gap-2">
                    <span
                      className="h-2 w-2 rounded-full flex-shrink-0"
                      style={{ background: cfg.dot }}
                    />
                    <span
                      style={{
                        fontFamily: "'DM Mono', monospace",
                        fontWeight: 400,
                        fontSize: "10px",
                        textTransform: "uppercase",
                        letterSpacing: "0.20em",
                        color: cfg.label,
                      }}
                    >
                      {r.q} · {r.s}
                    </span>
                  </div>

                  {/* Card — hairline border, no drop shadow */}
                  <div
                    className="mt-6 lg:mt-12 rounded-xl p-4"
                    style={{
                      background: cfg.cardBg,
                      border: `1px solid ${cfg.cardBorder}`,
                    }}
                  >
                    {/* Card title — DM Sans Semibold, H3 scale */}
                    <h4
                      style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontWeight: 600,
                        fontSize: "18px",
                        lineHeight: 1.2,
                        letterSpacing: "-0.01em",
                        color: cfg.titleColor,
                        margin: 0,
                      }}
                    >
                      {r.title}
                    </h4>

                    <ul className="mt-4 space-y-1.5">
                      {r.items.map((item) => (
                        <li
                          key={item}
                          className="flex items-start gap-1.5"
                          style={{
                            fontFamily: "'DM Sans', sans-serif",
                            fontWeight: 400,
                            fontSize: "12px",
                            lineHeight: 1.55,
                            color: cfg.itemColor,
                          }}
                        >
                          <span
                            className="mt-[5px] h-1 w-1 rounded-full flex-shrink-0"
                            style={{ background: cfg.itemDot }}
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
