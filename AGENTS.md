# AGENTS.md

This repo contains **one** website: a Next.js (App Router) + TypeScript + Tailwind v4
app in `web/`. It is what https://usmaanrazzaq.design serves.

There used to be a second, hand-written HTML/CSS/JS site at the repo root, served by
an Express `server.js`. It is gone. If you are working from memory or an old summary
that describes this project as "vanilla HTML/CSS/JavaScript", that description is out
of date — ignore it.

## Running it

```
npm run dev
```

From the repo root. The root `package.json` is a thin shim; the real scripts live in
`web/package.json`, so `cd web && npm run dev` is equivalent. Dev server is on
port 3000. `npm run build` builds, `npm run start` serves the build.

Install dependencies with `cd web && npm install` — the root has no dependencies and
no lockfile.

## Rules

- **Do not create HTML pages.** Every page is a React component under `web/src/app/`.
- **Do not run `create-next-app`.** The app already exists and is configured.
- **Do not add a second app** or a second package at the repo root.
- Do not move `web/` to the repo root. Vercel's Root Directory is set to `web`.

## Layout

- `web/src/app/` — routes. `page.tsx` per route; `layout.tsx` is the root layout.
- `web/src/components/` — components. The shared chrome is `HomeShell` (homepage),
  `SiteChrome` (about/playground/contact), and `PaperCsChrome` (case studies).
- `web/src/lib/` — per-case-study behaviour (lightboxes, charts, the OTRS globe) and
  shared helpers (`theme.ts`, `arena.ts`).
- `web/src/styles/` — the `paper-*.css` stylesheets, imported by the components.
- `web/src/data/` — static content (`projects.ts`, `heroSkies.ts`).
- `web/src/proxy.ts` — legacy-URL normalisation (Next 16's renamed middleware).
- `web/public/` — static assets, tracked in git: `hero/`, `images/`, `video/`,
  `shared/`, plus `Favicon.png`, `iOS Icon.png`, and the resume PDF. They are served
  from the URL paths you see in the components; there is **no** asset copy or sync
  step, so add new assets straight to `web/public/`.

`web/public/shared/rented-prototype.{js,css,partial}` is the self-running Rented
phone prototype. The markup uses a `.partial` extension because Next treats
`public/*.html` as pages and 404s them in production — do not rename it back.

## Details

- **No test framework.** There are no automated tests.
- **Lint:** `cd web && npm run lint` (ESLint via `eslint-config-next`).
- **Contact form** posts to the external Web3Forms API (`api.web3forms.com`); it needs
  internet access but no local backend.
- **Old-URL redirects** live in two places, not in a `vercel.json`. The
  `/projects` → `/playground` rename is in `redirects()` in
  `web/next.config.ts`; the case fixes (`/WCM-Connect`, `/Rented`, the `.html`
  suffix) are in `web/src/proxy.ts`, because Next matches a redirect `source`
  case-insensitively and such a rule would match its own lowercase destination
  and redirect forever.
- This repo often sits on an exFAT volume, where macOS writes an AppleDouble `._name`
  sidecar beside every file. They are gitignored. `turbopackFileSystemCacheForDev` is
  disabled in `web/next.config.ts` because Turbopack's dev cache chokes on them.

## Deployment

Vercel, existing project. Root Directory `web`, Framework Preset Next.js, build
command `npm run build`. Pushes to `main` deploy to production.
