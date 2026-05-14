import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";

const BASE_URL = "https://meetezra.bot";

export const metadata: Metadata = {
  title: "AI Employee Scheduling for Franchises | Ezra",
  description: "Ezra reads your demand patterns and reshapes labor before idle hours become idle dollars. Track SRPH, overtime, and idle time by location.",
  alternates: { canonical: `${BASE_URL}/seo/ai-employee-scheduling-for-franchises` },
  openGraph: {
    title: "AI Employee Scheduling for Franchises | Ezra",
    description: "Ezra reads your demand patterns and reshapes labor before idle hours become idle dollars. Track SRPH, overtime, and idle time by location.",
    url: `${BASE_URL}/ai-employee-scheduling-for-franchises`,
    siteName: "Ezra — Franchise Intelligence Platform",
    images: [{ url: `${BASE_URL}/og/ai-employee-scheduling-for-franchises.png`, width: 1200, height: 630, alt: "AI Employee Scheduling That Reshapes Labor Before It Costs You" }],
    type: "website",
  },
  twitter: { card: "summary_large_image", title: "AI Employee Scheduling for Franchises | Ezra", description: "Ezra reads your demand patterns and reshapes labor before idle hours become idle dollars. Track SRPH, overtime, and idle time by location.", images: [`${BASE_URL}/og/ai-employee-scheduling-for-franchises.png`] },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Ezra Franchise Intelligence Platform",
    "description": "Ezra reads your demand patterns and reshapes labor before idle hours become idle dollars. Track SRPH, overtime, and idle time by location.",
    "url": "https://meetezra.bot/seo/ai-employee-scheduling-for-franchises",
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
        "name": "Does Ezra create schedules automatically?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Ezra surfaces demand intelligence and flags misalignment between current schedules and actual demand. The scheduling decision remains with the operator or manager. Ezra provides the intelligence, not automated schedule creation."
        }
      },
      {
        "@type": "Question",
        "name": "What POS data does Ezra Scheduling use?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Ezra reads transaction volume data from your POS through approved API interfaces. This demand signal is used to build the scheduling intelligence layer."
        }
      },
      {
        "@type": "Question",
        "name": "Can Ezra detect when a specific employee is approaching overtime?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. OT exposure is tracked by location, shift, and team member, with alerts surfaced when an individual is trending toward overtime within the current pay period."
        }
      },
      {
        "@type": "Question",
        "name": "Is Ezra Scheduling live today?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. Ezra Scheduling (Module 03) is live in production on Zenoti, actively deployed across 110+ stores."
        }
      },
      {
        "@type": "Question",
        "name": "How long does it take for Ezra to learn my demand patterns?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Ezra builds demand baselines from historical POS data available at integration. The more historical data available, the more accurate the initial demand model."
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
        "name": "AI Employee Scheduling That Reshapes Labor Before It Costs You",
        "item": "https://meetezra.bot/seo/ai-employee-scheduling-for-franchises"
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
            <li aria-current="page">AI Employee Scheduling That Reshapes Labor Before It Costs You</li>
          </ol>
        </nav>
        <header>
          <h1>AI Employee Scheduling That Reshapes Labor Before It Costs You</h1>
          <p>AI employee scheduling for franchises isn't about replacing the manager who builds the schedule. It's about giving that manager demand intelligence they don't currently have—so the schedule reflects actual traffic patterns instead of last week's habits.</p>
        </header>
        <article>
        <section>
          <h2>How AI Changes the Scheduling Process</h2>
          <p>Traditional franchise scheduling is manual and backward-looking—built on last week's schedule and adjusted for known events. AI scheduling is forward-looking—built on demand signals from your POS, adjusted for the traffic patterns that have actually been observed over the trailing period. The result is a schedule that's matched to demand, not habit.</p>
        </section>

        <section>
          <h2>Demand Pattern Recognition Across Multiple Locations</h2>
          <p>A 5-location franchise has 5 demand curves that don't necessarily track together. Tuesday afternoons might be slow at location 2 and busy at location 4. Ezra Scheduling reads each location's demand independently and surfaces scheduling recommendations at the location level, not as a network average.</p>
        </section>

        <section>
          <h2>The Three Metrics That Drive Scheduling Decisions</h2>
          <p>Ezra tracks Sales Revenue Per Hour (SRPH), idle time percentage, and overtime exposure by location, shift, and team member. SRPH identifies revenue productivity. Idle time flags overstaffing. OT exposure prevents payroll surprises. These three metrics give managers everything they need to make scheduling decisions in one view.</p>
        </section>

        <section>
          <h2>Mid-Week Schedule Reshape</h2>
          <p>One of the highest-value use cases for AI scheduling is the mid-week reshape. When Ezra detects that a location is trending toward significant idle time for the rest of the week based on demand signals, managers can adjust—reducing staffing during predicted slow periods or redistributing hours to higher-demand windows—before the labor cost is locked in.</p>
        </section>

        <section>
          <h2>Scheduling Connected to the Full Operating Layer</h2>
          <p>Scheduling intelligence is most valuable when connected to revenue data. When SRPH drops, is it a scheduling problem (too many staff) or a revenue problem (too few customers)? Ezra connects scheduling data with sales intelligence so operators can diagnose the cause and apply the right fix.</p>
        </section>
        </article>
        <section aria-label="Frequently Asked Questions">
          <h2>Frequently Asked Questions</h2>
          <dl>
          <div className="faq-item">
            <dt>Does Ezra create schedules automatically?</dt>
            <dd>Ezra surfaces demand intelligence and flags misalignment between current schedules and actual demand. The scheduling decision remains with the operator or manager. Ezra provides the intelligence, not automated schedule creation.</dd>
          </div>

          <div className="faq-item">
            <dt>What POS data does Ezra Scheduling use?</dt>
            <dd>Ezra reads transaction volume data from your POS through approved API interfaces. This demand signal is used to build the scheduling intelligence layer.</dd>
          </div>

          <div className="faq-item">
            <dt>Can Ezra detect when a specific employee is approaching overtime?</dt>
            <dd>Yes. OT exposure is tracked by location, shift, and team member, with alerts surfaced when an individual is trending toward overtime within the current pay period.</dd>
          </div>

          <div className="faq-item">
            <dt>Is Ezra Scheduling live today?</dt>
            <dd>Yes. Ezra Scheduling (Module 03) is live in production on Zenoti, actively deployed across 110+ stores.</dd>
          </div>

          <div className="faq-item">
            <dt>How long does it take for Ezra to learn my demand patterns?</dt>
            <dd>Ezra builds demand baselines from historical POS data available at integration. The more historical data available, the more accurate the initial demand model.</dd>
          </div>
          </dl>
        </section>
        <nav aria-label="Related solutions">
          <h2>Related Solutions</h2>
          <ul>
            <li><Link href="/seo/employee-scheduling-franchise-software">Employee Scheduling Franchise Software</Link></li>
            <li><Link href="/seo/save-money-franchise-operations">Save Money Franchise Operations</Link></li>
            <li><Link href="/seo/multi-unit-business-software">Multi Unit Business Software</Link></li>
          </ul>
        </nav>
        <section aria-label="Call to action">
          <h2>See What Your Demand Curve Actually Looks Like</h2>
          <p>Ezra Scheduling is live today. Let us show you where your schedules are misaligned with actual demand.</p>
          <a href="https://meetezra.bot" rel="noopener noreferrer">See Ezra in Action</a>
          <a href="mailto:onboarding@meetezra.bot">Talk to the team →</a>
        </section>
      </main>
    </>
  );
}
