import ctaImage from "@/assets/cta.jpeg";

export function CTAFooter() {
  return (
    <section className="relative isolate overflow-hidden border-t border-border/60 py-28 lg:py-40">
      {/* Background image */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <img
          src={ctaImage.src}
          alt=""
          width={1600}
          height={900}
          loading="lazy"
          className="h-full w-full object-cover object-center opacity-70 brightness-110 saturate-125"
        />
        {/* Gradient overlays for legibility + blue wash */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, var(--background) 0%, transparent 28%, transparent 70%, var(--background) 100%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-60"
          style={{
            background:
              "radial-gradient(ellipse at 50% 60%, color-mix(in oklch, var(--accent) 30%, transparent), transparent 70%)",
          }}
        />
      </div>

      {/* Ambient blue glow */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/3 -z-10 h-[520px] w-[900px] -translate-x-1/2 rounded-full opacity-40"
        style={{
          background:
            "radial-gradient(closest-side, oklch(0.62 0.22 245 / 0.35), transparent 70%)",
        }}
      />

      <div className="relative mx-auto max-w-[1100px] px-6 text-center lg:px-10">
        <div className="mb-8 inline-flex items-center gap-2">
          <span className="pulse-dot inline-block h-1.5 w-1.5 rounded-full bg-accent" />
          <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-accent/85">
            Onboarding select operators · Q4
          </span>
        </div>

        <h2 className="mx-auto max-w-[18ch] font-display text-[56px] font-normal leading-[0.98] tracking-[-0.02em] text-balance md:text-[80px] lg:text-[104px]">
          Run every unit like your{" "}
          <span
            className="italic"
            style={{
              backgroundImage:
                "linear-gradient(135deg, oklch(0.78 0.18 235), oklch(0.62 0.22 250))",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            best one.
          </span>
        </h2>

        <p className="mx-auto mt-8 max-w-xl text-pretty text-[17px] leading-relaxed text-muted-foreground">
          Ezra deploys in 14 days across your existing POS. We'll surface your
          first recoverable dollar before you sign a contract.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <a
            href="mailto:hello@meetezra.bot"
            className="group inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-[14px] font-medium text-accent-foreground shadow-[0_8px_30px_-6px_oklch(0.55_0.22_245_/_0.55)] transition-all hover:brightness-110 hover:shadow-[0_10px_40px_-6px_oklch(0.55_0.22_245_/_0.7)]"
          >
            Request access
            <span className="transition-transform group-hover:translate-x-0.5">
              →
            </span>
          </a>
          <a
            href="mailto:hello@meetezra.bot"
            className="inline-flex items-center gap-2 rounded-full border border-accent/35 px-6 py-3 text-[14px] text-accent/90 transition-colors hover:bg-accent/10"
          >
            Talk to founders
          </a>
        </div>
      </div>
    </section>
  );
}
