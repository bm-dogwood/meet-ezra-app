import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";

const BASE_URL = "https://meetezra.bot";

export const metadata: Metadata = {
  title: "Save Money on Franchise Operations with AI | Ezra",
  description: "Labor waste, shrinkage, and lapsed customers are silent margin killers. Ezra finds them automatically—so you stop losing money you didn't know you were losing.",
  alternates: { canonical: `${BASE_URL}/seo/save-money-franchise-operations` },
  openGraph: {
    title: "Save Money on Franchise Operations with AI | Ezra",
    description: "Labor waste, shrinkage, and lapsed customers are silent margin killers. Ezra finds them automatically—so you stop losing money you didn't know you were losing.",
    url: `${BASE_URL}/save-money-franchise-operations`,
    siteName: "Ezra — Franchise Intelligence Platform",
    images: [{ url: `${BASE_URL}/og/save-money-franchise-operations.png`, width: 1200, height: 630, alt: "Stop the Margin Leaks Across Your Franchise Operations" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Save Money on Franchise Operations with AI | Ezra",
    description: "Labor waste, shrinkage, and lapsed customers are silent margin killers. Ezra finds them automatically—so you stop losing money you didn't know you were losing.",
    images: [`${BASE_URL}/og/save-money-franchise-operations.png`],
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Ezra Franchise Intelligence Platform",
    "description": "Labor waste, shrinkage, and lapsed customers are silent margin killers. Ezra finds them automatically—so you stop losing money you didn't know you were losing.",
    "url": "https://meetezra.bot/seo/save-money-franchise-operations",
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
        "name": "How quickly can Ezra find cost savings in my franchise?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Most operators surface their first meaningful anomalies within the first two weeks of deployment. Loss prevention flags can appear immediately once the platform is reading live transaction data."
        }
      },
      {
        "@type": "Question",
        "name": "Does Ezra require me to change how I operate?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No. Ezra reads from your existing systems and surfaces intelligence through one unified interface. You use that intelligence to make decisions. The operating decisions remain with you."
        }
      },
      {
        "@type": "Question",
        "name": "Which of Ezra's modules has the fastest ROI?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Loss Prevention and Scheduling typically show the fastest ROI because they surface actionable anomalies immediately upon deployment. Retention (Exponential) shows ROI as campaigns run and recovered revenue is measured. Inventory ROI visibility depends on supply cost patterns."
        }
      },
      {
        "@type": "Question",
        "name": "Is there a minimum number of locations required?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Ezra is designed for multi-unit operators. Operators with 3 or more locations are the primary target audience, though the platform scales from small groups to large franchise networks."
        }
      },
      {
        "@type": "Question",
        "name": "How is Ezra priced?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Pricing is structured for multi-unit scale. Contact onboarding@meetezra.bot to discuss the pricing structure for your specific portfolio size and module selection."
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
        "name": "Stop the Margin Leaks Across Your Franchise Operations",
        "item": "https://meetezra.bot/seo/save-money-franchise-operations"
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
            <li aria-current="page">Stop the Margin Leaks Across Your Franchise Operations</li>
          </ol>
        </nav>

        {/* Hero */}
        <header>
          <h1>Stop the Margin Leaks Across Your Franchise Operations</h1>
          <p>The most expensive problems in franchise operations are the ones you don't know about yet. The employee whose void rate has been running high for three months. The location whose supply spend has been creeping above revenue for six weeks. The customer segment that stopped coming in 45 days ago. The shift that's been overstaffed by two people every Tuesday. Each of these is a margin leak. Ezra finds all of them—automatically, across every location—before they compound.</p>
        </header>

        {/* Body */}
        <article>
        <section>
          <h2>Where Franchise Margin Actually Goes</h2>
          <p>The most visible cost in franchise operations—rent, product, labor—is the easiest to manage because it's the most tracked. The margin killers that compound silently are the ones that don't show up until month-end: internal theft that runs for weeks before detection, supply waste from inconsistent spend-to-revenue ratios, overstaffing during predictably slow periods, and lapsed guests who quietly stopped coming. Ezra is purpose-built to find these.</p>
        </section>

        <section>
          <h2>Loss Prevention: Find the Theft You Don't Know About</h2>
          <p>Ezra Loss Prevention monitors every transaction, void, override, and discount across your franchise network. Behavioral anomalies that signal internal shrinkage are surfaced as a triaged feed within the same operating cycle they occur—not after the quarterly audit. At 5 locations averaging $500K in annual revenue each, a 2% shrinkage rate is $50,000 per year. Finding it in week two versus month nine is the difference between $8,000 and $45,000 in losses.</p>
        </section>

        <section>
          <h2>Inventory: Stop Paying for Product That Disappears</h2>
          <p>Ezra Inventory tracks supply spend as a percentage of revenue, flags deviations from trailing averages, and surfaces waste before it compounds. Financial-proxy modeling means no perfect SKU data required—just the spend and revenue data already in your accounting system.</p>
        </section>

        <section>
          <h2>Scheduling: Stop Paying for Hours That Aren't Working</h2>
          <p>Ezra Scheduling tracks idle time, overtime exposure, and revenue-per-hour across every location and shift. When a Tuesday afternoon is consistently overstaffed by 20% relative to actual demand, Ezra surfaces it. Reshaping that one shift across a 10-location network could recover tens of thousands of dollars in annual labor cost.</p>
        </section>

        <section>
          <h2>Retention: Stop Losing the Revenue You Already Earned</h2>
          <p>Acquiring a new customer costs 5-10x more than retaining an existing one. Ezra Exponential identifies at-risk and lapsed guests by visit frequency and runs automated SMS retention sequences that bring them back. Recovered revenue from lapsed guests is the highest-ROI customer acquisition channel available to most franchise operators—and it's one most of them aren't running systematically.</p>
        </section>
        </article>

        {/* FAQ */}
        <section aria-label="Frequently Asked Questions">
          <h2>Frequently Asked Questions</h2>
          <dl>
          <div className="faq-item">
            <dt>How quickly can Ezra find cost savings in my franchise?</dt>
            <dd>Most operators surface their first meaningful anomalies within the first two weeks of deployment. Loss prevention flags can appear immediately once the platform is reading live transaction data.</dd>
          </div>

          <div className="faq-item">
            <dt>Does Ezra require me to change how I operate?</dt>
            <dd>No. Ezra reads from your existing systems and surfaces intelligence through one unified interface. You use that intelligence to make decisions. The operating decisions remain with you.</dd>
          </div>

          <div className="faq-item">
            <dt>Which of Ezra's modules has the fastest ROI?</dt>
            <dd>Loss Prevention and Scheduling typically show the fastest ROI because they surface actionable anomalies immediately upon deployment. Retention (Exponential) shows ROI as campaigns run and recovered revenue is measured. Inventory ROI visibility depends on supply cost patterns.</dd>
          </div>

          <div className="faq-item">
            <dt>Is there a minimum number of locations required?</dt>
            <dd>Ezra is designed for multi-unit operators. Operators with 3 or more locations are the primary target audience, though the platform scales from small groups to large franchise networks.</dd>
          </div>

          <div className="faq-item">
            <dt>How is Ezra priced?</dt>
            <dd>Pricing is structured for multi-unit scale. Contact onboarding@meetezra.bot to discuss the pricing structure for your specific portfolio size and module selection.</dd>
          </div>
          </dl>
        </section>

        {/* Related pages */}
        <nav aria-label="Related solutions">
          <h2>Related Solutions</h2>
          <ul>
            <li><Link href="/seo/franchise-automation-software">Franchise Automation Software</Link></li>
            <li><Link href="/seo/employee-scheduling-franchise-software">Employee Scheduling Franchise Software</Link></li>
            <li><Link href="/seo/ai-inventory-management-franchise">Ai Inventory Management Franchise</Link></li>
          </ul>
        </nav>

        {/* CTA */}
        <section aria-label="Call to action">
          <h2>Find Out How Much You're Losing Before You Know You're Losing It</h2>
          <p>Ezra is live today and onboarding select operators. Let us show you what the platform finds in your first two weeks.</p>
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
