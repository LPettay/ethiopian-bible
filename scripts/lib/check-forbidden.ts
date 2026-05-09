import { existsSync } from "node:fs";
import { join } from "node:path";
import { config } from "./config.ts";
import type { CheckResult, Finding } from "./types.ts";

/**
 * Layer 2c — forbidden artifacts must not exist at the repo root.
 *
 * These are typically lockfiles from the wrong package manager or stray
 * `.env` files that shouldn't be committed.
 */
export function checkForbidden(repoRoot: string): CheckResult {
  const findings: Finding[] = [];

  for (const file of config.forbiddenFiles) {
    const abs = join(repoRoot, file);
    if (existsSync(abs)) {
      findings.push({
        severity: "error",
        code: "FORBIDDEN_FILE",
        message: `Forbidden file present at repo root`,
        path: file,
        fix: fixHint(file),
      });
    }
  }

  return { name: "forbidden", findings };
}

function fixHint(file: string): string {
  if (
    file === "package-lock.json" ||
    file === "yarn.lock" ||
    file === "pnpm-lock.yaml"
  ) {
    return `Use bun. Delete ${file} and run 'bun install' to regenerate bun.lock. See ADR-0008.`;
  }
  if (file.startsWith(".env")) {
    return `Move secrets to a gitignored file. Document the keys in .env.example if needed.`;
  }
  return `Remove ${file} from the repo root.`;
}
