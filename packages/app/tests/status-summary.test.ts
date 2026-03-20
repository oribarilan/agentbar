import { describe, expect, it } from "vitest";
import { buildStatusSummary } from "../src/lib/status-summary.js";
import type { AppInstanceRecord } from "../src/lib/instance-contract.js";

function makeRecord(
  overrides: Partial<AppInstanceRecord> = {},
): AppInstanceRecord {
  return {
    schemaVersion: 1,
    id: "inst-1",
    pid: 1_001,
    serverUrl: "http://127.0.0.1:4001",
    projectPath: "/Users/dev/project-a",
    projectName: "project-a",
    startedAt: "2026-03-20T09:00:00.000Z",
    lastActivityAt: "2026-03-20T10:00:00.000Z",
    statusHint: "idle",
    status: "idle",
    ...overrides,
  };
}

describe("buildStatusSummary", () => {
  it("returns empty summary for zero sessions", () => {
    const summary = buildStatusSummary([]);
    expect(summary.trayTitle).toBe("○ 0");
    expect(summary.trayTooltip).toContain("no active");
    expect(summary.aggregate.dominant).toBe("none");
  });

  it("returns waiting icon and count for waiting dominant state", () => {
    const summary = buildStatusSummary([
      makeRecord({ id: "a", statusHint: "working", status: "working" }),
      makeRecord({
        id: "b",
        statusHint: "waiting_for_input",
        status: "waiting",
      }),
    ]);

    expect(summary.trayTitle).toBe("⏳ 2");
    expect(summary.trayTooltip).toContain("1 working");
    expect(summary.trayTooltip).toContain("1 waiting");
  });

  it("prioritizes error icon when errors exist", () => {
    const summary = buildStatusSummary([
      makeRecord({ id: "a", statusHint: "working", status: "working" }),
      makeRecord({ id: "b", statusHint: "error", status: "error" }),
    ]);

    expect(summary.trayTitle).toBe("⚠ 2");
    expect(summary.aggregate.dominant).toBe("error");
  });
});
