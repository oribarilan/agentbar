import type { AppInstanceRecord } from "./instance-contract.js";
import {
  computeAggregateStatus,
  type AggregateStatus,
} from "./aggregate-status.js";

export interface StatusSummary {
  aggregate: AggregateStatus;
  trayTitle: string;
  trayTooltip: string;
}

export function buildStatusSummary(
  records: AppInstanceRecord[],
): StatusSummary {
  const aggregate = computeAggregateStatus(records);
  const active = records.length;

  const dominantIcon = iconForStatus(aggregate.dominant);
  const trayTitle = active === 0 ? "○ 0" : `${dominantIcon} ${active}`;

  const trayTooltip =
    active === 0
      ? "Agentbar: no active OpenCode sessions"
      : `Agentbar: ${aggregate.trayText}`;

  return {
    aggregate,
    trayTitle,
    trayTooltip,
  };
}

function iconForStatus(status: AggregateStatus["dominant"]): string {
  switch (status) {
    case "working":
      return "⚙";
    case "waiting":
      return "⏳";
    case "error":
      return "⚠";
    case "disconnected":
      return "🔌";
    case "idle":
      return "●";
    case "none":
      return "○";
  }
}
