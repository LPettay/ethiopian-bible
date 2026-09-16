# ADR 0008: Bun as the package manager and toolchain

## Status

Accepted — 2026-05-08

## Context

Through M1 the repo used `npm` (with `package-lock.json`). Two pressures forced a re-evaluation in M3:

1. **Audit consistency.** The sibling `Tessera` project standardized on `bun` (Tessera ADR-0001) and built its repo-hygiene tooling — `scripts/check.ts`, lefthook integration, the `<!-- last-reviewed: SHA -->` stamp protocol — against bun's native TypeScript execution and `bunx` invocation. M3's deliverable is to port that same infrastructure to this repo. Keeping `npm` would mean either a permanent fork of the tooling or a layer of `tsx`/`ts-node` adapters with no upside.
2. **Friction.** `bun install` is roughly an order of magnitude faster than `npm ci` on this dependency graph (≈300 ms cold vs ≈10 s). Pre-commit hooks and CI both benefit. Bun also runs `.ts` scripts directly with no transpile step, which removes a class of build-tooling churn from the `scripts/` directory.

## Decision

`bun >= 1.1` is the only supported package manager and TypeScript runtime for this repo.

- `bun.lock` is the source of truth for the dependency graph. `package-lock.json`, `yarn.lock`, and `pnpm-lock.yaml` are forbidden at the repo root and enforced by `scripts/lib/check-forbidden.ts`.
- `package.json` declares `"engines": { "bun": ">=1.1.0" }`.
- All scripts in `package.json` invoke `bun` / `bunx` directly. CI workflows use `oven-sh/setup-bun@v2` and `bun install --frozen-lockfile`.
- The Dockerfile builds on `oven/bun:1-alpine`.
- Vite, vitest, and TypeScript continue to be the build / test / typecheck tools — bun is the package manager and `.ts` runner, not a replacement for vite or tsc.
- `prepare: bunx lefthook install || true` registers git hooks for contributors after `bun install`.

## Consequences

**Easier:** consistent toolchain across `Tessera` and the Bible reader; fast installs; single-command repo checks (`bun run check`); no transpile step for `scripts/`.

**Harder:** contributors must install bun (one-time `curl -fsSL https://bun.sh/install | bash`). CI matrix is bun-only — no node fallback. If a future dependency turns out to be incompatible with bun's native module resolution, the workaround (run that one tool via `bunx --bun node ...` or fall back to `node` for the specific step) must be documented inline.

## Alternatives considered

- **Stay on npm.** Rejected — would require maintaining a parallel set of `scripts/` for the audit's hygiene tooling and would diverge from `Tessera`/`Dwell` toolchain. The migration cost is paid once; the divergence cost recurs forever.
- **pnpm.** Rejected — solves the install-speed problem but not the TypeScript-runner problem, and would still leave the toolchain out of step with sibling projects. Halfway answers are debt.

## References

- Tessera ADR-0001 (`bun` adoption) — the precedent this decision follows.
- M3 milestone — the migration commit ports `scripts/check.ts`, `scripts/stamp.ts`, `scripts/lib/*`, and `lefthook.yml` from Tessera to this repo.
