"use client";

import Link from "next/link";
import { motion, useMotionValue, useSpring } from "motion/react";
import { useRef, type MouseEvent } from "react";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { BrandMark } from "@/components/ui/BrandMark";

const APPLE_EASE = [0.32, 0.72, 0, 1] as const;

/**
 * 404 — on-brand not-found.
 *
 * Same design language as every other page (cinematic dark, accent
 * blue, Geist + Instrument Serif). The "404." headline mirrors the
 * case-study hero treatment — massive display sans with the period
 * in the accent color, animated arrival sequence.
 *
 * Three CTAs: home, work archive, contact. Each one a magnetic
 * link so the page still has the polish-detail moments even on
 * an error route. The pulse dot up top is the "you're somewhere
 * weird" status signal — same dot pattern used in the hero.
 *
 * Background: same accent radial wash as case-study heroes, dimmer
 * so the focus stays on the typography.
 */
export default function NotFound() {
  return (
    <main
      className="relative min-h-[100svh] flex flex-col items-center justify-center px-6 overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse 70% 50% at 50% 70%, rgba(10, 132, 255, 0.10) 0%, transparent 70%)",
      }}
    >
      <div className="container-page relative z-10 text-center">
        {/* Brand mark — quiet identity beat at the top */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: APPLE_EASE }}
          className="flex justify-center mb-12 md:mb-16"
        >
          <BrandMark size={48} className="text-[var(--color-ink-2)]" />
        </motion.div>

        {/* Pulse + status row */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex items-center justify-center gap-2.5 mb-10"
        >
          <span className="pulse-blue" />
          <span className="type-eyebrow text-[var(--color-accent)]">
            Status · Not Found
          </span>
        </motion.div>

        {/* The 404 — same arrival as the hero name */}
        <motion.h1
          initial={{ opacity: 0, y: 28, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0)" }}
          transition={{
            duration: 1.1,
            delay: 0.3,
            ease: APPLE_EASE,
          }}
          className="type-display-xl text-[var(--color-ink)] leading-[0.9] mb-12 md:mb-16"
        >
          404<span className="text-[var(--color-accent)]">.</span>
        </motion.h1>

        {/* One-liner */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.9,
            delay: 0.55,
            ease: APPLE_EASE,
          }}
          className="type-body-lg text-[var(--color-ink-2)] max-w-[44ch] mx-auto mb-14 md:mb-20"
        >
          That page got lost in production. Let&apos;s get you back to
          something that exists.
        </motion.p>

        {/* CTA row — three magnetic links */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.9,
            delay: 0.75,
            ease: APPLE_EASE,
          }}
          className="flex flex-wrap items-center justify-center gap-3 md:gap-4"
        >
          <MagneticButton href="/" primary>
            <ArrowLeft size={16} strokeWidth={2} />
            Home
          </MagneticButton>
          <MagneticButton href="/work">
            Selected work
            <ArrowUpRight size={16} strokeWidth={2} />
          </MagneticButton>
          <MagneticButton href="/about">
            About
            <ArrowUpRight size={16} strokeWidth={2} />
          </MagneticButton>
        </motion.div>
      </div>
    </main>
  );
}

/** Minimal magnetic button — same pattern as Contact section. */
function MagneticButton({
  children,
  href,
  primary,
}: {
  children: React.ReactNode;
  href: string;
  primary?: boolean;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 18, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 200, damping: 18, mass: 0.4 });

  function onMouseMove(e: MouseEvent<HTMLAnchorElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const dx = e.clientX - (rect.left + rect.width / 2);
    const dy = e.clientY - (rect.top + rect.height / 2);
    const ratio = 12 / Math.max(rect.width, rect.height);
    x.set(dx * ratio);
    y.set(dy * ratio);
  }

  function onMouseLeave() {
    x.set(0);
    y.set(0);
  }

  const variantClass = primary
    ? "bg-[var(--color-accent)] text-[var(--color-ink)] hover:bg-[var(--color-accent-hover)]"
    : "border border-[var(--color-divider)] text-[var(--color-ink)] hover:border-[var(--color-ink-2)]";

  return (
    <Link href={href} legacyBehavior passHref>
      <motion.a
        ref={ref}
        style={{ x: sx, y: sy }}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        className={`inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full text-sm font-medium transition-colors duration-300 gpu ${variantClass}`}
      >
        {children}
      </motion.a>
    </Link>
  );
}
