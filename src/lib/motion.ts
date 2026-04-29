/**
 * Motion vocabulary — single source of truth for the site's
 * animation language.
 *
 * The values here aren't arbitrary. They mirror the easing curves
 * Apple uses in their product pages, sampled by inspecting their
 * production CSS. Using one set of constants across every component
 * keeps the entire site moving in the same "rhythm" — the difference
 * between "lots of animations" and "a coherent motion language."
 */

import type { Easing } from "motion/react";

/**
 * APPLE_EASE — the signature smooth-out curve used on Apple.com.
 * cubic-bezier(0.32, 0.72, 0, 1) — heavier deceleration than the
 * standard "ease-out", which makes it feel "settled in" rather than
 * "stopped." Use this for entrance animations, layout shifts, and
 * any motion that should feel deliberate.
 */
export const APPLE_EASE: Easing = [0.32, 0.72, 0, 1];

/**
 * APPLE_EASE_QUICK — for fast micro-interactions (nav scroll glass
 * toggle, button hover). Snappier without feeling jittery.
 */
export const APPLE_EASE_QUICK: Easing = [0.4, 0, 0.2, 1];

/**
 * APPLE_BOUNCE — spring config for hover/press states. Gentle
 * overshoot that settles in ~250ms. Tuned for buttons + magnetic
 * effects.
 */
export const APPLE_BOUNCE = {
  type: "spring" as const,
  stiffness: 120,
  damping: 22,
  mass: 0.8,
};

/**
 * APPLE_BOUNCE_SOFT — looser spring for larger elements (cards,
 * dragged surfaces). Settles in ~400ms with a softer overshoot.
 */
export const APPLE_BOUNCE_SOFT = {
  type: "spring" as const,
  stiffness: 80,
  damping: 26,
  mass: 1,
};

/**
 * REVEAL_DURATION + REVEAL_Y — the standard "section enters viewport"
 * reveal. 900ms with a 24px upward translate. Used by the Reveal
 * primitive across every section.
 */
export const REVEAL_DURATION = 0.9;
export const REVEAL_Y = 24;

/**
 * HERO_SEQUENCE — the choreographed timing for the hero arrival.
 * Total length: 2.4s. Each value is a delay in seconds.
 */
export const HERO_SEQUENCE = {
  brandMark: 0.2,
  nameStart: 0.6,
  nameStagger: 0.04, // per-letter
  italicStart: 0.85,
  italicStagger: 0.04,
  subtitle: 1.4,
  scrollCue: 1.8,
} as const;

/**
 * Lenis config — tuned to match Safari's natural scroll inertia on
 * macOS. The `easing` matches Apple's smooth-out curve translated to
 * a pure JS function (Lenis doesn't accept cubic-bezier strings).
 */
export const LENIS_CONFIG = {
  // lerp values 0.05–0.15 feel right; 0.1 matches Safari's natural
  // scroll smoothing well. Lower = more inertia, higher = snappier.
  lerp: 0.1,
  duration: 1.2,
  smoothWheel: true,
  // Easing for the scroll-to() programmatic function. Approximates
  // Apple's smooth-out: 1 - 2^(-10*t), clamped at 1.
  easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
} as const;
