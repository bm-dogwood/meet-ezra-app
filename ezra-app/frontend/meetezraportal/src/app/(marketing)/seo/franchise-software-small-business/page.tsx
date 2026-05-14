import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";

const BASE_URL = "https://meetezra.bot";

export const metadata: Metadata = {
  title: "Franchise Software for Small Business Operators | Ezra",
  description: "Enterprise-level operating intelligence, built for the operator running 3–20 locations. Ezra gives small franchise groups what the big brands already have.",
  alternates: { canonical: `${BASE_URL}/seo/franchise-software-small-business` },
  openGraph: {
    title: "Franchise Software for Small Business Operators | Ezra",
    description: "Enterprise-level operating intelligence, built for the operator running 3–20 locations. Ezra gives small franchise groups what the big brands already have.",
    url: `${BASE_URL}/franchise-software-small-business`,
    siteName: "Ezra — Franchise Intelligence Platform",
    images: [{ url: `${BASE_URL}/og/franchise-software-small-business.png`, width: 1200, height: 630, alt: "Enterprise Franchise Intelligence for Small Business Operators" }],
    type: "website",
  },
  twitter: { card: "summary_large_image", title: "Franchise Software for Small Business Operators | Ezra", description: "Enterprise-level operating intelligence, built for the operator running 3–20 locations. Ezra gives small franchise groups what the big brands already have.", images: [`${BASE_URL}/og/franchise-software-small-business.png`] },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Ezra Franchise Intelligence Platform",
    "description": "Enterprise-level operating intelligence, built for the operator running 3–20 locations. Ezra gives small franchise groups what the big brands already have.",
    "url": "https://meetezra.bot/seo/franchise-software-small-business",
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
        "name": "Is Ezra designed for small franchise operators or large enterprise groups?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Ezra is purpose-built for multi-unit operators across the full size range—from 3 locations to 110+ currently on the platform. The operating layer model is relevant regardless of portfolio size."
        }
      },
      {
        "@type": "Question",
        "name": "Do I need technical expertise to use Ezra?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No. Onboarding requires provisioning a dedicated credential in your source POS. No technical implementation is required beyond that."
        }
      },
      {
        "@type": "Question",
        "name": "Can Ezra grow with my franchise as I add locations?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. As you add locations, Ezra adds them to the monitoring layer automatically. The platform is designed to scale from small groups to large networks without architectural changes."
        }
      },
      {
        "@type": "Question",
        "name": "How is Ezra different from the reporting built into my POS?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "POS reporting is designed for single-location visibility. Ezra is designed for network-level intelligence—comparing locations, detecting anomalies relative to network norms, and connecting data across systems (POS, scheduling, CRM, accounting) that your POS can't access."
        }
      },
      {
        "@type": "Question",
        "name": "What is the minimum number of locations to use Ezra?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Ezra is designed for multi-unit operators. Groups with 3 or more locations are the primary audience, though the platform scales down to 2 locations and up to 100+."
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
        "name": "Enterprise Franchise Intelligence for Small Business Operators",
        "item": "https://meetezra.bot/seo/franchise-software-small-business"
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
            <li aria-current="page">Enterprise Franchise Intelligence for Small Business Operators</li>
          </ol>
        </nav>
        <header>
          <h1>Enterprise Franchise Intelligence for Small Business Operators</h1>
          <p>Enterprise franchise groups have had data science teams, BI analysts, and custom analytics implementations for years. The small franchise operator—running 3 to 20 locations—has had spreadsheets and intuition. Ezra is the operating layer that closes that gap: purpose-built for the multi-unit operator who doesn't have a data team, but needs the intelligence that comes with one.</p>
        </header>
        <article>
        <section>
          <h2>What Enterprise Has Had for Years</h2>
          <p>Large franchise organizations invest in six-figure analytics implementations, dedicated BI teams, and custom reporting infrastructure. This intelligence—which transactions are anomalous, which locations are underperforming, which customers are at risk—has driven a measurable operating advantage for enterprise operators over their smaller competitors. Ezra makes that same intelligence accessible without the enterprise price tag.</p>
        </section>

        <section>
          <h2>Purpose-Built for 3–20 Locations</h2>
          <p>Ezra's operating layer is designed for the multi-unit operator who is actively managing their business—not delegating to a regional analytics team. The interface is built for the person who looks at the data every morning, makes decisions based on it, and needs that data to be fast, accurate, and actionable.</p>
        </section>

        <section>
          <h2>No Data Team Required</h2>
          <p>Ezra does not require a BI analyst, a data engineer, or a custom implementation team. Operators provision a dedicated credential in their source POS during onboarding, and the platform begins reading data immediately. The intelligence layer is built in; operators bring their business knowledge.</p>
        </section>

        <section>
          <h2>All Five Modules From Day One</h2>
          <p>Small franchise operators don't need to choose one module and add more later. The full Ezra platform—loss prevention, inventory, scheduling, CRM, and sales intelligence—is available from day one. Operators can activate modules based on their priorities and add others as they become familiar with the platform.</p>
        </section>

        <section>
          <h2>Pricing Designed for Portfolio Scale</h2>
          <p>Ezra's pricing is structured for multi-unit scale—not for single-location software inflated to cover a franchise network. The Q4 2026 roadmap includes a formal pricing structure for portfolio scale, designed for the operator managing 3 to 50 locations.</p>
        </section>
        </article>
        <section aria-label="Frequently Asked Questions">
          <h2>Frequently Asked Questions</h2>
          <dl>
          <div className="faq-item">
            <dt>Is Ezra designed for small franchise operators or large enterprise groups?</dt>
            <dd>Ezra is purpose-built for multi-unit operators across the full size range—from 3 locations to 110+ currently on the platform. The operating layer model is relevant regardless of portfolio size.</dd>
          </div>

          <div className="faq-item">
            <dt>Do I need technical expertise to use Ezra?</dt>
            <dd>No. Onboarding requires provisioning a dedicated credential in your source POS. No technical implementation is required beyond that.</dd>
          </div>

          <div className="faq-item">
            <dt>Can Ezra grow with my franchise as I add locations?</dt>
            <dd>Yes. As you add locations, Ezra adds them to the monitoring layer automatically. The platform is designed to scale from small groups to large networks without architectural changes.</dd>
          </div>

          <div className="faq-item">
            <dt>How is Ezra different from the reporting built into my POS?</dt>
            <dd>POS reporting is designed for single-location visibility. Ezra is designed for network-level intelligence—comparing locations, detecting anomalies relative to network norms, and connecting data across systems (POS, scheduling, CRM, accounting) that your POS can't access.</dd>
          </div>

          <div className="faq-item">
            <dt>What is the minimum number of locations to use Ezra?</dt>
            <dd>Ezra is designed for multi-unit operators. Groups with 3 or more locations are the primary audience, though the platform scales down to 2 locations and up to 100+.</dd>
          </div>
          </dl>
        </section>
        <nav aria-label="Related solutions">
          <h2>Related Solutions</h2>
          <ul>
            <li><Link href="/seo/multi-unit-business-software">Multi Unit Business Software</Link></li>
            <li><Link href="/seo/save-money-franchise-operations">Save Money Franchise Operations</Link></li>
            <li><Link href="/seo/franchise-automation-software">Franchise Automation Software</Link></li>
          </ul>
        </nav>
        <section aria-label="Call to action">
          <h2>Get the Intelligence the Enterprise Groups Already Have</h2>
          <p>Ezra is live today and onboarding select operators. No BI team required.</p>
          <a href="https://meetezra.bot" rel="noopener noreferrer">See Ezra in Action</a>
          <a href="mailto:onboarding@meetezra.bot">Talk to the team →</a>
        </section>
      </main>
    </>
  );
}
