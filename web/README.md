# web — Next.js rebuild of usmaanrazzaq.design

A Next.js (App Router) + TypeScript + Tailwind rebuild of the portfolio homepage.
It lives alongside the original static site at the repo root, which is still what
`usmaanrazzaq.design` serves. Nothing here replaces it yet.

## Running it

```bash
cd web
npm install
npm run dev
```

Then open http://localhost:3000.

From the repo root, `npm run dev:next` does the same thing.

The static Express site also uses port 3000 (`npm start` at the repo root), so run
one or the other, not both at once.

## What is here

| Path | Purpose |
| --- | --- |
| `src/app/layout.tsx` | Root layout: no-flash theme script, tokens, nav, contact modal |
| `src/app/page.tsx` | Homepage |
| `src/app/contact/page.tsx` | Same homepage with the contact modal opened, matching `/contact/` on the live site |
| `src/data/projects.ts` | The work list as data, mapped into `CaseCard` |
| `src/components/` | Nav, theme toggle, case card, contact modal, NY clock, scroll reveal |
| `src/styles/` | The bespoke CSS Tailwind is a poor fit for (metal borders, washes, video stage, frosted nav, modal) |
| `scripts/sync-public.mjs` | Copies homepage images/video/prototype from the repo root into `public/` |

Design tokens come from the original `home.css` custom properties, mapped into
Tailwind's theme, so utilities follow `html[data-theme]` without per-class `dark:`
variants.

## Assets

`public/` is populated by `scripts/sync-public.mjs`, which runs automatically via
`predev` and `prebuild`. The synced files are gitignored so the same images and
video are not committed twice. Run it manually with `npm run sync-public`.

## Deploying

Not deployed. To switch Vercel over later, set the project's Root Directory to
`web`. Until then the Vercel project keeps serving the static site from the repo
root.

## Not migrated yet

Playground, About, and the case study pages are still the static site's HTML
routes. Links to them work in production but 404 inside this app during local
development. That is expected.
