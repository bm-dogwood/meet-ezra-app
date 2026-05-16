import { SectionHeader } from "./SectionHeader";

// ── Ezra V2 brand tokens ──────────────────────────────────────────────────
// Colors: Brand Reference May 2026
// Typography: DM Sans 300/400/500/600, DM Mono 400
const PAGE_BG = "#09090B";
const CARD_BG = "#141417";

// Light-mode surface for the architecture diagram (brand uses light for docs/diagrams)
const DIAGRAM_BG = "#F5F6F8";
const DIAGRAM_BORDER = "rgba(0,0,0,0.09)";

// Cyan scale
const CYAN = "#06B6D4"; // Cyan 500 — primary
const CYAN_700 = "#0E7490"; // Cyan 700 — headings on light surfaces
const CYAN_LIGHT = "#22D3EE"; // Cyan 400
const CYAN_100 = "#CFFAFE"; // Cyan 100
const CYAN_PALE = "rgba(6,182,212,0.10)";
const CYAN_PALE2 = "rgba(6,182,212,0.18)";
const CYAN_BORDER = "rgba(6,182,212,0.30)";

// Dark neutrals — Zinc scale
const ZINC_800 = "#27272A";
const ZINC_400 = "#A1A1AA";

const TEXT_DARK = "#0D0F14"; // primary on light bg
const TEXT_MEDIUM = "#3F3F46"; // secondary on light bg

const SOURCES = ["Toast", "Square", "Aloha", "Revel", "Lightspeed", "Clover"];
const DECISIONS = [
  "Loss prevention alerts",
  "Schedule auto-balance",
  "Order suggestions",
  "Retention journeys",
  "Menu engineering",
  "Vendor renegotiation",
];
const PIPELINE = ["Normalize", "Detect", "Recommend", "Act"];

