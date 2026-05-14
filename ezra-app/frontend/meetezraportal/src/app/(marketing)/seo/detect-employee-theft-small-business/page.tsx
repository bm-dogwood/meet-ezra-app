import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";

const BASE_URL = "https://meetezra.bot";

export const metadata: Metadata = {
  title: "Detect Employee Theft in Small Business | Ezra",
  description: "Internal theft costs small businesses thousands before it's ever caught. Ezra's anomaly detection flags the patterns—so you catch it at the first sign.",
  alternates: { canonical: `${BASE_URL}/seo/detect-employee-theft-small-business` },
  openGraph: {
    title: "Detect Employee Theft in Small Business | Ezra",
    description: "Internal theft costs small businesses thousands before it's ever caught. Ezra's anomaly detection flags the patterns—so you catch it at the first sign.",
    url: `${BASE_URL}/detect-employee-theft-small-business`,
    siteName: "Ezra — Franchise Intelligence Platform",
    images: [{ url: `${BASE_URL}/og/detect-employee-theft-small-business.png`, width: 1200, height: 630, alt: "Detect Employee Theft Before It Compounds in Your Business" }],
    type: "website",
  },
  twitter: { card: "summary_large_image", title: "Detect Employee Theft in Small Business | Ezra", description: "Internal theft costs small businesses thousands before it's ever caught. Ezra's anomaly detection flags the patterns—so you catch it at the first sign.", images: [`${BASE_URL}/og/detect-employee-theft-small-business.png`] },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Ezra Franchise Intelligence Platform",
    "description": "Internal theft costs small businesses thousands before it's ever caught. Ezra's anomaly detection flags the patterns—so you catch it at the first sign.",
    "url": "https://meetezra.bot/seo/detect-employee-theft-small-business",
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
        "name": "Do I need to tell my employees I'm using Ezra?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "This is an operational and legal question that varies by jurisdiction. Ezra provides the detection capability; the disclosure decision belongs to the operator and their legal counsel."
        }
      },
      {
        "@type": "Question",
        "name": "Can Ezra tell me exactly who is stealing?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Ezra surfaces behavioral patterns associated with specific registers, shifts, or team members. The determination of what happened and who is responsible belongs to the operator following investigation."
        }
      },
      {
        "@type": "Question",
        "name": "How quickly will Ezra detect a problem if one exists?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Detection begins as soon as Ezra starts reading live transaction data. Operators typically surface their first meaningful anomalies within the first two weeks of deployment."
        }
      },
      {
        "@type": "Question",
        "name": "What if the anomaly turns out to be a legitimate business practice?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Thresholds are fully configurable. If a detection surface is generating false positives because of a specific legitimate practice in your operation, you can adjust the threshold for that surface."
        }
      },
      {
        "@type": "Question",
        "name": "Does Ezra work for single-location small businesses?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Ezra is designed for multi-unit operators (3+ locations). Single-location operators are encouraged to contact us to discuss fit and timeline for single-unit support."
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
        "name": "Detect Employee Theft Before It Compounds in Your Business",
        "item": "https://meetezra.bot/seo/detect-employee-theft-small-business"
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
            <li aria-current="page">Detect Employee Theft Before It Compounds in Your Business</li>
          </ol>
        </nav>
        <header>
          <h1>Detect Employee Theft Before It Compounds in Your Business</h1>
          <p>Internal theft in small businesses doesn't look like theft. It looks like a void. A refund. A discount just above the normal rate. A cash drawer that's a few dollars short at the end of a shift. Individually, each of these is explainable. In a pattern, they're not. Ezra's anomaly detection finds the pattern—before thousands of dollars have walked out the door.</p>
        </header>
        <article>
        <section>
          <h2>How Internal Theft Happens in Small Businesses</h2>
          <p>The most common forms of internal theft in small business and franchise operations are transactional: unauthorized voids on paid transactions, discounts applied after payment is collected, comps given to friends or family, and cash skimmed during periods of high-volume or shift transition. Each requires access—and in small businesses, that access is widespread and trust-based. Anomaly detection is the check on that trust.</p>
        </section>

        <section>
          <h2>The Cost of Late Detection</h2>
          <p>The average internal theft case in service businesses runs for 18 months before detection. At a small business generating $400,000 per year, a 2% internal shrinkage rate represents $8,000 per year—or $12,000 over an 18-month detection lag. Ezra is designed to surface the pattern within the first few weeks it appears, not 18 months later.</p>
        </section>

        <section>
          <h2>What Ezra Monitors</h2>
          <p>Ezra monitors voids, manager overrides, comps, discount percentages, cash variance, and productivity patterns—looking for the behavioral signatures that precede or indicate internal theft. Every flag links to the source POS record for immediate investigation.</p>
        </section>

        <section>
          <h2>Configurable for Your Specific Operation</h2>
          <p>Ezra's thresholds are configurable to reflect your actual operating baseline. High-volume shifts have different normal void rates than low-volume ones. The system learns your patterns and flags deviations from them—not deviations from an arbitrary industry benchmark.</p>
        </section>

        <section>
          <h2>Designed for Operators Without Loss Prevention Teams</h2>
          <p>Enterprise retailers have dedicated loss prevention teams. Small businesses don't. Ezra is designed for the operator who is their own loss prevention team—giving you the same pattern detection capability that enterprise has had for years, at a price point designed for multi-unit franchise economics.</p>
        </section>
        </article>
        <section aria-label="Frequently Asked Questions">
          <h2>Frequently Asked Questions</h2>
          <dl>
          <div className="faq-item">
            <dt>Do I need to tell my employees I'm using Ezra?</dt>
            <dd>This is an operational and legal question that varies by jurisdiction. Ezra provides the detection capability; the disclosure decision belongs to the operator and their legal counsel.</dd>
          </div>

          <div className="faq-item">
            <dt>Can Ezra tell me exactly who is stealing?</dt>
            <dd>Ezra surfaces behavioral patterns associated with specific registers, shifts, or team members. The determination of what happened and who is responsible belongs to the operator following investigation.</dd>
          </div>

          <div className="faq-item">
            <dt>How quickly will Ezra detect a problem if one exists?</dt>
            <dd>Detection begins as soon as Ezra starts reading live transaction data. Operators typically surface their first meaningful anomalies within the first two weeks of deployment.</dd>
          </div>

          <div className="faq-item">
            <dt>What if the anomaly turns out to be a legitimate business practice?</dt>
            <dd>Thresholds are fully configurable. If a detection surface is generating false positives because of a specific legitimate practice in your operation, you can adjust the threshold for that surface.</dd>
          </div>

          <div className="faq-item">
            <dt>Does Ezra work for single-location small businesses?</dt>
            <dd>Ezra is designed for multi-unit operators (3+ locations). Single-location operators are encouraged to contact us to discuss fit and timeline for single-unit support.</dd>
          </div>
          </dl>
        </section>
        <nav aria-label="Related solutions">
          <h2>Related Solutions</h2>
          <ul>
            <li><Link href="/seo/employee-theft-detection-franchise">Employee Theft Detection Franchise</Link></li>
            <li><Link href="/seo/franchise-loss-prevention-software">Franchise Loss Prevention Software</Link></li>
            <li><Link href="/seo/shrinkage-prevention-software">Shrinkage Prevention Software</Link></li>
          </ul>
        </nav>
        <section aria-label="Call to action">
          <h2>Stop Losing Money You Don't Know You're Losing</h2>
          <p>Ezra Loss Prevention is live today. Let us show you what anomaly detection finds in your operation in the first two weeks.</p>
          <a href="https://meetezra.bot" rel="noopener noreferrer">See Ezra in Action</a>
          <a href="mailto:onboarding@meetezra.bot">Talk to the team →</a>
        </section>
      </main>
    </>
  );
}
