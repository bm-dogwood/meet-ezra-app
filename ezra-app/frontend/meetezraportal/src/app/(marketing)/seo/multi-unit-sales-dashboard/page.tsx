import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";

const BASE_URL = "https://meetezra.bot";

export const metadata: Metadata = {
  title: "Multi-Unit Sales Dashboard | Ezra AI Platform",
  description: "Real-time revenue intelligence across every location, provider, and service. See what's moving your top line before month-end—not after.",
  alternates: { canonical: `${BASE_URL}/seo/multi-unit-sales-dashboard` },
  openGraph: {
    title: "Multi-Unit Sales Dashboard | Ezra AI Platform",
    description: "Real-time revenue intelligence across every location, provider, and service. See what's moving your top line before month-end—not after.",
    url: `${BASE_URL}/multi-unit-sales-dashboard`,
    siteName: "Ezra — Franchise Intelligence Platform",
    images: [{ url: `${BASE_URL}/og/multi-unit-sales-dashboard.png`, width: 1200, height: 630, alt: "Real-Time Sales Dashboard for Multi-Unit Operators" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Multi-Unit Sales Dashboard | Ezra AI Platform",
    description: "Real-time revenue intelligence across every location, provider, and service. See what's moving your top line before month-end—not after.",
    images: [`${BASE_URL}/og/multi-unit-sales-dashboard.png`],
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Ezra Franchise Intelligence Platform",
    "description": "Real-time revenue intelligence across every location, provider, and service. See what's moving your top line before month-end—not after.",
    "url": "https://meetezra.bot/seo/multi-unit-sales-dashboard",
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
        "name": "How current is the data in the Ezra Sales dashboard?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Ezra processes data as it flows from the source POS. Revenue visibility is as close to real time as the integration allows—typically within the same operating session."
        }
      },
      {
        "@type": "Question",
        "name": "Can I see sales data broken down by individual provider or staff member?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. Ezra Sales includes provider-level and service-level drill-downs in addition to location-level and network-level views."
        }
      },
      {
        "@type": "Question",
        "name": "Does Ezra Sales work for restaurant franchises as well as service businesses?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. Ezra is building toward multi-unit retail, restaurant, fitness, salon, and professional services. Square and Toast integrations (restaurant-focused) are currently in active build."
        }
      },
      {
        "@type": "Question",
        "name": "Can I compare one location's performance against the network average?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. Location ranking is a core feature of Ezra Sales—showing each location's performance relative to the portfolio, not just absolute numbers."
        }
      },
      {
        "@type": "Question",
        "name": "How does Ezra Sales connect to my existing POS?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Ezra connects to your POS through approved API interfaces. No migration or rip-and-replace is required. The platform reads from your existing stack and applies intelligence on top of it."
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
        "name": "Real-Time Sales Dashboard for Multi-Unit Operators",
        "item": "https://meetezra.bot/seo/multi-unit-sales-dashboard"
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
            <li aria-current="page">Real-Time Sales Dashboard for Multi-Unit Operators</li>
          </ol>
        </nav>

        {/* Hero */}
        <header>
          <h1>Real-Time Sales Dashboard for Multi-Unit Operators</h1>
          <p>Most multi-unit operators learn about revenue trends at month-end—after the numbers are already locked. By then, the slow week at location 3 is history, the service mix shift that's been compressing tickets for two weeks is a fait accompli, and the provider whose performance dropped in week two has already affected four more weeks of results. Ezra Sales puts real-time revenue intelligence in front of operators before trends become losses.</p>
        </header>

        {/* Body */}
        <article>
        <section>
          <h2>Why Month-End Revenue Reviews Are Already Too Late</h2>
          <p>Multi-unit operations generate thousands of transactions per day across dozens of locations. The signal is buried in the volume. By the time a regional manager pulls a revenue report, trends that started two weeks earlier have already shaped the month's outcome. Real-time sales intelligence changes the operating cadence: from reactive to proactive, from monthly reviews to daily flash views.</p>
        </section>

        <section>
          <h2>What the Ezra Sales Dashboard Surfaces</h2>
          <p>Ezra Sales tracks net revenue, average ticket, service mix, and location ranking in real time. Provider-level and service-level drill-downs show which staff members are driving—or dragging—performance, and which service categories are trending in each direction. The dashboard is designed for the daily flash review, the weekly trend check, and the monthly close prep—from one screen.</p>
        </section>

        <section>
          <h2>Location Ranking That Motivates Action</h2>
          <p>One of the most powerful features in Ezra Sales is location ranking. When every location manager knows their performance is visible relative to peers in the network, operating behavior shifts. Ranking creates accountability without requiring an additional meeting—the data speaks for itself.</p>
        </section>

        <section>
          <h2>Provider-Level Performance Visibility</h2>
          <p>In personal services, salon, fitness, and professional services franchises, individual providers drive a significant portion of revenue. Ezra Sales gives operators provider-level performance data alongside service category trends—so underperformance can be addressed through coaching before it becomes a retention or revenue problem.</p>
        </section>

        <section>
          <h2>Built Into the Full Operating Layer</h2>
          <p>Ezra Sales is one of five modules in the Ezra operating platform. When combined with loss prevention, inventory, scheduling, and CRM, operators can make trade-off decisions—labor vs. revenue, discount vs. retention, supply cost vs. service mix—from one unified screen instead of three separate reports.</p>
        </section>
        </article>

        {/* FAQ */}
        <section aria-label="Frequently Asked Questions">
          <h2>Frequently Asked Questions</h2>
          <dl>
          <div className="faq-item">
            <dt>How current is the data in the Ezra Sales dashboard?</dt>
            <dd>Ezra processes data as it flows from the source POS. Revenue visibility is as close to real time as the integration allows—typically within the same operating session.</dd>
          </div>

          <div className="faq-item">
            <dt>Can I see sales data broken down by individual provider or staff member?</dt>
            <dd>Yes. Ezra Sales includes provider-level and service-level drill-downs in addition to location-level and network-level views.</dd>
          </div>

          <div className="faq-item">
            <dt>Does Ezra Sales work for restaurant franchises as well as service businesses?</dt>
            <dd>Yes. Ezra is building toward multi-unit retail, restaurant, fitness, salon, and professional services. Square and Toast integrations (restaurant-focused) are currently in active build.</dd>
          </div>

          <div className="faq-item">
            <dt>Can I compare one location's performance against the network average?</dt>
            <dd>Yes. Location ranking is a core feature of Ezra Sales—showing each location's performance relative to the portfolio, not just absolute numbers.</dd>
          </div>

          <div className="faq-item">
            <dt>How does Ezra Sales connect to my existing POS?</dt>
            <dd>Ezra connects to your POS through approved API interfaces. No migration or rip-and-replace is required. The platform reads from your existing stack and applies intelligence on top of it.</dd>
          </div>
          </dl>
        </section>

        {/* Related pages */}
        <nav aria-label="Related solutions">
          <h2>Related Solutions</h2>
          <ul>
            <li><Link href="/seo/franchise-crm-dashboard">Franchise Crm Dashboard</Link></li>
            <li><Link href="/seo/sales-intelligence-franchise">Sales Intelligence Franchise</Link></li>
            <li><Link href="/seo/multi-unit-business-software">Multi Unit Business Software</Link></li>
          </ul>
        </nav>

        {/* CTA */}
        <section aria-label="Call to action">
          <h2>See Every Location's Revenue in Real Time</h2>
          <p>Ezra Sales is live today. Let us show you what your portfolio looks like when revenue intelligence is available before month-end—not after.</p>
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
