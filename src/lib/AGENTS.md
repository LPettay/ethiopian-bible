# AGENTS.md — `src/lib/`

The seam between the React UI and the outside world. **This directory is the sole owner of `public/data/` paths and `localStorage` keys.** No React imports.

## Index

### Files here

| File | Purpose |
|---|---|
| `data.ts` | The only module that reads chapter JSON, `books.json`, and `reading-paths.json`. Owns URL construction via `import.meta.env.BASE_URL` (see commit `9144745` — required for GitHub Pages). |
| `storage.ts` | The only module that touches `localStorage`. Owns the key namespace and serialization format. |
| `compare-data.ts` | Helpers for the compare view — joins parallel translations on a shared verse-id key. Pure functions over already-loaded data; does no fetching itself. |

## Rules

- **No React.** Not as type, not at runtime. Hooks that wrap these modules live in `src/hooks/`.
- **All `fetch` of `public/data/` goes through `data.ts`.** Components and pages must call `data.ts` exports, never `fetch` directly.
- **All `localStorage` access goes through `storage.ts`.** No `window.localStorage.*` outside this file.
- **Use `import.meta.env.BASE_URL`** when constructing data URLs. The site deploys to a GitHub Pages subpath (`/ethiopian-bible/`); hard-coded leading slashes will 404 in production.
- **Pure functions where possible.** Side-effectful entry points (the `fetch` calls, the `localStorage` reads) should be small and isolated; the rest of `lib/` should be testable without a DOM.
- **Stable keys.** `localStorage` keys are part of the user-facing surface — renaming one orphans existing user data. Schema changes need an ADR (M2 onward).

## What does NOT live here

- React components → `src/components/`
- React hooks (even ones that wrap `lib/`) → `src/hooks/`
- TypeScript shape definitions → `src/types/bible.ts`
- The data itself → `public/data/` (frozen in M1)

## Testing

`lib/` is the easy test target — pure-ish TypeScript over JSON. Tests live in `tests/unit/data.test.ts`, `tests/unit/storage.test.ts`. They must run without network: load fixtures from disk, never hit `public/data/` over `fetch`.
