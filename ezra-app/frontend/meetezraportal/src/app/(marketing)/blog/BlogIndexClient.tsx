"use client";

import Link from "next/link";
import { ArrowRight, Clock, ChevronRight } from "lucide-react";
import { BLOG_POSTS, getFeaturedPost, formatDate } from "@/lib/blog";

export default function BlogIndexClient() {
  const featured = getFeaturedPost();
  const rest = BLOG_POSTS.filter((p) => !p.featured);

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
        @import url("https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,300;1,9..40,400&family=DM+Mono:wght@400;500&display=swap");
        @keyframes float-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .blog-reveal {
          animation: float-up 0.7s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        .blog-reveal-1 {
          animation-delay: 0.08s;
        }
        .blog-reveal-2 {
          animation-delay: 0.18s;
        }
        .blog-reveal-3 {
          animation-delay: 0.28s;
        }
      `}</style>

      <main className="pt-16">
        {/* ── Page header ── */}
        <section className="relative pt-24 pb-16 lg:pt-32 lg:pb-20 overflow-hidden">
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 70% 40% at 50% 0%, rgba(6,182,212,0.10) 0%, transparent 70%)",
            }}
          />
          <div className="relative max-w-[1200px] mx-auto px-6 lg:px-10">
            <div className="blog-reveal mb-4 inline-flex items-center gap-2">
              <span
                className="text-[10px] tracking-[0.22em] uppercase font-medium"
                style={{ color: "#06B6D4" }}
              >
                Franchise Intelligence
              </span>
            </div>
            <h1
              className="blog-reveal blog-reveal-1 text-balance"
              style={{
                fontWeight: 300,
                fontSize: "clamp(38px, 6vw, 72px)",
                lineHeight: 1.05,
                letterSpacing: "-0.03em",
                color: "#FAFAFA",
                maxWidth: "14ch",
              }}
            >
              Insights for franchise operators.
            </h1>
            <p
              className="blog-reveal blog-reveal-2 mt-5 max-w-lg text-pretty"
              style={{ fontSize: "16px", color: "#71717A", lineHeight: 1.6 }}
            >
              Loss prevention, AI scheduling, multi-unit analytics, and
              operational strategy — written for operators running real franchise
              networks.
            </p>
          </div>
        </section>

        {/* hairline */}
        <div className="max-w-[1200px] mx-auto px-6 lg:px-10">
          <div
            className="w-full h-px"
            style={{
              background:
                "linear-gradient(90deg, transparent, #27272A, transparent)",
            }}
          />
        </div>

        {/* ── Featured post ── */}
        <section className="py-16">
          <div className="max-w-[1200px] mx-auto px-6 lg:px-10">
            <p
              className="text-[10px] tracking-[0.22em] uppercase font-medium mb-8"
              style={{ color: "#3F3F46" }}
            >
              Featured
            </p>
            <Link
              href={`/blog/${featured.slug}`}
              className="group block no-underline rounded-2xl border p-8 lg:p-12 transition-all duration-300 hover:-translate-y-1"
              style={{ background: "#141417", borderColor: "#27272A" }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor =
                  "rgba(6,182,212,0.25)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "#27272A";
              }}
            >
              <div className="flex flex-col lg:flex-row lg:items-start gap-10">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-5">
                    <span
                      className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-[0.1em] uppercase"
                      style={{
                        background: `${featured.categoryColor}18`,
                        color: featured.categoryColor,
                        border: `1px solid ${featured.categoryColor}30`,
                      }}
                    >
                      {featured.category}
                    </span>
                    <span
                      className="text-[11px] flex items-center gap-1"
                      style={{
                        fontFamily: "'DM Mono', monospace",
                        color: "#3F3F46",
                      }}
                    >
                      <Clock className="w-3 h-3" />
                      {featured.readTime} min read
                    </span>
                  </div>

                  <h2
                    className="mb-4 text-balance transition-colors duration-200 group-hover:text-[#22D3EE]"
                    style={{
                      fontWeight: 400,
                      fontSize: "clamp(22px, 3vw, 34px)",
                      lineHeight: 1.2,
                      letterSpacing: "-0.02em",
                      color: "#FAFAFA",
                    }}
                  >
                    {featured.title}
                  </h2>

                  <p
                    style={{
                      fontSize: "15px",
                      color: "#71717A",
                      lineHeight: 1.65,
                      maxWidth: "56ch",
                    }}
                  >
                    {featured.description}
                  </p>

                  <div className="flex items-center gap-6 mt-8">
                    <span className="text-[12px]" style={{ color: "#3F3F46" }}>
                      {formatDate(featured.publishedAt)}
                    </span>
                    <span
                      className="inline-flex items-center gap-1.5 text-[13px] font-medium transition-colors duration-200 group-hover:text-[#22D3EE]"
                      style={{ color: "#06B6D4" }}
                    >
                      Read article
                      <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                    </span>
                  </div>
                </div>

                {/* Tags column */}
                <div className="lg:w-[220px] flex-shrink-0">
                  <p
                    className="text-[10px] tracking-[0.18em] uppercase font-medium mb-3"
                    style={{ color: "#3F3F46" }}
                  >
                    Topics
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {featured.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[11px] px-2.5 py-1 rounded-md border"
                        style={{
                          color: "#52525B",
                          borderColor: "#27272A",
                          background: "#09090b",
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </section>

        {/* ── Post grid ── */}
        <section className="pb-28">
          <div className="max-w-[1200px] mx-auto px-6 lg:px-10">
            <p
              className="text-[10px] tracking-[0.22em] uppercase font-medium mb-8"
              style={{ color: "#3F3F46" }}
            >
              All articles
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {rest.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group flex flex-col no-underline rounded-xl border p-7 transition-all duration-300 hover:-translate-y-1"
                  style={{
                    background: "#141417",
                    borderColor: "#27272A",
                    minHeight: "280px",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor =
                      "rgba(6,182,212,0.22)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor =
                      "#27272A";
                  }}
                >
                  <div className="flex items-center gap-2 mb-4">
                    <span
                      className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-semibold tracking-[0.1em] uppercase"
                      style={{
                        background: `${post.categoryColor}15`,
                        color: post.categoryColor,
                        border: `1px solid ${post.categoryColor}28`,
                      }}
                    >
                      {post.category}
                    </span>
                    <span
                      className="text-[10px] flex items-center gap-1"
                      style={{
                        fontFamily: "'DM Mono', monospace",
                        color: "#3F3F46",
                      }}
                    >
                      <Clock className="w-2.5 h-2.5" />
                      {post.readTime} min
                    </span>
                  </div>

                  <h3
                    className="mb-3 transition-colors duration-200 group-hover:text-[#22D3EE]"
                    style={{
                      fontWeight: 500,
                      fontSize: "15px",
                      lineHeight: 1.35,
                      letterSpacing: "-0.015em",
                      color: "#FAFAFA",
                    }}
                  >
                    {post.title}
                  </h3>

                  <p
                    className="flex-1 text-pretty"
                    style={{
                      fontSize: "13px",
                      color: "#71717A",
                      lineHeight: 1.6,
                    }}
                  >
                    {post.description}
                  </p>

                  <div
                    className="flex items-center justify-between mt-6 pt-5 border-t"
                    style={{ borderColor: "#27272A" }}
                  >
                    <span
                      className="text-[11px]"
                      style={{
                        fontFamily: "'DM Mono', monospace",
                        color: "#3F3F46",
                      }}
                    >
                      {formatDate(post.publishedAt)}
                    </span>
                    <ChevronRight
                      className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1"
                      style={{ color: "#06B6D4" }}
                    />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section
          className="border-t py-24 text-center"
          style={{ borderColor: "#27272A" }}
        >
          <div className="max-w-[1200px] mx-auto px-6 lg:px-10">
            <div
              className="w-px h-10 mx-auto mb-8"
              style={{
                background:
                  "linear-gradient(to bottom, transparent, rgba(6,182,212,0.45))",
              }}
            />
            <h2
              className="mb-4 text-balance"
              style={{
                fontWeight: 300,
                fontSize: "clamp(24px, 4vw, 40px)",
                letterSpacing: "-0.025em",
                color: "#FAFAFA",
              }}
            >
              See Ezra in your franchise network.
            </h2>
            <p
              className="mx-auto mb-8 max-w-sm"
              style={{ fontSize: "15px", color: "#71717A", lineHeight: 1.6 }}
            >
              Every engagement starts with a conversation. Let's discuss your
              operations.
            </p>
            <Link
              href="/contact"
              className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold no-underline transition-all duration-300 hover:-translate-y-0.5"
              style={{
                background: "linear-gradient(135deg, #22D3EE, #06B6D4)",
                color: "#09090b",
                fontSize: "13px",
              }}
            >
              Talk to Our Team
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
