"use client";

import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import type { WorkItem } from "@/lib/work";

/**
 * WorkRow — kinetic horizontal row used in the /work archive and as
 * "next project" pagination on case studies.
 *
 * Composition:
 *   - Left:    project index + accent dot
 *   - Center:  project name in display sans (the dramatic moment)
 *   - Mid:     kind + year stack
 *   - Right:   tag chips (hidden on mobile) + arrow that lifts on hover
 *
 * Hover behavior:
 *   - Whole row gets a faint elevated surface fill
 *   - Project name color shifts to the project's accent
 *   - Arrow lifts and switches to accent
 *   - Tags brighten from muted to full opacity
 *
 * The row is intentionally NOT wrapped in a link — callers decide how
 * to wrap it (Next Link, anchor, or unlinked).
 */
export function WorkRow({ item }: { item: WorkItem }) {
  return (
    <motion.div
      whileHover="hover"
      initial="rest"
      animate="rest"
      className="grid grid-cols-12 gap-4 md:gap-8 items-center py-7 md:py-10 border-b border-[var(--color-divider)] hover:bg-[var(--color-surface)] transition-colors duration-300 px-2 md:px-4 -mx-2 md:-mx-4"
    >
      {/* Index + dot */}
      <span className="col-span-2 md:col-span-1 type-eyebrow flex items-center gap-2">
        <span
          className="size-1.5 rounded-full"
          style={{ backgroundColor: item.accent }}
        />
        {item.index}
      </span>

      {/* Project name — the dramatic moment */}
      <h3 className="col-span-10 md:col-span-5 font-[family-name:var(--font-display)] text-3xl md:text-5xl font-semibold tracking-tight leading-[0.95]">
        <motion.span
          variants={{
            rest: { color: "var(--color-ink)" },
            hover: { color: item.accent },
          }}
          transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
          className="block"
        >
          {item.name}
        </motion.span>
      </h3>

      {/* Kind + year */}
      <div className="col-span-12 md:col-span-3 flex flex-col gap-0.5">
        <p className="text-sm md:text-base text-[var(--color-ink-2)]">
          {item.kind}
        </p>
        <p className="type-eyebrow text-[var(--color-ink-3)]">
          {item.year}
        </p>
      </div>

      {/* Tags — fade in on hover */}
      <motion.div
        variants={{ rest: { opacity: 0.55 }, hover: { opacity: 1 } }}
        transition={{ duration: 0.3 }}
        className="col-span-12 md:col-span-2 hidden md:flex flex-wrap gap-1.5"
      >
        {item.tags.slice(0, 3).map((t) => (
          <span
            key={t}
            className="text-[0.7rem] font-mono px-2 py-0.5 rounded border border-[var(--color-divider)] text-[var(--color-ink-2)]"
          >
            {t}
          </span>
        ))}
      </motion.div>

      {/* Arrow — lifts + colors on hover */}
      <motion.span
        variants={{
          rest: { x: 0, y: 0, opacity: 0.5, color: "var(--color-ink)" },
          hover: { x: 4, y: -4, opacity: 1, color: item.accent },
        }}
        transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
        className="col-span-12 md:col-span-1 flex justify-end gpu"
      >
        <ArrowUpRight size={28} strokeWidth={1.5} />
      </motion.span>
    </motion.div>
  );
}
