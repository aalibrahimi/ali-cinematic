"use client";

import {
  motion,
  useInView,
  useMotionValue,
  useTransform,
  animate,
} from "motion/react";
import Link from "next/link";
import Image from "next/image";
import { Fragment, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import type { WorkItem, WorkStat } from "@/lib/work";

const APPLE_EASE = [0.32, 0.72, 0, 1] as const;

/**
 * Case-study layout — cinematic hero + stats grid + sticky-nav
 * split-screen body.
 *
 * Page anatomy (top → bottom):
 *   1. CaseHero      — back link · eyebrow · massive name with accent
 *                      period · italic pull quote on accent radial wash
 *   2. StatsGrid     — 4 cells with count-up animation triggered on
 *                      view (Apple system color per project)
 *   3. SplitScreen   — left sticky chapter navigator + right scrolling
 *                      chapters with mid-body editorial-band interlude
 *                      after Chapter 01
 *
 * The hero + stats are full-bleed above the split. The split-screen
 * begins below them, with the IntersectionObserver-driven chapter
 * highlight kicking in as the user scrolls into the chapters.
 *
 * Naming kept as `SplitScreenVariant` for backward compat with
 * page.tsx imports — this is now THE case-study layout.
 */

interface Props {
  item: WorkItem;
}

export function SplitScreenVariant({ item }: Props) {
  return (
    <>
      <CaseHero item={item} />
      <StatsGrid stats={item.stats} accent={item.accent} />
      <SplitBody item={item} />
    </>
  );
}

/* ─────────────────────────────────────────────────────────────────
   InlineScreenshot — column-width product shot rendered inside
   Chapter 01 as a proper <figure>. Replaces the previous full-bleed
   standalone Screenshot section that dominated the page; this
   version reads as a visual aside within the document flow, sized
   to the right column it lives in.
   ───────────────────────────────────────────────────────────────── */

function InlineScreenshot({
  image,
  alt,
  accent,
}: {
  image: string;
  alt: string;
  accent: string;
}) {
  return (
    <motion.figure
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.9, ease: APPLE_EASE }}
      className="relative my-2 gpu"
    >
      <div
        className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden border bg-[var(--color-surface-2)]"
        style={{ borderColor: `${accent}30` }}
      >
        <Image
          src={image}
          alt={`${alt} home page`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 67vw, 800px"
          className="object-cover object-top"
        />
      </div>
      {/* Soft accent glow underneath — subtle product-shot lift */}
      <div
        aria-hidden
        className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-2/3 h-8 rounded-full pointer-events-none"
        style={{
          background: `radial-gradient(ellipse, ${accent}25 0%, transparent 70%)`,
          filter: "blur(20px)",
        }}
      />
      <figcaption className="mt-6 text-xs text-[var(--color-ink-3)] font-[family-name:var(--font-mono)] tracking-wide">
        / {alt} · live preview
      </figcaption>
    </motion.figure>
  );
}

/* ─────────────────────────────────────────────────────────────────
   CaseHero — the cinematic top moment.

   Back link · eyebrow with index/year/role · massive project name
   with accent-color period · italic pull quote in display-md.
   Background: radial accent wash from the bottom for cinematic depth.
   ───────────────────────────────────────────────────────────────── */

