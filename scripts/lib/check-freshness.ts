import { existsSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";
import { config, parseStamp } from "./config.ts";
import { changedFilesIn, shaExists } from "./git.ts";
import type { CheckResult, Finding } from "./types.ts";

/**
 * Layer 5 — every AGENTS.md carries a `<!-- last-reviewed: SHA -->` footer.
 * If more than {@link config.freshnessThreshold} files in its directory have
 * changed since that SHA (excluding the AGENTS.md itself), the doc is stale
 * and must be re-reviewed and re-stamped.
 *
 * Checks the root AGENTS.md and the AGENTS.md in each
 * {@link config.agentsRequiredRoots}. Mirrors the shallow scope of
 * `check-presence.ts`.
 */
export function checkFreshness(
  repoRoot: string,
  opts: { verbose?: boolean } = {},
): CheckResult {
  const findings: Finding[] = [];

  const targets: Array<{ agentsAbs: string; relDir: string }> = [];

  const rootAgents = join(repoRoot, "AGENTS.md");
  if (existsSync(rootAgents)) {
    targets.push({ agentsAbs: rootAgents, relDir: "." });
  }

  for (const root of config.agentsRequiredRoots) {
    const absDir = join(repoRoot, root);
    const agentsAbs = join(absDir, "AGENTS.md");
    if (!existsSync(agentsAbs)) continue; // missing AGENTS.md is presence's job
    targets.push({ agentsAbs, relDir: root });
  }

  for (const t of targets) {
    checkOne(t.agentsAbs, t.relDir, repoRoot, opts, findings);
  }

  return { name: "freshness", findings };
}

function checkOne(
  agentsPath: string,
  relDir: string,
  repoRoot: string,
  opts: { verbose?: boolean },
  findings: Finding[],
): void {
  const content = readFileSync(agentsPath, "utf8");
  const sha = parseStamp(content);
  const relAgents = relative(repoRoot, agentsPath);

  if (!sha) {
    findings.push({
      severity: "error",
      code: "STAMP_MISSING",
      message: `AGENTS.md has no '<!-- last-reviewed: SHA -->' footer`,
      path: relAgents,
      fix: `Run: bun run agents:stamp ${relAgents}`,
    });
    return;
  }

  if (!shaExists(sha)) {
    findings.push({
      severity: "error",
      code: "STAMP_INVALID",
      message: `Stamp SHA '${sha}' is not reachable from HEAD`,
      path: relAgents,
      fix: `Re-stamp after reviewing: bun run agents:stamp ${relAgents}`,
    });
    return;
  }

  // Scope to the directory, non-recursive: chapter file churn under
  // public/data/chapters/<book>/ should not invalidate public/data/AGENTS.md;
  // src file churn shouldn't invalidate the root AGENTS.md.
  const changed = changedFilesIn(sha, relDir).filter(
    (p) => !p.endsWith("/AGENTS.md") && p !== "AGENTS.md",
  );

  if (changed.length > config.freshnessThreshold) {
    const detail = opts.verbose
      ? `\n        changed: ${changed.join(", ")}`
      : "";
    findings.push({
      severity: "error",
      code: "STAMP_STALE",
      message: `AGENTS.md is stale: ${changed.length} files changed in ${relDir}/ since ${sha} (threshold: ${config.freshnessThreshold})${detail}`,
      path: relAgents,
      fix: `Review the diff, update AGENTS.md if needed, then: bun run agents:stamp ${relAgents}`,
    });
  }
}
