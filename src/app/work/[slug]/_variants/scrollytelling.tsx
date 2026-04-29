"use client";

import {
  motion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import type { ShowcaseBlock, WorkItem } from "@/lib/work";

const APPLE_EASE = [0.32, 0.72, 0, 1] as const;

/**
 * Variant 02 — Scrollytelling Pinned Moments.
 *
 * Each section pins as the user scrolls. The visual on the left holds
 * still; the content on the right (or vice versa) progresses through
 * its beats based on scroll progress. Apple Privacy / Vision Pro page
 * pattern.
 *
 * Per-block choreography:
 *   1. Stage enters: chapter eyebrow + title fade up
 *   2. Body prose fades in
 *   3. Highlights cascade up one at a time
 *   4. Stage exits as next pin claims the viewport
 *
 * Visual side: a HUGE chapter numeral that morphs (scales/colors)
 * across the scroll progress. Same trick Apple uses with product
 * imagery — except the "product" here is the chapter number itself,
 * giving the project an iconic visual rhythm without imagery.
 */

interface Props {
  item: WorkItem;
}

export function ScrollytellingVariant({ item }: Props) {
  return (
    <article>
      {/* Hero scene — 100vh */}
      <ScrollyHero item={item} />

      {/* Stats scene — 100vh */}
      <StatsScene item={item} />

      {/* One pinned scene per narrative block */}
      {item.blocks.map((block, i) => (
        <BlockScene
          key={block.title}
          block={block}
          index={i}
          accent={item.accent}
          isInterlude={i === 0 && item.blocks.length > 1}
          interlude={item.interlude}
        />
      ))}

      {/* Tech + CTA scene */}
      <ClosingScene item={item} />
    </article>
  );
}

/* ─────────────────────────────────────────────────────────────────
   Hero scene — full-screen pinned arrival.
   ───────────────────────────────────────────────────────────────── */

function ScrollyHero({ item }: { item: WorkItem }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const progress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 26,
    mass: 0.4,
  });

  const titleY = useTransform(progress, [0, 1], [0, -120]);
  const titleOpacity = useTransform(progress, [0, 0.7], [1, 0]);
  const numScale = useTransform(progress, [0, 1], [1, 1.4]);
  const numOpacity = useTransform(progress, [0, 1], [1, 0.2]);

  return (
    <section
      ref={ref}
      className="relative h-[150vh]"
      aria-label={`${item.name} hero`}
    >
      <div className="sticky top-0 h-screen flex items-center overflow-hidden">
        {/* Background accent wash */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse 70% 50% at 50% 100%, ${item.accent}1A 0%, transparent 60%)`,
          }}
        />

        <div className="container-page relative z-10 grid grid-cols-12 gap-8 items-center">
          {/* LEFT: massive index numeral */}
          <motion.div
            style={{ scale: numScale, opacity: numOpacity }}
            className="col-span-12 md:col-span-5 flex items-center justify-center gpu"
          >
            <span
              className="font-[family-name:var(--font-display)] font-bold tracking-tight leading-none"
              style={{
                color: item.accent,
                fontSize: "clamp(10rem, 28vw, 26rem)",
                opacity: 0.85,
              }}
            >
              {item.index}
            </span>
          </motion.div>

          {/* RIGHT: name + quote */}
          <motion.div
            style={{ y: titleY, opacity: titleOpacity }}
            className="col-span-12 md:col-span-7 gpu"
          >
            <p
              className="type-eyebrow flex items-center gap-2.5 mb-6"
              style={{ color: item.accent }}
            >
              <span
                className="size-1.5 rounded-full"
                style={{ backgroundColor: item.accent }}
              />
              {item.kind} · {item.year}
            </p>
            <h1 className="type-display-xl text-[var(--color-ink)] leading-[0.9] mb-10">
              {item.name}
              <span style={{ color: item.accent }}>.</span>
            </h1>
            <blockquote className="type-display-md italic text-[var(--color-ink-2)] max-w-[28ch] leading-tight">
              &ldquo;{item.quote}&rdquo;
            </blockquote>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────
   Stats scene — scroll-driven stats reveal.
   ───────────────────────────────────────────────────────────────── */

function StatsScene({ item }: { item: WorkItem }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const progress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 26,
    mass: 0.4,
  });

  // Stats fade in based on scroll progress, one after the other.
  // Each gets its own scroll window: 0.2-0.4, 0.3-0.5, 0.4-0.6, 0.5-0.7
  const o0 = useTransform(progress, [0.15, 0.3], [0, 1]);
  const o1 = useTransform(progress, [0.25, 0.4], [0, 1]);
  const o2 = useTransform(progress, [0.35, 0.5], [0, 1]);
  const o3 = useTransform(progress, [0.45, 0.6], [0, 1]);
  const opacities = [o0, o1, o2, o3];

  const y0 = useTransform(progress, [0.15, 0.3], [40, 0]);
  const y1 = useTransform(progress, [0.25, 0.4], [40, 0]);
  const y2 = useTransform(progress, [0.35, 0.5], [40, 0]);
  const y3 = useTransform(progress, [0.45, 0.6], [40, 0]);
  const ys = [y0, y1, y2, y3];

  return (
    <section
      ref={ref}
      className="relative h-[150vh]"
      aria-label={`${item.name} statistics`}
    >
      <div className="sticky top-0 h-screen flex flex-col items-center justify-center overflow-hidden">
        <div className="container-page relative z-10">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-30%" }}
            transition={{ duration: 0.7, ease: APPLE_EASE }}
            className="type-eyebrow text-[var(--color-ink-3)] mb-12 text-center"
          >
            By the numbers
          </motion.p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[var(--color-divider)] border border-[var(--color-divider)] rounded-2xl overflow-hidden">
            {item.stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                style={{
                  opacity: opacities[i],
                  y: ys[i],
                }}
                className="bg-[var(--color-surface)] p-7 md:p-10 h-full text-center md:text-left gpu"
              >
                <p
                  className="type-eyebrow mb-5"
                  style={{ color: item.accent }}
                >
                  / 0{i + 1}
                </p>
                <p className="font-[family-name:var(--font-display)] text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight leading-none text-[var(--color-ink)] mb-3 tabular-nums">
                  {stat.value}
                </p>
                <p className="text-sm text-[var(--color-ink-2)]">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────
   Block scene — pinned 200vh per block. Visual on one side morphs,
   content on the other side cascades. Optionally followed by an
   interlude pull-quote moment.
   ───────────────────────────────────────────────────────────────── */

function BlockScene({
  block,
  index,
  accent,
  isInterlude,
  interlude,
}: {
  block: ShowcaseBlock;
  index: number;
  accent: string;
  isInterlude?: boolean;
  interlude?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const progress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 26,
    mass: 0.4,
  });

  // Visual side: chapter number scales + opacity oscillates.
  const visualScale = useTransform(progress, [0, 0.5, 1], [0.85, 1, 0.85]);
  const visualY = useTransform(progress, [0, 1], [40, -40]);

  // Content stages
  const titleOpacity = useTransform(progress, [0, 0.1, 0.4, 0.5], [0, 1, 1, 0]);
  const titleY = useTransform(progress, [0, 0.1], [30, 0]);

  const bodyOpacity = useTransform(progress, [0.2, 0.3, 0.6, 0.7], [0, 1, 1, 0]);
  const bodyY = useTransform(progress, [0.2, 0.3], [30, 0]);

  // Highlights stagger
  const h0Op = useTransform(progress, [0.5, 0.6], [0, 1]);
  const h1Op = useTransform(progress, [0.55, 0.65], [0, 1]);
  const h2Op = useTransform(progress, [0.6, 0.7], [0, 1]);
  const h3Op = useTransform(progress, [0.65, 0.75], [0, 1]);
  const h4Op = useTransform(progress, [0.7, 0.8], [0, 1]);
  const hOpacities = [h0Op, h1Op, h2Op, h3Op, h4Op];

  const sideIsRight = index % 2 === 0;
  const sectionHeight = isInterlude ? "h-[300vh]" : "h-[250vh]";

  return (
    <section
      ref={ref}
      className={`relative ${sectionHeight} border-t border-[var(--color-divider)]`}
      aria-label={block.title}
    >
      <div className="sticky top-0 h-screen overflow-hidden flex items-center">
        <div className="container-page relative z-10 grid grid-cols-12 gap-8 items-center w-full">
          {/* Visual side */}
          <motion.div
            style={{ scale: visualScale, y: visualY }}
            className={`col-span-12 md:col-span-5 flex items-center justify-center gpu ${
              sideIsRight ? "" : "md:order-2"
            }`}
          >
            <div className="relative">
              <span
                className="font-[family-name:var(--font-display)] font-bold tracking-tight leading-none"
                style={{
                  color: accent,
                  fontSize: "clamp(8rem, 22vw, 22rem)",
                  opacity: 0.9,
                }}
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <div
                aria-hidden
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: `radial-gradient(circle at 50% 50%, ${accent}30 0%, transparent 50%)`,
                  filter: "blur(40px)",
                }}
              />
            </div>
          </motion.div>

          {/* Content side */}
          <div
            className={`col-span-12 md:col-span-7 relative min-h-[400px] ${
              sideIsRight ? "" : "md:order-1"
            }`}
          >
            {/* Title */}
            <motion.div
              style={{ opacity: titleOpacity, y: titleY }}
              className="absolute inset-0 flex flex-col justify-center gpu"
            >
              <p
                className="type-eyebrow flex items-center gap-2 mb-5"
                style={{ color: accent }}
              >
                <span
                  className="size-1.5 rounded-full"
                  style={{ backgroundColor: accent }}
                />
                Chapter {String(index + 1).padStart(2, "0")}
              </p>
              <h2 className="type-display-lg text-[var(--color-ink)] leading-[0.95] max-w-[16ch]">
                {block.title}
              </h2>
            </motion.div>

            {/* Body */}
            <motion.div
              style={{ opacity: bodyOpacity, y: bodyY }}
              className="absolute inset-0 flex flex-col justify-center gpu"
            >
              <p
                className="type-eyebrow mb-5"
                style={{ color: accent }}
              >
                {block.title}
              </p>
              <p className="type-body-lg text-[var(--color-ink-2)] max-w-[60ch]">
                {block.body}
              </p>
            </motion.div>

            {/* Highlights */}
            {block.highlights && (
              <div className="absolute inset-0 flex flex-col justify-center gap-3">
                {block.highlights.map((h, hi) => (
                  <motion.div
                    key={h}
                    style={{
                      opacity: hOpacities[hi] ?? hOpacities[hOpacities.length - 1],
                    }}
                    className="flex items-start gap-3 text-[var(--color-ink-2)] gpu"
                  >
                    <span
                      className="font-[family-name:var(--font-mono)] text-xs font-semibold mt-1"
                      style={{ color: accent }}
                    >
                      {String(hi + 1).padStart(2, "0")}
                    </span>
                    <span className="text-base md:text-lg">{h}</span>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Bottom progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-[var(--color-divider-2)]">
          <motion.div
            style={{
              scaleX: progress,
              transformOrigin: "left",
              backgroundColor: accent,
            }}
            className="h-full gpu"
          />
        </div>
      </div>

      {/* Interlude lap — only on first block */}
      {isInterlude && interlude && (
        <div className="absolute inset-x-0 bottom-0 h-screen flex items-center justify-center pointer-events-none">
          <InterludePanel interlude={interlude} accent={accent} />
        </div>
      )}
    </section>
  );
}

function InterludePanel({
  interlude,
  accent,
}: {
  interlude: string;
  accent: string;
}) {
  return (
    <div className="container-page relative z-10 text-center">
      <p
        className="type-eyebrow mb-6"
        style={{ color: accent }}
      >
        · Interlude
      </p>
      <p className="font-[family-name:var(--font-display)] italic text-3xl md:text-5xl lg:text-6xl leading-tight text-[var(--color-ink)] max-w-[24ch] mx-auto">
        &ldquo;{interlude}&rdquo;
      </p>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   Closing scene — tech + CTA.
   ───────────────────────────────────────────────────────────────── */

function ClosingScene({ item }: { item: WorkItem }) {
  return (
    <section className="section py-24 md:py-32 border-t border-[var(--color-divider)]">
      <div className="container-page">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 0.9, ease: APPLE_EASE }}
        >
          <p className="type-eyebrow text-[var(--color-ink-3)] mb-6">
            / Stack
          </p>
          <div className="flex flex-wrap items-center gap-2 mb-12">
            {item.tags.map((t) => (
              <span
                key={t}
                className="text-xs font-mono px-3 py-1.5 rounded border border-[var(--color-divider)] text-[var(--color-ink-2)]"
              >
                {t}
              </span>
            ))}
          </div>
          {item.link && (
            <a
              href={item.link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-7 py-4 rounded-full text-base font-medium transition-colors duration-300"
              style={{
                backgroundColor: item.accent,
                color: "#fff",
              }}
            >
              Visit {item.link.label}
              <ArrowUpRight size={16} strokeWidth={2} />
            </a>
          )}
        </motion.div>
      </div>
    </section>
  );
}
