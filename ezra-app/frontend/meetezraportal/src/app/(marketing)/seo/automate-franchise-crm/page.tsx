import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";

const BASE_URL = "https://meetezra.bot";

export const metadata: Metadata = {
  title: "Automate Franchise CRM & Customer Retention | Ezra",
  description: "Automated SMS sequences triggered by visit-frequency drop-off. Ezra identifies lapsed guests and brings them back—without a marketing team.",
  alternates: { canonical: `${BASE_URL}/seo/automate-franchise-crm` },
  openGraph: {
    title: "Automate Franchise CRM & Customer Retention | Ezra",
    description: "Automated SMS sequences triggered by visit-frequency drop-off. Ezra identifies lapsed guests and brings them back—without a marketing team.",
    url: `${BASE_URL}/automate-franchise-crm`,
    siteName: "Ezra — Franchise Intelligence Platform",
    images: [{ url: `${BASE_URL}/og/automate-franchise-crm.png`, width: 1200, height: 630, alt: "Automate Customer Retention Across Your Franchise Locations" }],
    type: "website",
  },
  twitter: { card: "summary_large_image", title: "Automate Franchise CRM & Customer Retention | Ezra", description: "Automated SMS sequences triggered by visit-frequency drop-off. Ezra identifies lapsed guests and brings them back—without a marketing team.", images: [`${BASE_URL}/og/automate-franchise-crm.png`] },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Ezra Franchise Intelligence Platform",
    "description": "Automated SMS sequences triggered by visit-frequency drop-off. Ezra identifies lapsed guests and brings them back—without a marketing team.",
    "url": "https://meetezra.bot/seo/automate-franchise-crm",
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
        "name": "How does Ezra know which customers are at risk of churning?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Ezra tracks guest visit frequency using data from your POS and CRM. When a guest's visit interval extends beyond defined thresholds, they are automatically segmented into the appropriate at-risk or lapsed category."
        }
      },
      {
        "@type": "Question",
        "name": "Can I customize the SMS messages for each retention segment?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. Message content, timing, and offers are configurable per segment. Ezra provides the segmentation, automation, and delivery infrastructure; operators control the content."
        }
      },
      {
        "@type": "Question",
        "name": "Does Ezra handle opt-outs and unsubscribes?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. Unsubscribe requests are honored automatically across all sequences. Ezra uses dual-checkbox consent capture and TCPA-compliant infrastructure throughout."
        }
      },
      {
        "@type": "Question",
        "name": "How is ROI measured for retention campaigns?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Ezra tracks guest return visits following a retention campaign and attributes revenue from those visits to the campaign. Reply rate, recovered revenue per segment, and ROI per campaign are standard output metrics."
        }
      },
      {
        "@type": "Question",
        "name": "Is email also supported in addition to SMS?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Ezra Exponential is currently SMS-first. The architecture is email-ready, with email sequences planned for a future module update."
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
        "name": "Automate Customer Retention Across Your Franchise Locations",
        "item": "https://meetezra.bot/seo/automate-franchise-crm"
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
            <li aria-current="page">Automate Customer Retention Across Your Franchise Locations</li>
          </ol>
        </nav>
        <header>
          <h1>Automate Customer Retention Across Your Franchise Locations</h1>
          <p>Most franchise operators know customer retention matters. Few have the infrastructure to run it systematically. Ezra Exponential automates the entire retention process—identifying at-risk guests by visit frequency, triggering personalized SMS sequences, and measuring recovered revenue—without a marketing team or a manual campaign calendar.</p>
        </header>
        <article>
        <section>
          <h2>The Retention Gap in Multi-Unit Franchises</h2>
          <p>Individual location managers often recognize when a regular customer stops coming in—but they rarely have a systematic way to act on it, and they definitely can't track it across every location in the network simultaneously. Ezra does. Visit frequency segmentation runs continuously across all locations, flagging at-risk and lapsed guests automatically as their visit intervals cross defined thresholds.</p>
        </section>

        <section>
          <h2>Automated Sequences, Not Manual Campaigns</h2>
          <p>Traditional CRM requires someone to build a campaign, define a target list, write the message, schedule the send, and track the results. Ezra Exponential automates every step. The trigger is the guest's visit frequency. The sequence is pre-configured by segment. The delivery is automated through Twilio's A2P 10DLC infrastructure. The tracking happens automatically.</p>
        </section>

        <section>
          <h2>Five Retention Segments</h2>
          <p>Ezra Exponential runs five retention sequences: 4-week at-risk (guest visit interval has extended from their normal), 6-week at-risk (further attrition signal), 8-week or more lapsed (strong churn signal), VIP early-access (reward high-frequency guests), and new-customer welcome (convert first-time visitors into repeat guests).</p>
        </section>

        <section>
          <h2>TCPA-Compliant From Day One</h2>
          <p>SMS marketing compliance is not optional. Ezra's retention infrastructure uses dual-checkbox consent capture, honors unsubscribe requests across all sequences, and operates on Twilio's A2P 10DLC framework with use-case registration finalized for franchise marketing communications.</p>
        </section>

        <section>
          <h2>Measuring Recovered Revenue Per Segment</h2>
          <p>Every retention campaign in Ezra tracks three metrics: reply rate, recovered revenue per segment, and ROI per campaign. This transforms retention from a cost center into a measurable revenue recovery operation with a visible ROI.</p>
        </section>
        </article>
        <section aria-label="Frequently Asked Questions">
          <h2>Frequently Asked Questions</h2>
          <dl>
          <div className="faq-item">
            <dt>How does Ezra know which customers are at risk of churning?</dt>
            <dd>Ezra tracks guest visit frequency using data from your POS and CRM. When a guest's visit interval extends beyond defined thresholds, they are automatically segmented into the appropriate at-risk or lapsed category.</dd>
          </div>

          <div className="faq-item">
            <dt>Can I customize the SMS messages for each retention segment?</dt>
            <dd>Yes. Message content, timing, and offers are configurable per segment. Ezra provides the segmentation, automation, and delivery infrastructure; operators control the content.</dd>
          </div>

          <div className="faq-item">
            <dt>Does Ezra handle opt-outs and unsubscribes?</dt>
            <dd>Yes. Unsubscribe requests are honored automatically across all sequences. Ezra uses dual-checkbox consent capture and TCPA-compliant infrastructure throughout.</dd>
          </div>

          <div className="faq-item">
            <dt>How is ROI measured for retention campaigns?</dt>
            <dd>Ezra tracks guest return visits following a retention campaign and attributes revenue from those visits to the campaign. Reply rate, recovered revenue per segment, and ROI per campaign are standard output metrics.</dd>
          </div>

          <div className="faq-item">
            <dt>Is email also supported in addition to SMS?</dt>
            <dd>Ezra Exponential is currently SMS-first. The architecture is email-ready, with email sequences planned for a future module update.</dd>
          </div>
          </dl>
        </section>
        <nav aria-label="Related solutions">
          <h2>Related Solutions</h2>
          <ul>
            <li><Link href="/seo/franchise-crm-dashboard">Franchise Crm Dashboard</Link></li>
            <li><Link href="/seo/franchise-automation-software">Franchise Automation Software</Link></li>
            <li><Link href="/seo/multi-unit-sales-dashboard">Multi Unit Sales Dashboard</Link></li>
          </ul>
        </nav>
        <section aria-label="Call to action">
          <h2>Start Recovering the Revenue From Customers Who Left</h2>
          <p>Ezra Exponential is live today. Let us show you which guest segments are at risk in your network right now.</p>
          <a href="https://meetezra.bot" rel="noopener noreferrer">See Ezra in Action</a>
          <a href="mailto:onboarding@meetezra.bot">Talk to the team →</a>
        </section>
      </main>
    </>
  );
}
