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
 * Client-side parts of the case-study route. The route page itself is
 * a server component (better SEO + faster TTFB); these motion-driven
 * pieces opt into client rendering only where the choreography lives.
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
        {/* Back link */}
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

        {/* Eyebrow */}
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

        {/* Project name with accent period */}
        <motion.h1
          initial={{ opacity: 0, y: 28, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1.1, delay: 0.15, ease: APPLE_EASE }}
          className="type-display-xl text-[var(--color-ink)] leading-[0.9]"
        >
          {item.name}
          <span style={{ color: item.accent }}>.</span>
        </motion.h1>

        {/* Pull quote */}
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
   Stats grid — 4 cells with count-up animation triggered on view.
   For non-numeric values (like "Solo", "Tauri") the cell skips the
   counter and just renders the string.
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
  // Try to extract a numeric value from the stat for count-up. If the
  // value contains digits, animate them; otherwise display as-is.
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
   Narrative block — scroll-revealed. Optional bulleted highlights
   list with accent-colored bullets.
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
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-15%" }}
      transition={{ duration: 0.9, ease: APPLE_EASE }}
      className="grid grid-cols-12 gap-4 md:gap-8"
    >
      <p className="col-span-12 md:col-span-3 type-eyebrow text-[var(--color-ink-3)] pt-2">
        / {String(index + 1).padStart(2, "0")}
      </p>
      <div className="col-span-12 md:col-span-9">
        <h2
          className="type-display-md text-[var(--color-ink)] mb-8"
          style={{ borderLeft: `2px solid ${accent}`, paddingLeft: "1rem" }}
        >
          {block.title}
        </h2>
        <p className="type-body-lg max-w-[60ch] mb-6">{block.body}</p>
        {block.highlights && (
          <ul className="space-y-3 mt-10 border-t border-[var(--color-divider)] pt-8">
            {block.highlights.map((h) => (
              <li
                key={h}
                className="flex items-start gap-3 text-[var(--color-ink-2)]"
              >
                <span
                  className="mt-2.5 size-1.5 rounded-full shrink-0"
                  style={{ backgroundColor: accent }}
                />
                <span>{h}</span>
              </li>
            ))}
          </ul>
        )}
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
