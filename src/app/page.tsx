import { Hero } from "@/components/sections/Hero";
import { IntroStatement } from "@/components/sections/IntroStatement";

/**
 * Home — staged build (phase 1).
 *
 * Currently rendering only the two showcase moments — Hero and the
 * pinned-scroll IntroStatement. This is the choreography review pass:
 * before adding the rest of the page, we want these two to feel
 * exactly right.
 *
 * Once approved, the rest of the home page falls in below:
 *   → Featured (Simplicity, multi-stage product treatment)
 *   → WorkGrid
 *   → Numbers
 *   → Words (carousel of beliefs)
 *   → Contact
 */
export default function Home() {
  return (
    <main>
      <Hero />
      <IntroStatement />
    </main>
  );
}
