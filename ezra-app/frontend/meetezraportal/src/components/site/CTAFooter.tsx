import ctaImage from "@/assets/cta.jpeg";

// ── Ezra V2 brand tokens ──────────────────────────────────────────────────
// Colors: Brand Reference May 2026
// Typography: DM Sans 300/400/500/600, DM Mono 400
const PAGE_BG = "#09090B";
const CYAN = "#06B6D4"; // Cyan 500 — primary accent
const CYAN_LIGHT = "#22D3EE"; // Cyan 400 — gradient stop
const CYAN_PALE = "rgba(6,182,212,0.10)";
const CYAN_BORDER = "rgba(6,182,212,0.28)";
const TEXT = "rgba(255,255,255,0.92)";
const TEXT_DIM = "rgba(255,255,255,0.55)";

export function CTAFooter() {
  return (
    <section
      className="relative isolate overflow-hidden py-28 lg:py-40"
      style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
    >
      {/* Background image */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <img
          src={ctaImage.src}
          alt=""
          width={1600}
          height={900}
          loading="lazy"
          className="h-full w-full object-cover object-center"
          style={{ opacity: 0.65 }}
        />
        {/* Legibility — top/bottom fade only, no colored wash */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, #09090B 0%, transparent 25%, transparent 72%, #09090B 100%)",
          }}
        />
        {/* Subtle cyan horizon — restrained, not a glowing blob */}
        <div
          className="absolute inset-x-0 bottom-0"
          style={{
            height: "55%",
            background:
              "radial-gradient(ellipse at 50% 100%, rgba(6,182,212,0.12), transparent 65%)",
          }}
        />
      </div>

      {/* Ambient cyan — very restrained, no blob */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/3 -z-10 h-[520px] w-[900px] -translate-x-1/2 rounded-full"
        style={{
          opacity: 0.22,
          background:
            "radial-gradient(closest-side, rgba(6,182,212,0.30), transparent 70%)",
        }}
      />

      <div className="relative mx-auto max-w-[1100px] px-6 text-center lg:px-10">
        {/* Live badge — DM Mono */}
        <div
          className="mb-8 inline-flex items-center gap-2"
          style={{
            fontFamily: "'DM Mono', monospace",
            fontWeight: 400,
            fontSize: "11px",
            textTransform: "uppercase",
            letterSpacing: "0.22em",
            color: CYAN,
            opacity: 0.85,
          }}
        >
          <span
            className="pulse-dot inline-block h-1.5 w-1.5 rounded-full"
            style={{ background: CYAN }}
          />
          Onboarding select operators · Q4
        </div>

        {/* Hero headline — DM Sans 300 Light, editorial scale */}
        <h2
          className="mx-auto text-balance"
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 300,
            fontSize: "clamp(48px, 8vw, 104px)",
            lineHeight: 0.98,
            letterSpacing: "-0.035em",
            color: TEXT,
            maxWidth: "18ch",
          }}
        >
          Run every unit like your{" "}
          {/* Gradient only on italic accent — brand principle 03 */}
          <span
            className="italic"
            style={{
              backgroundImage: `linear-gradient(135deg, ${CYAN_LIGHT}, ${CYAN})`,
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            best one.
          </span>
        </h2>

        {/* Body — DM Sans Regular, ≤52ch measure */}
        <p
          className="mx-auto mt-8 text-pretty"
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 400,
            fontSize: "17px",
            lineHeight: 1.55,
            color: TEXT_DIM,
            maxWidth: "52ch",
          }}
        >
          Ezra deploys in 14 days across your existing POS. We'll surface your
          first recoverable dollar before you sign a contract.
        </p>

        {/* CTAs */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          {/* Primary — Cyan 500 fill, dark text for contrast */}
          <a
            href="mailto:hello@meetezra.bot"
            className="group inline-flex items-center gap-2 rounded-full px-6 py-3 transition-all hover:brightness-110"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 500,
              fontSize: "14px",
              background: CYAN,
              color: PAGE_BG, // dark text on cyan — correct brand contrast
              textDecoration: "none",
              // No box-shadow — brand principle 03
            }}
          >
            Request access
            <span className="transition-transform group-hover:translate-x-0.5">
              →
            </span>
          </a>

          {/* Ghost — hairline cyan border */}
          <a
            href="mailto:hello@meetezra.bot"
            className="inline-flex items-center gap-2 rounded-full px-6 py-3 transition-colors hover:bg-[rgba(6,182,212,0.10)]"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 400,
              fontSize: "14px",
              border: `1px solid ${CYAN_BORDER}`,
              color: CYAN,
              textDecoration: "none",
            }}
          >
            Talk to founders
          </a>
        </div>
      </div>
    </section>
  );
}
