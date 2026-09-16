import { readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { config } from "./config.ts";

export type DirEntry = {
  /** Absolute path to the directory. */
  abs: string;
  /** Path relative to repo root. */
  rel: string;
  /** Filenames (not paths) directly in this directory. */
  files: string[];
  /** Subdirectory names (not paths) directly in this directory. */
  subdirs: string[];
};

/**
 * Walk a directory tree, yielding one entry per directory.
 * Skips anything in {@link config.ignoreDirs}.
 */
export function* walkDirs(root: string, repoRoot: string): Generator<DirEntry> {
  const stack: string[] = [root];

  while (stack.length > 0) {
    const dir = stack.pop()!;
    const names = readdirSync(dir);
    const files: string[] = [];
    const subdirs: string[] = [];

    for (const name of names) {
      if (config.ignoreDirs.has(name)) continue;
      const full = join(dir, name);
      const stat = statSync(full);
      if (stat.isDirectory()) {
        subdirs.push(name);
        stack.push(full);
      } else if (stat.isFile()) {
        files.push(name);
      }
    }

    yield {
      abs: dir,
      rel: relative(repoRoot, dir) || ".",
      files,
      subdirs,
    };
  }
}

/** Returns true if the dir contains at least one tracked file (not just subdirs). */
export function dirHasFiles(entry: DirEntry): boolean {
  return entry.files.length > 0;
}
