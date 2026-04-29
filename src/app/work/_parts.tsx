"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";

const APPLE_EASE = [0.32, 0.72, 0, 1] as const;

/**
 * Client-side parts of the /work archive page. The route page itself
 * stays a server component for SEO + faster TTFB; these motion-driven
 * pieces opt into client rendering only where the animations live.
 */

export function ArchiveHero() {
  return (
    <section className="pt-32 md:pt-44 pb-16 md:pb-24">
      <div className="container-page">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: APPLE_EASE }}
          className="type-eyebrow text-[var(--color-accent)] mb-8 flex items-center gap-2.5"
        >
          <span className="size-1.5 rounded-full bg-[var(--color-accent)]" />
          Index 02 · Work
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 28, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{
            duration: 1.1,
            delay: 0.1,
            ease: APPLE_EASE,
          }}
          className="type-display-xl text-[var(--color-ink)] leading-[0.9]"
        >
          Work<span className="text-[var(--color-accent)]">.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4, ease: APPLE_EASE }}
          className="type-body-lg max-w-[52ch] mt-10 md:mt-14"
        >
          Things I&apos;ve shipped end-to-end — design, code, and the whole
          spine in between. Each project I led personally; most of them I
          built alone.
        </motion.p>
      </div>
    </section>
  );
}

export function ArchiveCTA() {
  return (
    <section className="section py-24 md:py-32 border-t border-[var(--color-divider)]">
      <div className="container-page flex flex-col md:flex-row md:items-end justify-between gap-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 0.9, ease: APPLE_EASE }}
        >
          <p className="type-eyebrow text-[var(--color-accent)] mb-5">
            Have a project?
          </p>
          <p className="type-display-md text-[var(--color-ink)] max-w-[18ch]">
            Let&apos;s build{" "}
            <span className="italic text-[var(--color-accent)]">
              something
            </span>
            .
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 0.9, delay: 0.1, ease: APPLE_EASE }}
        >
          <Link
            href="/#contact"
            className="inline-flex items-center gap-2.5 px-7 py-4 rounded-full bg-[var(--color-accent)] text-[var(--color-ink)] text-base font-medium hover:bg-[var(--color-accent-hover)] transition-colors duration-300"
          >
            Start a conversation
            <ArrowUpRight size={16} strokeWidth={2} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
