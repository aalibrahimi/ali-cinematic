/**
 * Work data — single source of truth for the WorkGrid (home),
 * /work archive, and /work/[slug] case studies.
 *
 * Per-project metadata is rich enough to drive a full case-study
 * page without per-project content files. The narrative `blocks`
 * are the deep-dive prose; `stats` drive both the home Numbers
 * section (via the first item's stats) and the case-study stat grid.
 *
 * `accent` is each project's signature color, sampled from Apple's
 * system colors palette (HIG). Used to tint the case-study hero
 * accent so each project feels distinct without breaking the global
 * blue accent that anchors the rest of the site.
 */

export interface WorkStat {
  value: string;
  label: string;
  hint?: string;
}

export interface ShowcaseBlock {
  title: string;
  body: string;
  highlights?: string[];
}

export interface WorkItem {
  slug: string;
  index: string;
  name: string;
  kind: string;
  year: string;
  role: string;
  /** Used in WorkGrid + archive list */
  summary: string;
  /** Pull-quote shown big on the case study page */
  quote: string;
  /** 4 numbers used in the case-study stats grid */
  stats: WorkStat[];
  /** 2-4 narrative blocks that make up the case study body */
  blocks: ShowcaseBlock[];
  /** Tech stack chips */
  tags: string[];
  /** Outbound link */
  link?: { label: string; href: string };
  /** Apple-system-color accent for this project's case study */
  accent: string;
}

