import { describe, expect, it } from "vitest";
import { computeAggregateStatus } from "../src/lib/aggregate-status.js";
import { parseInstanceRecord } from "../src/lib/instance-contract.js";
import type { AppInstanceRecord } from "../src/lib/instance-contract.js";

function makeRecord(
  overrides: Partial<AppInstanceRecord> = {},
): AppInstanceRecord {
  return {
    schemaVersion: 1,
    id: "inst-test",
    pid: 101,
    serverUrl: "http://127.0.0.1:4000",
    projectPath: "/Users/dev/test",
    projectName: "test",
    startedAt: "2026-03-20T09:00:00.000Z",
    lastActivityAt: "2026-03-20T10:00:00.000Z",
    statusHint: "idle",
    status: "idle",
    ...overrides,
  };
}

describe("computeAggregateStatus", () => {
  it("returns none/no sessions for empty input", () => {
    const aggregate = computeAggregateStatus([]);
    expect(aggregate.dominant).toBe("none");
    expect(aggregate.trayText).toBe("No sessions");
    expect(aggregate.counts.working).toBe(0);
  });

  it("counts statuses correctly", () => {
    const aggregate = computeAggregateStatus([
      makeRecord({ id: "a", status: "working" }),
      makeRecord({ id: "b", status: "working" }),
      makeRecord({ id: "c", status: "waiting" }),
      makeRecord({ id: "d", status: "idle" }),
      makeRecord({ id: "e", status: "error" }),
    ]);

    expect(aggregate.counts).toEqual({
      working: 2,
      waiting: 1,
      idle: 1,
      error: 1,
      disconnected: 0,
    });
  });

  it("uses urgency order for dominant status", () => {
    expect(
      computeAggregateStatus([
        makeRecord({ status: "idle" }),
        makeRecord({ status: "disconnected" }),
      ]).dominant,
    ).toBe("disconnected");

    expect(
      computeAggregateStatus([
        makeRecord({ status: "working" }),
        makeRecord({ status: "disconnected" }),
      ]).dominant,
    ).toBe("working");

    expect(
      computeAggregateStatus([
        makeRecord({ status: "waiting" }),
        makeRecord({ status: "working" }),
      ]).dominant,
    ).toBe("waiting");

    expect(
      computeAggregateStatus([
        makeRecord({ status: "error" }),
        makeRecord({ status: "waiting" }),
      ]).dominant,
    ).toBe("error");
  });

  it("formats tray text with only non-zero parts", () => {
    const aggregate = computeAggregateStatus([
      makeRecord({ status: "working" }),
      makeRecord({ status: "idle" }),
      makeRecord({ status: "idle" }),
    ]);

    expect(aggregate.trayText).toContain("1 working");
    expect(aggregate.trayText).toContain("2 idle");
    expect(aggregate.trayText).not.toContain("error");
  });
});

describe("parseInstanceRecord", () => {
  it("accepts plugin-shaped payload and maps waiting_for_input -> waiting", () => {
    const parsed = parseInstanceRecord({
      schemaVersion: 1,
      id: "inst-1",
      pid: 123,
      serverUrl: "http://127.0.0.1:4000",
      projectPath: "/Users/dev/project",
      projectName: "project",
      startedAt: "2026-03-20T09:00:00.000Z",
      lastActivityAt: "2026-03-20T10:00:00.000Z",
      statusHint: "waiting_for_input",
      unknownFutureField: "ok",
    });

    expect(parsed.ok).toBe(true);
    if (parsed.ok) {
      expect(parsed.record.status).toBe("waiting");
      expect(parsed.record.projectName).toBe("project");
    }
  });

  it("rejects malformed payload", () => {
    const parsed = parseInstanceRecord({ schemaVersion: 1, id: "" });
    expect(parsed.ok).toBe(false);
  });
});
