#!/usr/bin/env bun
/**
 * Stamp an AGENTS.md (or all of them) with the current HEAD SHA, marking it
 * as "reviewed at this commit." Use after manually reviewing the diff and
 * confirming the AGENTS.md still accurately describes its directory.
 *
 * Usage:
 *   bun run agents:stamp src/AGENTS.md
 *   bun run scripts/stamp.ts --all
 *   bun run scripts/stamp.ts --all --sha=<sha>   # override the SHA used
 */

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join, relative, resolve } from "node:path";
import { config, formatStamp, parseStamp } from "./lib/config.ts";
import { headSha } from "./lib/git.ts";

function main(): void {
  const args = process.argv.slice(2);
  const repoRoot = resolve(import.meta.dir, "..");

  const shaArg = args.find((a) => a.startsWith("--sha="));
  const sha = shaArg ? shaArg.slice("--sha=".length) : headSha();

  const all = args.includes("--all");
  const targets = all
    ? findAllAgentsMd(repoRoot)
    : args.filter((a) => !a.startsWith("--"));

  if (targets.length === 0) {
    console.error("no targets. Pass a path to an AGENTS.md or --all.");
    process.exit(2);
  }

  let updated = 0;
  let unchanged = 0;
  let missing = 0;

  for (const t of targets) {
    const abs = resolve(repoRoot, t);
    if (!existsSync(abs)) {
      console.error(`  missing: ${relative(repoRoot, abs)}`);
      missing++;
      continue;
    }
    const result = stampOne(abs, sha);
    const rel = relative(repoRoot, abs);
    if (result === "updated") {
      console.log(`  stamped: ${rel} -> ${sha}`);
      updated++;
    } else {
      console.log(`  current: ${rel} (already ${sha})`);
      unchanged++;
    }
  }

  console.log("");
  console.log(`${updated} stamped, ${unchanged} already current, ${missing} missing.`);
  process.exit(missing > 0 ? 1 : 0);
}

function findAllAgentsMd(repoRoot: string): string[] {
  const found: string[] = [];
  const rootAgents = join(repoRoot, "AGENTS.md");
  if (existsSync(rootAgents)) found.push(rootAgents);

  for (const root of config.agentsRequiredRoots) {
    const agentsAbs = join(repoRoot, root, "AGENTS.md");
    if (existsSync(agentsAbs)) found.push(agentsAbs);
  }
  return found;
}

type StampResult = "updated" | "unchanged";

function stampOne(absPath: string, sha: string): StampResult {
  const content = readFileSync(absPath, "utf8");
  const existing = parseStamp(content);
  if (existing === sha) return "unchanged";

  const newStamp = formatStamp(sha);
  let next: string;

  if (existing) {
    const re = new RegExp(
      `${escapeRe(config.stampPrefix)}\\s*[0-9a-f]{7,40}\\s*${escapeRe(config.stampSuffix)}`,
      "i",
    );
    next = content.replace(re, newStamp);
  } else {
    const trimmed = content.replace(/\s+$/, "");
    next = `${trimmed}\n\n---\n\n${newStamp}\n`;
  }

  writeFileSync(absPath, next, "utf8");
  return "updated";
}

function escapeRe(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

main();
