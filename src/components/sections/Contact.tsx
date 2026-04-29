"use client";

import { motion, useMotionValue, useSpring } from "motion/react";
import { useRef, type MouseEvent } from "react";
import { ArrowUpRight, Mail } from "lucide-react";

/**
 * Contact — the closer.
 *
 * Composition:
 *   - Massive headline ("Let's build something.")
 *   - Two CTAs:
 *       Primary: email (magnetic — pulls toward cursor)
 *       Secondary: studio link
 *   - Social ribbon at the bottom
 *   - Subtle blue gradient pool at the bottom of the viewport
 *
 * The magnetic primary CTA is the signature interaction here — same
 * effect Apple uses on their hero CTAs. The button translates up to
 * 14px toward the cursor, springs back when the mouse leaves. Tuned
 * to feel weighty rather than rubbery.
 */
export function Contact() {
  return (
    <section
      id="contact"
      className="relative section py-24 md:py-40 border-t border-[var(--color-divider)] overflow-hidden"
    >
      {/* Bottom gradient pool */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% 100%, rgba(10, 132, 255, 0.18) 0%, rgba(10, 132, 255, 0.04) 40%, transparent 70%)",
        }}
      />

      <div className="container-page relative z-10">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-20%" }}
          transition={{ duration: 0.9, ease: [0.32, 0.72, 0, 1] }}
          className="type-eyebrow text-[var(--color-accent)] mb-10 flex items-center gap-2.5"
        >
          <span className="size-1.5 rounded-full bg-[var(--color-accent)]" />
          Contact
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-20%" }}
          transition={{
            duration: 1.1,
            delay: 0.05,
            ease: [0.32, 0.72, 0, 1],
          }}
          className="type-display-xl text-[var(--color-ink)] max-w-[14ch] leading-[0.92] mb-12 md:mb-16"
        >
          Let&apos;s build{" "}
          <span className="italic text-[var(--color-accent)]">something</span>.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-20%" }}
          transition={{
            duration: 0.9,
            delay: 0.15,
            ease: [0.32, 0.72, 0, 1],
          }}
          className="type-body-lg max-w-[52ch] mb-14 md:mb-20"
        >
          I take a small number of engagements each year through CodeWithAli. If
          you&apos;re working on something that needs both the design and the
          engineering — or one of them in a way the other doesn&apos;t respect —
          I&apos;d like to hear about it.
        </motion.p>

        {/* CTA row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{
            duration: 0.9,
            delay: 0.25,
            ease: [0.32, 0.72, 0, 1],
          }}
          className="flex flex-wrap items-center gap-4 md:gap-6 mb-20 md:mb-28"
        >
          <MagneticButton href="mailto:ali@codewithali.com" primary>
            <Mail size={16} strokeWidth={2} />
            ali@codewithali.com
          </MagneticButton>
          <MagneticButton href="https://codewithali.com" external>
            The studio
            <ArrowUpRight size={16} strokeWidth={2} />
          </MagneticButton>
        </motion.div>

        {/* Social ribbon */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="flex flex-wrap items-center gap-x-8 gap-y-3 type-eyebrow pt-8 border-t border-[var(--color-divider)]"
        >
          <a
            href="https://github.com/aalibrahimi"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--color-ink-2)] hover:text-[var(--color-accent)] transition-colors flex items-center gap-1.5"
          >
            GitHub <ArrowUpRight size={11} strokeWidth={2} />
          </a>
          <a
            href="https://linkedin.com/in/aalibrahimi"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--color-ink-2)] hover:text-[var(--color-accent)] transition-colors flex items-center gap-1.5"
          >
            LinkedIn <ArrowUpRight size={11} strokeWidth={2} />
          </a>
          <a
            href="https://simplicityfunds.co"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--color-ink-2)] hover:text-[var(--color-accent)] transition-colors flex items-center gap-1.5"
          >
            Simplicity <ArrowUpRight size={11} strokeWidth={2} />
          </a>
        </motion.div>
      </div>
    </section>
  );
}

/**
 * MagneticButton — button that pulls toward the cursor on hover.
 *
 * Uses motion's useMotionValue + useSpring so the translate has weight
 * rather than snapping. Max pull is 14px on either axis.
 */
function MagneticButton({
  children,
  href,
  primary,
  external,
}: {
  children: React.ReactNode;
  href: string;
  primary?: boolean;
  external?: boolean;
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
    const ratio = 14 / Math.max(rect.width, rect.height);
    x.set(dx * ratio);
    y.set(dy * ratio);
  }

  function onMouseLeave() {
    x.set(0);
    y.set(0);
  }

  const baseClass =
    "inline-flex items-center gap-2.5 px-7 py-4 rounded-full text-base font-medium transition-colors duration-300 gpu";
  const variantClass = primary
    ? "bg-[var(--color-accent)] text-[var(--color-ink)] hover:bg-[var(--color-accent-hover)]"
    : "border border-[var(--color-divider)] text-[var(--color-ink)] hover:border-[var(--color-ink-2)]";

  return (
    <motion.a
      ref={ref}
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      style={{ x: sx, y: sy }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className={`${baseClass} ${variantClass}`}
    >
      {children}
    </motion.a>
  );
}
