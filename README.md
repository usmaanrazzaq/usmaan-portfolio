# usmaanrazzaq.design

My personal portfolio — design work, case studies, and playground pieces.

**Live:** https://usmaanrazzaq.design

## Stack

Next.js (App Router) + TypeScript + Tailwind CSS v4, deployed on Vercel. The whole
app lives in [`web/`](web); the repo root holds only this README, the agent
instructions, and a `package.json` that forwards to `web`.

## Running it

```bash
cd web && npm install
```

Then, from the repo root:

```bash
npm run dev
```

Open http://localhost:3000. `npm run build` produces a production build and
`npm run start` serves it. `cd web && npm run lint` runs ESLint.

## Where things live

| Path | What |
| --- | --- |
| `web/src/app/` | Routes — one `page.tsx` per route, plus the root `layout.tsx` |
| `web/src/components/` | Components, including the `HomeShell` / `SiteChrome` / `PaperCsChrome` page shells |
| `web/src/lib/` | Case-study behaviour (lightboxes, charts, the OTRS globe) and shared helpers |
| `web/src/styles/` | The `paper-*.css` stylesheets |
| `web/src/data/` | Static content — the project list, the hero skies |
| `web/public/` | Static assets: `hero/`, `images/`, `video/`, `shared/`, the favicons, the resume |

## Deployment

Vercel builds from the `web` directory on every push to `main`. Old URLs from the
site's earlier hand-written incarnation are redirected in `redirects()` in
`web/next.config.ts` and in `web/src/proxy.ts`.
