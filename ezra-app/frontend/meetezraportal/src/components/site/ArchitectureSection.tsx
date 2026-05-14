import { SectionHeader } from "./SectionHeader";

const BLUE = "#378ADD";
const BLUE_DEEP = "#185FA5";
const BLUE_TEXT = "#0C447C";
const BLUE_PALE = "rgba(55,138,221,0.10)";
const BLUE_PALE2 = "rgba(55,138,221,0.18)";
const BLUE_BORDER = "rgba(55,138,221,0.35)";
const BLUE_LIGHT = "#B5D4F4";

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
    <section id="architecture" className="relative bg-surface py-28 lg:py-40">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <div
          className="font-mono text-[10px] uppercase tracking-[0.22em]"
          style={{ color: BLUE }}
        >
          Architecture
        </div>
        <SectionHeader
          eyebrow=""
          title="The operational layer between your POS and your decisions."
          description="Ezra ingests every transaction, schedule, invoice and guest interaction — normalizes them — and outputs decisions, not dashboards."
        />

        <div
          className="mt-20 rounded-2xl p-8 lg:p-14"
          style={{
            background: "#f5f6f8",
            border: "1px solid rgba(0,0,0,0.09)",
            boxShadow: "0 4px 32px rgba(0,0,0,0.08)",
          }}
        >
          <div className="grid items-center gap-10 lg:grid-cols-[1fr_auto_1fr_auto_1fr]">
            {/* Sources */}
            <div>
              <div
                className="font-mono text-[10px] uppercase tracking-[0.22em]"
                style={{ color: "rgba(13,15,20,0.36)" }}
              >
                Sources
              </div>
              <div className="mt-4 space-y-2">
                {SOURCES.map((s) => (
                  <div
                    key={s}
                    className="flex items-center justify-between rounded-md px-3 py-2.5"
                    style={{
                      background: "#ffffff",
                      border: "1px solid rgba(0,0,0,0.09)",
                    }}
                  >
                    <span
                      className="text-[13px] font-medium"
                      style={{ color: "#0d0f14" }}
                    >
                      {s}
                    </span>
                    <span
                      className="rounded px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider"
                      style={{
                        background: BLUE_PALE2,
                        color: BLUE_TEXT,
                        border: `0.5px solid ${BLUE_BORDER}`,
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
                stroke={BLUE_LIGHT}
                strokeWidth="1.5"
                strokeDasharray="4 3"
              />
              <path
                d="M36,18 L44,24 L36,30"
                stroke={BLUE}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            {/* Ezra core */}
            <div
              className="relative overflow-hidden rounded-2xl p-6"
              style={{
                background: BLUE_TEXT,
                border: `1px solid ${BLUE}`,
                boxShadow: `0 20px 60px -10px rgba(0,0,0,0.22), 0 0 0 1px ${BLUE_BORDER}`,
              }}
            >
              <div
                className="font-mono text-[10px] uppercase tracking-[0.22em]"
                style={{ color: "rgba(181,212,244,0.55)" }}
              >
                Ezra Layer
              </div>
              <div
                className="mt-3 font-display text-[24px] leading-tight tracking-tight"
                style={{ color: "#fff" }}
              >
                Operational intelligence engine
              </div>
              <div className="mt-5 space-y-1.5">
                {PIPELINE.map((p, i) => (
                  <div
                    key={p}
                    className="flex items-center justify-between rounded-md px-3 py-2"
                    style={{
                      background: "rgba(181,212,244,0.08)",
                      border: "1px solid rgba(181,212,244,0.14)",
                    }}
                  >
                    <span
                      className="text-[12px]"
                      style={{ color: "rgba(255,255,255,0.85)" }}
                    >
                      {p}
                    </span>
                    <span
                      className="font-mono text-[9px]"
                      style={{ color: "rgba(181,212,244,0.40)" }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                ))}
              </div>
              <div
                className="mt-5 flex items-center gap-2 border-t pt-4"
                style={{ borderColor: "rgba(181,212,244,0.14)" }}
              >
                <span
                  className="inline-block h-1.5 w-1.5 rounded-full animate-pulse"
                  style={{ background: BLUE }}
                />
                <span
                  className="font-mono text-[10px] uppercase tracking-wider"
                  style={{ color: "rgba(181,212,244,0.45)" }}
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
                stroke={BLUE_LIGHT}
                strokeWidth="1.5"
                strokeDasharray="4 3"
              />
              <path
                d="M36,18 L44,24 L36,30"
                stroke={BLUE}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            {/* Decisions */}
            <div>
              <div
                className="font-mono text-[10px] uppercase tracking-[0.22em]"
                style={{ color: "rgba(13,15,20,0.36)" }}
              >
                Decisions
              </div>
              <div className="mt-4 space-y-2">
                {DECISIONS.map((d) => (
                  <div
                    key={d}
                    className="flex items-center justify-between rounded-md px-3 py-2.5 transition-colors hover:bg-[rgba(55,138,221,0.18)]"
                    style={{
                      background: BLUE_PALE,
                      border: `1px solid ${BLUE_BORDER}`,
                    }}
                  >
                    <span
                      className="text-[13px] font-medium"
                      style={{ color: "#0d0f14" }}
                    >
                      {d}
                    </span>
                    <span
                      className="font-mono text-[9px] uppercase tracking-wider"
                      style={{ color: BLUE_DEEP }}
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
