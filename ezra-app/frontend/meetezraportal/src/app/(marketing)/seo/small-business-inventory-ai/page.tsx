import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";

const BASE_URL = "https://meetezra.bot";

export const metadata: Metadata = {
  title: "Small Business Inventory AI | Ezra Platform",
  description: "AI inventory intelligence that works without perfect SKU data. Ezra uses financial-proxy modeling to flag waste the way operators actually run their books.",
  alternates: { canonical: `${BASE_URL}/seo/small-business-inventory-ai` },
  openGraph: {
    title: "Small Business Inventory AI | Ezra Platform",
    description: "AI inventory intelligence that works without perfect SKU data. Ezra uses financial-proxy modeling to flag waste the way operators actually run their books.",
    url: `${BASE_URL}/small-business-inventory-ai`,
    siteName: "Ezra — Franchise Intelligence Platform",
    images: [{ url: `${BASE_URL}/og/small-business-inventory-ai.png`, width: 1200, height: 630, alt: "Inventory AI for Small Business Operators Who Run Lean" }],
    type: "website",
  },
  twitter: { card: "summary_large_image", title: "Small Business Inventory AI | Ezra Platform", description: "AI inventory intelligence that works without perfect SKU data. Ezra uses financial-proxy modeling to flag waste the way operators actually run their books.", images: [`${BASE_URL}/og/small-business-inventory-ai.png`] },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Ezra Franchise Intelligence Platform",
    "description": "AI inventory intelligence that works without perfect SKU data. Ezra uses financial-proxy modeling to flag waste the way operators actually run their books.",
    "url": "https://meetezra.bot/seo/small-business-inventory-ai",
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
        "name": "Do I need a full inventory management system to use Ezra Inventory?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No. Ezra Inventory uses financial-proxy modeling from spend and revenue data in your existing systems. No new inventory infrastructure is required."
        }
      },
      {
        "@type": "Question",
        "name": "Is Ezra Inventory designed for product-heavy businesses or service businesses?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Both. The financial-proxy model applies to any business with supply costs—whether those are products for resale or consumables used in service delivery."
        }
      },
      {
        "@type": "Question",
        "name": "When is Ezra Inventory available?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Ezra Inventory (Module 02) targets Q2 2026 delivery. Contact us for priority onboarding access."
        }
      },
      {
        "@type": "Question",
        "name": "Can Ezra Inventory work alongside my existing inventory system?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. Ezra reads from your existing systems through approved interfaces and does not replace them. If you have an existing inventory system, Ezra adds an intelligence layer on top of it."
        }
      },
      {
        "@type": "Question",
        "name": "How quickly will I see results after Ezra Inventory is deployed?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Exception reporting begins as soon as spend and revenue data starts flowing into the platform. Baseline establishment uses historical data, so meaningful exception detection is typically active from day one."
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
        "name": "Inventory AI for Small Business Operators Who Run Lean",
        "item": "https://meetezra.bot/seo/small-business-inventory-ai"
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
            <li aria-current="page">Inventory AI for Small Business Operators Who Run Lean</li>
          </ol>
        </nav>
        <header>
          <h1>Inventory AI for Small Business Operators Who Run Lean</h1>
          <p>Small business inventory AI shouldn't require a warehouse management system, a perfect bill of materials, or a dedicated inventory team. Ezra's financial-proxy approach to inventory intelligence works from the financial data small business operators already have—supply spend and revenue—and flags waste without adding a new data collection burden.</p>
        </header>
        <article>
        <section>
          <h2>Inventory Intelligence Without Perfect Data</h2>
          <p>Most AI inventory tools are built for businesses with clean SKU data, consistent receiving processes, and staff dedicated to physical counts. Most small franchise businesses don't have those. Ezra Inventory was designed around this reality—using financial-proxy modeling that works from spend and revenue data, not idealized inventory infrastructure.</p>
        </section>

        <section>
          <h2>How Financial-Proxy Modeling Works</h2>
          <p>Ezra tracks supply spend as a percentage of relevant revenue for each location and category. Trailing averages establish the normal ratio for each operation. When spend-to-revenue deviates from that average by more than a configurable threshold, the exception surfaces automatically. No SKU data required.</p>
        </section>

        <section>
          <h2>The Right Tool for Lean Operations</h2>
          <p>Small business operators run lean. They don't have time to maintain complex inventory systems, run weekly physical counts, or reconcile SKU-level variance reports. Ezra's inventory intelligence is designed to run in the background, surface exceptions when they occur, and require operator attention only when the data indicates a problem.</p>
        </section>

        <section>
          <h2>Category-Specific Intelligence</h2>
          <p>Not all supply costs behave the same. Products, consumables, and major supplies all have different spend-to-revenue profiles. Ezra's thresholds are category-specific and configurable—giving small business operators the same category-level intelligence that enterprise operations have built into their financial controls.</p>
        </section>

        <section>
          <h2>Inventory AI as Part of the Operating Layer</h2>
          <p>Ezra Inventory becomes most powerful when combined with loss prevention data. When supply spend is elevated and transaction anomalies are present simultaneously, the combined signal tells a clearer story than either data point alone. The operating layer model is what makes this possible.</p>
        </section>
        </article>
        <section aria-label="Frequently Asked Questions">
          <h2>Frequently Asked Questions</h2>
          <dl>
          <div className="faq-item">
            <dt>Do I need a full inventory management system to use Ezra Inventory?</dt>
            <dd>No. Ezra Inventory uses financial-proxy modeling from spend and revenue data in your existing systems. No new inventory infrastructure is required.</dd>
          </div>

          <div className="faq-item">
            <dt>Is Ezra Inventory designed for product-heavy businesses or service businesses?</dt>
            <dd>Both. The financial-proxy model applies to any business with supply costs—whether those are products for resale or consumables used in service delivery.</dd>
          </div>

          <div className="faq-item">
            <dt>When is Ezra Inventory available?</dt>
            <dd>Ezra Inventory (Module 02) targets Q2 2026 delivery. Contact us for priority onboarding access.</dd>
          </div>

          <div className="faq-item">
            <dt>Can Ezra Inventory work alongside my existing inventory system?</dt>
            <dd>Yes. Ezra reads from your existing systems through approved interfaces and does not replace them. If you have an existing inventory system, Ezra adds an intelligence layer on top of it.</dd>
          </div>

          <div className="faq-item">
            <dt>How quickly will I see results after Ezra Inventory is deployed?</dt>
            <dd>Exception reporting begins as soon as spend and revenue data starts flowing into the platform. Baseline establishment uses historical data, so meaningful exception detection is typically active from day one.</dd>
          </div>
          </dl>
        </section>
        <nav aria-label="Related solutions">
          <h2>Related Solutions</h2>
          <ul>
            <li><Link href="/seo/ai-inventory-management-franchise">Ai Inventory Management Franchise</Link></li>
            <li><Link href="/seo/franchise-inventory-dashboard">Franchise Inventory Dashboard</Link></li>
            <li><Link href="/seo/franchise-software-small-business">Franchise Software Small Business</Link></li>
          </ul>
        </nav>
        <section aria-label="Call to action">
          <h2>Catch Inventory Waste Without a Dedicated Inventory Team</h2>
          <p>Ezra Inventory ships Q2 2026. Join the priority onboarding list.</p>
          <a href="https://meetezra.bot" rel="noopener noreferrer">See Ezra in Action</a>
          <a href="mailto:onboarding@meetezra.bot">Talk to the team →</a>
        </section>
      </main>
    </>
  );
}
