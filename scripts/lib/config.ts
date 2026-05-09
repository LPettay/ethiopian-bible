/**
 * Enforcement configuration. Tweak with care — these values shape the
 * friction surface of the project.
 */

export const config = {
  /**
   * Directories that must contain an AGENTS.md.
   * Matches the crawl map in the root AGENTS.md.
   *
   * This is a *shallow* list: `check-presence` requires AGENTS.md in
   * exactly these directories, not in their nested subdirectories.
   * In particular, `public/data/` has a single AGENTS.md covering the
   * whole frozen data tree; nested `public/data/chapters/<book>/` dirs
   * are pure data and intentionally do not carry their own AGENTS.md.
   */
  agentsRequiredRoots: [
    "src",
    "src/components",
    "src/lib",
    "src/pages",
    "tests",
    "public/data",
  ] as const,

  /** Subpaths to skip entirely when walking. */
  ignoreDirs: new Set([
    "node_modules",
    "dist",
    "build",
    ".git",
    "coverage",
    ".vite",
  ]),

  /** Files that should never be committed at the repo root. */
  forbiddenFiles: [
    "package-lock.json",
    "yarn.lock",
    "pnpm-lock.yaml",
    ".env",
    ".env.local",
    ".env.production",
  ] as const,

  /**
   * Freshness threshold: an AGENTS.md is "stale" when more than this many
   * non-AGENTS files in its directory have changed since its last-reviewed
   * stamp.
   */
  freshnessThreshold: 5,

  /** Footer marker used by stamp.ts. */
  stampPrefix: "<!-- last-reviewed:",
  stampSuffix: "-->",
} as const;

export function formatStamp(sha: string): string {
  return `${config.stampPrefix} ${sha} ${config.stampSuffix}`;
}

export function parseStamp(content: string): string | null {
  const re = new RegExp(
    `${escapeRe(config.stampPrefix)}\\s*([0-9a-f]{7,40})\\s*${escapeRe(config.stampSuffix)}`,
    "i",
  );
  const match = re.exec(content);
  return match?.[1] ?? null;
}

function escapeRe(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
