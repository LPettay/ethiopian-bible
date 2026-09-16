# ADR 0006: Deploy to GitHub Pages under `/ethiopian-bible/` basename

## Status

Accepted — 2026-04-06

Primary commits: `6b3b904` (deploy workflow added, Vite `base` set), `8bcecd1` (`BrowserRouter` basename + `404.html` SPA fallback), `7901fb3` (data fetches use `import.meta.env.BASE_URL`).

## Context

The app needs a public deploy target. The constraints:

- Free or near-free hosting.
- Static assets — the app is an SPA with no backend (data is per-chapter JSON, see ADR-0002).
- Custom-domain optional but project URL acceptable.
- Deploys triggered from CI on `main`.

The repo is `LPettay/ethiopian-bible` on GitHub. The default GitHub Pages URL for a project repo is `https://lpettay.github.io/ethiopian-bible/` — i.e. served from a **subdirectory**, not a domain root. That subdirectory placement is what forces the basename decision: every URL the app emits (router routes, asset URLs, data fetches) has to be prefixed with `/ethiopian-bible/`, or the deployed site 404s.

A separate hosting target (Vercel, Cloudflare Pages, Netlify, a self-hosted Caddy) would avoid the basename issue but add account/cost/setup overhead for a project that doesn't otherwise need a backend.

## Decision

Deploy to GitHub Pages from the `LPettay/ethiopian-bible` repo, served under the `/ethiopian-bible/` basename. Three coordinated places enforce this:

1. **`vite.config.ts`** — `base: '/ethiopian-bible/'` so Vite emits asset paths with the correct prefix.
2. **`src/App.tsx`** — `<BrowserRouter basename="/ethiopian-bible">` so React Router strips the prefix from URLs internally.
3. **`src/lib/data.ts`** — chapter-JSON fetches use `import.meta.env.BASE_URL` instead of a hard-coded `/data/` path, so the same code works locally (`/data/...`) and in production (`/ethiopian-bible/data/...`). This is what `7901fb3` fixed.

SPA routing on GitHub Pages requires a fallback for client-side routes — GH Pages doesn't know about `/read/Gen/1`. The fix in `8bcecd1` is the build script: `cp dist/index.html dist/404.html` (in `package.json` `build`). GitHub Pages serves `404.html` for unknown paths; the SPA bootstraps from there and React Router takes over.

The deploy is a GitHub Actions workflow that builds `dist/` and pushes it to the `gh-pages` branch (or uses the Pages-from-Actions deploy pathway).

## Consequences

- **Pro:** Free hosting, CI-driven deploys, no account/billing/server to manage.
- **Pro:** The whole stack is static — no runtime, no scaling concerns.
- **Pro:** The basename indirection is cleanly encapsulated in three files; new code paths just have to use `BASE_URL` and `react-router-dom`.
- **Con:** `BrowserRouter basename` and the Vite `base` and the `404.html` copy must stay in sync. Drift causes silent 404s on deploy that don't reproduce locally. Mitigated by the AGENTS.md hard-constraint that deploy plumbing changes need an ADR.
- **Con:** Custom domain would require either changing the basename or setting up a CNAME with redirects — not blocking but a friction point.
- **Con:** `import.meta.env.BASE_URL` is a Vite-ism; a future migration off Vite would have to translate every `BASE_URL` reference.

## Alternatives considered

- **Deploy at domain root with custom domain** — cleanest URL shape, no basename, but requires DNS, cost, and setup. Deferred; can be added without changing app code if DNS just maps to the project Pages URL with appropriate redirects.
- **Vercel / Cloudflare Pages / Netlify** — free tiers, no basename headache, but adds an account and an off-platform dependency. Rejected for v0.1; revisit if GH Pages quotas/limits become a problem.
- **Self-hosted Caddy + Docker** — `Dockerfile` and `Caddyfile` exist in the repo for this. Deferred — works for local preview but not chosen as the primary deploy.
