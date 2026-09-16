# ADR 0011: Read-mode source labeling and edition attribution

## Status

Accepted — 2026-05-30

## Context

The reader's read mode renders a single primary English text per verse, drawn
from whichever translation source is available (`lxx`, `kjv`, a generic
`translation`, or an `ai` draft). Two problems surfaced:

1. **Silent blanks.** When the chosen field was empty — or when a user had
   toggled every source off in Settings — the verse body rendered as nothing,
   indistinguishable from a load failure.
2. **Unattributed text.** Read mode showed translated text with no indication of
   *which edition* it came from. For a project whose whole premise is honest
   sourcing, presenting English prose with no attribution is a quiet integrity
   gap — the reader can't tell Brenton's Septuagint from the KJV.

The study-mode dual-source view already carried "Septuagint"/"King James"
labels, but those are tradition names, not editions, and read mode had nothing.

## Decision

Make read mode never-blank and edition-attributed, via two pure helpers exported
from `src/components/VerseView.tsx`:

- `resolveVerseBody(verse, hasAnySourceOn)` returns either
  `{ kind: 'text', text }` (best of `lxx || kjv || translation || ai.text`) or
  `{ kind: 'hidden' }`. It returns `'hidden'` only when text exists *and* the
  user has toggled every source off — distinguishing "you hid this" from "there
  is nothing." Callers render an `AllHiddenHint`
  ("All translations hidden — enable one in Settings") for the hidden case and
  never render an empty body otherwise.
- `readModeSource(verse, sources?)` returns the source `key` (`lxx` | `kjv`)
  plus a human-readable, **edition-attributed** `label`. The label is built from
  the chapter's optional `translationSources` metadata
  (`{ name, year, tradition }` → e.g. "Brenton 1851 (Septuagint)") when present,
  and otherwise falls back to a constant `DEFAULT_SOURCE_LABELS` map
  (`lxx → "Brenton 1851 (Septuagint)"`, `kjv → "King James Version"`). It
  returns `null` when there is no scholarly source worth attributing.

`ReadModeBlock` renders a tiny italic edition tag above the verse text and
accepts an optional `translationSources` prop, which `ReaderPage` threads down
from `chapter.translationSources`. The existing study-mode "Septuagint" /
"King James" dual-source labels are left untouched.

The attribution map lives in `VerseView.tsx` as a fallback for chapters that
omit `translationSources`; chapters that include the metadata override it, so
attribution can be corrected/extended in data without a code change.

## Consequences

**Easier:** read mode always shows *something* and always says where the text
came from; missing-source and user-hidden states are visually distinct and
self-explanatory; attribution is data-driven (override via `translationSources`)
with a safe constant fallback; the resolve/label logic is pure and unit-tested
independent of the DOM.

**Harder:** the fallback `DEFAULT_SOURCE_LABELS` map encodes a hard-coded
assumption about the editions behind the `lxx`/`kjv` fields (LXX ⇒ Brenton
1851). The LXX fallback carries a year because Brenton 1851 is a specific,
unambiguous edition. The KJV fallback is deliberately labelled `"King James
Version"` with **no year**: the KJV text in this project is the public-domain
standard, and a year on a bare-fallback label would be an unverified claim, so
the label states the tradition without overclaiming a specific printing. Any
chapter that actually carries KJV data supplies `translationSources` with the
precise edition (the project's KJV metadata uses **1611**), and that metadata
always overrides the fallback — so the year-less fallback edition is never
*wrong*, only deliberately unspecific. If a chapter's underlying edition ever
differs from these assumptions, it must supply `translationSources` to state the
truth, or the constant fallback will misattribute. This is documented here so
the assumption is visible rather than buried.

## Alternatives considered

- **Keep rendering the raw field (blank when empty).** Rejected — silent blanks
  read as bugs and give the reader no signal about source or visibility state.
- **Show only tradition names ("Septuagint"), no edition/year.** Rejected — a
  tradition is not a citation; "Brenton 1851 (Septuagint)" is the honest minimum
  for a sourcing-first project.
- **Require `translationSources` on every chapter (no fallback).** Rejected —
  would blank out attribution for every chapter lacking the metadata; the
  constant fallback degrades gracefully while the data catches up.

## References

- `src/components/VerseView.tsx` (`resolveVerseBody`, `readModeSource`,
  `DEFAULT_SOURCE_LABELS`, `AllHiddenHint`, `ReadModeBlock`),
  `src/pages/ReaderPage.tsx`, `src/types/bible.ts` (`TranslationSource`,
  `Chapter.translationSources`).
- ADR 0009 — stub/empty reader states, the sibling never-blank change in the
  same pass.
- ADR 0010 — integrity-first word glosses, the same honesty principle applied to
  the word level.
