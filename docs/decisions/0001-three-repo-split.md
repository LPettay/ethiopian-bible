# ADR 0001: Three-directory split — `app/` deployable, `research/` lab, `web-legacy/` archive

## Status

Accepted — 2026-04-05

(Inferred from observable structure; predates `app/`'s git history. The project owner can supersede with a follow-up ADR if any of the rationale is wrong.)

## Context

The Ethiopian Bible project conflates three distinct workstreams that have different lifecycles, audiences, and tolerances for change:

1. **A polished public artifact** — a React/Vite SPA that has to build, deploy, and not break for end users.
2. **A research lab** — TEI-XML acquisition from Beta Masaheft, scholarly verification (`CANONICAL_DIFF.md`, `VERIFICATION_GUIDE.md`), Python tooling (`convert_tei_to_json.py`, `populate_translations.py`, `dillmann_lookup.py`, `ai_translate.py`) that runs locally on Lance's machine and produces the JSON the app consumes. This surface evolves rapidly, contains large XML sources, and is messy by design.
3. **A predecessor** — a static-HTML version of the project (`compare.html`, vanilla JS, plain `data/`) that still has reference value but is no longer maintained.

A single repo would force one set of constraints (CI, build tooling, dependency policy, deploy pipeline) onto all three, and would couple the public artifact's git history to research churn it shouldn't carry.

## Decision

Three sibling directories under `~/Bible/`, only one of which is a published artifact:

- `app/` — the deployable React app. The only directory with `.git` and the only one published (to GitHub Pages). Production rules apply: tests must pass, builds must succeed, every change goes through a PR.
- `research/` — local working surface. TEI XML sources (`geez_sources/*.xml`), English translation source texts (`source_texts/brenton/`, `source_texts/kjv/`), Python transformation tooling (`tools/`), and scholarly verification documents. Stays local; not published, not version-controlled in `app/`.
- `web-legacy/` — the prior incarnation (static HTML/CSS/JS). Read-only reference. Not maintained.

## Consequences

- **Pro:** `app/`'s git history reflects only product changes — research churn doesn't pollute it.
- **Pro:** Research tooling can use Python, large XML sources, and ad-hoc scripts without contaminating the React app's dependency tree or CI.
- **Pro:** The legacy version stays available as a reference without being a maintenance burden.
- **Con:** `app/` cannot directly read from `research/` at runtime — the JSON files in `app/public/data/chapters/` are the only contract between the two surfaces, and the connection back to TEI provenance is lost. **M7 closes this loop** by vendoring TEIs into `app/data/sources/` with sha256 pins.
- **Con:** Onboarding a new contributor requires explaining all three directories and their lifecycles.

## Alternatives considered

- **Single monorepo** — would force one set of CI/build/dep rules onto research scripts and the legacy archive. Rejected — the audiences and lifecycles are too different.
- **Three separate git repos** — fully isolated, but adds friction to cross-cutting work (e.g. when research outputs feed `app/data/`). Rejected for now; the local-only `research/` and `web-legacy/` directories give most of the isolation benefit without the friction.
- **Delete `web-legacy/`** — would lose context for why current decisions were made. Rejected — the archive is cheap to keep and occasionally useful.
