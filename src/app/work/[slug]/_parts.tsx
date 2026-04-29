"use client";

import {
  motion,
  useInView,
  useMotionValue,
  useTransform,
  animate,
} from "motion/react";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import type { ShowcaseBlock, WorkItem, WorkStat } from "@/lib/work";

const APPLE_EASE = [0.32, 0.72, 0, 1] as const;

/**
 * Client-side parts of the case-study route. The route page itself
 * is a server component (better SEO + faster TTFB); these motion-
 * driven pieces opt into client rendering only where the choreography
 * lives.
 *
 * Body design intent:
 *   The hero of a case study sets the tone — bold name, accent color,
 *   pull quote. The body has to MATCH that voltage, not drop into
 *   documentation. So:
 *     - NarrativeBlock renders each block as a full-bleed editorial
 *       card with surface fill, accent stripe, big title, and a
 *       2-col feature-grid for the highlights (instead of bullets).
 *     - Interlude punctuates the body with one massive italic
 *       statement — the "this changes everything" beat Apple uses
 *       between sections of their product pages.
 */

/* ─────────────────────────────────────────────────────────────────
   Hero — eyebrow, big project name with accent color, pull quote.
   ───────────────────────────────────────────────────────────────── */
export function CaseHero({ item }: { item: WorkItem }) {
  return (
    <section
      className="relative pt-32 md:pt-44 pb-20 md:pb-28 overflow-hidden"
      style={{
        background: `radial-gradient(ellipse 70% 50% at 50% 100%, ${item.accent}1A 0%, transparent 70%)`,
      }}
    >
      <div className="container-page relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: APPLE_EASE }}
        >
          <Link
            href="/work"
            className="inline-flex items-center gap-2 text-sm text-[var(--color-ink-2)] hover:text-[var(--color-accent)] transition-colors mb-12 md:mb-16"
          >
            <ArrowLeft size={14} />
            All work
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.05, ease: APPLE_EASE }}
          className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-10 md:mb-14"
        >
          <span
            className="size-1.5 rounded-full"
            style={{ backgroundColor: item.accent }}
          />
          <span className="type-eyebrow" style={{ color: item.accent }}>
            {item.index}
          </span>
          <span className="type-eyebrow text-[var(--color-ink-3)]">
            · {item.year}
          </span>
          <span className="type-eyebrow text-[var(--color-ink-3)]">
            · {item.role}
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 28, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1.1, delay: 0.15, ease: APPLE_EASE }}
          className="type-display-xl text-[var(--color-ink)] leading-[0.9]"
        >
          {item.name}
          <span style={{ color: item.accent }}>.</span>
        </motion.h1>

        <motion.blockquote
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.5, ease: APPLE_EASE }}
          className="type-display-md italic text-[var(--color-ink-2)] mt-12 md:mt-16 max-w-[44ch] leading-tight"
        >
          &ldquo;{item.quote}&rdquo;
        </motion.blockquote>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────
   Stats grid — 4 cells with count-up on view. For non-numeric
   values the cell skips the counter and renders the string as-is.
   ───────────────────────────────────────────────────────────────── */

export function StatsGrid({
  stats,
  accent,
}: {
  stats: WorkStat[];
  accent: string;
}) {
  return (
    <section className="border-t border-[var(--color-divider)]">
      <div className="container-page">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[var(--color-divider)]">
          {stats.map((s, i) => (
            <StatCell key={s.label} stat={s} index={i} accent={accent} />
          ))}
        </div>
      </div>
    </section>
  );
}

function StatCell({
  stat,
  index,
  accent,
}: {
  stat: WorkStat;
  index: number;
  accent: string;
}) {
  const numericMatch = stat.value.match(/^([\d.,]+)([+%kK]*)$/);
  const isNumeric = !!numericMatch;
  const targetNum = isNumeric
    ? parseFloat(numericMatch![1]!.replace(/,/g, ""))
    : 0;
  const suffix = isNumeric ? numericMatch![2]! : "";

  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-25%" });
  const count = useMotionValue(0);
  const display = useTransform(count, (latest) =>
    Math.floor(latest).toLocaleString()
  );

  useEffect(() => {
    if (!isNumeric || !inView) return;
    const controls = animate(count, targetNum, {
      duration: 1.4,
      ease: APPLE_EASE,
      delay: index * 0.1,
    });
    return controls.stop;
  }, [inView, count, targetNum, index, isNumeric]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.6, delay: index * 0.08 }}
      className="bg-[var(--color-surface)] p-7 md:p-10 h-full"
    >
      <p className="type-eyebrow mb-5" style={{ color: accent }}>
        / 0{index + 1}
      </p>

      <div className="flex items-baseline gap-1 mb-3">
        {isNumeric ? (
          <>
            <motion.span className="font-[family-name:var(--font-display)] text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight leading-none text-[var(--color-ink)] tabular-nums">
              {display}
            </motion.span>
            {suffix && (
              <span
                className="font-[family-name:var(--font-display)] text-2xl md:text-3xl font-semibold tracking-tight"
                style={{ color: accent }}
              >
                {suffix}
              </span>
            )}
          </>
        ) : (
          <span className="font-[family-name:var(--font-display)] text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight leading-none text-[var(--color-ink)]">
            {stat.value}
          </span>
        )}
      </div>

      <p className="text-sm text-[var(--color-ink-2)]">{stat.label}</p>
      {stat.hint && (
        <p className="text-xs text-[var(--color-ink-3)] mt-2 leading-relaxed">
          {stat.hint}
        </p>
      )}
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   Interlude — mid-body pull quote. Massive italic statement that
   punctuates between narrative blocks. Apple-style "this changes
   everything" beat.
   ───────────────────────────────────────────────────────────────── */

