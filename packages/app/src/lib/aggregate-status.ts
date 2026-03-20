import type {
  AppInstanceRecord,
  AppInstanceStatus,
} from "./instance-contract.js";

export interface StatusCounts {
  working: number;
  idle: number;
  waiting: number;
  error: number;
  disconnected: number;
}

export interface AggregateStatus {
  counts: StatusCounts;
  dominant: AppInstanceStatus | "none";
  trayText: string;
}

function zeroCounts(): StatusCounts {
  return {
    working: 0,
    idle: 0,
    waiting: 0,
    error: 0,
    disconnected: 0,
  };
}

export function computeAggregateStatus(
  instances: AppInstanceRecord[],
): AggregateStatus {
  const counts = zeroCounts();

  for (const instance of instances) {
    counts[instance.status] += 1;
  }

  return {
    counts,
    dominant: deriveDominant(counts, instances.length),
    trayText: buildTrayText(counts, instances.length),
  };
}

function deriveDominant(
  counts: StatusCounts,
  total: number,
): AggregateStatus["dominant"] {
  if (total === 0) return "none";
  if (counts.error > 0) return "error";
  if (counts.waiting > 0) return "waiting";
  if (counts.working > 0) return "working";
  if (counts.disconnected > 0) return "disconnected";
  return "idle";
}

function buildTrayText(counts: StatusCounts, total: number): string {
  if (total === 0) return "No sessions";

  const parts: string[] = [];
  if (counts.working > 0) parts.push(`${counts.working} working`);
  if (counts.waiting > 0) parts.push(`${counts.waiting} waiting`);
  if (counts.error > 0) parts.push(`${counts.error} error`);
  if (counts.idle > 0) parts.push(`${counts.idle} idle`);
  if (counts.disconnected > 0)
    parts.push(`${counts.disconnected} disconnected`);

  return parts.join(" · ");
}
