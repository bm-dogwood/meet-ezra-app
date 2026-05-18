/**
 * src/app/sitemap.ts
 * -------------------------------------------------
 * Auto-generates the XML sitemap for meetezra.bot.
 *
 * Rules:
 *  ✅ Includes all /app/(marketing)/* pages
 *  ✅ Includes /blog/* pages (dynamic, fetched from CMS or filesystem)
 *  ❌ Excludes /app/* (authenticated app shell)
 *  ❌ Excludes /api/* routes
 *  ❌ Excludes auth routes (/login, /signup, /reset-password, /verify)
 *  ❌ Excludes private/admin routes
 *
 * Adding a new marketing page:
 *  1. Create the folder under src/app/(marketing)/your-slug/
 *  2. Add a page.tsx with exported `metadata`
 *  3. This file auto-discovers it — no manual update needed.
 *
 * Adding blog pages:
 *  Update `getBlogSlugs()` to pull from your CMS / filesystem.
 */

import { MetadataRoute } from "next";
import fs from "fs";
import path from "path";

const BASE_URL = "https://meetezra.bot";

// ── Auth / private route blocklist ─────────────────────────────────────────
const EXCLUDED_SEGMENTS = new Set([
  "login",
  "signup",
  "sign-up",
  "register",
  "reset-password",
  "forgot-password",
  "verify",
  "verify-email",
  "onboarding",
  "dashboard",
  "settings",
  "account",
  "billing",
  "admin",
  "api",
  "app",
  "_next",
  "404",
  "500",
]);

// ── Static marketing pages ─────────────────────────────────────────────────
const STATIC_MARKETING_PAGES: MetadataRoute.Sitemap = [
  {
    url: BASE_URL,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 1.0,
  },
  {
    url: `${BASE_URL}/about`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  },
  {
    url: `${BASE_URL}/features`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.9,
  },
  {
    url: `${BASE_URL}/solutions`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.8,
  },
  {
    url: `${BASE_URL}/platform`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.8,
  },
  {
    url: `${BASE_URL}/bots`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.8,
  },
  {
    url: `${BASE_URL}/blog`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 0.8,
  },
  {
    url: `${BASE_URL}/contact`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.6,
  },
  {
    url: `${BASE_URL}/privacy`,
    lastModified: new Date(),
    changeFrequency: "yearly",
    priority: 0.3,
  },
  {
    url: `${BASE_URL}/terms`,
    lastModified: new Date(),
    changeFrequency: "yearly",
    priority: 0.3,
  },
];

// ── Auto-discover SEO landing pages ───────────────────────────────────────
// All SEO pages live under src/app/(marketing)/seo/{slug}/page.tsx
// and are served at https://meetezra.bot/seo/{slug}
function discoverMarketingPages(): MetadataRoute.Sitemap {
  const seoDir = path.join(
    process.cwd(),
    "src",
    "app",
    "(marketing)",
    "seo"
  );

  if (!fs.existsSync(seoDir)) {
    console.warn("[sitemap] (marketing)/seo directory not found — skipping auto-discovery");
    return [];
  }

  const entries = fs.readdirSync(seoDir, { withFileTypes: true });

  return entries
    .filter((entry) => {
      // Must be a directory
      if (!entry.isDirectory()) return false;
      // Skip route groups and private folders
      if (entry.name.startsWith("(") || entry.name.startsWith("_")) return false;
      // Skip excluded segments
      if (EXCLUDED_SEGMENTS.has(entry.name)) return false;
      // Must contain a page.tsx or page.mdx
      const hasPage =
        fs.existsSync(path.join(seoDir, entry.name, "page.tsx")) ||
        fs.existsSync(path.join(seoDir, entry.name, "page.mdx")) ||
        fs.existsSync(path.join(seoDir, entry.name, "page.jsx"));
      return hasPage;
    })
    .map((entry) => {
      const pagePath = path.join(seoDir, entry.name, "page.tsx");
      const stat = fs.existsSync(pagePath)
        ? fs.statSync(pagePath)
        : { mtime: new Date() };

      return {
        url: `${BASE_URL}/seo/${entry.name}`,
        lastModified: stat.mtime,
        changeFrequency: "monthly" as const,
        priority: 0.8,
      };
    });
}

// ── Blog pages ─────────────────────────────────────────────────────────────
// Replace this with your CMS fetch or filesystem scan.
async function getBlogSlugs(): Promise<{ slug: string; updatedAt: Date }[]> {
  // ── Option A: filesystem-based MDX blog ──────────────────────────────
  const blogDir = path.join(process.cwd(), "src", "content", "blog");
  if (fs.existsSync(blogDir)) {
    return fs
      .readdirSync(blogDir)
      .filter((f) => f.endsWith(".mdx") || f.endsWith(".md"))
      .map((f) => ({
        slug: f.replace(/\.(mdx|md)$/, ""),
        updatedAt: fs.statSync(path.join(blogDir, f)).mtime,
      }));
  }

  // ── Option B: headless CMS fetch (uncomment and adapt) ───────────────
  // const res = await fetch(`${process.env.CMS_URL}/api/posts?fields=slug,updatedAt`, {
  //   next: { revalidate: 3600 },
  // });
  // const { posts } = await res.json();
  // return posts.map((p: any) => ({ slug: p.slug, updatedAt: new Date(p.updatedAt) }));

  // ── Fallback: no blog posts yet ──────────────────────────────────────
  return [];
}

// ── Main sitemap export ────────────────────────────────────────────────────
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const marketingPages = discoverMarketingPages();

  const blogSlugs = await getBlogSlugs();
  const blogPages: MetadataRoute.Sitemap = blogSlugs.map(({ slug, updatedAt }) => ({
    url: `${BASE_URL}/blog/${slug}`,
    lastModified: updatedAt,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const allPages: MetadataRoute.Sitemap = [
    ...STATIC_MARKETING_PAGES,
    ...marketingPages,
    ...blogPages,
  ];

  // Deduplicate by URL (static pages take precedence over auto-discovered)
  const seen = new Set<string>();
  return allPages.filter(({ url }) => {
    if (seen.has(url)) return false;
    seen.add(url);
    return true;
  });
}
