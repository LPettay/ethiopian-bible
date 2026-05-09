import { spawnSync } from "node:child_process";

/** Returns the current HEAD SHA (short, 7 chars). */
export function headSha(): string {
  const out = run("git", ["rev-parse", "--short=7", "HEAD"]);
  return out.trim();
}

/** Returns true if the given SHA is reachable from HEAD. */
export function shaExists(sha: string): boolean {
  const r = spawnSync("git", ["cat-file", "-e", `${sha}^{commit}`], {
    encoding: "utf8",
  });
  return r.status === 0;
}

/**
 * Returns the list of file paths (relative to repo root) that have changed
 * between `sinceSha` and HEAD, scoped to the given directory (non-recursive
 * by default; pass `recursive: true` to include nested subdirs).
 *
 * `dir === "."` means "repo root, top level only" — paths with no '/' separator.
 */
export function changedFilesIn(
  sinceSha: string,
  dir: string,
  opts: { recursive?: boolean } = {},
): string[] {
  const recursive = opts.recursive ?? false;
  const range = `${sinceSha}..HEAD`;
  const out = run("git", [
    "diff",
    "--name-only",
    range,
    "--",
    dir,
  ]);
  const all = out.split("\n").filter(Boolean);

  if (recursive) return all;

  if (dir === "." || dir === "") {
    return all.filter((p) => !p.includes("/"));
  }

  const prefix = dir.endsWith("/") ? dir : dir + "/";
  return all.filter((p) => {
    if (!p.startsWith(prefix)) return false;
    const rest = p.slice(prefix.length);
    return !rest.includes("/");
  });
}

function run(cmd: string, args: string[]): string {
  const r = spawnSync(cmd, args, { encoding: "utf8" });
  if (r.status !== 0) {
    throw new Error(
      `${cmd} ${args.join(" ")} failed (exit ${r.status}): ${r.stderr}`,
    );
  }
  return r.stdout;
}
