"use client";

import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { useRef } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

/**
 * Featured — Simplicity, the multi-stage product treatment.
 *
 * Apple iPhone-product-page choreography. The section pins for 200vh
 * of scroll while four layers move at different rates:
 *
 *   1. Title block — Big "Simplicity." with subtitle. Visible at top,
 *      slides up + fades as user scrolls past.
 *   2. Mockup — Stylized dashboard card. Always visible. Subtly
 *      scales from 1.0 → 1.08 and rotates -2° → 2° across the scroll.
 *   3. Stats grid — Hidden initially. Each stat slides up + fades in
 *      as user reaches the mid-scroll. Numbers count-up handled by
 *      useTransform animating the displayed digits.
 *   4. CTA row — Last to arrive. Slides up at the end of the scroll.
 *
 * EVERYTHING is driven from a single spring-smoothed `progress` value,
 * which is what gives the section its silky Apple-tier feel.
 */

const STATS = [
  { value: "120k+", label: "Lines shipped" },
  { value: "240+", label: "Components" },
  { value: "3.5s", label: "Cold load" },
  { value: "0", label: "Downtime" },
];

export function Featured() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const progress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 26,
    mass: 0.4,
    restDelta: 0.0005,
  });

  // ── Title (Stage 1) ────────────────────────────────────────────
  // Visible 0–25%, slides up + fades 25–35%.
  const titleOpacity = useTransform(progress, [0, 0.22, 0.32], [1, 1, 0]);
  const titleY = useTransform(progress, [0, 0.32], [0, -80]);

  // ── Mockup (always visible, slow scale + rotate) ────────────────
  const mockupScale = useTransform(progress, [0, 1], [1, 1.08]);
  const mockupRotate = useTransform(progress, [0, 1], [-2, 2]);
  const mockupY = useTransform(progress, [0, 1], [0, -40]);

  // ── Stats grid (Stage 2) ───────────────────────────────────────
  // Enters 30–45%, holds 45–75%, leaves 75–85%.
  const statsOpacity = useTransform(
    progress,
    [0.3, 0.45, 0.75, 0.85],
    [0, 1, 1, 0]
  );
  const statsY = useTransform(progress, [0.3, 0.45], [60, 0]);

  // ── CTAs (Stage 3) ─────────────────────────────────────────────
  // Enters 80–95%, holds.
  const ctaOpacity = useTransform(progress, [0.8, 0.95], [0, 1]);
  const ctaY = useTransform(progress, [0.8, 0.95], [40, 0]);

  return (
    <section
      ref={ref}
      className="relative h-[200vh]"
      aria-label="Featured: Simplicity"
    >
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
        {/* Subtle blue radial */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 40% at 50% 50%, rgba(10, 132, 255, 0.05) 0%, transparent 60%)",
          }}
        />

        {/* The mockup — Simplicity-style abstract dashboard. Sits
            quietly in the background through all stages. */}
        <motion.div
          style={{
            scale: mockupScale,
            rotate: mockupRotate,
            y: mockupY,
          }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none gpu"
        >
          <SimplicityMockup />
        </motion.div>

        {/* Stage 1: Title overlay */}
        <motion.div
          style={{ opacity: titleOpacity, y: titleY }}
          className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 z-10 gpu"
        >
          <p className="type-eyebrow text-[var(--color-accent)] mb-6 flex items-center gap-2.5">
            <span className="size-1.5 rounded-full bg-[var(--color-accent)]" />
            Featured / 01
          </p>
          <h2 className="type-display-xl text-[var(--color-ink)]">
            Simplicity<span className="text-[var(--color-accent)]">.</span>
          </h2>
          <p className="type-body-lg mt-6 md:mt-8 max-w-[42ch]">
            A personal finance operating system. Built end-to-end —
            design, schema, agent stack, the whole spine.
          </p>
        </motion.div>

        {/* Stage 2: Stats grid */}
        <motion.div
          style={{ opacity: statsOpacity, y: statsY }}
          className="absolute inset-0 flex items-center justify-center px-6 z-10 gpu"
        >
          <div className="w-full max-w-5xl">
            <p className="type-eyebrow text-[var(--color-ink-3)] mb-12 text-center">
              By the numbers
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[var(--color-divider)] border border-[var(--color-divider)] rounded-2xl overflow-hidden">
              {STATS.map((stat, i) => (
                <StatCell key={stat.label} stat={stat} index={i} />
              ))}
            </div>
          </div>
        </motion.div>

        {/* Stage 3: CTAs */}
        <motion.div
          style={{ opacity: ctaOpacity, y: ctaY }}
          className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 z-10 gpu"
        >
          <p className="type-display-md text-[var(--color-ink)] max-w-[20ch] mb-12">
            See it for yourself.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/work/simplicity"
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-[var(--color-accent)] text-[var(--color-ink)] text-sm font-medium hover:bg-[var(--color-accent-hover)] transition-colors duration-300"
            >
              Read the full story
              <ArrowUpRight size={16} strokeWidth={2} />
            </Link>
            <a
              href="https://simplicityfunds.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full border border-[var(--color-divider)] text-[var(--color-ink)] text-sm font-medium hover:border-[var(--color-ink-2)] transition-colors duration-300"
            >
              Visit live site
              <ArrowUpRight size={16} strokeWidth={2} />
            </a>
          </div>
        </motion.div>

        {/* Bottom progress bar */}
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

/**
 * StatCell — one cell of the by-the-numbers grid.
 *
 * Each cell renders the value as static text. The Stage 2 enters with
 * a stagger by index so the four cells "type in" left-to-right rather
 * than appearing in sync.
 */
function StatCell({
  stat,
  index,
}: {
  stat: (typeof STATS)[number];
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: false, margin: "-30%" }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="bg-[var(--color-surface)] p-7 md:p-9"
    >
      <p className="type-eyebrow text-[var(--color-accent)] mb-4">
        / 0{index + 1}
      </p>
      <p className="font-[family-name:var(--font-display)] text-5xl md:text-6xl font-semibold tracking-tight leading-none text-[var(--color-ink)] mb-3">
        {stat.value}
      </p>
      <p className="text-sm text-[var(--color-ink-2)]">{stat.label}</p>
    </motion.div>
  );
}

