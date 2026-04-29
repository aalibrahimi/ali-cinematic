"use client";

import dynamic from "next/dynamic";

/**
 * Hero3DLoader — client-only loader for the WebGL hero scene.
 *
 * Three.js can't render on the server (no `window`, no canvas API),
 * so we dynamic-import with `ssr: false`. The component is now
 * scoped to the Hero section (mounted from inside Hero.tsx); it
 * positions itself absolutely within its parent, so it lives in the
 * hero only — not across the entire page.
 *
 * Falls back to nothing if WebGL is unsupported (older browsers,
 * users with WebGL disabled). The page is fully functional without
 * the centerpiece — pure visual enhancement.
 */
const Hero3D = dynamic(
  () => import("./Hero3D").then((mod) => ({ default: mod.Hero3D })),
  { ssr: false }
);

export function Hero3DLoader() {
  return <Hero3D />;
}
