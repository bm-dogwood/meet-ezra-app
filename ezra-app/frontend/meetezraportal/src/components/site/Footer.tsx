"use client";

import Link from "next/link";

// ─── Brand tokens — Ezra V2, May 2026 ──────────────────────────────────────
const t = {
  bgPage: "#09090B",
  bgCard: "#141417",
  borderDark: "#27272A",
  textPrimary: "#FAFAFA",
  textBody: "#71717A", // captions, metadata, hints
  textDisabled: "#A1A1AA", // tertiary / disabled
  cyan400: "#22D3EE",
  cyan500: "#06B6D4",
};

// ─── Footer link columns ────────────────────────────────────────────────────
const FOOTER_LINKS: Record<string, { href: string; label: string }[]> = {
  Product: [
    { href: "/bots", label: "The Ezra Family" },
    { href: "/solutions", label: "Solutions" },
    { href: "/platform", label: "Platform" },
    { href: "/#roadmap", label: "Roadmap" },
  ],
  Company: [
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
    { href: "/privacy", label: "Privacy" },
    { href: "/terms", label: "Terms" },
  ],
  Overview: [
    { href: "/#operations", label: "Operations" },
    { href: "/#how-it-works", label: "How It Works" },
    { href: "/#architecture", label: "Architecture" },
    { href: "/#why-ezra", label: "Why Ezra" },
  ],
};

// ─── Footer ─────────────────────────────────────────────────────────────────
export default function Footer() {
  return (
    <>
      {/* DM Sans — sole typeface per brand spec 03 */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap');
      `}</style>

      <footer
        style={{
          background: t.bgPage,
          borderTop: `1px solid ${t.borderDark}`,
          fontFamily: "'DM Sans', sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Single hairline accent at top — one decoration allowed per principle 03 */}
        <div
          style={{
            position: "absolute",
            top: -1,
            left: "50%",
            transform: "translateX(-50%)",
            width: 480,
            height: 1,
            background: `linear-gradient(90deg, transparent, ${t.cyan400}45, transparent)`,
          }}
        />

        {/* ── Main grid ── */}
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "72px 32px 56px",
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr 1fr",
            gap: 48,
          }}
        >
          {/* Brand column */}
          <div>
            {/* Logomark — identical to Header: cyan gradient badge + DM Sans 600 / 0.18em */}
            <Link
              href="/"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                textDecoration: "none",
                marginBottom: 20,
              }}
            >
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 7,
                  background: `linear-gradient(135deg, ${t.cyan400}, ${t.cyan500})`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 13,
                  fontWeight: 700,
                  color: t.bgPage,
                  flexShrink: 0,
                }}
              >
                E
              </div>
              <span
                style={{
                  fontWeight: 600,
                  letterSpacing: "0.18em",
                  fontSize: 13,
                  color: t.textPrimary,
                  textTransform: "uppercase",
                }}
              >
                Ezra
              </span>
            </Link>

            {/* Body copy — 14px / 400 / lh 1.55 per type spec, measure ≤70ch */}
            <p
              style={{
                fontSize: 14,
                fontWeight: 400,
                color: t.textBody,
                lineHeight: 1.55,
                maxWidth: 220,
                margin: 0,
              }}
            >
              Intelligent AI assistants built for the way your team actually
              works.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([section, links]) => (
            <div key={section}>
              {/* Eyebrow — 10px / 500 / 0.18em per typography spec */}
              <p
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 10,
                  fontWeight: 500,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: t.textBody,
                  margin: "0 0 18px 0",
                }}
              >
                {section}
              </p>

              <ul
                style={{
                  listStyle: "none",
                  margin: 0,
                  padding: 0,
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                }}
              >
                {links.map(({ href, label }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: 13.5,
                        fontWeight: 400,
                        color: t.textBody,
                        textDecoration: "none",
                        transition: "color 150ms",
                        letterSpacing: "-0.005em",
                      }}
                      onMouseEnter={(e) =>
                        ((e.currentTarget as HTMLElement).style.color =
                          t.textPrimary)
                      }
                      onMouseLeave={(e) =>
                        ((e.currentTarget as HTMLElement).style.color =
                          t.textBody)
                      }
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ── Bottom bar ── */}
        <div style={{ borderTop: `1px solid ${t.borderDark}` }}>
          <div
            style={{
              maxWidth: 1200,
              margin: "0 auto",
              padding: "16px 32px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 16,
              flexWrap: "wrap",
            }}
          >
            {/* Copyright */}
            <span
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 12.5,
                fontWeight: 400,
                color: t.textBody,
                letterSpacing: "-0.005em",
              }}
            >
              © 2026 Ezra AI, Inc. All rights reserved.
            </span>

            {/* Status indicator — emerald, not cyan, keeps module accent rule */}
            <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "#10B981",
                  flexShrink: 0,
                  // subtle glow is the only shadow-like effect allowed — functional signal
                  boxShadow: "0 0 6px rgba(16,185,129,0.55)",
                }}
              />
              <span
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 12.5,
                  fontWeight: 400,
                  color: t.textBody,
                  letterSpacing: "-0.005em",
                }}
              >
                All systems operational
              </span>
            </div>

            {/* Legal links */}
            <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
              {[
                { href: "/privacy", label: "Privacy" },
                { href: "/terms", label: "Terms" },
                { href: "/cookies", label: "Cookies" },
              ].map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 12.5,
                    fontWeight: 400,
                    color: t.textBody,
                    textDecoration: "none",
                    letterSpacing: "-0.005em",
                    transition: "color 150ms",
                  }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLElement).style.color =
                      t.textDisabled)
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLElement).style.color = t.textBody)
                  }
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
