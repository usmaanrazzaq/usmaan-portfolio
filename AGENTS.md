# AGENTS.md

## Cursor Cloud specific instructions

### Project overview
Static portfolio website (HTML/CSS/vanilla JS) with an SPA router that fetches page partials from `/pages/` via `fetch()`. No build step, no framework, no database.

### Running the dev server
```
npx serve -l 3000
```
The site requires a static file server because the SPA router uses `fetch()` to load HTML partials; opening `index.html` directly from the filesystem will not work.

### Lint / Test / Build
- **Lint**: No linter is configured.
- **Tests**: No automated tests exist (`npm test` exits with error by design).
- **Build**: No build step; the site is served as-is from static files.

### Image optimization (optional)
`node optimize-images.js` uses the `sharp` npm package to optimize images. Only needed when adding/updating image assets.

### Key caveats
- The SPA router in `main.js` defines routes for `/`, `/work/`, `/about/`, `/sandbox/`, `/contact/` and loads partials from `pages/<name>.html`.
- Case study pages (under `Adsum/`, `Rented/`, `On-The-Run-Studio/`, etc.) are standalone HTML pages, not SPA routes.
- `.htaccess` is for Apache production deployment only; irrelevant for local dev.
