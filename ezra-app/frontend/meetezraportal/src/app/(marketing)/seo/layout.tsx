import type { Metadata } from "next";
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

// The shared Header and Footer are injected by the parent (marketing)/layout.tsx.
// This layout only adds the 64px top offset for the fixed header.
export default function SeoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="seo-page-wrapper">{children}</div>;
}
