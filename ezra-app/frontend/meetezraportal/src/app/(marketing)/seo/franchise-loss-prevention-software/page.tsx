import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";

const BASE_URL = "https://meetezra.bot";

export const metadata: Metadata = {
  title: "Franchise Loss Prevention Software | Ezra AI",
  description: "Purpose-built loss prevention for multi-unit franchises. Monitor transactions, discounts, and cash handling across all locations in one platform.",
  alternates: { canonical: `${BASE_URL}/seo/franchise-loss-prevention-software` },
  openGraph: {
    title: "Franchise Loss Prevention Software | Ezra AI",
    description: "Purpose-built loss prevention for multi-unit franchises. Monitor transactions, discounts, and cash handling across all locations in one platform.",
    url: `${BASE_URL}/franchise-loss-prevention-software`,
    siteName: "Ezra — Franchise Intelligence Platform",
    images: [{ url: `${BASE_URL}/og/franchise-loss-prevention-software.png`, width: 1200, height: 630, alt: "Loss Prevention Software Built for Franchise Operators" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Franchise Loss Prevention Software | Ezra AI",
    description: "Purpose-built loss prevention for multi-unit franchises. Monitor transactions, discounts, and cash handling across all locations in one platform.",
    images: [`${BASE_URL}/og/franchise-loss-prevention-software.png`],
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Ezra Franchise Intelligence Platform",
    "description": "Purpose-built loss prevention for multi-unit franchises. Monitor transactions, discounts, and cash handling across all locations in one platform.",
    "url": "https://meetezra.bot/seo/franchise-loss-prevention-software",
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
        "name": "Is Ezra Loss Prevention a standalone product or part of a larger platform?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Ezra Loss Prevention is one of five modules in the Ezra operating layer. It can be deployed as part of the full platform or discussed as a starting point for operators whose primary concern is shrinkage and internal theft detection."
        }
      },
      {
        "@type": "Question",
        "name": "How does Ezra handle franchises with multiple POS systems?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Ezra is POS-agnostic by architectural design. As additional POS integrations are completed, operators can connect multiple source systems to the same five modules and the same operator-facing portal."
        }
      },
      {
        "@type": "Question",
        "name": "Does Ezra alert in real time or on a delay?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Ezra processes transaction data as it flows from the source POS. Anomaly flags are surfaced as close to real time as the integration allows—typically within the same operating session."
        }
      },
      {
        "@type": "Question",
        "name": "Can I configure different thresholds for different locations?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. Every benchmark, threshold, and segment rule is configurable per franchisee. High-volume locations can have different void-rate thresholds than lower-volume units."
        }
      },
      {
        "@type": "Question",
        "name": "What happens if Ezra flags a false positive?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "All threshold changes are audit-logged and reversible without data loss. If a flag proves to be a false positive, operators can adjust the threshold and the change is recorded for audit trail purposes."
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
        "name": "Loss Prevention Software Built for Franchise Operators",
        "item": "https://meetezra.bot/seo/franchise-loss-prevention-software"
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
            <li aria-current="page">Loss Prevention Software Built for Franchise Operators</li>
          </ol>
        </nav>

        {/* Hero */}
        <header>
          <h1>Loss Prevention Software Built for Franchise Operators</h1>
          <p>Franchise loss prevention isn't a single-location problem. It's a network problem—one that compounds across shifts, registers, and locations before any manual process catches up. Ezra is purpose-built loss prevention software for multi-unit franchise operators: monitoring every transaction, every discount, and every cash variance across your entire network in real time.</p>
        </header>

        {/* Body */}
        <article>
        <section>
          <h2>The Multi-Unit Loss Prevention Gap</h2>
          <p>Single-location loss prevention tools monitor one set of transactions. Franchise operators need network-wide visibility—the ability to compare location A's void rate against location B's, catch a manager override pattern before it spreads, and see which shifts are producing the most risk exposure across the portfolio. Ezra was built for this from the ground up. Not adapted from a single-unit tool. Designed for the franchisee managing multiple locations and the franchisor overseeing hundreds.</p>
        </section>

        <section>
          <h2>What Ezra Monitors</h2>
          <p>Ezra Loss Prevention monitors voids, manager overrides, comps, discount percentages, cash variance, and productivity anomalies. Every detection surface is configurable per location—so thresholds reflect actual operating conditions, not an arbitrary system default. Anomalies are surfaced as a triaged feed, not buried in a 200-line exception report.</p>
        </section>

        <section>
          <h2>Investigation Without Spreadsheet Forensics</h2>
          <p>When Ezra flags an anomaly, it links directly to the source POS record. No re-pulling reports. No cross-referencing spreadsheets. The operator sees the flag, the context, and the underlying data in one view—and can act on it the same day it occurs, not 30 days later at month-end.</p>
        </section>

        <section>
          <h2>Built on Operator-Validated Logic</h2>
          <p>Ezra was designed with multi-unit operators, not for them. Features that broke against operator reality were dropped before launch. The thresholds are validated against real franchise operating data—not idealized benchmarks imported from a research paper. The result is a loss prevention system that generates meaningful signals, not alert fatigue.</p>
        </section>

        <section>
          <h2>Franchise Loss Prevention That Integrates, Not Replaces</h2>
          <p>Ezra reads from your existing POS through approved interfaces. No migration. No rip-and-replace. No six-month deployment. Currently live on Zenoti, with Square and Toast in active build. The same detection logic applies regardless of which POS system feeds it.</p>
        </section>
        </article>

        {/* FAQ */}
        <section aria-label="Frequently Asked Questions">
          <h2>Frequently Asked Questions</h2>
          <dl>
          <div className="faq-item">
            <dt>Is Ezra Loss Prevention a standalone product or part of a larger platform?</dt>
            <dd>Ezra Loss Prevention is one of five modules in the Ezra operating layer. It can be deployed as part of the full platform or discussed as a starting point for operators whose primary concern is shrinkage and internal theft detection.</dd>
          </div>

          <div className="faq-item">
            <dt>How does Ezra handle franchises with multiple POS systems?</dt>
            <dd>Ezra is POS-agnostic by architectural design. As additional POS integrations are completed, operators can connect multiple source systems to the same five modules and the same operator-facing portal.</dd>
          </div>

          <div className="faq-item">
            <dt>Does Ezra alert in real time or on a delay?</dt>
            <dd>Ezra processes transaction data as it flows from the source POS. Anomaly flags are surfaced as close to real time as the integration allows—typically within the same operating session.</dd>
          </div>

          <div className="faq-item">
            <dt>Can I configure different thresholds for different locations?</dt>
            <dd>Yes. Every benchmark, threshold, and segment rule is configurable per franchisee. High-volume locations can have different void-rate thresholds than lower-volume units.</dd>
          </div>

          <div className="faq-item">
            <dt>What happens if Ezra flags a false positive?</dt>
            <dd>All threshold changes are audit-logged and reversible without data loss. If a flag proves to be a false positive, operators can adjust the threshold and the change is recorded for audit trail purposes.</dd>
          </div>
          </dl>
        </section>

        {/* Related pages */}
        <nav aria-label="Related solutions">
          <h2>Related Solutions</h2>
          <ul>
            <li><Link href="/seo/franchise-ai-loss-prevention">Franchise Ai Loss Prevention</Link></li>
            <li><Link href="/seo/employee-theft-detection-franchise">Employee Theft Detection Franchise</Link></li>
            <li><Link href="/seo/franchise-inventory-dashboard">Franchise Inventory Dashboard</Link></li>
          </ul>
        </nav>

        {/* CTA */}
        <section aria-label="Call to action">
          <h2>Stop the Shrinkage Before the Audit Finds It</h2>
          <p>Ezra Loss Prevention is live today and onboarding select franchise operators. Let's put it in front of your network.</p>
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
