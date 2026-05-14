import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";

const BASE_URL = "https://meetezra.bot";

export const metadata: Metadata = {
  title: "Multi-Unit Business Software | Ezra AI Platform",
  description: "One operating layer for every location. Ezra sits on top of your POS, scheduling, CRM, and accounting—and turns that data into decisions.",
  alternates: { canonical: `${BASE_URL}/seo/multi-unit-business-software` },
  openGraph: {
    title: "Multi-Unit Business Software | Ezra AI Platform",
    description: "One operating layer for every location. Ezra sits on top of your POS, scheduling, CRM, and accounting—and turns that data into decisions.",
    url: `${BASE_URL}/multi-unit-business-software`,
    siteName: "Ezra — Franchise Intelligence Platform",
    images: [{ url: `${BASE_URL}/og/multi-unit-business-software.png`, width: 1200, height: 630, alt: "The Operating Layer for Multi-Unit Business Operators" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Multi-Unit Business Software | Ezra AI Platform",
    description: "One operating layer for every location. Ezra sits on top of your POS, scheduling, CRM, and accounting—and turns that data into decisions.",
    images: [`${BASE_URL}/og/multi-unit-business-software.png`],
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Ezra Franchise Intelligence Platform",
    "description": "One operating layer for every location. Ezra sits on top of your POS, scheduling, CRM, and accounting—and turns that data into decisions.",
    "url": "https://meetezra.bot/seo/multi-unit-business-software",
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
        "name": "Does Ezra replace my existing software stack?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No. Ezra reads from your existing POS, scheduling, CRM, and accounting systems through approved interfaces. No migration. No rip-and-replace. No six-month deployment."
        }
      },
      {
        "@type": "Question",
        "name": "How many locations does Ezra currently support?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Ezra currently has 110 active stores on the platform, live in production on Zenoti."
        }
      },
      {
        "@type": "Question",
        "name": "What industries is Ezra designed for?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Ezra is built for multi-unit operations across salon, personal services, fitness, restaurant, retail, and professional services. The platform is designed for any franchise or multi-unit group operating on a shared POS system."
        }
      },
      {
        "@type": "Question",
        "name": "Can a franchisor see data across all franchisee locations?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. Ezra's operating layer is designed for both the franchisee managing multiple locations and the franchisor overseeing a network. Data is isolated by tenant, with appropriate access levels for each tier of the organization."
        }
      },
      {
        "@type": "Question",
        "name": "What is the onboarding process?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Operators provision a dedicated credential for Ezra in their source POS during onboarding. There is no software to install on individual terminals. Contact onboarding@meetezra.bot to begin."
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
        "name": "The Operating Layer for Multi-Unit Business Operators",
        "item": "https://meetezra.bot/seo/multi-unit-business-software"
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
            <li aria-current="page">The Operating Layer for Multi-Unit Business Operators</li>
          </ol>
        </nav>

        {/* Hero */}
        <header>
          <h1>The Operating Layer for Multi-Unit Business Operators</h1>
          <p>Multi-unit operators are running businesses on platforms designed for single locations. The data exists—in the POS, the scheduling system, the CRM, the accounting platform—but it's split across a dozen reports, twenty employees, and the operator's own memory. By the time anomalies are caught, margin has already walked out the door. Ezra is the operating layer that sits on top of every system you already use and turns that data into decisions.</p>
        </header>

        {/* Body */}
        <article>
        <section>
          <h2>The Problem With Single-Location Software at Multi-Unit Scale</h2>
          <p>Most franchise management software was built for one location and scaled horizontally. The result is a stack of tools that each require their own login, their own export, and their own interpretation. A regional manager overseeing eight locations might log into five different systems before they have a clear picture of yesterday's performance. Ezra consolidates that picture into one operating layer—without replacing any of the underlying systems.</p>
        </section>

        <section>
          <h2>Five Modules, One Operating Layer</h2>
          <p>Ezra consists of five integrated modules: Loss Prevention (anomaly detection across transactions and cash handling), Inventory (supply-cost intelligence using financial-proxy modeling), Scheduling (demand-driven labor optimization), Exponential (automated guest retention via SMS), and Sales (real-time revenue intelligence). Each module is a focused operating tool with its own intelligence model. Together, they form a complete operating layer for waste detection and revenue growth.</p>
        </section>

        <section>
          <h2>POS-Agnostic by Architectural Design</h2>
          <p>Ezra reads from the operator's existing systems through approved interfaces. It does not replace the POS, scheduling system, CRM, or accounting platform. Currently live on Zenoti, with Square and Toast in active build. Once a source POS is integrated, it feeds all five modules through the same operator-facing portal.</p>
        </section>

        <section>
          <h2>Architectural Principles: Read, Don't Write</h2>
          <p>Ezra reads from operator systems; mutations happen through the operator's own workflow. Every threshold, benchmark, and segment rule is configurable per franchisee. Features that broke against operator reality were dropped before launch. The result is a platform built around how operators actually run—not how a software product manager imagined they should.</p>
        </section>

        <section>
          <h2>One Screen Instead of Three Reports</h2>
          <p>Operators using all five Ezra modules make trade-off decisions—labor vs. revenue, supply cost vs. service mix, discount rate vs. retention—from one screen instead of pulling three separate reports. The operating layer model is the difference between reacting to problems and managing toward outcomes.</p>
        </section>
        </article>

        {/* FAQ */}
        <section aria-label="Frequently Asked Questions">
          <h2>Frequently Asked Questions</h2>
          <dl>
          <div className="faq-item">
            <dt>Does Ezra replace my existing software stack?</dt>
            <dd>No. Ezra reads from your existing POS, scheduling, CRM, and accounting systems through approved interfaces. No migration. No rip-and-replace. No six-month deployment.</dd>
          </div>

          <div className="faq-item">
            <dt>How many locations does Ezra currently support?</dt>
            <dd>Ezra currently has 110 active stores on the platform, live in production on Zenoti.</dd>
          </div>

          <div className="faq-item">
            <dt>What industries is Ezra designed for?</dt>
            <dd>Ezra is built for multi-unit operations across salon, personal services, fitness, restaurant, retail, and professional services. The platform is designed for any franchise or multi-unit group operating on a shared POS system.</dd>
          </div>

          <div className="faq-item">
            <dt>Can a franchisor see data across all franchisee locations?</dt>
            <dd>Yes. Ezra's operating layer is designed for both the franchisee managing multiple locations and the franchisor overseeing a network. Data is isolated by tenant, with appropriate access levels for each tier of the organization.</dd>
          </div>

          <div className="faq-item">
            <dt>What is the onboarding process?</dt>
            <dd>Operators provision a dedicated credential for Ezra in their source POS during onboarding. There is no software to install on individual terminals. Contact onboarding@meetezra.bot to begin.</dd>
          </div>
          </dl>
        </section>

        {/* Related pages */}
        <nav aria-label="Related solutions">
          <h2>Related Solutions</h2>
          <ul>
            <li><Link href="/seo/franchise-ai-loss-prevention">Franchise Ai Loss Prevention</Link></li>
            <li><Link href="/seo/multi-unit-sales-dashboard">Multi Unit Sales Dashboard</Link></li>
            <li><Link href="/seo/franchise-crm-dashboard">Franchise Crm Dashboard</Link></li>
          </ul>
        </nav>

        {/* CTA */}
        <section aria-label="Call to action">
          <h2>Run Every Unit Like Your Best One</h2>
          <p>Ezra is live today and onboarding select multi-unit operators. Let us show you what your network looks like from one operating layer.</p>
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
