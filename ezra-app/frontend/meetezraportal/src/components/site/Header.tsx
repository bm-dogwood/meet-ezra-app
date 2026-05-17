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
        bottom: -1,
        left: 8,
        right: 8,
        height: 1,
        borderRadius: 1,
        background: `linear-gradient(90deg, ${t.cyan400}, ${t.cyan500})`,
      }}
    />
  );
}

// ─── Hamburger icon ─────────────────────────────────────────────────────────
function HamburgerIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
    >
      <style>{`
        .ham-top {
          transition: transform 250ms ease, opacity 250ms ease;
          transform-origin: center;
        }
        .ham-mid {
          transition: transform 250ms ease, opacity 250ms ease;
          transform-origin: center;
        }
        .ham-bot {
          transition: transform 250ms ease, opacity 250ms ease;
          transform-origin: center;
        }
        .ham-open .ham-top { transform: translateY(4px) rotate(45deg); }
        .ham-open .ham-mid { opacity: 0; transform: scaleX(0); }
        .ham-open .ham-bot { transform: translateY(-4px) rotate(-45deg); }
      `}</style>
      <g className={open ? "ham-open" : ""}>
        <rect
          className="ham-top"
          x="3"
          y="5"
          width="14"
          height="1.5"
          rx="1"
          fill={t.textMeta}
        />
        <rect
          className="ham-mid"
          x="3"
          y="9.25"
          width="14"
          height="1.5"
          rx="1"
          fill={t.textMeta}
        />
        <rect
          className="ham-bot"
          x="3"
          y="13.5"
          width="14"
          height="1.5"
          rx="1"
          fill={t.textMeta}
        />
      </g>
    </svg>
  );
}

// ─── Overview Dropdown (desktop) ────────────────────────────────────────────
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
        boxShadow: "0 24px 48px rgba(0,0,0,0.6)",
        opacity: open ? 1 : 0,
        pointerEvents: open ? "auto" : "none",
        transition: "opacity 180ms ease",
        zIndex: 100,
      }}
    >
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

// ─── Mobile menu ─────────────────────────────────────────────────────────────
function MobileMenu({
  open,
  pathname,
  onClose,
}: {
  open: boolean;
  pathname: string;
  onClose: () => void;
}) {
  const [overviewOpen, setOverviewOpen] = useState(false);

  // Reset overview when menu closes
  useEffect(() => {
    if (!open) setOverviewOpen(false);
  }, [open]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          top: 64,
          background: "rgba(0,0,0,0.5)",
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
          transition: "opacity 200ms ease",
          zIndex: 40,
        }}
      />

      {/* Drawer */}
      <div
        style={{
          position: "fixed",
          top: 64,
          left: 0,
          right: 0,
          background: t.bgCard,
          borderBottom: `1px solid ${t.borderDark}`,
          zIndex: 45,
          transform: open ? "translateY(0)" : "translateY(-8px)",
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
          transition: "transform 220ms ease, opacity 220ms ease",
          fontFamily: "'DM Sans', sans-serif",
          overflowY: "auto",
          maxHeight: "calc(100dvh - 64px)",
        }}
      >
        <nav style={{ padding: "8px 0" }}>
          {NAV_ITEMS.map(({ label, href, dropdown }) => {
            const active = isActive(href);

            if (dropdown) {
              return (
                <div key={href}>
                  <button
                    onClick={() => setOverviewOpen((v) => !v)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      width: "100%",
                      padding: "13px 20px",
                      background: "transparent",
                      border: "none",
                      cursor: "pointer",
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: 15,
                      fontWeight: active ? 500 : 400,
                      color: active ? t.textPrimary : t.textMeta,
                      letterSpacing: "-0.01em",
                      textAlign: "left",
                    }}
                  >
                    <span
                      style={{ display: "flex", alignItems: "center", gap: 8 }}
                    >
                      {active && (
                        <span
                          style={{
                            width: 3,
                            height: 3,
                            borderRadius: "50%",
                            background: t.cyan400,
                            flexShrink: 0,
                          }}
                        />
                      )}
                      {label}
                    </span>
                    <Chevron open={overviewOpen} />
                  </button>

                  {/* Collapsible overview sub-items */}
                  <div
                    style={{
                      maxHeight: overviewOpen ? 600 : 0,
                      overflow: "hidden",
                      transition: "max-height 280ms ease",
                    }}
                  >
                    <div
                      style={{
                        padding: "4px 20px 8px",
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: 4,
                        borderTop: `1px solid ${t.borderDark}`,
                        paddingTop: 10,
                        marginTop: 2,
                      }}
                    >
                      {OVERVIEW_ITEMS.map(
                        ({ label: subLabel, href: subHref, description }) => (
                          <Link
                            key={subHref}
                            href={subHref}
                            onClick={onClose}
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              gap: 2,
                              padding: "10px 12px",
                              borderRadius: 8,
                              textDecoration: "none",
                              background: "rgba(255,255,255,0.03)",
                            }}
                          >
                            <span
                              style={{
                                fontSize: 13,
                                fontWeight: 500,
                                color: t.textPrimary,
                                letterSpacing: "-0.01em",
                              }}
                            >
                              {subLabel}
                            </span>
                            <span
                              style={{
                                fontSize: 11,
                                color: t.textMeta,
                                lineHeight: 1.4,
                              }}
                            >
                              {description}
                            </span>
                          </Link>
                        )
                      )}
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <Link
                key={href}
                href={href}
                onClick={onClose}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "13px 20px",
                  fontSize: 15,
                  fontWeight: active ? 500 : 400,
                  color: active ? t.textPrimary : t.textMeta,
                  textDecoration: "none",
                  letterSpacing: "-0.01em",
                }}
              >
                {active && (
                  <span
                    style={{
                      width: 3,
                      height: 3,
                      borderRadius: "50%",
                      background: t.cyan400,
                      flexShrink: 0,
                    }}
                  />
                )}
                {label}
              </Link>
            );
          })}
        </nav>

        {/* CTA row */}
        <div
          style={{
            display: "flex",
            gap: 8,
            padding: "12px 20px 20px",
            borderTop: `1px solid ${t.borderDark}`,
          }}
        >
          <Link
            href="/login"
            onClick={onClose}
            style={{
              flex: 1,
              textAlign: "center",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 14,
              fontWeight: 400,
              padding: "10px 16px",
              borderRadius: 7,
              border: `1px solid ${t.borderDark}`,
              color: t.textMeta,
              textDecoration: "none",
            }}
          >
            Sign In
          </Link>
          <Link
            href="/contact"
            onClick={onClose}
            style={{
              flex: 1,
              textAlign: "center",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 14,
              fontWeight: 600,
              padding: "10px 16px",
              borderRadius: 7,
              background: `linear-gradient(135deg, ${t.cyan400}, ${t.cyan500})`,
              color: t.bgPage,
              textDecoration: "none",
            }}
          >
            Request Demo
          </Link>
        </div>
      </div>
    </>
  );
}

