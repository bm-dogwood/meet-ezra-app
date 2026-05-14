"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import MobileMenu from "../ui/MobileMenu";
import Button from "../ui/Button";

export function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-surface-950/85 backdrop-blur-xl border-b border-surface-800/50"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      {/* Blue accent rule */}
      <div
        className={`absolute bottom-[-1px] left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent transition-opacity duration-300 ${
          scrolled ? "opacity-100" : "opacity-0"
        }`}
      />

      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16 gap-8">
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
            <div className="w-9 h-9 rounded-[10px] bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-[0_0_0_1px_rgba(59,130,246,0.3),0_4px_16px_rgba(59,130,246,0.2)]">
              <span className="text-white font-bold text-lg">E</span>
            </div>
            <span className="text-[18px] font-semibold text-white tracking-tight">
              Ezra
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-0.5 flex-1 justify-center">
            {[
              { href: "/bots", label: "The Ezra Family", active: true },
              { href: "/solutions", label: "Solutions" },
              { href: "/platform", label: "Platform" },
              { href: "/about", label: "About" },
              { href: "/contact", label: "Contact" },
            ].map(({ href, label, active }) => (
              <Link
                key={href}
                href={href}
                className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 whitespace-nowrap ${
                  active
                    ? "text-blue-400"
                    : "text-surface-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>

          <MobileMenu active={undefined} />
          <div className="hidden md:flex items-center gap-2.5 flex-shrink-0">
            <Link href="/login">
              <Button
                variant="ghost"
                className="text-sm font-medium text-surface-400 border border-white/10 hover:text-white hover:border-white/20 hover:bg-white/5 transition-all"
              >
                Sign In
              </Button>
            </Link>
            <Link href="/contact">
              <Button className="text-sm font-semibold bg-gradient-to-br from-blue-500 to-blue-600 border border-blue-500/40 shadow-[0_2px_8px_rgba(37,99,235,0.3)] hover:shadow-[0_4px_16px_rgba(37,99,235,0.45)] hover:from-blue-400 hover:to-blue-500 transition-all">
                Request Demo
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
