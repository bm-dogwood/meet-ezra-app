import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";

const BASE_URL = "https://meetezra.bot";

export const metadata: Metadata = {
  title: "AI Inventory Management for Franchises | Ezra",
  description: "Stop paying for product that walks out or sits idle. Ezra's financial-proxy inventory model flags supply waste before it compounds.",
  alternates: { canonical: `${BASE_URL}/seo/ai-inventory-management-franchise` },
  openGraph: {
    title: "AI Inventory Management for Franchises | Ezra",
    description: "Stop paying for product that walks out or sits idle. Ezra's financial-proxy inventory model flags supply waste before it compounds.",
    url: `${BASE_URL}/ai-inventory-management-franchise`,
    siteName: "Ezra — Franchise Intelligence Platform",
    images: [{ url: `${BASE_URL}/og/ai-inventory-management-franchise.png`, width: 1200, height: 630, alt: "AI Inventory Management for Franchise Operators" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Inventory Management for Franchises | Ezra",
    description: "Stop paying for product that walks out or sits idle. Ezra's financial-proxy inventory model flags supply waste before it compounds.",
    images: [`${BASE_URL}/og/ai-inventory-management-franchise.png`],
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Ezra Franchise Intelligence Platform",
    "description": "Stop paying for product that walks out or sits idle. Ezra's financial-proxy inventory model flags supply waste before it compounds.",
    "url": "https://meetezra.bot/seo/ai-inventory-management-franchise",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web",
    "provider": {
      "@type": "Organization",
      "name": "Franchise AI, LLC dba Ezra AI",
      "url": "https://meetezra.bot"
    }
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Does Ezra Inventory require physical inventory counts?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No. The financial-proxy model works from spend and revenue data in your existing systems. Physical counts can be incorporated where the bill of materials supports them, but they are not required."
        }
      },
      {
        "@type": "Question",
        "name": "When is Ezra Inventory launching?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Ezra Inventory (Module 02) is in active build and targeting Q2 2026 delivery. Operators can begin onboarding discussions now for priority access."
        }
      },
      {
        "@type": "Question",
        "name": "How does Ezra know if a supply spend anomaly is waste vs. theft vs. vendor pricing?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Ezra flags the anomaly and surfaces the data. The investigation—whether the cause is waste, internal theft, or a pricing change—is done by the operator. The platform's role is to make sure no anomaly goes undetected."
        }
      },
      {
        "@type": "Question",
        "name": "Can thresholds be set differently for product categories?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. Thresholds are operator-validated and category-specific, configurable per franchisee. High-margin service categories have different supply cost profiles than product-heavy retail categories."
        }
      },
      {
        "@type": "Question",
        "name": "Will Ezra Inventory eventually support full SKU tracking?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The roadmap includes expanding the inventory module over time. The initial approach prioritizes financial-proxy modeling because it works for the broadest range of multi-unit operators without requiring perfect SKU data infrastructure."
        }
      }
    ]
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Ezra",
        "item": "https://meetezra.bot"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "AI Inventory Management for Franchise Operators",
        "item": "https://meetezra.bot/seo/ai-inventory-management-franchise"
      }
    ]
  }
];

