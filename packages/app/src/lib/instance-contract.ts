import {
  SCHEMA_VERSION,
  isValidInstanceRecord,
  type InstanceRecord,
  type StatusHint,
} from "@agentbar/plugin/instance-record";

export type AppInstanceStatus =
  | "working"
  | "idle"
  | "waiting"
  | "error"
  | "disconnected";

export interface AppInstanceRecord {
  schemaVersion: typeof SCHEMA_VERSION;
  id: string;
  pid: number;
  serverUrl: string;
  projectPath: string;
  projectName: string;
  startedAt: string;
  lastActivityAt: string;
  statusHint: StatusHint;
  status: AppInstanceStatus;
}

export type ParseResult =
  | { ok: true; record: AppInstanceRecord }
  | { ok: false; raw: unknown; error: string };

function mapStatusHint(statusHint: StatusHint): AppInstanceStatus {
  switch (statusHint) {
    case "working":
      return "working";
    case "idle":
      return "idle";
    case "error":
      return "error";
    case "waiting_for_input":
      return "waiting";
    case "unknown":
      return "disconnected";
  }
}

function toAppRecord(record: InstanceRecord): AppInstanceRecord {
  return {
    ...record,
    status: mapStatusHint(record.statusHint),
  };
}

export function parseInstanceRecord(raw: unknown): ParseResult {
  if (!isValidInstanceRecord(raw)) {
    return { ok: false, raw, error: "Invalid instance record payload" };
  }

  return { ok: true, record: toAppRecord(raw) };
}

export function parseInstanceJson(jsonText: string): ParseResult {
  let parsed: unknown;
  try {
    parsed = JSON.parse(jsonText);
  } catch (error) {
    return {
      ok: false,
      raw: jsonText,
      error: `JSON parse error: ${(error as Error).message}`,
    };
  }

  return parseInstanceRecord(parsed);
}
