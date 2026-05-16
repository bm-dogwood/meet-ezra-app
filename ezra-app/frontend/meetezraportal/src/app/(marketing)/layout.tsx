// ===========================================
// EZRA PORTAL - Marketing Layout
// ===========================================

import type { Metadata } from "next";
import "@/app/(marketing)/styles.css";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";

export const metadata: Metadata = {
  title: "Ezra - AI Automation for Franchise Operations",
  description:
    "Enterprise AI automation platform for franchisors, franchisees, and multi-unit operators. Universal POS integration.",
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
