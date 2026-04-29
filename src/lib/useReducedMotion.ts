"use client";

import { useEffect, useState } from "react";

/**
 * useReducedMotion — wraps the prefers-reduced-motion media query.
 *
 * Returns `true` when the user has the OS-level "reduce motion"
 * setting on (System Settings → Accessibility → Display on macOS;
 * Settings → Accessibility → Motion on iOS).
 *
 * Used by motion-driven components to switch off the choreography
 * — no parallax, no slide-in cascades, no count-up animations.
 * Content still appears (we don't hide it), it just appears
 * instantly with opacity 1.
 *
 * Lenis already respects this setting natively, so smooth scroll
 * is handled. This hook covers everything else.
 *
 * SSR-safe: returns false on the server (no reduced motion until
 * we know better), then updates on hydration.
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);

    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return reduced;
}
