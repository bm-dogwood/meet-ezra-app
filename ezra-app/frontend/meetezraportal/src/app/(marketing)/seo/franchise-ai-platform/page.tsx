import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";

const BASE_URL = "https://meetezra.bot";

export const metadata: Metadata = {
  title: "Franchise AI Platform | Ezra — Run Every Unit Like Your Best",
  description: "Ezra is the AI operating layer for multi-unit operators. Loss prevention, inventory, scheduling, CRM, and sales intelligence—in one unified platform.",
  alternates: { canonical: `${BASE_URL}/seo/franchise-ai-platform` },
  openGraph: {
    title: "Franchise AI Platform | Ezra — Run Every Unit Like Your Best",
    description: "Ezra is the AI operating layer for multi-unit operators. Loss prevention, inventory, scheduling, CRM, and sales intelligence—in one unified platform.",
    url: `${BASE_URL}/franchise-ai-platform`,
    siteName: "Ezra — Franchise Intelligence Platform",
    images: [{ url: `${BASE_URL}/og/franchise-ai-platform.png`, width: 1200, height: 630, alt: "The AI Platform Built for Franchise Operators" }],
    type: "website",
  },
  twitter: { card: "summary_large_image", title: "Franchise AI Platform | Ezra — Run Every Unit Like Your Best", description: "Ezra is the AI operating layer for multi-unit operators. Loss prevention, inventory, scheduling, CRM, and sales intelligence—in one unified platform.", images: [`${BASE_URL}/og/franchise-ai-platform.png`] },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Ezra Franchise Intelligence Platform",
    "description": "Ezra is the AI operating layer for multi-unit operators. Loss prevention, inventory, scheduling, CRM, and sales intelligence—in one unified platform.",
    "url": "https://meetezra.bot/seo/franchise-ai-platform",
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
        "name": "What does 'AI operating layer' mean in practice?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "It means Ezra reads from your existing systems, applies pattern detection and intelligence models to the data, and surfaces the results through one unified interface. No migration. No replacement of existing systems. Just intelligence on top of data you already have."
        }
      },
      {
        "@type": "Question",
        "name": "How many franchise locations is Ezra designed for?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Ezra is designed for multi-unit operators—from 3 locations to 100+. The current platform has 110 active stores in production."
        }
      },
      {
        "@type": "Question",
        "name": "Is Ezra a replacement for my POS or scheduling software?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No. Ezra reads from those systems through approved interfaces and does not replace them. It is an operating layer on top of your existing stack."
        }
      },
      {
        "@type": "Question",
        "name": "Which modules are live today?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Loss Prevention, Scheduling, Exponential (CRM), and Sales are live in production. Inventory is in active build targeting Q2 2026."
        }
      },
      {
        "@type": "Question",
        "name": "How do I get started with Ezra?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Contact onboarding@meetezra.bot. Ezra is onboarding select operators. The process involves provisioning a dedicated credential in your source POS—no software installation on individual terminals."
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
        "name": "The AI Platform Built for Franchise Operators",
        "item": "https://meetezra.bot/seo/franchise-ai-platform"
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
            <li aria-current="page">The AI Platform Built for Franchise Operators</li>
          </ol>
        </nav>
        <header>
          <h1>The AI Platform Built for Franchise Operators</h1>
          <p>Ezra is the AI operating layer purpose-built for multi-unit franchise operators. Five integrated modules—loss prevention, inventory, scheduling, customer retention, and sales intelligence—sit on top of the systems operators already use, turning transaction data into decisions that drive revenue, protect margin, and free up the operator's time.</p>
        </header>
        <article>
        <section>
          <h2>Why Franchise Operations Need an AI Layer</h2>
          <p>The data that drives franchise performance already exists—in the POS, the scheduling system, the CRM, and the accounting platform. The problem is that it's trapped. Fragmented across systems, accessible only through manual reporting, and interpreted differently by every manager who looks at it. Ezra's AI layer reads that data continuously, applies consistent operator-validated logic, and surfaces the intelligence that drives better decisions across the network.</p>
        </section>

        <section>
          <h2>Five Modules, One Platform</h2>
          <p>Ezra Loss Prevention catches behavioral anomalies that signal internal theft. Ezra Inventory surfaces supply waste through financial-proxy modeling. Ezra Scheduling optimizes labor deployment before idle hours compound. Ezra Exponential recovers lapsed guests through automated SMS retention. Ezra Sales delivers real-time revenue intelligence at the location, provider, and service level. Together, they form a complete operating layer.</p>
        </section>

        <section>
          <h2>What AI Actually Does in the Ezra Platform</h2>
          <p>AI in Ezra is not chatbots or AI-generated reports. It is pattern detection at scale—the ability to identify which of thousands of daily transactions are anomalous, which supply cost movements are outside normal ranges, which guests are at risk based on visit frequency, and which scheduling patterns are costing the most in idle labor. These are detection problems that scale beyond any manual process.</p>
        </section>

        <section>
          <h2>Built With Operators, Not For Them</h2>
          <p>Ezra was validated with a multi-unit design partner before launch. Features that broke against operator reality were dropped. Thresholds that generated noise were made configurable. The result is a platform that works the way operators work—not the way a product team imagined they should.</p>
        </section>

        <section>
          <h2>Status: Live and Onboarding Select Operators</h2>
          <p>Ezra is live today with 110 active stores on the platform, live integration with Zenoti, and four of five modules in production. The inventory module and Square/Toast integrations are targeting Q2 2026. Partner-channel GTM and portfolio-scale pricing are planned for Q4 2026+. Onboarding is selective and by contact.</p>
        </section>
        </article>
        <section aria-label="Frequently Asked Questions">
          <h2>Frequently Asked Questions</h2>
          <dl>
          <div className="faq-item">
            <dt>What does 'AI operating layer' mean in practice?</dt>
            <dd>It means Ezra reads from your existing systems, applies pattern detection and intelligence models to the data, and surfaces the results through one unified interface. No migration. No replacement of existing systems. Just intelligence on top of data you already have.</dd>
          </div>

          <div className="faq-item">
            <dt>How many franchise locations is Ezra designed for?</dt>
            <dd>Ezra is designed for multi-unit operators—from 3 locations to 100+. The current platform has 110 active stores in production.</dd>
          </div>

          <div className="faq-item">
            <dt>Is Ezra a replacement for my POS or scheduling software?</dt>
            <dd>No. Ezra reads from those systems through approved interfaces and does not replace them. It is an operating layer on top of your existing stack.</dd>
          </div>

          <div className="faq-item">
            <dt>Which modules are live today?</dt>
            <dd>Loss Prevention, Scheduling, Exponential (CRM), and Sales are live in production. Inventory is in active build targeting Q2 2026.</dd>
          </div>

          <div className="faq-item">
            <dt>How do I get started with Ezra?</dt>
            <dd>Contact onboarding@meetezra.bot. Ezra is onboarding select operators. The process involves provisioning a dedicated credential in your source POS—no software installation on individual terminals.</dd>
          </div>
          </dl>
        </section>
        <nav aria-label="Related solutions">
          <h2>Related Solutions</h2>
          <ul>
            <li><Link href="/seo/multi-unit-business-software">Multi Unit Business Software</Link></li>
            <li><Link href="/seo/franchise-automation-software">Franchise Automation Software</Link></li>
            <li><Link href="/seo/franchise-dashboard-software">Franchise Dashboard Software</Link></li>
          </ul>
        </nav>
        <section aria-label="Call to action">
          <h2>Run Every Unit Like Your Best One</h2>
          <p>Ezra is live today and onboarding select franchise operators. Let's talk about your network.</p>
          <a href="https://meetezra.bot" rel="noopener noreferrer">See Ezra in Action</a>
          <a href="mailto:onboarding@meetezra.bot">Talk to the team →</a>
        </section>
      </main>
    </>
  );
}
