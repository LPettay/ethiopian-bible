# AGENTS.md — `scripts/lib/`

Helper modules used by `check.ts` and `stamp.ts`. Pure functions, stdlib only.

## Index

### Files here

| File | Exports | Purpose |
|---|---|---|
| `config.ts` | `config`, `formatStamp`, `parseStamp` | Tunables (enforcement roots, threshold, forbidden files) and stamp format |
| `walk.ts` | `walkDirs`, `dirHasFiles`, `DirEntry` | Recursive directory iterator that respects `config.ignoreDirs` |
| `git.ts` | `headSha`, `shaExists`, `changedFilesIn` | Thin git wrappers via `child_process` |
| `types.ts` | `Severity`, `Finding`, `CheckResult`, `ok` | Shared shapes returned by every check |
| `check-presence.ts` | `checkPresence` | Layer 2a — every directory in `agentsRequiredRoots` needs an AGENTS.md (shallow check) |
| `check-forbidden.ts` | `checkForbidden` | Layer 2c — no wrong-PM lockfiles (`package-lock.json`, `yarn.lock`, `pnpm-lock.yaml`), no `.env*` |
| `check-freshness.ts` | `checkFreshness` | Layer 5 — every AGENTS.md carries a `<!-- last-reviewed: SHA -->` footer; > `freshnessThreshold` non-AGENTS files changed since stamp = stale |

## Rules

- **No `dependencies`.** Stdlib (`node:fs`, `node:path`, `node:child_process`) only. Bun runs TypeScript natively, no transpile step.
- **No framework imports, no React.**
- **Each check exports a single `check<Name>(repoRoot, opts?)` function** returning a `CheckResult`.
- **Tunables go in `config.ts`** so all knobs are in one place.
- **Side-effects are limited to `git.ts`** (which shells out to `git`) and the calling `stamp.ts` (which writes files).

## Adding a new check

1. New file `check-<name>.ts` exporting `check<Name>(repoRoot, opts?): CheckResult`.
2. Wire into `../check.ts`: add the id to the `CheckId` union and the `ALL` array, then dispatch in `main()`.
3. Add a row to the table above and to `../AGENTS.md`.
4. If it changes contributor workflow, mention it in the README or an ADR.

Planned: `check-data.ts` (M5, manifest), `check-provenance.ts` (M7, TEI + sha256).
