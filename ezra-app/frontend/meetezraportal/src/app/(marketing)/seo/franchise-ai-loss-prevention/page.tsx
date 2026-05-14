import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";

const BASE_URL = "https://meetezra.bot";

export const metadata: Metadata = {
  title: "Franchise AI Loss Prevention Software | Ezra",
  description: "Detect employee theft, voids, and shrinkage automatically across every franchise location. Ezra's AI flags anomalies before the next audit.",
  alternates: { canonical: `${BASE_URL}/seo/franchise-ai-loss-prevention` },
  openGraph: {
    title: "Franchise AI Loss Prevention Software | Ezra",
    description: "Detect employee theft, voids, and shrinkage automatically across every franchise location. Ezra's AI flags anomalies before the next audit.",
    url: `${BASE_URL}/franchise-ai-loss-prevention`,
    siteName: "Ezra — Franchise Intelligence Platform",
    images: [{ url: `${BASE_URL}/og/franchise-ai-loss-prevention.png`, width: 1200, height: 630, alt: "AI-Powered Loss Prevention for Franchise Operations" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Franchise AI Loss Prevention Software | Ezra",
    description: "Detect employee theft, voids, and shrinkage automatically across every franchise location. Ezra's AI flags anomalies before the next audit.",
    images: [`${BASE_URL}/og/franchise-ai-loss-prevention.png`],
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Ezra Franchise Intelligence Platform",
    "description": "Detect employee theft, voids, and shrinkage automatically across every franchise location. Ezra's AI flags anomalies before the next audit.",
    "url": "https://meetezra.bot/seo/franchise-ai-loss-prevention",
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
        "name": "Does Ezra Loss Prevention replace my existing POS?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No. Ezra reads from your existing POS through approved interfaces and does not replace or modify it. It is an operating layer on top of your existing stack, not a replacement."
        }
      },
      {
        "@type": "Question",
        "name": "Which POS systems does Ezra support?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Ezra is currently live in production on Zenoti. Square and Toast integrations are in active build. Mindbody, Booker, Lightspeed, and Clover are on the roadmap."
        }
      },
      {
        "@type": "Question",
        "name": "How are thresholds set for anomaly detection?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Thresholds are operator-validated and configurable per franchisee. Every benchmark, threshold, and segment rule can be adjusted to reflect the actual operating conditions of each location."
        }
      },
      {
        "@type": "Question",
        "name": "Can I see the source transaction when an anomaly is flagged?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. Every anomaly flag links directly back to the source POS record—no spreadsheet forensics required. The investigation path is built into the platform."
        }
      },
      {
        "@type": "Question",
        "name": "How long does it take to get started?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Onboarding is designed to be fast. Operators provision a dedicated credential for Ezra in their source POS, and the platform begins reading data immediately. There is no six-month deployment cycle."
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
        "name": "AI-Powered Loss Prevention for Franchise Operations",
        "item": "https://meetezra.bot/seo/franchise-ai-loss-prevention"
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
            <li aria-current="page">AI-Powered Loss Prevention for Franchise Operations</li>
          </ol>
        </nav>

        {/* Hero */}
        <header>
          <h1>AI-Powered Loss Prevention for Franchise Operations</h1>
          <p>Every multi-unit franchise loses margin to internal theft, excessive discounts, and unmonitored voids—often without knowing it until the quarterly audit. By then, thousands of dollars have already walked out the door. Ezra's AI loss prevention module monitors every transaction in real time, flags anomalies as they occur, and surfaces the patterns that manual reviews consistently miss.</p>
        </header>

        {/* Body */}
        <article>
        <section>
          <h2>Why Traditional Loss Prevention Fails Multi-Unit Operators</h2>
          <p>Manual audits catch problems after the fact. By the time a regional manager reviews a 200-line exception report, the shrinkage has compounded across weeks of shifts. Pattern detection is the difference—and that requires AI operating on live transaction data, not a spreadsheet reviewed once a month. Ezra connects to your existing POS, reads every transaction, and flags the behaviors that signal risk: excessive voids on the same register, manager overrides clustered by shift, discount percentages outside the threshold for a specific location, and cash variance that doesn't match expected traffic.</p>
        </section>

        <section>
          <h2>What Ezra Monitors Across Your Franchise Network</h2>
          <p>Ezra Loss Prevention surfaces anomalies across six core detection surfaces: transaction voids, manager overrides and comps, discount patterns and percentages, cash handling variance, productivity anomalies by shift, and cross-location behavioral comparisons. Every flag links directly back to the source POS record—no spreadsheet forensics, no re-pulling reports. The operator sees the anomaly, the context, and the source data in one screen.</p>
        </section>

        <section>
          <h2>Configurable Thresholds Per Franchisee</h2>
          <p>Not every location has the same baseline. A high-volume downtown location will have different void rates than a suburban unit. Ezra's thresholds are operator-validated and configurable per franchisee, so alerts are meaningful—not noise. Regional managers can set location-specific benchmarks that reflect actual operating conditions, while franchisors retain visibility into the network-wide picture.</p>
        </section>

        <section>
          <h2>How Ezra Integrates With Your Existing Stack</h2>
          <p>Ezra is POS-agnostic by architectural design. It reads from the operator's existing systems through approved interfaces—no migration, no rip-and-replace, no six-month deployment. Currently live on Zenoti, with Square and Toast in active build. The credential model uses a dedicated, never-personal credential provisioned during onboarding, and Ezra cannot exceed the permissions assigned to that credential.</p>
        </section>

        <section>
          <h2>Loss Prevention That Scales With Your Franchise</h2>
          <p>Whether you're managing 5 locations or 50, the detection surface is identical—and the insights scale with your network. As you add locations, Ezra adds them to the monitoring layer automatically. Multi-unit operators using Ezra Loss Prevention report finding anomalies within the first two weeks of deployment that had been running undetected for months.</p>
        </section>
        </article>

        {/* FAQ */}
        <section aria-label="Frequently Asked Questions">
          <h2>Frequently Asked Questions</h2>
          <dl>
          <div className="faq-item">
            <dt>Does Ezra Loss Prevention replace my existing POS?</dt>
            <dd>No. Ezra reads from your existing POS through approved interfaces and does not replace or modify it. It is an operating layer on top of your existing stack, not a replacement.</dd>
          </div>

          <div className="faq-item">
            <dt>Which POS systems does Ezra support?</dt>
            <dd>Ezra is currently live in production on Zenoti. Square and Toast integrations are in active build. Mindbody, Booker, Lightspeed, and Clover are on the roadmap.</dd>
          </div>

          <div className="faq-item">
            <dt>How are thresholds set for anomaly detection?</dt>
            <dd>Thresholds are operator-validated and configurable per franchisee. Every benchmark, threshold, and segment rule can be adjusted to reflect the actual operating conditions of each location.</dd>
          </div>

          <div className="faq-item">
            <dt>Can I see the source transaction when an anomaly is flagged?</dt>
            <dd>Yes. Every anomaly flag links directly back to the source POS record—no spreadsheet forensics required. The investigation path is built into the platform.</dd>
          </div>

          <div className="faq-item">
            <dt>How long does it take to get started?</dt>
            <dd>Onboarding is designed to be fast. Operators provision a dedicated credential for Ezra in their source POS, and the platform begins reading data immediately. There is no six-month deployment cycle.</dd>
          </div>
          </dl>
        </section>

        {/* Related pages */}
        <nav aria-label="Related solutions">
          <h2>Related Solutions</h2>
          <ul>
            <li><Link href="/seo/employee-theft-detection-franchise">Employee Theft Detection Franchise</Link></li>
            <li><Link href="/seo/shrinkage-prevention-software">Shrinkage Prevention Software</Link></li>
            <li><Link href="/seo/multi-unit-sales-dashboard">Multi Unit Sales Dashboard</Link></li>
          </ul>
        </nav>

        {/* CTA */}
        <section aria-label="Call to action">
          <h2>See the Anomalies Your Current Process Is Missing</h2>
          <p>Ezra Loss Prevention is live on Zenoti today and onboarding select operators. Let us show you what's been running undetected in your network.</p>
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
