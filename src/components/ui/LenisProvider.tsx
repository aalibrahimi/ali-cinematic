"use client";

import { ReactLenis } from "lenis/react";
import { LENIS_CONFIG } from "@/lib/motion";
import type { ReactNode } from "react";

/**
 * LenisProvider — wraps the entire app with Lenis-driven smooth scroll.
 *
 * Why we need Lenis:
 *   On macOS Safari, trackpad scrolling is already silky — Apple
 *   handles the inertia + smoothing natively. But on Chrome and
 *   Firefox the wheel/trackpad scroll feels choppier by comparison,
 *   and the difference is jarring on a portfolio that wants to feel
 *   "Apple-tier" everywhere. Lenis bridges that gap by virtualizing
 *   the scroll position with a smooth interpolation.
 *
 * Why it doesn't hurt Safari:
 *   Lenis uses requestAnimationFrame to interpolate the scroll
 *   position. Safari's natural scrolling still runs underneath; Lenis
 *   just smooths the position used by JS observers (motion's
 *   useScroll, IntersectionObservers, etc.). The user-visible scroll
 *   stays Safari-native.
 *
 * The `root` prop applies Lenis to the <html> element so every scroll
 * everywhere on the page goes through it — required for motion's
 * useScroll() hook to read the smoothed position.
 *
 * Reduced-motion: Lenis respects `prefers-reduced-motion` automatically,
 * so users who've opted out get instant native scroll.
 */
export function LenisProvider({ children }: { children: ReactNode }) {
  return (
    <ReactLenis root options={LENIS_CONFIG}>
      {children}
    </ReactLenis>
  );
}
