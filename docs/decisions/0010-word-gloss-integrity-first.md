# ADR 0010: Integrity-first word glosses

## Status

Accepted — 2026-05-30

## Context

The per-word inspector (`WordCard`) is supposed to show a Ge'ez word's meaning.
Coverage was effectively zero: the research-side cache held 167 words and
**every one** had `"gloss": null`. The root cause is morphological, not a bug —
the Dillmann *Lexicon Linguae Aethiopicae* is keyed by **lemma headwords**
(citation forms like `ሀገር`, "city"), but the corpus stores **raw inflected
surface forms** with attached proclitics/enclitics (e.g. `ወለሀገሩ`,
"and-to-his-city"). Querying the surface form verbatim never matched a headword.
Measured against the live corpus, 51.2% of unique surface words begin with a
common proclitic grapheme, so a large fraction could never resolve without
normalization.

This created a temptation: fill the gap with machine-generated glosses to make
the feature "look complete." Doing so would violate the project's core integrity
commitment — never present a fabricated meaning as if it were sourced.

Two things were needed: an honest UI for the (currently common) no-gloss case,
and a real path to coverage that does not compromise sourcing.

## Decision

Adopt an **integrity-first** gloss strategy: surface only attributed glosses,
state absence honestly, and always offer a scholarly fallback link. Defer mass
gloss generation; never fabricate.

- `src/lib/lexicon.ts` is the client seam. `getGloss(geez)` is pure/synchronous
  and returns a `{ gloss, source }` **only** when an attributed entry exists; it
  returns `null` for non-Ge'ez input, when no lexicon is loaded, and for any
  entry missing a `gloss` or `source`. It **never fabricates**. The lexicon data
  file (`${BASE_URL}data/lexicon.json`) is **optional**; `loadLexicon()` returns
  an empty lexicon (never throws) when the file is absent.
- `dillmannSearchUrl(geez)` returns a Beta Masaheft Dillmann search URL so a
  reader can always reach a scholarly source even when we have no local gloss.
- `WordCard` is source-aware: a sourced gloss is shown *with* its `Source:`
  attribution; a Ge'ez word with no gloss shows "Meaning not yet available" plus
  an external "Look up in Dillmann ↗" link; non-Ge'ez lines (English header
  placeholders, per `hasGeezScript`) are labeled "Section header" with no
  transliteration and no Dillmann link. No silent blank, ever.
- **Coverage path (research tooling, not shipped data):** `geez_normalize.py`
  generates an ordered list of candidate lemma forms (original-first, then
  progressively reduced) so the first lexicon hit is the safest reading;
  `build_lexicon.py` walks the corpus and writes `lexicon.json` keyed by surface
  word, **skipping** any word that does not resolve to a sourced gloss. It is
  idempotent, resumable, and rate-limit-respectful. No mass run has been
  executed yet, so `lexicon.json` does not exist and the app honestly shows no
  gloss — by design.
- **AI-draft policy (deferred, gated):** if AI-drafted glosses are ever added to
  raise coverage they MUST be (1) clearly labeled with a distinguishing
  `source`/tier, never the Dillmann attribution; (2) confidence-scored;
  (3) never silent — visibly marked as drafts; (4) separable/removable as a
  class so the lexicon can always be reduced to attributed-only. Until such a
  feature is explicitly designed and gated, the only glosses in `lexicon.json`
  are sourced Dillmann entries.

## Consequences

**Easier:** the reader can trust every displayed gloss; a missing gloss is
informative ("not yet available" + a real link out) rather than a dead blank;
the lexicon file is optional so the app degrades gracefully; coverage can be
grown later in reviewed batches without re-architecting the UI.

**Harder:** coverage is currently low and visibly so; the honest "not yet
available" state appears for most words until reviewed lexicon batches land.
Growing coverage requires deliberate, network-bound, human-reviewed runs of
`build_lexicon.py` — there is no quick "just generate it" shortcut, and that
restraint is the point.

## Alternatives considered

- **Mass-generate glosses now (AI or naive lookup).** Rejected — produces
  unattributed or wrong meanings presented as fact; directly violates the
  integrity rule. Absence is preferable to an unlabeled guess.
- **Show the raw Dillmann miss / blank.** Rejected — indistinguishable from a
  broken feature; gives the reader nothing actionable.
- **Ship the surface-keyed cache as-is.** Rejected — it is 100% null; it would
  encode the morphology mismatch as permanent emptiness with no recovery path.

## References

- `src/lib/lexicon.ts`, `src/components/WordCard.tsx`, `src/lib/stub.ts`
  (`hasGeezScript`).
- `research/LEXICON_PIPELINE.md` — null-cache root cause, normalization approach,
  schema contract, and the AI-draft policy in full.
- `research/tools/geez_normalize.py`, `research/tools/build_lexicon.py`,
  `research/tools/dillmann_lookup.py`.
