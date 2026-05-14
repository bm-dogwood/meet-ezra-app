import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";

const BASE_URL = "https://meetezra.bot";

export const metadata: Metadata = {
  title: "Franchise Revenue Intelligence Platform | Ezra",
  description: "Surface the revenue trends that move your top line before month-end. Ezra gives you location, provider, and service-level drill-downs in real time.",
  alternates: { canonical: `${BASE_URL}/seo/franchise-revenue-intelligence` },
  openGraph: {
    title: "Franchise Revenue Intelligence Platform | Ezra",
    description: "Surface the revenue trends that move your top line before month-end. Ezra gives you location, provider, and service-level drill-downs in real time.",
    url: `${BASE_URL}/franchise-revenue-intelligence`,
    siteName: "Ezra — Franchise Intelligence Platform",
    images: [{ url: `${BASE_URL}/og/franchise-revenue-intelligence.png`, width: 1200, height: 630, alt: "Revenue Intelligence for Every Franchise Location" }],
    type: "website",
  },
  twitter: { card: "summary_large_image", title: "Franchise Revenue Intelligence Platform | Ezra", description: "Surface the revenue trends that move your top line before month-end. Ezra gives you location, provider, and service-level drill-downs in real time.", images: [`${BASE_URL}/og/franchise-revenue-intelligence.png`] },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Ezra Franchise Intelligence Platform",
    "description": "Surface the revenue trends that move your top line before month-end. Ezra gives you location, provider, and service-level drill-downs in real time.",
    "url": "https://meetezra.bot/seo/franchise-revenue-intelligence",
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
        "name": "How is Ezra Sales different from my POS reporting?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "POS reporting shows transaction data at the location level. Ezra Sales adds network-level comparison, service mix intelligence, provider performance tracking, and real-time drill-down across all locations simultaneously."
        }
      },
      {
        "@type": "Question",
        "name": "Can I see revenue trends by service category across all locations?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. Service-level drill-downs across the network are a core feature of Ezra Sales."
        }
      },
      {
        "@type": "Question",
        "name": "How current is the data?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Ezra processes data as it flows from the POS. Revenue visibility is typically within the same operating session."
        }
      },
      {
        "@type": "Question",
        "name": "Does Ezra Sales integrate with accounting software?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Ezra connects to POS revenue data directly. Accounting integration is part of the source system stack Ezra reads from, with specific integrations depending on the accounting system in use."
        }
      },
      {
        "@type": "Question",
        "name": "Is Ezra Sales available today?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. Ezra Sales (Module 05) is live in production on Zenoti."
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
        "name": "Revenue Intelligence for Every Franchise Location",
        "item": "https://meetezra.bot/seo/franchise-revenue-intelligence"
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
            <li aria-current="page">Revenue Intelligence for Every Franchise Location</li>
          </ol>
        </nav>
        <header>
          <h1>Revenue Intelligence for Every Franchise Location</h1>
          <p>Revenue intelligence means more than knowing your numbers. It means knowing which numbers are moving, in which direction, at which locations, driven by which providers and service categories—before month-end reconciliation reveals a trend that started three weeks ago. Ezra Sales delivers this intelligence in real time, across every location in your franchise network.</p>
        </header>
        <article>
        <section>
          <h2>From Revenue Report to Revenue Intelligence</h2>
          <p>A revenue report tells you what happened. Revenue intelligence tells you why, where, and what to do about it. The difference is drill-down capability—the ability to move from a network-level revenue summary to a specific location's service mix trend to an individual provider's average ticket in two clicks.</p>
        </section>

        <section>
          <h2>Real-Time Visibility Across the Portfolio</h2>
          <p>Ezra Sales processes data as it flows from the source POS, giving operators real-time visibility into revenue across every location simultaneously. The daily flash review—what happened at all locations yesterday—replaces the practice of waiting for a manager to pull and forward a report.</p>
        </section>

        <section>
          <h2>Service Mix Intelligence</h2>
          <p>A shift in service mix—away from high-margin offerings toward lower-margin ones—compresses average ticket even when transaction volume holds. Ezra Sales tracks service category trends across every location, surfacing mix shifts as they develop rather than after they've shaped an entire month of results.</p>
        </section>

        <section>
          <h2>Provider Performance at Every Location</h2>
          <p>In service businesses, individual provider performance is a major revenue driver. Ezra Sales tracks each provider's revenue contribution, average ticket, and service mix—giving managers the intelligence to coach underperformers before their impact compounds across multiple weeks.</p>
        </section>

        <section>
          <h2>Revenue Intelligence Connected to Operations</h2>
          <p>Revenue trends are most actionable when connected to operational data. A revenue decline that coincides with a scheduling gap, a new competitor, or a service mix change requires a different response. Ezra connects revenue intelligence with loss prevention, inventory, and scheduling data so operators can diagnose the cause—not just observe the symptom.</p>
        </section>
        </article>
        <section aria-label="Frequently Asked Questions">
          <h2>Frequently Asked Questions</h2>
          <dl>
          <div className="faq-item">
            <dt>How is Ezra Sales different from my POS reporting?</dt>
            <dd>POS reporting shows transaction data at the location level. Ezra Sales adds network-level comparison, service mix intelligence, provider performance tracking, and real-time drill-down across all locations simultaneously.</dd>
          </div>

          <div className="faq-item">
            <dt>Can I see revenue trends by service category across all locations?</dt>
            <dd>Yes. Service-level drill-downs across the network are a core feature of Ezra Sales.</dd>
          </div>

          <div className="faq-item">
            <dt>How current is the data?</dt>
            <dd>Ezra processes data as it flows from the POS. Revenue visibility is typically within the same operating session.</dd>
          </div>

          <div className="faq-item">
            <dt>Does Ezra Sales integrate with accounting software?</dt>
            <dd>Ezra connects to POS revenue data directly. Accounting integration is part of the source system stack Ezra reads from, with specific integrations depending on the accounting system in use.</dd>
          </div>

          <div className="faq-item">
            <dt>Is Ezra Sales available today?</dt>
            <dd>Yes. Ezra Sales (Module 05) is live in production on Zenoti.</dd>
          </div>
          </dl>
        </section>
        <nav aria-label="Related solutions">
          <h2>Related Solutions</h2>
          <ul>
            <li><Link href="/seo/sales-intelligence-franchise">Sales Intelligence Franchise</Link></li>
            <li><Link href="/seo/multi-unit-sales-dashboard">Multi Unit Sales Dashboard</Link></li>
            <li><Link href="/seo/franchise-dashboard-software">Franchise Dashboard Software</Link></li>
          </ul>
        </nav>
        <section aria-label="Call to action">
          <h2>Know What's Moving Your Revenue Before Month-End</h2>
          <p>Ezra Sales is live today. Real-time revenue intelligence across every franchise location.</p>
          <a href="https://meetezra.bot" rel="noopener noreferrer">See Ezra in Action</a>
          <a href="mailto:onboarding@meetezra.bot">Talk to the team →</a>
        </section>
      </main>
    </>
  );
}
