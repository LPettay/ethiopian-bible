# AGENTS.md — Ethiopian Bible Reader

Authoritative agent instructions for this repository. Read this before any non-trivial edit.

Each subdirectory under `src/`, `tests/`, and `public/data/` carries its own `AGENTS.md` with scope-specific guidance — read those too when working within that directory.

---

## Project at a glance

**Ethiopian Bible Reader** — a React + Vite single-page app that surfaces the 81-book Ethiopian Orthodox canon (including books unique to that tradition: 1 Enoch, Jubilees, Meqabyan, etc.) as an interlinear reader with Ge'ez script, transliteration, and English translations side-by-side.

**Status:** v0.1 deployed to GitHub Pages. v0.2 in progress under the audit milestones M1–M7.

**The wedge:** the Ethiopian Orthodox canon has the largest scripture corpus in continuous liturgical use, and almost none of it is digitally accessible to English readers in a verse-by-verse, source-citing form. This app is that surface.

---

## Crawl map

Every `AGENTS.md` in the repo, with its purpose.

```
.
├── AGENTS.md                        ← you are here (constraints, scope, agent workflow)
├── docs/AGENTS.md                   Architecture + ADR conventions
│   └── decisions/AGENTS.md          ADR format + when to write one (ADRs 0001–0007 backfilled)
├── src/AGENTS.md                    Source root — dependency direction, module boundaries
│   ├── components/AGENTS.md         Presentational components — props in, JSX out
│   ├── lib/AGENTS.md                Sole owner of public/data paths and localStorage keys
│   └── pages/AGENTS.md              Route entrypoints — own URL params, delegate logic
├── tests/AGENTS.md                  Vitest unit tests; e2e dir reserved (Playwright not installed)
└── public/data/AGENTS.md            Frozen content directory — Ge'ez + translations + reading paths
```

---

## Hard constraints (do not violate)

| Concern | Rule |
|---|---|
| Package manager | **`npm` only** for now (`package-lock.json` is the source of truth). Migration to bun is tracked as **M3** — do not preempt. |
| Language | TypeScript strict (per `tsconfig.app.json`). No new `any` without a `// why: ...` comment. |
| React | React 19. Hooks only. No class components. |
| Routing | `react-router-dom` v7. **Only `src/pages/` and `App.tsx` may import from it.** Components must not. |
| Data files (`public/data/`) | **Immutable in M1.** No edits to chapter JSON, `books.json`, or `reading-paths.json`. New books / Psalms wait for M5 (manifest) and M7 (provenance). |
| Data access | Only `src/lib/data.ts` reads chapter files. Components and pages call `lib/`, never `fetch` directly. |
| Storage | Only `src/lib/storage.ts` touches `localStorage`. |
| AGENTS.md scope | Every directory under `src/`, `tests/`, `public/data/` that contains files has an `AGENTS.md`. New directories require one in the same PR. |
| Public surface | Deployed site URL shapes (`/read/:book/:chapter/:verse`, `/compare`, `/bookmarks`) are stable. Changes require an ADR (M2 onward). |
| Comments | Explain *why*, not *what*. No narrating comments. |
| Build & tests | `npm run build` and `npm test` must pass at every commit. |
| Deploy | GitHub Pages (`dist/index.html` copied to `404.html` for SPA routing). Do not change deploy plumbing in M1. |

---

## Definition of "done" — v0.2 (canonical coverage)

1. Psalms (Mazmura Dawit) is present in Ge'ez + transliteration + dual English (closes #1).
2. The remaining 16 books that ship Ge'ez-only gain at least one English translation each, OR are explicitly marked "translation pending" with a confidence badge surfaced in the UI.
3. `public/data/manifest.json` (per **M5**) describes every chapter file, its sources, and translation-coverage status.
4. Every word in chapter JSON is provably traceable to a Beta Masaheft TEI source via `app/data/sources/` + sha256 (per **M7**).
5. `npm test` green; `npm run build` green; GitHub Pages deploy unchanged.

---

## Anti-scope-creep firewall (out of scope for v0.2 — not banned forever)

These are deferred to a later milestone or version. If a contributor (human or AI) proposes one for v0.2, redirect to where it belongs.

- Performance overhaul / bundle splitting → post-v0.2
- Search index rewrite → post-v0.2
- i18n of UI strings → post-v1
- New reading modes beyond `study` / `read` / `compare` → post-v1
- User accounts / sync → never

---

## How to work here as an agent

1. **Always read the relevant directory's `AGENTS.md`** before editing files in it.
2. **Prefer editing existing files** over creating new ones.
3. **Before suggesting a new dependency**, ask: does the standard library or an existing dep cover it?
4. **Before running `npm install <pkg>`**, confirm with the human.
5. **After substantive edits**, run `npm test` and `npm run build`. Both must pass.
6. **Structural decisions get ADRs** (from M2 onward). New directory, new dependency, schema change, URL-shape change — append a one-paragraph ADR to `docs/decisions/`.
7. **Never commit directly to `main`.** One feature = one branch = one PR.
8. **Do not edit `public/data/`** in M1. Content changes are gated on M5 (manifest) and M7 (provenance).

---

## Index convention

Every `AGENTS.md` carries an **Index** section with up to three sub-tables — include only the ones that apply: **Files here**, **Subdirectories**, **Planned (not yet created)**. The convention follows Tessera's ADR-0004; an equivalent ADR for this repo can be added later if/when the convention itself becomes load-bearing.

---

## What to ask the human about

Decisions that need human sign-off:
- New runtime dependency (anything added to `dependencies` or `devDependencies`).
- URL-shape change (anything that breaks an existing deep link).
- Edits to `public/data/` content during M1.
- Anything that changes deploy plumbing (`vite.config.ts`, the `build` script, `404.html` copy step).

Decisions you can make autonomously:
- Bug fixes that don't change public URL shapes.
- TypeScript type tightening.
- Internal refactors that don't change behavior.
- Adding tests.
- Documentation improvements (excluding `public/data/` content).
