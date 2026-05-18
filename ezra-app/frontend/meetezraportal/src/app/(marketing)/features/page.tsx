import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";

const BASE_URL = "https://meetezra.bot";

export const metadata: Metadata = {
  title:
    "Features — AI Loss Prevention, CRM, Scheduling, Inventory & Sales Dashboard",
  description:
    "Ezra gives franchise and small business operators AI-powered tools to stop employee theft, reduce shrinkage, automate employee scheduling, run a franchise CRM, manage inventory, and view a real-time multi-unit sales dashboard — all in one platform.",
  alternates: { canonical: `${BASE_URL}/features` },
  keywords: [
    "franchise AI features",
    "loss prevention",
    "employee theft",
    "shrinkage",
    "inventory management franchise",
    "employee scheduling",
    "franchise CRM",
    "sales dashboard",
    "multi-unit dashboard",
    "automate franchise",
    "save money franchise",
    "small business franchise software",
    "franchise automation",
    "AI franchise platform",
    "multi-unit operations",
    "franchise dashboard",
    "AI scheduling",
    "CRM franchise",
  ],
  openGraph: {
    title:
      "Features — AI Loss Prevention, CRM, Scheduling, Inventory & Sales Dashboard | Ezra",
    description:
      "Ezra gives franchise and small business operators AI-powered tools to stop employee theft, reduce shrinkage, automate employee scheduling, run a franchise CRM, manage inventory, and view a real-time multi-unit sales dashboard.",
    url: `${BASE_URL}/features`,
    siteName: "Ezra — Franchise Intelligence Platform",
    images: [
      {
        url: `${BASE_URL}/og/features.png`,
        width: 1200,
        height: 630,
        alt: "Ezra Features — AI for Franchise Operations",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Features — AI Loss Prevention, CRM, Scheduling & Sales Dashboard | Ezra",
    description:
      "Stop employee theft, reduce shrinkage, automate scheduling, run CRM, and view your multi-unit sales dashboard — all in one AI platform.",
    images: [`${BASE_URL}/og/features.png`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Ezra Franchise Intelligence Platform",
    url: `${BASE_URL}/features`,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    description:
      "AI-powered franchise management platform covering loss prevention, employee theft detection, shrinkage control, inventory intelligence, employee scheduling automation, CRM, and a real-time multi-unit sales dashboard.",
    provider: {
      "@type": "Organization",
      name: "Franchise AI, LLC dba Ezra AI",
      url: BASE_URL,
    },
    featureList: [
      "AI loss prevention and employee theft detection",
      "Shrinkage monitoring and inventory intelligence",
      "AI employee scheduling to save money on labor",
      "Multi-unit franchise CRM with automated re-engagement",
      "Real-time sales dashboard across all franchise locations",
      "Small business franchise management",
      "Multi-unit operations dashboard",
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What AI features does Ezra offer for franchise loss prevention?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Ezra monitors every POS transaction in real time for behavioral patterns that signal employee theft — including void abuse, unauthorized discounts, refund fraud, and supply consumption that outpaces revenue. Alerts are surfaced in a dashboard ranked by severity so operators investigate the right incidents, not all of them.",
        },
      },
      {
        "@type": "Question",
        name: "How does Ezra's employee scheduling feature save money?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Ezra analyzes historical sales patterns to identify overstaffed periods, idle hours, and overtime risk before the schedule is set. Multi-unit operators see scheduling inefficiencies across all locations in one view, so labor decisions are driven by data rather than habit.",
        },
      },
      {
        "@type": "Question",
        name: "What CRM features does Ezra include for franchises?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Ezra Exponential identifies lapsed customers based on visit frequency and automates personalized SMS re-engagement campaigns. Guest data is normalized across all franchise locations, so a customer who visits multiple units is treated as a single relationship.",
        },
      },
      {
        "@type": "Question",
        name: "How does the Ezra sales dashboard work for multi-unit operators?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The sales dashboard pulls real-time revenue data from every franchise location and presents it in one unified view. Operators can compare units, track service mix, monitor average ticket size, and catch revenue dips the same day — without waiting for weekly or monthly reports.",
        },
      },
      {
        "@type": "Question",
        name: "Does Ezra work for small business franchise operators?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Ezra is built for operators running 3 to 100+ locations. Small business franchise owners get access to the same AI loss prevention, scheduling, CRM, inventory, and sales dashboard features as large multi-unit networks.",
        },
      },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Ezra", item: BASE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: "Features",
        item: `${BASE_URL}/features`,
      },
    ],
  },
];

