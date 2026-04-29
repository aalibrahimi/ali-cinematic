import { ImageResponse } from "next/og";

/**
 * Dynamic PWA icon — Next.js App Router auto-serves this at /icon
 * in the sizes declared below. The "A" mark matches the BrandMark
 * SVG shown elsewhere in the app, rendered at 192×192 with the
 * Apple system blue accent on the canvas background.
 *
 * Using ImageResponse means we never have to ship a binary PNG —
 * Next renders the icon on-demand from JSX. Same approach Apple
 * uses for their dynamic asset pipelines.
 */

export const runtime = "edge";
export const size = { width: 192, height: 192 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#000000",
          borderRadius: 32,
        }}
      >
        <svg
          viewBox="0 0 48 48"
          width={140}
          height={140}
          fill="none"
          stroke="#f5f5f7"
          strokeWidth={4}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M 6 42 L 24 6 L 42 42" />
          <path d="M 13 30 L 35 30" />
          {/* Apple-blue accent dot — single beat of color */}
          <circle cx={24} cy={6} r={3.5} fill="#0a84ff" stroke="none" />
        </svg>
      </div>
    ),
    { ...size }
  );
}
