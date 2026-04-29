import { ImageResponse } from "next/og";

/**
 * Apple touch icon — 180×180, served at /apple-icon. iOS uses this
 * when you "Add to Home Screen". Slightly larger glyph than the
 * standard /icon to fill iOS's rounded-rect well.
 */

export const runtime = "edge";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
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
        }}
      >
        <svg
          viewBox="0 0 48 48"
          width={130}
          height={130}
          fill="none"
          stroke="#f5f5f7"
          strokeWidth={4}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M 6 42 L 24 6 L 42 42" />
          <path d="M 13 30 L 35 30" />
          <circle cx={24} cy={6} r={3.5} fill="#0a84ff" stroke="none" />
        </svg>
      </div>
    ),
    { ...size }
  );
}