/**
 * SimplicityMockup — abstract dashboard frame.
 *
 * A stylized phone-aspect card that suggests Simplicity's actual UI
 * without literally rendering it. Built entirely in CSS — header bar,
 * KPI row, chart placeholder, transaction list. Sized to feel
 * "product-shot worthy" against the cinematic dark canvas.
 */
function SimplicityMockup() {
  return (
    <div className="w-[min(80vw,640px)] aspect-[3/2] relative">
      {/* Card frame with glass + glow */}
      <div className="absolute inset-0 rounded-3xl bg-[var(--color-surface-2)] border border-[var(--color-divider)] overflow-hidden">
        {/* Inner content area */}
        <div className="h-full p-6 md:p-8 flex flex-col gap-4 opacity-30">
          {/* Header row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="size-8 rounded-lg bg-[var(--color-accent)]/30" />
              <div className="h-3 w-32 rounded bg-[var(--color-ink-3)]" />
            </div>
            <div className="h-3 w-20 rounded bg-[var(--color-ink-3)]" />
          </div>

          {/* KPI row */}
          <div className="grid grid-cols-3 gap-3 mt-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-20 rounded-xl border border-[var(--color-divider)] bg-[var(--color-surface)] p-3 flex flex-col justify-between"
              >
                <div className="h-2 w-12 rounded bg-[var(--color-ink-3)]" />
                <div className="h-5 w-16 rounded bg-[var(--color-ink-2)]" />
              </div>
            ))}
          </div>

          {/* Chart placeholder */}
          <div className="flex-1 rounded-xl border border-[var(--color-divider)] bg-[var(--color-surface)] relative overflow-hidden">
            <svg
              className="absolute inset-0 w-full h-full"
              viewBox="0 0 300 120"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgba(10, 132, 255, 0.4)" />
                  <stop
                    offset="100%"
                    stopColor="rgba(10, 132, 255, 0.0)"
                  />
                </linearGradient>
              </defs>
              <path
                d="M 0 80 L 30 70 L 60 75 L 90 50 L 120 55 L 150 35 L 180 45 L 210 25 L 240 30 L 270 15 L 300 20 L 300 120 L 0 120 Z"
                fill="url(#chartFill)"
              />
              <path
                d="M 0 80 L 30 70 L 60 75 L 90 50 L 120 55 L 150 35 L 180 45 L 210 25 L 240 30 L 270 15 L 300 20"
                fill="none"
                stroke="rgba(10, 132, 255, 0.6)"
                strokeWidth="1.5"
              />
            </svg>
          </div>

          {/* Transaction rows */}
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex items-center justify-between py-2"
              >
                <div className="flex items-center gap-3">
                  <div className="size-6 rounded-md bg-[var(--color-ink-3)]/40" />
                  <div className="h-2.5 w-24 rounded bg-[var(--color-ink-3)]" />
                </div>
                <div className="h-2.5 w-16 rounded bg-[var(--color-ink-2)]/50" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Soft glow under the mockup — gives it product-shot lift */}
      <div
        aria-hidden
        className="absolute -bottom-12 left-1/2 -translate-x-1/2 w-3/4 h-12 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse, rgba(10, 132, 255, 0.18) 0%, transparent 70%)",
          filter: "blur(20px)",
        }}
      />
    </div>
  );
}
