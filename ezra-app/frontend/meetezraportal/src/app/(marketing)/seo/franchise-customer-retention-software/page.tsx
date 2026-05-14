import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";

const BASE_URL = "https://meetezra.bot";

export const metadata: Metadata = {
  title: "Franchise Customer Retention Software | Ezra",
  description: "Automated SMS sequences that identify and recover lapsed guests—segmented by visit frequency and delivered via TCPA-compliant infrastructure.",
  alternates: { canonical: `${BASE_URL}/seo/franchise-customer-retention-software` },
  openGraph: {
    title: "Franchise Customer Retention Software | Ezra",
    description: "Automated SMS sequences that identify and recover lapsed guests—segmented by visit frequency and delivered via TCPA-compliant infrastructure.",
    url: `${BASE_URL}/franchise-customer-retention-software`,
    siteName: "Ezra — Franchise Intelligence Platform",
    images: [{ url: `${BASE_URL}/og/franchise-customer-retention-software.png`, width: 1200, height: 630, alt: "Bring Back Lapsed Customers Across Your Franchise Network" }],
    type: "website",
  },
  twitter: { card: "summary_large_image", title: "Franchise Customer Retention Software | Ezra", description: "Automated SMS sequences that identify and recover lapsed guests—segmented by visit frequency and delivered via TCPA-compliant infrastructure.", images: [`${BASE_URL}/og/franchise-customer-retention-software.png`] },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Ezra Franchise Intelligence Platform",
    "description": "Automated SMS sequences that identify and recover lapsed guests—segmented by visit frequency and delivered via TCPA-compliant infrastructure.",
    "url": "https://meetezra.bot/seo/franchise-customer-retention-software",
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
        "name": "How does Ezra know which customers are lapsed?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Ezra tracks guest visit frequency using POS data. When a guest's visit interval extends beyond defined thresholds, they are automatically segmented into the appropriate retention cohort."
        }
      },
      {
        "@type": "Question",
        "name": "Can I target lapsed customers at specific locations?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. Ezra Exponential operates at the location level, with network-level visibility. Retention sequences can be managed at the location or network level depending on operator preference."
        }
      },
      {
        "@type": "Question",
        "name": "What is the typical recovery rate for lapsed customer sequences?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Recovery rates vary by industry, offer quality, and guest relationship strength. Ezra tracks recovered revenue per segment, giving operators a precise measurement of what their specific sequences are recovering."
        }
      },
      {
        "@type": "Question",
        "name": "Does Ezra handle TCPA compliance?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. Dual-checkbox consent capture, unsubscribe handling, and A2P 10DLC infrastructure are all built into Ezra Exponential."
        }
      },
      {
        "@type": "Question",
        "name": "Is Ezra Exponential available today?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. Ezra Exponential (Module 04) is live in production on Zenoti today."
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
        "name": "Bring Back Lapsed Customers Across Your Franchise Network",
        "item": "https://meetezra.bot/seo/franchise-customer-retention-software"
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
            <li aria-current="page">Bring Back Lapsed Customers Across Your Franchise Network</li>
          </ol>
        </nav>
        <header>
          <h1>Bring Back Lapsed Customers Across Your Franchise Network</h1>
          <p>Lapsed customers are the highest-ROI acquisition target in franchise operations. They already know your brand, have visited your locations, and have demonstrated willingness to spend. The only thing that stands between them and a return visit is the right message at the right moment. Ezra Exponential delivers that message automatically—across every location, for every lapsed guest segment.</p>
        </header>
        <article>
        <section>
          <h2>Why Lapsed Customer Recovery Outperforms Acquisition</h2>
          <p>Industry research consistently shows that recovering a lapsed customer costs significantly less than acquiring a new one. Lapsed customers require no awareness building, no trust establishment, and no first-visit conversion. They require a reason to return and a channel to reach them. Ezra provides both—automatically.</p>
        </section>

        <section>
          <h2>Visit-Frequency Segmentation at Scale</h2>
          <p>Ezra Exponential runs visit-frequency segmentation continuously across every location in the network. Guests whose visit intervals have extended beyond defined thresholds are automatically identified and enrolled in the appropriate retention sequence—without manual list building or segment identification.</p>
        </section>

        <section>
          <h2>Three Lapsed Guest Segments</h2>
          <p>Ezra identifies three at-risk and lapsed guest cohorts: 4-week at-risk (visit interval extending from normal), 6-week at-risk (further attrition signal), and 8-week or more lapsed (strong churn signal). Each cohort receives a different retention message with a different urgency and offer structure.</p>
        </section>

        <section>
          <h2>TCPA-Compliant SMS Infrastructure</h2>
          <p>SMS marketing compliance is essential. Ezra Exponential uses dual-checkbox consent capture, honors unsubscribe requests across all sequences, and operates on Twilio's A2P 10DLC framework with finalized use-case registration for franchise marketing communications.</p>
        </section>

        <section>
          <h2>Measuring Retention ROI</h2>
          <p>Every retention campaign in Ezra tracks reply rate, recovered revenue per segment, and campaign ROI. This measurement infrastructure transforms customer retention from a qualitative activity into a quantitative operating lever with a visible return.</p>
        </section>
        </article>
        <section aria-label="Frequently Asked Questions">
          <h2>Frequently Asked Questions</h2>
          <dl>
          <div className="faq-item">
            <dt>How does Ezra know which customers are lapsed?</dt>
            <dd>Ezra tracks guest visit frequency using POS data. When a guest's visit interval extends beyond defined thresholds, they are automatically segmented into the appropriate retention cohort.</dd>
          </div>

          <div className="faq-item">
            <dt>Can I target lapsed customers at specific locations?</dt>
            <dd>Yes. Ezra Exponential operates at the location level, with network-level visibility. Retention sequences can be managed at the location or network level depending on operator preference.</dd>
          </div>

          <div className="faq-item">
            <dt>What is the typical recovery rate for lapsed customer sequences?</dt>
            <dd>Recovery rates vary by industry, offer quality, and guest relationship strength. Ezra tracks recovered revenue per segment, giving operators a precise measurement of what their specific sequences are recovering.</dd>
          </div>

          <div className="faq-item">
            <dt>Does Ezra handle TCPA compliance?</dt>
            <dd>Yes. Dual-checkbox consent capture, unsubscribe handling, and A2P 10DLC infrastructure are all built into Ezra Exponential.</dd>
          </div>

          <div className="faq-item">
            <dt>Is Ezra Exponential available today?</dt>
            <dd>Yes. Ezra Exponential (Module 04) is live in production on Zenoti today.</dd>
          </div>
          </dl>
        </section>
        <nav aria-label="Related solutions">
          <h2>Related Solutions</h2>
          <ul>
            <li><Link href="/seo/automate-franchise-crm">Automate Franchise Crm</Link></li>
            <li><Link href="/seo/ai-crm-for-franchises">Ai Crm For Franchises</Link></li>
            <li><Link href="/seo/franchise-crm-dashboard">Franchise Crm Dashboard</Link></li>
          </ul>
        </nav>
        <section aria-label="Call to action">
          <h2>Start Recovering the Guests You Didn't Know You'd Lost</h2>
          <p>Ezra Exponential is live today. Let us show you the lapsed guest segment in your network right now.</p>
          <a href="https://meetezra.bot" rel="noopener noreferrer">See Ezra in Action</a>
          <a href="mailto:onboarding@meetezra.bot">Talk to the team →</a>
        </section>
      </main>
    </>
  );
}
