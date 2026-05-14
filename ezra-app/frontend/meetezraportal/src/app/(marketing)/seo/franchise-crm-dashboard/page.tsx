import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";

const BASE_URL = "https://meetezra.bot";

export const metadata: Metadata = {
  title: "Franchise CRM Dashboard & Retention Software | Ezra",
  description: "Identify at-risk guests, automate SMS retention sequences, and track recovered revenue across every franchise location—all from one screen.",
  alternates: { canonical: `${BASE_URL}/seo/franchise-crm-dashboard` },
  openGraph: {
    title: "Franchise CRM Dashboard & Retention Software | Ezra",
    description: "Identify at-risk guests, automate SMS retention sequences, and track recovered revenue across every franchise location—all from one screen.",
    url: `${BASE_URL}/franchise-crm-dashboard`,
    siteName: "Ezra — Franchise Intelligence Platform",
    images: [{ url: `${BASE_URL}/og/franchise-crm-dashboard.png`, width: 1200, height: 630, alt: "Franchise CRM Dashboard That Brings Customers Back" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Franchise CRM Dashboard & Retention Software | Ezra",
    description: "Identify at-risk guests, automate SMS retention sequences, and track recovered revenue across every franchise location—all from one screen.",
    images: [`${BASE_URL}/og/franchise-crm-dashboard.png`],
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Ezra Franchise Intelligence Platform",
    "description": "Identify at-risk guests, automate SMS retention sequences, and track recovered revenue across every franchise location—all from one screen.",
    "url": "https://meetezra.bot/seo/franchise-crm-dashboard",
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
        "name": "Does Ezra handle TCPA compliance for SMS campaigns?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. Ezra uses dual-checkbox consent capture and honors unsubscribe requests across all sequences. The SMS infrastructure runs on Twilio's A2P 10DLC framework, with use-case registration finalized for franchise marketing communications."
        }
      },
      {
        "@type": "Question",
        "name": "How does Ezra know which guests are at risk?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Ezra tracks guest visit frequency using data from your POS and CRM systems. Guests whose visit frequency has dropped below defined thresholds are automatically segmented into at-risk or lapsed categories and enrolled in the appropriate retention sequence."
        }
      },
      {
        "@type": "Question",
        "name": "Can I customize the SMS content for each segment?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. The messaging, timing, and offer for each segment are configurable. Ezra provides the segmentation and delivery infrastructure; operators control the content and offers."
        }
      },
      {
        "@type": "Question",
        "name": "How is recovered revenue measured?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Ezra tracks guest return visits following a retention campaign and attributes revenue from those visits to the campaign. Reply rate, recovered revenue per segment, and ROI per campaign are core measurement outputs."
        }
      },
      {
        "@type": "Question",
        "name": "Is the email channel also supported?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Ezra Exponential is currently SMS-first, delivered via Twilio A2P 10DLC. The architecture is email-ready, with email sequences planned for a future module release."
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
        "name": "Franchise CRM Dashboard That Brings Customers Back",
        "item": "https://meetezra.bot/seo/franchise-crm-dashboard"
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
            <li aria-current="page">Franchise CRM Dashboard That Brings Customers Back</li>
          </ol>
        </nav>

        {/* Hero */}
        <header>
          <h1>Franchise CRM Dashboard That Brings Customers Back</h1>
          <p>Guest attrition is silent. A customer who visited every month for a year quietly stops coming—and most franchise operators never notice until the seat is empty for the fourth week in a row. By then, the guest has found a competitor. Ezra Exponential identifies at-risk and lapsed guests by visit frequency, automates the SMS sequences that bring them back, and measures the recovered revenue from every campaign.</p>
        </header>

        {/* Body */}
        <article>
        <section>
          <h2>The Guest Attrition Problem Multi-Unit Operators Don't See</h2>
          <p>Individual location managers often know their regulars by name—but they don't have visibility into the network-wide pattern of who is becoming less frequent. A guest who visits every 4 weeks dropping to every 8 weeks is a warning sign. A guest who hasn't visited in 12 weeks is likely gone. Without systematic visit-frequency tracking across every location, these signals are invisible until the revenue impact is already compounding.</p>
        </section>

        <section>
          <h2>How Ezra Exponential Segments Guest Risk</h2>
          <p>Ezra Exponential segments guests by visit frequency: 4-week at-risk, 6-week at-risk, 8-week or more lapsed, VIP early-access, and new-customer welcome sequences. Each segment triggers a different retention sequence, delivered via TCPA-compliant SMS through Twilio's A2P 10DLC infrastructure. The message, timing, and offer are tailored to where the guest is in their attrition trajectory.</p>
        </section>

        <section>
          <h2>TCPA-Compliant SMS at Franchise Scale</h2>
          <p>SMS compliance is not an afterthought in Ezra. The platform uses dual-checkbox consent capture, honors unsubscribe requests across all sequences, and operates on Twilio's A2P 10DLC framework—with use-case registration finalized for franchise marketing communications. Operators can run retention campaigns without compliance exposure.</p>
        </section>

        <section>
          <h2>Measuring Recovered Revenue Per Campaign</h2>
          <p>Every campaign in Ezra Exponential tracks reply rate, recovered revenue per segment, and ROI per campaign. Operators can see not just how many customers came back, but how much revenue was recovered from the at-risk and lapsed cohorts. This transforms retention from a feel-good activity into a measurable operating lever.</p>
        </section>

        <section>
          <h2>CRM Built Into the Operating Layer</h2>
          <p>Ezra Exponential is one of five modules in the Ezra operating platform. When combined with sales intelligence, loss prevention, inventory, and scheduling data, operators have a complete picture of what's driving—and draining—performance across the network. CRM that exists in isolation from operational data is less effective than CRM that can see when a specific location's guest attrition is coinciding with a staffing issue or a service mix change.</p>
        </section>
        </article>

        {/* FAQ */}
        <section aria-label="Frequently Asked Questions">
          <h2>Frequently Asked Questions</h2>
          <dl>
          <div className="faq-item">
            <dt>Does Ezra handle TCPA compliance for SMS campaigns?</dt>
            <dd>Yes. Ezra uses dual-checkbox consent capture and honors unsubscribe requests across all sequences. The SMS infrastructure runs on Twilio's A2P 10DLC framework, with use-case registration finalized for franchise marketing communications.</dd>
          </div>

          <div className="faq-item">
            <dt>How does Ezra know which guests are at risk?</dt>
            <dd>Ezra tracks guest visit frequency using data from your POS and CRM systems. Guests whose visit frequency has dropped below defined thresholds are automatically segmented into at-risk or lapsed categories and enrolled in the appropriate retention sequence.</dd>
          </div>

          <div className="faq-item">
            <dt>Can I customize the SMS content for each segment?</dt>
            <dd>Yes. The messaging, timing, and offer for each segment are configurable. Ezra provides the segmentation and delivery infrastructure; operators control the content and offers.</dd>
          </div>

          <div className="faq-item">
            <dt>How is recovered revenue measured?</dt>
            <dd>Ezra tracks guest return visits following a retention campaign and attributes revenue from those visits to the campaign. Reply rate, recovered revenue per segment, and ROI per campaign are core measurement outputs.</dd>
          </div>

          <div className="faq-item">
            <dt>Is the email channel also supported?</dt>
            <dd>Ezra Exponential is currently SMS-first, delivered via Twilio A2P 10DLC. The architecture is email-ready, with email sequences planned for a future module release.</dd>
          </div>
          </dl>
        </section>

        {/* Related pages */}
        <nav aria-label="Related solutions">
          <h2>Related Solutions</h2>
          <ul>
            <li><Link href="/seo/multi-unit-sales-dashboard">Multi Unit Sales Dashboard</Link></li>
            <li><Link href="/seo/franchise-automation-software">Franchise Automation Software</Link></li>
            <li><Link href="/seo/save-money-franchise-operations">Save Money Franchise Operations</Link></li>
          </ul>
        </nav>

        {/* CTA */}
        <section aria-label="Call to action">
          <h2>Stop Losing the Customers You Don't Know You're Losing</h2>
          <p>Ezra Exponential is live today and onboarding select operators. Let us show you which guests are at risk in your network right now.</p>
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
