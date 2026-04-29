"use client";

import { motion } from "motion/react";

const APPLE_EASE = [0.32, 0.72, 0, 1] as const;

/**
 * VariantSeparator — big visible divider between the four layout
 * variants on the case-study comparison page.
 *
 * Bright accent strip, full-width, with the variant number + name
 * in oversized mono caps. Designed to be unmissable so the user
 * always knows which variant they're scrolling.
 */
export function VariantSeparator({
  number,
  name,
  description,
}: {
  number: string;
  name: string;
  description: string;
}) {
  return (
    <section
      aria-hidden
      className="relative py-16 md:py-24 overflow-hidden"
      style={{
        background:
          "linear-gradient(to bottom, transparent 0%, #ff9f0a14 50%, transparent 100%)",
      }}
    >
      {/* Top + bottom orange hairlines so the band reads as a frame */}
      <div className="absolute top-0 inset-x-0 h-px bg-[#ff9f0a]/40" />
      <div className="absolute bottom-0 inset-x-0 h-px bg-[#ff9f0a]/40" />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-15%" }}
        transition={{ duration: 0.7, ease: APPLE_EASE }}
        className="container-page text-center"
      >
        <p
          className="font-[family-name:var(--font-mono)] text-xs font-semibold tracking-[0.32em] mb-3"
          style={{ color: "#ff9f0a" }}
        >
          VARIANT · {number}
        </p>
        <h2 className="font-[family-name:var(--font-display)] font-bold tracking-tight text-3xl md:text-5xl text-[var(--color-ink)] mb-3">
          {name}
        </h2>
        <p className="text-sm text-[var(--color-ink-2)] max-w-[52ch] mx-auto">
          {description}
        </p>
      </motion.div>
    </section>
  );
}
