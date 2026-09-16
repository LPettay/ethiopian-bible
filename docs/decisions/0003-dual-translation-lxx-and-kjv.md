# ADR 0003: Dual-translation pairing — LXX (Brenton 1851) + KJV (1611/1769)

## Status

Accepted — 2026-04-05

Primary commit: `61f65ab` ("Initial release: Ethiopian Bible interlinear reader"). Comparison rationale embedded in `src/lib/compare-data.ts`.

## Context

The Ethiopian Orthodox Bible was translated into Ge'ez primarily from the Greek Septuagint beginning in the 4th–5th century CE — not from the Hebrew Masoretic Text. This means the textual *witness* the Ethiopian church preserves is closer to the LXX than to the textual stream most English-speaking Protestant readers are familiar with.

Showing only one English translation alongside the Ge'ez would force a choice with theological consequences:

- **Brenton's LXX** alone — accurate to the textual tradition the Ge'ez follows, but unfamiliar to most English readers; phrasing reads as archaic-but-not-the-archaic-they-know.
- **KJV** alone — familiar, but translated from the Masoretic Text. Where the LXX and MT diverge (Goliath's height in 1 Samuel 17:4, Genesis 5/11 chronology, Deuteronomy 32:8, Isaiah 7:14, Psalm 151's existence at all, etc.), KJV alone hides the divergence the Ethiopian Bible witnesses.

The whole pedagogical point of the app — *"the Ethiopian Bible preserves something your Bible doesn't"* — only lands if both readings are visible at once.

## Decision

The default English pairing is **LXX (Brenton 1851)** and **KJV (1611/1769)**, both public domain, shown side-by-side in the per-verse view. The schema reflects this: `Verse.translations.lxx` and `Verse.translations.kjv` are first-class fields in `src/types/bible.ts`. User settings (`ReaderSettings.showLxx`, `showKjv`) toggle them independently.

`src/lib/compare-data.ts` is the structured ground for the `/compare` page, which makes the LXX-vs-MT divergences explicit (Goliath, Deut 32:8/43, Isaiah 7:14, Jeremiah's two editions, Susanna, Psalm 151, Jude quoting Enoch, etc.).

## Consequences

- **Pro:** Readers see the textual divergence directly, verse-by-verse, instead of being told about it abstractly.
- **Pro:** Both translations are public domain — no licensing constraint, no royalties, no take-down risk.
- **Pro:** The dual layout is the load-bearing UX decision behind reading mode `compare` (see ADR-0004) and behind the `/compare` page's textual-variant exhibits.
- **Con:** Brenton (1851) and KJV (1611/1769) are both archaic. A modern reader has to decode two registers of older English at once. Mitigated by transliteration and the optional gloss layer; a modern translation pairing (e.g. NETS + ESV) is post-v1 work and would require licensing review.
- **Con:** Translation coverage is incomplete — at v0.1, only ~20 of the 36 shipped books have dual English. Books without full coverage gracefully degrade (per the per-chapter schema in ADR-0002).
- **Con:** The pairing is hard-coded in the type system. Adding a third default (e.g. NETS) means a schema change.

## Alternatives considered

- **KJV only** — familiar but obscures the LXX-divergence story. Rejected; defeats the project's wedge.
- **Brenton only** — accurate to the textual tradition but reads as foreign even to readers who know KJV. Rejected; loses the contrast.
- **Modern translation (NRSVue, ESV, NET)** — better readability, but copyright-encumbered and requires licensing for distribution. Deferred to post-v1 with explicit license review.
- **No English** (Ge'ez + transliteration only) — too niche for the intended audience. Rejected.
