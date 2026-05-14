import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";

const BASE_URL = "https://meetezra.bot";

export const metadata: Metadata = {
  title: "Franchise Labor Optimization Software | Ezra",
  description: "Track idle time, overtime exposure, and revenue-per-hour across every location and shift. Ezra reshapes labor before slow hours drain your margin.",
  alternates: { canonical: `${BASE_URL}/seo/franchise-labor-optimization` },
  openGraph: {
    title: "Franchise Labor Optimization Software | Ezra",
    description: "Track idle time, overtime exposure, and revenue-per-hour across every location and shift. Ezra reshapes labor before slow hours drain your margin.",
    url: `${BASE_URL}/franchise-labor-optimization`,
    siteName: "Ezra — Franchise Intelligence Platform",
    images: [{ url: `${BASE_URL}/og/franchise-labor-optimization.png`, width: 1200, height: 630, alt: "Labor Optimization Across Every Franchise Location" }],
    type: "website",
  },
  twitter: { card: "summary_large_image", title: "Franchise Labor Optimization Software | Ezra", description: "Track idle time, overtime exposure, and revenue-per-hour across every location and shift. Ezra reshapes labor before slow hours drain your margin.", images: [`${BASE_URL}/og/franchise-labor-optimization.png`] },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Ezra Franchise Intelligence Platform",
    "description": "Track idle time, overtime exposure, and revenue-per-hour across every location and shift. Ezra reshapes labor before slow hours drain your margin.",
    "url": "https://meetezra.bot/seo/franchise-labor-optimization",
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
        "name": "What is SRPH and why is it the best labor efficiency metric?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "SRPH (Sales Revenue Per Hour) measures revenue generated per hour of scheduled labor. It accounts for differences in location revenue volume and makes labor efficiency comparable across locations of different sizes."
        }
      },
      {
        "@type": "Question",
        "name": "Can Ezra catch overtime before it happens?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. OT exposure tracking by location, shift, and team member surfaces alerts when overtime is trending in the current pay period—before it is locked into payroll."
        }
      },
      {
        "@type": "Question",
        "name": "How does Ezra build demand patterns for scheduling?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Ezra reads historical transaction volume from your POS and identifies demand patterns by time of day, day of week, and trailing period. These patterns are used to identify misalignment between current schedules and actual demand."
        }
      },
      {
        "@type": "Question",
        "name": "Is Ezra Scheduling live or in build?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Ezra Scheduling (Module 03) is live in production on Zenoti today, actively deployed across 110+ stores."
        }
      },
      {
        "@type": "Question",
        "name": "Can I see idle time data across all locations simultaneously?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. Network-level idle time tracking and location ranking are core features of Ezra Scheduling."
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
        "name": "Labor Optimization Across Every Franchise Location",
        "item": "https://meetezra.bot/seo/franchise-labor-optimization"
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
            <li aria-current="page">Labor Optimization Across Every Franchise Location</li>
          </ol>
        </nav>
        <header>
          <h1>Labor Optimization Across Every Franchise Location</h1>
          <p>Labor is the largest variable cost in most franchise operations—and the one most frequently misallocated. Schedules built on habit over-deploy during slow periods and under-deploy during surges. Ezra Scheduling reads demand patterns from your POS and tracks the three metrics that matter: idle time, overtime exposure, and revenue per labor hour.</p>
        </header>
        <article>
        <section>
          <h2>The True Cost of Idle Labor Hours</h2>
          <p>Idle labor—scheduled staff with no customers—is the most common form of labor waste in franchise operations. A location that runs 20% idle time during its regular schedule is paying for 20% more labor than it needs during those periods. Across 10 locations, even a modest reduction in idle time can represent significant annual labor savings.</p>
        </section>

        <section>
          <h2>Revenue Per Labor Hour: The Core Metric</h2>
          <p>SRPH (Sales Revenue Per Hour) is the most useful metric for franchise labor optimization. It normalizes revenue against scheduled labor hours, making it possible to compare labor efficiency across locations with different revenue profiles and to track whether schedule changes are improving or degrading efficiency.</p>
        </section>

        <section>
          <h2>Overtime Exposure Before the Paycheck</h2>
          <p>Overtime is expensive—and preventable if caught before it accumulates. Ezra Scheduling tracks overtime exposure by location, shift, and team member, surfacing alerts when individuals or locations are trending toward overtime within the current pay period. Acting on the alert before Friday is worth significantly more than reviewing it in the following Monday's payroll report.</p>
        </section>

        <section>
          <h2>Capacity Planning for Demand Surges</h2>
          <p>Labor optimization isn't only about reducing overstaffing. It's also about ensuring capacity during demand surges. Ezra's demand pattern recognition identifies periods of historically high traffic that are currently understaffed—giving managers the intelligence to add capacity proactively rather than scrambling reactively.</p>
        </section>

        <section>
          <h2>Location-Level Ranking for Accountability</h2>
          <p>Ezra Scheduling includes location ranking by labor efficiency metrics—SRPH, idle time, and OT exposure. This ranking creates network-wide accountability without requiring a dedicated review meeting. The data speaks for itself.</p>
        </section>
        </article>
        <section aria-label="Frequently Asked Questions">
          <h2>Frequently Asked Questions</h2>
          <dl>
          <div className="faq-item">
            <dt>What is SRPH and why is it the best labor efficiency metric?</dt>
            <dd>SRPH (Sales Revenue Per Hour) measures revenue generated per hour of scheduled labor. It accounts for differences in location revenue volume and makes labor efficiency comparable across locations of different sizes.</dd>
          </div>

          <div className="faq-item">
            <dt>Can Ezra catch overtime before it happens?</dt>
            <dd>Yes. OT exposure tracking by location, shift, and team member surfaces alerts when overtime is trending in the current pay period—before it is locked into payroll.</dd>
          </div>

          <div className="faq-item">
            <dt>How does Ezra build demand patterns for scheduling?</dt>
            <dd>Ezra reads historical transaction volume from your POS and identifies demand patterns by time of day, day of week, and trailing period. These patterns are used to identify misalignment between current schedules and actual demand.</dd>
          </div>

          <div className="faq-item">
            <dt>Is Ezra Scheduling live or in build?</dt>
            <dd>Ezra Scheduling (Module 03) is live in production on Zenoti today, actively deployed across 110+ stores.</dd>
          </div>

          <div className="faq-item">
            <dt>Can I see idle time data across all locations simultaneously?</dt>
            <dd>Yes. Network-level idle time tracking and location ranking are core features of Ezra Scheduling.</dd>
          </div>
          </dl>
        </section>
        <nav aria-label="Related solutions">
          <h2>Related Solutions</h2>
          <ul>
            <li><Link href="/seo/employee-scheduling-franchise-software">Employee Scheduling Franchise Software</Link></li>
            <li><Link href="/seo/ai-employee-scheduling-for-franchises">Ai Employee Scheduling For Franchises</Link></li>
            <li><Link href="/seo/save-money-franchise-operations">Save Money Franchise Operations</Link></li>
          </ul>
        </nav>
        <section aria-label="Call to action">
          <h2>Stop Overpaying for Labor That Isn't Working</h2>
          <p>Ezra Scheduling is live today. Let us show you the idle time and OT exposure across your franchise network.</p>
          <a href="https://meetezra.bot" rel="noopener noreferrer">See Ezra in Action</a>
          <a href="mailto:onboarding@meetezra.bot">Talk to the team →</a>
        </section>
      </main>
    </>
  );
}
