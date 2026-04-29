import { ImageResponse } from "next/og";

/**
 * Default OG image — used by /, /work, /about, and any route that
 * doesn't define its own opengraph-image. Renders at 1200x630 (the
 * canonical Twitter/Facebook share-card size).
 *
 * Generated on-demand via Edge runtime, then cached. No PNG asset
 * shipping needed; if the design changes, redeploy and the new
 * version is served.
 *
 * Visual: black canvas, brand mark "A" top-left, big serif name in
 * the middle, blue accent dot, tagline below, accent radial wash
 * along the bottom edge for a cinematic finish.
 */

export const runtime = "edge";
export const alt = "Ali Alibrahimi — Software Designer + Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "#000000",
          color: "#f5f5f7",
          padding: "72px",
          position: "relative",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        {/* Bottom-edge accent wash */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse 70% 40% at 50% 100%, rgba(10, 132, 255, 0.25) 0%, transparent 70%)",
          }}
        />

        {/* Brand mark — top-left */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            zIndex: 1,
          }}
        >
          <svg
            viewBox="0 0 48 48"
            width={36}
            height={36}
            fill="none"
            stroke="#f5f5f7"
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M 6 42 L 24 6 L 42 42" />
            <path d="M 13 30 L 35 30" />
            <circle cx={24} cy={6} r={3} fill="#0a84ff" stroke="none" />
          </svg>
          <span
            style={{
              fontSize: 22,
              fontWeight: 500,
              letterSpacing: "-0.01em",
            }}
          >
            Ali Alibrahimi
          </span>
        </div>

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Big name + accent period */}
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            zIndex: 1,
          }}
        >
          <span
            style={{
              fontSize: 156,
              fontWeight: 700,
              letterSpacing: "-0.04em",
              lineHeight: 0.92,
            }}
          >
            Ali
          </span>
          <span
            style={{
              fontSize: 156,
              fontWeight: 700,
              color: "#0a84ff",
              letterSpacing: "-0.04em",
              lineHeight: 0.92,
            }}
          >
            .
          </span>
        </div>

        {/* Tagline */}
        <div
          style={{
            display: "flex",
            marginTop: 28,
            fontSize: 28,
            color: "#a1a1a6",
            letterSpacing: "-0.005em",
            zIndex: 1,
          }}
        >
          Software designer and engineer.
        </div>

        {/* Bottom row — eyebrow */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginTop: 44,
            zIndex: 1,
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: 9999,
              background: "#0a84ff",
            }}
          />
          <span
            style={{
              fontSize: 16,
              fontFamily: "monospace",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#6e6e73",
            }}
          >
            Portfolio · 2026
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
