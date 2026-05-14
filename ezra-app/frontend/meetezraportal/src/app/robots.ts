/**
 * src/app/robots.ts
 * -------------------------------------------------
 * Generates /robots.txt via Next.js Metadata API.
 * Blocks authenticated app shell, API, and admin routes.
 */

import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/app/",
          "/api/",
          "/admin/",
          "/login",
          "/signup",
          "/sign-up",
          "/register",
          "/reset-password",
          "/forgot-password",
          "/verify",
          "/verify-email",
          "/onboarding",
          "/settings",
          "/account",
          "/billing",
          "/_next/",
        ],
      },
      // Allow Google AdsBot to crawl for ad quality (does not trigger robots.txt by default)
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/app/", "/api/", "/admin/"],
      },
    ],
    sitemap: "https://meetezra.bot/sitemap.xml",
    host: "https://meetezra.bot",
  };
}
