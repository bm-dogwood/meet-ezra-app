import type { Metadata } from "next";
import BlogIndexClient from "./BlogIndexClient";

export const metadata: Metadata = {
  title: "Blog — Franchise AI Insights & Operational Intelligence",
  description:
    "Practical guides and analysis for franchise operators: loss prevention, AI scheduling, multi-unit analytics, CRM, and scaling strategies from the Ezra team.",
  openGraph: {
    title: "Blog — Franchise AI Insights | Ezra",
    description:
      "Practical guides for franchise operators on loss prevention, AI scheduling, multi-unit analytics, CRM, and scaling strategies.",
    type: "website",
  },
};

export default function BlogPage() {
  return <BlogIndexClient />;
}
