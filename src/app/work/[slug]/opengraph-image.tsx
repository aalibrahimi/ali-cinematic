import { ImageResponse } from "next/og";
import { WORK } from "@/lib/work";

/**
 * Per-case-study OG image — dynamically generated based on the slug.
 * When anyone shares a case study URL on Twitter/LinkedIn/iMessage,
 * the preview card auto-renders with that project's name, accent
 * color, and metadata. Massive social proof multiplier.
 *
 * Each project's OG card uses its accent color in the period after
 * the name, the eyebrow dot, and a soft accent radial wash on the
 * bottom edge. Otherwise the design follows the default OG (same
 * brand mark, same proportions) so all share cards feel like a set.
 */

// export const runtime = "edge";
export const alt = "Case study";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export async function generateImageMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = WORK.find((w) => w.slug === slug);
  // *This is for when building the project and no Slug is provided, NextJs needs an ID for each Metadata
  const fallBackID = Date.now().toString().slice(0, 10);
  return [{ alt: item?.name ?? "Case study", size, contentType, id: slug ?? fallBackID }];
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = WORK.find((w) => w.slug === slug);
  if (!item) return new ImageResponse(<div>Not found</div>, size);

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
        {/* Bottom-edge accent wash — uses this project's color */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `radial-gradient(ellipse 70% 40% at 50% 100%, ${item.accent}40 0%, transparent 70%)`,
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
            width={32}
            height={32}
            fill="none"
            stroke="#a1a1a6"
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M 6 42 L 24 6 L 42 42" />
            <path d="M 13 30 L 35 30" />
            <circle cx={24} cy={6} r={3} fill={item.accent} stroke="none" />
          </svg>
          <span
            style={{
              fontSize: 18,
              fontWeight: 500,
              letterSpacing: "-0.01em",
              color: "#a1a1a6",
            }}
          >
            Ali Alibrahimi · Case study
          </span>
        </div>

        {/* Eyebrow row — index · year · role */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            marginTop: 56,
            zIndex: 1,
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: 9999,
              background: item.accent,
            }}
          />
          <span
            style={{
              fontSize: 16,
              fontFamily: "monospace",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: item.accent,
            }}
          >
            {item.index}
          </span>
          <span style={{ fontSize: 16, color: "#6e6e73" }}>·</span>
          <span
            style={{
              fontSize: 16,
              fontFamily: "monospace",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#6e6e73",
            }}
          >
            {item.year}
          </span>
        </div>

        {/* Project name + accent period */}
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            marginTop: 24,
            zIndex: 1,
          }}
        >
          <span
            style={{
              fontSize: 132,
              fontWeight: 700,
              letterSpacing: "-0.04em",
              lineHeight: 0.92,
            }}
          >
            {item.name}
          </span>
          <span
            style={{
              fontSize: 132,
              fontWeight: 700,
              color: item.accent,
              letterSpacing: "-0.04em",
              lineHeight: 0.92,
            }}
          >
            .
          </span>
        </div>

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Summary */}
        <div
          style={{
            display: "flex",
            fontSize: 26,
            color: "#a1a1a6",
            letterSpacing: "-0.005em",
            maxWidth: "70%",
            lineHeight: 1.3,
            zIndex: 1,
          }}
        >
          {item.summary}
        </div>

        {/* Bottom row — kind */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginTop: 32,
            zIndex: 1,
          }}
        >
          <span
            style={{
              fontSize: 14,
              fontFamily: "monospace",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#6e6e73",
            }}
          >
            / {item.kind}
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
