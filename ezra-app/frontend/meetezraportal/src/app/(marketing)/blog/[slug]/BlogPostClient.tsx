"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, Clock, Calendar, ChevronRight } from "lucide-react";
import { type BlogPost, formatDate } from "@/lib/blog";
import { POST_CONTENT } from "@/lib/blog-content";

interface Props {
  post: BlogPost;
  slug: string;
  related: BlogPost[];
}

export default function BlogPostClient({ post, slug, related }: Props) {
  const Content = POST_CONTENT[slug];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    author: { "@type": "Organization", name: post.author.name },
    publisher: {
      "@type": "Organization",
      name: "Ezra",
      url: "https://meetezra.bot",
    },
    datePublished: post.publishedAt,
    keywords: post.tags.join(", "),
  };

  return (
    <div
      className="min-h-screen"
      style={{
        background: "#09090b",
        color: "#FAFAFA",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,300;1,9..40,400&family=DM+Mono:wght@400;500&display=swap");

        .blog-prose {
          font-size: 16px;
          line-height: 1.75;
          color: #a1a1aa;
        }
        .blog-prose p {
          margin-bottom: 1.4em;
        }
        .blog-prose p:last-child {
          margin-bottom: 0;
        }
        .blog-prose h2 {
          font-size: clamp(20px, 2.5vw, 26px);
          font-weight: 400;
          letter-spacing: -0.02em;
          line-height: 1.25;
          color: #fafafa;
          margin-top: 2.5em;
          margin-bottom: 0.75em;
        }
        .blog-prose h3 {
          font-size: 17px;
          font-weight: 600;
          letter-spacing: -0.01em;
          color: #e4e4e7;
          margin-top: 1.8em;
          margin-bottom: 0.5em;
        }
        .blog-prose strong {
          color: #e4e4e7;
          font-weight: 600;
        }
        .blog-prose ul,
        .blog-prose ol {
          padding-left: 1.4em;
          margin-bottom: 1.4em;
        }
        .blog-prose li {
          margin-bottom: 0.6em;
          padding-left: 0.4em;
        }
        .blog-prose ul li {
          list-style-type: disc;
        }
        .blog-prose ul li::marker {
          color: rgba(6, 182, 212, 0.5);
        }
        .blog-prose a {
          color: #06b6d4;
          text-decoration: underline;
          text-underline-offset: 3px;
        }
        .blog-prose a:hover {
          color: #22d3ee;
        }
        .blog-prose .callout {
          background: rgba(6, 182, 212, 0.05);
          border-left: 2px solid rgba(6, 182, 212, 0.5);
          border-radius: 0 8px 8px 0;
          padding: 1em 1.25em;
          margin: 1.8em 0;
          color: #d4d4d8;
          font-size: 15px;
          line-height: 1.65;
        }
        .blog-prose .callout strong {
          color: #06b6d4;
        }

        @keyframes post-reveal {
          from {
            opacity: 0;
            transform: translateY(18px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .post-reveal {
          animation: post-reveal 0.65s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        .post-reveal-1 {
          animation-delay: 0.08s;
        }
        .post-reveal-2 {
          animation-delay: 0.18s;
        }
      `}</style>

      <main className="pt-16">
        {/* ── Back link ── */}
        <div className="max-w-[1200px] mx-auto px-6 lg:px-10 pt-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 no-underline transition-colors duration-200 hover:text-white"
            style={{ color: "#52525B", fontSize: "13px" }}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            All articles
          </Link>
        </div>

        {/* ── Article header ── */}
        <header className="pt-10 pb-14">
          <div className="max-w-[760px] mx-auto px-6 lg:px-10">
            <div className="post-reveal flex items-center gap-3 mb-6">
              <span
                className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-[0.1em] uppercase"
                style={{
                  background: `${post.categoryColor}18`,
                  color: post.categoryColor,
                  border: `1px solid ${post.categoryColor}30`,
                }}
              >
                {post.category}
              </span>
              <span
                className="text-[11px] flex items-center gap-1.5"
                style={{
                  fontFamily: "'DM Mono', monospace",
                  color: "#3F3F46",
                }}
              >
                <Clock className="w-3 h-3" />
                {post.readTime} min read
              </span>
            </div>

            <h1
              className="post-reveal post-reveal-1 text-balance"
              style={{
                fontWeight: 300,
                fontSize: "clamp(28px, 4.5vw, 52px)",
                lineHeight: 1.1,
                letterSpacing: "-0.03em",
                color: "#FAFAFA",
                marginBottom: "1.2rem",
              }}
            >
              {post.title}
            </h1>

            <p
              className="post-reveal post-reveal-2 text-pretty"
              style={{
                fontSize: "17px",
                color: "#71717A",
                lineHeight: 1.65,
                marginBottom: "2rem",
              }}
            >
              {post.description}
            </p>

            {/* Meta row */}
            <div
              className="post-reveal post-reveal-2 flex items-center gap-5 pt-5 border-t"
              style={{ borderColor: "#27272A" }}
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-semibold flex-shrink-0"
                style={{
                  background: "linear-gradient(135deg, #22D3EE, #06B6D4)",
                  color: "#09090b",
                }}
              >
                E
              </div>
              <div>
                <p className="text-[13px] font-medium" style={{ color: "#D4D4D8" }}>
                  {post.author.name}
                </p>
                <p className="text-[11px]" style={{ color: "#52525B" }}>
                  {post.author.role}
                </p>
              </div>
              <div className="w-px h-8 ml-1" style={{ background: "#27272A" }} />
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3 h-3" style={{ color: "#3F3F46" }} />
                <span
                  className="text-[12px]"
                  style={{ fontFamily: "'DM Mono', monospace", color: "#3F3F46" }}
                >
                  {formatDate(post.publishedAt)}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* hairline */}
        <div className="max-w-[760px] mx-auto px-6 lg:px-10">
          <div className="w-full h-px" style={{ background: "linear-gradient(90deg, transparent, #27272A, transparent)" }} />
        </div>

        {/* ── Article body ── */}
        <article className="py-14">
          <div className="max-w-[760px] mx-auto px-6 lg:px-10">
            <div className="blog-prose">
              {Content ? <Content /> : null}
            </div>
          </div>
        </article>

        {/* hairline */}
        <div className="max-w-[760px] mx-auto px-6 lg:px-10">
          <div className="w-full h-px" style={{ background: "#27272A" }} />
        </div>

        {/* ── Tags ── */}
        <div className="max-w-[760px] mx-auto px-6 lg:px-10 py-8">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className="text-[10px] tracking-[0.18em] uppercase font-medium mr-1"
              style={{ color: "#3F3F46" }}
            >
              Topics
            </span>
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="text-[11px] px-2.5 py-1 rounded-md border"
                style={{ color: "#52525B", borderColor: "#27272A", background: "#141417" }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* ── Inline CTA ── */}
        <div className="max-w-[760px] mx-auto px-6 lg:px-10 pb-14">
          <div
            className="rounded-2xl border p-8 text-center"
            style={{
              background: "linear-gradient(135deg, rgba(6,182,212,0.05), rgba(6,182,212,0.02))",
              borderColor: "rgba(6,182,212,0.18)",
            }}
          >
            <p
              className="text-[10px] tracking-[0.2em] uppercase font-medium mb-3"
              style={{ color: "rgba(6,182,212,0.7)" }}
            >
              Ready to act on this?
            </p>
            <h3
              className="mb-3 text-balance"
              style={{
                fontWeight: 400,
                fontSize: "clamp(18px, 2.5vw, 24px)",
                letterSpacing: "-0.02em",
                color: "#FAFAFA",
              }}
            >
              See Ezra in your franchise network.
            </h3>
            <p
              className="mx-auto mb-6 max-w-sm"
              style={{ fontSize: "14px", color: "#71717A", lineHeight: 1.6 }}
            >
              Every Ezra engagement starts with a conversation. No pitch deck —
              just a direct discussion about your operations.
            </p>
            <Link
              href="/contact"
              className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold no-underline transition-all duration-300 hover:-translate-y-0.5"
              style={{
                background: "linear-gradient(135deg, #22D3EE, #06B6D4)",
                color: "#09090b",
                fontSize: "13px",
              }}
            >
              Talk to Our Team
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* ── Related articles ── */}
        {related.length > 0 && (
          <section className="border-t py-20" style={{ borderColor: "#27272A" }}>
            <div className="max-w-[1200px] mx-auto px-6 lg:px-10">
              <p
                className="text-[10px] tracking-[0.22em] uppercase font-medium mb-8"
                style={{ color: "#3F3F46" }}
              >
                More articles
              </p>
              <div className="grid md:grid-cols-3 gap-5">
                {related.map((rp) => (
                  <Link
                    key={rp.slug}
                    href={`/blog/${rp.slug}`}
                    className="group flex flex-col no-underline rounded-xl border p-6 transition-all duration-300 hover:-translate-y-1"
                    style={{ background: "#141417", borderColor: "#27272A" }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor =
                        "rgba(6,182,212,0.22)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor = "#27272A";
                    }}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <span
                        className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-semibold tracking-[0.1em] uppercase"
                        style={{
                          background: `${rp.categoryColor}15`,
                          color: rp.categoryColor,
                          border: `1px solid ${rp.categoryColor}28`,
                        }}
                      >
                        {rp.category}
                      </span>
                      <span
                        className="text-[10px]"
                        style={{ fontFamily: "'DM Mono', monospace", color: "#3F3F46" }}
                      >
                        {rp.readTime} min
                      </span>
                    </div>
                    <h4
                      className="flex-1 mb-4 transition-colors duration-200 group-hover:text-[#22D3EE]"
                      style={{
                        fontWeight: 500,
                        fontSize: "14px",
                        lineHeight: 1.35,
                        letterSpacing: "-0.01em",
                        color: "#FAFAFA",
                      }}
                    >
                      {rp.title}
                    </h4>
                    <div className="flex items-center justify-between">
                      <span
                        className="text-[11px]"
                        style={{ fontFamily: "'DM Mono', monospace", color: "#3F3F46" }}
                      >
                        {formatDate(rp.publishedAt)}
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
        )}
      </main>
    </div>
  );
}
