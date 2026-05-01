"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import Image from "next/image";

const APPLE_EASE = [0.32, 0.72, 0, 1] as const;

const TIMELINE = [
  {
    when: "2025—",
    title: "Building Simplicity",
    body: "Solo founder. Designing and engineering a personal-finance OS from the schema up.",
  },
  {
    when: "2024—",
    title: "Founded CodeWithAli",
    body: "An independent software studio. Selective engagements with founders on agent infrastructure, design systems, and product surfaces.",
  },
  {
    when: "2021—2024",
    title: "Building tools",
    body: "Spent four years quietly making things. Some shipped, most didn't. Learned the difference between a project and a product.",
  },
];

const BELIEFS = [
  {
    n: "01",
    statement: "Taste is the only moat I trust.",
    body: "Models will get cheaper. Frameworks will rotate. Judgment about what should exist is the thing nobody can copy at scale, so I keep mine sharp.",
  },
  {
    n: "02",
    statement: "Build the whole thing yourself, at least once.",
    body: "Specialization is overrated until you've shipped something end-to-end. The seams in a system only make sense when you've stitched them yourself.",
  },
  {
    n: "03",
    statement: "Speed is attention, not effort.",
    body: "I take a 21-second cold-load down to 3.5s because I read the network tab instead of guessing. Most performance work is just attention paid early to the right twenty lines.",
  },
  {
    n: "04",
    statement: "Don't let frameworks date your work.",
    body: "Trends in JavaScript move faster than trust does. I write code I'd be proud to ship in 2030, even if the build tooling underneath gets replaced three times by then.",
  },
  {
    n: "05",
    statement: "Ship anyway.",
    body: "There's always a reason to wait. None of those reasons survive contact with the deadline. Ship anyway, then sharpen it in public.",
  },
];

export function AboutHero() {
  return (
    <section className="pt-32 md:pt-44 pb-16 md:pb-24">
      <div className="relative container-page">
        {/* Profile Pic */}
        <div className="absolute right-0 w-100 h-auto rounded-md overflow-clip">
          <Image
          src="/linkedin_profile.jpeg"
          alt="Profile Photo"
          width={1000}
          height={1000}
          draggable={false}
        />
        </div>
        <motion.div
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: APPLE_EASE }}
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-[var(--color-ink-2)] hover:text-[var(--color-accent)] transition-colors mb-12 md:mb-16"
          >
            <ArrowLeft size={14} />
            Home
          </Link>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: APPLE_EASE }}
          className="type-eyebrow text-[var(--color-accent)] mb-8 flex items-center gap-2.5"
        >
          <span className="size-1.5 rounded-full bg-[var(--color-accent)]" />
          Index 03 · About
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 28, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1.1, delay: 0.1, ease: APPLE_EASE }}
          className="type-display-xl text-[var(--color-ink)] leading-[0.9]"
        >
          About<span className="text-[var(--color-accent)]">.</span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4, ease: APPLE_EASE }}
          className="grid grid-cols-12 gap-8 mt-12 md:mt-16"
        >
          <p className="col-span-12 md:col-span-9 type-body-lg text-[var(--color-ink-2)] max-w-[60ch]">
            I&apos;m Ali. I make software end-to-end — the surface, the
            system, the design language that holds them together. Right now
            that means{" "}
            <Link
              href="/work/simplicity"
              className="text-[var(--color-ink)] underline decoration-[var(--color-accent)] decoration-2 underline-offset-4 hover:text-[var(--color-accent)] transition-colors"
            >
              Simplicity
            </Link>
            , a personal-finance operating system I&apos;m building solo, and{" "}
            <a
              href="https://codewithali.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--color-ink)] underline decoration-[var(--color-accent)] decoration-2 underline-offset-4 hover:text-[var(--color-accent)] transition-colors"
            >
              CodeWithAli
            </a>
            , the studio I run alongside it.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

export function Timeline() {
  return (
    <section className="section py-24 md:py-32 border-t border-[var(--color-divider)]">
      <div className="container-page">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 0.9, ease: APPLE_EASE }}
          className="grid grid-cols-12 gap-8 mb-16 md:mb-24"
        >
          <p className="col-span-12 md:col-span-3 type-eyebrow text-[var(--color-ink-3)]">
            / Timeline
          </p>
          <h2 className="col-span-12 md:col-span-9 type-display-lg text-[var(--color-ink)] max-w-[18ch]">
            The chapters that{" "}
            <span className="italic text-[var(--color-accent)]">matter</span>.
          </h2>
        </motion.div>

        <ol className="space-y-14 md:space-y-20 max-w-5xl">
          {TIMELINE.map((t) => (
            <motion.li
              key={t.title}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-15%" }}
              transition={{ duration: 0.9, ease: APPLE_EASE }}
              className="grid grid-cols-12 gap-4 md:gap-8 border-l-2 border-[var(--color-accent)] pl-6 md:pl-8"
            >
              <p className="col-span-12 md:col-span-3 type-eyebrow text-[var(--color-accent)] pt-2">
                {t.when}
              </p>
              <div className="col-span-12 md:col-span-9">
                <h3 className="type-display-md text-[var(--color-ink)] mb-5">
                  {t.title}
                </h3>
                <p className="type-body-lg max-w-[60ch]">{t.body}</p>
              </div>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function Beliefs() {
  return (
    <section
      id="beliefs"
      className="section py-24 md:py-32 border-t border-[var(--color-divider)]"
    >
      <div className="container-page">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 0.9, ease: APPLE_EASE }}
          className="grid grid-cols-12 gap-8 mb-16 md:mb-24"
        >
          <p className="col-span-12 md:col-span-3 type-eyebrow text-[var(--color-ink-3)]">
            / Beliefs
          </p>
          <h2 className="col-span-12 md:col-span-9 type-display-lg text-[var(--color-ink)] max-w-[20ch]">
            What I&apos;ve come to{" "}
            <span className="italic text-[var(--color-accent)]">believe</span>.
          </h2>
        </motion.div>

        <ol className="space-y-16 md:space-y-24 max-w-5xl">
          {BELIEFS.map((b) => (
            <motion.li
              key={b.n}
              initial={{ opacity: 0, y: 32, scale: 0.98 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-15%" }}
              transition={{ duration: 1, ease: APPLE_EASE }}
              className="grid grid-cols-12 gap-4 md:gap-8"
            >
              <span className="col-span-2 md:col-span-1 type-eyebrow text-[var(--color-accent)] pt-3">
                {b.n}
              </span>
              <div className="col-span-10 md:col-span-11">
                <h3 className="type-display-md italic text-[var(--color-ink)] mb-6 leading-tight max-w-[24ch]">
                  {b.statement}
                </h3>
                <p className="type-body-lg max-w-[60ch]">{b.body}</p>
              </div>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function AboutCTA() {
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
            See the work?
          </p>
          <p className="type-display-md text-[var(--color-ink)] max-w-[18ch]">
            Selected{" "}
            <span className="italic text-[var(--color-accent)]">work</span>.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 0.9, delay: 0.1, ease: APPLE_EASE }}
        >
          <Link
            href="/work"
            className="inline-flex items-center gap-2.5 px-7 py-4 rounded-full bg-[var(--color-accent)] text-[var(--color-ink)] text-base font-medium hover:bg-[var(--color-accent-hover)] transition-colors duration-300"
          >
            Browse projects
            <ArrowUpRight size={16} strokeWidth={2} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
