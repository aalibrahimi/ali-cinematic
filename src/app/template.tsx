"use client";

import { motion } from "motion/react";
import { APPLE_EASE } from "@/lib/motion";

/**
 * Template — Next.js App Router's per-navigation re-render hook.
 *
 * Wraps every page with a 600ms fade + 16px lift on arrival. This is
 * the entrance pattern Apple uses across their product pages — quick
 * enough to feel responsive, slow enough to feel composed.
 *
 * On Safari 18+ this works alongside the View Transitions API; for
 * full VTA support we'd register `view-transition-name` on key
 * elements, but the basic crossfade is good enough as a baseline.
 *
 * App Router doesn't natively support exit animations from a template,
 * so we don't try — entrance-only animations read as "designed"
 * without the jitter of trying to coordinate exit timing.
 */
export default function Template({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: APPLE_EASE }}
    >
      {children}
    </motion.div>
  );
}
