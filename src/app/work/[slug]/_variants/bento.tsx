"use client";

import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import type { WorkItem } from "@/lib/work";

const APPLE_EASE = [0.32, 0.72, 0, 1] as const;

/**
 * Variant 01 — Bento Feature Grid.
 *
 * Apple iPhone 15 Pro features-section pattern. A single 12-column
 * asymmetric grid where every cell is a different size and weight:
 *
 *   - Hero name takes a 8-col cell, with a 4-col stat sidebar.
 *   - Quote sits in a wide 12-col band.
 *   - Stats appear as four 3-col cells in a row.
 *   - Each narrative block is one or two large cells; highlights are
 *     smaller surrounding cells.
 *   - Interlude takes a full 12-col band.
 *
 * The bento creates visual rhythm purely through cell variation —
 * no need for parallax or pinned scroll. Reads dense and premium,
 * like a product spec sheet redesigned by a magazine art director.
 */

interface Props {
  item: WorkItem;
}

export function BentoVariant({ item }: Props) {
  return (
    <article className="container-page py-16 md:py-24">
      <div className="grid grid-cols-12 gap-3 md:gap-4">
        {/* Eyebrow strip — 12 col */}
        <Cell size="12" reveal={0}>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 px-1">
            <span
              className="size-1.5 rounded-full"
              style={{ backgroundColor: item.accent }}
            />
            <span className="type-eyebrow" style={{ color: item.accent }}>
              {item.index} · {item.kind}
            </span>
            <span className="type-eyebrow text-[var(--color-ink-3)]">
              · {item.year} · {item.role}
            </span>
          </div>
        </Cell>

        {/* Hero name — 8 col, big */}
        <Cell size="8" reveal={0.05} surface>
          <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-between min-h-[280px] md:min-h-[400px]">
            <p className="type-eyebrow text-[var(--color-ink-3)]">
              / Project
            </p>
            <h1 className="font-[family-name:var(--font-display)] font-bold tracking-tight text-[clamp(3.5rem,9vw,9rem)] leading-[0.9] text-[var(--color-ink)] mt-8">
              {item.name}
              <span style={{ color: item.accent }}>.</span>
            </h1>
          </div>
        </Cell>

        {/* Index/year sidebar — 4 col */}
        <Cell size="4" reveal={0.1} surface accent={item.accent}>
          <div className="p-7 md:p-10 h-full flex flex-col justify-between min-h-[280px] md:min-h-[400px]">
            <div>
              <p className="type-eyebrow text-[var(--color-ink-3)] mb-2">
                / Index
              </p>
              <p
                className="font-[family-name:var(--font-display)] font-bold tracking-tight text-7xl md:text-8xl leading-none"
                style={{ color: item.accent }}
              >
                {item.index}
              </p>
            </div>
            <div>
              <p className="type-eyebrow text-[var(--color-ink-3)] mb-3">
                / Role
              </p>
              <p className="text-sm text-[var(--color-ink)] leading-snug">
                {item.role}
              </p>
            </div>
          </div>
        </Cell>

        {/* Quote band — 12 col, wide pull quote */}
        <Cell size="12" reveal={0.15} surface>
          <div className="p-8 md:p-14 lg:p-20">
            <blockquote className="font-[family-name:var(--font-display)] italic text-3xl md:text-4xl lg:text-5xl leading-tight text-[var(--color-ink)] max-w-[42ch]">
              &ldquo;{item.quote}&rdquo;
            </blockquote>
          </div>
        </Cell>

        {/* Stats row — 4 cells of 3 col each */}
        {item.stats.map((stat, i) => (
          <Cell key={stat.label} size="3" reveal={0.2 + i * 0.04} surface>
            <div className="p-6 md:p-8 h-full">
              <p
                className="type-eyebrow mb-4"
                style={{ color: item.accent }}
              >
                / 0{i + 1}
              </p>
              <p className="font-[family-name:var(--font-display)] text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight leading-none text-[var(--color-ink)] mb-2 tabular-nums">
                {stat.value}
              </p>
              <p className="text-xs text-[var(--color-ink-2)]">
                {stat.label}
              </p>
            </div>
          </Cell>
        ))}

        {/* Block 1: title (5 col) + body (7 col) */}
        {item.blocks[0] && (
          <>
            <Cell size="5" reveal={0.35} surface>
              <div className="p-7 md:p-10 h-full flex flex-col justify-between min-h-[260px]">
                <p
                  className="type-eyebrow flex items-center gap-2"
                  style={{ color: item.accent }}
                >
                  <span
                    className="size-1.5 rounded-full"
                    style={{ backgroundColor: item.accent }}
                  />
                  Chapter 01
                </p>
                <h2 className="type-display-md text-[var(--color-ink)] leading-[0.95] mt-12">
                  {item.blocks[0].title}
                </h2>
              </div>
            </Cell>
            <Cell size="7" reveal={0.4} surface>
              <div className="p-7 md:p-10 h-full flex items-center min-h-[260px]">
                <p className="type-body-lg text-[var(--color-ink-2)]">
                  {item.blocks[0].body}
                </p>
              </div>
            </Cell>
          </>
        )}

        {/* Highlights from block 1 — varied cell sizes */}
        {item.blocks[0]?.highlights?.map((h, hi) => {
          const sizes: Array<"4" | "6" | "8"> = ["6", "6", "4", "8", "12"];
          const size = sizes[hi % sizes.length] ?? "6";
          return (
            <Cell key={h} size={size} reveal={0.5 + hi * 0.04} surface>
              <div className="p-6 md:p-8 h-full flex flex-col gap-4 min-h-[140px] justify-between">
                <p
                  className="font-[family-name:var(--font-mono)] text-xs font-semibold"
                  style={{ color: item.accent }}
                >
                  {String(hi + 1).padStart(2, "0")} ·{" "}
                  <span className="text-[var(--color-ink-3)]">
                    HIGHLIGHT
                  </span>
                </p>
                <p className="text-base md:text-lg text-[var(--color-ink)] leading-snug">
                  {h}
                </p>
              </div>
            </Cell>
          );
        })}

        {/* Interlude — full 12 col band */}
        <Cell size="12" reveal={0.7} surface accent={item.accent}>
          <div
            className="p-10 md:p-16 lg:p-20 relative overflow-hidden"
            style={{
              background: `radial-gradient(ellipse 50% 70% at 50% 50%, ${item.accent}1A 0%, transparent 60%)`,
            }}
          >
            <p
              className="type-eyebrow mb-6"
              style={{ color: item.accent }}
            >
              · Interlude
            </p>
            <p className="font-[family-name:var(--font-display)] italic text-3xl md:text-5xl lg:text-6xl leading-tight text-[var(--color-ink)] max-w-[24ch]">
              &ldquo;{item.interlude}&rdquo;
            </p>
          </div>
        </Cell>

        {/* Remaining blocks — alternate layout (block 2: body left + title right) */}
        {item.blocks.slice(1).map((block, bi) => {
          const isEven = bi % 2 === 0;
          return (
            <div
              key={block.title}
              className="col-span-12 grid grid-cols-12 gap-3 md:gap-4"
            >
              <Cell
                size="7"
                reveal={0.75 + bi * 0.05}
                surface
                className={isEven ? "" : "md:order-2"}
              >
                <div className="p-7 md:p-10 h-full flex items-center min-h-[260px]">
                  <p className="type-body-lg text-[var(--color-ink-2)]">
                    {block.body}
                  </p>
                </div>
              </Cell>
              <Cell
                size="5"
                reveal={0.8 + bi * 0.05}
                surface
                className={isEven ? "" : "md:order-1"}
              >
                <div className="p-7 md:p-10 h-full flex flex-col justify-between min-h-[260px]">
                  <p
                    className="type-eyebrow flex items-center gap-2"
                    style={{ color: item.accent }}
                  >
                    <span
                      className="size-1.5 rounded-full"
                      style={{ backgroundColor: item.accent }}
                    />
                    Chapter {String(bi + 2).padStart(2, "0")}
                  </p>
                  <h2 className="type-display-md text-[var(--color-ink)] leading-[0.95] mt-12">
                    {block.title}
                  </h2>
                </div>
              </Cell>

              {block.highlights?.map((h, hi) => (
                <Cell
                  key={h}
                  size={hi % 2 === 0 ? "6" : "6"}
                  reveal={0.85 + bi * 0.05 + hi * 0.03}
                  surface
                >
                  <div className="p-6 md:p-8 h-full flex flex-col gap-4 min-h-[120px] justify-between">
                    <p
                      className="font-[family-name:var(--font-mono)] text-xs font-semibold"
                      style={{ color: item.accent }}
                    >
                      {String(hi + 1).padStart(2, "0")} ·{" "}
                      <span className="text-[var(--color-ink-3)]">
                        HIGHLIGHT
                      </span>
                    </p>
                    <p className="text-base text-[var(--color-ink)] leading-snug">
                      {h}
                    </p>
                  </div>
                </Cell>
              ))}
            </div>
          );
        })}

        {/* Stack chips + outbound */}
        <Cell size="8" reveal={1} surface>
          <div className="p-7 md:p-10 h-full">
            <p className="type-eyebrow text-[var(--color-ink-3)] mb-5">
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
          </div>
        </Cell>

        {item.link && (
          <Cell size="4" reveal={1.05} surface>
            <div className="p-7 md:p-10 h-full flex flex-col justify-between min-h-[140px]">
              <p className="type-eyebrow text-[var(--color-ink-3)]">
                / Visit
              </p>
              <a
                href={item.link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-between gap-3 px-5 py-3.5 rounded-full text-sm font-medium transition-colors duration-300 mt-6"
                style={{
                  backgroundColor: item.accent,
                  color: "#fff",
                }}
              >
                {item.link.label}
                <ArrowUpRight size={16} strokeWidth={2} />
              </a>
            </div>
          </Cell>
        )}
      </div>
    </article>
  );
}

/**
 * Cell — bento grid cell with reveal-on-scroll animation.
 *
 * Sizes are Tailwind col-span values mapped via the explicit class
 * lookup (Tailwind's JIT can only see static class names).
 */
function Cell({
  size,
  children,
  reveal = 0,
  surface,
  accent,
  className = "",
}: {
  size: "3" | "4" | "5" | "6" | "7" | "8" | "12";
  children: React.ReactNode;
  reveal?: number;
  surface?: boolean;
  accent?: string;
  className?: string;
}) {
  const colSpan: Record<typeof size, string> = {
    "3": "col-span-6 md:col-span-3",
    "4": "col-span-12 md:col-span-4",
    "5": "col-span-12 md:col-span-5",
    "6": "col-span-12 md:col-span-6",
    "7": "col-span-12 md:col-span-7",
    "8": "col-span-12 md:col-span-8",
    "12": "col-span-12",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8%" }}
      transition={{ duration: 0.7, delay: reveal, ease: APPLE_EASE }}
      className={`${colSpan[size]} ${className} ${
        surface
          ? "bg-[var(--color-surface)] border border-[var(--color-divider)] rounded-2xl overflow-hidden"
          : ""
      }`}
      style={accent ? { borderColor: `${accent}30` } : undefined}
    >
      {children}
    </motion.div>
  );
}
