"use client";
import React from "react";
import Link from "next/link";
import { PageDefinition } from "../../scripts/generate-keywords";

interface SeoPageTemplateProps {
  page: PageDefinition;
  content: {
    intro: string;
    sections: { heading: string; body: string }[];
    faqs: { question: string; answer: string }[];
    ctaHeading: string;
    ctaSubtext: string;
  };
}

export function SeoPageTemplate({ page, content }: SeoPageTemplateProps) {
  return (
    <main className="ezra-seo-page">
      {/* ── Breadcrumb ── */}
      <nav aria-label="Breadcrumb" className="breadcrumb">
        <ol>
          <li>
            <Link href="/">Ezra</Link>
          </li>
          <li aria-current="page">{page.h1}</li>
        </ol>
      </nav>

      {/* ── Hero ── */}
      <header className="page-hero">
        <h1>{page.h1}</h1>
        <p className="page-intro">{content.intro}</p>
      </header>

      {/* ── Body content ── */}
      <article className="page-body">
        {content.sections.map((section, i) => (
          <section key={i}>
            <h2>{section.heading}</h2>
            <p>{section.body}</p>
          </section>
        ))}
      </article>

      {/* ── FAQ ── */}
      <section className="faq-section" aria-label="Frequently Asked Questions">
        <h2>Frequently Asked Questions</h2>
        <dl>
          {content.faqs.map((faq, i) => (
            <div key={i} className="faq-item">
              <dt>{faq.question}</dt>
              <dd>{faq.answer}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* ── Internal links ── */}
      <nav aria-label="Related pages" className="related-pages">
        <h2>Related Solutions</h2>
        <ul>
          {page.relatedSlugs.map((slug) => (
            <li key={slug}>
              <Link href={`/${slug}`}>{slugToTitle(slug)}</Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* ── CTA ── */}
      <section className="cta-section" aria-label="Call to action">
        <h2>{content.ctaHeading}</h2>
        <p>{content.ctaSubtext}</p>
        <a href="https://meetezra.bot" className="cta-button" rel="noopener">
          See Ezra in Action
        </a>
        <a href="mailto:onboarding@meetezra.bot" className="cta-link">
          Talk to the team →
        </a>
      </section>
    </main>
  );
}

function slugToTitle(slug: string): string {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}
