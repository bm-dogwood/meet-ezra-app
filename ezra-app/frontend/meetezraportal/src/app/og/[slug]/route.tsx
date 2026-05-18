import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export function GET(
  _req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const rawSlug = params.slug.replace(/\.png$/, "");
  const isDefault = rawSlug === "default" || rawSlug === "";

  const title = isDefault
    ? "AI Automation for Franchise Operations"
    : rawSlug
        .replace(/-/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());

  const fontSize = title.length > 50 ? 40 : title.length > 35 ? 48 : 56;

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: "100%",
          height: "100%",
          background: "linear-gradient(135deg, #0f172a 0%, #0f172a 60%, #1e3a5f 100%)",
          padding: "60px 72px",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* Logo row */}
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <div
            style={{
              width: "52px",
              height: "52px",
              borderRadius: "13px",
              background: "linear-gradient(135deg, #60a5fa, #2563eb)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "26px",
              fontWeight: 700,
              color: "white",
            }}
          >
            E
          </div>
          <span style={{ color: "white", fontSize: "26px", fontWeight: 600, letterSpacing: "-0.5px" }}>
            Ezra
          </span>
        </div>

        {/* Main content */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div
            style={{
              color: "white",
              fontSize: `${fontSize}px`,
              fontWeight: 700,
              lineHeight: 1.15,
              letterSpacing: "-1px",
              maxWidth: "900px",
            }}
          >
            {title}
          </div>
          <div style={{ color: "#94a3b8", fontSize: "22px", fontWeight: 400 }}>
            meetezra.bot — Franchise Intelligence Platform
          </div>
        </div>

        {/* Blue bottom accent bar */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "5px",
            background: "linear-gradient(90deg, #1d4ed8, #3b82f6, #93c5fd)",
          }}
        />
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
