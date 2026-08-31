# web — usmaanrazzaq.design

The portfolio site: Next.js (App Router) + TypeScript + Tailwind CSS v4. This
directory is the whole site, and it is what https://usmaanrazzaq.design serves.

## Running it

```bash
npm install
npm run dev
```

Then open http://localhost:3000. `npm run build` produces a production build,
`npm run start` serves it, and `npm run lint` runs ESLint.

The repo root has a `package.json` whose `dev` / `build` / `start` scripts forward
here, so `npm run dev` from the root does the same thing.

## Layout

- `src/app/` — routes, one `page.tsx` each, plus the root `layout.tsx`
- `src/components/` — components, including the `HomeShell` / `SiteChrome` /
  `PaperCsChrome` page shells
- `src/lib/` — case-study behaviour (lightboxes, charts, the OTRS globe) and shared
  helpers
- `src/styles/` — the `paper-*.css` stylesheets
- `src/data/` — static content: the project list, the hero skies
- `public/` — static assets, tracked in git: `hero/`, `images/`, `video/`, `shared/`,
  the favicons, and the resume PDF

## Deployment

Vercel, with Root Directory set to `web`. Pushes to `main` deploy to production.
Redirects for the site's older URLs live in `redirects()` in `next.config.ts` and in
`src/proxy.ts`.
