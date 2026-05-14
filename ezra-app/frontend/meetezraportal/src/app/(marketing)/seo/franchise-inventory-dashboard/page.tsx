import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";

const BASE_URL = "https://meetezra.bot";

export const metadata: Metadata = {
  title: "Franchise Inventory Dashboard | Ezra AI",
  description: "Track supply spend as a percentage of revenue across every location. Ezra's inventory dashboard surfaces waste before the month-end reconciliation.",
  alternates: { canonical: `${BASE_URL}/seo/franchise-inventory-dashboard` },
  openGraph: {
    title: "Franchise Inventory Dashboard | Ezra AI",
    description: "Track supply spend as a percentage of revenue across every location. Ezra's inventory dashboard surfaces waste before the month-end reconciliation.",
    url: `${BASE_URL}/franchise-inventory-dashboard`,
    siteName: "Ezra — Franchise Intelligence Platform",
    images: [{ url: `${BASE_URL}/og/franchise-inventory-dashboard.png`, width: 1200, height: 630, alt: "Franchise Inventory Dashboard Built on Financial Controls" }],
    type: "website",
  },
  twitter: { card: "summary_large_image", title: "Franchise Inventory Dashboard | Ezra AI", description: "Track supply spend as a percentage of revenue across every location. Ezra's inventory dashboard surfaces waste before the month-end reconciliation.", images: [`${BASE_URL}/og/franchise-inventory-dashboard.png`] },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Ezra Franchise Intelligence Platform",
    "description": "Track supply spend as a percentage of revenue across every location. Ezra's inventory dashboard surfaces waste before the month-end reconciliation.",
    "url": "https://meetezra.bot/seo/franchise-inventory-dashboard",
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
        "name": "When is Ezra Inventory launching?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Ezra Inventory (Module 02) is in active build, targeting Q2 2026 delivery. Contact us to be among the first operators onboarded."
        }
      },
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
        "name": "How does Ezra know what a normal spend-to-revenue ratio looks like for my operation?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Ezra builds historical baselines from your actual financial data and uses configurable trailing windows to establish normal ranges for each location and category."
        }
      },
      {
        "@type": "Question",
        "name": "Can I set different inventory thresholds for different locations?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. Every threshold is configurable per franchisee, allowing location-specific inventory benchmarks that reflect actual operating conditions."
        }
      },
      {
        "@type": "Question",
        "name": "What data does Ezra Inventory connect to?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Ezra Inventory connects to POS revenue data and accounting spend data through approved API interfaces. No new data collection is required."
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
        "name": "Franchise Inventory Dashboard Built on Financial Controls",
        "item": "https://meetezra.bot/seo/franchise-inventory-dashboard"
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
            <li aria-current="page">Franchise Inventory Dashboard Built on Financial Controls</li>
          </ol>
        </nav>
        <header>
          <h1>Franchise Inventory Dashboard Built on Financial Controls</h1>
          <p>Most franchise inventory dashboards show you what you have. Ezra's shows you what's wrong. By tracking supply spend as a percentage of relevant revenue—with trailing averages and exception reporting—Ezra surfaces the inventory anomalies that physical counts consistently miss.</p>
        </header>
        <article>
        <section>
          <h2>Financial-Proxy Modeling for Franchise Inventory</h2>
          <p>Ezra Inventory uses financial-proxy modeling: supply spend as a percentage of relevant revenue, tracked over configurable trailing windows. When a location's spend-to-revenue ratio deviates from its historical norm, the exception is flagged automatically. No physical count required to trigger the alert.</p>
        </section>

        <section>
          <h2>Category-Specific Thresholds</h2>
          <p>Different product categories have different margin profiles. Ezra's thresholds are operator-validated and category-specific—not generic industry benchmarks. High-margin services have different supply cost expectations than product retail. Each threshold is configurable per franchisee.</p>
        </section>

        <section>
          <h2>Exception Reporting Without the Spreadsheet</h2>
          <p>Inventory exceptions in Ezra are surfaced as a prioritized feed—the highest-deviation locations first, with the supporting data visible immediately. No spreadsheet forensics. No pulling a separate cost-of-goods report and comparing it against a revenue export.</p>
        </section>

        <section>
          <h2>Combined With Physical Counts Where Applicable</h2>
          <p>For franchise operations with sufficient product standardization to support a bill of materials, Ezra incorporates retail aging and physical count data into the inventory model. For operations without that standardization, financial controls alone provide the waste signal.</p>
        </section>

        <section>
          <h2>Inventory Intelligence as Part of the Operating Layer</h2>
          <p>Ezra Inventory is Module 02 in the Ezra platform, shipping Q2 2026. When combined with loss prevention, scheduling, CRM, and sales data, operators can distinguish between supply waste, internal theft, and other margin leaks in one unified view.</p>
        </section>
        </article>
        <section aria-label="Frequently Asked Questions">
          <h2>Frequently Asked Questions</h2>
          <dl>
          <div className="faq-item">
            <dt>When is Ezra Inventory launching?</dt>
            <dd>Ezra Inventory (Module 02) is in active build, targeting Q2 2026 delivery. Contact us to be among the first operators onboarded.</dd>
          </div>

          <div className="faq-item">
            <dt>Does Ezra Inventory require physical inventory counts?</dt>
            <dd>No. The financial-proxy model works from spend and revenue data in your existing systems. Physical counts can be incorporated where the bill of materials supports them, but they are not required.</dd>
          </div>

          <div className="faq-item">
            <dt>How does Ezra know what a normal spend-to-revenue ratio looks like for my operation?</dt>
            <dd>Ezra builds historical baselines from your actual financial data and uses configurable trailing windows to establish normal ranges for each location and category.</dd>
          </div>

          <div className="faq-item">
            <dt>Can I set different inventory thresholds for different locations?</dt>
            <dd>Yes. Every threshold is configurable per franchisee, allowing location-specific inventory benchmarks that reflect actual operating conditions.</dd>
          </div>

          <div className="faq-item">
            <dt>What data does Ezra Inventory connect to?</dt>
            <dd>Ezra Inventory connects to POS revenue data and accounting spend data through approved API interfaces. No new data collection is required.</dd>
          </div>
          </dl>
        </section>
        <nav aria-label="Related solutions">
          <h2>Related Solutions</h2>
          <ul>
            <li><Link href="/seo/ai-inventory-management-franchise">Ai Inventory Management Franchise</Link></li>
            <li><Link href="/seo/shrinkage-prevention-software">Shrinkage Prevention Software</Link></li>
            <li><Link href="/seo/save-money-franchise-operations">Save Money Franchise Operations</Link></li>
          </ul>
        </nav>
        <section aria-label="Call to action">
          <h2>See the Inventory Waste That's Not Showing Up on Your Reports</h2>
          <p>Ezra Inventory ships Q2 2026. Contact us now to be among the first operators onboarded.</p>
          <a href="https://meetezra.bot" rel="noopener noreferrer">See Ezra in Action</a>
          <a href="mailto:onboarding@meetezra.bot">Talk to the team →</a>
        </section>
      </main>
    </>
  );
}
