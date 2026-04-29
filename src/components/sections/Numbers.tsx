"use client";

import {
  motion,
  useInView,
  useMotionValue,
  useTransform,
  animate,
} from "motion/react";
import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/lib/useReducedMotion";

/**
 * Numbers — four oversized stats with count-up animation.
 *
 * The count-up is driven by Framer Motion's imperative `animate()`
 * function applied to a `useMotionValue`. When the section enters the
 * viewport (`useInView` with margin: -25%), each value is animated
 * from 0 to its target over ~1.6s with Apple's signature ease.
 *
 * The displayed text is derived via `useTransform` formatting the
 * motion value to its display string. Locale-aware formatting handles
 * commas. The `+` suffix and "k" abbreviation are appended where the
 * source data calls for them.
 *
 * The visual layout is a 4-column grid on desktop (2 on tablet, 1 on
 * mobile). Each cell has the typography Apple uses on their Specs
 * pages: huge mono number on top, small caption underneath, hairline
 * dividers between cells.
 */

const STATS: Stat[] = [
  {
    value: 4,
    suffix: "",
    label: "Active projects",
    description: "Simplicity, CodeWithAli, Takeover, Sovereign",
  },
  {
    value: 120,
    suffix: "k+",
    label: "Lines shipped",
    description: "Frontend, backend, agents — all written, all reviewed",
  },
  {
    value: 0,
    suffix: "",
    label: "Downtime incidents",
    description: "On 4 years of solo-shipped production work",
  },
  {
    value: 100,
    suffix: "%",
    label: "Solo-led",
    description: "Design, engineering, infrastructure — all me",
  },
];

interface Stat {
  value: number;
  suffix: string;
  label: string;
  description: string;
}

export function Numbers() {
  return (
    <section className="relative section py-24 md:py-32 border-t border-[var(--color-divider)]">
      <div className="container-page">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 0.9, ease: [0.32, 0.72, 0, 1] }}
          className="mb-16 md:mb-20 max-w-3xl"
        >
          <p className="type-eyebrow text-[var(--color-accent)] mb-6 flex items-center gap-2.5">
            <span className="size-1.5 rounded-full bg-[var(--color-accent)]" />
            By the numbers
          </p>
          <h2 className="type-display-lg text-[var(--color-ink)]">
            Receipts, not <span className="italic">claims</span>.
          </h2>
        </motion.div>

        {/* 4-column grid on desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-[var(--color-divider)] border border-[var(--color-divider)] rounded-2xl overflow-hidden">
          {STATS.map((stat, i) => (
            <NumberCell key={stat.label} stat={stat} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * NumberCell — a single counter cell.
 *
 * The counter logic:
 *   1. `count` is a motion value initialized to 0.
 *   2. `useInView` watches the cell. When it enters the viewport, we
 *      kick off `animate(count, stat.value, { duration: 1.6, ease })`.
 *   3. `displayText` is derived from `count` via `useTransform`,
 *      formatting the number with locale-aware commas + the suffix.
 *   4. Because `count` is a motion value, updates skip React's
 *      reconciler — they go straight to the DOM via subscription.
 *      This is GPU-fast and frame-perfect.
 */
function NumberCell({ stat, index }: { stat: Stat; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-25%" });
  const reduced = useReducedMotion();
  const count = useMotionValue(reduced ? stat.value : 0);

  // Format with locale comma separator. For non-integer suffix values
  // (like "k+"), display as integer; for "%", same.
  const display = useTransform(count, (latest) =>
    Math.floor(latest).toLocaleString()
  );

  useEffect(() => {
    // When reduced-motion is on, skip the count-up entirely — the
    // motion value is already initialized to the target above, so
    // the cell renders the final number instantly. Same content,
    // no animation.
    if (!inView || reduced) return;
    const controls = animate(count, stat.value, {
      duration: 1.6,
      ease: [0.32, 0.72, 0, 1],
      delay: index * 0.12,
    });
    return controls.stop;
  }, [inView, count, stat.value, index, reduced]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.6, delay: index * 0.08 }}
      className="bg-[var(--color-surface)] p-7 md:p-10 h-full"
    >
      <p className="type-eyebrow text-[var(--color-ink-3)] mb-6">
        / 0{index + 1}
      </p>

      <div className="flex items-baseline gap-1 mb-4">
        <motion.span className="font-[family-name:var(--font-display)] text-5xl md:text-6xl lg:text-7xl font-semibold tracking-tight leading-none text-[var(--color-ink)] tabular-nums">
          {display}
        </motion.span>
        {stat.suffix && (
          <span className="font-[family-name:var(--font-display)] text-3xl md:text-4xl font-semibold tracking-tight text-[var(--color-accent)]">
            {stat.suffix}
          </span>
        )}
      </div>

      <p className="text-base font-medium text-[var(--color-ink)] mb-1.5">
        {stat.label}
      </p>
      <p className="text-sm text-[var(--color-ink-3)] leading-relaxed">
        {stat.description}
      </p>
    </motion.div>
  );
}
