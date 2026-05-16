import { useEffect, useRef, useState } from "react";
import { SectionHeader } from "./SectionHeader";

// ── Ezra V2 brand tokens ──────────────────────────────────────────────────
// Colors: Brand Reference May 2026
// Typography: DM Sans 300/400/500/600, DM Mono 400
const PAGE_BG = "#09090B";
const CARD_BG = "#141417";
const CARD_EL = "#18181B";

// Cyan scale — primary accent
const CYAN = "#06B6D4"; // Cyan 500
const CYAN_LIGHT = "#22D3EE"; // Cyan 400
const CYAN_PALE = "rgba(6,182,212,0.10)";
const CYAN_BORDER = "rgba(6,182,212,0.28)";
const CYAN_MID = "rgba(6,182,212,0.45)";

const TEXT = "rgba(255,255,255,0.92)";
const TEXT_DIM = "rgba(255,255,255,0.55)";
const TEXT_MUTED = "rgba(255,255,255,0.30)";
const BORDER = "rgba(255,255,255,0.07)";

const STEPS = [
  {
    n: "01",
    label: "Ingest",
    title: "Every transaction, schedule, invoice and guest event.",
    body: "Native POS connectors stream raw operational signal from Toast, Square, Aloha, Revel and more — at 1.4M events per day.",
    chip: "1.4M events/day",
  },
  {
    n: "02",
    label: "Normalize",
    title: "One model across every brand, unit and shift.",
    body: "Disparate schemas are reconciled into a single operational graph: ticket → cashier → shift → unit → brand.",
    chip: "98.6% match rate",
  },
  {
    n: "03",
    label: "Detect",
    title: "Behavioral models surface what humans miss.",
    body: "Per-cashier, per-daypart anomaly models flag voids, idle labor, over-orders and vendor drift in near real-time.",
    chip: "47 anomalies / day",
  },
  {
    n: "04",
    label: "Act",
    title: "Decisions, routed to the right operator.",
    body: "Recovery workflows, schedule rebalances and order suggestions ship to ops — and report back to the P&L every quarter.",
    chip: "$2.41M recovered",
  },
];

