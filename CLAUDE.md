# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev      # Start dev server on port 3001
npm run build    # Production build
npm run start    # Start production server on port 3001
npm run lint     # Run ESLint (v9 flat config)
```

No test suite is configured in this project.

## Architecture

**Equinox** is a bilingual (English/Arabic) marketing website for a logistics/customs company. It uses Next.js App Router with Sanity CMS for content.

### Routing

All pages live under `src/app/[locale]/` — the locale segment (`en`/`ar`) is always present in the URL (`localePrefix: "always"`). The root `src/app/layout.tsx` is a minimal shell; the real layout with Nav, Footer, and providers lives in `src/app/[locale]/layout.tsx`. Sanity Studio is embedded at `/studio` via `src/app/studio/[[...tool]]/page.tsx`.

### i18n

`next-intl` handles routing and translation. Locale config is in `src/i18n/routing.ts`. Use `getTranslations()` (server) and the `NextIntlClientProvider` (client). For navigation always import from `src/i18n/navigation.ts` instead of `next/navigation` — it wraps Next.js navigation with locale awareness.

### Sanity CMS

- **Config**: `sanity.config.js` (Studio at `/studio`, project `4jl8bote`, dataset `production`)
- **Schemas**: `sanity/schemas/` — `service.js`, `client.js`, `teamMember.js`
- **Client + fetch helper**: `src/lib/sanity.ts` — use `sanityFetch()` for all data fetching; it handles ISR caching (1hr in prod, 0 in dev) and CDN toggling automatically
- **GROQ queries**: `src/lib/queries.ts` — all queries filter by `_type` and `language` (`$locale` parameter); order by `order ASC`

All Sanity document types are bilingual: each document has a `language` field (`"en"` or `"ar"`). Fetch the correct language by passing `{ locale }` to queries.

### Component Organization

Atomic Design pattern under `src/components/`:
- `atoms/` — primitives (Button, Container, Tag, Logo, etc.)
- `molecules/` — composed atoms (SectionHeader, FaqItem)
- `organisms/` — full sections (Hero, Nav, Footer, ServiceTile, CtaBanner)
- `motion/` — animation wrappers (Reveal, CountUp, ParallaxImage, LenisProvider)

### Styling

Tailwind CSS v4 via PostCSS. Design tokens are CSS custom properties defined in `src/app/globals.css` (e.g. `--color-gold-500`, `--color-navy-900`, `--section-y`). Use `cn()` from `src/lib/utils/cn.ts` for conditional class merging. Arabic layout uses RTL — the locale layout sets `dir="rtl"` and swaps to IBM Plex Sans Arabic font.

### Path Aliases

`@/*` maps to `src/*` (configured in `tsconfig.json`).
