"use client";

import dynamic from "next/dynamic";

/**
 * Hero3DLoader — client-only loader for the Spline hero scene.
 *
 * Spline can't render on the server (no `window`, no canvas API),
 * so we dynamic-import with `ssr: false`. Now also includes a
 * visible loading indicator and a failure hook — without these, a
 * missing @splinetool/react-spline package would silently render
 * nothing (no loading state, no error, just an empty hero) and
 * make debugging impossible.
 *
 * If you see "BOOTSTRAPPING 3D SCENE" stuck on screen forever:
 *   - The dynamic import is hanging
 *   - Most likely @splinetool/react-spline isn't installed
 *   - Run `bun install` in the project root
 */

const Hero3D = dynamic(
  () => import("./Hero3D").then((mod) => ({ default: mod.Hero3D })),
  {
    ssr: false,
    // Visible while the Hero3D chunk loads (and indefinitely if it
    // fails to load due to missing dep). No more silent emptiness.
    loading: () => (
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-0">
        <p className="text-xs font-mono text-[var(--color-ink-3)] tracking-widest opacity-50">
          BOOTSTRAPPING 3D SCENE…
        </p>
      </div>
    ),
  }
);

export function Hero3DLoader() {
  return <Hero3D />;
}
