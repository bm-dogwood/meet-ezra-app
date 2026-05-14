import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";

const BASE_URL = "https://meetezra.bot";

export const metadata: Metadata = {
  title: "Shrinkage Prevention Software for Franchises | Ezra",
  description: "Supply shrinkage and internal theft compound silently. Ezra's AI detects the patterns that manual audits miss—across every location, every shift.",
  alternates: { canonical: `${BASE_URL}/seo/shrinkage-prevention-software` },
  openGraph: {
    title: "Shrinkage Prevention Software for Franchises | Ezra",
    description: "Supply shrinkage and internal theft compound silently. Ezra's AI detects the patterns that manual audits miss—across every location, every shift.",
    url: `${BASE_URL}/shrinkage-prevention-software`,
    siteName: "Ezra — Franchise Intelligence Platform",
    images: [{ url: `${BASE_URL}/og/shrinkage-prevention-software.png`, width: 1200, height: 630, alt: "Shrinkage Prevention Software That Catches What Audits Miss" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shrinkage Prevention Software for Franchises | Ezra",
    description: "Supply shrinkage and internal theft compound silently. Ezra's AI detects the patterns that manual audits miss—across every location, every shift.",
    images: [`${BASE_URL}/og/shrinkage-prevention-software.png`],
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Ezra Franchise Intelligence Platform",
    "description": "Supply shrinkage and internal theft compound silently. Ezra's AI detects the patterns that manual audits miss—across every location, every shift.",
    "url": "https://meetezra.bot/seo/shrinkage-prevention-software",
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
        "name": "Does Ezra detect both employee theft and supply waste?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. Ezra addresses shrinkage from both sources: internal theft through transaction anomaly detection (Loss Prevention module) and supply waste through financial-proxy inventory modeling (Inventory module)."
        }
      },
      {
        "@type": "Question",
        "name": "How does Ezra know what a normal void rate looks like for my operation?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Ezra builds historical baselines from your actual transaction data and uses those baselines to set location-specific thresholds. Configurable benchmarks can also be set by operators for specific detection surfaces."
        }
      },
      {
        "@type": "Question",
        "name": "Is Ezra's shrinkage detection real time?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Transaction anomaly detection is as close to real time as the POS integration allows. Inventory exception reporting operates on a configurable window, with trailing averages updated as new spend data flows in."
        }
      },
      {
        "@type": "Question",
        "name": "What POS systems does Ezra support for shrinkage detection?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Ezra is currently live in production on Zenoti. Square and Toast integrations are in active build. Mindbody, Booker, Lightspeed, and Clover are on the roadmap."
        }
      },
      {
        "@type": "Question",
        "name": "Can I see which locations have the highest shrinkage risk across my network?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. Network-level comparison is a core capability—ranking locations by shrinkage risk relative to the portfolio, not just flagging individual anomalies."
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
        "name": "Shrinkage Prevention Software That Catches What Audits Miss",
        "item": "https://meetezra.bot/seo/shrinkage-prevention-software"
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
            <li aria-current="page">Shrinkage Prevention Software That Catches What Audits Miss</li>
          </ol>
        </nav>

        {/* Hero */}
        <header>
          <h1>Shrinkage Prevention Software That Catches What Audits Miss</h1>
          <p>Shrinkage—from internal theft, vendor error, waste, and unmonitored supply costs—is one of the most consistent and least visible margin killers in multi-unit operations. It rarely announces itself. It accumulates across hundreds of small transactions, over weeks and months, until it shows up as a margin anomaly that the quarterly report can't fully explain. Ezra is purpose-built to surface shrinkage signals before they compound.</p>
        </header>

        {/* Body */}
        <article>
        <section>
          <h2>The Two Sources of Franchise Shrinkage</h2>
          <p>Shrinkage in franchise operations comes from two primary sources: internal theft (voids, overrides, discount abuse, cash variance) and supply waste (product sitting idle, inconsistent supply spend relative to revenue, undetected vendor pricing changes). Most loss prevention tools focus on one source. Ezra addresses both—through transaction anomaly detection for internal theft and financial-proxy inventory modeling for supply waste.</p>
        </section>

        <section>
          <h2>Detecting Internal Theft Before It Compounds</h2>
          <p>Ezra Loss Prevention monitors every transaction, void, manager override, comp, and discount across your network. Behavioral patterns that signal internal theft—a specific employee's void rate, a shift's cash variance relative to traffic, a discount percentage consistently above threshold—are surfaced as a triaged feed, not buried in a 200-line exception report.</p>
        </section>

        <section>
          <h2>Detecting Supply Waste Through Financial Controls</h2>
          <p>Ezra Inventory tracks supply spend as a percentage of relevant revenue, with trailing averages and exception reporting. When a location's supply-to-revenue ratio deviates from its historical pattern with no corresponding revenue change, the flag is automatic. No physical count required.</p>
        </section>

        <section>
          <h2>Why Audits Aren't Enough</h2>
          <p>Traditional loss prevention relies on periodic audits—monthly exception reports, quarterly inventory counts, annual reviews. By the time the audit identifies the problem, it has been running for months. AI-driven anomaly detection that operates on live transaction and spend data is the only approach that catches shrinkage within the operating cycle it occurs.</p>
        </section>

        <section>
          <h2>Configurable Thresholds That Reduce Alert Fatigue</h2>
          <p>Ezra's thresholds are operator-validated and configurable per location and category. This means alerts are meaningful—not every void or comp generates a flag, only the patterns that deviate from what the specific location's history indicates is normal. The result is a high signal-to-noise ratio that keeps operators focused on real risk.</p>
        </section>
        </article>

        {/* FAQ */}
        <section aria-label="Frequently Asked Questions">
          <h2>Frequently Asked Questions</h2>
          <dl>
          <div className="faq-item">
            <dt>Does Ezra detect both employee theft and supply waste?</dt>
            <dd>Yes. Ezra addresses shrinkage from both sources: internal theft through transaction anomaly detection (Loss Prevention module) and supply waste through financial-proxy inventory modeling (Inventory module).</dd>
          </div>

          <div className="faq-item">
            <dt>How does Ezra know what a normal void rate looks like for my operation?</dt>
            <dd>Ezra builds historical baselines from your actual transaction data and uses those baselines to set location-specific thresholds. Configurable benchmarks can also be set by operators for specific detection surfaces.</dd>
          </div>

          <div className="faq-item">
            <dt>Is Ezra's shrinkage detection real time?</dt>
            <dd>Transaction anomaly detection is as close to real time as the POS integration allows. Inventory exception reporting operates on a configurable window, with trailing averages updated as new spend data flows in.</dd>
          </div>

          <div className="faq-item">
            <dt>What POS systems does Ezra support for shrinkage detection?</dt>
            <dd>Ezra is currently live in production on Zenoti. Square and Toast integrations are in active build. Mindbody, Booker, Lightspeed, and Clover are on the roadmap.</dd>
          </div>

          <div className="faq-item">
            <dt>Can I see which locations have the highest shrinkage risk across my network?</dt>
            <dd>Yes. Network-level comparison is a core capability—ranking locations by shrinkage risk relative to the portfolio, not just flagging individual anomalies.</dd>
          </div>
          </dl>
        </section>

        {/* Related pages */}
        <nav aria-label="Related solutions">
          <h2>Related Solutions</h2>
          <ul>
            <li><Link href="/seo/franchise-loss-prevention-software">Franchise Loss Prevention Software</Link></li>
            <li><Link href="/seo/employee-theft-detection-franchise">Employee Theft Detection Franchise</Link></li>
            <li><Link href="/seo/ai-inventory-management-franchise">Ai Inventory Management Franchise</Link></li>
          </ul>
        </nav>

        {/* CTA */}
        <section aria-label="Call to action">
          <h2>Find the Shrinkage Before It Shows Up at Month-End</h2>
          <p>Ezra Loss Prevention and Inventory are live and onboarding select franchise operators. Let us show you where your margins are leaking.</p>
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
