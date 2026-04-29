"use client";

import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { useRef, type MouseEvent } from "react";
import { WORK, type WorkItem } from "@/lib/work";

/**
 * WorkGrid — 4-up grid of project tiles with 3D mouse tilt.
 *
 * The signature interaction: hover any tile and it tilts subtly
 * toward the cursor as if it's a card on a glass surface. The tilt
 * uses the cursor's position relative to the tile center to compute
 * rotateX / rotateY. Spring-smoothed so the tile follows the cursor
 * with weight rather than snapping.
 *
 * Apple uses this exact effect on the iPhone 15 Pro page when
 * showcasing different colors / materials. The trick is keeping the
 * tilt SUBTLE — max 6° per axis. Anything more reads as gimmicky.
 *
 * On click the tile routes to /work/[slug] with a smooth page
 * transition (handled by template.tsx).
 */
export function WorkGrid() {
  return (
    <section
      id="work"
      className="relative section py-24 md:py-32 border-t border-[var(--color-divider)]"
    >
      <div className="container-page">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{
            duration: 0.9,
            ease: [0.32, 0.72, 0, 1],
          }}
          className="mb-16 md:mb-20"
        >
          <p className="type-eyebrow text-[var(--color-accent)] mb-6 flex items-center gap-2.5">
            <span className="size-1.5 rounded-full bg-[var(--color-accent)]" />
            Selected work
          </p>
          <h2 className="type-display-lg text-[var(--color-ink)] max-w-[18ch]">
            Things I&apos;ve shipped end-to-end.
          </h2>
        </motion.div>

        {/* 2x2 grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {WORK.map((item, i) => (
            <WorkTile key={item.slug} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function WorkTile({ item, index }: { item: WorkItem; index: number }) {
  const ref = useRef<HTMLAnchorElement>(null);

  // Mouse-driven 3D tilt motion values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Spring-smooth so the tilt has weight, doesn't snap
  const sx = useSpring(mouseX, {
    stiffness: 150,
    damping: 22,
    mass: 0.5,
  });
  const sy = useSpring(mouseY, {
    stiffness: 150,
    damping: 22,
    mass: 0.5,
  });

  // Map mouse position [-0.5, 0.5] to rotation [-6deg, 6deg].
  // rotateX is INVERTED — moving the mouse up should tilt the card
  // toward you (rotateX positive = top tilts toward viewer).
  const rotateX = useTransform(sy, [-0.5, 0.5], [6, -6]);
  const rotateY = useTransform(sx, [-0.5, 0.5], [-6, 6]);

  // Subtle scale on hover, also spring-smoothed
  const scale = useMotionValue(1);
  const sScale = useSpring(scale, {
    stiffness: 150,
    damping: 22,
    mass: 0.5,
  });

  function onMouseMove(e: MouseEvent<HTMLAnchorElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    // Normalize cursor position to [-0.5, 0.5] across the tile
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function onMouseEnter() {
    scale.set(1.015);
  }

  function onMouseLeave() {
    mouseX.set(0);
    mouseY.set(0);
    scale.set(1);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{
        duration: 0.9,
        delay: 0.05 + index * 0.08,
        ease: [0.32, 0.72, 0, 1],
      }}
      style={{ perspective: 1200 }}
    >
      <Link
        ref={ref}
        href={`/work/${item.slug}`}
        onMouseMove={onMouseMove}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        aria-label={`${item.name} — ${item.summary}`}
        className="block group"
      >
        <motion.article
          style={{
            rotateX,
            rotateY,
            scale: sScale,
            transformStyle: "preserve-3d",
          }}
          className="relative surface-2 overflow-hidden p-7 md:p-10 h-full min-h-[320px] md:min-h-[400px] gpu"
        >
          {/* Project screenshot as background — only when item.image
              is set. The image fills the tile under a dark gradient
              overlay so foreground text stays legible. Subtle scale
              on hover (driven by group-hover) gives a "ken-burns"
              feel. Falls back to flat surface for projects without
              an image (e.g., Sovereign). */}
          {item.image && (
            <div
              aria-hidden
              className="absolute inset-0 overflow-hidden pointer-events-none"
            >
              <Image
                src={item.image}
                alt=""
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                quality={90}
                className="object-cover object-top scale-105 group-hover:scale-110 transition-transform duration-700 ease-out"
              />
              {/* Dark gradient overlay — bottom is solid surface
                  so text reads cleanly; top fades to mostly
                  transparent to let the screenshot breathe. */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.7) 40%, rgba(10,10,10,0.95) 80%, rgba(10,10,10,0.98) 100%)",
                }}
              />
            </div>
          )}

          {/* Hover ring — Apple-blue glow that fades in on hover */}
          <div
            aria-hidden
            className="absolute inset-0 rounded-[inherit] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{
              boxShadow:
                "inset 0 0 0 1px rgba(10, 132, 255, 0.4), 0 0 40px rgba(10, 132, 255, 0.12)",
            }}
          />

          {/* All foreground content sits on top of the image+overlay
              via z-10. */}
          <div className="relative z-10 flex flex-col h-full">
            {/* Top row: index + arrow */}
            <div className="flex items-start justify-between mb-12 md:mb-16">
              <p className="type-eyebrow text-[var(--color-accent)] flex items-center gap-2">
                <span className="size-1 rounded-full bg-[var(--color-accent)]" />
                {item.index} · {item.year}
              </p>
              <motion.span
                animate={{ x: 0, y: 0 }}
                whileHover={{ x: 4, y: -4 }}
                transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
                className="text-[var(--color-ink-3)] group-hover:text-[var(--color-accent)] transition-colors duration-300"
              >
                <ArrowUpRight size={28} strokeWidth={1.5} />
              </motion.span>
            </div>

            {/* Spacer pushes the textual content to the bottom of
                the tile when an image is set, so the screenshot has
                room to breathe up top. Falls back to natural flow
                for image-less tiles. */}
            {item.image && <div className="flex-1" />}

            {/* Project name */}
            <h3 className="font-[family-name:var(--font-display)] text-4xl md:text-5xl font-semibold tracking-tight text-[var(--color-ink)] mb-2">
              {item.name}
            </h3>
            <p className="text-[var(--color-ink-3)] mb-8">{item.kind}</p>

            {/* Summary */}
            <p className="type-body text-[var(--color-ink-2)] mb-10 max-w-[44ch]">
              {item.summary}
            </p>

            {/* Tags row */}
            <div className="flex flex-wrap gap-1.5 mt-auto">
              {item.tags.slice(0, 4).map((t) => (
                <span
                  key={t}
                  className="text-[0.7rem] font-mono px-2 py-0.5 rounded border border-[var(--color-divider)] text-[var(--color-ink-2)]"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </motion.article>
      </Link>
    </motion.div>
  );
}
