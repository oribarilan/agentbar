/**
 * Instance record contract for Agentbar plugin presence registration.
 *
 * Schema version 1. All fields required unless noted.
 * Unknown extra fields MUST be tolerated by readers (additive-only changes).
 */

export const SCHEMA_VERSION = 1 as const;

export type StatusHint =
  | "idle"
  | "working"
  | "waiting_for_input"
  | "error"
  | "unknown";

/** Canonical shape written to <id>.json on disk. */
export interface InstanceRecord {
  /** Increment when breaking changes are made. Currently 1. */
  schemaVersion: typeof SCHEMA_VERSION;
  /** Stable unique identifier for this plugin session (UUID v4 recommended). */
  id: string;
  /** OS process ID of the OpenCode process. */
  pid: number;
  /** Base URL of the OpenCode HTTP/SSE server for this session. */
  serverUrl: string;
  /** Absolute path to the project root directory. */
  projectPath: string;
  /** Human-readable project name (basename of projectPath by default). */
  projectName: string;
  /** ISO-8601 timestamp of when this instance was registered. */
  startedAt: string;
  /** ISO-8601 timestamp of the most recent activity event. */
  lastActivityAt: string;
  /** Latest derived status hint. */
  statusHint: StatusHint;
}

/** Minimal fields required when registering a new instance. */
export type RegisterInput = Omit<
  InstanceRecord,
  "schemaVersion" | "startedAt" | "lastActivityAt" | "statusHint"
>;

/** Fields that can be patched via updateInstanceActivity. */
export type ActivityPatch = Partial<
  Pick<InstanceRecord, "lastActivityAt" | "statusHint">
>;

/** Type-guard: checks all required fields are present and correctly typed. */
export function isValidInstanceRecord(value: unknown): value is InstanceRecord {
  if (typeof value !== "object" || value === null) return false;
  const r = value as Record<string, unknown>;
  return (
    r["schemaVersion"] === SCHEMA_VERSION &&
    typeof r["id"] === "string" &&
    r["id"].length > 0 &&
    typeof r["pid"] === "number" &&
    Number.isInteger(r["pid"]) &&
    r["pid"] > 0 &&
    typeof r["serverUrl"] === "string" &&
    r["serverUrl"].length > 0 &&
    typeof r["projectPath"] === "string" &&
    r["projectPath"].length > 0 &&
    typeof r["projectName"] === "string" &&
    r["projectName"].length > 0 &&
    typeof r["startedAt"] === "string" &&
    r["startedAt"].length > 0 &&
    typeof r["lastActivityAt"] === "string" &&
    r["lastActivityAt"].length > 0 &&
    typeof r["statusHint"] === "string" &&
    r["statusHint"].length > 0
  );
}
