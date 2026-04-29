"use client";

import { useEffect } from "react";

/**
 * ServiceWorkerRegister — registers public/sw.js on mount.
 *
 * Mounted in the root layout. Only does anything in production
 * builds — registering the SW in dev would conflict with Next.js
 * Turbopack HMR (the SW would intercept HMR requests and
 * mysteriously freeze hot reload).
 *
 * Errors are swallowed silently — if registration fails (e.g.
 * unsupported browser), the site still works fine, just without
 * offline caching.
 */
export function ServiceWorkerRegister() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator)) return;

    // Defer registration until after the first paint so it doesn't
    // compete with critical assets for bandwidth.
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("/sw.js", { scope: "/" })
        .catch(() => {
          /* swallowed — offline is a nice-to-have, not a hard requirement */
        });
    });
  }, []);

  return null;
}
