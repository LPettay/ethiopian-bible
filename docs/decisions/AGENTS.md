# AGENTS.md — `docs/decisions/`

Architecture Decision Records (ADRs). One markdown file per structural decision.

## Index

### Files here

| File | Decision |
|---|---|
| `0000-template.md` | Template — copy this for new ADRs |
| `0001-three-repo-split.md` | `app/` (deployable) + `research/` (local lab) + `web-legacy/` (archive) — three sibling directories, only `app/` is the published artifact |
| `0002-per-chapter-json-data-shape.md` | Per-chapter JSON files under `public/data/chapters/<book>/<chapter>.json` are the data contract |
| `0003-dual-translation-lxx-and-kjv.md` | Pair LXX (Brenton 1851) + KJV (1611/1769) as the default English translations alongside Ge'ez |
| `0004-three-reading-modes.md` | Three reading modes: `study` (interlinear word-by-word) / `read` (prose) / `compare` (canon comparison) |
| `0005-confidence-aware-ai-translation-tier.md` | AI-drafted translations are a separate tier with a measurable confidence score and visible UI badge |
| `0006-github-pages-deploy-with-basename.md` | Deploy to GitHub Pages under `/ethiopian-bible/` basename; SPA fallback via `404.html` copy |
| `0007-manuscript-aesthetic-design-language.md` | Manuscript / parchment aesthetic — warm browns, Crimson Pro serif, Noto Sans Ethiopic with text-glow, meskel cross ornaments |

When you add an ADR, add a row above and bump the number sequentially.

## Reserved range

0008–0012 are reserved for the M3–M7 milestones (see `docs/AGENTS.md`). Do not reuse those numbers for non-milestone decisions; if you need to record a smaller decision before those milestones land, use 0013+.

## Rules

- **One decision per file.** If a PR makes two decisions, write two ADRs.
- **Numbered sequentially.** `0001-...`, `0002-...`, etc.
- **Filename is `NNNN-kebab-case-title.md`.**
- **Status is one of:** `Proposed`, `Accepted`, `Superseded by ADR-NNNN`, `Deprecated`.
- **Keep them under a screen.** ADRs are read often; long ones don't get read.
- **Never delete an ADR.** Mark it `Superseded` and write the new one. The history is the value.
- **Date is the date of the decision** (typically the commit date of the primary commit), not the date the ADR was written.

## When to write one

- Adopt or drop a library/framework
- Change directory structure
- Change a URL shape (anything that breaks an existing deep link)
- Change the data-file schema in `public/data/`
- Change deploy plumbing (`vite.config.ts` `base`, `404.html` copy, GitHub Pages workflow)
- Add or remove an `AGENTS.md` boundary
- Anything that future-you will ask "wait, why did we do it this way?" about

## When NOT to write one

- Bug fixes that don't change schema, URL, or deploy
- Internal refactors
- Style tweaks that don't change the design language
- Adding tests
