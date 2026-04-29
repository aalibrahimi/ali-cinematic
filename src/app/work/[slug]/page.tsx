import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { WORK } from "@/lib/work";
import { WorkRow } from "@/components/sections/WorkRow";
import { SplitScreenVariant } from "./_variants/split-screen";

interface Params {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return WORK.map((w) => ({ slug: w.slug }));
}

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
 * /work/[slug] — case study.
 *
 * Layout: sticky-nav split-screen (Apple Developer docs pattern).
 *   - Left third: sticky chapter navigator + project meta + headline
 *     stat. Auto-highlights the active chapter as the user scrolls
 *     (driven by IntersectionObserver in the variant).
 *   - Right two-thirds: scrolling content — overview with summary +
 *     pull quote + stats grid, then narrative chapters with
 *     numbered highlight lists, then stack + outbound CTA.
 *   - Mid-body interlude after Chapter 01 — full-bleed band with
 *     accent border-y top + bottom, centered eyebrow, massive
 *     italic display sans pull quote (lifted from the Editorial
 *     variant).
 *
 * Footer: kinetic next-project pagination that wraps the WORK array.
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
      <SplitScreenVariant item={item} />

      {/* Next project pagination */}
      <section className="border-t border-[var(--color-divider)] mt-24">
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