// ─── Header ─────────────────────────────────────────────────────────────────
export default function Header() {
  const pathname = usePathname();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Close everything on route change
  useEffect(() => {
    setDropdownOpen(false);
    setMobileOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap');

        .ezra-nav-desktop { display: flex; align-items: center; }
        .ezra-cta-desktop { display: flex; align-items: center; gap: 4px; }
        .ezra-hamburger { display: none; }

        @media (max-width: 768px) {
          .ezra-nav-desktop { display: none !important; }
          .ezra-cta-desktop { display: none !important; }
          .ezra-hamburger { display: flex !important; align-items: center; justify-content: center; }
        }
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
            padding: "0 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* ── Logomark ── */}
          <Link
            href="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              textDecoration: "none",
              flexShrink: 0,
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

          {/* ── Desktop Navigation ── */}
          <nav className="ezra-nav-desktop">
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
                      onClick={() => setDropdownOpen((v) => !v)}
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
                        fontWeight: active || dropdownOpen ? 500 : 400,
                        color:
                          active || dropdownOpen ? t.textPrimary : t.textMeta,
                        letterSpacing: "-0.01em",
                        position: "relative",
                        transition: "color 150ms",
                      }}
                      onMouseEnter={(e) => {
                        if (!active && !dropdownOpen)
                          (e.currentTarget as HTMLElement).style.color =
                            "#D4D4D8";
                      }}
                      onMouseLeave={(e) => {
                        if (!active && !dropdownOpen)
                          (e.currentTarget as HTMLElement).style.color =
                            t.textMeta;
                      }}
                    >
                      {label}
                      <Chevron open={dropdownOpen} />
                      {active && <ActiveBar />}
                    </button>
                    <OverviewDropdown
                      open={dropdownOpen}
                      onClose={() => setDropdownOpen(false)}
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

          {/* ── Desktop CTA group ── */}
          <div className="ezra-cta-desktop">
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

          {/* ── Hamburger (mobile only) ── */}
          <button
            className="ezra-hamburger"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              padding: 8,
              borderRadius: 6,
              display: "none", // overridden by CSS class
            }}
          >
            <HamburgerIcon open={mobileOpen} />
          </button>
        </div>
      </header>

      {/* ── Mobile drawer ── */}
      <MobileMenu
        open={mobileOpen}
        pathname={pathname}
        onClose={() => setMobileOpen(false)}
      />
    </>
  );
}
