"use client";

// ===========================================
// EZRA PORTAL - Marketing Home Page
// ===========================================

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Button from "@/components/ui/Button";
import MobileMenu from "@/components/ui/MobileMenu";

// Import new sections
import { Hero } from "@/components/site/Hero";
import { LogoTicker } from "@/components/site/LogoTicker";
import { ProblemSection } from "@/components/site/ProblemSection";
import { BuildingSection } from "@/components/site/BuildingSection";
import { ModulesSection } from "@/components/site/ModulesSection";
import { MetricsSection } from "@/components/site/MetricsSection";
import { ArchitectureSection } from "@/components/site/ArchitectureSection";
import { WhyEzraSection } from "@/components/site/WhyEzraSection";
import { RoadmapSection } from "@/components/site/RoadmapSection";
import { CTAFooter } from "@/components/site/CTAFooter";

import { useState, useEffect } from "react";
import { Header } from "@/components/site/Header";

// ============ Header ============
// const Header = () => {
//   const [scrolled, setScrolled] = useState(false);

//   useEffect(() => {
//     const onScroll = () => setScrolled(window.scrollY > 10);
//     window.addEventListener("scroll", onScroll, { passive: true });
//     return () => window.removeEventListener("scroll", onScroll);
//   }, []);

//   return (
//     <header
//       className={`fixed top-0 left-0 right-0 z-50 relative transition-all duration-300 ${
//         scrolled
//           ? "bg-surface-950/85 backdrop-blur-xl border-b border-surface-800/50"
//           : "bg-transparent border-b border-transparent"
//       }`}
//     >
//       {/* Blue accent rule — only visible when scrolled */}
//       <div
//         className={`absolute bottom-[-1px] left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent transition-opacity duration-300 ${
//           scrolled ? "opacity-100" : "opacity-0"
//         }`}
//       />

//       <div className="max-w-7xl mx-auto px-6">
//         <div className="flex items-center justify-between h-16 gap-8">
//           {/* Logo */}
//           <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
//             <div className="w-9 h-9 rounded-[10px] bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-[0_0_0_1px_rgba(59,130,246,0.3),0_4px_16px_rgba(59,130,246,0.2)]">
//               <span className="text-white font-bold text-lg">E</span>
//             </div>
//             <span className="text-[18px] font-semibold text-white tracking-tight">
//               Ezra
//             </span>
//           </Link>

//           {/* Nav */}
//           <nav className="hidden md:flex items-center gap-0.5 flex-1 justify-center">
//             {[
//               { href: "/bots", label: "The Ezra Family", active: true },
//               { href: "/solutions", label: "Solutions" },
//               { href: "/platform", label: "Platform" },
//               { href: "/about", label: "About" },
//               { href: "/contact", label: "Contact" },
//             ].map(({ href, label, active }) => (
//               <Link
//                 key={href}
//                 href={href}
//                 className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 whitespace-nowrap ${
//                   active
//                     ? "text-blue-400"
//                     : "text-surface-400 hover:text-white hover:bg-white/5"
//                 }`}
//               >
//                 {label}
//               </Link>
//             ))}
//           </nav>

//           {/* CTA */}
//           <MobileMenu active={undefined} />
//           <div className="hidden md:flex items-center gap-2.5 flex-shrink-0">
//             <Link href="/login">
//               <Button
//                 variant="ghost"
//                 className="text-sm font-medium text-surface-400 border border-white/10 hover:text-white hover:border-white/20 hover:bg-white/5 transition-all"
//               >
//                 Sign In
//               </Button>
//             </Link>
//             <Link href="/contact">
//               <Button className="text-sm font-semibold bg-gradient-to-br from-blue-500 to-blue-600 border border-blue-500/40 shadow-[0_2px_8px_rgba(37,99,235,0.3)] hover:shadow-[0_4px_16px_rgba(37,99,235,0.45)] hover:from-blue-400 hover:to-blue-500 transition-all">
//                 Request Demo
//               </Button>
//             </Link>
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// };
// ============ Footer ============
const FOOTER_LINKS = {
  Product: [
    { href: "/bots", label: "The Ezra Family", badge: "NEW" },
    { href: "/solutions", label: "Solutions" },
    { href: "/platform", label: "Platform" },
    { href: "/integrations", label: "Integrations" },
    { href: "/changelog", label: "Changelog" },
  ],
  Company: [
    { href: "/about", label: "About" },
    { href: "/blog", label: "Blog" },
    { href: "/careers", label: "Careers" },
    { href: "/press", label: "Press" },
    { href: "/contact", label: "Contact" },
  ],
  Resources: [
    { href: "/docs", label: "Documentation" },
    { href: "/api", label: "API Reference" },
    { href: "/security", label: "Security" },
    { href: "/status", label: "Status" },
    { href: "/support", label: "Support" },
  ],
};

const SOCIAL_LINKS = [
  { href: "https://twitter.com", label: "Twitter", icon: "𝕏" },
  { href: "https://linkedin.com", label: "LinkedIn", icon: "in" },
  { href: "https://github.com", label: "GitHub", icon: "⌥" },
];

const Footer = () => (
  <footer className="bg-surface-950 border-t border-surface-800/70 relative overflow-hidden">
    {/* Blue glow at top */}
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-px bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />

    {/* Main grid */}
    <div className="max-w-7xl mx-auto px-6 pt-14 pb-10 grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr] gap-12">
      {/* Brand */}
      <div>
        <Link href="/" className="flex items-center gap-2.5 mb-4">
          <div className="w-9 h-9 rounded-[10px] bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-[0_0_0_1px_rgba(59,130,246,0.3)]">
            <span className="text-white font-bold text-lg">E</span>
          </div>
          <span className="text-[18px] font-semibold text-white tracking-tight">
            Ezra
          </span>
        </Link>
        <p className="text-sm text-surface-500 leading-relaxed max-w-[220px] mb-6">
          Intelligent AI assistants built for the way your team actually works.
        </p>
      </div>

      {/* Link columns */}
      {Object.entries(FOOTER_LINKS).map(([section, links]) => (
        <div key={section}>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-surface-600 mb-4">
            {section}
          </p>
          <ul className="flex flex-col gap-2.5">
            {links.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="text-[13.5px] text-surface-500 hover:text-white transition-colors duration-150 flex items-center gap-2"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>

    {/* Bottom bar */}
    <div className="border-t border-surface-800/50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <span className="text-[12.5px] text-surface-600">
          © 2026 Ezra AI, Inc. All rights reserved.
        </span>

        {/* Status indicator */}
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.6)]" />
          <span className="text-[12.5px] text-surface-600">
            All systems operational
          </span>
        </div>

        <div className="flex items-center gap-5">
          {[
            { href: "/privacy", label: "Privacy" },
            { href: "/terms", label: "Terms" },
            { href: "/cookies", label: "Cookies" },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-[12.5px] text-surface-600 hover:text-surface-400 transition-colors"
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  </footer>
);

// ============ Main Page ============
export default function HomePage() {
  return (
    <div className="min-h-screen bg-surface-950">
      <Header />
      <main className="relative bg-background text-foreground antialiased">
        <Hero />
        <LogoTicker />
        <div id="platform">
          <ProblemSection />
        </div>
        <BuildingSection />
        <ModulesSection />
        <RoadmapSection />
        <ArchitectureSection />
        <WhyEzraSection />

        <CTAFooter />
      </main>
      <Footer />
    </div>
  );
}
