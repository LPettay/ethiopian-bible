# ADR 0009: Stub-book handling via an explicit `stub` flag

## Status

Accepted — 2026-05-30

## Context

The "Unique to Ethiopia" canon section lists books whose chapter JSON contains
no transcribed Ge'ez — only short English header/placeholder lines (e.g.
`Lef/1.json`'s lone verse is the literal string `"First Prayer"`). Four such
books exist today: Lefafa Sedq (`Lef`), Testament of Our Lord (`TestLd`),
Teaching of Mysteries (`Teach`), and Sinodos (`Sinod`).

Before this pass these books were indistinguishable from genuinely transcribed
ones in the UI. The catalog mislabelled them as ordinary "Geʿez only" books, and
the reader rendered a near-blank body — a silent failure that looks like a bug
and erodes trust in the corpus.

A naive fix is to **auto-detect** a stub by inspecting chapter content (e.g. "no
verse contains Ethiopic script"). That detection is unreliable here: the
Mysteries of Heaven & Earth (`MysHE`) chapter files *also* contain only
English (an account/summary in English prose, 781–4640 bytes per chapter), yet
that is genuine partial content worth showing — not a placeholder. Empirical
"is there Ge'ez?" detection would wrongly hide `MysHE`, while a "is the file
tiny?" heuristic would be fragile against future edits.

## Decision

Mark placeholder books with an explicit `stub: true` boolean in
`public/data/books.json`, and gate UI on that flag — not on a content heuristic.

- `src/types/bible.ts` adds `stub?: boolean` to the `Book` type
  (`true = placeholder / not-yet-transcribed book`).
- `src/lib/stub.ts` owns the predicate `isStubBook(book) === book.stub === true`
  and two related Ge'ez-script helpers: `hasGeezScript(s)` (any U+1200–U+137F
  char) and `isPlaceholderVerse(verse)` (a verse whose `geez` field carries no
  Ethiopic script). Pure, no React.
- `BiblePage` resolves stub status directly via `isStubBook(b)` instead of a
  chapter fetch, and renders a distinct amber `StubBadge`
  ("Placeholder — not yet transcribed") in both the book-list row and the
  chapter-grid header. `stub` is added to the `TranslationStatus` union and
  `STATUS_LABELS`.
- `ReaderPage` short-circuits to a friendly, non-blank empty state — "This book
  isn't transcribed yet." for stubs (and "This chapter is empty." for a
  genuinely empty chapter) with a back-home button — before the main render.

`MysHE` is **deliberately not** flagged `stub`. Its files contain real (if
English) content, so it renders normally; flagging it would hide material we
actually have.

## Consequences

**Easier:** the catalog and reader tell the truth about coverage; users stop
hitting silent blanks; stub status is a single source of truth (the flag) that
the whole UI reads consistently; adding/removing a stub later is a one-line data
edit, not a code change.

**Harder:** the flag must be maintained by hand. When a stub book is
transcribed, whoever lands the content must also remove `stub: true`, or the
book stays hidden behind the placeholder state. This is an accepted, low-volume
maintenance cost (four books) and is preferable to a heuristic that
misclassifies `MysHE`.

## Alternatives considered

- **Empirical content detection (no Ge'ez ⇒ stub).** Rejected — `MysHE` has no
  Ge'ez yet is not a stub, so the heuristic produces false positives. Honest
  classification here needs human intent, which the explicit flag captures.
- **File-size / verse-count heuristic.** Rejected — fragile and arbitrary; a
  threshold that excludes the ~160-byte stub headers but keeps `MysHE` is a
  magic number that breaks the moment content shape changes.
- **Leave the silent blank.** Rejected — it reads as a bug and misrepresents the
  corpus's actual coverage.

## References

- `src/lib/stub.ts`, `src/types/bible.ts` (`Book.stub`),
  `src/pages/BiblePage.tsx`, `src/pages/ReaderPage.tsx`.
- `public/data/books.json` — the four `stub: true` entries and the unflagged
  `MysHE` entry that motivated explicit flagging over detection.
- ADR 0011 — read-mode source labeling, the sibling honest-state change in the
  same pass.
