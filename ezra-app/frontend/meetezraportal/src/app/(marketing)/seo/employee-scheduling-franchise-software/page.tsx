import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";

const BASE_URL = "https://meetezra.bot";

export const metadata: Metadata = {
  title: "Employee Scheduling Software for Franchises | Ezra",
  description: "Reshape labor before idle hours cost you. Ezra reads demand patterns and optimizes schedules across all locations to protect your margin.",
  alternates: { canonical: `${BASE_URL}/seo/employee-scheduling-franchise-software` },
  openGraph: {
    title: "Employee Scheduling Software for Franchises | Ezra",
    description: "Reshape labor before idle hours cost you. Ezra reads demand patterns and optimizes schedules across all locations to protect your margin.",
    url: `${BASE_URL}/employee-scheduling-franchise-software`,
    siteName: "Ezra — Franchise Intelligence Platform",
    images: [{ url: `${BASE_URL}/og/employee-scheduling-franchise-software.png`, width: 1200, height: 630, alt: "Smarter Employee Scheduling for Franchise Operators" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Employee Scheduling Software for Franchises | Ezra",
    description: "Reshape labor before idle hours cost you. Ezra reads demand patterns and optimizes schedules across all locations to protect your margin.",
    images: [`${BASE_URL}/og/employee-scheduling-franchise-software.png`],
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Ezra Franchise Intelligence Platform",
    "description": "Reshape labor before idle hours cost you. Ezra reads demand patterns and optimizes schedules across all locations to protect your margin.",
    "url": "https://meetezra.bot/seo/employee-scheduling-franchise-software",
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
        "name": "Does Ezra Scheduling create schedules automatically?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Ezra Scheduling surfaces the demand data and flags misalignment between current schedules and actual demand patterns. The scheduling decision remains with the operator or manager—Ezra provides the intelligence, not the automation of the scheduling action itself."
        }
      },
      {
        "@type": "Question",
        "name": "What does SRPH mean and why does it matter?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "SRPH stands for Sales Revenue Per Hour. It measures the revenue generated per hour of scheduled labor at a location. Higher SRPH indicates more efficient labor deployment. Tracking it across locations and shifts helps identify where labor is under- or over-deployed relative to revenue."
        }
      },
      {
        "@type": "Question",
        "name": "Can Ezra detect overtime exposure before it happens?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. Ezra Scheduling tracks overtime exposure by location, shift, and team member, and surfaces alerts when an individual or location is trending toward overtime within the current pay period."
        }
      },
      {
        "@type": "Question",
        "name": "How does Ezra get demand data?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Ezra connects to your existing POS through approved API interfaces and reads transaction volume data. This demand signal is used to build the scheduling intelligence layer."
        }
      },
      {
        "@type": "Question",
        "name": "Is Ezra Scheduling live or in build?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Ezra Scheduling (Module 03) is live in production today on Zenoti. It is actively deployed across the 110+ stores on the Ezra platform."
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
        "name": "Smarter Employee Scheduling for Franchise Operators",
        "item": "https://meetezra.bot/seo/employee-scheduling-franchise-software"
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
            <li aria-current="page">Smarter Employee Scheduling for Franchise Operators</li>
          </ol>
        </nav>

        {/* Hero */}
        <header>
          <h1>Smarter Employee Scheduling for Franchise Operators</h1>
          <p>Labor is the largest controllable cost in most franchise operations—and also the most frequently over-deployed. Schedules built on habit, not demand, result in idle staff during slow periods and overtime exposure during surges. Ezra Scheduling reads demand patterns from your POS, tracks revenue-per-hour and idle time by location and shift, and gives operators the data to reshape labor before idle hours become idle dollars.</p>
        </header>

        {/* Body */}
        <article>
        <section>
          <h2>The Cost of Schedule-by-Habit</h2>
          <p>Most franchise schedules are built by copying last week's schedule and adjusting for known events. This approach ignores demand variability, doesn't account for mid-week traffic patterns that have shifted over the past month, and results in chronic overstaffing during predictably slow periods. The cost is invisible until payroll runs—and by then, the week is over.</p>
        </section>

        <section>
          <h2>How Ezra Reads Demand Patterns</h2>
          <p>Ezra Scheduling connects to your POS data and reads historical transaction volume by time of day, day of week, and seasonal pattern. This demand signal is used to identify where current schedules are misaligned with actual traffic—where staff are idle, where overtime risk is building, and where labor could be redistributed to higher-demand periods without adding headcount.</p>
        </section>

        <section>
          <h2>Primary Metrics: SRPH, Idle Time, OT Exposure</h2>
          <p>Ezra tracks three primary labor metrics across every location and shift: Sales Revenue Per Hour (SRPH), idle time percentage, and overtime exposure. SRPH identifies the revenue productivity of each scheduled block. Idle time flags overstaffed periods. OT exposure alerts managers to emerging overtime risk before it hits the paycheck.</p>
        </section>

        <section>
          <h2>Location Ranking for Labor Efficiency</h2>
          <p>Like Ezra Sales, the scheduling module includes location ranking—showing which locations are most and least labor-efficient relative to the portfolio. This ranking creates visibility and accountability without requiring a separate analytics team.</p>
        </section>

        <section>
          <h2>Use Cases: Mid-Week Reshape, OT Intervention, Capacity Planning</h2>
          <p>Ezra Scheduling supports three primary operating use cases: mid-week schedule reshaping based on demand signals, overtime intervention when an individual or location is trending toward OT exposure, and capacity planning for seasonal or event-driven demand changes. Each use case moves the decision closer to real time and further from month-end surprises.</p>
        </section>
        </article>

        {/* FAQ */}
        <section aria-label="Frequently Asked Questions">
          <h2>Frequently Asked Questions</h2>
          <dl>
          <div className="faq-item">
            <dt>Does Ezra Scheduling create schedules automatically?</dt>
            <dd>Ezra Scheduling surfaces the demand data and flags misalignment between current schedules and actual demand patterns. The scheduling decision remains with the operator or manager—Ezra provides the intelligence, not the automation of the scheduling action itself.</dd>
          </div>

          <div className="faq-item">
            <dt>What does SRPH mean and why does it matter?</dt>
            <dd>SRPH stands for Sales Revenue Per Hour. It measures the revenue generated per hour of scheduled labor at a location. Higher SRPH indicates more efficient labor deployment. Tracking it across locations and shifts helps identify where labor is under- or over-deployed relative to revenue.</dd>
          </div>

          <div className="faq-item">
            <dt>Can Ezra detect overtime exposure before it happens?</dt>
            <dd>Yes. Ezra Scheduling tracks overtime exposure by location, shift, and team member, and surfaces alerts when an individual or location is trending toward overtime within the current pay period.</dd>
          </div>

          <div className="faq-item">
            <dt>How does Ezra get demand data?</dt>
            <dd>Ezra connects to your existing POS through approved API interfaces and reads transaction volume data. This demand signal is used to build the scheduling intelligence layer.</dd>
          </div>

          <div className="faq-item">
            <dt>Is Ezra Scheduling live or in build?</dt>
            <dd>Ezra Scheduling (Module 03) is live in production today on Zenoti. It is actively deployed across the 110+ stores on the Ezra platform.</dd>
          </div>
          </dl>
        </section>

        {/* Related pages */}
        <nav aria-label="Related solutions">
          <h2>Related Solutions</h2>
          <ul>
            <li><Link href="/seo/multi-unit-business-software">Multi Unit Business Software</Link></li>
            <li><Link href="/seo/save-money-franchise-operations">Save Money Franchise Operations</Link></li>
            <li><Link href="/seo/franchise-automation-software">Franchise Automation Software</Link></li>
          </ul>
        </nav>

        {/* CTA */}
        <section aria-label="Call to action">
          <h2>Stop Paying for Hours That Aren't Working</h2>
          <p>Ezra Scheduling is live today and onboarding select franchise operators. Let us show you where your labor budget is going.</p>
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
