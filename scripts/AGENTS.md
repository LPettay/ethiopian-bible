# AGENTS.md — `scripts/`

Repo-hygiene tooling. **Not** product code. These scripts enforce the conventions documented in every other `AGENTS.md` and run on every commit (via lefthook) and in CI.

## Index

### Files here

| File | Purpose |
|---|---|
| `check.ts` | Orchestrator. Runs all enabled checks and reports findings. Exit code is the gate. |
| `stamp.ts` | Writes the `<!-- last-reviewed: SHA -->` footer to AGENTS.md files. Use after reviewing a directory's diff and confirming its AGENTS.md is still accurate. |

### Subdirectories

| Dir | AGENTS.md | Purpose |
|---|---|---|
| `lib/` | [`lib/AGENTS.md`](./lib/AGENTS.md) | Helper modules and individual `check-*.ts` checks |

## Commands

| Command | What it does |
|---|---|
| `bun run check` | Run all checks. Exit code 1 on any error. |
| `bun run check --only=presence` | Run a single check (or comma-separated list). Valid: `presence`, `forbidden`, `freshness`. |
| `bun run check --verbose` | Include extra detail (e.g. the list of files that triggered a stale stamp). |
| `bun run agents:stamp <path>` | Stamp one AGENTS.md with the current HEAD SHA. |
| `bun run scripts/stamp.ts --all` | Stamp every AGENTS.md in the repo. Use sparingly — usually you stamp the one you actually reviewed. |
| `bun run scripts/stamp.ts --all --sha=<sha>` | Stamp with a specific SHA (e.g. when bootstrapping after a milestone). |
| `bun run agents:stale` | Run only the freshness check, verbose. Good for "what do I need to re-review?" |

## Rules

- **No framework imports, no React.** This directory must run standalone via `bun run scripts/check.ts`.
- **Stdlib + node only.** Use `node:fs`, `node:path`, `node:child_process`. No runtime dependencies.
- **Exit codes matter.** `0` = pass, `1` = errors, `2` = bad invocation. Pre-commit and CI rely on this.
- **Findings carry `code`, `message`, optional `path`, optional `fix`.** Anything user-visible must include a `fix` hint.
- **Tunables go in `lib/config.ts`.** Never hardcode in checks.

## Adding a new check

The dispatcher in `check.ts` is intentionally extensible. To add one:

1. Add a `lib/check-<name>.ts` exporting `check<Name>(repoRoot, opts?): CheckResult`.
2. Append the id to the `CheckId` union and the `ALL` array in `check.ts`, and wire it into the `main()` dispatch.
3. Document it in `lib/AGENTS.md` and in the table above if it gains its own command.
4. Add a brief explanation to the project README or a relevant ADR if it changes contributor workflow.

Planned upcoming additions:

- **M5** — `lib/check-data.ts` (manifest validation for `public/data/`)
- **M7** — `lib/check-provenance.ts` (TEI source pinning + sha256)

## What does NOT live here

- Product runtime code → `src/`
- Documentation / ADRs → `docs/`
- CI workflow files → `.github/workflows/`
