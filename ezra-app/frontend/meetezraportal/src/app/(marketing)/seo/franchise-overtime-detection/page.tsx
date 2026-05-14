import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";

const BASE_URL = "https://meetezra.bot";

export const metadata: Metadata = {
  title: "Franchise Overtime Detection & Labor Alerts | Ezra",
  description: "Catch overtime exposure before it hits the paycheck. Ezra tracks OT risk by location, shift, and team member across your entire franchise network.",
  alternates: { canonical: `${BASE_URL}/seo/franchise-overtime-detection` },
  openGraph: {
    title: "Franchise Overtime Detection & Labor Alerts | Ezra",
    description: "Catch overtime exposure before it hits the paycheck. Ezra tracks OT risk by location, shift, and team member across your entire franchise network.",
    url: `${BASE_URL}/franchise-overtime-detection`,
    siteName: "Ezra — Franchise Intelligence Platform",
    images: [{ url: `${BASE_URL}/og/franchise-overtime-detection.png`, width: 1200, height: 630, alt: "Detect Overtime Exposure Before It Hits Your Franchise Payroll" }],
    type: "website",
  },
  twitter: { card: "summary_large_image", title: "Franchise Overtime Detection & Labor Alerts | Ezra", description: "Catch overtime exposure before it hits the paycheck. Ezra tracks OT risk by location, shift, and team member across your entire franchise network.", images: [`${BASE_URL}/og/franchise-overtime-detection.png`] },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Ezra Franchise Intelligence Platform",
    "description": "Catch overtime exposure before it hits the paycheck. Ezra tracks OT risk by location, shift, and team member across your entire franchise network.",
    "url": "https://meetezra.bot/seo/franchise-overtime-detection",
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
        "name": "How early does Ezra flag overtime exposure?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Ezra tracks overtime accumulation throughout the pay period and surfaces alerts when an individual is projected to hit overtime based on remaining scheduled shifts. Timing depends on pay period structure and configuration."
        }
      },
      {
        "@type": "Question",
        "name": "Can I see overtime exposure across all locations simultaneously?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. Network-level OT exposure tracking is a core feature of Ezra Scheduling, alongside location-level and individual team-member views."
        }
      },
      {
        "@type": "Question",
        "name": "Does Ezra Scheduling track both scheduled hours and actual worked hours?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Ezra reads from your POS and scheduling systems. The specific combination of scheduled vs. actual hours tracked depends on what your source systems expose through their API."
        }
      },
      {
        "@type": "Question",
        "name": "Is overtime detection part of a standalone module or the full platform?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Overtime detection is part of Ezra Scheduling (Module 03), which is live in production today."
        }
      },
      {
        "@type": "Question",
        "name": "Can I configure different overtime thresholds for different locations?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. All thresholds in Ezra are configurable per location and per franchisee."
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
        "name": "Detect Overtime Exposure Before It Hits Your Franchise Payroll",
        "item": "https://meetezra.bot/seo/franchise-overtime-detection"
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
            <li aria-current="page">Detect Overtime Exposure Before It Hits Your Franchise Payroll</li>
          </ol>
        </nav>
        <header>
          <h1>Detect Overtime Exposure Before It Hits Your Franchise Payroll</h1>
          <p>Overtime is a preventable cost—if you catch it before it accumulates. Most franchise operators find out about overtime exposure in the following week's payroll report, after the hours have already been worked. Ezra Scheduling tracks overtime accumulation by location, shift, and team member in real time, surfacing alerts with enough lead time to act.</p>
        </header>
        <article>
        <section>
          <h2>The Cost of After-the-Fact Overtime Discovery</h2>
          <p>Discovering overtime in the payroll report is too late. The hours have been worked, the cost is locked in, and the only thing left is a post-mortem review of how it happened. Proactive overtime detection changes this—identifying the exposure while there's still time to redistribute hours, adjust schedules, or bring in additional staffing for upcoming high-demand periods.</p>
        </section>

        <section>
          <h2>How Ezra Tracks OT Exposure</h2>
          <p>Ezra Scheduling tracks each team member's hours within the current pay period and calculates their projected overtime exposure based on remaining scheduled shifts. When an individual is trending toward overtime, the alert surfaces at the location and regional level with enough lead time for a scheduling adjustment.</p>
        </section>

        <section>
          <h2>Location-Level and Network-Level OT Visibility</h2>
          <p>Ezra's overtime detection operates at both the individual team-member level and the network level. Regional managers can see which locations are running the highest overtime exposure across the portfolio—enabling prioritized intervention rather than reactive location-by-location reviews.</p>
        </section>

        <section>
          <h2>OT Detection Connected to Demand Data</h2>
          <p>Overtime is sometimes justified—high-demand periods may require extended hours. Ezra connects OT exposure data with demand patterns so operators can distinguish between overtime driven by legitimate demand surges and overtime driven by scheduling inefficiency.</p>
        </section>

        <section>
          <h2>Audit Trail for OT Approvals</h2>
          <p>All threshold changes in Ezra are audit-logged and reversible. When an overtime approval is made for a specific situation, it can be recorded and reviewed—creating the audit trail that compliance and franchise standards often require.</p>
        </section>
        </article>
        <section aria-label="Frequently Asked Questions">
          <h2>Frequently Asked Questions</h2>
          <dl>
          <div className="faq-item">
            <dt>How early does Ezra flag overtime exposure?</dt>
            <dd>Ezra tracks overtime accumulation throughout the pay period and surfaces alerts when an individual is projected to hit overtime based on remaining scheduled shifts. Timing depends on pay period structure and configuration.</dd>
          </div>

          <div className="faq-item">
            <dt>Can I see overtime exposure across all locations simultaneously?</dt>
            <dd>Yes. Network-level OT exposure tracking is a core feature of Ezra Scheduling, alongside location-level and individual team-member views.</dd>
          </div>

          <div className="faq-item">
            <dt>Does Ezra Scheduling track both scheduled hours and actual worked hours?</dt>
            <dd>Ezra reads from your POS and scheduling systems. The specific combination of scheduled vs. actual hours tracked depends on what your source systems expose through their API.</dd>
          </div>

          <div className="faq-item">
            <dt>Is overtime detection part of a standalone module or the full platform?</dt>
            <dd>Overtime detection is part of Ezra Scheduling (Module 03), which is live in production today.</dd>
          </div>

          <div className="faq-item">
            <dt>Can I configure different overtime thresholds for different locations?</dt>
            <dd>Yes. All thresholds in Ezra are configurable per location and per franchisee.</dd>
          </div>
          </dl>
        </section>
        <nav aria-label="Related solutions">
          <h2>Related Solutions</h2>
          <ul>
            <li><Link href="/seo/franchise-labor-optimization">Franchise Labor Optimization</Link></li>
            <li><Link href="/seo/employee-scheduling-franchise-software">Employee Scheduling Franchise Software</Link></li>
            <li><Link href="/seo/save-money-franchise-operations">Save Money Franchise Operations</Link></li>
          </ul>
        </nav>
        <section aria-label="Call to action">
          <h2>Stop Finding Out About Overtime After the Paycheck Runs</h2>
          <p>Ezra Scheduling is live today. Let us show you the OT exposure across your franchise network right now.</p>
          <a href="https://meetezra.bot" rel="noopener noreferrer">See Ezra in Action</a>
          <a href="mailto:onboarding@meetezra.bot">Talk to the team →</a>
        </section>
      </main>
    </>
  );
}
