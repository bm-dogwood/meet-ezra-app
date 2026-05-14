import { SectionHeader } from "./SectionHeader";

const STATS = [
  {
    v: "110",
    l: "Active stores",
    s: "Multi-unit operators across QSR, fast-casual, and retail.",
  },
  {
    v: "$2.41M",
    l: "Revenue recovered",
    s: "Captured from voids, leakage, and operational drift in 2024.",
  },
  {
    v: "$612K",
    l: "Payroll saved",
    s: "Through demand-aware scheduling across deployed units.",
  },
  {
    v: "+34%",
    l: "Guest retention",
    s: "Lift across cohorts running Exponential CRM journeys.",
  },
  {
    v: "14",
    l: "Day deployment",
    s: "From integration kickoff to first surfaced anomaly.",
  },
  {
    v: "98.6%",
    l: "POS uptime",
    s: "Native integrations with Toast, Square, Aloha, Revel, more.",
  },
];

export function MetricsSection() {
  return (
    <section className="relative py-28 lg:py-40">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <SectionHeader
          eyebrow="Proof"
          title="Operational outcomes, measured."
          description="Ezra's value is reported back to the P&L every quarter — recovered revenue, saved payroll, retained guests."
        />

        <div className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {STATS.map((s, i) => (
            <div key={i} className="bg-background p-8 lg:p-10">
              <div className="num-tabular font-display text-[64px] leading-[0.95] tracking-[-0.02em] md:text-[80px]">
                {s.v}
              </div>
              <div className="mt-3 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                {s.l}
              </div>
              <p className="mt-4 max-w-xs text-[13px] leading-relaxed text-muted-foreground">
                {s.s}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