export default function Page() {
  return (
    <>
      {jsonLd.map((schema, i) => (
        <Script
          key={i}
          id={`schema-${i}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      <main>
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb">
          <ol>
            <li><Link href="/">Ezra</Link></li>
            <li aria-current="page">AI Inventory Management for Franchise Operators</li>
          </ol>
        </nav>

        {/* Hero */}
        <header>
          <h1>AI Inventory Management for Franchise Operators</h1>
          <p>Perfect inventory tracking requires perfect data—and most franchise operators don't have it. SKU-level physical counts are time-consuming, frequently inaccurate, and impossible to run at scale across multiple locations. Ezra Inventory takes a different approach: financial-proxy modeling that uses supply spend as a percentage of relevant revenue, with trailing averages and exception reporting, to surface waste more reliably than any physical count.</p>
        </header>

        {/* Body */}
        <article>
        <section>
          <h2>Why SKU-Level Tracking Fails Multi-Unit Operators</h2>
          <p>The promise of SKU-level inventory tracking is precision. The reality for most franchise operators is inconsistent counts, manual data entry errors, and significant staff time spent on physical inventory that could be spent serving customers. When the count is wrong—and it often is—the resulting data misleads rather than informs. Ezra's financial-proxy approach works from financial data that already exists in your accounting and POS systems: spend and revenue. No new data collection required.</p>
        </section>

        <section>
          <h2>The Financial-Proxy Inventory Model</h2>
          <p>Ezra Inventory tracks supply spend as a percentage of relevant revenue, calculates trailing averages over configurable windows, and flags exceptions where spend-to-revenue ratios deviate from operator-validated thresholds. When Location A's supply spend is running 8 points above its trailing average with no corresponding revenue increase, that is a flag—whether the cause is waste, theft, or vendor pricing changes. The flag triggers investigation; the financial model surfaces it automatically.</p>
        </section>

        <section>
          <h2>Operator-Validated Thresholds Per Category</h2>
          <p>Different product categories have different margin profiles and different supply-to-revenue ratios. Ezra's thresholds are operator-validated and category-specific—not imported from a generic industry benchmark. High-margin services have different supply cost profiles than product retail. Each threshold is configurable per franchisee, so the exception reporting reflects actual operating conditions.</p>
        </section>

        <section>
          <h2>Physical Counts Where They Matter</h2>
          <p>Ezra Inventory combines financial controls everywhere with physical counts where the bill of materials holds up. For operations with sufficient product standardization to support a BOM, retail aging and physical counts are incorporated into the model. For operations without that standardization, financial controls alone provide the waste signal.</p>
        </section>

        <section>
          <h2>Inventory Built Into the Operating Layer</h2>
          <p>Ezra Inventory is Module 02 in the Ezra platform—currently in active build, targeting Q2 2026 delivery. When combined with loss prevention, scheduling, CRM, and sales data, operators can distinguish between supply waste and other margin leaks in one unified operating view.</p>
        </section>
        </article>

        {/* FAQ */}
        <section aria-label="Frequently Asked Questions">
          <h2>Frequently Asked Questions</h2>
          <dl>
          <div className="faq-item">
            <dt>Does Ezra Inventory require physical inventory counts?</dt>
            <dd>No. The financial-proxy model works from spend and revenue data in your existing systems. Physical counts can be incorporated where the bill of materials supports them, but they are not required.</dd>
          </div>

          <div className="faq-item">
            <dt>When is Ezra Inventory launching?</dt>
            <dd>Ezra Inventory (Module 02) is in active build and targeting Q2 2026 delivery. Operators can begin onboarding discussions now for priority access.</dd>
          </div>

          <div className="faq-item">
            <dt>How does Ezra know if a supply spend anomaly is waste vs. theft vs. vendor pricing?</dt>
            <dd>Ezra flags the anomaly and surfaces the data. The investigation—whether the cause is waste, internal theft, or a pricing change—is done by the operator. The platform's role is to make sure no anomaly goes undetected.</dd>
          </div>

          <div className="faq-item">
            <dt>Can thresholds be set differently for product categories?</dt>
            <dd>Yes. Thresholds are operator-validated and category-specific, configurable per franchisee. High-margin service categories have different supply cost profiles than product-heavy retail categories.</dd>
          </div>

          <div className="faq-item">
            <dt>Will Ezra Inventory eventually support full SKU tracking?</dt>
            <dd>The roadmap includes expanding the inventory module over time. The initial approach prioritizes financial-proxy modeling because it works for the broadest range of multi-unit operators without requiring perfect SKU data infrastructure.</dd>
          </div>
          </dl>
        </section>

        {/* Related pages */}
        <nav aria-label="Related solutions">
          <h2>Related Solutions</h2>
          <ul>
            <li><Link href="/seo/franchise-inventory-dashboard">Franchise Inventory Dashboard</Link></li>
            <li><Link href="/seo/shrinkage-prevention-software">Shrinkage Prevention Software</Link></li>
            <li><Link href="/seo/save-money-franchise-operations">Save Money Franchise Operations</Link></li>
          </ul>
        </nav>

        {/* CTA */}
        <section aria-label="Call to action">
          <h2>Catch Supply Waste Before It Compounds</h2>
          <p>Ezra Inventory ships Q2 2026. Contact us to be among the first operators onboarded.</p>
          <a href="https://meetezra.bot" rel="noopener noreferrer">
            See Ezra in Action
          </a>
          <a href="mailto:onboarding@meetezra.bot">
            Talk to the team →
          </a>
        </section>
      </main>
    </>
  );
}
