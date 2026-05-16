"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, MapPin, Send, Check } from "lucide-react";
import Input from "@/components/ui/Input";
import MobileMenu from "@/components/ui/MobileMenu";

// ─── Brand tokens (V2, May 2026) ─────────────────────────────────────────────
// Primary: #06B6D4 | Hover: #22D3EE | Page: #09090B | Card: #141417 | Border: #27272A
// Text: #FAFAFA / #71717A / #3F3F46 / #A1A1AA
// DM Sans 300–700 | DM Mono 400/500 (numbers & code only)

// ─── Header ──────────────────────────────────────────────────────────────────

const Header = () => (
  <header
    className="fixed top-0 left-0 right-0 z-50 h-16 flex items-center border-b backdrop-blur-xl"
    style={{ background: "rgba(9,9,11,0.85)", borderColor: "#27272A" }}
  >
    <div className="max-w-7xl w-full mx-auto px-6 flex items-center justify-between">
      <Link href="/" className="group flex items-center gap-2.5 no-underline">
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold text-[#09090b] transition-transform group-hover:scale-105"
          style={{ background: "linear-gradient(135deg, #22D3EE, #06B6D4)" }}
        >
          E
        </div>
        <span
          style={{
            fontWeight: 600,
            letterSpacing: "0.18em",
            fontSize: "14px",
            color: "#FAFAFA",
            textTransform: "uppercase",
          }}
        >
          Ezra
        </span>
      </Link>

      <nav className="hidden md:flex items-center gap-8">
        {[
          { label: "The Ezra Family", href: "/bots" },
          { label: "Solutions", href: "/solutions" },
          { label: "Platform", href: "/platform" },
          { label: "About", href: "/about" },
          { label: "Contact", href: "/contact" },
        ].map(({ label, href }) => (
          <Link
            key={href}
            href={href}
            className="text-[13px] transition-all duration-200 no-underline relative"
            style={{
              color: href === "/contact" ? "#06B6D4" : "#71717A",
              fontWeight: href === "/contact" ? 600 : 400,
            }}
          >
            {label}
            {href === "/contact" && (
              <span
                className="absolute -bottom-1 left-0 right-0 h-px rounded-full"
                style={{
                  background: "linear-gradient(90deg, #22D3EE, #06B6D4)",
                }}
              />
            )}
          </Link>
        ))}
      </nav>

      <MobileMenu active="Contact" />

      <div className="hidden md:flex items-center gap-3">
        <Link
          href="/login"
          className="text-[13px] px-3.5 py-1.5 rounded-lg no-underline"
          style={{ color: "#71717A" }}
        >
          Sign In
        </Link>
        <Link
          href="/contact"
          className="text-[13px] font-semibold px-5 py-2 rounded-lg no-underline"
          style={{
            background: "linear-gradient(135deg, #22D3EE, #06B6D4)",
            color: "#09090b",
          }}
        >
          Request Demo
        </Link>
      </div>
    </div>
  </header>
);

// ─── Footer ───────────────────────────────────────────────────────────────────

const Footer = () => (
  <footer
    className="py-10 border-t"
    style={{ background: "#09090b", borderColor: "#27272A" }}
  >
    <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div
          className="w-7 h-7 rounded-[7px] flex items-center justify-center text-sm font-bold text-[#09090b]"
          style={{ background: "linear-gradient(135deg, #22D3EE, #06B6D4)" }}
        >
          E
        </div>
        <span className="text-[12px]" style={{ color: "#3F3F46" }}>
          © 2026 Ezra AI. All rights reserved.
        </span>
      </div>
      <div className="flex gap-6">
        {[
          { label: "Privacy Policy", href: "/privacy" },
          { label: "Terms of Service", href: "/terms" },
        ].map(({ label, href }) => (
          <Link
            key={href}
            href={href}
            className="text-[12px] no-underline"
            style={{ color: "#3F3F46" }}
          >
            {label}
          </Link>
        ))}
      </div>
    </div>
  </footer>
);

// ─── Shared input / select styles ────────────────────────────────────────────

const fieldBase: React.CSSProperties = {
  width: "100%",
  borderRadius: "10px",
  border: "1px solid #27272A",
  background: "#09090b",
  color: "#FAFAFA",
  padding: "10px 14px",
  fontSize: "14px",
  outline: "none",
  fontFamily: "'DM Sans', sans-serif",
  transition: "border-color 0.2s ease",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "12px",
  fontWeight: 500,
  letterSpacing: "0.04em",
  color: "#A1A1AA",
  marginBottom: "6px",
  textTransform: "uppercase",
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ContactPage() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    company: "",
    role: "",
    locations: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 1400));
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormState((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const focusStyle = (name: string): React.CSSProperties => ({
    ...fieldBase,
    borderColor: focused === name ? "rgba(6,182,212,0.5)" : "#27272A",
    boxShadow: focused === name ? "0 0 0 3px rgba(6,182,212,0.08)" : "none",
  });

  return (
    <div
      className="min-h-screen"
      style={{
        background: "#09090b",
        color: "#FAFAFA",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&family=DM+Mono:wght@400;500&display=swap");
        *,
        *::before,
        *::after {
          box-sizing: border-box;
        }
        body {
          font-family: "DM Sans", sans-serif;
        }

        @keyframes float-up {
          from {
            opacity: 0;
            transform: translateY(22px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .reveal {
          animation: float-up 0.7s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        .reveal-1 {
          animation-delay: 0.1s;
        }
        .reveal-2 {
          animation-delay: 0.22s;
        }

        @keyframes shimmer {
          0% {
            background-position: -200% center;
          }
          100% {
            background-position: 200% center;
          }
        }
        .shimmer-text {
          background: linear-gradient(
            90deg,
            #22d3ee 0%,
            #cffafe 30%,
            #06b6d4 55%,
            #cffafe 75%,
            #22d3ee 100%
          );
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          animation: shimmer 4.5s linear infinite;
        }

        .brand-grid {
          background-image: linear-gradient(
              rgba(6, 182, 212, 0.03) 1px,
              transparent 1px
            ),
            linear-gradient(90deg, rgba(6, 182, 212, 0.03) 1px, transparent 1px);
          background-size: 72px 72px;
        }

        select option {
          background: #141417;
          color: #fafafa;
        }
      `}</style>

      <main className="pt-16">
        {/* ── Hero ── */}
        <section className="relative py-24 overflow-hidden">
          <div className="absolute inset-0 brand-grid opacity-50 pointer-events-none" />
          <div
            className="pointer-events-none absolute top-1/3 left-1/2 -translate-x-1/2 h-[400px] w-[800px] rounded-full"
            style={{
              background:
                "radial-gradient(closest-side, rgba(6,182,212,0.1) 0%, transparent 70%)",
              filter: "blur(60px)",
            }}
          />

          <div className="relative max-w-7xl mx-auto px-6 text-center">
            <div className="reveal inline-flex items-center gap-2 mb-8">
              <div
                className="w-8 h-px rounded-full"
                style={{ background: "#06B6D4" }}
              />
              <span
                className="text-[10px] tracking-[0.22em] uppercase font-medium"
                style={{ color: "#06B6D4" }}
              >
                Get in Touch
              </span>
              <div
                className="w-8 h-px rounded-full"
                style={{ background: "#06B6D4" }}
              />
            </div>

            {/* Hero headline: DM Sans Light (300), -0.035em */}
            <h1
              className="reveal reveal-1 mx-auto max-w-[14ch] text-balance"
              style={{
                fontWeight: 300,
                fontSize: "clamp(44px, 7vw, 84px)",
                lineHeight: 0.98,
                letterSpacing: "-0.035em",
                color: "#FAFAFA",
              }}
            >
              Let's <em className="shimmer-text not-italic">talk.</em>
            </h1>

            <p
              className="reveal reveal-2 mx-auto mt-8 max-w-lg text-pretty"
              style={{
                fontSize: "16px",
                color: "#71717A",
                fontWeight: 400,
                lineHeight: 1.55,
              }}
            >
              Ready to transform your franchise operations? Fill out the form
              below and our team will get back to you within 24 hours.
            </p>
          </div>
        </section>

        {/* ── Form Section ── */}
        <section className="pb-24">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-3 gap-12">
              {/* ── Left — contact info ── */}
              <div className="lg:col-span-1 space-y-10">
                <div>
                  {/* Subsection heading: DM Sans Medium */}
                  <h2
                    style={{
                      fontSize: "18px",
                      fontWeight: 500,
                      color: "#FAFAFA",
                      marginBottom: "10px",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    Get in touch
                  </h2>
                  <p
                    style={{
                      fontSize: "14px",
                      color: "#71717A",
                      lineHeight: 1.7,
                    }}
                  >
                    Have questions about Ezra? Want to schedule a demo? We'd
                    love to hear from you.
                  </p>
                </div>

                <div className="space-y-6">
                  {[
                    {
                      icon: Mail,
                      label: "Email",
                      value: "onboarding@meetezra.bot",
                    },
                    {
                      icon: MapPin,
                      label: "Office",
                      value: "San Francisco, CA\nUnited States",
                    },
                  ].map(({ icon: Icon, label, value }) => (
                    <div key={label} className="flex items-start gap-4">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{
                          background: "rgba(6,182,212,0.08)",
                          border: "1px solid rgba(6,182,212,0.15)",
                        }}
                      >
                        <Icon
                          className="w-5 h-5"
                          style={{ color: "#06B6D4" }}
                        />
                      </div>
                      <div>
                        <p
                          style={{
                            fontSize: "12px",
                            fontWeight: 600,
                            color: "#A1A1AA",
                            textTransform: "uppercase",
                            letterSpacing: "0.1em",
                            marginBottom: "3px",
                          }}
                        >
                          {label}
                        </p>
                        <p
                          style={{
                            fontSize: "14px",
                            color: "#71717A",
                            lineHeight: 1.6,
                            whiteSpace: "pre-line",
                          }}
                        >
                          {value}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* What to expect */}
                <div
                  className="pt-6 border-t"
                  style={{ borderColor: "#27272A" }}
                >
                  <p
                    style={{
                      fontSize: "12px",
                      fontWeight: 600,
                      color: "#A1A1AA",
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      marginBottom: "14px",
                    }}
                  >
                    What to expect
                  </p>
                  <ul className="space-y-3">
                    {[
                      "Response within 24 hours",
                      "Custom demo of relevant features",
                      "Discussion of your specific needs",
                      "No pressure, no sales pitch",
                    ].map((item) => (
                      <li key={item} className="flex items-center gap-3">
                        <div
                          className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                          style={{
                            background: "rgba(6,182,212,0.1)",
                            border: "1px solid rgba(6,182,212,0.2)",
                          }}
                        >
                          <Check
                            className="w-3 h-3"
                            style={{ color: "#06B6D4" }}
                          />
                        </div>
                        <span style={{ fontSize: "13px", color: "#71717A" }}>
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* ── Right — form ── */}
              <div className="lg:col-span-2">
                {isSubmitted ? (
                  <div
                    className="rounded-2xl border p-12 text-center"
                    style={{ background: "#141417", borderColor: "#27272A" }}
                  >
                    <div
                      className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center"
                      style={{
                        background: "rgba(6,182,212,0.1)",
                        border: "1px solid rgba(6,182,212,0.25)",
                      }}
                    >
                      <Check className="w-8 h-8" style={{ color: "#06B6D4" }} />
                    </div>
                    <h3
                      style={{
                        fontSize: "22px",
                        fontWeight: 500,
                        color: "#FAFAFA",
                        marginBottom: "12px",
                        letterSpacing: "-0.02em",
                      }}
                    >
                      Thanks for reaching out.
                    </h3>
                    <p
                      style={{
                        fontSize: "14px",
                        color: "#71717A",
                        maxWidth: "380px",
                        margin: "0 auto 32px",
                        lineHeight: 1.7,
                      }}
                    >
                      We've received your message and will get back to you
                      within 24 hours. In the meantime, feel free to explore our
                      platform.
                    </p>
                    <div className="flex justify-center gap-3 flex-wrap">
                      <Link
                        href="/bots"
                        className="inline-flex items-center px-6 py-2.5 rounded-xl border no-underline text-[13px] transition-all duration-200"
                        style={{ borderColor: "#27272A", color: "#71717A" }}
                      >
                        Meet The Ezra Family
                      </Link>
                      <Link
                        href="/"
                        className="inline-flex items-center px-6 py-2.5 rounded-xl no-underline text-[13px] font-semibold"
                        style={{
                          background:
                            "linear-gradient(135deg, #22D3EE, #06B6D4)",
                          color: "#09090b",
                        }}
                      >
                        Back to Home
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div
                    className="rounded-2xl border p-8"
                    style={{ background: "#141417", borderColor: "#27272A" }}
                  >
                    {/* Card title: DM Sans Semibold */}
                    <h3
                      style={{
                        fontSize: "16px",
                        fontWeight: 600,
                        color: "#FAFAFA",
                        marginBottom: "24px",
                        letterSpacing: "-0.01em",
                      }}
                    >
                      Request a demo
                    </h3>

                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="grid md:grid-cols-2 gap-5">
                        <div>
                          <label style={labelStyle}>Full Name</label>
                          <input
                            name="name"
                            value={formState.name}
                            onChange={handleChange}
                            placeholder="John Smith"
                            required
                            style={focusStyle("name")}
                            onFocus={() => setFocused("name")}
                            onBlur={() => setFocused(null)}
                          />
                        </div>
                        <div>
                          <label style={labelStyle}>Work Email</label>
                          <input
                            type="email"
                            name="email"
                            value={formState.email}
                            onChange={handleChange}
                            placeholder="john@company.com"
                            required
                            style={focusStyle("email")}
                            onFocus={() => setFocused("email")}
                            onBlur={() => setFocused(null)}
                          />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-5">
                        <div>
                          <label style={labelStyle}>Company / Brand</label>
                          <input
                            name="company"
                            value={formState.company}
                            onChange={handleChange}
                            placeholder="Acme Franchise Group"
                            required
                            style={focusStyle("company")}
                            onFocus={() => setFocused("company")}
                            onBlur={() => setFocused(null)}
                          />
                        </div>
                        <div>
                          <label style={labelStyle}>Your Role</label>
                          <select
                            name="role"
                            value={formState.role}
                            onChange={handleChange}
                            required
                            style={{
                              ...focusStyle("role"),
                              appearance: "none",
                              cursor: "pointer",
                            }}
                            onFocus={() => setFocused("role")}
                            onBlur={() => setFocused(null)}
                          >
                            <option value="">Select your role</option>
                            <option value="franchisor">
                              Franchisor / Corporate
                            </option>
                            <option value="franchisee">Franchisee</option>
                            <option value="district_manager">
                              District / Regional Manager
                            </option>
                            <option value="store_manager">Store Manager</option>
                            <option value="operations">Operations</option>
                            <option value="it">IT / Technology</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label style={labelStyle}>Number of Locations</label>
                        <select
                          name="locations"
                          value={formState.locations}
                          onChange={handleChange}
                          required
                          style={{
                            ...focusStyle("locations"),
                            appearance: "none",
                            cursor: "pointer",
                          }}
                          onFocus={() => setFocused("locations")}
                          onBlur={() => setFocused(null)}
                        >
                          <option value="">Select range</option>
                          <option value="1-5">1–5 locations</option>
                          <option value="6-20">6–20 locations</option>
                          <option value="21-50">21–50 locations</option>
                          <option value="51-100">51–100 locations</option>
                          <option value="100+">100+ locations</option>
                        </select>
                      </div>

                      <div>
                        <label style={labelStyle}>How can we help?</label>
                        <textarea
                          name="message"
                          value={formState.message}
                          onChange={handleChange}
                          rows={4}
                          placeholder="Tell us about your franchise operations and what you're looking to improve..."
                          style={{
                            ...focusStyle("message"),
                            resize: "none",
                            borderColor:
                              focused === "message"
                                ? "rgba(6,182,212,0.5)"
                                : "#27272A",
                            boxShadow:
                              focused === "message"
                                ? "0 0 0 3px rgba(6,182,212,0.08)"
                                : "none",
                          }}
                          onFocus={() => setFocused("message")}
                          onBlur={() => setFocused(null)}
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-[1.01] disabled:opacity-60"
                        style={{
                          background:
                            "linear-gradient(135deg, #22D3EE, #06B6D4)",
                          color: "#09090b",
                          fontSize: "14px",
                          border: "none",
                          cursor: isSubmitting ? "not-allowed" : "pointer",
                        }}
                      >
                        {isSubmitting ? (
                          <>
                            <svg
                              className="animate-spin w-4 h-4"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              />
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8v8H4z"
                              />
                            </svg>
                            Sending…
                          </>
                        ) : (
                          <>
                            Send Message
                            <Send className="w-4 h-4" />
                          </>
                        )}
                      </button>

                      <p
                        style={{
                          fontSize: "11px",
                          color: "#3F3F46",
                          textAlign: "center",
                        }}
                      >
                        By submitting this form, you agree to our{" "}
                        <Link
                          href="/privacy"
                          className="no-underline"
                          style={{ color: "#06B6D4" }}
                        >
                          Privacy Policy
                        </Link>
                        .
                      </p>
                    </form>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
