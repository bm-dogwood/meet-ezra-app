import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";

const BASE_URL = "https://meetezra.bot";

export const metadata: Metadata = {
  title: "Employee Theft Detection for Franchises | Ezra",
  description: "Catch internal theft before it compounds. Ezra monitors every void, override, and discount pattern across your franchise network in real time.",
  alternates: { canonical: `${BASE_URL}/seo/employee-theft-detection-franchise` },
  openGraph: {
    title: "Employee Theft Detection for Franchises | Ezra",
    description: "Catch internal theft before it compounds. Ezra monitors every void, override, and discount pattern across your franchise network in real time.",
    url: `${BASE_URL}/employee-theft-detection-franchise`,
    siteName: "Ezra — Franchise Intelligence Platform",
    images: [{ url: `${BASE_URL}/og/employee-theft-detection-franchise.png`, width: 1200, height: 630, alt: "Employee Theft Detection Across Your Franchise Network" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Employee Theft Detection for Franchises | Ezra",
    description: "Catch internal theft before it compounds. Ezra monitors every void, override, and discount pattern across your franchise network in real time.",
    images: [`${BASE_URL}/og/employee-theft-detection-franchise.png`],
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Ezra Franchise Intelligence Platform",
    "description": "Catch internal theft before it compounds. Ezra monitors every void, override, and discount pattern across your franchise network in real time.",
    "url": "https://meetezra.bot/seo/employee-theft-detection-franchise",
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
        "name": "Can Ezra identify specific employees engaging in theft?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Ezra surfaces behavioral patterns—voids, overrides, discount rates, cash variance—that are associated with specific registers, shifts, or team members. The platform flags the anomaly; the operator investigates and makes the determination."
        }
      },
      {
        "@type": "Question",
        "name": "Does Ezra require installing software on POS terminals?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No. Ezra integrates with your POS through approved API interfaces. There is no software installed on individual terminals."
        }
      },
      {
        "@type": "Question",
        "name": "How do I know if a flag is real or a false positive?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Every threshold is configurable, and all changes are audit-logged. If a specific pattern is generating false positives in your operation, you can adjust the threshold for that location or detection surface."
        }
      },
      {
        "@type": "Question",
        "name": "What franchise types does employee theft detection apply to?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Ezra Loss Prevention is relevant to any franchise type with POS-recorded transactions: salon and personal services, restaurants, fitness, retail, and professional services. Any transaction environment where voids, discounts, and cash handling occur."
        }
      },
      {
        "@type": "Question",
        "name": "Is Ezra's data isolated between franchise locations?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. Operator data is isolated by tenant, and cross-tenant data access is structurally blocked. Each franchisee's data is accessible only to that operator and the franchisor structure they are part of."
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
        "name": "Employee Theft Detection Across Your Franchise Network",
        "item": "https://meetezra.bot/seo/employee-theft-detection-franchise"
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
            <li aria-current="page">Employee Theft Detection Across Your Franchise Network</li>
          </ol>
        </nav>

        {/* Hero */}
        <header>
          <h1>Employee Theft Detection Across Your Franchise Network</h1>
          <p>Internal theft is the most consistent and least detected cost in franchise operations. It rarely looks like theft. It looks like a void. A comp. A discount a few points above the norm. A manager override at the end of a shift. Individually, each transaction is defensible. In aggregate, the pattern is unmistakable. Ezra is designed to see the pattern—across every location, every shift, every register.</p>
        </header>

        {/* Body */}
        <article>
        <section>
          <h2>Why Employee Theft Goes Undetected in Franchises</h2>
          <p>Most franchise operators are reviewing exception reports weekly or monthly—if at all. By the time the pattern is visible in a spreadsheet, it has been running for weeks. The average internal theft case in food service and personal services runs for 18 months before detection. At a five-location franchise averaging $500,000 per location annually, even a 2% shrinkage rate from internal sources represents $50,000 in losses before anyone notices.</p>
        </section>

        <section>
          <h2>The Patterns Ezra Detects</h2>
          <p>Ezra monitors voids, manager overrides, comps, discount percentages, cash variance, and productivity patterns—looking for the behavioral signatures that precede or indicate internal theft. Not every void is theft. Not every comp is fraud. But a specific employee running 3x the void rate of peers on the same shift, at the same register, on the same days of the week—that is a pattern. Ezra surfaces it. The operator investigates.</p>
        </section>

        <section>
          <h2>From Flag to Investigation Without Spreadsheets</h2>
          <p>Every anomaly flag in Ezra links directly to the source POS record. The operator sees the flag, the context, and the data behind it—without pulling a separate report or cross-referencing a spreadsheet. Investigation time drops from hours to minutes.</p>
        </section>

        <section>
          <h2>Network-Wide vs. Location-Level Detection</h2>
          <p>Ezra monitors at both levels simultaneously. Location-level thresholds catch anomalies within a single unit. Network-level comparison surfaces the units and individuals that are outliers relative to the portfolio. A void rate that looks normal in isolation may look very different when ranked against every other location in the group.</p>
        </section>

        <section>
          <h2>Detection Before the Audit, Not After</h2>
          <p>The goal of Ezra's loss prevention module is to surface risk within the same operating cycle it occurs—not after a quarterly audit reveals a problem that's been compounding for months. Real-time anomaly detection, connected directly to your existing POS, is the only way to accomplish this at franchise scale.</p>
        </section>
        </article>

        {/* FAQ */}
        <section aria-label="Frequently Asked Questions">
          <h2>Frequently Asked Questions</h2>
          <dl>
          <div className="faq-item">
            <dt>Can Ezra identify specific employees engaging in theft?</dt>
            <dd>Ezra surfaces behavioral patterns—voids, overrides, discount rates, cash variance—that are associated with specific registers, shifts, or team members. The platform flags the anomaly; the operator investigates and makes the determination.</dd>
          </div>

          <div className="faq-item">
            <dt>Does Ezra require installing software on POS terminals?</dt>
            <dd>No. Ezra integrates with your POS through approved API interfaces. There is no software installed on individual terminals.</dd>
          </div>

          <div className="faq-item">
            <dt>How do I know if a flag is real or a false positive?</dt>
            <dd>Every threshold is configurable, and all changes are audit-logged. If a specific pattern is generating false positives in your operation, you can adjust the threshold for that location or detection surface.</dd>
          </div>

          <div className="faq-item">
            <dt>What franchise types does employee theft detection apply to?</dt>
            <dd>Ezra Loss Prevention is relevant to any franchise type with POS-recorded transactions: salon and personal services, restaurants, fitness, retail, and professional services. Any transaction environment where voids, discounts, and cash handling occur.</dd>
          </div>

          <div className="faq-item">
            <dt>Is Ezra's data isolated between franchise locations?</dt>
            <dd>Yes. Operator data is isolated by tenant, and cross-tenant data access is structurally blocked. Each franchisee's data is accessible only to that operator and the franchisor structure they are part of.</dd>
          </div>
          </dl>
        </section>

        {/* Related pages */}
        <nav aria-label="Related solutions">
          <h2>Related Solutions</h2>
          <ul>
            <li><Link href="/seo/franchise-loss-prevention-software">Franchise Loss Prevention Software</Link></li>
            <li><Link href="/seo/shrinkage-prevention-software">Shrinkage Prevention Software</Link></li>
            <li><Link href="/seo/franchise-ai-loss-prevention">Franchise Ai Loss Prevention</Link></li>
          </ul>
        </nav>

        {/* CTA */}
        <section aria-label="Call to action">
          <h2>Find the Pattern Before It Compounds</h2>
          <p>Ezra is live today and onboarding select franchise operators. Let us show you what's running undetected in your network right now.</p>
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
