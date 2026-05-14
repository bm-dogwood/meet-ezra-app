import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";

const BASE_URL = "https://meetezra.bot";

export const metadata: Metadata = {
  title: "Franchise Dashboard Software | Ezra AI Platform",
  description: "One unified dashboard for loss prevention, inventory, scheduling, retention, and sales. Run every location from one screen—not five reports.",
  alternates: { canonical: `${BASE_URL}/seo/franchise-dashboard-software` },
  openGraph: {
    title: "Franchise Dashboard Software | Ezra AI Platform",
    description: "One unified dashboard for loss prevention, inventory, scheduling, retention, and sales. Run every location from one screen—not five reports.",
    url: `${BASE_URL}/franchise-dashboard-software`,
    siteName: "Ezra — Franchise Intelligence Platform",
    images: [{ url: `${BASE_URL}/og/franchise-dashboard-software.png`, width: 1200, height: 630, alt: "One Dashboard for Your Entire Franchise Operation" }],
    type: "website",
  },
  twitter: { card: "summary_large_image", title: "Franchise Dashboard Software | Ezra AI Platform", description: "One unified dashboard for loss prevention, inventory, scheduling, retention, and sales. Run every location from one screen—not five reports.", images: [`${BASE_URL}/og/franchise-dashboard-software.png`] },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Ezra Franchise Intelligence Platform",
    "description": "One unified dashboard for loss prevention, inventory, scheduling, retention, and sales. Run every location from one screen—not five reports.",
    "url": "https://meetezra.bot/seo/franchise-dashboard-software",
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
        "name": "Is Ezra a single dashboard or multiple separate tools?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Ezra is a unified operating platform. All five modules—loss prevention, inventory, scheduling, CRM, and sales—are accessible from one interface with one login."
        }
      },
      {
        "@type": "Question",
        "name": "Can I see data from all my locations in one view?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. Network-level views, location ranking, and portfolio-wide metrics are core to the Ezra dashboard across all modules."
        }
      },
      {
        "@type": "Question",
        "name": "Can I customize what appears on the dashboard?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Every benchmark, threshold, and segment rule is configurable per franchisee. The specific customization options available vary by module."
        }
      },
      {
        "@type": "Question",
        "name": "Does Ezra require replacing any of my existing software?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No. Ezra reads from your existing POS, scheduling, CRM, and accounting systems through approved interfaces. No migration required."
        }
      },
      {
        "@type": "Question",
        "name": "What does the onboarding process look like?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Operators provision a dedicated credential for Ezra in their source POS. The platform begins reading data immediately. Contact onboarding@meetezra.bot to start."
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
        "name": "One Dashboard for Your Entire Franchise Operation",
        "item": "https://meetezra.bot/seo/franchise-dashboard-software"
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
            <li aria-current="page">One Dashboard for Your Entire Franchise Operation</li>
          </ol>
        </nav>
        <header>
          <h1>One Dashboard for Your Entire Franchise Operation</h1>
          <p>Most franchise operators review their business through five separate tools—POS reporting, scheduling software, inventory exports, CRM analytics, and accounting reports. Each requires a different login, a different mental model, and a different time investment. Ezra consolidates all five into one operating dashboard, designed for the operator who makes decisions every day.</p>
        </header>
        <article>
        <section>
          <h2>Why Separate Dashboards Create Blind Spots</h2>
          <p>When loss prevention, inventory, scheduling, CRM, and sales data live in separate systems, the connections between them are invisible. A location with rising void rates, declining revenue, and staff scheduling gaps is showing three signals that together paint a clear picture. In three separate dashboards, each looks like a different problem. In Ezra, they're visible together.</p>
        </section>

        <section>
          <h2>Five Modules, One Interface</h2>
          <p>Ezra's five modules—Loss Prevention, Inventory, Scheduling, Exponential (CRM), and Sales—share a common platform shell and a unified operator-facing portal. Each module has its own intelligence model, but all five are accessible from the same login, the same interface, and the same daily review workflow.</p>
        </section>

        <section>
          <h2>Built for the Daily Operating Cadence</h2>
          <p>Ezra's dashboard is designed around how operators actually use data: a daily flash review in the morning, a deeper trend review mid-week, and a monthly close prep at period end. The interface prioritizes the most time-sensitive information at the top and allows drill-down for deeper investigation.</p>
        </section>

        <section>
          <h2>Configurable Per Franchisee</h2>
          <p>Every benchmark, threshold, segment rule, and alert in Ezra is configurable per franchisee. The dashboard reflects each operator's specific operating context—not a one-size-fits-all view designed for an average franchise that doesn't represent any real one.</p>
        </section>

        <section>
          <h2>No Migration, No Rip-and-Replace</h2>
          <p>The Ezra dashboard reads from the systems operators already use. Adding Ezra doesn't require changing your POS, your scheduling software, or your CRM. The operating layer sits on top—and the dashboard is the window into that layer.</p>
        </section>
        </article>
        <section aria-label="Frequently Asked Questions">
          <h2>Frequently Asked Questions</h2>
          <dl>
          <div className="faq-item">
            <dt>Is Ezra a single dashboard or multiple separate tools?</dt>
            <dd>Ezra is a unified operating platform. All five modules—loss prevention, inventory, scheduling, CRM, and sales—are accessible from one interface with one login.</dd>
          </div>

          <div className="faq-item">
            <dt>Can I see data from all my locations in one view?</dt>
            <dd>Yes. Network-level views, location ranking, and portfolio-wide metrics are core to the Ezra dashboard across all modules.</dd>
          </div>

          <div className="faq-item">
            <dt>Can I customize what appears on the dashboard?</dt>
            <dd>Every benchmark, threshold, and segment rule is configurable per franchisee. The specific customization options available vary by module.</dd>
          </div>

          <div className="faq-item">
            <dt>Does Ezra require replacing any of my existing software?</dt>
            <dd>No. Ezra reads from your existing POS, scheduling, CRM, and accounting systems through approved interfaces. No migration required.</dd>
          </div>

          <div className="faq-item">
            <dt>What does the onboarding process look like?</dt>
            <dd>Operators provision a dedicated credential for Ezra in their source POS. The platform begins reading data immediately. Contact onboarding@meetezra.bot to start.</dd>
          </div>
          </dl>
        </section>
        <nav aria-label="Related solutions">
          <h2>Related Solutions</h2>
          <ul>
            <li><Link href="/seo/multi-unit-business-software">Multi Unit Business Software</Link></li>
            <li><Link href="/seo/multi-unit-sales-dashboard">Multi Unit Sales Dashboard</Link></li>
            <li><Link href="/seo/franchise-crm-dashboard">Franchise Crm Dashboard</Link></li>
          </ul>
        </nav>
        <section aria-label="Call to action">
          <h2>Replace Five Reports With One Operating Layer</h2>
          <p>Ezra is live today and onboarding select operators. One login, all five modules, every location.</p>
          <a href="https://meetezra.bot" rel="noopener noreferrer">See Ezra in Action</a>
          <a href="mailto:onboarding@meetezra.bot">Talk to the team →</a>
        </section>
      </main>
    </>
  );
}