export function Interlude({
  statement,
  accent,
}: {
  statement: string;
  accent: string;
}) {
  return (
    <section className="relative py-32 md:py-48 overflow-hidden">
      {/* Subtle accent wash — the interlude gets a quiet color halo
          so it visually announces itself as different from the
          surrounding narrative blocks. */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 50% 40% at 50% 50%, ${accent}1A 0%, transparent 60%)`,
        }}
      />

      <div className="container-page relative z-10">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-20%" }}
          transition={{ duration: 0.7, ease: APPLE_EASE }}
          className="type-eyebrow mb-8 flex items-center gap-2.5"
          style={{ color: accent }}
        >
          <span
            className="size-1.5 rounded-full"
            style={{ backgroundColor: accent }}
          />
          Interlude
        </motion.p>

        <motion.blockquote
          initial={{ opacity: 0, y: 32, filter: "blur(8px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-20%" }}
          transition={{
            duration: 1.2,
            delay: 0.1,
            ease: APPLE_EASE,
          }}
          className="type-display-lg italic text-[var(--color-ink)] max-w-[28ch] leading-tight"
        >
          &ldquo;{statement}&rdquo;
        </motion.blockquote>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────
   Narrative block — full editorial card.
     - surface-2 fill with rounded corners
     - accent gradient stripe at top edge
     - chapter number eyebrow with accent dot
     - oversized title in display sans
     - body prose
     - highlights as 2-col feature grid (NOT bullets) — each card
       has accent left-border, numbered indicator, hover state, and
       its own scroll-staggered reveal
   ───────────────────────────────────────────────────────────────── */

export function NarrativeBlock({
  block,
  index,
  accent,
}: {
  block: ShowcaseBlock;
  index: number;
  accent: string;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 1, ease: APPLE_EASE }}
      className="relative"
    >
      <div className="surface-2 rounded-3xl overflow-hidden p-8 md:p-12 lg:p-16 relative">
        {/* Top accent stripe — gradient that fades to transparent at
            the right edge for a clean editorial finish. */}
        <div
          aria-hidden
          className="absolute top-0 left-0 right-0 h-px"
          style={{
            background: `linear-gradient(to right, ${accent} 0%, ${accent}40 30%, transparent 70%)`,
          }}
        />

        {/* Chapter eyebrow */}
        <p
          className="type-eyebrow flex items-center gap-2.5 mb-8 md:mb-10"
          style={{ color: accent }}
        >
          <span
            className="size-1.5 rounded-full"
            style={{ backgroundColor: accent }}
          />
          Chapter {String(index + 1).padStart(2, "0")}
        </p>

        {/* Big title */}
        <h2 className="type-display-lg text-[var(--color-ink)] mb-8 md:mb-10 max-w-[20ch] leading-[0.95]">
          {block.title}
        </h2>

        {/* Body prose */}
        <p className="type-body-lg text-[var(--color-ink-2)] max-w-[64ch]">
          {block.body}
        </p>

        {/* Feature grid for highlights */}
        {block.highlights && block.highlights.length > 0 && (
          <div className="mt-12 md:mt-16 pt-10 md:pt-12 border-t border-[var(--color-divider)]">
            <p className="type-eyebrow text-[var(--color-ink-3)] mb-8">
              / Highlights
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
              {block.highlights.map((h, hi) => (
                <HighlightCard
                  key={h}
                  text={h}
                  index={hi}
                  accent={accent}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.section>
  );
}

/**
 * HighlightCard — one feature-grid card.
 *
 * Each card has the accent color as a left border, a numbered
 * indicator, the highlight text, and a hover treatment that lifts
 * the card slightly and intensifies the border. Scroll-staggered
 * with the card index so the grid "types in" left-to-right,
 * top-to-bottom rather than appearing in sync.
 */
function HighlightCard({
  text,
  index,
  accent,
}: {
  text: string;
  index: number;
  accent: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{
        duration: 0.7,
        delay: 0.15 + index * 0.08,
        ease: APPLE_EASE,
      }}
      whileHover={{ y: -2 }}
      className="group relative bg-[var(--color-surface)] rounded-2xl p-5 md:p-6 transition-colors duration-300 gpu cursor-default"
      style={{
        borderLeft: `2px solid ${accent}`,
        borderTop: "1px solid var(--color-divider)",
        borderRight: "1px solid var(--color-divider)",
        borderBottom: "1px solid var(--color-divider)",
      }}
    >
      {/* Hover glow — same accent at low opacity */}
      <div
        aria-hidden
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          boxShadow: `inset 0 0 0 1px ${accent}40`,
        }}
      />

      <div className="relative flex items-start gap-4">
        <span
          className="font-[family-name:var(--font-mono)] text-xs font-semibold mt-0.5 shrink-0"
          style={{ color: accent }}
        >
          {String(index + 1).padStart(2, "0")}
        </span>
        <p className="text-[15px] text-[var(--color-ink)] leading-relaxed">
          {text}
        </p>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   Stack chips + outbound link CTA.
   ───────────────────────────────────────────────────────────────── */

export function StackAndCTA({ item }: { item: WorkItem }) {
  return (
    <section className="section py-24 md:py-32 border-t border-[var(--color-divider)]">
      <div className="container-page">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 0.9, ease: APPLE_EASE }}
          className="grid grid-cols-12 gap-8 items-end"
        >
          <div className="col-span-12 md:col-span-3">
            <p className="type-eyebrow text-[var(--color-ink-3)]">
              / Stack
            </p>
          </div>
          <div className="col-span-12 md:col-span-9">
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
          </div>
        </motion.div>
      </div>
    </section>
  );
}
