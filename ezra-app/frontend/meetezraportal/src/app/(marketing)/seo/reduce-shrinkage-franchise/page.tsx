import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";

const BASE_URL = "https://meetezra.bot";

export const metadata: Metadata = {
  title: "Reduce Shrinkage Across Your Franchise | Ezra AI",
  description: "Supply waste and internal theft erode margin silently across multi-unit operations. Ezra detects both—using financial controls, not just physical counts.",
  alternates: { canonical: `${BASE_URL}/seo/reduce-shrinkage-franchise` },
  openGraph: {
    title: "Reduce Shrinkage Across Your Franchise | Ezra AI",
    description: "Supply waste and internal theft erode margin silently across multi-unit operations. Ezra detects both—using financial controls, not just physical counts.",
    url: `${BASE_URL}/reduce-shrinkage-franchise`,
    siteName: "Ezra — Franchise Intelligence Platform",
    images: [{ url: `${BASE_URL}/og/reduce-shrinkage-franchise.png`, width: 1200, height: 630, alt: "Reduce Shrinkage Across Every Location in Your Franchise" }],
    type: "website",
  },
  twitter: { card: "summary_large_image", title: "Reduce Shrinkage Across Your Franchise | Ezra AI", description: "Supply waste and internal theft erode margin silently across multi-unit operations. Ezra detects both—using financial controls, not just physical counts.", images: [`${BASE_URL}/og/reduce-shrinkage-franchise.png`] },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Ezra Franchise Intelligence Platform",
    "description": "Supply waste and internal theft erode margin silently across multi-unit operations. Ezra detects both—using financial controls, not just physical counts.",
    "url": "https://meetezra.bot/seo/reduce-shrinkage-franchise",
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
        "name": "What is the difference between shrinkage and theft?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Shrinkage is the broader category—any loss of inventory or revenue from expected amounts. Theft (internal or external) is one source of shrinkage. Supply waste, vendor error, and administrative mistakes are others. Ezra addresses shrinkage from internal theft and supply waste specifically."
        }
      },
      {
        "@type": "Question",
        "name": "Does Ezra require a dedicated loss prevention team to operate?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No. Ezra is designed for operators who are their own loss prevention team. The platform automates the detection and surfaces the results; the operator investigates and acts."
        }
      },
      {
        "@type": "Question",
        "name": "How quickly does shrinkage detection begin after deployment?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Transaction anomaly detection begins immediately upon integration with the source POS. Inventory exception reporting begins as soon as spend and revenue data begins flowing into the platform."
        }
      },
      {
        "@type": "Question",
        "name": "Can Ezra detect vendor-side shrinkage, like short deliveries?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Ezra Inventory's financial-proxy model can surface anomalies in supply spend that may indicate vendor-side issues—for example, consistent spend above expectations relative to revenue without corresponding internal causes. Investigation determines the source."
        }
      },
      {
        "@type": "Question",
        "name": "What POS systems does shrinkage detection work with?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Ezra is live in production on Zenoti today. Square and Toast are in active build. Contact us for the current integration roadmap."
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
        "name": "Reduce Shrinkage Across Every Location in Your Franchise",
        "item": "https://meetezra.bot/seo/reduce-shrinkage-franchise"
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
            <li aria-current="page">Reduce Shrinkage Across Every Location in Your Franchise</li>
          </ol>
        </nav>
        <header>
          <h1>Reduce Shrinkage Across Every Location in Your Franchise</h1>
          <p>Shrinkage reduction in multi-unit franchises requires a systematic approach to two distinct problems: internal theft (caught through behavioral anomaly detection) and supply waste (caught through financial-proxy inventory modeling). Ezra addresses both, automatically, across every location in your network.</p>
        </header>
        <article>
        <section>
          <h2>Two Types of Shrinkage, Two Detection Approaches</h2>
          <p>Internal theft and supply waste both compress margins, but they require different detection mechanisms. Internal theft leaves a behavioral signature in transaction data—voids, overrides, discount patterns, cash variance. Supply waste leaves a financial signature in spend-to-revenue ratios. Ezra applies the right detection model to each type of shrinkage simultaneously.</p>
        </section>

        <section>
          <h2>Behavioral Detection for Internal Theft</h2>
          <p>Ezra Loss Prevention monitors transaction data in real time, flagging the behavioral patterns associated with internal shrinkage: excessive voids, manager overrides outside normal parameters, discount percentages above threshold, and cash variance. Each flag surfaces as a triaged alert with direct links to the source POS record.</p>
        </section>

        <section>
          <h2>Financial-Proxy Detection for Supply Waste</h2>
          <p>Ezra Inventory tracks supply spend as a percentage of relevant revenue, calculates trailing averages, and flags exceptions where spend-to-revenue ratios deviate from established baselines. This approach catches supply waste without requiring perfect physical inventory infrastructure.</p>
        </section>

        <section>
          <h2>The Compounding Cost of Undetected Shrinkage</h2>
          <p>The cost of shrinkage isn't just the immediate loss—it's the compounding effect of undetected losses accumulating over months. A 2% shrinkage rate running for 12 months at a 10-location franchise averaging $400,000 per location represents $80,000 in losses. Detecting it in month 2 instead of month 12 recovers $65,000 of that exposure.</p>
        </section>

        <section>
          <h2>Network-Wide Shrinkage Visibility</h2>
          <p>Ezra provides network-level shrinkage visibility—ranking locations by risk, identifying the units with the highest anomaly density, and surfacing the patterns that are most likely to represent ongoing losses rather than one-time exceptions.</p>
        </section>
        </article>
        <section aria-label="Frequently Asked Questions">
          <h2>Frequently Asked Questions</h2>
          <dl>
          <div className="faq-item">
            <dt>What is the difference between shrinkage and theft?</dt>
            <dd>Shrinkage is the broader category—any loss of inventory or revenue from expected amounts. Theft (internal or external) is one source of shrinkage. Supply waste, vendor error, and administrative mistakes are others. Ezra addresses shrinkage from internal theft and supply waste specifically.</dd>
          </div>

          <div className="faq-item">
            <dt>Does Ezra require a dedicated loss prevention team to operate?</dt>
            <dd>No. Ezra is designed for operators who are their own loss prevention team. The platform automates the detection and surfaces the results; the operator investigates and acts.</dd>
          </div>

          <div className="faq-item">
            <dt>How quickly does shrinkage detection begin after deployment?</dt>
            <dd>Transaction anomaly detection begins immediately upon integration with the source POS. Inventory exception reporting begins as soon as spend and revenue data begins flowing into the platform.</dd>
          </div>

          <div className="faq-item">
            <dt>Can Ezra detect vendor-side shrinkage, like short deliveries?</dt>
            <dd>Ezra Inventory's financial-proxy model can surface anomalies in supply spend that may indicate vendor-side issues—for example, consistent spend above expectations relative to revenue without corresponding internal causes. Investigation determines the source.</dd>
          </div>

          <div className="faq-item">
            <dt>What POS systems does shrinkage detection work with?</dt>
            <dd>Ezra is live in production on Zenoti today. Square and Toast are in active build. Contact us for the current integration roadmap.</dd>
          </div>
          </dl>
        </section>
        <nav aria-label="Related solutions">
          <h2>Related Solutions</h2>
          <ul>
            <li><Link href="/seo/shrinkage-prevention-software">Shrinkage Prevention Software</Link></li>
            <li><Link href="/seo/ai-inventory-management-franchise">Ai Inventory Management Franchise</Link></li>
            <li><Link href="/seo/franchise-loss-prevention-software">Franchise Loss Prevention Software</Link></li>
          </ul>
        </nav>
        <section aria-label="Call to action">
          <h2>Quantify What Shrinkage Is Costing Your Franchise Right Now</h2>
          <p>Ezra Loss Prevention and Inventory are live and onboarding select operators. Let's show you the detection layer on your network.</p>
          <a href="https://meetezra.bot" rel="noopener noreferrer">See Ezra in Action</a>
          <a href="mailto:onboarding@meetezra.bot">Talk to the team →</a>
        </section>
      </main>
    </>
  );
}
