import type { Metadata } from "next";
import { AboutHero, Timeline, Beliefs, AboutCTA } from "./_parts";

export const metadata: Metadata = {
  title: "About",
  description:
    "Software designer + engineer. Founder of Simplicity and CodeWithAli.",
};

/**
 * /about — the personal page (server component).
 *
 * Three-act structure:
 *   1. AboutHero — the personal positioning statement (no resume
 *      bullets, no headshot)
 *   2. Timeline — career chapters with accent left-border rail
 *   3. Beliefs — the full five operating beliefs (home only shows
 *      three; here is where the long-form versions live)
 *   4. AboutCTA — bounce back to /work
 *
 * Reads in 3 minutes. No CV download, no contact form here — the
 * /#contact section on the home page handles those.
 */
export default function About() {
  return (
    <main>
      <AboutHero />
      <Timeline />
      <Beliefs />
      <AboutCTA />
    </main>
  );
}
