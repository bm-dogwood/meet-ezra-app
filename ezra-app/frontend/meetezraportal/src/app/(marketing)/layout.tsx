// ===========================================
// EZRA PORTAL - Marketing Layout
// ===========================================

import type { Metadata } from "next";
import "@/app/(marketing)/styles.css";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";

export const metadata: Metadata = {
  metadataBase: new URL("https://meetezra.bot"),
  title: {
    default: "Ezra — AI Franchise Management: Loss Prevention, CRM, Scheduling & Sales Dashboard",
    template: "%s | Ezra",
  },
  description:
    "Ezra is the AI platform for franchise and small business operators. Automate loss prevention, employee scheduling, CRM, inventory, and sales dashboard—save money and stop employee theft across every unit.",
  keywords: [
    // Core brand
    "franchise AI",
    "franchise automation",
    "franchise software",
    "franchise management software",
    // Loss prevention & theft
    "loss prevention",
    "employee theft",
    "shrinkage",
    "shrinkage prevention",
    "employee theft detection",
    // Operations
    "employee scheduling",
    "automate franchise operations",
    "franchise inventory",
    "inventory management",
    // Revenue & CRM
    "CRM",
    "franchise CRM",
    "sales dashboard",
    "franchise sales intelligence",
    // Financial
    "save money franchise",
    "reduce shrinkage",
    "franchise cost savings",
    // Scale
    "multi-unit",
    "multi-unit operations",
    "multi-unit franchise",
    "small business",
    "small business franchise software",
    // Dashboard
    "dashboard",
    "franchise dashboard",
    "AI dashboard",
    // General AI
    "AI",
    "AI automation",
    "artificial intelligence franchise",
  ],
  openGraph: {
    siteName: "Ezra — Franchise Intelligence Platform",
    type: "website",
    images: [
      {
        url: "/og/default.png",
        width: 1200,
        height: 630,
        alt: "Ezra — AI Automation for Franchise Operations",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {" "}
      <Header />
      {children}
      <Footer />
    </>
  );
}
