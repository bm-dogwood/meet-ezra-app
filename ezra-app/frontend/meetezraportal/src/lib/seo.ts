import type { Metadata } from "next";
import { PageDefinition } from "../../scripts/generate-keywords";

const BASE_URL = "https://meetezra.bot";
const OG_IMAGE = `${BASE_URL}/og/default.png`;

// ── Metadata builder ──────────────────────────────────────────────────────
export function buildMetadata(page: PageDefinition): Metadata {
  const canonical = `${BASE_URL}/${page.slug}`;
  return {
    title: page.title,
    description: page.description,
    alternates: { canonical },
    openGraph: {
      title: page.title,
      description: page.description,
      url: canonical,
      siteName: "Ezra — Franchise Intelligence Platform",
      images: [
        {
          url: `${BASE_URL}/og/${page.slug}.png`,
          width: 1200,
          height: 630,
          alt: page.h1,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: page.title,
      description: page.description,
      images: [`${BASE_URL}/og/${page.slug}.png`],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true },
    },
  };
}

// ── JSON-LD builders ──────────────────────────────────────────────────────
export function buildSoftwareApplicationLD(page: PageDefinition) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Ezra Franchise Intelligence Platform",
    description: page.description,
    url: `${BASE_URL}/${page.slug}`,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      description: "Contact for franchise pricing",
    },
    provider: {
      "@type": "Organization",
      name: "Franchise AI, LLC dba Ezra AI",
      url: BASE_URL,
      contactPoint: {
        "@type": "ContactPoint",
        email: "onboarding@meetezra.bot",
        contactType: "sales",
      },
    },
  };
}

export function buildFAQPageLD(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function buildBreadcrumbLD(page: PageDefinition) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Ezra",
        item: BASE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: page.h1,
        item: `${BASE_URL}/${page.slug}`,
      },
    ],
  };
}

// ── Combined LD script tag ─────────────────────────────────────────────────
export function buildJsonLdScripts(
  page: PageDefinition,
  faqs: { question: string; answer: string }[]
) {
  return [
    buildSoftwareApplicationLD(page),
    buildFAQPageLD(faqs),
    buildBreadcrumbLD(page),
  ];
}
