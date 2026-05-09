export type Severity = "error" | "warn";

export type Finding = {
  severity: Severity;
  /** Stable machine-readable code, e.g. "AGENTS_MISSING". */
  code: string;
  /** Human-readable message. */
  message: string;
  /** File or directory path the finding relates to. */
  path?: string;
  /** Optional fix hint. */
  fix?: string;
};

export type CheckResult = {
  name: string;
  findings: Finding[];
};

export function ok(name: string): CheckResult {
  return { name, findings: [] };
}
