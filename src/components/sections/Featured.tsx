"use client";

import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { useRef } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const APPLE_EASE = [0.32, 0.72, 0, 1] as const;

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
    [0, 1, 1, 0],
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
            A personal finance operating system. Built end-to-end — design,
            schema, agent stack, the whole spine.
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
              href="https://simplicityfunds.co"
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
 * SimplicityMockup — brand-art card (replaced the screenshot mockup).
 *
 * Apple-album-cover energy rather than fake-product-screenshot. Dark
 * zinc surface with:
 *   - Subtle dot-grid background pattern
 *   - Animated chart line (SVG path that draws itself)
 *   - Floating geometric "feature" symbols at the corners (cash,
 *     chart, target, calendar — abstract glyphs, not literal icons)
 *   - SIMPLICITY wordmark glowing at center with a subtle pulse
 *   - Tagline below
 *   - Three small metric chips at the bottom
 *
 * The card lives in the same scroll-pinned slot as the previous
 * mockup (parent applies the scale + rotate transforms), so all the
 * cinematic motion still hits — only the *content* of the slot
 * changed from "fake product UI" to "designed brand art."
 */
function SimplicityMockup() {
  return (
    <div className="w-[min(85vw,820px)] aspect-[16/10] relative">
      {/* Card frame */}
      <div className="absolute inset-0 rounded-3xl overflow-hidden bg-[var(--color-surface-2)] border border-[var(--color-divider)]">
        {/* Subtle dot-grid background pattern */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.18] pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        />

        {/* Top accent gradient — single beat of Apple blue at the
            top edge, fades into the canvas. */}
        <div
          aria-hidden
          className="absolute top-0 inset-x-0 h-1/2 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(10, 132, 255, 0.18) 0%, transparent 70%)",
          }}
        />

        {/* Floating geometric feature glyphs — small accent shapes
            at each corner, hinting at the breadth of Simplicity's
            domain (money, charts, targets, time) without being
            literal icons. */}
        <FeatureGlyph type="ring" position="top-left" />
        <FeatureGlyph type="bars" position="top-right" />
        <FeatureGlyph type="target" position="bottom-left" />
        <FeatureGlyph type="dots" position="bottom-right" />

        {/* Animated chart line — sweeps across the card mid-height,
            draws itself in on view. The visual identity beat. */}
        <svg
          className="absolute left-0 right-0 top-1/2 -translate-y-12 w-full h-32 pointer-events-none"
          viewBox="0 0 800 100"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="brandChart" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="rgba(10, 132, 255, 0)" />
              <stop offset="50%" stopColor="rgba(10, 132, 255, 0.7)" />
              <stop offset="100%" stopColor="rgba(10, 132, 255, 0)" />
            </linearGradient>
          </defs>
          <motion.path
            d="M 0 70 Q 100 40, 200 50 T 400 30 T 600 40 T 800 20"
            fill="none"
            stroke="url(#brandChart)"
            strokeWidth="2"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 2, ease: APPLE_EASE }}
          />
        </svg>

        {/* Quiet wordmark — small mono-caps eyebrow only.
            The big headline + tagline that used to live here were
            stripped because they collided with the foreground stage
            text (the H2 in Stage 1 already says "Simplicity.", and
            Stage 3's "See it for yourself." was overlapping the old
            wordmark). Brand-art card is now purely visual; foreground
            stages own all the messaging. */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-8 z-10">
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 0.5, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.3, ease: APPLE_EASE }}
            className="font-[family-name:var(--font-mono)] text-[0.65rem] tracking-[0.4em] uppercase text-[var(--color-ink-3)]"
          >
            · Simplicity ·
          </motion.p>
        </div>

        {/* Bottom: metric chips */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 1, ease: APPLE_EASE }}
          className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2"
        >
          {(
            [
              ["RT", "real time"],
              ["E2E", "end to end"],
              ["1:1", "solo built"],
            ] as const
          ).map(([label, desc]) => (
            <div
              key={label}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--color-divider)] bg-[var(--color-canvas)]/60 backdrop-blur-sm"
            >
              <span
                className="font-[family-name:var(--font-mono)] text-[0.65rem] font-semibold tracking-wider"
                style={{ color: "var(--color-accent)" }}
              >
                {label}
              </span>
              <span className="text-[0.65rem] text-[var(--color-ink-3)] uppercase tracking-wider">
                {desc}
              </span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Soft glow under the card — Apple-style product lift */}
      <div
        aria-hidden
        className="absolute -bottom-12 left-1/2 -translate-x-1/2 w-3/4 h-12 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse, rgba(10, 132, 255, 0.22) 0%, transparent 70%)",
          filter: "blur(24px)",
        }}
      />
    </div>
  );
}

/**
 * FeatureGlyph — small geometric symbol at one corner of the brand
 * card. Four variants, each a different abstract shape that hints at
 * a different domain Simplicity covers (cash flow, charts, goals,
 * connections). Designed to read as iconography, not UI.
 */
function FeatureGlyph({
  type,
  position,
}: {
  type: "ring" | "bars" | "target" | "dots";
  position: "top-left" | "top-right" | "bottom-left" | "bottom-right";
}) {
  const positionClass: Record<typeof position, string> = {
    "top-left": "top-6 left-6 md:top-8 md:left-8",
    "top-right": "top-6 right-6 md:top-8 md:right-8",
    "bottom-left": "bottom-20 left-6 md:bottom-24 md:left-8",
    "bottom-right": "bottom-20 right-6 md:bottom-24 md:right-8",
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.7 }}
      whileInView={{ opacity: 0.5, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: 0.5, ease: APPLE_EASE }}
      className={`absolute ${positionClass[position]} pointer-events-none`}
    >
      <svg
        width={32}
        height={32}
        viewBox="0 0 32 32"
        fill="none"
        className="text-[var(--color-ink-2)]"
      >
        {type === "ring" && (
          <>
            <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="1" />
            <circle cx="16" cy="16" r="6" stroke="currentColor" strokeWidth="1" />
          </>
        )}
        {type === "bars" && (
          <>
            <rect x="4" y="20" width="4" height="8" fill="currentColor" />
            <rect x="11" y="14" width="4" height="14" fill="currentColor" />
            <rect x="18" y="8" width="4" height="20" fill="currentColor" />
            <rect x="25" y="4" width="4" height="24" fill="var(--color-accent)" />
          </>
        )}
        {type === "target" && (
          <>
            <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="1" />
            <circle cx="16" cy="16" r="9" stroke="currentColor" strokeWidth="1" />
            <circle cx="16" cy="16" r="4" fill="var(--color-accent)" />
          </>
        )}
        {type === "dots" && (
          <>
            {[0, 1, 2, 3].map((row) =>
              [0, 1, 2, 3].map((col) => (
                <circle
                  key={`${row}-${col}`}
                  cx={4 + col * 8}
                  cy={4 + row * 8}
                  r="1.5"
                  fill={
                    row === 1 && col === 1
                      ? "var(--color-accent)"
                      : "currentColor"
                  }
                />
              ))
            )}
          </>
        )}
      </svg>
    </motion.div>
  );
}
