# ADR 0012: Word glosses built offline from the Dillmann TEI data, surfaced on hover

## Status

Accepted — 2026-09-07

## Context

ADR 0010 built the integrity-first gloss seam (`src/lib/lexicon.ts`, `WordCard`)
but left `public/data/lexicon.json` unwritten: the only population path was
`research/tools/build_lexicon.py`, which queries the live Dillmann API at
`betamasaheft.eu`, and that host resets every connection from the build
environment. The reader therefore showed "Meaning not yet available" for every
word, and a meaning could only be reached by clicking a word (Study mode) and
following an external search link.

Two things were wanted: real, attributed per-word meanings, and a way to see a
word's meaning *and where it came from* by hovering, without leaving the text.

Beta Masaheft publishes the raw lexicon itself as TEI, one file per headword,
in the public GitHub repository `BetaMasaheft/DillmannData` (CC BY-SA-NC 4.0).
GitHub is reachable. That data carries everything the API would have returned:
the headword, Dillmann's Latin definitions (1865), part of speech, and a
TraCES-project layer of later English/French/Italian material (Leslau 1987,
Grébaut 1952), each element attributed by `source`/`bibl`.

## Decision

1. **Build the lexicon offline from the TEI snapshot.**
   `research/tools/build_lexicon_offline.py --tei <DillmannData checkout>` walks
   the corpus vocabulary, resolves each surface word through the existing
   `geez_normalize.lemma_candidates()` chain, and quotes glosses verbatim from
   the TEI. No network, no LLM, deterministic. Words that resolve to nothing are
   absent from the file (ADR 0010's honest-absence rule is unchanged).

2. **Gloss selection rules, chosen for honesty over coverage.**
   - Dillmann's Latin is the primary definition. One quote is taken per
     numbered sense (the first quote in a sense is the definition; later ones
     translate example phrases and would mislead).
   - English is used as the displayed gloss only when Leslau's sense ("L") in
     the TraCES layer glosses the *headword itself*. That layer mostly documents
     compounds and idioms (ዕለተ፡ ሆሳዕና "Palm Sunday" under ዕለት "day"), so quotes
     that follow any other Ge'ez phrase are skipped. When English is shown, the
     Latin is kept alongside it.
   - Entries that only say "see under X" inherit X's gloss and link; their
     lemma is written `X → Y` so the reader sees the cross-reference.
   - Homographs are broken deterministically: an entry with an English gloss
     wins, then the one Dillmann cites most, then file order. Raw headword
     spellings are indexed before orthographically folded ones so a folded
     variant of one entry can never shadow another entry's exact spelling.
   - A short bare-prose definition (proper nouns: "Henoch") is accepted only
     when it contains no digits, section marks, or cross-reference words.

3. **Ship format v2** — `{ version, source, entries[], words{surface: index} }`.
   Entries are shared across every surface form that resolves to the same
   headword, which keeps the file at roughly 1.3 MB raw / 0.3 MB gzipped for
   the whole corpus. `src/lib/lexicon.ts` expands it to the flat lookup at load
   time and still accepts the flat v1 shape; `getGloss()` now returns `lemma`,
   `lang`, `latin`, `pos`, and the entry `id`.

4. **Hover reveals meaning and source.** In Study mode every Ge'ez word card
   shows a `role="tooltip"` card on hover or keyboard focus with the
   transliteration, the gloss (tagged "Latin, Dillmann 1865" when it is not
   English), Dillmann's Latin beneath an English gloss, the headword when it
   differs from the surface form, the attribution, and a link to the exact
   Beta Masaheft entry (`/Dillmann/lemma/<id>`). With no gloss it says "Meaning
   not yet available" and links to a Dillmann search. Clicking still opens the
   modal with the same content, so nothing is hover-only for touch readers.

## Consequences

**Easier:** roughly two-thirds of running Ge'ez text in the corpus (65% of
tokens, 35% of unique surface forms; 1 Enoch: 65% / 51%) now shows a sourced
meaning with a permalink to its dictionary entry. Coverage can be re-derived by
anyone with the TEI checkout, without the API.

**Harder / disclosed:** most glosses are Latin, because that is what Dillmann
wrote; only about 14% of referenced entries have a headword-level English gloss.
The reader is told which language they are looking at. Inflected forms that the
normalizer cannot reduce still show "not yet available". The `lemma → target`
convention and the one-quote-per-sense rule are heuristics documented here and
in the builder; they trade recall for not misattributing an example sentence
as a definition.

**License:** the TEI data is CC BY-SA-NC 4.0 (Hiob Ludolf Centre, TraCES).
Attribution is carried per entry in `source` and in the app's data-sources list.

## Alternatives considered

- **Keep waiting for API reachability.** Rejected — the data is public and the
  API adds nothing the TEI lacks.
- **Prefer English whenever the TraCES layer has any.** Rejected after
  inspection: it produced "spokesman of" for ቃል "word/voice" because the layer
  glosses the compound ቃለ፡ ሐፄ. Latin-first with headword-only English is
  honest.
- **Port the normalizer to TypeScript and ship a lemma-keyed lexicon.** Deferred;
  the shared-entry v2 file is small enough, and keeping resolution in the
  reviewed Python pipeline keeps one source of truth for the heuristics.

## References

- `research/tools/build_lexicon_offline.py` (local research tooling, beside
  `build_lexicon.py` and `geez_normalize.py`).
- `src/lib/lexicon.ts`, `src/components/WordCard.tsx`, `public/data/lexicon.json`.
- ADR 0010 (integrity-first glosses), ADR 0011 (source attribution in read mode).
- https://github.com/BetaMasaheft/DillmannData
