import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";

const BASE_URL = "https://meetezra.bot";

export const metadata: Metadata = {
  title: "Automate Franchise Employee Scheduling | Ezra",
  description: "Stop building schedules on gut feel. Ezra reads your demand patterns and reshapes labor automatically—before idle hours become idle dollars.",
  alternates: { canonical: `${BASE_URL}/seo/automate-franchise-scheduling` },
  openGraph: {
    title: "Automate Franchise Employee Scheduling | Ezra",
    description: "Stop building schedules on gut feel. Ezra reads your demand patterns and reshapes labor automatically—before idle hours become idle dollars.",
    url: `${BASE_URL}/automate-franchise-scheduling`,
    siteName: "Ezra — Franchise Intelligence Platform",
    images: [{ url: `${BASE_URL}/og/automate-franchise-scheduling.png`, width: 1200, height: 630, alt: "Automate Employee Scheduling Across Your Franchise Locations" }],
    type: "website",
  },
  twitter: { card: "summary_large_image", title: "Automate Franchise Employee Scheduling | Ezra", description: "Stop building schedules on gut feel. Ezra reads your demand patterns and reshapes labor automatically—before idle hours become idle dollars.", images: [`${BASE_URL}/og/automate-franchise-scheduling.png`] },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Ezra Franchise Intelligence Platform",
    "description": "Stop building schedules on gut feel. Ezra reads your demand patterns and reshapes labor automatically—before idle hours become idle dollars.",
    "url": "https://meetezra.bot/seo/automate-franchise-scheduling",
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
        "name": "Does Ezra automatically create new schedules?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Ezra surfaces demand intelligence and scheduling misalignment. The decision to adjust the schedule remains with the manager. Ezra provides the intelligence; managers act on it."
        }
      },
      {
        "@type": "Question",
        "name": "How far in advance does scheduling automation work?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Ezra's demand-pattern model supports both future-week scheduling intelligence and mid-week real-time adjustment based on current-period demand tracking."
        }
      },
      {
        "@type": "Question",
        "name": "Can scheduling automation help with seasonal demand changes?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. Ezra's trailing-window demand model captures seasonal patterns over configurable periods, enabling proactive scheduling adjustments ahead of known seasonal demand shifts."
        }
      },
      {
        "@type": "Question",
        "name": "Is scheduling automation available for all franchise types?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Ezra Scheduling is live on Zenoti today, covering salon, personal services, and fitness franchises. Restaurant-specific scheduling automation becomes available when Square and Toast integrations launch in Q2 2026."
        }
      },
      {
        "@type": "Question",
        "name": "How does overtime automation work?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Ezra tracks each team member's scheduled and worked hours within the pay period and flags overtime exposure automatically when an individual is trending toward overtime."
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
        "name": "Automate Employee Scheduling Across Your Franchise Locations",
        "item": "https://meetezra.bot/seo/automate-franchise-scheduling"
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
            <li aria-current="page">Automate Employee Scheduling Across Your Franchise Locations</li>
          </ol>
        </nav>
        <header>
          <h1>Automate Employee Scheduling Across Your Franchise Locations</h1>
          <p>Scheduling automation for franchises isn't about removing the manager from the process. It's about removing the guesswork. Ezra reads demand patterns from your POS, identifies where current schedules are misaligned with actual traffic, and gives managers the data to reshape labor before slow hours become a labor cost instead of a revenue opportunity.</p>
        </header>
        <article>
        <section>
          <h2>The Problem With Manual Scheduling</h2>
          <p>Manual scheduling in franchise operations relies on manager memory, habit, and intuition. The result: schedules that reflect last week's assumptions, not this week's demand. Chronic overstaffing during predictable slow periods. Overtime accumulating because no one caught the trend mid-week. Ezra automates the detection of these patterns so managers can spend their time on decisions, not data collection.</p>
        </section>

        <section>
          <h2>Demand-Pattern Recognition</h2>
          <p>Ezra reads historical transaction volume from your POS and identifies demand patterns by hour, day of week, and trailing period. These patterns are compared against current schedules to identify misalignments—periods where staffing exceeds expected demand, and periods where it falls short.</p>
        </section>

        <section>
          <h2>Mid-Week Schedule Automation</h2>
          <p>The highest-value scheduling automation is mid-week. When Ezra detects that the current week's demand pattern is tracking below the schedule by a meaningful margin, the alert surfaces with enough lead time for managers to adjust staffing before the slow period locks in. Acting on Wednesday is worth more than reviewing it on Monday.</p>
        </section>

        <section>
          <h2>Overtime Exposure Alerts</h2>
          <p>Ezra Scheduling tracks each team member's hours in real time and flags overtime exposure as it accumulates within the pay period. Automated alerts give managers the opportunity to redistribute hours or adjust schedules before overtime is incurred—rather than finding out in the next payroll run.</p>
        </section>

        <section>
          <h2>Network-Level Scheduling Intelligence</h2>
          <p>Scheduling automation at the network level means not just optimizing one location, but identifying which locations have the most labor efficiency opportunity across the portfolio. Ezra's location ranking by SRPH and idle time gives regional managers the network view they need to prioritize scheduling interventions.</p>
        </section>
        </article>
        <section aria-label="Frequently Asked Questions">
          <h2>Frequently Asked Questions</h2>
          <dl>
          <div className="faq-item">
            <dt>Does Ezra automatically create new schedules?</dt>
            <dd>Ezra surfaces demand intelligence and scheduling misalignment. The decision to adjust the schedule remains with the manager. Ezra provides the intelligence; managers act on it.</dd>
          </div>

          <div className="faq-item">
            <dt>How far in advance does scheduling automation work?</dt>
            <dd>Ezra's demand-pattern model supports both future-week scheduling intelligence and mid-week real-time adjustment based on current-period demand tracking.</dd>
          </div>

          <div className="faq-item">
            <dt>Can scheduling automation help with seasonal demand changes?</dt>
            <dd>Yes. Ezra's trailing-window demand model captures seasonal patterns over configurable periods, enabling proactive scheduling adjustments ahead of known seasonal demand shifts.</dd>
          </div>

          <div className="faq-item">
            <dt>Is scheduling automation available for all franchise types?</dt>
            <dd>Ezra Scheduling is live on Zenoti today, covering salon, personal services, and fitness franchises. Restaurant-specific scheduling automation becomes available when Square and Toast integrations launch in Q2 2026.</dd>
          </div>

          <div className="faq-item">
            <dt>How does overtime automation work?</dt>
            <dd>Ezra tracks each team member's scheduled and worked hours within the pay period and flags overtime exposure automatically when an individual is trending toward overtime.</dd>
          </div>
          </dl>
        </section>
        <nav aria-label="Related solutions">
          <h2>Related Solutions</h2>
          <ul>
            <li><Link href="/seo/ai-employee-scheduling-for-franchises">Ai Employee Scheduling For Franchises</Link></li>
            <li><Link href="/seo/employee-scheduling-franchise-software">Employee Scheduling Franchise Software</Link></li>
            <li><Link href="/seo/franchise-labor-optimization">Franchise Labor Optimization</Link></li>
          </ul>
        </nav>
        <section aria-label="Call to action">
          <h2>Build Schedules From Demand Data, Not Last Week's Habits</h2>
          <p>Ezra Scheduling is live today. Let us show you where the scheduling gaps are in your network right now.</p>
          <a href="https://meetezra.bot" rel="noopener noreferrer">See Ezra in Action</a>
          <a href="mailto:onboarding@meetezra.bot">Talk to the team →</a>
        </section>
      </main>
    </>
  );
}
