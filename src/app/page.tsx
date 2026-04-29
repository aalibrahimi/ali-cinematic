import { Hero } from "@/components/sections/Hero";
import { IntroStatement } from "@/components/sections/IntroStatement";
import { Featured } from "@/components/sections/Featured";
import { WorkGrid } from "@/components/sections/WorkGrid";
import { Numbers } from "@/components/sections/Numbers";
import { Words } from "@/components/sections/Words";
import { Contact } from "@/components/sections/Contact";

/**
 * Home — the cinematic single-page experience.
 *
 * Top-to-bottom narrative, each section a designed moment:
 *
 *   Hero            ─ 2.4s arrival sequence; brand mark + name cascade.
 *   IntroStatement  ─ 200vh pinned scroll; slide-up replacement of
 *                     three statements ("design / engineer / ship").
 *   Featured        ─ 200vh pinned multi-stage; Simplicity treatment
 *                     with mockup, stats, CTAs.
 *   WorkGrid        ─ 2x2 grid of project tiles with mouse-driven 3D
 *                     tilt; deep-links to /work/[slug] case studies.
 *   Numbers         ─ 4 receipts that count up from 0 when in view.
 *   Words           ─ three operating beliefs, each its own scroll
 *                     moment with editorial typography.
 *   Contact         ─ closer with magnetic email CTA + social ribbon.
 */
export default function Home() {
  return (
    <main>
      <Hero />
      <IntroStatement />
      <Featured />
      <WorkGrid />
      <Numbers />
      <Words />
      <Contact />
    </main>
  );
}
