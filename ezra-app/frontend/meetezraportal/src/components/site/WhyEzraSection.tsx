import { SectionHeader } from "./SectionHeader";

// ── Ezra V2 brand tokens (from Brand Reference May 2026) ──────────────────
const CYAN = "#06B6D4"; // Cyan 500 — primary accent
const CYAN_LIGHT = "#22D3EE"; // Cyan 400 — hover / gradient stop
const CYAN_PALE = "rgba(6,182,212,0.10)"; // subtle surface tint
const CYAN_BORDER = "rgba(6,182,212,0.28)"; // hairline accent border

const TEXT = "rgba(255,255,255,0.92)"; // primary text
const TEXT_DIM = "rgba(255,255,255,0.55)"; // body / secondary
const TEXT_MUTED = "rgba(255,255,255,0.30)"; // captions, metadata

const PAGE_BG = "#09090B"; // dark page background
const CARD_BG = "#141417"; // dark card surface

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
    <section
      id="why-ezra"
      className="relative py-28 lg:py-40"
      style={{ background: PAGE_BG }}
    >
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        {/* Eyebrow — DM Sans 500, 10px, 0.22em tracking */}
        <div
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 500,
            fontSize: "10px",
            textTransform: "uppercase",
            letterSpacing: "0.22em",
            color: CYAN,
          }}
        >
          MOAT
        </div>

        {/* Section heading — DM Sans 300 Light, editorial scale */}
        <h2
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 300,
            fontSize: "clamp(40px, 6vw, 72px)",
            lineHeight: 1.02,
            letterSpacing: "-0.035em",
            color: TEXT,
            marginTop: "20px",
            maxWidth: "16ch",
          }}
        >
          Why Ezra.
        </h2>

        <div className="mt-16 grid gap-y-16 gap-x-12 md:grid-cols-2">
          {MOATS.map((m) => (
            <div
              key={m.n}
              className="pt-8"
              style={{ borderTop: `1px solid ${CYAN_BORDER}` }} // hairline — 1px, no heavy stroke
            >
              <div className="flex items-baseline gap-4">
                {/* Number badge — DM Mono, minimal tint */}
                <span
                  style={{
                    flexShrink: 0,
                    fontFamily: "'DM Mono', monospace",
                    fontWeight: 400,
                    fontSize: "11px",
                    letterSpacing: "0.04em",
                    background: CYAN_PALE,
                    color: CYAN,
                    border: `1px solid ${CYAN_BORDER}`,
                    borderRadius: "6px",
                    padding: "2px 8px",
                  }}
                >
                  {m.n}
                </span>

                {/* Card title — DM Sans Semibold, H3 scale */}
                <h3
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: 600,
                    fontSize: "clamp(22px, 3vw, 32px)",
                    lineHeight: 1.15,
                    letterSpacing: "-0.01em",
                    color: TEXT,
                    margin: 0,
                  }}
                >
                  {m.t}
                </h3>
              </div>

              {/* Body — DM Sans Regular, ≤70ch measure */}
              <p
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 400,
                  fontSize: "15px",
                  lineHeight: 1.55,
                  letterSpacing: 0,
                  color: TEXT_DIM,
                  marginTop: "20px",
                  maxWidth: "52ch", // editorial measure — narrower column
                  paddingLeft: "40px",
                }}
              >
                {m.b}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

import ctaImage from "@/assets/cta.jpeg";

export function CTAFooter() {
  return (
    <section
      className="relative isolate overflow-hidden py-28 lg:py-40"
      style={{ borderTop: `1px solid rgba(255,255,255,0.07)` }} // hairline divider, no heavy border
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
        {/* Legibility fade — top/bottom only, no blue wash blob */}
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

      <div className="relative mx-auto max-w-[1100px] px-6 text-center lg:px-10">
        {/* Live badge — DM Mono eyebrow */}
        <div
          className="mb-8 inline-flex items-center gap-2"
          style={{
            fontFamily: "'DM Mono', monospace",
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
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 300,
            fontSize: "clamp(48px, 8vw, 104px)",
            lineHeight: 0.98,
            letterSpacing: "-0.035em",
            color: TEXT,
            maxWidth: "18ch",
            margin: "0 auto",
            textWrap: "balance",
          }}
        >
          Run every unit like your{" "}
          {/* Gradient only on the italic accent — brand principle 03 */}
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

        {/* Body — DM Sans Regular, ≤70ch, generous line-height */}
        <p
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 400,
            fontSize: "17px",
            lineHeight: 1.55,
            color: TEXT_DIM,
            maxWidth: "52ch",
            margin: "32px auto 0",
            textWrap: "pretty",
          }}
        >
          Ezra deploys in 14 days across your existing POS. We'll surface your
          first recoverable dollar before you sign a contract.
        </p>

        {/* CTAs */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <a
            href="mailto:hello@meetezra.bot"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              borderRadius: "9999px",
              background: CYAN,
              padding: "12px 24px",
              fontSize: "14px",
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 500,
              color: "#09090B", // dark text on cyan — brand contrast
              textDecoration: "none",
              // No drop shadow — brand principle 03
              transition: "filter 150ms",
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLAnchorElement).style.filter =
                "brightness(1.1)")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLAnchorElement).style.filter = "none")
            }
          >
            Request access
            <span style={{ transition: "transform 150ms" }}>→</span>
          </a>

          {/* Ghost CTA — hairline cyan border */}
          <a
            href="mailto:hello@meetezra.bot"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              borderRadius: "9999px",
              border: `1px solid ${CYAN_BORDER}`,
              padding: "12px 24px",
              fontSize: "14px",
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 400,
              color: CYAN,
              textDecoration: "none",
              transition: "background 150ms",
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLAnchorElement).style.background =
                CYAN_PALE)
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLAnchorElement).style.background =
                "transparent")
            }
          >
            Talk to founders
          </a>
        </div>
      </div>
    </section>
  );
}
