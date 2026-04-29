import type { Metadata } from "next";
import Link from "next/link";
import { WorkRow } from "@/components/sections/WorkRow";
import { WORK } from "@/lib/work";
import { ArchiveHero, ArchiveCTA } from "./_parts";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Selected work — projects shipped end-to-end. Design, code, and the whole spine in between.",
};

/**
 * /work — full work archive.
 *
 * Single-purpose page: the kinetic project list. Every project that
 * appears as a tile on the home page also appears here as a row,
 * with the same accent system + 3D feel of a tile but in a more
 * scannable list format. Each row deep-links to its case study.
 */
export default function WorkArchive() {
  return (
    <main>
      <ArchiveHero />

      {/* Kinetic list */}
      <section className="border-t border-[var(--color-divider)]">
        <div className="container-page">
          <ul>
            {WORK.map((item) => (
              <li key={item.slug}>
                <Link
                  href={`/work/${item.slug}`}
                  aria-label={`${item.name} — ${item.summary}`}
                  className="block"
                >
                  <WorkRow item={item} />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <ArchiveCTA />
    </main>
  );
}
