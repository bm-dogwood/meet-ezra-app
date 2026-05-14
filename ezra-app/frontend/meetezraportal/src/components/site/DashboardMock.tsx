const BLUE = "oklch(0.58 0.22 245)";
const BLUE_DIM = "oklch(0.58 0.22 245 / 0.15)";
const BLUE_MID = "oklch(0.58 0.22 245 / 0.35)";
const BLUE_GLOW = "0 0 16px oklch(0.58 0.22 245 / 0.4)";

// Explicit dark palette — no CSS vars that can silently fail
const BG = "#0d0f14";
const SURFACE = "#111318";
const SURFACE_ELEVATED = "#161920";
const BORDER = "rgba(255,255,255,0.07)";
const BORDER_STRONG = "rgba(255,255,255,0.12)";
const TEXT = "rgba(255,255,255,0.88)";
const TEXT_MUTED = "rgba(255,255,255,0.38)";
const TEXT_DIM = "rgba(255,255,255,0.55)";

export function DashboardMock() {
  return (
    <div
      className="relative overflow-hidden rounded-2xl"
      style={{
        background: SURFACE,
        border: `1px solid ${BORDER_STRONG}`,
        boxShadow: `0 30px 80px -20px rgba(0,0,0,0.8), 0 0 0 1px ${BLUE_MID}`,
      }}
    >
      {/* Window chrome */}
      <div
        className="flex items-center justify-between px-5 py-3"
        style={{ borderBottom: `1px solid ${BORDER}` }}
      >
        <div className="flex items-center gap-1.5">
          <div
            className="h-2.5 w-2.5 rounded-full"
            style={{ background: "rgba(255,255,255,0.12)" }}
          />
          <div
            className="h-2.5 w-2.5 rounded-full"
            style={{ background: "rgba(255,255,255,0.12)" }}
          />
          <div
            className="h-2.5 w-2.5 rounded-full"
            style={{ background: "rgba(255,255,255,0.12)" }}
          />
        </div>
        <div
          className="font-mono text-[10px] uppercase tracking-[0.2em]"
          style={{ color: TEXT_MUTED }}
        >
          ezra · operations console
        </div>
        <div className="flex items-center gap-1.5">
          <span
            className="inline-block h-1.5 w-1.5 rounded-full"
            style={{ background: BLUE, boxShadow: BLUE_GLOW }}
          />
          <span className="font-mono text-[10px]" style={{ color: TEXT_MUTED }}>
            live
          </span>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4 p-5">
        {/* Sidebar */}
        <aside className="col-span-3 space-y-0.5">
          {[
            "Overview",
            "Loss Prevention",
            "Inventory",
            "Scheduling",
            "Sales",
            "Exponential",
          ].map((s, i) => (
            <div
              key={s}
              className="flex items-center justify-between rounded-md px-2.5 py-1.5 text-[11px]"
              style={{
                background: i === 0 ? SURFACE_ELEVATED : "transparent",
                color: i === 0 ? TEXT : TEXT_MUTED,
                border:
                  i === 0
                    ? `1px solid ${BORDER_STRONG}`
                    : "1px solid transparent",
              }}
            >
              <span>{s}</span>
              {i === 1 && (
                <span
                  className="rounded-sm px-1.5 py-0.5 font-mono text-[9px]"
                  style={{ background: BLUE_DIM, color: BLUE }}
                >
                  3
                </span>
              )}
            </div>
          ))}
        </aside>

        {/* Main content */}
        <div className="col-span-9 space-y-4">
          {/* KPI row */}
          <div className="grid grid-cols-4 gap-3">
            {[
              { l: "Revenue recovered", v: "$2.41M", d: "+18.2%" },
              { l: "Payroll saved", v: "$612K", d: "+9.4%" },
              { l: "Active stores", v: "110", d: "live" },
              { l: "Voids flagged", v: "47", d: "−22%" },
            ].map((k) => (
              <div
                key={k.l}
                className="rounded-md p-3"
                style={{
                  background: SURFACE_ELEVATED,
                  border: `1px solid ${BORDER_STRONG}`,
                }}
              >
                <div
                  className="font-mono text-[9px] uppercase tracking-wider"
                  style={{ color: TEXT_MUTED }}
                >
                  {k.l}
                </div>
                <div
                  className="mt-1.5 text-[16px] font-medium tracking-tight"
                  style={{ color: TEXT, fontVariantNumeric: "tabular-nums" }}
                >
                  {k.v}
                </div>
                <div
                  className="mt-0.5 font-mono text-[10px]"
                  style={{ color: BLUE }}
                >
                  {k.d}
                </div>
              </div>
            ))}
          </div>

          {/* Chart */}
          <div
            className="rounded-md p-4"
            style={{
              background: SURFACE_ELEVATED,
              border: `1px solid ${BORDER_STRONG}`,
            }}
          >
            <div className="mb-3 flex items-center justify-between">
              <div>
                <div
                  className="font-mono text-[9px] uppercase tracking-wider"
                  style={{ color: TEXT_MUTED }}
                >
                  Operational variance · 30d
                </div>
                <div
                  className="mt-1 text-[13px] font-medium"
                  style={{ color: TEXT }}
                >
                  All units · normalized
                </div>
              </div>
              <div className="flex gap-1">
                {["1D", "7D", "30D", "QTD"].map((t, i) => (
                  <span
                    key={t}
                    className="rounded px-2 py-0.5 font-mono text-[9px]"
                    style={{
                      background: i === 2 ? BLUE : "transparent",
                      color: i === 2 ? "#fff" : TEXT_MUTED,
                      border: i === 2 ? "none" : `1px solid ${BORDER}`,
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
            <svg viewBox="0 0 600 140" className="h-32 w-full">
              <defs>
                <linearGradient id="chart-fill" x1="0" x2="0" y1="0" y2="1">
                  <stop
                    offset="0%"
                    stopColor="oklch(0.58 0.22 245)"
                    stopOpacity="0.3"
                  />
                  <stop
                    offset="100%"
                    stopColor="oklch(0.58 0.22 245)"
                    stopOpacity="0"
                  />
                </linearGradient>
              </defs>
              {[0, 35, 70, 105, 140].map((y) => (
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
                d="M0,95 C50,80 90,110 140,90 C190,70 230,40 280,55 C330,70 370,30 420,42 C470,54 510,28 560,38 L600,35 L600,140 L0,140 Z"
                fill="url(#chart-fill)"
              />
              {/* Main line */}
              <path
                d="M0,95 C50,80 90,110 140,90 C190,70 230,40 280,55 C330,70 370,30 420,42 C470,54 510,28 560,38 L600,35"
                fill="none"
                stroke="oklch(0.68 0.22 245)"
                strokeWidth="1.5"
              />
              {/* Baseline dashed */}
              <path
                d="M0,110 C50,108 100,100 150,105 C200,110 250,95 300,98 C350,100 400,85 450,90 C500,95 550,80 600,85"
                fill="none"
                stroke="rgba(255,255,255,0.18)"
                strokeWidth="1"
                strokeDasharray="3 3"
              />
            </svg>
          </div>

          {/* Anomaly table */}
          <div
            className="overflow-hidden rounded-md"
            style={{
              background: SURFACE_ELEVATED,
              border: `1px solid ${BORDER_STRONG}`,
            }}
          >
            {/* Table header */}
            <div
              className="grid grid-cols-5 gap-3 px-4 py-2 font-mono text-[9px] uppercase tracking-wider"
              style={{ borderBottom: `1px solid ${BORDER}`, color: TEXT_MUTED }}
            >
              <div>Store</div>
              <div>Anomaly</div>
              <div>Severity</div>
              <div>Recovered</div>
              <div className="text-right">Status</div>
            </div>
            {[
              [
                "#0182 · Brickell",
                "Repeat void cluster",
                "High",
                "$1,420",
                "review",
                "high",
              ],
              [
                "#0307 · Wynwood",
                "Idle labor 11–2pm",
                "Med",
                "$684",
                "auto-fixed",
                "med",
              ],
              [
                "#0411 · Doral",
                "Over-order: produce",
                "Med",
                "$312",
                "queued",
                "med",
              ],
            ].map((r, i) => (
              <div
                key={i}
                className="grid grid-cols-5 gap-3 px-4 py-2.5 text-[11px]"
                style={{
                  borderBottom: i < 2 ? `1px solid ${BORDER}` : "none",
                  color: TEXT_DIM,
                }}
              >
                <div className="font-mono" style={{ color: TEXT }}>
                  {r[0]}
                </div>
                <div>{r[1]}</div>
                <div>
                  <span
                    className="rounded-sm px-1.5 py-0.5 font-mono text-[9px]"
                    style={
                      r[5] === "high"
                        ? {
                            background: "rgba(239,68,68,0.15)",
                            color: "#f87171",
                          }
                        : { background: BLUE_DIM, color: BLUE }
                    }
                  >
                    {r[2]}
                  </span>
                </div>
                <div
                  style={{ fontVariantNumeric: "tabular-nums", color: TEXT }}
                >
                  {r[3]}
                </div>
                <div
                  className="text-right font-mono text-[10px]"
                  style={{
                    color: r[4] === "auto-fixed" ? BLUE : TEXT_MUTED,
                  }}
                >
                  {r[4]}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
