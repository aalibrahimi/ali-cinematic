"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { BrandMark } from "@/components/ui/BrandMark";
import { Hero3DLoader } from "@/components/ui/Hero3DLoader";
import { APPLE_EASE, HERO_SEQUENCE } from "@/lib/motion";

/**
 * Hero — cinematic opener.
 *
 * Choreographed 2.4s arrival sequence:
 *   0.0s — Black canvas (mounted).
 *   0.2s — Brand mark begins drawing (1.2s + 0.7s for crossbar).
 *   0.6s — "Ali" letters cascade in (40ms stagger, blur(8) → 0,
 *          y(40) → 0).
 *   0.85s — "Alibrahimi." italic letters cascade in.
 *   1.4s — Subtitle fades up.
 *   1.8s — Scroll cue appears.
 *
 * Scroll behavior:
 *   As the user scrolls past the hero, three layers respond with
 *   different parallax rates (driven by useTransform):
 *     - The brand mark drifts up + scales down toward the nav.
 *     - The headline drifts up faster + fades.
 *     - The ambient gradient drifts down (against the others) for
 *       a sense of cinematic depth.
 *
 * Background: a single radial gradient at the top center, slowly
 * rotating 360° over 60s. It's the only ambient motion on the page
 * — almost imperceptible but it stops the canvas from looking
 * "frozen" during the long pause after the arrival sequence ends.
 */

const NAME_LINE_1 = "Ali";
const NAME_LINE_2 = "Alibrahimi.";

/** Letter component — handles the cascade reveal for one character. */
function Letter({
  char,
  delay,
  italic,
}: {
  char: string;
  delay: number;
  italic?: boolean;
}) {
  return (
    <motion.span
      initial={{ opacity: 0, y: 56, filter: "blur(10px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 1.1, delay, ease: APPLE_EASE }}
      className={`inline-block ${italic ? "italic" : ""}`}
    >
      {char === " " ? " " : char}
    </motion.span>
  );
}

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Parallax transforms — three layers, three speeds.
  const titleY = useTransform(scrollYProgress, [0, 1], [0, -160]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const markScale = useTransform(scrollYProgress, [0, 1], [1, 0.4]);
  const markY = useTransform(scrollYProgress, [0, 1], [0, -240]);
  const gradientY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const cueOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative min-h-[100svh] flex flex-col items-center justify-center overflow-hidden"
    >
      {/* 3D centerpiece — scoped to the hero section only. Sits
          behind text via z-index. Multi-orbital particle scene
          described in Hero3D.tsx. */}
      <Hero3DLoader />

      {/* Ambient gradient — slow infinite rotation. The gradient
          itself is the only "color" on the black canvas; everything
          else is in grayscale. */}
      <motion.div
        aria-hidden
        style={{ y: gradientY }}
        className="absolute inset-0 pointer-events-none"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(10, 132, 255, 0.10) 0%, rgba(10, 132, 255, 0.02) 40%, transparent 70%)",
          }}
        />
      </motion.div>

      {/* Brand mark — top center. Strokes in then sits as a quiet
          credit on top of the hero. */}
      <motion.div
        style={{ scale: markScale, y: markY }}
        className="absolute top-20 md:top-24 z-10 gpu"
      >
        <BrandMark
          size={56}
          className="text-[var(--color-ink-2)]"
        />
      </motion.div>

      {/* Hero content */}
      <motion.div
        style={{ y: titleY, opacity: titleOpacity }}
        className="container-page relative z-10 text-center mt-12 md:mt-16 gpu"
      >
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: HERO_SEQUENCE.brandMark + 0.1 }}
          className="flex items-center justify-center gap-2.5 mb-12 md:mb-16"
        >
          <span className="pulse-blue" />
          <span className="type-eyebrow">Portfolio · 2026</span>
        </motion.div>

        {/* The name — letter cascade */}
        <h1 className="type-display-xl text-[var(--color-ink)]">
          <span className="block" aria-label="Ali">
            {NAME_LINE_1.split("").map((char, i) => (
              <Letter
                key={i}
                char={char}
                delay={
                  HERO_SEQUENCE.nameStart + i * HERO_SEQUENCE.nameStagger
                }
              />
            ))}
          </span>
          <span className="block" aria-label="Alibrahimi">
            {NAME_LINE_2.split("").map((char, i) => (
              <Letter
                key={i}
                char={char}
                italic
                delay={
                  HERO_SEQUENCE.italicStart +
                  i * HERO_SEQUENCE.italicStagger
                }
              />
            ))}
          </span>
        </h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 1.2,
            delay: HERO_SEQUENCE.subtitle,
            ease: APPLE_EASE,
          }}
          className="type-body-lg text-[var(--color-ink-2)] mt-10 md:mt-14 max-w-[44ch] mx-auto"
        >
          Software designer and engineer. End-to-end builder of products and
          the systems that hold them up.
        </motion.p>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: HERO_SEQUENCE.scrollCue }}
        style={{ opacity: cueOpacity }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
      >
        <span className="type-eyebrow text-[var(--color-ink-3)]">Scroll</span>
        {/* Animated mouse-style scroll indicator: 22px tall capsule,
            small dot inside that travels top → bottom on a loop.
            Same affordance Apple uses on Vision Pro / iPhone product
            page heroes. */}
        <div className="relative w-5 h-8 rounded-full border border-[var(--color-ink-3)] flex items-start justify-center pt-1.5">
          <motion.span
            animate={{ y: [0, 8, 0] }}
            transition={{
              duration: 1.6,
              repeat: Infinity,
              ease: APPLE_EASE,
            }}
            className="size-1 rounded-full bg-[var(--color-ink-2)]"
          />
        </div>
      </motion.div>
    </section>
  );
}
