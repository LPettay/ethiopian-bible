# AGENTS.md — `src/components/`

Presentational React components. **Props in, JSX out.** No data fetching, no `localStorage`, no routing imports.

## Index

### Files here

| File | Purpose |
|---|---|
| `AnnotationEditor.tsx` | Inline editor for verse annotations. Receives the current annotation + an `onSave` callback. |
| `BookPicker.tsx` | Book + chapter selector. Receives the book list and current selection; emits navigation intents via callback. |
| `ConfidenceBadge.tsx` | Visual badge for translation-confidence (high / medium / low / pending). Pure pass-through of a confidence value. |
| `HelpModal.tsx` | Keyboard-shortcuts dialog (`role="dialog"`, `aria-modal`, focus-trapped via `useFocusTrap` with Esc-to-close). Lists the real shortcuts from `useKeyboardNav`. Opened from `Layout`. |
| `Layout.tsx` | App shell — header, nav, slot for page content. Owns the global book-picker modal and the `?`-key Help modal. |
| `SearchPanel.tsx` | Search UI. Takes a search function and current query as props; does not own the index. |
| `Settings.tsx` | Settings panel. Reads/writes via the `useSettings` hook (which is the lib-side seam). |
| `ShareVerse.tsx` | Share-verse dialog. Receives the verse reference; produces share strings via prop callbacks. |
| `VariantIndicator.tsx` | Renders an indicator when a verse has translation variants. |
| `VerseView.tsx` | Renders a single verse with Ge'ez, transliteration, and English. The display primitive of the reader. |
| `WordCard.tsx` | Per-word inspector. Hover/focus shows a `role="tooltip"` card with gloss, language, headword, attribution and a link to the Dillmann entry; click opens the same content in a modal. Never hover-only. See ADR 0012. |

## Rules

- **No `fetch`.** If a component needs data, accept it as a prop — the page or hook fetched it.
- **No `localStorage`.** Use the `useSettings` hook (or another `lib/`-backed hook) to read and write persisted state.
- **No `react-router-dom` imports.** If a component needs to navigate, accept an `onNavigate` callback or a `to:` prop string and let the page wire it up. Routing is a page-level concern.
- **No business logic.** Formatting helpers belong in `lib/`. Components compose props into JSX and dispatch user events.
- **`React.memo` only when re-render cost is real.** Don't pre-optimize. If a memoized component lacks a comment justifying the memo, remove the memo.
- **Accessibility:** every interactive element needs a label and a keyboard path. Focus management for modals goes through `useFocusTrap`.

## What does NOT live here

- Data shape definitions → `src/types/`
- Data fetching → `src/lib/data.ts`
- `localStorage` access → `src/lib/storage.ts`
- Route definitions → `src/App.tsx` and `src/pages/`

## Adding a component

1. Add `<Name>.tsx` here. Default-export the component or named-export — be consistent with neighbors.
2. Add it to the **Files here** table above with a one-sentence purpose.
3. If it has non-trivial branching, add a unit test under `tests/unit/components.test.tsx`.

---

<!-- last-reviewed: c0c4935 -->
