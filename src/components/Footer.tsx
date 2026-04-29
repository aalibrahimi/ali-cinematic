import Link from "next/link";
import { BrandMark } from "@/components/ui/BrandMark";

/**
 * Footer — Apple-style outro.
 *
 * Three rows:
 *   1. Brand mark + identity statement
 *   2. Three columns of links (Work / Studio / Connect)
 *   3. Legal / build line
 *
 * Quiet typography, hairline dividers, no flourish. The page-end
 * counterpart to Apple's product page footer — utilitarian by design.
 */
export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[var(--color-divider)]">
      <div className="container-page pt-16 pb-12">
        {/* Top: brand + identity */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-12">
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-2.5 mb-4 text-[var(--color-ink)] hover:text-[var(--color-accent)] transition-colors"
            >
              <BrandMark size={28} static className="text-current" />
              <span className="font-[family-name:var(--font-display)] text-lg font-semibold tracking-tight">
                Ali Alibrahimi
              </span>
            </Link>
            <p className="text-sm text-[var(--color-ink-2)] max-w-[44ch]">
              Software designer and engineer. End-to-end builder of
              products and the systems that hold them up.
            </p>
          </div>

          <p className="type-eyebrow text-[var(--color-ink-3)]">
            Available worldwide · Q2 2026
          </p>
        </div>

        {/* Middle: link columns */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-10 mb-12 pt-12 border-t border-[var(--color-divider-2)]">
          <FooterColumn
            label="Work"
            links={[
              { label: "All projects", href: "/work" },
              { label: "Simplicity", href: "/work/simplicity" },
              { label: "CodeWithAli", href: "/work/codewithali" },
              { label: "Takeover", href: "/work/takeover" },
              { label: "Sovereign", href: "/work/sovereign" },
            ]}
          />
          <FooterColumn
            label="Studio"
            links={[
              { label: "About", href: "/about" },
              { label: "Beliefs", href: "/about#beliefs" },
              {
                label: "codewithali.com",
                href: "https://codewithali.com",
                external: true,
              },
            ]}
          />
          <FooterColumn
            label="Connect"
            links={[
              {
                label: "ali@codewithali.com",
                href: "mailto:ali@codewithali.com",
              },
              {
                label: "GitHub",
                href: "https://github.com/aalibrahimi",
                external: true,
              },
              {
                label: "LinkedIn",
                href: "https://linkedin.com/in/aalibrahimi",
                external: true,
              },
            ]}
          />
        </div>

        {/* Bottom: legal + build line */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-6 border-t border-[var(--color-divider-2)]">
          <p className="type-eyebrow text-[var(--color-ink-3)]">
            © {year} Ali Alibrahimi · All rights reserved
          </p>
          <p className="type-eyebrow text-[var(--color-ink-3)]">
            Next 16 · Tailwind 4 · Motion · Lenis
          </p>
        </div>
      </div>
    </footer>
  );
}

interface FooterLink {
  label: string;
  href: string;
  external?: boolean;
}

function FooterColumn({
  label,
  links,
}: {
  label: string;
  links: FooterLink[];
}) {
  return (
    <div>
      <p className="type-eyebrow text-[var(--color-ink-3)] mb-4">{label}</p>
      <ul className="space-y-2.5">
        {links.map((link) => (
          <li key={link.href}>
            {link.external ? (
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-[var(--color-ink-2)] hover:text-[var(--color-accent)] transition-colors"
              >
                {link.label}
              </a>
            ) : (
              <Link
                href={link.href}
                className="text-sm text-[var(--color-ink-2)] hover:text-[var(--color-accent)] transition-colors"
              >
                {link.label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
