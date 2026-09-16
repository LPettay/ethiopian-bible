# ADR 0002: Per-chapter JSON files as the data contract

## Status

Accepted — 2026-04-05

Primary commit: `61f65ab` ("Initial release: Ethiopian Bible interlinear reader").

## Context

The Ethiopian Bible corpus is large: 81 books in the broader canon, thousands of chapters, each with Ge'ez source text, transliteration, optional word-level glosses, and one or more English translations. The reader app needs to:

- Load only the chapter the user is currently reading (no book-spanning megafiles).
- Support partial coverage gracefully (some books ship Ge'ez-only; others have dual English; Psalms is currently absent).
- Be diffable in code review — schema changes and content corrections must be readable in PRs.
- Be cacheable as static files behind a CDN (GitHub Pages serves these).

A single mega-JSON would defeat lazy loading and bloat the bundle. A SQLite/IndexedDB approach would defeat static-CDN serving and make PR review opaque.

## Decision

The data contract is **one JSON file per chapter**, served as static files from `public/data/chapters/<book-abbrev>/<chapter-number>.json`. The schema is fixed by `src/types/bible.ts`:

```ts
interface Chapter {
  book: string                       // matches the book abbreviation in books.json
  chapter: number
  note?: string
  translationSources?: Record<string, TranslationSource>
  verses: Verse[]
}

interface Verse {
  num: number
  geez: string                       // Ge'ez source line
  translation: string                // legacy single-translation field, may be empty
  translations?: {
    lxx?: string                     // Brenton 1851
    kjv?: string                     // 1611/1769
    'geez-source'?: string           // alternate Ge'ez witness
    ai?: TranslationEntry            // AI-drafted, with confidence (see ADR-0005)
  }
  words: Word[]                      // [{ g: Ge'ez, t: transliteration, gl: gloss }]
}
```

A separate top-level `public/data/books.json` lists every book, its abbreviation, section, chapter count, and Ge'ez name. `public/data/reading-paths.json` describes guided reading paths.

All paths are accessed only through `src/lib/data.ts`, which prefixes `import.meta.env.BASE_URL` (see ADR-0006).

## Consequences

- **Pro:** Lazy-loaded by chapter — the network/parse cost is bounded by what the user is currently reading.
- **Pro:** Static-cacheable, deployable to GitHub Pages with no server.
- **Pro:** PR diffs of content corrections are readable verse-by-verse.
- **Pro:** Partial coverage is natural — `translations.kjv` can be absent without breaking the schema.
- **Con:** Many small files (`Gen/1.json`, `Gen/2.json`, …) inflate the file count in the repo and `dist/`. Acceptable cost for the static-deploy story.
- **Con:** No relational queries across chapters at runtime — search has to load multiple files. M5 (manifest) addresses this with an index.
- **Con:** Schema migrations require touching every chapter file. Mitigated by keeping all optional fields optional and avoiding renames.

## Alternatives considered

- **Single bundled `bible.json`** — would inflate the bundle and defeat lazy loading. Rejected.
- **SQLite (sql.js / wa-sqlite)** — relational queries are nice, but the file isn't human-diffable, content review becomes opaque, and the runtime cost (loading the DB engine) is high for a reader app. Rejected.
- **One file per book** — better than one mega-file, but books like Psalms (151 chapters) and 1 Enoch (108 chapters) become large. Per-chapter is the right granularity.
