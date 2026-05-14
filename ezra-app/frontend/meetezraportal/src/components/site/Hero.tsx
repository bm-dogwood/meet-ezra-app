"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { DashboardMock } from "./DashboardMock";
import terrain from "@/assets/hero.jpeg";

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
          width={1920}
          height={1280}
          className="h-full w-full object-cover object-center opacity-100 brightness-[1.75] contrast-[1.15] saturate-[1.35]"
          priority
        />
      </div>

      {/* Light readability fade, kept transparent so the image stays visible */}
      <div className="pointer-events-none absolute inset-0 z-[1] bg-[linear-gradient(90deg,var(--background)_0%,color-mix(in_oklch,var(--background)_48%,transparent)_32%,transparent_68%),linear-gradient(180deg,transparent_0%,transparent_64%,var(--background)_100%)]" />

      {/* Blue horizon lift to make the terrain read clearly */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-[68%] opacity-70"
        style={{
          background:
            "radial-gradient(ellipse at 50% 22%, color-mix(in oklch, var(--accent) 34%, transparent), transparent 68%)",
        }}
      />

      {/* subtle blue tint + bottom fade so content stays legible */}
      <div className="pointer-events-none absolute inset-0 z-[2]">
        <div
          className="absolute inset-x-0 bottom-0 h-1/3"
          style={{
            background:
              "linear-gradient(180deg, transparent 0%, var(--background) 100%)",
          }}
        />
      </div>

      {/* Parallax: subtle grid */}
      <div
        className="pointer-events-none absolute inset-0 z-[3] opacity-[0.08]"
        style={{
          backgroundImage:
            "linear-gradient(to right, oklch(0.55 0.18 245 / 0.4) 1px, transparent 1px), linear-gradient(to bottom, oklch(0.55 0.18 245 / 0.4) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
          maskImage:
            "radial-gradient(ellipse at 50% 30%, black 40%, transparent 80%)",
          transform: `translate3d(0, ${y * 0.1}px, 0)`,
        }}
      />

      {/* Blue ambient glow — top center */}
      <div
        className="pointer-events-none absolute -top-40 left-1/2 z-[3] h-[600px] w-[1100px] -translate-x-1/2 rounded-full opacity-35"
        style={{
          background:
            "radial-gradient(closest-side, oklch(0.62 0.22 245 / 0.32), transparent 70%)",
          transform: `translate3d(-50%, ${y * 0.18}px, 0)`,
        }}
      />

      {/* Blue ambient glow — bottom left edge */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 z-[3] h-[420px] w-[520px] opacity-25"
        style={{
          background:
            "radial-gradient(closest-side, oklch(0.55 0.24 250 / 0.30), transparent 80%)",
          transform: `translate3d(-20%, ${y * 0.08}px, 0)`,
        }}
      />

      {/* Cyan glow — right edge */}
      <div
        className="pointer-events-none absolute right-0 top-1/3 z-[3] h-[480px] w-[520px] opacity-25"
        style={{
          background:
            "radial-gradient(closest-side, oklch(0.72 0.18 220 / 0.25), transparent 80%)",
          transform: `translate3d(20%, ${y * -0.06}px, 0)`,
        }}
      />

      <div className="relative z-10 mx-auto max-w-[1400px] px-6 lg:px-10">
        {/* Status badge */}
        <div className="reveal mb-8 flex items-center gap-2">
          <span className="pulse-dot inline-block h-1.5 w-1.5 rounded-full bg-accent" />
          <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-accent/85">
            Franchise intelligence · 110 active stores
          </span>
        </div>

        <h1
          className="reveal reveal-delay-1 max-w-[16ch] font-display text-[64px] font-normal leading-[0.95] tracking-[-0.02em] text-balance md:text-[96px] lg:text-[128px]"
          style={{ transform: `translate3d(0, ${y * -0.08}px, 0)` }}
        >
          AI-Powered Intelligence for{" "}
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
            Franchise Operations.
          </span>
        </h1>

        <div
          className="mt-10 grid gap-10 lg:grid-cols-12 lg:gap-16"
          style={{ transform: `translate3d(0, ${y * -0.04}px, 0)` }}
        >
          <p className="reveal reveal-delay-2 max-w-xl text-pretty text-[17px] leading-relaxed text-muted-foreground lg:col-span-6">
            Ezra is the operational intelligence layer for multi-unit businesses
            — unifying loss prevention, scheduling, inventory, CRM retention and
            revenue intelligence into a single executive console.
          </p>

          <div className="reveal reveal-delay-3 flex flex-col gap-4 lg:col-span-6 lg:items-end">
            <div className="flex flex-wrap items-center gap-3">
              <a
                href="#contact"
                className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-accent px-5 py-2.5 text-[13px] font-medium text-accent-foreground shadow-[0_8px_30px_-6px_oklch(0.55_0.22_245_/_0.55)] transition-all hover:brightness-110 hover:shadow-[0_10px_40px_-6px_oklch(0.55_0.22_245_/_0.7)]"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                <span className="relative">Request access</span>
                <span className="relative transition-transform group-hover:translate-x-0.5">
                  →
                </span>
              </a>

              <a
                href="#platform"
                className="inline-flex items-center gap-2 rounded-full border border-accent/35 px-5 py-2.5 text-[13px] text-accent/90 transition-colors hover:bg-accent/10"
              >
                See the platform
              </a>
            </div>

            <div className="flex items-center gap-6 font-mono text-[10px] uppercase tracking-wider text-accent/60">
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
            filter: "drop-shadow(0 0 60px oklch(0.55 0.22 245 / 0.25))",
          }}
        >
          <DashboardMock />
        </div>
      </div>
    </section>
  );
}
