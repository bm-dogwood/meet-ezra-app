"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";

// ─── Brand tokens — Ezra V2, May 2026 ──────────────────────────────────────
const t = {
  bgPage: "#09090B",
  bgCard: "#141417",
  borderDark: "#27272A",
  textPrimary: "#FAFAFA",
  textMeta: "#71717A",
  textTertiary: "#A1A1AA",
  cyan400: "#22D3EE",
  cyan500: "#06B6D4",
  cyan600: "#0891B2",
};

// ─── Overview section anchors ───────────────────────────────────────────────
const OVERVIEW_ITEMS = [
  {
    label: "Operations",
    href: "/#operations",
    description: "End-to-end workflow automation",
  },
  {
    label: "How It Works",
    href: "/#how-it-works",
    description: "Architecture under the hood",
  },

  {
    label: "Platform",
    href: "/#platform",
    description: "The Ezra runtime & APIs",
  },
  { label: "Roadmap", href: "/#roadmap", description: "What's shipping next" },
  {
    label: "Architecture",
    href: "/#architecture",
    description: "System design & integrations",
  },
  {
    label: "Why Ezra",
    href: "/#why-ezra",
    description: "Built for operators, not demos",
  },
] as const;

// ─── Top-level nav ──────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { label: "Overview", href: "/", dropdown: true },
  { label: "The Ezra Family", href: "/bots", dropdown: false },
  { label: "Solutions", href: "/solutions", dropdown: false },
  { label: "Platform", href: "/platform", dropdown: false },
  { label: "About", href: "/about", dropdown: false },
  { label: "Contact", href: "/contact", dropdown: false },
] as const;

// ─── Chevron icon ───────────────────────────────────────────────────────────
function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      width="9"
      height="9"
      viewBox="0 0 9 9"
      fill="none"
      style={{
        transition: "transform 200ms ease",
        transform: open ? "rotate(180deg)" : "rotate(0deg)",
        flexShrink: 0,
      }}
    >
      <path
        d="M1.5 3L4.5 6L7.5 3"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ─── Active route underline — 1px hairline per brand spec ──────────────────
function ActiveBar() {
  return (
    <span
      style={{
        position: "absolute",
        bottom: -1, // sits on the header border
        left: 8,
        right: 8,
        height: 1,
        borderRadius: 1,
        background: `linear-gradient(90deg, ${t.cyan400}, ${t.cyan500})`,
      }}
    />
  );
}

// ─── Overview Dropdown ──────────────────────────────────────────────────────
function OverviewDropdown({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <div
      aria-hidden={!open}
      style={{
        position: "absolute",
        top: "calc(100% + 12px)",
        left: "50%",
        transform: "translateX(-50%)",
        width: 340,
        background: t.bgCard,
        border: `1px solid ${t.borderDark}`,
        borderRadius: 10,
        padding: 6,
        // No drop shadows on cards per brand principle 03
        boxShadow: "0 24px 48px rgba(0,0,0,0.6)",
        opacity: open ? 1 : 0,
        pointerEvents: open ? "auto" : "none",
        transition: "opacity 180ms ease",
        zIndex: 100,
      }}
    >
      {/* Hairline top accent — one accent treatment allowed */}
      <div
        style={{
          position: "absolute",
          top: -1,
          left: 48,
          right: 48,
          height: 1,
          background: `linear-gradient(90deg, transparent, ${t.cyan400}55, transparent)`,
        }}
      />

      {/* Eyebrow label — 10px / 500 / 0.18em per typography spec */}
      <p
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 10,
          fontWeight: 500,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: t.textMeta,
          padding: "8px 12px 6px",
          margin: 0,
        }}
      >
        On this page
      </p>

      {/* 2-column grid of section links */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
        {OVERVIEW_ITEMS.map(({ label, href, description }) => (
          <Link
            key={href}
            href={href}
            onClick={onClose}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 3,
              padding: "9px 12px",
              borderRadius: 7,
              textDecoration: "none",
              transition: "background 150ms",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background =
                "rgba(255,255,255,0.04)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "transparent";
            }}
          >
            <span
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 13,
                fontWeight: 500,
                color: t.textPrimary,
                letterSpacing: "-0.01em",
              }}
            >
              {label}
            </span>
            <span
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 11.5,
                fontWeight: 400,
                color: t.textMeta,
                lineHeight: 1.4,
              }}
            >
              {description}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

