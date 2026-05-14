import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";

const BASE_URL = "https://meetezra.bot";

export const metadata: Metadata = {
  title: "Franchise Automation Software | Ezra AI Platform",
  description: "Automate loss detection, inventory alerts, scheduling optimization, and customer retention across every location—without replacing your existing systems.",
  alternates: { canonical: `${BASE_URL}/seo/franchise-automation-software` },
  openGraph: {
    title: "Franchise Automation Software | Ezra AI Platform",
    description: "Automate loss detection, inventory alerts, scheduling optimization, and customer retention across every location—without replacing your existing systems.",
    url: `${BASE_URL}/franchise-automation-software`,
    siteName: "Ezra — Franchise Intelligence Platform",
    images: [{ url: `${BASE_URL}/og/franchise-automation-software.png`, width: 1200, height: 630, alt: "Automate Franchise Operations Without Ripping Out Your Stack" }],
    type: "website",
  },
  twitter: { card: "summary_large_image", title: "Franchise Automation Software | Ezra AI Platform", description: "Automate loss detection, inventory alerts, scheduling optimization, and customer retention across every location—without replacing your existing systems.", images: [`${BASE_URL}/og/franchise-automation-software.png`] },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Ezra Franchise Intelligence Platform",
    "description": "Automate loss detection, inventory alerts, scheduling optimization, and customer retention across every location—without replacing your existing systems.",
    "url": "https://meetezra.bot/seo/franchise-automation-software",
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
        "name": "Does Ezra automate scheduling decisions?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Ezra automates the detection of scheduling gaps and overstaffing—surfacing the intelligence that informs a scheduling decision. The scheduling action remains with the operator or manager."
        }
      },
      {
        "@type": "Question",
        "name": "Does Ezra send automated alerts?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. Anomaly flags, inventory exceptions, and scheduling alerts are surfaced automatically when thresholds are exceeded. No manual report-pulling required."
        }
      },
      {
        "@type": "Question",
        "name": "Can I control which automations are active?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. Every module and every threshold is configurable. Operators can activate, deactivate, and adjust any automation in Ezra."
        }
      },
      {
        "@type": "Question",
        "name": "Does automation require any changes to my existing software?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No. Ezra reads from your existing systems through approved API interfaces. No changes to your POS, scheduling system, or CRM are required."
        }
      },
      {
        "@type": "Question",
        "name": "How do I get started with franchise automation through Ezra?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Contact onboarding@meetezra.bot. Operators provision a dedicated credential for Ezra in their source POS, and the platform begins running within days—not months."
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
        "name": "Automate Franchise Operations Without Ripping Out Your Stack",
        "item": "https://meetezra.bot/seo/franchise-automation-software"
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
            <li aria-current="page">Automate Franchise Operations Without Ripping Out Your Stack</li>
          </ol>
        </nav>
        <header>
          <h1>Automate Franchise Operations Without Ripping Out Your Stack</h1>
          <p>Franchise automation doesn't mean replacing your POS, your scheduling software, or your CRM. It means adding an intelligence layer that reads from those systems, applies operator-validated logic, and automates the detection, alerts, and sequences that your team would otherwise have to run manually—if they ran them at all.</p>
        </header>
        <article>
        <section>
          <h2>What Ezra Automates</h2>
          <p>Ezra automates five operating functions: loss prevention anomaly detection, inventory exception alerts, scheduling gap identification, guest retention SMS sequences, and real-time sales monitoring. Each function runs continuously in the background, surfacing results when action is needed rather than requiring a human to pull a report.</p>
        </section>

        <section>
          <h2>Automation That Works With Your Existing Stack</h2>
          <p>Ezra is POS-agnostic by design. It reads from Zenoti today and is actively building Square and Toast integrations. No migration. No new systems to learn. The automation layer sits on top of what you already use.</p>
        </section>

        <section>
          <h2>Configurable, Not Prescriptive</h2>
          <p>Every threshold, benchmark, and segment rule in Ezra is configurable per franchisee. Automation that generates noise destroys operator trust. Ezra's thresholds are operator-validated to ensure that alerts are actionable—not a flood of irrelevant flags.</p>
        </section>

        <section>
          <h2>Read, Don't Write</h2>
          <p>Ezra reads from operator systems through approved interfaces. It does not write back to your POS, scheduling system, or CRM. Mutations happen through the operator's own workflow. This architectural principle means Ezra can never create a problem in your source systems.</p>
        </section>

        <section>
          <h2>From Five Reports to One Operating Layer</h2>
          <p>Before Ezra, a multi-unit operator reviewing their business required pulling separate reports from their POS, scheduling system, CRM, and accounting platform. Ezra consolidates the intelligence from all of those systems into one unified interface—so the review that used to take an hour takes fifteen minutes.</p>
        </section>
        </article>
        <section aria-label="Frequently Asked Questions">
          <h2>Frequently Asked Questions</h2>
          <dl>
          <div className="faq-item">
            <dt>Does Ezra automate scheduling decisions?</dt>
            <dd>Ezra automates the detection of scheduling gaps and overstaffing—surfacing the intelligence that informs a scheduling decision. The scheduling action remains with the operator or manager.</dd>
          </div>

          <div className="faq-item">
            <dt>Does Ezra send automated alerts?</dt>
            <dd>Yes. Anomaly flags, inventory exceptions, and scheduling alerts are surfaced automatically when thresholds are exceeded. No manual report-pulling required.</dd>
          </div>

          <div className="faq-item">
            <dt>Can I control which automations are active?</dt>
            <dd>Yes. Every module and every threshold is configurable. Operators can activate, deactivate, and adjust any automation in Ezra.</dd>
          </div>

          <div className="faq-item">
            <dt>Does automation require any changes to my existing software?</dt>
            <dd>No. Ezra reads from your existing systems through approved API interfaces. No changes to your POS, scheduling system, or CRM are required.</dd>
          </div>

          <div className="faq-item">
            <dt>How do I get started with franchise automation through Ezra?</dt>
            <dd>Contact onboarding@meetezra.bot. Operators provision a dedicated credential for Ezra in their source POS, and the platform begins running within days—not months.</dd>
          </div>
          </dl>
        </section>
        <nav aria-label="Related solutions">
          <h2>Related Solutions</h2>
          <ul>
            <li><Link href="/seo/multi-unit-business-software">Multi Unit Business Software</Link></li>
            <li><Link href="/seo/save-money-franchise-operations">Save Money Franchise Operations</Link></li>
            <li><Link href="/seo/employee-scheduling-franchise-software">Employee Scheduling Franchise Software</Link></li>
          </ul>
        </nav>
        <section aria-label="Call to action">
          <h2>Automate the Operating Reviews Your Team Isn't Running</h2>
          <p>Ezra is live today and onboarding select operators. No rip-and-replace. No six-month deployment.</p>
          <a href="https://meetezra.bot" rel="noopener noreferrer">See Ezra in Action</a>
          <a href="mailto:onboarding@meetezra.bot">Talk to the team →</a>
        </section>
      </main>
    </>
  );
}