// ─── Design tokens (Ezra V2) ────────────────────────────────────────────────
const T = {
  bg: "#09090B",
  surface: "#141417",
  raised: "#1C1C20",
  border: "#27272A",
  text: "#FAFAFA",
  muted: "#71717A",
  subtle: "#A1A1AA",
  cyan: "#22D3EE",
  cyanD: "#06B6D4",
  green: "#10B981",
  font: "'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
};

const FEATURES = [
  {
    index: "01",
    label: "Loss Prevention",
    keyword: "AI Loss Prevention",
    icon: "🔒",
    accentColor: "#EF4444",
    tagline: "Stop employee theft before it compounds",
    description:
      "Ezra monitors every POS transaction in real time and flags the behavioral patterns that signal internal theft — void abuse, unauthorized discounts, refund manipulation, and supply consumption that doesn't match revenue. Instead of reviewing thousands of transactions manually, operators get a ranked alert dashboard showing the highest-risk employees, shifts, and locations right now.",
    bullets: [
      "Real-time transaction anomaly detection across all locations",
      "Employee risk scoring based on behavioral patterns",
      "Void, refund, and discount abuse monitoring",
      "Cross-location pattern detection for coordinated theft",
      "Severity-ranked alert dashboard — no noise, just signal",
    ],
    stat: "1–3%",
    statLabel: "of gross sales typically lost to shrinkage before detection",
    href: "/seo/multi-unit-loss-prevention-ai",
  },
  {
    index: "02",
    label: "Employee Scheduling",
    keyword: "AI Employee Scheduling",
    icon: "📅",
    accentColor: "#22D3EE",
    tagline: "Automate scheduling. Save money on labor.",
    description:
      "Labor is the largest controllable cost in franchise operations. Ezra's scheduling module analyzes historical sales volume and service patterns to surface overstaffed periods, overtime risk, and understaffed high-revenue windows — before the schedule is finalized. Multi-unit operators see scheduling efficiency across every location in one view, so staffing decisions are data-driven, not habit-driven.",
    bullets: [
      "AI-driven shift recommendations based on revenue patterns",
      "Overtime risk flagging before it hits the payroll",
      "Understaffed period detection during high-demand windows",
      "Cross-location labor efficiency benchmarking",
      "Idle hour reduction across multi-unit networks",
    ],
    stat: "18%",
    statLabel: "average reduction in idle labor hours in first 60 days",
    href: "/seo/ai-employee-scheduling-for-franchises",
  },
  {
    index: "03",
    label: "Inventory & Shrinkage",
    keyword: "Inventory & Shrinkage Control",
    icon: "📦",
    accentColor: "#F59E0B",
    tagline: "Catch shrinkage without waiting for a physical count",
    description:
      "Physical inventory counts catch shrinkage after the loss has already compounded. Ezra's inventory intelligence module uses financial-proxy modeling — comparing supply cost trends against revenue data — to surface consumption anomalies in real time. Franchise operators get inventory health signals in the same unified dashboard as sales, scheduling, and CRM.",
    bullets: [
      "Financial-proxy modeling for supply cost anomaly detection",
      "Consumption-to-revenue ratio monitoring by location",
      "Early shrinkage signals without a physical count",
      "Over-ordering and waste pattern detection",
      "Unified inventory and revenue view in one dashboard",
    ],
    stat: "Days",
    statLabel: "faster shrinkage detection vs. quarterly physical counts",
    href: "/seo/franchise-inventory-dashboard",
  },
  {
    index: "04",
    label: "Franchise CRM",
    keyword: "Franchise CRM & Customer Retention",
    icon: "🤝",
    accentColor: "#8B5CF6",
    tagline: "Recover lapsed customers automatically",
    description:
      "Ezra Exponential is the built-in franchise CRM. It analyzes guest visit frequency to identify who is at risk of lapsing, then automatically sends personalized SMS re-engagement messages — no manual segmentation, no list management, no manual outreach. Guest data is normalized across all franchise locations so multi-unit operators treat customers as unified relationships, not per-location records.",
    bullets: [
      "Lapsed guest identification based on visit cadence",
      "Automated personalized SMS re-engagement campaigns",
      "Cross-location guest data normalization for multi-unit operators",
      "Re-engagement conversion tracking and ROI reporting",
      "No manual segmentation or list management required",
    ],
    stat: "23%",
    statLabel: "average guest re-engagement rate on automated campaigns",
    href: "/seo/ai-crm-for-franchises",
  },
  {
    index: "05",
    label: "Sales Dashboard",
    keyword: "Multi-Unit Sales Dashboard",
    icon: "📊",
    accentColor: "#10B981",
    tagline: "Real-time revenue intelligence across every unit",
    description:
      "The Ezra sales dashboard delivers real-time revenue visibility at the location, provider, and service-type level — across your entire franchise network from a single screen. Multi-unit operators compare location performance, monitor average ticket, track service mix, and catch revenue dips the same day they happen rather than at month-end. No manual exports. No waiting for reports.",
    bullets: [
      "Real-time revenue by location, provider, and service type",
      "Location-to-location performance benchmarking",
      "Average ticket and service mix tracking",
      "Repeat visit rate and labor-to-revenue ratio monitoring",
      "Automatic data refresh from POS — no manual exports",
    ],
    stat: "Live",
    statLabel: "data across 110+ active franchise locations in production",
    href: "/seo/multi-unit-sales-dashboard",
  },
];

