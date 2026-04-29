"use client";

import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import type { WorkItem } from "@/lib/work";

const APPLE_EASE = [0.32, 0.72, 0, 1] as const;

/**
 * Variant 04 — Magazine Editorial Long-Form.
 *
 * Apple Newsroom article pattern. Single narrow centered column,
 * long-form essay treatment:
 *   - Massive name with accent period (centered, no eyebrow chrome)
 *   - Italic pull quote in display sans
 *   - Stats inline as a simple metadata line, not a grid
 *   - Each chapter is a long-form section:
 *       · oversized chapter numeral on the left margin (decorative)
 *       · chapter title in display
 *       · body prose with first-letter dropcap
 *       · highlights as a compact bulleted list (NOT cards)
 *   - Interlude appears as a full-bleed pull-quote interjection,
 *     spanning the full reading width
 *   - Lots of whitespace; reads slow; feels written, not designed
 *
 * The entire page reads like an essay you'd find in a Sunday-paper
 * magazine. Less product-page energy, more "this person has
 * something to say."
 */

interface Props {
  item: WorkItem;
}

export function EditorialVariant({ item }: Props) {
  return (
    <article className="container-narrow py-20 md:py-32">
      {/* Top metadata line — minimal, journalistic */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, ease: APPLE_EASE }}
        className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-[var(--color-ink-3)] mb-12 md:mb-16"
      >
        <span className="text-[var(--color-ink-2)]">{item.kind}</span>
        <span>·</span>
        <span>{item.year}</span>
        <span>·</span>
        <span>{item.role}</span>
      </motion.div>

      {/* Hero name — left-aligned, dramatic */}
      <motion.h1
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.1, ease: APPLE_EASE }}
        className="font-[family-name:var(--font-display)] font-bold tracking-tight leading-[0.92] text-[clamp(3.5rem,9vw,9rem)] text-[var(--color-ink)] mb-12"
      >
        {item.name}
        <span style={{ color: item.accent }}>.</span>
      </motion.h1>

      {/* Lede — italic summary in larger type */}
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.3, ease: APPLE_EASE }}
        className="text-2xl md:text-3xl leading-tight text-[var(--color-ink)] font-medium max-w-[36ch] mb-16 md:mb-20"
      >
        {item.summary}
      </motion.p>

      {/* Hero pull quote — set apart, italic, centered, accent border-left */}
      <motion.blockquote
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.5, ease: APPLE_EASE }}
        className="font-[family-name:var(--font-display)] italic text-2xl md:text-3xl leading-snug text-[var(--color-ink-2)] max-w-[34ch] my-16 md:my-20 pl-6 border-l-2"
        style={{ borderColor: item.accent }}
      >
        &ldquo;{item.quote}&rdquo;
      </motion.blockquote>

      {/* Inline stats — single row, journalistic style */}
      <motion.dl
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.7, ease: APPLE_EASE }}
        className="flex flex-wrap gap-x-10 gap-y-5 my-16 md:my-20 pt-8 border-t border-[var(--color-divider)]"
      >
        {item.stats.map((stat, i) => (
          <div key={stat.label} className="flex flex-col">
            <dt
              className="type-eyebrow mb-2"
              style={{ color: item.accent }}
            >
              / 0{i + 1} · {stat.label}
            </dt>
            <dd className="font-[family-name:var(--font-display)] text-3xl md:text-4xl font-semibold tracking-tight leading-none text-[var(--color-ink)] tabular-nums">
              {stat.value}
            </dd>
          </div>
        ))}
      </motion.dl>

      {/* Body chapters */}
      <div className="space-y-24 md:space-y-32 mt-20 md:mt-28">
        {item.blocks.map((block, i) => (
          <ChapterSection
            key={block.title}
            block={block}
            index={i}
            accent={item.accent}
          />
        ))}
      </div>

      {/* Mid-body full-bleed interlude — interjects the rhythm */}
      <motion.section
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-15%" }}
        transition={{ duration: 1, ease: APPLE_EASE }}
        className="my-24 md:my-32 py-16 md:py-24 border-y"
        style={{ borderColor: item.accent }}
      >
        <p
          className="type-eyebrow mb-8 text-center"
          style={{ color: item.accent }}
        >
          · Interlude
        </p>
        <p className="font-[family-name:var(--font-display)] italic text-3xl md:text-5xl lg:text-6xl leading-tight text-[var(--color-ink)] max-w-[24ch] mx-auto text-center">
          &ldquo;{item.interlude}&rdquo;
        </p>
      </motion.section>

      {/* Stack & link — minimal, journalistic */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-15%" }}
        transition={{ duration: 0.9, ease: APPLE_EASE }}
        className="pt-16 mt-16 border-t border-[var(--color-divider)]"
      >
        <p className="type-eyebrow text-[var(--color-ink-3)] mb-6">
          / Stack
        </p>
        <p className="text-base text-[var(--color-ink-2)] leading-relaxed mb-10">
          {item.tags.join(" · ")}
        </p>

        {item.link && (
          <a
            href={item.link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-base font-medium transition-colors duration-300 border-b-2 pb-1"
            style={{
              color: item.accent,
              borderColor: item.accent,
            }}
          >
            Visit {item.link.label}
            <ArrowUpRight size={16} strokeWidth={2} />
          </a>
        )}
      </motion.section>
    </article>
  );
}

