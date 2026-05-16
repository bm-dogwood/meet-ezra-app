"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import DashboardMock from "./DashboardMock";
import terrain from "@/assets/hero.jpg";

// ── Ezra V2 brand tokens ──────────────────────────────────────────────────
// Colors: Brand Reference May 2026
// Typography: DM Sans 300/400/500/600, DM Mono 400 — Google Fonts
const CYAN = "#06B6D4"; // Cyan 500 — primary accent / buttons / links
const CYAN_LIGHT = "#22D3EE"; // Cyan 400 — hover states, gradient stop
const CYAN_PALE = "rgba(6,182,212,0.10)";
const CYAN_GLOW = "rgba(6,182,212,0.50)";

export function Hero() {
  const [y, setY] = useState(0);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setY(window.scrollY));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section className="relative isolate overflow-hidden pt-32 pb-24 lg:pt-44 lg:pb-32">
      {/* Parallax: terrain image */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{ transform: `translate3d(0, ${y * 0.25}px, 0)` }}
      >
        <Image
          src={terrain}
          alt=""
          className="h-full w-full object-cover object-center"
          style={{
            opacity: 4,
            filter: "brightness(1.75) contrast(1.15) saturate(1.35)",
          }}
          priority
        />
      </div>

      {/* Legibility fade — left-to-right + bottom fade, no colored blob */}
      <div
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background:
            "linear-gradient(90deg,#09090B 0%,rgba(9,9,11,0.48) 32%,transparent 68%)," +
            "linear-gradient(180deg,transparent 0%,transparent 64%,#09090B 100%)",
        }}
      />

      {/* Subtle cyan horizon lift — restrained, not a glowing blob */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-[1]"
        style={{
          height: "68%",
          background: `radial-gradient(ellipse at 50% 22%, rgba(6,182,212,0.18), transparent 68%)`,
          opacity: 0.7,
        }}
      />

      {/* Bottom fade */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[2]"
        style={{
          height: "33%",
          background: "linear-gradient(180deg, transparent 0%, #09090B 100%)",
        }}
      />

      {/* Parallax: hairline grid */}

      {/* Cyan ambient — top center, contained */}
      <div
        className="pointer-events-none absolute -top-40 left-1/2 z-[3] h-[600px] w-[1100px] -translate-x-1/2 rounded-full"
        style={{
          opacity: 0.28,
          background: `radial-gradient(closest-side, ${CYAN_GLOW}, transparent 70%)`,
          transform: `translate3d(-50%, ${y * 0.18}px, 0)`,
        }}
      />

      <div className="relative z-10 mx-auto max-w-[1400px] px-4 lg:px-2">
        {/* Status badge — DM Mono eyebrow */}
        <div className="reveal mb-8 flex items-center gap-2"></div>

        {/* Hero headline — DM Sans 300 Light, editorial scale */}
        <h1
          className="reveal reveal-delay-1 max-w-[14ch] text-balance"
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 300,
            fontSize: "clamp(56px, 9vw, 128px)",
            lineHeight: 0.95,
            letterSpacing: "-0.035em",
            color: "rgba(255,255,255,0.92)",
            transform: `translate3d(0, ${y * -0.08}px, 0)`,
          }}
        >
          AI-Powered Intelligence for{" "}
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
            Franchise Operations.
          </span>
        </h1>

        <div
          className="mt-10 grid gap-10 lg:grid-cols-12 lg:gap-16"
          style={{ transform: `translate3d(0, ${y * -0.04}px, 0)` }}
        >
          {/* Body — DM Sans Regular, ≤70ch, 1.55 line-height */}
          <p
            className="reveal reveal-delay-2 max-w-xl text-pretty lg:col-span-6"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 400,
              fontSize: "17px",
              lineHeight: 1.55,
              letterSpacing: 0,
              color: "rgba(255,255,255,0.55)",
            }}
          >
            Ezra is the operational intelligence layer for multi-unit businesses
            — unifying loss prevention, scheduling, inventory, CRM retention and
            revenue intelligence into a single executive console.
          </p>

          <div className="reveal reveal-delay-3 flex flex-col gap-4 lg:col-span-6 lg:items-end">
            <div className="flex flex-wrap items-center gap-3">
              {/* Primary CTA — Cyan 500 fill, dark text for contrast */}
              <a
                href="#contact"
                className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full px-5 py-2.5 transition-all hover:brightness-110"
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 500,
                  fontSize: "13px",
                  background: CYAN,
                  color: "#09090B", // dark text on cyan — per brand contrast guidance
                  // No box-shadow — brand principle 03
                }}
              >
                <span className="relative">Request access</span>
                <span className="relative transition-transform group-hover:translate-x-0.5">
                  →
                </span>
              </a>

              {/* Ghost CTA — hairline cyan border */}
              <a
                href="#platform"
                className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 transition-colors hover:bg-[rgba(6,182,212,0.10)]"
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 400,
                  fontSize: "13px",
                  border: `1px solid rgba(6,182,212,0.30)`,
                  color: CYAN,
                }}
              >
                See the platform
              </a>
            </div>

            {/* Meta — DM Mono captions */}
            <div
              className="flex items-center gap-6"
              style={{
                fontFamily: "'DM Mono', monospace",
                fontWeight: 400,
                fontSize: "10px",
                textTransform: "uppercase",
                letterSpacing: "0.18em",
                color: "rgba(6,182,212,0.55)",
              }}
            >
              <span>SOC 2 · in progress</span>
              <span>POS native</span>
              <span>Deployed in 14 days</span>
            </div>
          </div>
        </div>

        <div
          className="reveal reveal-delay-4 mt-20"
          style={{
            transform: `perspective(1800px) rotateX(${Math.max(
              0,
              10 - y * 0.04
            )}deg) translate3d(0, ${y * -0.02}px, 0)`,
            transformOrigin: "center top",
            // Subtle cyan drop — not a blob, just a glow under the card
            filter: `drop-shadow(0 0 48px rgba(6,182,212,0.20))`,
          }}
        >
          <DashboardMock />
        </div>
      </div>
    </section>
  );
}