export default function FeaturesPage() {
  return (
    <>
      {jsonLd.map((schema, i) => (
        <Script
          key={i}
          id={`features-schema-${i}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      <div
        style={{
          background: T.bg,
          minHeight: "100vh",
          fontFamily: T.font,
          color: T.text,
          paddingTop: 64,
          WebkitFontSmoothing: "antialiased",
        }}
      >
        {/* ── Hero ─────────────────────────────────────────────────────────────── */}
        <section
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "80px 24px 64px",
            textAlign: "center",
          }}
        >
          {/* Badge */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              background: `${T.cyanD}18`,
              border: `1px solid ${T.cyanD}40`,
              borderRadius: 100,
              padding: "4px 14px",
              marginBottom: 28,
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: T.cyan,
              }}
            />
            <span
              style={{
                fontSize: 12,
                fontWeight: 500,
                color: T.cyan,
                letterSpacing: "0.04em",
              }}
            >
              Live in Production
            </span>
          </div>

          <h1
            style={{
              fontSize: "clamp(32px, 5vw, 52px)",
              fontWeight: 700,
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
              margin: "0 0 20px",
              background: `linear-gradient(135deg, ${T.text} 40%, ${T.subtle})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Every Feature Franchise Operators
            <br />
            Need in One AI Platform
          </h1>

          <p
            style={{
              fontSize: "clamp(15px, 2vw, 18px)",
              color: T.subtle,
              lineHeight: 1.6,
              maxWidth: 640,
              margin: "0 auto 40px",
            }}
          >
            Ezra covers loss prevention, employee theft detection, shrinkage
            control, inventory intelligence, employee scheduling, CRM, and a
            real-time multi-unit sales dashboard — reading from the systems you
            already use, without replacing them.
          </p>

          <div
            style={{
              display: "flex",
              gap: 12,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Link
              href="/contact"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "11px 24px",
                borderRadius: 8,
                background: `linear-gradient(135deg, ${T.cyan}, ${T.cyanD})`,
                color: T.bg,
                fontSize: 14,
                fontWeight: 700,
                textDecoration: "none",
                letterSpacing: "-0.01em",
              }}
            >
              Request a Demo
            </Link>
            <Link
              href="/solutions"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "11px 24px",
                borderRadius: 8,
                background: "transparent",
                border: `1px solid ${T.border}`,
                color: T.subtle,
                fontSize: 14,
                fontWeight: 500,
                textDecoration: "none",
              }}
            >
              See Solutions
            </Link>
          </div>
        </section>

        {/* ── Stats bar ────────────────────────────────────────────────────────── */}
        <div
          style={{
            borderTop: `1px solid ${T.border}`,
            borderBottom: `1px solid ${T.border}`,
            background: T.surface,
          }}
        >
          <div
            style={{
              maxWidth: 1200,
              margin: "0 auto",
              padding: "0 24px",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
              gap: 0,
            }}
          >
            {[
              { value: "110+", label: "Active franchise locations" },
              { value: "5", label: "Integrated AI modules" },
              {
                value: "Live",
                label: "Loss prevention, scheduling, CRM, sales",
              },
              { value: "0", label: "Existing systems replaced" },
            ].map(({ value, label }) => (
              <div
                key={label}
                style={{
                  padding: "22px 24px",
                  borderRight: `1px solid ${T.border}`,
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontSize: 22,
                    fontWeight: 700,
                    color: T.cyan,
                    letterSpacing: "-0.02em",
                    marginBottom: 4,
                  }}
                >
                  {value}
                </div>
                <div style={{ fontSize: 12, color: T.muted, lineHeight: 1.4 }}>
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Feature Cards ─────────────────────────────────────────────────────── */}
        <section
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "80px 24px",
          }}
          aria-label="Platform features"
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {FEATURES.map(
              ({
                index,
                label,
                keyword,
                icon,
                accentColor,
                tagline,
                description,
                bullets,
                stat,
                statLabel,
                href,
              }) => (
                <article
                  key={index}
                  style={{
                    background: T.surface,
                    border: `1px solid ${T.border}`,
                    borderRadius: 12,
                    padding: "clamp(24px, 4vw, 48px)",
                    marginBottom: 16,
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  {/* accent glow top-left */}
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: 200,
                      height: 200,
                      background: `radial-gradient(ellipse at top left, ${accentColor}12, transparent 70%)`,
                      pointerEvents: "none",
                    }}
                  />

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr auto",
                      gap: 24,
                      alignItems: "start",
                      position: "relative",
                    }}
                  >
                    {/* Left content */}
                    <div>
                      {/* Label row */}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 12,
                          marginBottom: 16,
                        }}
                      >
                        <span
                          style={{
                            fontSize: 11,
                            fontWeight: 600,
                            letterSpacing: "0.12em",
                            textTransform: "uppercase",
                            color: T.muted,
                          }}
                        >
                          {index}
                        </span>
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 6,
                            background: `${accentColor}18`,
                            border: `1px solid ${accentColor}35`,
                            borderRadius: 100,
                            padding: "3px 10px",
                            fontSize: 11,
                            fontWeight: 600,
                            color: accentColor,
                            letterSpacing: "0.04em",
                            textTransform: "uppercase",
                          }}
                        >
                          {icon} {label}
                        </span>
                      </div>

                      <h2
                        style={{
                          fontSize: "clamp(20px, 3vw, 28px)",
                          fontWeight: 700,
                          letterSpacing: "-0.025em",
                          lineHeight: 1.2,
                          color: T.text,
                          margin: "0 0 8px",
                        }}
                      >
                        {keyword}
                      </h2>
                      <p
                        style={{
                          fontSize: 14,
                          color: accentColor,
                          fontWeight: 500,
                          margin: "0 0 16px",
                          opacity: 0.9,
                        }}
                      >
                        {tagline}
                      </p>
                      <p
                        style={{
                          fontSize: 15,
                          color: T.subtle,
                          lineHeight: 1.65,
                          margin: "0 0 24px",
                          maxWidth: 620,
                        }}
                      >
                        {description}
                      </p>

                      {/* Bullets */}
                      <ul
                        style={{
                          listStyle: "none",
                          margin: 0,
                          padding: 0,
                          display: "flex",
                          flexDirection: "column",
                          gap: 8,
                        }}
                      >
                        {bullets.map((b) => (
                          <li
                            key={b}
                            style={{
                              display: "flex",
                              alignItems: "flex-start",
                              gap: 10,
                              fontSize: 13.5,
                              color: T.subtle,
                              lineHeight: 1.5,
                            }}
                          >
                            <span
                              style={{
                                width: 14,
                                height: 14,
                                borderRadius: "50%",
                                background: `${accentColor}20`,
                                border: `1px solid ${accentColor}50`,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexShrink: 0,
                                marginTop: 2,
                              }}
                            >
                              <span
                                style={{
                                  width: 4,
                                  height: 4,
                                  borderRadius: "50%",
                                  background: accentColor,
                                }}
                              />
                            </span>
                            {b}
                          </li>
                        ))}
                      </ul>

                      <Link
                        href={href}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 6,
                          marginTop: 24,
                          fontSize: 13,
                          fontWeight: 600,
                          color: accentColor,
                          textDecoration: "none",
                          opacity: 0.9,
                        }}
                      >
                        Learn more →
                      </Link>
                    </div>

                    {/* Right stat card */}
                    <div
                      style={{
                        minWidth: 140,
                        background: T.raised,
                        border: `1px solid ${T.border}`,
                        borderRadius: 10,
                        padding: "20px 18px",
                        textAlign: "center",
                        flexShrink: 0,
                      }}
                    >
                      <div
                        style={{
                          fontSize: 28,
                          fontWeight: 800,
                          color: accentColor,
                          letterSpacing: "-0.03em",
                          lineHeight: 1,
                          marginBottom: 8,
                        }}
                      >
                        {stat}
                      </div>
                      <div
                        style={{
                          fontSize: 11,
                          color: T.muted,
                          lineHeight: 1.4,
                          maxWidth: 120,
                        }}
                      >
                        {statLabel}
                      </div>
                    </div>
                  </div>
                </article>
              ),
            )}
          </div>
        </section>

        {/* ── Why it works for Small Business & Multi-Unit ────────────────────── */}
        <section
          style={{
            background: T.surface,
            borderTop: `1px solid ${T.border}`,
            borderBottom: `1px solid ${T.border}`,
          }}
        >
          <div
            style={{
              maxWidth: 1200,
              margin: "0 auto",
              padding: "72px 24px",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 32,
            }}
          >
            {[
              {
                title: "Built for Small Business Franchise Owners",
                body: "You don't need a data team to get value from Ezra. Small business franchise operators running 3–15 locations get the same AI loss prevention, inventory monitoring, employee scheduling, CRM, and sales dashboard as large networks — at a scale that fits your operation.",
                icon: "🏪",
              },
              {
                title: "Scales With Multi-Unit Operators",
                body: "Multi-unit franchise operators with 15–100+ locations use Ezra to run network-wide analytics, compare location performance, detect coordinated employee theft across units, and manage labor deployment across the entire portfolio from one dashboard.",
                icon: "🏢",
              },
              {
                title: "Save Money From Day One",
                body: "Loss prevention, labor optimization, and CRM re-engagement each generate measurable returns. Most Ezra operators recover more in stopped theft and reduced idle labor than the platform costs in the first 60 days. No six-month implementation. No custom development.",
                icon: "💰",
              },
              {
                title: "No Rip-and-Replace",
                body: "Ezra reads from your existing POS, scheduling system, and CRM through approved integrations. Your current stack stays in place. Ezra adds the AI intelligence layer on top — live within days of provisioning a single read-only credential per system.",
                icon: "⚡",
              },
            ].map(({ title, body, icon }) => (
              <div key={title}>
                <div style={{ fontSize: 28, marginBottom: 12 }}>{icon}</div>
                <h3
                  style={{
                    fontSize: 17,
                    fontWeight: 700,
                    color: T.text,
                    letterSpacing: "-0.02em",
                    margin: "0 0 10px",
                  }}
                >
                  {title}
                </h3>
                <p
                  style={{
                    fontSize: 14,
                    color: T.subtle,
                    lineHeight: 1.65,
                    margin: 0,
                  }}
                >
                  {body}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── FAQ ──────────────────────────────────────────────────────────────── */}

        {/* ── CTA ──────────────────────────────────────────────────────────────── */}
        <section
          style={{
            background: T.surface,
            borderTop: `1px solid ${T.border}`,
          }}
        >
          <div
            style={{
              maxWidth: 640,
              margin: "0 auto",
              padding: "72px 24px",
              textAlign: "center",
            }}
          >
            <h2
              style={{
                fontSize: "clamp(24px, 4vw, 36px)",
                fontWeight: 700,
                letterSpacing: "-0.025em",
                color: T.text,
                margin: "0 0 16px",
              }}
            >
              Run Every Franchise Unit Like Your Best One
            </h2>
            <p
              style={{
                fontSize: 15,
                color: T.subtle,
                lineHeight: 1.65,
                margin: "0 0 36px",
              }}
            >
              Ezra is live today with 110+ active franchise locations. Loss
              prevention, employee scheduling, inventory, CRM, and sales
              dashboard — in one AI platform, on top of the systems you already
              use.
            </p>
            <div
              style={{
                display: "flex",
                gap: 12,
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <Link
                href="/contact"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  padding: "12px 28px",
                  borderRadius: 8,
                  background: `linear-gradient(135deg, ${T.cyan}, ${T.cyanD})`,
                  color: T.bg,
                  fontSize: 14,
                  fontWeight: 700,
                  textDecoration: "none",
                  letterSpacing: "-0.01em",
                }}
              >
                Request a Demo
              </Link>
              <a
                href="mailto:onboarding@meetezra.bot"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  padding: "12px 28px",
                  borderRadius: 8,
                  border: `1px solid ${T.border}`,
                  color: T.subtle,
                  fontSize: 14,
                  fontWeight: 500,
                  textDecoration: "none",
                }}
              >
                Talk to the team →
              </a>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
