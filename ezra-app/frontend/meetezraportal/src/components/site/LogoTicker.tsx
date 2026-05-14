const LOGOS = [
  "Brickell Group",
  "Coastal Holdings",
  "Mercato Hospitality",
  "North Star Foods",
  "Atlas Operating",
  "Verdant Brands",
  "Harbor & Co.",
  "Meridian Restaurants",
  "Olive District",
  "Westline Capital",
];

export function LogoTicker() {
  return (
    <section className="border-y border-border bg-surface/40 py-10">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="mb-6 flex items-center justify-between">
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            Trusted by multi-unit operators
          </span>
          <span className="hidden font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground sm:inline">
            110 stores · live
          </span>
        </div>
        <div className="relative overflow-hidden">
          <div
            className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24"
            style={{
              background:
                "linear-gradient(to right, var(--background), transparent)",
            }}
          />
          <div
            className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24"
            style={{
              background:
                "linear-gradient(to left, var(--background), transparent)",
            }}
          />
          <div className="ticker-track flex w-max gap-16 whitespace-nowrap">
            {[...LOGOS, ...LOGOS].map((l, i) => (
              <span
                key={i}
                className="font-display text-[22px] tracking-tight text-muted-foreground/70"
              >
                {l}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