export function BuildingSection() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const el = sectionRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const total = el.offsetHeight - window.innerHeight;
        const scrolled = Math.min(Math.max(-rect.top, 0), total);
        const p = total > 0 ? scrolled / total : 0;
        setProgress(p);
        const idx = Math.min(STEPS.length - 1, Math.floor(p * STEPS.length));
        setActive(idx);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      className="relative"
      style={{
        height: `${STEPS.length * 100}vh`,
        background: PAGE_BG,
      }}
    >
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        {/* Subtle ambient — restrained, not a blob */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: `radial-gradient(ellipse at 80% 50%, rgba(6,182,212,0.06), transparent 60%)`,
          }}
        />

        <div className="relative mx-auto grid w-full max-w-[1400px] grid-cols-1 gap-6 px-4 md:gap-8 lg:grid-cols-12 lg:gap-12 lg:px-10">
          {/* LEFT: steps */}
          <div className="lg:col-span-5">
            {/* Eyebrow — DM Mono */}
            <div
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: "10px",
                textTransform: "uppercase",
                letterSpacing: "0.22em",
                color: CYAN,
                marginBottom: "16px",
              }}
            >
              How it works
            </div>

            {/* Section heading — DM Sans 300 Light */}
            <h2
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 300,
                fontSize: "clamp(32px, 4vw, 56px)",
                lineHeight: 1.05,
                letterSpacing: "-0.035em",
                color: TEXT,
                marginBottom: "24px",
              }}
            >
              Watch the operational layer assemble itself.
            </h2>

            <ol className="mt-6 space-y-2 md:mt-8 md:space-y-1">
              {STEPS.map((s, i) => {
                const isActive = i === active;
                const isDone = i < active;
                return (
                  <li
                    key={s.n}
                    className="relative flex gap-3 rounded-xl px-3 py-3 transition-all duration-500 md:gap-4"
                    style={{
                      background: isActive ? CYAN_PALE : "transparent",
                      border: `1px solid ${
                        isActive ? CYAN_BORDER : "transparent"
                      }`,
                      opacity: isActive ? 1 : isDone ? 0.65 : 0.35,
                    }}
                  >
                    {/* Step indicator */}
                    <div className="flex w-6 flex-col items-center pt-1">
                      <span
                        className="flex h-5 w-5 items-center justify-center rounded-full transition-all duration-500"
                        style={{
                          fontFamily: "'DM Mono', monospace",
                          fontSize: "9px",
                          background: isActive
                            ? CYAN
                            : isDone
                            ? TEXT
                            : "transparent",
                          border: `1px solid ${
                            isActive
                              ? CYAN
                              : isDone
                              ? TEXT
                              : "rgba(255,255,255,0.25)"
                          }`,
                          color: isActive || isDone ? PAGE_BG : TEXT_MUTED,
                        }}
                      >
                        {isDone ? "✓" : s.n}
                      </span>
                      {i < STEPS.length - 1 && (
                        <span
                          className="mt-1 w-px flex-1 transition-all duration-700"
                          style={{
                            background: isDone ? CYAN : BORDER,
                          }}
                        />
                      )}
                    </div>

                    <div className="flex-1 pb-2 md:pb-3">
                      <div className="flex flex-col items-start justify-between gap-1 md:flex-row md:items-center md:gap-0">
                        {/* Step label — DM Mono */}
                        <span
                          style={{
                            fontFamily: "'DM Mono', monospace",
                            fontSize: "10px",
                            textTransform: "uppercase",
                            letterSpacing: "0.22em",
                            color: isActive ? CYAN : TEXT_MUTED,
                          }}
                        >
                          {s.label}
                        </span>
                        {isActive && (
                          <span
                            style={{
                              fontFamily: "'DM Mono', monospace",
                              fontSize: "9px",
                              textTransform: "uppercase",
                              letterSpacing: "0.14em",
                              background: CYAN_PALE,
                              color: CYAN,
                              border: `1px solid ${CYAN_BORDER}`,
                              borderRadius: "9999px",
                              padding: "2px 8px",
                            }}
                          >
                            {s.chip}
                          </span>
                        )}
                      </div>

                      {/* Step title — DM Sans Medium */}
                      <h4
                        className="mt-2"
                        style={{
                          fontFamily: "'DM Sans', sans-serif",
                          fontWeight: 500,
                          fontSize: "15px",
                          lineHeight: 1.3,
                          letterSpacing: "-0.01em",
                          color: TEXT,
                          margin: "8px 0 0",
                        }}
                      >
                        {s.title}
                      </h4>

                      {/* Step body — DM Sans Regular, animated reveal */}
                      <div
                        style={{
                          maxHeight: isActive ? "100px" : "0",
                          overflow: "hidden",
                          transition:
                            "max-height 500ms cubic-bezier(0.16,1,0.3,1)",
                        }}
                      >
                        <p
                          style={{
                            fontFamily: "'DM Sans', sans-serif",
                            fontWeight: 400,
                            fontSize: "13px",
                            lineHeight: 1.55,
                            color: TEXT_DIM,
                            marginTop: "8px",
                          }}
                        >
                          {s.body}
                        </p>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>

          {/* RIGHT: pipeline visual */}
          <div className="lg:col-span-6 lg:col-start-7">
            <BuildVisual
              active={active}
              progress={progress}
              isMobile={isMobile}
            />
          </div>
        </div>

        {/* Progress bar — bottom, cyan */}
        <div
          className="absolute bottom-0 left-0 right-0 h-px"
          style={{ background: BORDER }}
        >
          <div
            className="h-full transition-[width] duration-200"
            style={{
              width: `${progress * 100}%`,
              background: `linear-gradient(to right, ${CYAN}, ${CYAN_LIGHT})`,
            }}
          />
        </div>
      </div>
    </section>
  );
}

// ── Build Visual ─────────────────────────────────────────────────────────────

const SOURCES = ["Toast", "Square", "Aloha", "Revel", "Lightspeed", "Clover"];
const ANOMALIES = [
  { l: "Void cluster", severity: "high", v: "High" },
  { l: "Idle labor", severity: "med", v: "Med" },
  { l: "Over-order", severity: "med", v: "Med" },
  { l: "Vendor drift", severity: "low", v: "Low" },
];

// Severity colors — module accents, functional not decorative
const SEV_COLOR: Record<string, string> = {
  high: "#F87171", // red-ish — danger
  med: "#FBBF24", // amber — warning
  low: "#06B6D4", // cyan — informational
};

function BuildVisual({
  active,
  progress,
  isMobile,
}: {
  active: number;
  progress: number;
  isMobile: boolean;
}) {
  const local = progress * STEPS.length - active;

  return (
    <div
      className="relative w-full overflow-hidden rounded-2xl"
      style={{
        height: isMobile ? "380px" : "440px",
        background: PAGE_BG,
        border: `1px solid ${CYAN_BORDER}`,
        // No drop shadow — brand principle 03
      }}
    >
      {/* Chrome header */}
      <div
        className="flex items-center justify-between px-3 py-2 md:px-5 md:py-2.5"
        style={{ borderBottom: `1px solid ${CYAN_PALE}` }}
      >
        <div className="flex items-center gap-1.5 md:gap-2">
          <span
            className="inline-block h-1.5 w-1.5 rounded-full"
            style={{ background: CYAN }}
          />
          <span
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: isMobile ? "8px" : "10px",
              textTransform: "uppercase",
              letterSpacing: "0.22em",
              color: TEXT_MUTED,
            }}
          >
            ezra · build pipeline
          </span>
        </div>
        <div className="flex items-center gap-2 md:gap-3">
          {STEPS.map((_, i) => (
            <span
              key={i}
              className="h-1 rounded-full transition-all duration-500"
              style={{
                width:
                  i === active
                    ? isMobile
                      ? "16px"
                      : "20px"
                    : isMobile
                    ? "4px"
                    : "6px",
                background: i <= active ? CYAN : "rgba(255,255,255,0.18)",
                opacity: i <= active ? 1 : 0.4,
              }}
            />
          ))}
          <span
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: isMobile ? "8px" : "10px",
              color: TEXT_MUTED,
              marginLeft: "2px",
            }}
          >
            {active + 1}/{STEPS.length}
          </span>
        </div>
      </div>

      <div
        className="relative"
        style={{
          height: "calc(100% - 42px)",
          padding: isMobile ? "12px" : "16px",
        }}
      >
        {/* LAYER 1: Source tiles */}
        <div
          style={{
            position: "absolute",
            top: isMobile ? 12 : 16,
            left: isMobile ? 12 : 16,
            right: isMobile ? 12 : 16,
          }}
        >
          <div
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: isMobile ? "8px" : "9px",
              textTransform: "uppercase",
              letterSpacing: "0.18em",
              color: CYAN,
              opacity: 0.7,
              marginBottom: isMobile ? "4px" : "6px",
            }}
          >
            § POS Sources
          </div>
          <div className="grid grid-cols-2 gap-1.5 md:grid-cols-3 md:gap-2">
            {SOURCES.map((s, i) => {
              const visible = active >= 0;
              const barW = visible ? 55 + ((i * 13 + active * 9) % 38) : 0;
              return (
                <div
                  key={s}
                  className="rounded-lg px-2 py-1 md:px-3 md:py-1.5"
                  style={{
                    background: CARD_BG,
                    border: `1px solid ${CYAN_PALE}`,
                    opacity: visible ? 1 : 0,
                    transform: visible ? "translateY(0)" : "translateY(10px)",
                    transition: `opacity 500ms ${i * 55}ms, transform 500ms ${
                      i * 55
                    }ms`,
                  }}
                >
                  <div className="flex items-center justify-between">
                    {/* Source name — DM Sans */}
                    <span
                      style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontWeight: 500,
                        fontSize: isMobile ? "9px" : "11px",
                        color: TEXT,
                      }}
                    >
                      {s}
                    </span>
                    <span
                      className="rounded-full"
                      style={{
                        width: isMobile ? "4px" : "6px",
                        height: isMobile ? "4px" : "6px",
                        background: CYAN,
                        animation: "pulse 1.8s ease-in-out infinite",
                        animationDelay: `${i * 200}ms`,
                      }}
                    />
                  </div>
                  <div
                    className="mt-1 h-0.5 w-full overflow-hidden rounded-full md:mt-1.5"
                    style={{ background: CYAN_PALE }}
                  >
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${barW}%`,
                        background: `linear-gradient(to right, ${CYAN}, ${CYAN_LIGHT})`,
                        transition: "width 900ms ease-out",
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* SVG connector lines */}
        <svg
          viewBox={isMobile ? "0 0 280 360" : "0 0 560 420"}
          preserveAspectRatio="none"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            pointerEvents: "none",
          }}
        >
          <defs>
            <linearGradient id="bg-cyan" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor={CYAN} stopOpacity="0.45" />
              <stop offset="100%" stopColor={CYAN} stopOpacity="0.04" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="1.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          {Array.from({ length: 6 }).map((_, i) => {
            const x = isMobile ? 20 + i * 40 : 48 + i * 94;
            const drawn = active >= 1 ? 1 : 0;
            const len = isMobile ? 80 : 180;
            const y1 = isMobile ? 100 : 120;
            const y2 = isMobile ? 200 : 230;
            const x2 = isMobile ? 140 : 280;
            return (
              <line
                key={i}
                x1={x}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="url(#bg-cyan)"
                strokeWidth="1.5"
                strokeDasharray={len}
                strokeDashoffset={(1 - drawn) * len}
                filter="url(#glow)"
                style={{
                  transition: `stroke-dashoffset 700ms ${i * 70}ms ease-out`,
                }}
              />
            );
          })}
          {active >= 2 &&
            Array.from({ length: 4 }).map((_, i) => {
              const x2 = isMobile ? 30 + i * 70 : 90 + i * 128;
              const y1 = isMobile ? 250 : 290;
              const y2 = isMobile ? 290 : 340;
              const x1 = isMobile ? 140 : 280;
              return (
                <line
                  key={`d-${i}`}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={CYAN}
                  strokeWidth="1"
                  strokeDasharray="4 4"
                  opacity="0.45"
                  filter="url(#glow)"
                />
              );
            })}
          {active >= 3 && (
            <line
              x1={isMobile ? 140 : 280}
              y1={isMobile ? 320 : 380}
              x2={isMobile ? 140 : 280}
              y2={isMobile ? 340 : 400}
              stroke={CYAN}
              strokeWidth="2"
              opacity="0.75"
              filter="url(#glow)"
            />
          )}
        </svg>

        {/* LAYER 2: Operational graph (Normalize) */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: isMobile ? "46%" : "44%",
            transform: `translate(-50%, -50%) scale(${active >= 1 ? 1 : 0.88})`,
            opacity: active >= 1 ? 1 : 0.1,
            transition: "all 700ms cubic-bezier(0.16,1,0.3,1)",
            width: isMobile ? "200px" : "260px",
          }}
        >
          <div
            className="overflow-hidden rounded-xl p-2 md:p-3"
            style={{
              background: TEXT, // uses light surface for graph node — brand contrast
              border: `1px solid ${CYAN_BORDER}`,
            }}
          >
            <div
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: isMobile ? "8px" : "9px",
                textTransform: "uppercase",
                letterSpacing: "0.20em",
                color: PAGE_BG,
                opacity: 0.5,
                marginBottom: "4px",
              }}
            >
              Operational graph
            </div>
            <div
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: isMobile ? "11px" : "14px",
                lineHeight: 1.2,
                letterSpacing: "-0.01em",
                color: PAGE_BG,
              }}
            >
              ticket → shift → unit → brand
            </div>
            <div className="mt-1.5 grid grid-cols-8 gap-0.5 md:mt-2 md:gap-1">
              {Array.from({ length: 16 }).map((_, i) => {
                const filled =
                  active >= 1 &&
                  i <=
                    Math.floor((active >= 1 ? local : 0) * 16) +
                      (active - 1) * 4;
                return (
                  <div
                    key={i}
                    className="h-1 rounded-sm transition-all duration-300 md:h-1.5"
                    style={{
                      background: filled ? CYAN : PAGE_BG,
                      opacity: filled ? 1 : 0.12,
                    }}
                  />
                );
              })}
            </div>
            {active >= 2 && (
              <div
                className="mt-1.5 flex items-center justify-between md:mt-2"
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: isMobile ? "8px" : "10px",
                  color: PAGE_BG,
                  opacity: 0.55,
                }}
              >
                <span>records matched</span>
                <span
                  style={{
                    color: CYAN,
                    opacity: 1,
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  98.6%
                </span>
              </div>
            )}
          </div>
        </div>

        {/* LAYER 3: Anomaly tiles (Detect) */}
        <div
          style={{
            position: "absolute",
            bottom: isMobile ? 48 : 56,
            left: isMobile ? 12 : 16,
            right: isMobile ? 12 : 16,
          }}
        >
          <div
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: isMobile ? "8px" : "9px",
              textTransform: "uppercase",
              letterSpacing: "0.18em",
              color: CYAN,
              opacity: active >= 2 ? 0.7 : 0,
              transition: "opacity 500ms",
              marginBottom: isMobile ? "4px" : "6px",
            }}
          >
            § Detected anomalies
          </div>
          <div className="grid grid-cols-2 gap-1.5 md:grid-cols-4 md:gap-2">
            {ANOMALIES.map((a, i) => {
              const visible = active >= 2;
              const c = SEV_COLOR[a.severity];
              return (
                <div
                  key={a.l}
                  className="rounded-lg p-1.5 md:p-2"
                  style={{
                    background: CARD_BG,
                    border: `1px solid ${visible ? `${c}44` : CYAN_PALE}`,
                    opacity: visible ? 1 : 0,
                    transform: visible ? "translateY(0)" : "translateY(10px)",
                    transition: `opacity 450ms ${i * 80}ms, transform 450ms ${
                      i * 80
                    }ms`,
                  }}
                >
                  {/* Label — DM Sans */}
                  <div
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontWeight: 500,
                      fontSize: isMobile ? "9px" : "10px",
                      lineHeight: 1.3,
                      color: TEXT,
                    }}
                  >
                    {a.l}
                  </div>
                  {/* Severity — DM Mono */}
                  <div
                    style={{
                      fontFamily: "'DM Mono', monospace",
                      fontSize: isMobile ? "7px" : "8px",
                      marginTop: isMobile ? "2px" : "4px",
                      color: c,
                    }}
                  >
                    ● {a.v}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* LAYER 4: Decision pill (Act) */}
        <div
          style={{
            position: "absolute",
            bottom: isMobile ? 8 : 12,
            left: isMobile ? 12 : 16,
            right: isMobile ? 12 : 16,
            opacity: active >= 3 ? 1 : 0,
            transform: active >= 3 ? "translateY(0)" : "translateY(14px)",
            transition: "opacity 600ms, transform 600ms",
          }}
        >
          <div
            className="flex flex-col items-start justify-between gap-2 rounded-xl px-2 py-1.5 md:flex-row md:items-center md:gap-0 md:px-3 md:py-2"
            style={{
              background: TEXT, // light surface for the decision pill — contrast
              border: `1px solid ${CYAN_BORDER}`,
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: isMobile ? "7px" : "8px",
                  textTransform: "uppercase",
                  letterSpacing: "0.20em",
                  color: PAGE_BG,
                  opacity: 0.5,
                }}
              >
                Decision routed
              </div>
              {/* Decision text — DM Sans Medium */}
              <div
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 500,
                  fontSize: isMobile ? "9px" : "11px",
                  color: PAGE_BG,
                  marginTop: "2px",
                }}
              >
                Rebalance shift · Store #0307 · saves $684
              </div>
            </div>
            <div className="flex items-center gap-1.5 md:gap-2">
              {/* Badge — Cyan 500 fill, dark text */}
              <span
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: isMobile ? "8px" : "9px",
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                  background: CYAN,
                  color: PAGE_BG,
                  borderRadius: "6px",
                  padding: isMobile ? "2px 6px" : "2px 8px",
                }}
              >
                auto-fixed
              </span>
              <span
                style={{
                  color: PAGE_BG,
                  opacity: 0.4,
                  fontSize: isMobile ? 9 : 11,
                }}
              >
                →
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
