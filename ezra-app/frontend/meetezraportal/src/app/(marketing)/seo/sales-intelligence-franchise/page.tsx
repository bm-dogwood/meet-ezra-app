import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";

const BASE_URL = "https://meetezra.bot";

export const metadata: Metadata = {
  title: "Sales Intelligence for Franchise Operators | Ezra",
  description: "Provider-level and service-level revenue drill-downs across every location. Know what's driving—and dragging—your top line before month-end.",
  alternates: { canonical: `${BASE_URL}/seo/sales-intelligence-franchise` },
  openGraph: {
    title: "Sales Intelligence for Franchise Operators | Ezra",
    description: "Provider-level and service-level revenue drill-downs across every location. Know what's driving—and dragging—your top line before month-end.",
    url: `${BASE_URL}/sales-intelligence-franchise`,
    siteName: "Ezra — Franchise Intelligence Platform",
    images: [{ url: `${BASE_URL}/og/sales-intelligence-franchise.png`, width: 1200, height: 630, alt: "Franchise Sales Intelligence in Real Time" }],
    type: "website",
  },
  twitter: { card: "summary_large_image", title: "Sales Intelligence for Franchise Operators | Ezra", description: "Provider-level and service-level revenue drill-downs across every location. Know what's driving—and dragging—your top line before month-end.", images: [`${BASE_URL}/og/sales-intelligence-franchise.png`] },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Ezra Franchise Intelligence Platform",
    "description": "Provider-level and service-level revenue drill-downs across every location. Know what's driving—and dragging—your top line before month-end.",
    "url": "https://meetezra.bot/seo/sales-intelligence-franchise",
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
        "name": "How current is the revenue data in Ezra Sales?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Data is processed as it flows from the source POS, typically within the same operating session."
        }
      },
      {
        "@type": "Question",
        "name": "Can I filter sales data by service category?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. Service-level drill-downs are a core feature of Ezra Sales, alongside provider-level and location-level views."
        }
      },
      {
        "@type": "Question",
        "name": "Does Ezra Sales work for restaurant franchises?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Square and Toast integrations—both restaurant-focused—are currently in active build, targeting multi-unit restaurant operators."
        }
      },
      {
        "@type": "Question",
        "name": "Can I see a daily revenue summary for all locations at once?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. The daily flash view shows all locations simultaneously, with ranking and trend indicators."
        }
      },
      {
        "@type": "Question",
        "name": "Is Ezra Sales available today?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. Ezra Sales (Module 05) is live in production on Zenoti today."
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
        "name": "Franchise Sales Intelligence in Real Time",
        "item": "https://meetezra.bot/seo/sales-intelligence-franchise"
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
            <li aria-current="page">Franchise Sales Intelligence in Real Time</li>
          </ol>
        </nav>
        <header>
          <h1>Franchise Sales Intelligence in Real Time</h1>
          <p>Revenue intelligence is the difference between knowing your numbers and understanding them. Ezra Sales gives franchise operators real-time visibility into what's driving performance at the provider, service, and location level—so you can act on trends before they become problems.</p>
        </header>
        <article>
        <section>
          <h2>Provider-Level Performance Data</h2>
          <p>In personal services, salon, and fitness franchises, individual providers drive a significant share of revenue. Ezra Sales tracks each provider's performance—revenue per session, average ticket, service mix—giving managers the data to coach underperformers before they affect the month.</p>
        </section>

        <section>
          <h2>Service Mix Intelligence</h2>
          <p>Not all revenue is equal. A service mix shift toward lower-margin offerings compresses average ticket even when transaction volume holds steady. Ezra Sales tracks service category trends across every location so operators see mix shifts in real time.</p>
        </section>

        <section>
          <h2>Location Ranking and Benchmarking</h2>
          <p>Ranking every location by revenue, average ticket, and growth rate creates the accountability structure that drives performance improvement across the network. Ezra Sales builds this ranking automatically from live POS data.</p>
        </section>

        <section>
          <h2>Daily Flash, Weekly Trend, Monthly Close</h2>
          <p>Ezra Sales is designed for three operating cadences: the daily flash review (what happened yesterday), the weekly trend check (what patterns are developing), and the monthly close prep (what needs to be reconciled). One screen serves all three.</p>
        </section>

        <section>
          <h2>Connected to the Full Operating Layer</h2>
          <p>Sales intelligence is most powerful when connected to operational data. When a location's revenue is declining, knowing whether the cause is a scheduling gap, a supply cost issue, or guest attrition is the difference between a targeted fix and a guessing game. Ezra connects all five modules in one view.</p>
        </section>
        </article>
        <section aria-label="Frequently Asked Questions">
          <h2>Frequently Asked Questions</h2>
          <dl>
          <div className="faq-item">
            <dt>How current is the revenue data in Ezra Sales?</dt>
            <dd>Data is processed as it flows from the source POS, typically within the same operating session.</dd>
          </div>

          <div className="faq-item">
            <dt>Can I filter sales data by service category?</dt>
            <dd>Yes. Service-level drill-downs are a core feature of Ezra Sales, alongside provider-level and location-level views.</dd>
          </div>

          <div className="faq-item">
            <dt>Does Ezra Sales work for restaurant franchises?</dt>
            <dd>Square and Toast integrations—both restaurant-focused—are currently in active build, targeting multi-unit restaurant operators.</dd>
          </div>

          <div className="faq-item">
            <dt>Can I see a daily revenue summary for all locations at once?</dt>
            <dd>Yes. The daily flash view shows all locations simultaneously, with ranking and trend indicators.</dd>
          </div>

          <div className="faq-item">
            <dt>Is Ezra Sales available today?</dt>
            <dd>Yes. Ezra Sales (Module 05) is live in production on Zenoti today.</dd>
          </div>
          </dl>
        </section>
        <nav aria-label="Related solutions">
          <h2>Related Solutions</h2>
          <ul>
            <li><Link href="/seo/multi-unit-sales-dashboard">Multi Unit Sales Dashboard</Link></li>
            <li><Link href="/seo/franchise-crm-dashboard">Franchise Crm Dashboard</Link></li>
            <li><Link href="/seo/multi-unit-business-software">Multi Unit Business Software</Link></li>
          </ul>
        </nav>
        <section aria-label="Call to action">
          <h2>See Every Location's Revenue Before Month-End</h2>
          <p>Ezra Sales is live today and onboarding select operators. Let us show you what real-time franchise revenue intelligence looks like.</p>
          <a href="https://meetezra.bot" rel="noopener noreferrer">See Ezra in Action</a>
          <a href="mailto:onboarding@meetezra.bot">Talk to the team →</a>
        </section>
      </main>
    </>
  );
}
