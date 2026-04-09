# AGENTS.md

## Cursor Cloud specific instructions

This is a personal portfolio website built with vanilla HTML/CSS/JavaScript and served by an Express.js dev server.

### Running the dev server

```
npm start
```

Starts on port 3000 (configurable via `PORT` env var), binds to `0.0.0.0`. There is no build step — the site is raw HTML/CSS/JS served statically.

### Key details

- **No test framework**: `npm test` just echoes an error; there are no automated tests to run.
- **No linter configured**: No ESLint, Prettier, or other lint tools are set up in this project.
- **No build step**: No bundler or transpiler. Files are served as-is by Express.
- **SPA routing**: `server.js` uses a catch-all `*` route to serve `index.html` for unmatched paths. Page content is loaded dynamically from `pages/*.html` by `main.js`.
- **Contact form**: Uses external Web3Forms API (`api.web3forms.com`) — works only with internet access, no local backend needed.
- **Image optimizer**: `node optimize-images.js` converts images to WebP using `sharp`. This is a dev utility, not required for running the site.
