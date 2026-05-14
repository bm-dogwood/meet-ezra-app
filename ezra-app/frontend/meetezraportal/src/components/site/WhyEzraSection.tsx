import { SectionHeader } from "./SectionHeader";

const BLUE = "oklch(0.58 0.22 245)";
const BLUE_DIM = "oklch(0.58 0.22 245 / 0.14)";
const BLUE_MID = "oklch(0.58 0.22 245 / 0.40)";

const MOATS = [
  {
    n: "01",
    t: "Operator-built, not analyst-built.",
    b: "Ezra was designed inside multi-unit operations — by people who run shifts, not dashboards. Every workflow assumes the noise of a real store.",
  },
  {
    n: "02",
    t: "Decisions, not dashboards.",
    b: "We don't ship more charts. We ship recovery workflows, schedule changes, and order suggestions that close themselves into the P&L.",
  },
  {
    n: "03",
    t: "POS-native, vendor-neutral.",
    b: "Direct integrations with Toast, Square, Aloha, Revel and others — and an open layer above them, so you're never locked to a single stack.",
  },
  {
    n: "04",
    t: "Quiet by design.",
    b: "Ezra surfaces what matters and stays silent on the rest. No alert fatigue, no theatrical AI, no noise inside an already noisy operation.",
  },
];

export function WhyEzraSection() {
  return (
    <section className="relative py-28 lg:py-40">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <div
          className="font-mono text-[10px] uppercase tracking-[0.22em]"
          style={{ color: BLUE }}
        >
          MOAT
        </div>
        <SectionHeader eyebrow="" title="Why Ezra." />

        <div className="mt-16 grid gap-y-16 gap-x-12 md:grid-cols-2">
          {MOATS.map((m) => (
            <div
              key={m.n}
              className="pt-8"
              style={{ borderTop: `1px solid ${BLUE_MID}` }}
            >
              <div className="flex items-baseline gap-4">
                {/* Number badge */}
                <span
                  className="shrink-0 rounded-md px-2 py-0.5 font-mono text-[11px]"
                  style={{
                    background: BLUE_DIM,
                    color: BLUE,
                    border: `1px solid ${BLUE_MID}`,
                  }}
                >
                  {m.n}
                </span>
                <h3 className="font-display text-[28px] leading-[1.05] tracking-tight md:text-[36px]">
                  {m.t}
                </h3>
              </div>
              <p className="mt-5 max-w-md pl-10 text-[15px] leading-relaxed text-muted-foreground">
                {m.b}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