export function ArchitectureSection() {
  return (
    <section
      id="architecture"
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
          Architecture
        </div>

        {/* Section heading — DM Sans 300 Light */}
        <h2
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 300,
            fontSize: "clamp(36px, 5vw, 64px)",
            lineHeight: 1.05,
            letterSpacing: "-0.035em",
            color: "rgba(255,255,255,0.92)",
            maxWidth: "22ch",
          }}
        >
          The operational layer between your POS and your decisions.
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
            maxWidth: "56ch",
          }}
        >
          Ezra ingests every transaction, schedule, invoice and guest
          interaction — normalizes them — and outputs decisions, not dashboards.
        </p>

        {/* Diagram — light surface per brand (light for docs/diagrams) */}
        <div
          className="mt-20 rounded-2xl p-8 lg:p-14"
          style={{
            background: DIAGRAM_BG,
            border: `1px solid ${DIAGRAM_BORDER}`,
            // No drop shadow — brand principle 03
          }}
        >
          <div className="grid items-center gap-10 lg:grid-cols-[1fr_auto_1fr_auto_1fr]">
            {/* Sources */}
            <div>
              <div
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "10px",
                  textTransform: "uppercase",
                  letterSpacing: "0.22em",
                  color: ZINC_400,
                  marginBottom: "16px",
                }}
              >
                Sources
              </div>
              <div className="space-y-2">
                {SOURCES.map((s) => (
                  <div
                    key={s}
                    className="flex items-center justify-between rounded-md px-3 py-2.5"
                    style={{
                      background: "#ffffff",
                      border: `1px solid ${DIAGRAM_BORDER}`,
                    }}
                  >
                    {/* Source name — DM Sans Medium */}
                    <span
                      style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontWeight: 500,
                        fontSize: "13px",
                        color: TEXT_DARK,
                      }}
                    >
                      {s}
                    </span>
                    {/* POS badge — Cyan on light surface */}
                    <span
                      style={{
                        fontFamily: "'DM Mono', monospace",
                        fontSize: "9px",
                        textTransform: "uppercase",
                        letterSpacing: "0.12em",
                        background: CYAN_PALE2,
                        color: CYAN_700,
                        border: `0.5px solid ${CYAN_BORDER}`,
                        borderRadius: "4px",
                        padding: "2px 6px",
                      }}
                    >
                      POS
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Arrow */}
            <svg
              className="hidden h-10 w-10 lg:block"
              viewBox="0 0 48 48"
              fill="none"
            >
              <line
                x1="0"
                y1="24"
                x2="40"
                y2="24"
                stroke={CYAN_100}
                strokeWidth="1.5"
                strokeDasharray="4 3"
              />
              <path
                d="M36,18 L44,24 L36,30"
                stroke={CYAN}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            {/* Ezra core — Cyan 700 dark surface, editorial */}
            <div
              className="relative overflow-hidden rounded-2xl p-6"
              style={{
                background: CYAN_700,
                border: `1px solid ${CYAN}`,
                // No drop shadow — brand principle 03
              }}
            >
              {/* Eyebrow */}
              <div
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "10px",
                  textTransform: "uppercase",
                  letterSpacing: "0.22em",
                  color: "rgba(207,250,254,0.55)",
                  marginBottom: "12px",
                }}
              >
                Ezra Layer
              </div>

              {/* Heading — DM Sans 400 Regular */}
              <div
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 400,
                  fontSize: "24px",
                  lineHeight: 1.15,
                  letterSpacing: "-0.02em",
                  color: "#ffffff",
                  marginBottom: "20px",
                }}
              >
                Operational intelligence engine
              </div>

              <div className="space-y-1.5">
                {PIPELINE.map((p, i) => (
                  <div
                    key={p}
                    className="flex items-center justify-between rounded-md px-3 py-2"
                    style={{
                      background: "rgba(207,250,254,0.08)",
                      border: "1px solid rgba(207,250,254,0.14)",
                    }}
                  >
                    {/* Step — DM Sans Regular */}
                    <span
                      style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontWeight: 400,
                        fontSize: "12px",
                        color: "rgba(255,255,255,0.85)",
                      }}
                    >
                      {p}
                    </span>
                    {/* Index — DM Mono */}
                    <span
                      style={{
                        fontFamily: "'DM Mono', monospace",
                        fontSize: "9px",
                        color: "rgba(207,250,254,0.40)",
                      }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                ))}
              </div>

              {/* Live indicator */}
              <div
                className="mt-5 flex items-center gap-2 border-t pt-4"
                style={{ borderColor: "rgba(207,250,254,0.14)" }}
              >
                <span
                  className="inline-block h-1.5 w-1.5 rounded-full animate-pulse"
                  style={{ background: CYAN_LIGHT }}
                />
                <span
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: "10px",
                    textTransform: "uppercase",
                    letterSpacing: "0.16em",
                    color: "rgba(207,250,254,0.45)",
                  }}
                >
                  1.4M events / day
                </span>
              </div>
            </div>

            {/* Arrow */}
            <svg
              className="hidden h-10 w-10 lg:block"
              viewBox="0 0 48 48"
              fill="none"
            >
              <line
                x1="0"
                y1="24"
                x2="40"
                y2="24"
                stroke={CYAN_100}
                strokeWidth="1.5"
                strokeDasharray="4 3"
              />
              <path
                d="M36,18 L44,24 L36,30"
                stroke={CYAN}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            {/* Decisions */}
            <div>
              <div
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "10px",
                  textTransform: "uppercase",
                  letterSpacing: "0.22em",
                  color: ZINC_400,
                  marginBottom: "16px",
                }}
              >
                Decisions
              </div>
              <div className="space-y-2">
                {DECISIONS.map((d) => (
                  <div
                    key={d}
                    className="flex items-center justify-between rounded-md px-3 py-2.5 transition-colors hover:bg-[rgba(6,182,212,0.18)]"
                    style={{
                      background: CYAN_PALE,
                      border: `1px solid ${CYAN_BORDER}`,
                    }}
                  >
                    {/* Decision — DM Sans Medium */}
                    <span
                      style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontWeight: 500,
                        fontSize: "13px",
                        color: TEXT_DARK,
                      }}
                    >
                      {d}
                    </span>
                    {/* Live badge — DM Mono */}
                    <span
                      style={{
                        fontFamily: "'DM Mono', monospace",
                        fontSize: "9px",
                        textTransform: "uppercase",
                        letterSpacing: "0.12em",
                        color: CYAN_700,
                      }}
                    >
                      live
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
