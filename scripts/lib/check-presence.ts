import { existsSync } from "node:fs";
import { join, relative } from "node:path";
import { config } from "./config.ts";
import type { CheckResult, Finding } from "./types.ts";

/**
 * Layer 2a — every directory listed in {@link config.agentsRequiredRoots}
 * must carry its own AGENTS.md.
 *
 * Note: this is a *shallow* check by design. The Bible repo's M1 boundary
 * places one AGENTS.md per architectural concern, not one per nested folder.
 * In particular, `public/data/` has a single AGENTS.md covering the entire
 * frozen data tree; the nested per-book chapter directories under
 * `public/data/chapters/<book>/` are pure data and intentionally do not
 * carry their own AGENTS.md.
 *
 * If a future milestone wants per-subdir enforcement (e.g. `src/components/`
 * grows feature folders), add a second list to `config.ts` and a second
 * walking pass here.
 */
export function checkPresence(repoRoot: string): CheckResult {
  const findings: Finding[] = [];

  for (const root of config.agentsRequiredRoots) {
    const absDir = join(repoRoot, root);
    if (!existsSync(absDir)) {
      findings.push({
        severity: "error",
        code: "REQUIRED_ROOT_MISSING",
        message: `Required root '${root}' does not exist`,
        path: root,
        fix: `Either create ${root}/ with an AGENTS.md, or remove ${root} from config.agentsRequiredRoots.`,
      });
      continue;
    }

    const agentsPath = join(absDir, "AGENTS.md");
    if (!existsSync(agentsPath)) {
      findings.push({
        severity: "error",
        code: "AGENTS_MISSING",
        message: `Required directory has no AGENTS.md`,
        path: root,
        fix: `Create ${relative(repoRoot, agentsPath)} describing the directory's purpose, conventions, and what does/doesn't belong here.`,
      });
    }
  }

  return { name: "presence", findings };
}