function CaseHero({ item }: { item: WorkItem }) {
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

        {/* Eyebrow row — index · year · role */}
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

        {/* Big project name with accent period */}
        <motion.h1
          initial={{ opacity: 0, y: 28, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1.1, delay: 0.15, ease: APPLE_EASE }}
          className="type-display-xl text-[var(--color-ink)] leading-[0.9]"
        >
          {item.name}
          <span style={{ color: item.accent }}>.</span>
        </motion.h1>

        {/* Italic pull quote */}
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
   StatsGrid — 4 cells with count-up on view. For non-numeric values
   the cell skips the counter and renders the string as-is.
   ───────────────────────────────────────────────────────────────── */

function StatsGrid({
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
  // Pull a number out of the value if there is one — e.g. "120k+"
  // gives 120 with suffix "k+". Non-numeric values like "Solo" or
  // "Tauri" skip the counter.
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
   SplitBody — sticky-nav left + scrolling chapters right.

   The "Overview" anchor scrolls back to the very top of the page
   (where the hero lives). Active chapter is detected via
   IntersectionObserver — when the user is above all chapter
   sections (i.e., still in the hero / stats area), `activeIndex`
   stays at -1 and the Overview entry is marked active.
   ───────────────────────────────────────────────────────────────── */

function SplitBody({ item }: { item: WorkItem }) {
  const [activeIndex, setActiveIndex] = useState(-1);
  const blockRefs = useRef<Array<HTMLElement | null>>([]);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    blockRefs.current.forEach((el, i) => {
      if (!el) return;
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveIndex(i);
            }
          });
        },
        {
          rootMargin: "-40% 0px -50% 0px",
          threshold: 0,
        }
      );
      observer.observe(el);
      observers.push(observer);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, [item.blocks.length]);

  function scrollToBlock(i: number) {
    const el = blockRefs.current[i];
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <section className="container-page py-16 md:py-24 border-t border-[var(--color-divider)]">
      <div className="grid grid-cols-12 gap-6 md:gap-12">
        {/* LEFT: Sticky navigator */}
        <aside className="col-span-12 md:col-span-4 lg:col-span-3">
          <div className="sticky top-24 space-y-12">
            {/* Project meta — recap of hero, scaled down for the
                sticky panel. Acts as a "you're reading this" reminder
                while the user is deep in the chapters. */}
            <div>
              <p
                className="type-eyebrow flex items-center gap-2 mb-5"
                style={{ color: item.accent }}
              >
                <span
                  className="size-1.5 rounded-full"
                  style={{ backgroundColor: item.accent }}
                />
                {item.index} · {item.kind}
              </p>
              <h2 className="font-[family-name:var(--font-display)] text-3xl md:text-4xl font-bold tracking-tight leading-[0.95] text-[var(--color-ink)] mb-4">
                {item.name}
                <span style={{ color: item.accent }}>.</span>
              </h2>
              <p className="text-sm text-[var(--color-ink-2)] mb-2">
                {item.role}
              </p>
              <p className="text-xs text-[var(--color-ink-3)]">
                {item.year}
              </p>
            </div>

            {/* Chapter list */}
            <nav aria-label="Case study chapters">
              <p className="type-eyebrow text-[var(--color-ink-3)] mb-4">
                / Chapters
              </p>
              <ul className="space-y-1">
                <ChapterLink
                  label="Overview"
                  number="00"
                  active={activeIndex === -1}
                  accent={item.accent}
                  onClick={scrollToTop}
                />
                {item.blocks.map((b, i) => (
                  <ChapterLink
                    key={b.title}
                    label={b.title}
                    number={String(i + 1).padStart(2, "0")}
                    active={activeIndex === i}
                    accent={item.accent}
                    onClick={() => scrollToBlock(i)}
                  />
                ))}
                <ChapterLink
                  label="Stack"
                  number="—"
                  active={activeIndex === item.blocks.length}
                  accent={item.accent}
                  onClick={() => scrollToBlock(item.blocks.length)}
                />
              </ul>
            </nav>

            {/* Headline stat callout */}
            <div className="pt-8 border-t border-[var(--color-divider)]">
              <p className="type-eyebrow text-[var(--color-ink-3)] mb-3">
                / Headline stat
              </p>
              <p
                className="font-[family-name:var(--font-display)] text-4xl font-semibold tracking-tight leading-none mb-2"
                style={{ color: item.accent }}
              >
                {item.stats[0]?.value}
              </p>
              <p className="text-xs text-[var(--color-ink-2)]">
                {item.stats[0]?.label}
              </p>
            </div>
          </div>
        </aside>

        {/* RIGHT: Scrolling chapters */}
        <div className="col-span-12 md:col-span-8 lg:col-span-9 space-y-20 md:space-y-24">
          {item.blocks.map((block, i) => (
            <Fragment key={block.title}>
              <section
                ref={(el) => {
                  blockRefs.current[i] = el;
                }}
                className="space-y-8 scroll-mt-24"
              >
                <div className="flex items-baseline gap-4">
                  <span
                    className="type-eyebrow font-semibold"
                    style={{ color: item.accent }}
                  >
                    Chapter {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <h2 className="type-display-md text-[var(--color-ink)] max-w-[24ch] leading-tight">
                  {block.title}
                </h2>

                {/* Inline screenshot — only on Chapter 01, only when
                    the project has an image. Sits between the title
                    and the body prose like a magazine figure. */}
                {i === 0 && item.image && (
                  <InlineScreenshot
                    image={item.image}
                    alt={item.name}
                    accent={item.accent}
                  />
                )}

                <p className="type-body-lg text-[var(--color-ink-2)] max-w-[64ch]">
                  {block.body}
                </p>

                {block.highlights && (
                  <ul className="pt-6 space-y-3 border-t border-[var(--color-divider)] mt-8">
                    {block.highlights.map((h, hi) => (
                      <motion.li
                        key={h}
                        initial={{ opacity: 0, x: -8 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-10%" }}
                        transition={{
                          duration: 0.6,
                          delay: hi * 0.08,
                          ease: APPLE_EASE,
                        }}
                        className="flex items-start gap-4 group"
                      >
                        <span
                          className="font-[family-name:var(--font-mono)] text-xs font-semibold mt-1.5 shrink-0"
                          style={{ color: item.accent }}
                        >
                          {String(hi + 1).padStart(2, "0")}
                        </span>
                        <span className="text-base text-[var(--color-ink)] leading-relaxed">
                          {h}
                        </span>
                      </motion.li>
                    ))}
                  </ul>
                )}
              </section>

              {/* Editorial-style interlude band — only after the
                  first block. Top + bottom accent rules, centered
                  eyebrow, massive italic display sans pull quote. */}
              {i === 0 && item.blocks.length > 1 && (
                <motion.section
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-15%" }}
                  transition={{ duration: 0.9, ease: APPLE_EASE }}
                  className="py-16 md:py-20 border-y"
                  style={{ borderColor: item.accent }}
                >
                  <p
                    className="type-eyebrow mb-6 text-center"
                    style={{ color: item.accent }}
                  >
                    · Interlude
                  </p>
                  <p className="font-[family-name:var(--font-display)] italic text-3xl md:text-4xl lg:text-5xl leading-tight text-[var(--color-ink)] max-w-[24ch] mx-auto text-center">
                    &ldquo;{item.interlude}&rdquo;
                  </p>
                </motion.section>
              )}
            </Fragment>
          ))}

          {/* Stack section — last block-tracked section. Goes after
              the chapters at index `item.blocks.length` so the
              IntersectionObserver picks it up and the Stack chapter
              link in the left nav highlights when active. */}
          <section
            ref={(el) => {
              blockRefs.current[item.blocks.length] = el;
            }}
            className="space-y-8 pt-8 border-t border-[var(--color-divider)] scroll-mt-24"
          >
            <p
              className="type-eyebrow"
              style={{ color: item.accent }}
            >
              / Stack
            </p>
            <div className="flex flex-wrap items-center gap-2">
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
                className="inline-flex items-center gap-2.5 px-7 py-4 rounded-full text-base font-medium transition-colors duration-300 mt-6"
                style={{ backgroundColor: item.accent, color: "#fff" }}
              >
                Visit {item.link.label}
                <ArrowUpRight size={16} strokeWidth={2} />
              </a>
            )}
          </section>
        </div>
      </div>
    </section>
  );
}

function ChapterLink({
  label,
  number,
  active,
  accent,
  onClick,
}: {
  label: string;
  number: string;
  active: boolean;
  accent: string;
  onClick: () => void;
}) {
  return (
    <li>
      <button
        onClick={onClick}
        className="group flex items-baseline gap-3 w-full text-left py-2 transition-colors"
      >
        <span
          className="font-[family-name:var(--font-mono)] text-xs font-semibold transition-colors w-6 shrink-0"
          style={{ color: active ? accent : "var(--color-ink-3)" }}
        >
          {number}
        </span>
        <span
          className={`text-sm transition-colors ${
            active
              ? "text-[var(--color-ink)] font-medium"
              : "text-[var(--color-ink-2)] group-hover:text-[var(--color-ink)]"
          }`}
        >
          {label}
        </span>
        {active && (
          <motion.span
            layoutId="active-chapter-dot"
            className="size-1.5 rounded-full ml-auto"
            style={{ backgroundColor: accent }}
          />
        )}
      </button>
    </li>
  );
}
