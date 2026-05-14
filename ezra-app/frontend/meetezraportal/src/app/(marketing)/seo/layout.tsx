/**
 * src/app/(marketing)/layout.tsx
 * -------------------------------------------------
 * Shared layout shell for all SEO landing pages.
 * Wraps pages with a lightweight nav and footer—
 * styled separately in globals.css.
 */

import type { Metadata } from "next";
import Link from "next/link";
import "@/app/(marketing)/marketing.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://meetezra.bot"),
  title: {
    default: "Ezra — Franchise Intelligence Platform",
    template: "%s | Ezra",
  },
  description:
    "AI-powered operating intelligence for multi-unit franchise operators. Loss prevention, inventory, scheduling, CRM, and sales—in one unified platform.",
  openGraph: {
    siteName: "Ezra — Franchise Intelligence Platform",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

// High-priority internal links surfaced in the nav
const NAV_LINKS = [
  { href: "/seo/franchise-ai-loss-prevention", label: "Loss Prevention" },
  { href: "/seo/franchise-crm-dashboard", label: "CRM" },
  { href: "/seo/employee-scheduling-franchise-software", label: "Scheduling" },
  { href: "/seo/multi-unit-sales-dashboard", label: "Sales" },
  { href: "/seo/ai-inventory-management-franchise", label: "Inventory" },
];

const FOOTER_LINKS = {
  "Loss Prevention": [
    { href: "/seo/franchise-ai-loss-prevention", label: "AI Loss Prevention" },
    {
      href: "/seo/franchise-loss-prevention-software",
      label: "Loss Prevention Software",
    },
    {
      href: "/seo/employee-theft-detection-franchise",
      label: "Employee Theft Detection",
    },
    {
      href: "/seo/shrinkage-prevention-software",
      label: "Shrinkage Prevention",
    },
    {
      href: "/seo/franchise-void-and-discount-monitoring",
      label: "Void & Discount Monitoring",
    },
    {
      href: "/seo/multi-unit-loss-prevention-ai",
      label: "Multi-Unit Loss Prevention",
    },
    {
      href: "/seo/detect-employee-theft-small-business",
      label: "Small Business Theft Detection",
    },
  ],
  "Inventory & Supply": [
    {
      href: "/seo/ai-inventory-management-franchise",
      label: "AI Inventory Management",
    },
    {
      href: "/seo/franchise-inventory-dashboard",
      label: "Inventory Dashboard",
    },
    {
      href: "/seo/shrinkage-prevention-software",
      label: "Shrinkage Prevention",
    },
    { href: "/seo/reduce-shrinkage-franchise", label: "Reduce Shrinkage" },
    {
      href: "/seo/franchise-supply-cost-intelligence",
      label: "Supply Cost Intelligence",
    },
    {
      href: "/seo/small-business-inventory-ai",
      label: "Small Business Inventory AI",
    },
  ],
  "Scheduling & Labor": [
    {
      href: "/seo/employee-scheduling-franchise-software",
      label: "Scheduling Software",
    },
    {
      href: "/seo/ai-employee-scheduling-for-franchises",
      label: "AI Scheduling",
    },
    { href: "/seo/franchise-labor-optimization", label: "Labor Optimization" },
    { href: "/seo/franchise-overtime-detection", label: "Overtime Detection" },
    {
      href: "/seo/automate-franchise-scheduling",
      label: "Automate Scheduling",
    },
  ],
  "CRM & Retention": [
    { href: "/seo/franchise-crm-dashboard", label: "CRM Dashboard" },
    { href: "/seo/automate-franchise-crm", label: "Automate CRM" },
    { href: "/seo/ai-crm-for-franchises", label: "AI CRM" },
    {
      href: "/seo/franchise-customer-retention-software",
      label: "Retention Software",
    },
  ],
  "Sales & Platform": [
    {
      href: "/seo/multi-unit-sales-dashboard",
      label: "Multi-Unit Sales Dashboard",
    },
    { href: "/seo/sales-intelligence-franchise", label: "Sales Intelligence" },
    {
      href: "/seo/franchise-revenue-intelligence",
      label: "Revenue Intelligence",
    },
    { href: "/seo/franchise-dashboard-software", label: "Franchise Dashboard" },
    { href: "/seo/multi-unit-business-software", label: "Multi-Unit Software" },
    { href: "/seo/franchise-ai-platform", label: "Franchise AI Platform" },
    {
      href: "/seo/franchise-automation-software",
      label: "Automation Software",
    },
    {
      href: "/seo/pos-agnostic-franchise-software",
      label: "POS-Agnostic Software",
    },
    {
      href: "/seo/franchise-software-small-business",
      label: "Small Business Software",
    },
    {
      href: "/seo/save-money-franchise-operations",
      label: "Save Money on Operations",
    },
  ],
};

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="marketing-layout">
      {/* ── Top nav ── */}
      <header className="marketing-nav" role="banner">
        <div className="nav-inner">
          <Link href="/" className="nav-logo" aria-label="Ezra home">
            <span className="logo-mark">ezra</span>
            <span className="logo-dot">.</span>
          </Link>

          <nav aria-label="Primary navigation">
            <ul className="nav-links">
              {NAV_LINKS.map(({ href, label }) => (
                <li key={href}>
                  <Link href={href}>{label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="nav-cta">
            <a href="mailto:onboarding@meetezra.bot" className="btn-primary">
              Get Early Access
            </a>
          </div>
        </div>
      </header>

      {/* ── Page content ── */}
      <div className="marketing-content">{children}</div>

      {/* ── Footer ── */}
      <footer className="marketing-footer" role="contentinfo">
        <div className="footer-inner">
          <div className="footer-brand">
            <Link href="/" className="nav-logo">
              <span className="logo-mark">ezra</span>
              <span className="logo-dot">.</span>
            </Link>
            <p className="footer-tagline">
              AI operating intelligence for multi-unit franchise operators.
            </p>
            <address className="footer-contact">
              <a href="mailto:onboarding@meetezra.bot">
                onboarding@meetezra.bot
              </a>
            </address>
          </div>

          <nav aria-label="Footer navigation" className="footer-nav">
            {Object.entries(FOOTER_LINKS).map(([category, links]) => (
              <div key={category} className="footer-col">
                <h3 className="footer-col-heading">{category}</h3>
                <ul>
                  {links.map(({ href, label }) => (
                    <li key={href}>
                      <Link href={href}>{label}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="footer-bottom">
          <p>
            &copy; {new Date().getFullYear()} Franchise AI, LLC dba Ezra AI. All
            rights reserved.
          </p>
          <nav aria-label="Legal links">
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
