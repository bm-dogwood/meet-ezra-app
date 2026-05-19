// Blog post metadata — content lives in src/lib/blog-content.tsx

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  category: string;
  categoryColor: string;
  readTime: number;
  publishedAt: string; // ISO date string
  author: {
    name: string;
    role: string;
  };
  tags: string[];
  featured?: boolean;
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "how-ai-detects-employee-theft-in-franchises",
    title: "How AI Detects Employee Theft Before It Costs You Thousands",
    description:
      "Traditional loss prevention is reactive. By the time inventory audits reveal a gap, the damage is done. Here's how behavioral AI catches employee theft in real time — before it compounds across locations.",
    category: "Loss Prevention",
    categoryColor: "#EF4444",
    readTime: 8,
    publishedAt: "2026-05-15",
    author: { name: "Ezra Team", role: "Franchise Intelligence" },
    tags: ["loss prevention", "employee theft", "AI detection", "franchise security"],
    featured: true,
  },
  {
    slug: "true-cost-of-shrinkage-what-franchises-miss",
    title: "The True Cost of Shrinkage: What Franchise Operators Are Really Losing",
    description:
      "Shrinkage is bigger than your line item suggests. A 1% shrinkage rate at a 12% margin business destroys nearly 10% of your profit. Here's the full math — and why most operators are flying blind.",
    category: "Loss Prevention",
    categoryColor: "#EF4444",
    readTime: 6,
    publishedAt: "2026-05-08",
    author: { name: "Ezra Team", role: "Franchise Intelligence" },
    tags: ["shrinkage", "inventory loss", "franchise profitability", "loss prevention"],
    featured: false,
  },
  {
    slug: "ai-scheduling-franchise-labor-costs",
    title: "AI Scheduling: How Franchises Cut Labor Waste Without Cutting Hours",
    description:
      "Labor is your single largest controllable cost. At 10+ locations, gut-feel scheduling leaves money on the table every week. Here's what AI-driven labor forecasting actually looks like in practice.",
    category: "Operations",
    categoryColor: "#3B82F6",
    readTime: 7,
    publishedAt: "2026-04-29",
    author: { name: "Ezra Team", role: "Franchise Intelligence" },
    tags: ["employee scheduling", "labor costs", "AI scheduling", "franchise operations"],
    featured: false,
  },
  {
    slug: "franchise-crm-why-generic-tools-fail",
    title: "Why Generic CRMs Are Killing Franchise Sales (And What to Use Instead)",
    description:
      "Salesforce and HubSpot were built for software companies, not franchise networks. The lead routing, territory logic, and multi-unit reporting that franchises need simply aren't there.",
    category: "CRM & Sales",
    categoryColor: "#8B5CF6",
    readTime: 6,
    publishedAt: "2026-04-22",
    author: { name: "Ezra Team", role: "Franchise Intelligence" },
    tags: ["franchise CRM", "sales automation", "lead management", "multi-unit sales"],
    featured: false,
  },
  {
    slug: "multi-unit-franchise-operations-visibility",
    title: "The Visibility Problem: Why Multi-Unit Operators Can't See What's Really Happening",
    description:
      "At 5 locations you can still feel the pulse. At 15 you're managing spreadsheets. At 30 you're flying blind. Operational intelligence is not the same thing as a POS dashboard.",
    category: "Analytics",
    categoryColor: "#06B6D4",
    readTime: 7,
    publishedAt: "2026-04-14",
    author: { name: "Ezra Team", role: "Franchise Intelligence" },
    tags: ["franchise analytics", "multi-unit operations", "operational intelligence", "POS data"],
    featured: false,
  },
  {
    slug: "scaling-franchise-operations-ai-guide",
    title: "The Franchisor's AI Stack: Scaling from 10 to 100+ Locations",
    description:
      "AI is no longer a competitive advantage for franchise networks — it's the baseline. Here's the technology infrastructure and implementation sequence that separates operators who scale cleanly from those who hit a wall at 30 units.",
    category: "Strategy",
    categoryColor: "#10B981",
    readTime: 9,
    publishedAt: "2026-04-07",
    author: { name: "Ezra Team", role: "Franchise Intelligence" },
    tags: ["franchise scaling", "AI strategy", "franchise tech stack", "franchise growth"],
    featured: false,
  },
];

export function getPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}

export function getFeaturedPost(): BlogPost {
  return BLOG_POSTS.find((p) => p.featured) ?? BLOG_POSTS[0];
}

export function getRecentPosts(excludeSlug?: string, limit = 3): BlogPost[] {
  return BLOG_POSTS.filter((p) => p.slug !== excludeSlug).slice(0, limit);
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
