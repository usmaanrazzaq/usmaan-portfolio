<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

---

# This app

The portfolio at https://usmaanrazzaq.design. Next.js App Router + TypeScript +
Tailwind v4. This directory is the whole site — the repo root holds only docs and a
`package.json` that forwards its scripts here. Vercel's Root Directory is set to
`web`, so this is also the deployment root.

## Running it

```
npm run dev
```

`npm run build`, `npm run start`, and `npm run lint` do what you would expect. The
same scripts are reachable from the repo root (`npm run dev` there forwards here).

## Rules

- **Do not create HTML pages.** Every page is a React component under `src/app/`.
- **Do not run `create-next-app`.** The app already exists and is configured.
- **Do not add a second app** or a second package at the repo root.
- Do not move this directory to the repo root.

## Layout

- `src/app/` — routes. `page.tsx` per route; `layout.tsx` is the root layout.
- `src/components/` — components. The shared chrome is `HomeShell` (homepage),
  `SiteChrome` (about/playground/contact), and `PaperCsChrome` (case studies).
- `src/lib/` — per-case-study behaviour (lightboxes, charts, the OTRS globe) and
  shared helpers (`theme.ts`, `arena.ts`).
- `src/styles/` — the `paper-*.css` stylesheets, imported by the components.
- `src/data/` — static content (`projects.ts`, `heroSkies.ts`).
- `src/proxy.ts` — legacy-URL normalisation (Next 16's renamed middleware).
- `public/` — static assets, tracked in git: `hero/`, `images/`, `video/`, `shared/`,
  plus `Favicon.png`, `iOS Icon.png`, and the resume PDF. There is **no** asset copy
  or sync step — add new assets straight to `public/`.

`public/shared/rented-prototype.{js,css,partial}` is the self-running Rented phone
prototype. The markup uses a `.partial` extension because Next treats `public/*.html`
as pages and 404s them in production — do not rename it back.

## Details

- **No test framework.** There are no automated tests.
- **Contact form** posts to the external Web3Forms API (`api.web3forms.com`).
- **Old-URL redirects** live in two places, not a `vercel.json`. The `/projects` →
  `/playground` rename is in `redirects()` in `next.config.ts`; the case fixes
  (`/WCM-Connect`, `/Rented`, the `.html` suffix) are in `src/proxy.ts`, because Next
  matches a redirect `source` case-insensitively and such a rule would match its own
  lowercase destination and redirect forever. `proxy.ts` deliberately skips any path
  whose last segment has a file extension — asset filenames are mixed-case.
- This repo often sits on an exFAT volume, where macOS writes an AppleDouble `._name`
  sidecar beside every file. They are gitignored, and
  `turbopackFileSystemCacheForDev` is disabled because Turbopack's dev cache chokes
  on them.
