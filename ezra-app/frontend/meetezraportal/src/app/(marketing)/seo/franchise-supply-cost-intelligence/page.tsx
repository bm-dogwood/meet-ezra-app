import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";

const BASE_URL = "https://meetezra.bot";

export const metadata: Metadata = {
  title: "Franchise Supply Cost Intelligence | Ezra AI",
  description: "Monitor supply spend as a percentage of revenue with trailing averages and exception reporting across every location. No idealized SKU tracking required.",
  alternates: { canonical: `${BASE_URL}/seo/franchise-supply-cost-intelligence` },
  openGraph: {
    title: "Franchise Supply Cost Intelligence | Ezra AI",
    description: "Monitor supply spend as a percentage of revenue with trailing averages and exception reporting across every location. No idealized SKU tracking required.",
    url: `${BASE_URL}/franchise-supply-cost-intelligence`,
    siteName: "Ezra — Franchise Intelligence Platform",
    images: [{ url: `${BASE_URL}/og/franchise-supply-cost-intelligence.png`, width: 1200, height: 630, alt: "Supply Cost Intelligence Built for How Operators Actually Run" }],
    type: "website",
  },
  twitter: { card: "summary_large_image", title: "Franchise Supply Cost Intelligence | Ezra AI", description: "Monitor supply spend as a percentage of revenue with trailing averages and exception reporting across every location. No idealized SKU tracking required.", images: [`${BASE_URL}/og/franchise-supply-cost-intelligence.png`] },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Ezra Franchise Intelligence Platform",
    "description": "Monitor supply spend as a percentage of revenue with trailing averages and exception reporting across every location. No idealized SKU tracking required.",
    "url": "https://meetezra.bot/seo/franchise-supply-cost-intelligence",
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
        "name": "Does Ezra Inventory require us to build a bill of materials?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No. The financial-proxy model works from spend and revenue data in your existing systems. A bill of materials can be incorporated where it exists, but it is not required."
        }
      },
      {
        "@type": "Question",
        "name": "What data sources does Ezra connect to for supply cost intelligence?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Ezra connects to POS revenue data and accounting spend data through approved API interfaces."
        }
      },
      {
        "@type": "Question",
        "name": "How are trailing average windows configured?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Trailing average windows are configurable per operator. Typical configurations are 30-day, 60-day, or 90-day trailing periods, depending on the volatility of the supply cost pattern."
        }
      },
      {
        "@type": "Question",
        "name": "When is Ezra Inventory launching?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Ezra Inventory (Module 02) is in active build, targeting Q2 2026 delivery. Contact us for priority access."
        }
      },
      {
        "@type": "Question",
        "name": "Can supply cost intelligence detect vendor price increases automatically?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Ezra flags deviations in spend-to-revenue ratios without knowing the cause. A consistent upward trend in supply spend relative to revenue may indicate a vendor price increase, waste, or internal issues. Investigation determines the source."
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
        "name": "Supply Cost Intelligence Built for How Operators Actually Run",
        "item": "https://meetezra.bot/seo/franchise-supply-cost-intelligence"
      }
    ]
  }
];

