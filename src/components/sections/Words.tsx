"use client";

import { motion } from "motion/react";

/**
 * Words — three operating beliefs as scroll-driven moments.
 *
 * Each belief gets its own viewport-height moment. As the user scrolls
 * through, each one fades + scales up subtly while in view, then fades
 * out as it leaves. The pattern Apple uses on their values pages —
 * "Privacy", "Environment" — where each principle gets a full-screen
 * editorial beat.
 *
 * Composition per belief:
 *   - small numeric eyebrow (01, 02, 03)
 *   - massive italic statement
 *   - one-line elaboration below
 *
 * Generous vertical spacing between beliefs so each one has breathing
 * room. The reveal animation triggers when the belief enters the
 * viewport (margin -20%), giving it a deliberate "now reading this"
 * arrival.
 */

const BELIEFS = [
  {
    n: "01",
    statement: "Taste is the only moat I trust.",
    body: "Models will get cheaper. Frameworks will rotate. Judgment about what should exist is the thing nobody can copy at scale.",
  },
  {
    n: "02",
    statement: "Speed is attention, not effort.",
    body: "I take a 21-second cold-load down to 3.5s because I read the network tab instead of guessing. Performance is just attention paid early.",
  },
  {
    n: "03",
    statement: "Ship anyway.",
    body: "There's always a reason to wait. None of those reasons survive contact with the deadline. Ship anyway, then sharpen it in public.",
  },
];

export function Words() {
  return (
    <section
      id="beliefs"
      className="relative py-32 md:py-48 border-t border-[var(--color-divider)]"
    >
      <div className="container-page">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 0.9, ease: [0.32, 0.72, 0, 1] }}
          className="mb-24 md:mb-40"
        >
          <p className="type-eyebrow text-[var(--color-accent)] mb-6 flex items-center gap-2.5">
            <span className="size-1.5 rounded-full bg-[var(--color-accent)]" />
            Beliefs
          </p>
          <h2 className="type-display-lg text-[var(--color-ink)] max-w-[18ch]">
            How I think when nobody&apos;s watching.
          </h2>
        </motion.div>

        {/* Beliefs stack — each one is a scroll moment */}
        <ol className="space-y-32 md:space-y-48 max-w-5xl mx-auto">
          {BELIEFS.map((b) => (
            <BeliefBlock key={b.n} belief={b} />
          ))}
        </ol>
      </div>
    </section>
  );
}

function BeliefBlock({ belief }: { belief: (typeof BELIEFS)[number] }) {
  return (
    <motion.li
      initial={{ opacity: 0, y: 40, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-20%" }}
      transition={{ duration: 1.1, ease: [0.32, 0.72, 0, 1] }}
      className="grid grid-cols-12 gap-6 md:gap-8"
    >
      <span className="col-span-12 md:col-span-2 type-eyebrow text-[var(--color-accent)] pt-3">
        {belief.n}
      </span>
      <div className="col-span-12 md:col-span-10">
        <h3 className="type-display-md italic text-[var(--color-ink)] mb-8 max-w-[20ch] leading-tight">
          {belief.statement}
        </h3>
        <p className="type-body-lg max-w-[60ch]">{belief.body}</p>
      </div>
    </motion.li>
  );
}
