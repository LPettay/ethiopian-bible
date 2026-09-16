# AGENTS.md — `docs/`

Living documentation for the Ethiopian Bible Reader. Read these before making structural decisions.

## Index

### Subdirectories

| Dir | AGENTS.md | Purpose |
|---|---|---|
| `decisions/` | [`decisions/AGENTS.md`](./decisions/AGENTS.md) | ADRs (Architecture Decision Records) — one short markdown per structural choice |

### Planned (not yet created)

| File | Purpose | Tracked in |
|---|---|---|
| `architecture.md` | High-level system diagram, data flow from `public/data/` → `lib/` → `pages/components/` | post-M2 |
| `provenance.md` | TEI source pinning + sha256 manifest design | M7 |

## Rules

- **Append a new ADR** when you make a structural choice (new dependency, new pattern, schema change, URL-shape change, deploy plumbing change).
- **Never delete an ADR.** Mark it `Superseded` and write the new one. The history is the value.
- **Update the per-directory `AGENTS.md`** when you add or remove a directory inside `src/`, `tests/`, or `public/data/`.

## ADR format

Files in `decisions/` are numbered: `0001-...`, `0002-...`. Each is short (under a screen). Required sections: Status, Context, Decision, Consequences. Optional: Alternatives considered. See [`decisions/0000-template.md`](./decisions/0000-template.md).

## ADR numbering

ADRs 0001–0007 backfill prior decisions (M2). ADR numbers are assigned in order as decisions land, whether or not they belong to a milestone; the next free number is `0012`. The full list is in [`decisions/AGENTS.md`](./decisions/AGENTS.md).