export default function Page() {
  return (
    <>
      {jsonLd.map((schema, i) => (
        <Script key={i} id={`schema-${i}`} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}
      <main>
        <nav aria-label="Breadcrumb">
          <ol>
            <li><Link href="/">Ezra</Link></li>
            <li aria-current="page">Supply Cost Intelligence Built for How Operators Actually Run</li>
          </ol>
        </nav>
        <header>
          <h1>Supply Cost Intelligence Built for How Operators Actually Run</h1>
          <p>Supply cost intelligence for franchises doesn't require perfect SKU data. It requires a consistent, reliable signal that surfaces when supply spend is out of line with revenue—and Ezra's financial-proxy model delivers exactly that, across every location, using data that already exists in your accounting and POS systems.</p>
        </header>
        <article>
        <section>
          <h2>The Financial-Proxy Approach</h2>
          <p>Ezra Inventory tracks supply spend as a percentage of relevant revenue for each location and category. This spend-to-revenue ratio is benchmarked against trailing averages—configured for the window that makes sense for each operation (30-day, 60-day, 90-day). Deviations from the trailing average trigger exception flags automatically.</p>
        </section>

        <section>
          <h2>Why This Works Better Than Physical Counts Alone</h2>
          <p>Physical inventory counts require time, staff, and data entry—and they're frequently inaccurate. Financial controls are already happening: you're buying supply and generating revenue. Ezra reads the financial record of those two activities and flags when the ratio between them breaks pattern. No new data collection required.</p>
        </section>

        <section>
          <h2>Category-Specific Thresholds</h2>
          <p>Supply cost norms vary dramatically by category. Products have different margins than services. Consumables have different volatility than major supply items. Ezra's thresholds are operator-validated and category-specific, ensuring that exception flags reflect meaningful deviations rather than normal category variation.</p>
        </section>

        <section>
          <h2>Exception Reporting Across the Network</h2>
          <p>Ezra surfaces supply cost exceptions as a prioritized feed—the highest-deviation locations and categories first, with the supporting data visible immediately. No spreadsheet required to identify which location's supply spend is running 15% above its 60-day trailing average.</p>
        </section>

        <section>
          <h2>Supply Intelligence as Part of the Operating Layer</h2>
          <p>Supply cost intelligence is most actionable when connected to other operational data. A location whose supply spend is running above baseline coinciding with a loss prevention anomaly may have a different cause than one whose supply spend is above baseline during a period of unusually high revenue. Ezra connects both signals in one view.</p>
        </section>
        </article>
        <section aria-label="Frequently Asked Questions">
          <h2>Frequently Asked Questions</h2>
          <dl>
          <div className="faq-item">
            <dt>Does Ezra Inventory require us to build a bill of materials?</dt>
            <dd>No. The financial-proxy model works from spend and revenue data in your existing systems. A bill of materials can be incorporated where it exists, but it is not required.</dd>
          </div>

          <div className="faq-item">
            <dt>What data sources does Ezra connect to for supply cost intelligence?</dt>
            <dd>Ezra connects to POS revenue data and accounting spend data through approved API interfaces.</dd>
          </div>

          <div className="faq-item">
            <dt>How are trailing average windows configured?</dt>
            <dd>Trailing average windows are configurable per operator. Typical configurations are 30-day, 60-day, or 90-day trailing periods, depending on the volatility of the supply cost pattern.</dd>
          </div>

          <div className="faq-item">
            <dt>When is Ezra Inventory launching?</dt>
            <dd>Ezra Inventory (Module 02) is in active build, targeting Q2 2026 delivery. Contact us for priority access.</dd>
          </div>

          <div className="faq-item">
            <dt>Can supply cost intelligence detect vendor price increases automatically?</dt>
            <dd>Ezra flags deviations in spend-to-revenue ratios without knowing the cause. A consistent upward trend in supply spend relative to revenue may indicate a vendor price increase, waste, or internal issues. Investigation determines the source.</dd>
          </div>
          </dl>
        </section>
        <nav aria-label="Related solutions">
          <h2>Related Solutions</h2>
          <ul>
            <li><Link href="/seo/ai-inventory-management-franchise">Ai Inventory Management Franchise</Link></li>
            <li><Link href="/seo/franchise-inventory-dashboard">Franchise Inventory Dashboard</Link></li>
            <li><Link href="/seo/reduce-shrinkage-franchise">Reduce Shrinkage Franchise</Link></li>
          </ul>
        </nav>
        <section aria-label="Call to action">
          <h2>See Where Your Supply Costs Are Running Hot</h2>
          <p>Ezra Inventory ships Q2 2026. Join the priority onboarding list today.</p>
          <a href="https://meetezra.bot" rel="noopener noreferrer">See Ezra in Action</a>
          <a href="mailto:onboarding@meetezra.bot">Talk to the team →</a>
        </section>
      </main>
    </>
  );
}
