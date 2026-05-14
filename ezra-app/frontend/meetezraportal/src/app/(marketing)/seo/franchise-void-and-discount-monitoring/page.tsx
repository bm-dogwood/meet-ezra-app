import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";

const BASE_URL = "https://meetezra.bot";

export const metadata: Metadata = {
  title: "Franchise Void & Discount Monitoring | Ezra AI",
  description: "Manager overrides, excessive voids, and suspicious discount patterns are the early signals of internal theft. Ezra surfaces them as a triaged feed—not a spreadsheet.",
  alternates: { canonical: `${BASE_URL}/seo/franchise-void-and-discount-monitoring` },
  openGraph: {
    title: "Franchise Void & Discount Monitoring | Ezra AI",
    description: "Manager overrides, excessive voids, and suspicious discount patterns are the early signals of internal theft. Ezra surfaces them as a triaged feed—not a spreadsheet.",
    url: `${BASE_URL}/franchise-void-and-discount-monitoring`,
    siteName: "Ezra — Franchise Intelligence Platform",
    images: [{ url: `${BASE_URL}/og/franchise-void-and-discount-monitoring.png`, width: 1200, height: 630, alt: "Monitor Voids and Discounts Across Every Franchise Location" }],
    type: "website",
  },
  twitter: { card: "summary_large_image", title: "Franchise Void & Discount Monitoring | Ezra AI", description: "Manager overrides, excessive voids, and suspicious discount patterns are the early signals of internal theft. Ezra surfaces them as a triaged feed—not a spreadsheet.", images: [`${BASE_URL}/og/franchise-void-and-discount-monitoring.png`] },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Ezra Franchise Intelligence Platform",
    "description": "Manager overrides, excessive voids, and suspicious discount patterns are the early signals of internal theft. Ezra surfaces them as a triaged feed—not a spreadsheet.",
    "url": "https://meetezra.bot/seo/franchise-void-and-discount-monitoring",
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
        "name": "Does Ezra flag every void, or only unusual patterns?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Ezra flags patterns, not individual transactions. A single void is not a flag. A void rate that significantly exceeds a specific employee's or location's historical baseline is a flag."
        }
      },
      {
        "@type": "Question",
        "name": "Can I configure how sensitive the void monitoring is?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. All thresholds are configurable per location and detection surface. High-volume locations can have higher void-rate thresholds that still reflect meaningful anomalies for their operating context."
        }
      },
      {
        "@type": "Question",
        "name": "Does Ezra connect to the POS record when it flags a void?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. Every anomaly flag links directly to the source POS record—no spreadsheet forensics required to investigate."
        }
      },
      {
        "@type": "Question",
        "name": "What is the difference between a comp and an unauthorized void?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Comps (complimentary services or products) are a legitimate business practice. Unauthorized comps—those given outside normal authorization parameters or at unusually high rates—are a theft signal. Ezra monitors comp patterns alongside void patterns."
        }
      },
      {
        "@type": "Question",
        "name": "Is void and discount monitoring live today?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. Ezra Loss Prevention (Module 01) is live in production on Zenoti, including void, discount, and override monitoring."
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
        "name": "Monitor Voids and Discounts Across Every Franchise Location",
        "item": "https://meetezra.bot/seo/franchise-void-and-discount-monitoring"
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
            <li aria-current="page">Monitor Voids and Discounts Across Every Franchise Location</li>
          </ol>
        </nav>
        <header>
          <h1>Monitor Voids and Discounts Across Every Franchise Location</h1>
          <p>Voids, comps, and discount overrides are the primary mechanisms of transactional theft in franchise operations. They're also normal business occurrences—which is why they're so easy to hide in aggregate. Ezra doesn't flag every void. It flags the patterns: the employee whose void rate is 3x their peers, the shift where discount percentages consistently spike, the location where cash variance tracks with manager override volume.</p>
        </header>
        <article>
        <section>
          <h2>Why Voids and Discounts Are the Primary Theft Vectors</h2>
          <p>Transactional theft in service businesses most commonly operates through voids (reversing paid transactions and pocketing the cash), unauthorized comps (giving free service in exchange for cash payments outside the system), and discount abuse (applying unauthorized discounts to friends or family). All three leave traces in transaction data. Ezra finds them.</p>
        </section>

        <section>
          <h2>Pattern Detection vs. Individual Flag Review</h2>
          <p>Reviewing individual void transactions is inefficient and ineffective. A manager who voids three transactions on a busy Saturday is probably correcting errors. A manager whose void rate is 4x the network average across 30 shifts is a different signal. Ezra's anomaly detection operates on patterns, not individual transactions—surfacing the meaningful signals without burying operators in noise.</p>
        </section>

        <section>
          <h2>Six Detection Surfaces for Transactional Anomalies</h2>
          <p>Ezra monitors voids, manager overrides, comps, discount percentages, cash variance, and productivity anomalies. Each surface is tracked against location-specific baselines with configurable thresholds. Anomalies are surfaced as a triaged feed—the highest-risk flags first—with direct links to the source POS record for investigation.</p>
        </section>

        <section>
          <h2>From Flag to Investigation Without Spreadsheets</h2>
          <p>Traditional exception reporting requires pulling a report, exporting it, filtering it, and then locating the relevant transactions in the POS for investigation. Ezra shortcuts this entire process: each flag links directly to the source POS record. Investigation starts the moment the flag appears.</p>
        </section>

        <section>
          <h2>Configurable Thresholds Reduce Alert Fatigue</h2>
          <p>Not every void is theft. Ezra's thresholds are operator-validated and configurable per location—so the void rate that triggers a flag at a low-volume boutique location is different from the threshold at a high-volume flagship. Alert fatigue is the enemy of operator trust; meaningful thresholds are the solution.</p>
        </section>
        </article>
        <section aria-label="Frequently Asked Questions">
          <h2>Frequently Asked Questions</h2>
          <dl>
          <div className="faq-item">
            <dt>Does Ezra flag every void, or only unusual patterns?</dt>
            <dd>Ezra flags patterns, not individual transactions. A single void is not a flag. A void rate that significantly exceeds a specific employee's or location's historical baseline is a flag.</dd>
          </div>

          <div className="faq-item">
            <dt>Can I configure how sensitive the void monitoring is?</dt>
            <dd>Yes. All thresholds are configurable per location and detection surface. High-volume locations can have higher void-rate thresholds that still reflect meaningful anomalies for their operating context.</dd>
          </div>

          <div className="faq-item">
            <dt>Does Ezra connect to the POS record when it flags a void?</dt>
            <dd>Yes. Every anomaly flag links directly to the source POS record—no spreadsheet forensics required to investigate.</dd>
          </div>

          <div className="faq-item">
            <dt>What is the difference between a comp and an unauthorized void?</dt>
            <dd>Comps (complimentary services or products) are a legitimate business practice. Unauthorized comps—those given outside normal authorization parameters or at unusually high rates—are a theft signal. Ezra monitors comp patterns alongside void patterns.</dd>
          </div>

          <div className="faq-item">
            <dt>Is void and discount monitoring live today?</dt>
            <dd>Yes. Ezra Loss Prevention (Module 01) is live in production on Zenoti, including void, discount, and override monitoring.</dd>
          </div>
          </dl>
        </section>
        <nav aria-label="Related solutions">
          <h2>Related Solutions</h2>
          <ul>
            <li><Link href="/seo/employee-theft-detection-franchise">Employee Theft Detection Franchise</Link></li>
            <li><Link href="/seo/franchise-loss-prevention-software">Franchise Loss Prevention Software</Link></li>
            <li><Link href="/seo/franchise-ai-loss-prevention">Franchise Ai Loss Prevention</Link></li>
          </ul>
        </nav>
        <section aria-label="Call to action">
          <h2>Find the Discount and Void Patterns Before They Compound</h2>
          <p>Ezra Loss Prevention is live today. Let us show you the anomaly feed from your locations in the first two weeks.</p>
          <a href="https://meetezra.bot" rel="noopener noreferrer">See Ezra in Action</a>
          <a href="mailto:onboarding@meetezra.bot">Talk to the team →</a>
        </section>
      </main>
    </>
  );
}
