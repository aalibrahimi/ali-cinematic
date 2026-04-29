import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { WORK } from "@/lib/work";
import { WorkRow } from "@/components/sections/WorkRow";
import {
  CaseHero,
  StatsGrid,
  NarrativeBlock,
  StackAndCTA,
} from "./_parts";

interface Params {
  params: Promise<{ slug: string }>;
}

/** Pre-render every case study at build time. */
export async function generateStaticParams() {
  return WORK.map((w) => ({ slug: w.slug }));
}

/** Per-project meta titles + descriptions. */
export async function generateMetadata({
  params,
}: Params): Promise<Metadata> {
  const { slug } = await params;
  const item = WORK.find((w) => w.slug === slug);
  if (!item) return { title: "Not found" };
  return {
    title: item.name,
    description: item.summary,
  };
}

/**
 * /work/[slug] — case study, Apple product-page treatment.
 *
 * Top-to-bottom anatomy:
 *   1. CaseHero       — back link · eyebrow · big name with accent
 *                       period · pull quote
 *   2. StatsGrid      — 4 cells with count-up animation on view
 *   3. NarrativeBlocks — scroll-revealed prose blocks with optional
 *                       bulleted highlights
 *   4. StackAndCTA    — tech chips + outbound visit-site CTA in
 *                       project's accent color
 *   5. NextProject    — kinetic row pagination, wraps around the
 *                       WORK array
 *
 * Each project's accent color is sampled from Apple's HIG system
 * colors — Simplicity blue, CodeWithAli orange, CWA Manager purple,
 * Sovereign green. The accent appears in: the period after the name,
 * the stat eyebrows, the highlight bullets, the narrative block
 * border-left, the visit-site CTA background.
 */
export default async function CaseStudy({ params }: Params) {
  const { slug } = await params;
  const item = WORK.find((w) => w.slug === slug);
  if (!item) notFound();

  // Pagination — next item, wrapping back to first.
  const idx = WORK.findIndex((w) => w.slug === item.slug);
  const next = WORK[(idx + 1) % WORK.length]!;

  return (
    <main>
      <CaseHero item={item} />
      <StatsGrid stats={item.stats} accent={item.accent} />

      {/* Narrative blocks */}
      <section className="section py-24 md:py-32">
        <div className="container-page">
          <div className="space-y-20 md:space-y-28 max-w-5xl">
            {item.blocks.map((block, i) => (
              <NarrativeBlock
                key={block.title}
                block={block}
                index={i}
                accent={item.accent}
              />
            ))}
          </div>
        </div>
      </section>

      <StackAndCTA item={item} />

      {/* Next project */}
      <section className="border-t border-[var(--color-divider)]">
        <div className="container-page pt-12 md:pt-16">
          <p className="type-eyebrow text-[var(--color-ink-3)] mb-4">
            / Next project
          </p>
          <Link
            href={`/work/${next.slug}`}
            aria-label={`Next: ${next.name}`}
            className="block"
          >
            <WorkRow item={next} />
          </Link>
        </div>
      </section>
    </main>
  );
}
