import { useEffect, useRef, useState } from "react";
import { SectionHeader } from "./SectionHeader";

// ─── Blue accent tokens ────────────────────────────────────────────────────
const BLUE = "oklch(0.58 0.22 245)";
const BLUE_DIM = "oklch(0.58 0.22 245 / 0.18)";
const BLUE_MID = "oklch(0.58 0.22 245 / 0.45)";
const BLUE_GLOW = "0 0 24px oklch(0.58 0.22 245 / 0.35)";

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
      ref={sectionRef}
      className="relative"
      style={{
        height: `${STEPS.length * 100}vh`,
        background: "var(--background)",
      }}
    >
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        {/* Simplified background - just a subtle single gradient */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: `radial-gradient(ellipse at 80% 50%, oklch(0.55 0.18 245 / 0.08), transparent 60%)`,
          }}
        />

        <div className="relative mx-auto grid w-full max-w-[1400px] grid-cols-1 gap-8 px-6 lg:grid-cols-12 lg:gap-12 lg:px-10">
          {/* LEFT: steps */}
          <div className="lg:col-span-5">
            <SectionHeader
              eyebrow="How it works"
              title="Watch the operational layer assemble itself."
            />

            <ol className="mt-8 space-y-1">
              {STEPS.map((s, i) => {
                const isActive = i === active;
                const isDone = i < active;
                return (
                  <li
                    key={s.n}
                    className="relative flex gap-4 rounded-xl px-3 py-3 transition-all duration-500"
                    style={{
                      background: isActive ? BLUE_DIM : "transparent",
                      border: `1px solid ${
                        isActive ? BLUE_MID : "transparent"
                      }`,
                      boxShadow: isActive ? BLUE_GLOW : "none",
                      opacity: isActive ? 1 : isDone ? 0.65 : 0.35,
                    }}
                  >
                    {/* Step indicator */}
                    <div className="flex w-6 flex-col items-center pt-1">
                      <span
                        className="flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-mono transition-all duration-500"
                        style={{
                          background: isActive
                            ? BLUE
                            : isDone
                            ? "var(--foreground)"
                            : "transparent",
                          border: `1px solid ${
                            isActive
                              ? BLUE
                              : isDone
                              ? "var(--foreground)"
                              : "var(--border-strong)"
                          }`,
                          color:
                            isActive || isDone
                              ? "var(--background)"
                              : "var(--muted-foreground)",
                          boxShadow: isActive ? BLUE_GLOW : "none",
                        }}
                      >
                        {isDone ? "✓" : s.n}
                      </span>
                      {i < STEPS.length - 1 && (
                        <span
                          className="mt-1 w-px flex-1 transition-all duration-700"
                          style={{
                            background: isDone ? BLUE : "var(--border)",
                          }}
                        />
                      )}
                    </div>

                    <div className="flex-1 pb-3">
                      <div className="flex items-center justify-between">
                        <span
                          className="font-mono text-[10px] uppercase tracking-[0.22em]"
                          style={{
                            color: isActive ? BLUE : "var(--muted-foreground)",
                          }}
                        >
                          {s.label}
                        </span>
                        {isActive && (
                          <span
                            className="rounded-full px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider"
                            style={{
                              background: BLUE_DIM,
                              color: BLUE,
                              border: `1px solid ${BLUE_MID}`,
                            }}
                          >
                            {s.chip}
                          </span>
                        )}
                      </div>
                      <h4 className="mt-2 text-[15px] font-medium leading-snug tracking-tight">
                        {s.title}
                      </h4>
                      <div
                        style={{
                          maxHeight: isActive ? "80px" : "0",
                          overflow: "hidden",
                          transition:
                            "max-height 500ms cubic-bezier(0.16,1,0.3,1)",
                        }}
                      >
                        <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
                          {s.body}
                        </p>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>

          {/* RIGHT: pipeline visual - reduced height and better alignment */}
          <div className="lg:col-span-6 lg:col-start-7">
            <BuildVisual active={active} progress={progress} />
          </div>
        </div>

        {/* Bottom progress bar */}
        <div
          className="absolute bottom-0 left-0 right-0 h-px"
          style={{ background: "var(--border)" }}
        >
          <div
            className="h-full transition-[width] duration-200"
            style={{
              width: `${progress * 100}%`,
              background: `linear-gradient(to right, ${BLUE}, oklch(0.72 0.18 245))`,
              boxShadow: `0 0 8px ${BLUE}`,
            }}
          />
        </div>
      </div>
    </section>
  );
}

// ─── Build Visual with reduced height ──────────────────────────────────────────

const SOURCES = ["Toast", "Square", "Aloha", "Revel", "Lightspeed", "Clover"];
const ANOMALIES = [
  { l: "Void cluster", severity: "high", v: "High" },
  { l: "Idle labor", severity: "med", v: "Med" },
  { l: "Over-order", severity: "med", v: "Med" },
  { l: "Vendor drift", severity: "low", v: "Low" },
];

const SEV_COLOR: Record<string, string> = {
  high: "oklch(0.65 0.2 25)",
  med: "oklch(0.72 0.18 75)",
  low: BLUE,
};

function BuildVisual({
  active,
  progress,
}: {
  active: number;
  progress: number;
}) {
  const local = progress * STEPS.length - active;

  return (
    <div
      className="relative w-full overflow-hidden rounded-2xl"
      style={{
        height: "440px", // Reduced fixed height instead of aspect ratio
        background: "var(--background)",
        border: `1px solid ${BLUE_MID}`,
        boxShadow: `0 0 0 1px oklch(0.58 0.22 245 / 0.08), 0 40px 100px -20px oklch(0.58 0.22 245 / 0.15)`,
      }}
    >
      {/* Chrome header */}
      <div
        className="flex items-center justify-between px-5 py-2.5"
        style={{ borderBottom: `1px solid ${BLUE_DIM}` }}
      >
        <div className="flex items-center gap-2">
          <span
            className="inline-block h-1.5 w-1.5 rounded-full"
            style={{ background: BLUE, boxShadow: BLUE_GLOW }}
          />
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            ezra · build pipeline
          </span>
        </div>
        <div className="flex items-center gap-3">
          {STEPS.map((_, i) => (
            <span
              key={i}
              className="h-1 rounded-full transition-all duration-500"
              style={{
                width: i === active ? "20px" : "6px",
                background: i <= active ? BLUE : "var(--border-strong)",
                opacity: i <= active ? 1 : 0.4,
              }}
            />
          ))}
          <span className="ml-1 font-mono text-[10px] text-muted-foreground">
            {active + 1}/{STEPS.length}
          </span>
        </div>
      </div>

      <div
        className="relative"
        style={{ height: "calc(100% - 42px)", padding: "16px" }}
      >
        {/* ── LAYER 1: Source tiles ── */}
        <div style={{ position: "absolute", top: 16, left: 16, right: 16 }}>
          <div
            className="mb-1.5 font-mono text-[9px] uppercase tracking-wider"
            style={{ color: BLUE, opacity: 0.7 }}
          >
            § POS Sources
          </div>
          <div className="grid grid-cols-3 gap-2">
            {SOURCES.map((s, i) => {
              const visible = active >= 0;
              const barW = visible ? 55 + ((i * 13 + active * 9) % 38) : 0;
              return (
                <div
                  key={s}
                  className="rounded-lg px-3 py-1.5"
                  style={{
                    background: `oklch(0.12 0.01 245)`,
                    border: `1px solid ${BLUE_DIM}`,
                    opacity: visible ? 1 : 0,
                    transform: visible ? "translateY(0)" : "translateY(10px)",
                    transition: `opacity 500ms ${i * 55}ms, transform 500ms ${
                      i * 55
                    }ms`,
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-medium">{s}</span>
                    <span
                      className="h-1.5 w-1.5 rounded-full"
                      style={{
                        background: BLUE,
                        boxShadow: `0 0 6px ${BLUE}`,
                        animation: "pulse 1.8s ease-in-out infinite",
                        animationDelay: `${i * 200}ms`,
                      }}
                    />
                  </div>
                  <div
                    className="mt-1.5 h-0.5 w-full overflow-hidden rounded-full"
                    style={{ background: BLUE_DIM }}
                  >
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${barW}%`,
                        background: `linear-gradient(to right, ${BLUE}, oklch(0.72 0.18 245))`,
                        transition: "width 900ms ease-out",
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── SVG connector lines (reduced height adjustments) ── */}
        <svg
          viewBox="0 0 560 420"
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
            <linearGradient id="bg-blue" x1="0" x2="0" y1="0" y2="1">
              <stop
                offset="0%"
                stopColor="oklch(0.58 0.22 245)"
                stopOpacity="0.5"
              />
              <stop
                offset="100%"
                stopColor="oklch(0.58 0.22 245)"
                stopOpacity="0.05"
              />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          {/* Adjusted line coordinates for smaller height */}
          {Array.from({ length: 6 }).map((_, i) => {
            const x = 48 + i * 94;
            const drawn = active >= 1 ? 1 : 0;
            const len = 180;
            return (
              <line
                key={i}
                x1={x}
                y1={120}
                x2={280}
                y2={230}
                stroke="url(#bg-blue)"
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
              const x2 = 90 + i * 128;
              return (
                <line
                  key={`d-${i}`}
                  x1="280"
                  y1="290"
                  x2={x2}
                  y2="340"
                  stroke="oklch(0.58 0.22 245)"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                  opacity="0.5"
                  filter="url(#glow)"
                />
              );
            })}
          {active >= 3 && (
            <line
              x1="280"
              y1="380"
              x2="280"
              y2="400"
              stroke="oklch(0.58 0.22 245)"
              strokeWidth="2"
              opacity="0.8"
              filter="url(#glow)"
            />
          )}
        </svg>

        {/* ── LAYER 2: Operational graph (Normalize) ── */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "44%",
            transform: `translate(-50%, -50%) scale(${active >= 1 ? 1 : 0.88})`,
            opacity: active >= 1 ? 1 : 0.1,
            transition: "all 700ms cubic-bezier(0.16,1,0.3,1)",
            width: "260px",
          }}
        >
          <div
            className="overflow-hidden rounded-xl p-3"
            style={{
              background: "var(--foreground)",
              border: `1px solid ${BLUE_MID}`,
              boxShadow: `0 30px 80px -20px rgba(0,0,0,0.6), ${BLUE_GLOW}`,
            }}
          >
            <div
              className="font-mono text-[9px] uppercase tracking-[0.22em]"
              style={{ color: "var(--background)", opacity: 0.5 }}
            >
              Operational graph
            </div>
            <div
              className="mt-1 font-mono text-[14px] leading-tight tracking-tight"
              style={{ color: "var(--background)" }}
            >
              ticket → shift → unit → brand
            </div>
            <div className="mt-2 grid grid-cols-8 gap-1">
              {Array.from({ length: 16 }).map((_, i) => {
                const filled =
                  active >= 1 &&
                  i <=
                    Math.floor((active >= 1 ? local : 0) * 16) +
                      (active - 1) * 4;
                return (
                  <div
                    key={i}
                    className="h-1.5 rounded-sm transition-all duration-300"
                    style={{
                      background: filled ? BLUE : "var(--background)",
                      opacity: filled ? 1 : 0.12,
                      boxShadow: filled ? BLUE_GLOW : "none",
                    }}
                  />
                );
              })}
            </div>
            {active >= 2 && (
              <div
                className="mt-2 flex items-center justify-between font-mono text-[10px]"
                style={{ color: "var(--background)", opacity: 0.55 }}
              >
                <span>records matched</span>
                <span
                  style={{
                    color: BLUE,
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

        {/* ── LAYER 3: Anomaly tiles (Detect) ── */}
        <div style={{ position: "absolute", bottom: 56, left: 16, right: 16 }}>
          <div
            className="mb-1.5 font-mono text-[9px] uppercase tracking-wider"
            style={{
              color: BLUE,
              opacity: active >= 2 ? 0.7 : 0,
              transition: "opacity 500ms",
            }}
          >
            § Detected anomalies
          </div>
          <div className="grid grid-cols-4 gap-2">
            {ANOMALIES.map((a, i) => {
              const visible = active >= 2;
              const c = SEV_COLOR[a.severity];
              return (
                <div
                  key={a.l}
                  className="rounded-lg p-2"
                  style={{
                    background: `oklch(0.12 0.01 245)`,
                    border: `1px solid ${visible ? `${c}44` : BLUE_DIM}`,
                    opacity: visible ? 1 : 0,
                    transform: visible ? "translateY(0)" : "translateY(10px)",
                    transition: `opacity 450ms ${i * 80}ms, transform 450ms ${
                      i * 80
                    }ms, border-color 300ms`,
                  }}
                >
                  <div className="text-[10px] font-medium leading-tight">
                    {a.l}
                  </div>
                  <div
                    className="mt-1 font-mono text-[8px]"
                    style={{ color: c }}
                  >
                    ● {a.v}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── LAYER 4: Decision pill (Act) ── */}
        <div
          style={{
            position: "absolute",
            bottom: 12,
            left: 16,
            right: 16,
            opacity: active >= 3 ? 1 : 0,
            transform: active >= 3 ? "translateY(0)" : "translateY(14px)",
            transition: "opacity 600ms, transform 600ms",
          }}
        >
          <div
            className="flex items-center justify-between rounded-xl px-3 py-2"
            style={{
              background: "var(--foreground)",
              border: `1px solid ${BLUE_MID}`,
              boxShadow: BLUE_GLOW,
            }}
          >
            <div>
              <div
                className="font-mono text-[8px] uppercase tracking-[0.22em]"
                style={{ color: "var(--background)", opacity: 0.5 }}
              >
                Decision routed
              </div>
              <div
                className="mt-0.5 text-[11px] font-medium"
                style={{ color: "var(--background)" }}
              >
                Rebalance shift · Store #0307 · saves $684
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span
                className="rounded-md px-2 py-0.5 font-mono text-[9px]"
                style={{
                  background: BLUE,
                  color: "#fff",
                  boxShadow: BLUE_GLOW,
                }}
              >
                auto-fixed
              </span>
              <span
                style={{
                  color: "var(--background)",
                  opacity: 0.4,
                  fontSize: 11,
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
