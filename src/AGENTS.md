# AGENTS.md — `src/`

Application source. Everything that ships in the built bundle lives under here.

## Index

### Files here

| File | Purpose |
|---|---|
| `App.tsx` | Top-level component. Owns the `react-router-dom` `<Routes>` tree. May import from `react-router-dom`. |
| `main.tsx` | Entry point. The **only** file allowed to have top-level side effects (root render, base path setup). |
| `index.css` | Global styles + Tailwind directives. |

### Subdirectories

| Dir | AGENTS.md | Purpose |
|---|---|---|
| `components/` | [`components/AGENTS.md`](./components/AGENTS.md) | Presentational components — props in, JSX out. No data access, no routing imports. |
| `lib/` | [`lib/AGENTS.md`](./lib/AGENTS.md) | Sole owner of `public/data/` paths and `localStorage` keys. No React. |
| `pages/` | [`pages/AGENTS.md`](./pages/AGENTS.md) | Route entrypoints. Own URL params and page titles; delegate logic to `lib/`. |
| `hooks/` | — | Reusable React hooks. (Small enough that an `AGENTS.md` is deferred until it grows; adding files here requires one.) |
| `types/` | — | Shared TypeScript types (`bible.ts`). Pure type declarations; no runtime code. |
| `assets/` | — | Static imports (icons, images). |
| `styles/` | — | Reserved for component-scoped style modules. Currently empty. |

## Cross-cutting rules

- **Imports:** relative paths. No path aliases configured yet; if one is introduced it requires an ADR.
- **No top-level side effects outside `main.tsx`.** Modules may export functions, types, components — they must not run code on import.
- **Components must not import from `react-router-dom`.** Routing concerns belong in `pages/` and `App.tsx` only.
- **Components and pages must not call `fetch` or touch `localStorage` directly.** Go through `lib/data.ts` and `lib/storage.ts`.

## Dependency direction

```
pages/  ─→  components/  ─→  hooks/   ─→  lib/  ─→  types/
   │            │                          ↑
   └────────────┴──────────────────────────┘
```

- `pages/` may import from `components/`, `hooks/`, `lib/`, `types/`.
- `components/` may import from `hooks/`, `lib/`, `types/` — **not** `pages/`, **not** `react-router-dom`.
- `lib/` may import from `types/` only. **No React imports.**
- `types/` imports nothing from the rest of the source.

A cycle in this graph is a bug.

## Status

v0.1 deployed. v0.2 work is markdown-only (M1) and ADRs (M2) before any code lands.

---

<!-- last-reviewed: e0e38e3 -->
