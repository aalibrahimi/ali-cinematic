/**
 * Work data — shared between WorkGrid, /work archive, /work/[slug]
 * case studies. Each item has enough metadata to support a full
 * deep-dive page without per-project content files.
 */

export interface WorkStat {
  value: string;
  label: string;
}

export interface WorkItem {
  slug: string;
  index: string;
  name: string;
  kind: string;
  year: string;
  summary: string;
  /** Used in case-study hero quote */
  quote: string;
  stats: WorkStat[];
  /** Tech chips */
  tags: string[];
  /** Outbound link */
  link?: { label: string; href: string };
}

export const WORK: WorkItem[] = [
  {
    slug: "simplicity",
    index: "01",
    name: "Simplicity",
    kind: "Personal finance",
    year: "2025—",
    summary: "A real operating system for your money — not another budgeting app.",
    quote:
      "Every budgeting app I tried felt like a spreadsheet with a paint job. So I built the version I actually wanted to use.",
    stats: [
      { value: "120k+", label: "Lines shipped" },
      { value: "240+", label: "Components" },
      { value: "3.5s", label: "Cold load" },
      { value: "Solo", label: "Founder" },
    ],
    tags: ["Next.js", "Postgres", "Plaid", "Stripe", "Design system"],
    link: { label: "simplicityfunds.com", href: "https://simplicityfunds.com" },
  },
  {
    slug: "codewithali",
    index: "02",
    name: "CodeWithAli",
    kind: "Studio",
    year: "2024—",
    summary: "An independent software studio. I work with founders on the parts of their stack that need taste.",
    quote:
      "Most teams quietly hate touching their design systems and their agent infrastructure. So that's most of what I work on.",
    stats: [
      { value: "20+", label: "Engagements" },
      { value: "<8wk", label: "Ship time" },
      { value: "0", label: "Downtime" },
      { value: "1", label: "Principal" },
    ],
    tags: ["Studio", "Consulting", "Engineering", "Design"],
    link: { label: "codewithali.com", href: "https://codewithali.com" },
  },
  {
    slug: "cwa-manager",
    index: "03",
    name: "CWA Manager",
    kind: "Native operator",
    year: "2025—",
    summary: "A native desktop operator that ships code through a real workspace and talks back.",
    quote:
      "I wanted a desktop agent that actually drove a workspace. So I wrote the whole thing — Tauri, Rust, MCP, voice — myself.",
    stats: [
      { value: "Tauri", label: "Native" },
      { value: "MCP", label: "Protocol" },
      { value: "Voice", label: "First-class" },
      { value: "Auto", label: "Agent mode" },
    ],
    tags: ["Tauri", "Rust", "MCP", "Voice"],
  },
  {
    slug: "sovereign",
    index: "04",
    name: "Sovereign",
    kind: "Admin command deck",
    year: "2025",
    summary: "The internal command deck for Simplicity.",
    quote:
      "Three weeks from spec to shipped. The kind of admin surface that's a privilege to build.",
    stats: [
      { value: "3wk", label: "Spec to ship" },
      { value: "Bento", label: "Layout" },
      { value: "Live", label: "Anomaly alerts" },
      { value: "Custom", label: "KPI tiles" },
    ],
    tags: ["Next.js", "Recharts", "Tailwind", "Bento"],
  },
];