// ─── Header ─────────────────────────────────────────────────────────────────
export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Close on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      {/* DM Sans — sole typeface per brand spec 03 */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap');
      `}</style>

      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          height: 64,
          display: "flex",
          alignItems: "center",
          borderBottom: `1px solid ${t.borderDark}`,
          background: "rgba(9,9,11,0.88)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            width: "100%",
            margin: "0 auto",
            padding: "0 32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* ── Logomark — always cyan gradient, DM Sans 600, 0.18em per spec ── */}
          <Link
            href="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              textDecoration: "none",
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
                color: "white",
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

          {/* ── Navigation ── */}
          <nav style={{ display: "flex", alignItems: "center" }}>
            {NAV_ITEMS.map(({ label, href, dropdown }) => {
              const active = isActive(href);

              if (dropdown) {
                return (
                  <div
                    key={href}
                    ref={wrapRef}
                    style={{ position: "relative" }}
                  >
                    <button
                      onClick={() => setOpen((v) => !v)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 5,
                        padding: "6px 10px",
                        borderRadius: 6,
                        border: "none",
                        background: "transparent",
                        cursor: "pointer",
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: 13,
                        fontWeight: active || open ? 500 : 400,
                        color: active || open ? t.textPrimary : t.textMeta,
                        letterSpacing: "-0.01em",
                        position: "relative",
                        transition: "color 150ms",
                      }}
                      onMouseEnter={(e) => {
                        if (!active && !open)
                          (e.currentTarget as HTMLElement).style.color =
                            "#D4D4D8";
                      }}
                      onMouseLeave={(e) => {
                        if (!active && !open)
                          (e.currentTarget as HTMLElement).style.color =
                            t.textMeta;
                      }}
                    >
                      {label}
                      <Chevron open={open} />
                      {active && <ActiveBar />}
                    </button>
                    <OverviewDropdown
                      open={open}
                      onClose={() => setOpen(false)}
                    />
                  </div>
                );
              }

              return (
                <Link
                  key={href}
                  href={href}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "6px 10px",
                    borderRadius: 6,
                    fontSize: 13,
                    fontWeight: active ? 500 : 400,
                    color: active ? t.textPrimary : t.textMeta,
                    textDecoration: "none",
                    letterSpacing: "-0.01em",
                    position: "relative",
                    transition: "color 150ms",
                  }}
                  onMouseEnter={(e) => {
                    if (!active)
                      (e.currentTarget as HTMLElement).style.color = "#D4D4D8";
                  }}
                  onMouseLeave={(e) => {
                    if (!active)
                      (e.currentTarget as HTMLElement).style.color = t.textMeta;
                  }}
                >
                  {label}
                  {active && <ActiveBar />}
                </Link>
              );
            })}
          </nav>

          {/* ── CTA group ── */}
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <Link
              href="/login"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 13,
                fontWeight: 400,
                letterSpacing: "-0.01em",
                padding: "6px 14px",
                borderRadius: 6,
                color: t.textMeta,
                textDecoration: "none",
                transition: "color 150ms",
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLElement).style.color = t.textPrimary)
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLElement).style.color = t.textMeta)
              }
            >
              Sign In
            </Link>

            {/* Primary CTA — cyan gradient, dark text, no shadow per principle 03 */}
            <Link
              href="/contact"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 13,
                fontWeight: 600,
                letterSpacing: "-0.01em",
                padding: "6px 16px",
                borderRadius: 6,
                background: `linear-gradient(135deg, ${t.cyan400}, ${t.cyan500})`,
                color: t.bgPage,
                textDecoration: "none",
                whiteSpace: "nowrap",
              }}
            >
              Request Demo
            </Link>
          </div>
        </div>
      </header>
    </>
  );
}