export const WORK: WorkItem[] = [
  {
    slug: "simplicity",
    index: "01",
    name: "Simplicity",
    kind: "Personal finance",
    year: "2025—",
    role: "Solo founder · designer · engineer",
    summary:
      "A real operating system for your money — not another budgeting app.",
    quote:
      "Every budgeting app I tried felt like a spreadsheet with a paint job. So I built the version I actually wanted to use.",
    stats: [
      { value: "120k+", label: "Lines shipped", hint: "frontend + backend + agents" },
      { value: "240+", label: "Components", hint: "in-house design system" },
      { value: "3.5s", label: "Cold load", hint: "down from 21s in one sprint" },
      { value: "Solo", label: "Founder", hint: "design · code · infra" },
    ],
    blocks: [
      {
        title: "What it is",
        body: "Simplicity ingests every account through Plaid, classifies every transaction in real time, and gives the user a budget simulator that lets them model cuts and growth scenarios before committing. The difference between a ledger and an operating system.",
      },
      {
        title: "What I built",
        body: "Every layer is mine. Next.js 16 frontend, Postgres backend with hand-tuned indexes, Plaid ingestion engine, Stripe payment rails, the simulation logic, the admin command deck (Sovereign), and the design system that holds it together.",
        highlights: [
          "Server-action batching that collapsed 13 round-trips into one",
          "Postgres index design that took a 13s query down to 30ms",
          "A budget simulator with what-if cuts, debt payoff, growth projections",
          "An admin command deck (Sovereign) for live cohort + anomaly signal",
        ],
      },
      {
        title: "What it took",
        body: "Months of solo work, refusing to compromise on either the surface or the system underneath. Most of the hard problems weren't features — they were getting cold-load down from 21s to 3.5s, getting the cards to feel like glossy zinc instead of plastic, getting the ETL pipelines right.",
      },
    ],
    tags: ["Next.js", "Postgres", "Plaid", "Stripe", "Design system", "Solo"],
    link: {
      label: "simplicityfunds.com",
      href: "https://simplicityfunds.com",
    },
    accent: "#0a84ff",
  },
  {
    slug: "codewithali",
    index: "02",
    name: "CodeWithAli",
    kind: "Studio",
    year: "2024—",
    role: "Founder · solo principal",
    summary:
      "An independent software studio. I work with founders on the parts of their stack that need taste.",
    quote:
      "Most teams quietly hate touching their design systems and their agent infrastructure. So that's most of what I work on.",
    stats: [
      { value: "20+", label: "Engagements", hint: "across 4 years" },
      { value: "<8wk", label: "Ship time", hint: "kickoff to delivery" },
      { value: "0", label: "Downtime incidents", hint: "on shipped work" },
      { value: "1", label: "Principal", hint: "me, end-to-end" },
    ],
    blocks: [
      {
        title: "What it is",
        body: "CodeWithAli is the studio I run alongside Simplicity. I take on a small number of engagements each year — typically design systems, agent infrastructure, or production product surfaces. The work is hands-on, opinionated, and shipped fast.",
      },
      {
        title: "How it works",
        body: "Two-week scoping, six-to-eight week build, single principal (me). No hand-offs, no account managers, no second-week-of-the-month client calls. The studio exists because I prefer the engagements where I'm actually building, not managing the building.",
        highlights: [
          "Design systems built from scratch on Tailwind 4",
          "MCP server architecture for agent integrations",
          "Bento dashboards and admin surfaces",
          "Production migrations and Postgres optimization",
        ],
      },
    ],
    tags: ["Studio", "Consulting", "Engineering", "Design"],
    link: { label: "codewithali.com", href: "https://codewithali.com" },
    accent: "#ff9f0a",
  },
  {
    slug: "cwa-manager",
    index: "03",
    name: "CWA Manager",
    kind: "Native operator",
    year: "2025—",
    role: "Founder · sole engineer",
    summary:
      "A native desktop operator that ships code through a real workspace and talks back.",
    quote:
      "I wanted a desktop agent that actually drove a workspace. So I wrote the whole thing — Tauri, Rust, MCP, voice — myself.",
    stats: [
      { value: "Tauri", label: "Native shell", hint: "Rust + React" },
      { value: "MCP", label: "Protocol", hint: "open Anthropic spec" },
      { value: "Voice", label: "First-class", hint: "TTS cadence tuned by hand" },
      { value: "Auto", label: "Agent mode", hint: "code-gen pipelines" },
    ],
    blocks: [
      {
        title: "What it is",
        body: "CWA Manager is a native desktop operator built around the Axon agent layer. Voice-first conversation, autonomous code-gen mode, multi-project workspaces, persistent session summaries, voice-print sensitive-action gate. The thing that should exist for solo founders who are actually shipping.",
      },
      {
        title: "What's in it",
        body: "I've stripped the surface to the operator's essentials. The agent doesn't just answer — it drives the workspace.",
        highlights: [
          "Bidirectional voice conversation with TTS cadence I tuned by ear",
          "Autonomous mode — recursive workspace + code generation",
          "MCP-pluggable action graph (not a closed integration layer)",
          "Voice-print gate for sensitive actions",
          "Multi-project context with persistent summaries",
        ],
      },
    ],
    tags: ["Tauri", "Rust", "React", "MCP", "Voice UX", "GSAP"],
    accent: "#bf5af2",
  },
  {
    slug: "sovereign",
    index: "04",
    name: "Sovereign",
    kind: "Admin command deck",
    year: "2025",
    role: "Designer · engineer",
    summary: "The internal command deck for Simplicity.",
    quote:
      "Three weeks from spec to shipped. The kind of admin surface that's a privilege to build because no one outside ops will ever see it.",
    stats: [
      { value: "3 wks", label: "Spec to ship" },
      { value: "Bento", label: "Layout" },
      { value: "Live", label: "Anomaly alerts" },
      { value: "Custom", label: "KPI tiles" },
    ],
    blocks: [
      {
        title: "What it is",
        body: "Sovereign is the operator's view of Simplicity — a single-screen bento dashboard that pulls every signal off the platform. Cohort metrics, anomaly alerts, subscription movement, support load, deploys. The control room.",
      },
      {
        title: "Why it exists",
        body: "Off-the-shelf dashboards lie about your business. Sovereign was built to read Simplicity's actual schema and tell me what changed today, what's trending, and what I need to look at before the end of the day. Boring on purpose. Useful every day.",
      },
    ],
    tags: ["Next.js", "Recharts", "Tailwind 4", "Bento", "Admin"],
    accent: "#30d158",
  },
];
