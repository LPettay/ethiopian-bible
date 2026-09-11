# ADR 0004: Three reading modes — `study` / `read` / `compare`

## Status

Accepted — 2026-04-05

Primary commits: `61f65ab` (initial reading modes), `6b3b904` (default mode changed to `read` for first-time visitors).

## Context

Different users come to the app with different goals, and a single layout can't serve all of them well:

- **A scholar or student of Ge'ez** wants the source word, its transliteration, its gloss, and a literal translation visible together — interlinear, dense, slow.
- **A devotional or curious reader** wants flowing prose in their own language without the cognitive load of word-level annotation.
- **A reader interested in canon and textual divergence** (the project's wedge — *"the Ethiopian Bible preserves what others don't"*) wants to see Ge'ez and the dual English readings side-by-side at the *verse* granularity, not the word granularity.

A single layout that tries to satisfy all three drowns the casual reader in interlinear detail and bores the scholar with prose.

## Decision

Three reading modes, encoded as `ReadingMode = 'study' | 'read' | 'compare'` in `src/types/bible.ts` and persisted in `ReaderSettings`:

- **`study`** — interlinear word-by-word. Ge'ez word, transliteration, gloss, and translation all visible per word. The dense scholarly view.
- **`read`** — prose. Verse-by-verse English (or Ge'ez), no word-level annotation. The default for first-time visitors as of `6b3b904`, on the reasoning that "read" is the lower-friction entry point and the user can opt into `study` once interested.
- **`compare`** — dual-translation comparison at the verse level. Ge'ez + LXX + KJV stacked per verse (see ADR-0003 for the LXX/KJV pairing rationale). Distinct from the `/compare` *page*, which is a separate canon-and-textual-variant exhibit.

The mode is a global setting (one of `ReaderSettings`), not a per-page choice, so the user's preference persists as they navigate between books and chapters.

## Consequences

- **Pro:** Each mode is optimized for one job and doesn't compromise for the others.
- **Pro:** The schema-level toggles (`showTransliteration`, `showLxx`, `showKjv`, `showAiTranslation`, `showGeezSource`) compose with reading mode — a power user can tune `study` mode further without breaking `read`.
- **Pro:** Setting the default to `read` (per `6b3b904`) lowers the friction for first-time visitors who didn't come for an interlinear.
- **Con:** Three modes means three layouts to maintain in `VerseView` and friends. Each new feature (e.g. AI translation pill in ADR-0005) has to make sense in all three modes.
- **Con:** The naming overloads "compare" — the `compare` reading mode and the `/compare` *page* are different surfaces and that has confused the project owner more than once. A future ADR may rename one of them.

## Alternatives considered

- **One configurable layout with checkboxes** — every toggle visible all the time. Rejected — paralyzes new users and doesn't acknowledge that the three jobs are categorically different.
- **Two modes (study + read)** — simpler, but loses the dual-translation comparison surface that's central to the project's wedge.
- **Per-book or per-page mode** — would let a user be in `study` for Psalms and `read` for Genesis. Rejected as over-engineered for v0.1; if usage data shows it's needed, revisit post-v1.
