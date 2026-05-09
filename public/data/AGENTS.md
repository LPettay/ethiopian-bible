# AGENTS.md — `public/data/`

**Frozen content directory.** No edits, additions, or deletions in M1.

This directory is the entire scriptural payload of the app. Treat it as load-bearing data infrastructure, not as code.

## Index

### Files here

| File | Purpose |
|---|---|
| `books.json` | Canonical book list — abbreviation, English name, Ge'ez name, section, chapter count, source ID. Drives the book picker and routing. |
| `reading-paths.json` | Curated reading sequences (e.g. "The Full Story") composed of book + chapter ranges with section labels. |

### Subdirectories

| Dir | Purpose |
|---|---|
| `chapters/` | One subdirectory per book (by abbreviation: `Gen/`, `Ps/`, `1En/`, …) containing per-chapter JSON files. Chapter JSON shape is the implicit schema for the reader; formalizing it is **M5**. |

### Planned (not yet created)

| File | Purpose | Tracked in |
|---|---|---|
| `manifest.json` | Machine-readable index of every chapter file, its sources, and its translation-coverage status (Ge'ez-only / single-English / dual-English / pending). | **M5** |
| `sources/<source-id>.json` | Per-source provenance entries — TEI URL, sha256, license, retrieval date. | **M7** |

## Rules

- **No edits in M1.** Do not change a single byte of chapter JSON, `books.json`, or `reading-paths.json`. Content work is gated on M5 (the manifest, so we know what we have) and M7 (provenance, so we know where it came from).
- **No new books in M1.** Adding Psalms or filling Ge'ez-only books waits for M5 + M7.
- **No reformatting.** Do not "tidy" the JSON, change indentation, or reorder keys. Diffs in this directory must be intentional.
- **No moving files.** Paths in here are referenced by `import.meta.env.BASE_URL`-prefixed URLs in `src/lib/data.ts`. Renames break production deep links.
- **Schema changes are an ADR.** When the chapter JSON shape evolves (e.g. adding a `confidence` field per verse), the change requires an ADR and a migration of every affected file.

## Provenance (per source — informational; full machine-readable manifest is M7)

| Source | License | Notes |
|---|---|---|
| Beta Masaheft TEI | CC BY-SA 4.0 | Ge'ez source-of-truth. Cite by `source_id` (e.g. `LIT1340EnochE`). |
| Brenton 1851 (LXX → English) | Public domain | English translation of the Septuagint. |
| KJV 1769 (Authorized Version) | Public domain | English translation, Cambridge paragraph edition. |
| R.H. Charles 1917 / 1902 | Public domain | English translation of 1 Enoch (1917) and Jubilees (1902). |
| E.A.W. Budge 1922 | Public domain | English translation of the Kebra Nagast. |

The full machine-readable provenance manifest — every word back-traced to a sha256-pinned TEI source — is **M7**.

## What does NOT live here

- Code that reads this data → `src/lib/data.ts`
- Type definitions for the data shape → `src/types/bible.ts`
- UI that renders the data → `src/components/VerseView.tsx` and friends
