import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";

const BASE_URL = "https://meetezra.bot";

export const metadata: Metadata = {
  title: "Multi-Unit Loss Prevention AI | Ezra Platform",
  description: "Anomaly detection that scales across every location in your network. Ezra flags voids, overrides, and cash variance before shrinkage compounds.",
  alternates: { canonical: `${BASE_URL}/seo/multi-unit-loss-prevention-ai` },
  openGraph: {
    title: "Multi-Unit Loss Prevention AI | Ezra Platform",
    description: "Anomaly detection that scales across every location in your network. Ezra flags voids, overrides, and cash variance before shrinkage compounds.",
    url: `${BASE_URL}/multi-unit-loss-prevention-ai`,
    siteName: "Ezra — Franchise Intelligence Platform",
    images: [{ url: `${BASE_URL}/og/multi-unit-loss-prevention-ai.png`, width: 1200, height: 630, alt: "Loss Prevention AI Built for Multi-Unit Scale" }],
    type: "website",
  },
  twitter: { card: "summary_large_image", title: "Multi-Unit Loss Prevention AI | Ezra Platform", description: "Anomaly detection that scales across every location in your network. Ezra flags voids, overrides, and cash variance before shrinkage compounds.", images: [`${BASE_URL}/og/multi-unit-loss-prevention-ai.png`] },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Ezra Franchise Intelligence Platform",
    "description": "Anomaly detection that scales across every location in your network. Ezra flags voids, overrides, and cash variance before shrinkage compounds.",
    "url": "https://meetezra.bot/seo/multi-unit-loss-prevention-ai",
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
        "name": "Can Ezra detect anomalies across 20 or more locations simultaneously?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. Ezra is designed for multi-unit scale. Detection runs across all connected locations simultaneously, with network-level comparison built into the anomaly identification model."
        }
      },
      {
        "@type": "Question",
        "name": "How does Ezra handle different operating profiles across locations?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Thresholds are configurable per location. High-volume locations have different normal void rates than lower-volume units. Each location's thresholds reflect its own operating history."
        }
      },
      {
        "@type": "Question",
        "name": "Does Ezra replace my existing loss prevention process?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Ezra adds AI-driven anomaly detection on top of your existing process. It does not replace POS-level controls or management oversight—it augments them with real-time pattern detection."
        }
      },
      {
        "@type": "Question",
        "name": "How quickly does Ezra flag an anomaly?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Anomaly detection operates as close to real time as the POS integration allows. Flags are surfaced within the same operating session in which the anomaly occurs."
        }
      },
      {
        "@type": "Question",
        "name": "What happens when I add a new location to my franchise?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "New locations are added to the Ezra monitoring layer during onboarding. Detection begins running on the new location's data immediately after integration."
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
        "name": "Loss Prevention AI Built for Multi-Unit Scale",
        "item": "https://meetezra.bot/seo/multi-unit-loss-prevention-ai"
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
            <li aria-current="page">Loss Prevention AI Built for Multi-Unit Scale</li>
          </ol>
        </nav>
        <header>
          <h1>Loss Prevention AI Built for Multi-Unit Scale</h1>
          <p>Single-location loss prevention doesn't scale. When you're managing five, ten, or twenty locations simultaneously, the only way to catch anomalies across the entire network is through AI that operates on every transaction in real time—not a regional manager reviewing exception reports once a week.</p>
        </header>
        <article>
        <section>
          <h2>The Multi-Location Detection Problem</h2>
          <p>Each additional location multiplies the transaction volume—and the surface area for undetected anomalies. A 10-location franchise might process 10,000 transactions per day. No manual review process catches the meaningful patterns in that volume. AI anomaly detection does.</p>
        </section>

        <section>
          <h2>Network-Level vs. Location-Level Anomalies</h2>
          <p>Some anomalies are visible at the location level: a specific location's void rate is running above its own historical norm. Others are only visible at the network level: a location's void rate looks normal on its own but is an outlier relative to comparable locations in the portfolio. Ezra detects both simultaneously.</p>
        </section>

        <section>
          <h2>Six Detection Surfaces</h2>
          <p>Ezra Loss Prevention monitors six detection surfaces across every location: transaction voids, manager overrides and comps, discount percentages, cash variance, productivity anomalies, and cross-location behavioral comparison. Every flag links to the source POS record for immediate investigation.</p>
        </section>

        <section>
          <h2>Triaged Feed, Not an Exception Spreadsheet</h2>
          <p>Traditional loss prevention delivers a 200-line exception report. Ezra delivers a triaged feed—the highest-risk anomalies first, with context and source data immediately accessible. The operator spends their investigation time on the signals that matter, not filtering through noise.</p>
        </section>

        <section>
          <h2>Scales Automatically as You Add Locations</h2>
          <p>As operators add locations to their portfolio, Ezra adds them to the detection layer automatically. There is no re-implementation, no manual configuration per location—just expanded coverage as the network grows.</p>
        </section>
        </article>
        <section aria-label="Frequently Asked Questions">
          <h2>Frequently Asked Questions</h2>
          <dl>
          <div className="faq-item">
            <dt>Can Ezra detect anomalies across 20 or more locations simultaneously?</dt>
            <dd>Yes. Ezra is designed for multi-unit scale. Detection runs across all connected locations simultaneously, with network-level comparison built into the anomaly identification model.</dd>
          </div>

          <div className="faq-item">
            <dt>How does Ezra handle different operating profiles across locations?</dt>
            <dd>Thresholds are configurable per location. High-volume locations have different normal void rates than lower-volume units. Each location's thresholds reflect its own operating history.</dd>
          </div>

          <div className="faq-item">
            <dt>Does Ezra replace my existing loss prevention process?</dt>
            <dd>Ezra adds AI-driven anomaly detection on top of your existing process. It does not replace POS-level controls or management oversight—it augments them with real-time pattern detection.</dd>
          </div>

          <div className="faq-item">
            <dt>How quickly does Ezra flag an anomaly?</dt>
            <dd>Anomaly detection operates as close to real time as the POS integration allows. Flags are surfaced within the same operating session in which the anomaly occurs.</dd>
          </div>

          <div className="faq-item">
            <dt>What happens when I add a new location to my franchise?</dt>
            <dd>New locations are added to the Ezra monitoring layer during onboarding. Detection begins running on the new location's data immediately after integration.</dd>
          </div>
          </dl>
        </section>
        <nav aria-label="Related solutions">
          <h2>Related Solutions</h2>
          <ul>
            <li><Link href="/seo/franchise-loss-prevention-software">Franchise Loss Prevention Software</Link></li>
            <li><Link href="/seo/employee-theft-detection-franchise">Employee Theft Detection Franchise</Link></li>
            <li><Link href="/seo/shrinkage-prevention-software">Shrinkage Prevention Software</Link></li>
          </ul>
        </nav>
        <section aria-label="Call to action">
          <h2>See What's Running Undetected Across Your Network</h2>
          <p>Ezra Loss Prevention is live today on Zenoti. Let us show you the anomaly feed from your locations.</p>
          <a href="https://meetezra.bot" rel="noopener noreferrer">See Ezra in Action</a>
          <a href="mailto:onboarding@meetezra.bot">Talk to the team →</a>
        </section>
      </main>
    </>
  );
}
