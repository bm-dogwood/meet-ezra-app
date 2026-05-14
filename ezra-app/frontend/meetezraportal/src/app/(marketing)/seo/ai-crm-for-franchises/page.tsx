import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";

const BASE_URL = "https://meetezra.bot";

export const metadata: Metadata = {
  title: "AI CRM for Franchise Operators | Ezra Platform",
  description: "Automated retention triggered by guest visit frequency. Ezra's AI CRM identifies at-risk customers and runs the SMS sequences that bring them back.",
  alternates: { canonical: `${BASE_URL}/seo/ai-crm-for-franchises` },
  openGraph: {
    title: "AI CRM for Franchise Operators | Ezra Platform",
    description: "Automated retention triggered by guest visit frequency. Ezra's AI CRM identifies at-risk customers and runs the SMS sequences that bring them back.",
    url: `${BASE_URL}/ai-crm-for-franchises`,
    siteName: "Ezra — Franchise Intelligence Platform",
    images: [{ url: `${BASE_URL}/og/ai-crm-for-franchises.png`, width: 1200, height: 630, alt: "AI-Powered CRM for Franchise Customer Retention" }],
    type: "website",
  },
  twitter: { card: "summary_large_image", title: "AI CRM for Franchise Operators | Ezra Platform", description: "Automated retention triggered by guest visit frequency. Ezra's AI CRM identifies at-risk customers and runs the SMS sequences that bring them back.", images: [`${BASE_URL}/og/ai-crm-for-franchises.png`] },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Ezra Franchise Intelligence Platform",
    "description": "Automated retention triggered by guest visit frequency. Ezra's AI CRM identifies at-risk customers and runs the SMS sequences that bring them back.",
    "url": "https://meetezra.bot/seo/ai-crm-for-franchises",
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
        "name": "Does Ezra AI CRM require a dedicated marketing team to manage?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No. The segmentation, sequencing, and delivery are automated. Operators configure the message content and offers per segment; the automation handles the rest."
        }
      },
      {
        "@type": "Question",
        "name": "How does Ezra know a guest's 'normal' visit frequency?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Ezra establishes a baseline visit frequency for each guest using historical visit data from your POS. Deviations from that baseline trigger the appropriate retention sequence."
        }
      },
      {
        "@type": "Question",
        "name": "Is the AI writing the SMS messages?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No. Operators configure message content per segment. The AI drives the segmentation and timing logic—determining which guests receive which messages and when."
        }
      },
      {
        "@type": "Question",
        "name": "How long does it take to see results from retention campaigns?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "First results typically appear within the first campaign cycle (2–4 weeks after deployment). Recovered revenue attribution is visible in the platform as guests respond and return."
        }
      },
      {
        "@type": "Question",
        "name": "Is Ezra Exponential live today?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. Ezra Exponential (Module 04) is live in production on Zenoti."
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
        "name": "AI-Powered CRM for Franchise Customer Retention",
        "item": "https://meetezra.bot/seo/ai-crm-for-franchises"
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
            <li aria-current="page">AI-Powered CRM for Franchise Customer Retention</li>
          </ol>
        </nav>
        <header>
          <h1>AI-Powered CRM for Franchise Customer Retention</h1>
          <p>Traditional franchise CRM requires a marketing team to build campaigns, define segments, schedule sends, and track results. Ezra Exponential automates the entire process using AI-driven visit-frequency segmentation—identifying at-risk guests automatically and triggering the personalized SMS sequences that bring them back, without manual campaign management.</p>
        </header>
        <article>
        <section>
          <h2>Why AI Changes the CRM Equation for Franchises</h2>
          <p>AI CRM is not about chatbots or AI-written copy. It's about automating the identification of which customers are at risk, when to reach them, and which message fits their attrition trajectory—at a scale and consistency that no manual process achieves. Ezra Exponential uses visit-frequency data to drive these decisions automatically across every location in the network.</p>
        </section>

        <section>
          <h2>Visit-Frequency Segmentation</h2>
          <p>Ezra segments guests into five cohorts based on visit frequency deviation from their established pattern: 4-week at-risk, 6-week at-risk, 8-week or more lapsed, VIP early-access, and new-customer welcome. Each cohort has a different attrition signal and a different optimal retention approach.</p>
        </section>

        <section>
          <h2>Automated Sequence Delivery</h2>
          <p>Once a guest enters a segment, the appropriate retention sequence triggers automatically. Messages are delivered via TCPA-compliant SMS through Twilio's A2P 10DLC infrastructure. No manual campaign scheduling. No list exports. No manual sends.</p>
        </section>

        <section>
          <h2>Revenue Attribution That Makes Retention Measurable</h2>
          <p>Ezra tracks which guests return following a retention campaign and attributes their subsequent revenue to the campaign. Reply rate, recovered revenue per segment, and ROI per campaign are standard output metrics—making retention a measurable revenue operation rather than a feel-good marketing activity.</p>
        </section>

        <section>
          <h2>CRM Connected to Operational Context</h2>
          <p>Guest retention is most effective when CRM data is connected to operational data. A guest who stopped coming to a specific location during a period of staffing disruption may respond to a different retention approach than a guest who simply increased their visit interval. Ezra connects CRM with operational context across the full platform.</p>
        </section>
        </article>
        <section aria-label="Frequently Asked Questions">
          <h2>Frequently Asked Questions</h2>
          <dl>
          <div className="faq-item">
            <dt>Does Ezra AI CRM require a dedicated marketing team to manage?</dt>
            <dd>No. The segmentation, sequencing, and delivery are automated. Operators configure the message content and offers per segment; the automation handles the rest.</dd>
          </div>

          <div className="faq-item">
            <dt>How does Ezra know a guest's 'normal' visit frequency?</dt>
            <dd>Ezra establishes a baseline visit frequency for each guest using historical visit data from your POS. Deviations from that baseline trigger the appropriate retention sequence.</dd>
          </div>

          <div className="faq-item">
            <dt>Is the AI writing the SMS messages?</dt>
            <dd>No. Operators configure message content per segment. The AI drives the segmentation and timing logic—determining which guests receive which messages and when.</dd>
          </div>

          <div className="faq-item">
            <dt>How long does it take to see results from retention campaigns?</dt>
            <dd>First results typically appear within the first campaign cycle (2–4 weeks after deployment). Recovered revenue attribution is visible in the platform as guests respond and return.</dd>
          </div>

          <div className="faq-item">
            <dt>Is Ezra Exponential live today?</dt>
            <dd>Yes. Ezra Exponential (Module 04) is live in production on Zenoti.</dd>
          </div>
          </dl>
        </section>
        <nav aria-label="Related solutions">
          <h2>Related Solutions</h2>
          <ul>
            <li><Link href="/seo/automate-franchise-crm">Automate Franchise Crm</Link></li>
            <li><Link href="/seo/franchise-crm-dashboard">Franchise Crm Dashboard</Link></li>
            <li><Link href="/seo/franchise-automation-software">Franchise Automation Software</Link></li>
          </ul>
        </nav>
        <section aria-label="Call to action">
          <h2>Automate the Customer Recovery Your Team Isn't Running</h2>
          <p>Ezra Exponential is live today. Let us show you the at-risk segment in your guest base right now.</p>
          <a href="https://meetezra.bot" rel="noopener noreferrer">See Ezra in Action</a>
          <a href="mailto:onboarding@meetezra.bot">Talk to the team →</a>
        </section>
      </main>
    </>
  );
}
