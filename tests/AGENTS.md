# AGENTS.md — `tests/`

Vitest unit tests. **No network** — fixtures only. The e2e directory exists as a placeholder; Playwright is not currently installed.

## Index

### Files here

| File | Purpose |
|---|---|
| `setup.ts` | Vitest setup — the **only** file allowed to register global side effects (jest-dom matchers, polyfills). Imported via `vitest.config` / `setupFiles`. |

### Subdirectories

| Dir | Purpose |
|---|---|
| `unit/` | Vitest unit tests for `lib/`, `components/`, and shared types. Files: `data.test.ts`, `storage.test.ts`, `components.test.tsx`, `types.test.ts`. |
| `e2e/` | Reserved for end-to-end tests. **Currently empty.** `@playwright/test` is **not** installed; do not write Playwright tests here in M1. Test-framework consolidation is **M6**. |

## Rules

- **No network in tests.** No `fetch` to a real URL, no `http://localhost`. Load fixtures from disk or inline them.
- **No `public/data/` reads via `fetch` in tests.** If you need chapter shape, build a minimal fixture object that matches the type from `src/types/bible.ts`.
- **`tests/setup.ts` is the only global side-effect file.** Other test files must not register matchers, override globals, or stub modules at import time. Use `beforeEach` / `vi.spyOn` per-test instead.
- **One assertion per behavior.** A test name should describe a single behavior; the body should assert that behavior and nothing else.
- **Co-locate fixtures with the test that uses them** unless they're shared. Shared fixtures get a `tests/unit/__fixtures__/` directory (create with its own `AGENTS.md` if/when needed).
- **`npm test` runs Vitest in CI mode** (`vitest run`). `npm run test:watch` is for local iteration. The `npm run test:e2e` script exists but cannot run until M6.

## What does NOT live here

- Source under test → `src/`
- The data the source operates on → `public/data/` (use fixtures, not real data)
- The Vitest config → `vite.config.ts` (project root)
