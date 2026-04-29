"use client";

import { motion } from "motion/react";
import { APPLE_EASE } from "@/lib/motion";

/**
 * BrandMark — minimal "A" letterform that strokes itself in on mount.
 *
 * Geometry: an isoceles "A" with a horizontal crossbar. Drawn as a
 * single SVG path for a clean stroke-draw animation. The path is
 * defined as one continuous polyline so `pathLength` 0→1 gives a
 * natural "writing it out" feel.
 *
 * The animation is part of the hero arrival sequence (timing comes
 * from HERO_SEQUENCE.brandMark in lib/motion). Apple uses this exact
 * trick — see the small marks at the top of their feature pages that
 * draw themselves in as you arrive.
 */

interface BrandMarkProps {
  className?: string;
  size?: number;
  /** Override the default arrival animation — useful when this mark
   *  is used in a stable navbar context where it shouldn't replay. */
  static?: boolean;
}

export function BrandMark({
  className,
  size = 48,
  static: isStatic,
}: BrandMarkProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={2.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* The "A" — left leg up, right leg down, crossbar across.
          Drawn as two paths so the crossbar can animate slightly
          delayed for an extra beat. */}
      <motion.path
        d="M 6 42 L 24 6 L 42 42"
        initial={isStatic ? false : { pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{
          duration: 1.2,
          ease: APPLE_EASE,
        }}
      />
      <motion.path
        d="M 13 30 L 35 30"
        initial={isStatic ? false : { pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{
          duration: 0.7,
          delay: 0.45,
          ease: APPLE_EASE,
        }}
      />
    </svg>
  );
}
