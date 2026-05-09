# AGENTS.md — `src/pages/`

Route entrypoints. Each page owns its URL params, page title, and top-level layout — and **delegates everything else** to `lib/` and `components/`.

## Index

### Files here

| File | Purpose |
|---|---|
| `WelcomePage.tsx` | Landing route (`/`). Intro + entry into the reader. |
| `DiscoverPage.tsx` | Reading-paths overview, sourced from `public/data/reading-paths.json` via `lib/data.ts`. |
| `BiblePage.tsx` | Book browser — lists all books, links into the reader. |
| `ReaderPage.tsx` | The interlinear reader (`/read/:book/:chapter/:verse`). Owns the URL params; loads chapter data via `lib/data.ts`; renders via `VerseView`. |
| `ComparePage.tsx` | Side-by-side translation comparison (`/compare`). Loads parallel data via `lib/compare-data.ts`. |
| `BookmarksPage.tsx` | User's saved verses (`/bookmarks`). Reads via `lib/storage.ts`. |
| `AboutPage.tsx` | Static about / sources / credits page. |

## Rules

- **Pages may import from `react-router-dom`.** Components may not — if a component needs navigation, the page passes a callback.
- **Pages own URL params.** Use `useParams()` / `useSearchParams()` here, then pass concrete values down as props.
- **No business logic in pages.** Parsing, validation, data shaping → `lib/`. Rendering → `components/`. Pages are wiring.
- **Every page must work cold-loaded from its URL.** A user pasting `/read/Ps/23/1` into a fresh tab must land on Psalms 23:1 with no prior navigation. This is enforced by the SPA fallback (`dist/index.html` → `dist/404.html`); do not break it.
- **Set the document title** for every page (e.g. via a small `useTitle` hook or direct `document.title = ...` in an effect). The title is the deep-link's social-share signal.
- **Loading + error states are page-level concerns.** Pages await `lib/` calls; components render whatever they're given.

## URL shape contract

These URL shapes are **stable**. Changing one orphans every external bookmark and share. Changes require an ADR (M2 onward).

| Path | Params | Owned by |
|---|---|---|
| `/` | — | `WelcomePage` |
| `/discover` | — | `DiscoverPage` |
| `/bible` | — | `BiblePage` |
| `/read/:book/:chapter/:verse?` | `book` (abbrev), `chapter` (int), `verse` (int, optional) | `ReaderPage` |
| `/compare` | query: translations + reference | `ComparePage` |
| `/bookmarks` | — | `BookmarksPage` |
| `/about` | — | `AboutPage` |

## What does NOT live here

- Reusable presentational pieces → `src/components/`
- Data fetching → `src/lib/data.ts`
- `localStorage` → `src/lib/storage.ts`
- The `<Routes>` tree itself → `src/App.tsx`

---

<!-- last-reviewed: e0e38e3 -->
