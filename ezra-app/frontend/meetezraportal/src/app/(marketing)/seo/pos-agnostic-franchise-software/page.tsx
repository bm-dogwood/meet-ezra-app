import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";

const BASE_URL = "https://meetezra.bot";

export const metadata: Metadata = {
  title: "POS-Agnostic Franchise Software | Ezra AI",
  description: "Zenoti, Square, Toast, and more. Ezra sits on top of the POS you already use—no migration, no rip-and-replace, no six-month deployment.",
  alternates: { canonical: `${BASE_URL}/seo/pos-agnostic-franchise-software` },
  openGraph: {
    title: "POS-Agnostic Franchise Software | Ezra AI",
    description: "Zenoti, Square, Toast, and more. Ezra sits on top of the POS you already use—no migration, no rip-and-replace, no six-month deployment.",
    url: `${BASE_URL}/pos-agnostic-franchise-software`,
    siteName: "Ezra — Franchise Intelligence Platform",
    images: [{ url: `${BASE_URL}/og/pos-agnostic-franchise-software.png`, width: 1200, height: 630, alt: "Franchise Operating Software That Works With Your POS" }],
    type: "website",
  },
  twitter: { card: "summary_large_image", title: "POS-Agnostic Franchise Software | Ezra AI", description: "Zenoti, Square, Toast, and more. Ezra sits on top of the POS you already use—no migration, no rip-and-replace, no six-month deployment.", images: [`${BASE_URL}/og/pos-agnostic-franchise-software.png`] },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Ezra Franchise Intelligence Platform",
    "description": "Zenoti, Square, Toast, and more. Ezra sits on top of the POS you already use—no migration, no rip-and-replace, no six-month deployment.",
    "url": "https://meetezra.bot/seo/pos-agnostic-franchise-software",
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
        "name": "Which POS systems does Ezra currently support?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Ezra is live in production on Zenoti. Square and Toast are in active build. Mindbody, Booker, Lightspeed, and Clover are on the roadmap."
        }
      },
      {
        "@type": "Question",
        "name": "Will Ezra work if I'm switching POS systems?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. Because Ezra is POS-agnostic by design, a POS transition means updating the integration—not rebuilding the operating layer. The five modules and operator portal remain unchanged."
        }
      },
      {
        "@type": "Question",
        "name": "Does Ezra require any changes to my existing POS configuration?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Operators provision a dedicated credential for Ezra in their POS during onboarding. No other changes to the POS configuration are required."
        }
      },
      {
        "@type": "Question",
        "name": "Can Ezra work if different locations in my franchise use different POS systems?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Roadmap support for multi-POS networks is planned. Contact us to discuss your specific configuration."
        }
      },
      {
        "@type": "Question",
        "name": "When will Square and Toast integrations be available?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Square and Toast integrations are in active build targeting Q2 2026, alongside the Inventory module launch."
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
        "name": "Franchise Operating Software That Works With Your POS",
        "item": "https://meetezra.bot/seo/pos-agnostic-franchise-software"
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
            <li aria-current="page">Franchise Operating Software That Works With Your POS</li>
          </ol>
        </nav>
        <header>
          <h1>Franchise Operating Software That Works With Your POS</h1>
          <p>Franchise operators shouldn't have to choose their operating intelligence software based on their POS system. Ezra is POS-agnostic by architectural design—built to read from any POS through standard interfaces, apply the same five modules of operating intelligence, and deliver through one unified operator portal regardless of which system is feeding the data.</p>
        </header>
        <article>
        <section>
          <h2>Why POS Lock-In Is a Problem</h2>
          <p>Most franchise analytics and operating software is built natively for one POS ecosystem. Zenoti operators get tools designed for Zenoti. Square operators get Square analytics. Toast operators get Toast insights. This fragments the operating intelligence market and forces operators to choose between their POS and their analytics capability. Ezra breaks that lock-in.</p>
        </section>

        <section>
          <h2>The Integration Architecture</h2>
          <p>Ezra integrates with source POS systems through approved API interfaces. Once integrated, the source POS feeds all five modules—Loss Prevention, Inventory, Scheduling, Exponential, and Sales—through the same operator-facing portal. The integration shifts; the operating intelligence doesn't change.</p>
        </section>

        <section>
          <h2>Current Integration Status</h2>
          <p>Ezra is live in production on Zenoti today, with 110+ active stores on the platform. Square and Toast integrations are in active build, targeting multi-unit retail, restaurant, fitness, and professional services. Mindbody, Booker, Lightspeed, and Clover are on the roadmap for future integration.</p>
        </section>

        <section>
          <h2>No Migration Required</h2>
          <p>Ezra does not replace your POS. It reads from it. There is no data migration, no parallel running period, no rip-and-replace process. Operators provision a dedicated credential in their existing POS during onboarding, and Ezra begins reading data immediately.</p>
        </section>

        <section>
          <h2>Operator-Validated Integration Principles</h2>
          <p>Ezra's credential model uses a dedicated, never-personal credential provisioned during onboarding. Ezra cannot exceed the permissions assigned to that credential, and operator data is isolated by tenant with cross-tenant access structurally blocked.</p>
        </section>
        </article>
        <section aria-label="Frequently Asked Questions">
          <h2>Frequently Asked Questions</h2>
          <dl>
          <div className="faq-item">
            <dt>Which POS systems does Ezra currently support?</dt>
            <dd>Ezra is live in production on Zenoti. Square and Toast are in active build. Mindbody, Booker, Lightspeed, and Clover are on the roadmap.</dd>
          </div>

          <div className="faq-item">
            <dt>Will Ezra work if I'm switching POS systems?</dt>
            <dd>Yes. Because Ezra is POS-agnostic by design, a POS transition means updating the integration—not rebuilding the operating layer. The five modules and operator portal remain unchanged.</dd>
          </div>

          <div className="faq-item">
            <dt>Does Ezra require any changes to my existing POS configuration?</dt>
            <dd>Operators provision a dedicated credential for Ezra in their POS during onboarding. No other changes to the POS configuration are required.</dd>
          </div>

          <div className="faq-item">
            <dt>Can Ezra work if different locations in my franchise use different POS systems?</dt>
            <dd>Roadmap support for multi-POS networks is planned. Contact us to discuss your specific configuration.</dd>
          </div>

          <div className="faq-item">
            <dt>When will Square and Toast integrations be available?</dt>
            <dd>Square and Toast integrations are in active build targeting Q2 2026, alongside the Inventory module launch.</dd>
          </div>
          </dl>
        </section>
        <nav aria-label="Related solutions">
          <h2>Related Solutions</h2>
          <ul>
            <li><Link href="/seo/multi-unit-business-software">Multi Unit Business Software</Link></li>
            <li><Link href="/seo/franchise-automation-software">Franchise Automation Software</Link></li>
            <li><Link href="/seo/franchise-dashboard-software">Franchise Dashboard Software</Link></li>
          </ul>
        </nav>
        <section aria-label="Call to action">
          <h2>Don't Let Your POS Limit Your Operating Intelligence</h2>
          <p>Ezra is POS-agnostic and live today on Zenoti. Square and Toast coming Q2 2026. Let's talk.</p>
          <a href="https://meetezra.bot" rel="noopener noreferrer">See Ezra in Action</a>
          <a href="mailto:onboarding@meetezra.bot">Talk to the team →</a>
        </section>
      </main>
    </>
  );
}
