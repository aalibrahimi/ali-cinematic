"use client";

import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { useRef } from "react";

/**
 * IntroStatement — pinned-scroll headline replacement (smooth).
 *
 * THE KEY MOVE that makes this feel Apple-tier:
 *   `useSpring` wrapping `scrollYProgress`. Without this, every scroll
 *   delta — from a trackpad twitch to a wheel tick — propagates
 *   immediately into the animation values, producing the "wonky /
 *   glitchy" feel of raw scroll-driven transforms. With the spring
 *   layered on top, the value used to drive transforms catches up to
 *   the scroll destination over ~300ms, smoothing every step into a
 *   silky ramp.
 *
 *   This is the single technique that separates Apple-quality scroll
 *   choreography from "framer-motion looks weird here" portfolios.
 *
 * Pattern (slide-up replacement):
 *   - Stage 1: visible 0–28%,   slides up + fades 28–40%.
 *   - Stage 2: slides in 28–40%, visible 40–60%, slides up 60–72%.
 *   - Stage 3: slides in 60–72%, visible 72–100%.
 *
 *   Wider transition windows (12% each instead of 10%) + spring
 *   smoothing means the handoffs read as continuous gradients, not
 *   "snap to next state."
 *
 * Layout: CSS Grid stacking (every stage at [grid-area:1/1]), so
 * stages sit in the same cell and we control visibility purely via
 * opacity + y. No absolute positioning, no layout collapse.
 */

const STAGES = [
  { number: "01", headline: "I design products." },
  { number: "02", headline: "I engineer systems." },
  { number: "03", headline: "I ship the whole thing." },
] as const;

export function IntroStatement() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  // ── The smoothing spring ────────────────────────────────────────
  // Tuned soft enough that a tiny scroll movement still produces a
  // continuous animation, but not so soft that it lags noticeably
  // behind the user's finger. These values approximate the inertia
  // of Apple's scrubbed product pages.
  //
  //  - stiffness 80      ─ medium tension, matches "settled" feel
  //  - damping 26        ─ no oscillation, just deceleration
  //  - mass 0.4          ─ light enough to follow scroll responsively
  //  - restDelta 0.0005  ─ stops the spring when it gets very close
  const progress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 26,
    mass: 0.4,
    restDelta: 0.0005,
  });

  // ── Per-stage transforms, all derived from `progress` ────────────
  // (NOT scrollYProgress). The spring layer is what makes everything
  // downstream look smooth.

  // Stage 1: visible at top, slides up + fades 28–40%.
  const o1 = useTransform(progress, [0, 0.28, 0.4], [1, 1, 0]);
  const y1 = useTransform(progress, [0, 0.28, 0.4], [0, 0, -50]);

  // Stage 2: enters from below 28–40%, holds 40–60%, leaves 60–72%.
  const o2 = useTransform(
    progress,
    [0.28, 0.4, 0.6, 0.72],
    [0, 1, 1, 0]
  );
  const y2 = useTransform(
    progress,
    [0.28, 0.4, 0.6, 0.72],
    [50, 0, 0, -50]
  );

  // Stage 3: enters from below 60–72%, holds for the rest.
  const o3 = useTransform(progress, [0.6, 0.72, 1], [0, 1, 1]);
  const y3 = useTransform(progress, [0.6, 0.72, 1], [50, 0, 0]);

  const opacities = [o1, o2, o3];
  const ys = [y1, y2, y3];

  return (
    <section
      ref={ref}
      className="relative h-[200vh]"
      aria-label="What I do"
    >
      <div className="sticky top-0 h-screen flex flex-col items-center justify-center overflow-hidden">
        {/* Subtle blue radial wash */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 50% 30% at 50% 50%, rgba(10, 132, 255, 0.06) 0%, transparent 60%)",
          }}
        />

        {/* Eyebrow stack — chapter labels */}
        <div className="grid place-items-center mb-10 md:mb-14">
          {STAGES.map((stage, i) => (
            <motion.div
              key={stage.number}
              style={{ opacity: opacities[i] }}
              className="[grid-area:1/1] flex items-center gap-2.5 whitespace-nowrap gpu"
            >
              <span className="size-1.5 rounded-full bg-[var(--color-accent)]" />
              <span className="type-eyebrow">
                Chapter / {stage.number}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Headline stack — slide-up replacement */}
        <div className="grid place-items-center w-full max-w-[1200px] px-6 md:px-12">
          {STAGES.map((stage, i) => (
            <motion.h2
              key={stage.number}
              style={{ opacity: opacities[i], y: ys[i] }}
              className="[grid-area:1/1] type-display-lg text-[var(--color-ink)] text-center max-w-[18ch] gpu"
            >
              {stage.headline}
            </motion.h2>
          ))}
        </div>

        {/* Bottom progress bar — also driven by smoothed progress so
            the bar's growth matches the headline rhythm. */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-[var(--color-divider-2)]">
          <motion.div
            style={{ scaleX: progress, transformOrigin: "left" }}
            className="h-full bg-[var(--color-accent)] gpu"
          />
        </div>
      </div>
    </section>
  );
}
