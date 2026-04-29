"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { BrandMark } from "@/components/ui/BrandMark";

/**
 * Nav — macOS-style glass toolbar.
 *
 * Translucent at the top of every page (the hero shows through).
 * Once the user scrolls past 80px, the bar's backdrop-filter kicks in
 * fully — Apple's exact "smoked glass" treatment. The transition is
 * the only nav flourish.
 *
 * Layout (Apple's HIG toolbar):
 *   - Brand mark on the left (small "A" + name)
 *   - Center: route links (Work, About) on desktop, hidden on mobile
 *   - Contact CTA pill on the right (always visible)
 *
 * Note: backdrop-filter is paired with -webkit-backdrop-filter via the
 * .glass-nav class in globals.css. Safari requires the prefix; the
 * Tailwind utility doesn't emit it.
 */
export function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.nav
      aria-label="Primary"
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.4, ease: [0.32, 0.72, 0, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "glass-nav border-b border-[var(--color-divider-2)]"
          : "border-b border-transparent"
      }`}
    >
      <div className="container-page flex items-center justify-between h-14 md:h-16">
        {/* Brand mark + name */}
        <Link
          href="/"
          className="flex items-center gap-2.5 text-[var(--color-ink)] hover:text-[var(--color-accent)] transition-colors duration-300"
        >
          <BrandMark size={22} static className="text-current" />
          <span className="text-sm font-medium tracking-tight hidden sm:inline">
            Ali Alibrahimi
          </span>
        </Link>

        {/* Center routes */}
        <div className="hidden md:flex items-center gap-8 text-sm">
          <NavLink href="/work">Work</NavLink>
          <NavLink href="/about">About</NavLink>
        </div>

        {/* Contact CTA pill */}
        <Link
          href="/#contact"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--color-accent)] text-[var(--color-ink)] text-sm font-medium hover:bg-[var(--color-accent-hover)] transition-colors duration-300"
        >
          Get in touch
        </Link>
      </div>
    </motion.nav>
  );
}

function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="text-[var(--color-ink-2)] hover:text-[var(--color-ink)] transition-colors duration-300"
    >
      {children}
    </Link>
  );
}
