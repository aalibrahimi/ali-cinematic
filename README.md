# Ali Alibrahimi — Cinematic Portfolio

Apple-grade portfolio. Cinematic dark, Geist typography, scroll-driven choreography. Tuned for macOS Safari.

Stack: **Next.js 16 · React 19 · TypeScript 6 · Tailwind 4 · Framer Motion · Lenis**.

---

## Setup

```powershell
# PowerShell (Windows)
bun install
bun run dev
```

Boots at <http://localhost:3000>.

## Project status

This is a **staged build**. Currently only the Hero + IntroStatement
sections are wired to the home page so the choreography can be reviewed
in isolation before the rest of the page is built out.

## Project layout

```
src/
├── app/
│   ├── layout.tsx       — fonts, metadata, LenisProvider
│   ├── template.tsx     — page-transition fade (App Router pattern)
│   ├── page.tsx         — composes the home sections
│   └── globals.css      — design tokens, type scale, motion helpers
├── components/
│   ├── ui/
│   │   ├── LenisProvider.tsx   — Apple-grade smooth scroll
│   │   └── BrandMark.tsx       — animated SVG "A" letterform
│   └── sections/
│       ├── Hero.tsx              — 2.4s arrival sequence
│       └── IntroStatement.tsx    — pinned 300vh headline morph
└── lib/
    └── motion.ts        — APPLE_EASE, HERO_SEQUENCE, LENIS_CONFIG
```

## Motion vocabulary

All easing curves and timing values live in `src/lib/motion.ts`.

```ts
APPLE_EASE       = [0.32, 0.72, 0, 1]    // Apple's signature smooth-out
APPLE_EASE_QUICK = [0.4, 0, 0.2, 1]      // micro-interactions
APPLE_BOUNCE     = { stiffness: 120, damping: 22, mass: 0.8 }
LENIS_CONFIG     = { lerp: 0.1, duration: 1.2, ... }
```

## Safari & macOS notes

- `backdrop-filter` paired with `-webkit-backdrop-filter` everywhere.
- All animated elements use `transform: translate3d(0,0,0)` for GPU
  compositing. The `.gpu` helper class applies it automatically.
- Lenis respects `prefers-reduced-motion` automatically — users with
  that setting get instant native scroll.
- Tested choreography assumes Safari 17+; older Safari may show
  motion-blur falloff in the hero letter cascade (purely cosmetic).

## Scripts

```bash
bun run dev        # next dev --turbopack
bun run build      # next build
bun run start      # next start
bun run typecheck  # tsc --noEmit
```