/**
 * ChapterSection — long-form chapter with oversized numeral on the
 * left margin, dropcap on the body prose, compact highlight list.
 */
function ChapterSection({
  block,
  index,
  accent,
}: {
  block: { title: string; body: string; highlights?: string[] };
  index: number;
  accent: string;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.9, ease: APPLE_EASE }}
      className="relative"
    >
      {/* Oversized numeral — sits in the left margin (absolute on
          desktop, inline on mobile) */}
      <p
        aria-hidden
        className="font-[family-name:var(--font-display)] font-bold tracking-tight leading-none mb-2 md:mb-0 md:absolute md:-left-24 md:top-2"
        style={{
          color: accent,
          fontSize: "clamp(3rem, 5vw, 5rem)",
          opacity: 0.7,
        }}
      >
        {String(index + 1).padStart(2, "0")}
      </p>

      {/* Chapter title */}
      <h2 className="font-[family-name:var(--font-display)] font-semibold tracking-tight text-[clamp(2rem,4vw,3.5rem)] leading-[1.05] text-[var(--color-ink)] mb-10 max-w-[20ch]">
        {block.title}
      </h2>

      {/* Body with dropcap on first letter */}
      <p
        className="text-lg md:text-xl leading-relaxed text-[var(--color-ink-2)] max-w-[64ch] dropcap-paragraph"
        style={{
          // Inline first-letter style via CSS — Tailwind's first-letter
          // utility doesn't accept arbitrary color, so we ship a class
          // that applies the dropcap treatment via custom rules.
        }}
      >
        <span
          className="float-left font-[family-name:var(--font-display)] font-bold leading-none mr-3 mt-1"
          style={{
            color: accent,
            fontSize: "clamp(3.5rem, 6vw, 5rem)",
          }}
        >
          {block.body.charAt(0)}
        </span>
        {block.body.slice(1)}
      </p>

      {/* Compact highlights list */}
      {block.highlights && block.highlights.length > 0 && (
        <ul className="mt-12 space-y-3 pt-8 border-t border-[var(--color-divider)]">
          {block.highlights.map((h, hi) => (
            <li
              key={h}
              className="flex items-start gap-4 text-[var(--color-ink-2)]"
            >
              <span
                className="font-[family-name:var(--font-mono)] text-xs font-semibold mt-1.5 shrink-0 w-6"
                style={{ color: accent }}
              >
                {String(hi + 1).padStart(2, "0")}
              </span>
              <span className="text-base leading-relaxed">{h}</span>
            </li>
          ))}
        </ul>
      )}
    </motion.section>
  );
}
