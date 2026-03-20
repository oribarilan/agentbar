import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  isValidInstanceRecord,
  SCHEMA_VERSION,
} from "../src/instance-record.js";
import { PresenceRegistry } from "../src/presence-registry.js";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeTempDir(): string {
  return fs.mkdtempSync(path.join(os.tmpdir(), "agentbar-test-"));
}

function makeRegistry(
  dir: string,
  isPidAlive?: (pid: number) => boolean,
): PresenceRegistry {
  return new PresenceRegistry({
    instancesDir: dir,
    isPidAlive: isPidAlive ?? (() => true),
  });
}

const BASE_INPUT = {
  id: "test-instance-1",
  pid: 12345,
  serverUrl: "http://localhost:4000",
  projectPath: "/home/user/my-project",
  projectName: "my-project",
} as const;

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("isValidInstanceRecord", () => {
  it("returns true for a fully valid record", () => {
    const record = {
      schemaVersion: SCHEMA_VERSION,
      id: "abc",
      pid: 999,
      serverUrl: "http://localhost:3000",
      projectPath: "/foo/bar",
      projectName: "bar",
      startedAt: "2026-01-01T00:00:00.000Z",
      lastActivityAt: "2026-01-01T00:01:00.000Z",
      statusHint: "idle",
    };
    expect(isValidInstanceRecord(record)).toBe(true);
  });

  it("returns true when extra unknown fields are present", () => {
    const record = {
      schemaVersion: SCHEMA_VERSION,
      id: "abc",
      pid: 1,
      serverUrl: "http://x",
      projectPath: "/p",
      projectName: "p",
      startedAt: "2026-01-01T00:00:00.000Z",
      lastActivityAt: "2026-01-01T00:00:00.000Z",
      statusHint: "working",
      futureField: "tolerated",
    };
    expect(isValidInstanceRecord(record)).toBe(true);
  });

  it("returns false for null", () => {
    expect(isValidInstanceRecord(null)).toBe(false);
  });

  it("returns false when schemaVersion is wrong", () => {
    const record = {
      schemaVersion: 99,
      id: "abc",
      pid: 1,
      serverUrl: "http://x",
      projectPath: "/p",
      projectName: "p",
      startedAt: "t",
      lastActivityAt: "t",
      statusHint: "idle",
    };
    expect(isValidInstanceRecord(record)).toBe(false);
  });

  it("returns false when pid is not a positive integer", () => {
    const record = {
      schemaVersion: SCHEMA_VERSION,
      id: "abc",
      pid: -1,
      serverUrl: "http://x",
      projectPath: "/p",
      projectName: "p",
      startedAt: "t",
      lastActivityAt: "t",
      statusHint: "idle",
    };
    expect(isValidInstanceRecord(record)).toBe(false);
  });

  it("returns false when a required string field is missing", () => {
    const record = {
      schemaVersion: SCHEMA_VERSION,
      id: "abc",
      pid: 1,
      // serverUrl missing
      projectPath: "/p",
      projectName: "p",
      startedAt: "t",
      lastActivityAt: "t",
      statusHint: "idle",
    };
    expect(isValidInstanceRecord(record)).toBe(false);
  });
});

describe("PresenceRegistry.registerInstance", () => {
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = makeTempDir();
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it("writes a file at <dir>/<id>.json", () => {
    const registry = makeRegistry(tmpDir);
    registry.registerInstance(BASE_INPUT);
    expect(fs.existsSync(path.join(tmpDir, "test-instance-1.json"))).toBe(true);
  });

  it("written file is valid JSON with all required fields", () => {
    const registry = makeRegistry(tmpDir);
    registry.registerInstance(BASE_INPUT);
    const raw = fs.readFileSync(
      path.join(tmpDir, "test-instance-1.json"),
      "utf8",
    );
    const parsed: unknown = JSON.parse(raw);
    expect(isValidInstanceRecord(parsed)).toBe(true);
  });

  it("returns the written record", () => {
    const registry = makeRegistry(tmpDir);
    const record = registry.registerInstance(BASE_INPUT);
    expect(record.id).toBe(BASE_INPUT.id);
    expect(record.pid).toBe(BASE_INPUT.pid);
    expect(record.serverUrl).toBe(BASE_INPUT.serverUrl);
    expect(record.projectPath).toBe(BASE_INPUT.projectPath);
    expect(record.projectName).toBe(BASE_INPUT.projectName);
    expect(record.schemaVersion).toBe(SCHEMA_VERSION);
    expect(record.statusHint).toBe("idle");
  });

  it("sets startedAt and lastActivityAt to the same deterministic timestamp", () => {
    const fakeNow = "2026-03-20T10:00:00.000Z";
    vi.useFakeTimers();
    vi.setSystemTime(new Date(fakeNow));

    const registry = makeRegistry(tmpDir);
    const record = registry.registerInstance(BASE_INPUT);

    expect(record.startedAt).toBe(fakeNow);
    expect(record.lastActivityAt).toBe(fakeNow);

    vi.useRealTimers();
  });

  it("creates the instances directory if it does not exist", () => {
    const nested = path.join(tmpDir, "deep", "nested", "dir");
    const registry = makeRegistry(nested);
    registry.registerInstance(BASE_INPUT);
    expect(fs.existsSync(path.join(nested, "test-instance-1.json"))).toBe(true);
  });

  it("leaves no .tmp file after successful write", () => {
    const registry = makeRegistry(tmpDir);
    registry.registerInstance(BASE_INPUT);
    const files = fs.readdirSync(tmpDir);
    expect(files.every((f) => !f.endsWith(".tmp"))).toBe(true);
  });
});

describe("PresenceRegistry.updateInstanceActivity", () => {
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = makeTempDir();
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it("updates lastActivityAt and statusHint", () => {
    const registry = makeRegistry(tmpDir);
    registry.registerInstance(BASE_INPUT);

    const newTime = "2026-03-20T11:00:00.000Z";
    const updated = registry.updateInstanceActivity(BASE_INPUT.id, {
      lastActivityAt: newTime,
      statusHint: "working",
    });

    expect(updated).not.toBeNull();
    expect(updated!.lastActivityAt).toBe(newTime);
    expect(updated!.statusHint).toBe("working");
  });

  it("preserves fields not in the patch", () => {
    const registry = makeRegistry(tmpDir);
    const original = registry.registerInstance(BASE_INPUT);

    const updated = registry.updateInstanceActivity(BASE_INPUT.id, {
      statusHint: "waiting_for_input",
    });

    expect(updated!.startedAt).toBe(original.startedAt);
    expect(updated!.pid).toBe(original.pid);
    expect(updated!.serverUrl).toBe(original.serverUrl);
  });

  it("persists the patch so listInstances returns updated values", () => {
    const registry = makeRegistry(tmpDir);
    registry.registerInstance(BASE_INPUT);
    registry.updateInstanceActivity(BASE_INPUT.id, { statusHint: "error" });

    const list = registry.listInstances();
    expect(list).toHaveLength(1);
    expect(list[0]!.statusHint).toBe("error");
  });

  it("returns null when instance does not exist", () => {
    const registry = makeRegistry(tmpDir);
    const result = registry.updateInstanceActivity("nonexistent", {
      statusHint: "idle",
    });
    expect(result).toBeNull();
  });
});

describe("PresenceRegistry.cleanupInstance", () => {
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = makeTempDir();
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it("removes the instance file", () => {
    const registry = makeRegistry(tmpDir);
    registry.registerInstance(BASE_INPUT);
    registry.cleanupInstance(BASE_INPUT.id);
    expect(fs.existsSync(path.join(tmpDir, "test-instance-1.json"))).toBe(
      false,
    );
  });

  it("does not throw when file does not exist", () => {
    const registry = makeRegistry(tmpDir);
    expect(() => registry.cleanupInstance("nonexistent")).not.toThrow();
  });

  it("instance no longer appears in listInstances", () => {
    const registry = makeRegistry(tmpDir);
    registry.registerInstance(BASE_INPUT);
    registry.cleanupInstance(BASE_INPUT.id);
    expect(registry.listInstances()).toHaveLength(0);
  });
});

describe("PresenceRegistry.cleanupStaleInstances", () => {
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = makeTempDir();
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it("removes records whose PIDs are dead", () => {
    const registry = makeRegistry(tmpDir);
    registry.registerInstance({ ...BASE_INPUT, id: "dead-1", pid: 11111 });
    registry.registerInstance({ ...BASE_INPUT, id: "dead-2", pid: 22222 });

    const removed = registry.cleanupStaleInstances(() => false);
    expect(removed.sort()).toEqual(["dead-1", "dead-2"].sort());
    expect(registry.listInstances()).toHaveLength(0);
  });

  it("preserves records whose PIDs are alive", () => {
    const registry = makeRegistry(tmpDir);
    registry.registerInstance({ ...BASE_INPUT, id: "alive-1", pid: 99991 });
    registry.registerInstance({ ...BASE_INPUT, id: "alive-2", pid: 99992 });

    const removed = registry.cleanupStaleInstances(() => true);
    expect(removed).toHaveLength(0);
    expect(registry.listInstances()).toHaveLength(2);
  });

  it("removes dead and keeps alive in a mixed set", () => {
    const registry = makeRegistry(tmpDir);
    registry.registerInstance({ ...BASE_INPUT, id: "alive", pid: 1 });
    registry.registerInstance({ ...BASE_INPUT, id: "dead", pid: 2 });

    const removed = registry.cleanupStaleInstances((pid) => pid === 1);
    expect(removed).toEqual(["dead"]);
    const remaining = registry.listInstances();
    expect(remaining).toHaveLength(1);
    expect(remaining[0]!.id).toBe("alive");
  });

  it("removes invalid/corrupt files", () => {
    const registry = makeRegistry(tmpDir);
    // Write a corrupt JSON file manually
    fs.mkdirSync(tmpDir, { recursive: true });
    fs.writeFileSync(
      path.join(tmpDir, "corrupt.json"),
      "not-valid-json",
      "utf8",
    );

    const removed = registry.cleanupStaleInstances(() => true);
    expect(removed).toContain("corrupt");
    expect(fs.existsSync(path.join(tmpDir, "corrupt.json"))).toBe(false);
  });

  it("returns empty array when directory does not exist", () => {
    const missing = path.join(tmpDir, "does-not-exist");
    const registry = makeRegistry(missing);
    expect(registry.cleanupStaleInstances(() => false)).toEqual([]);
  });
});

describe("PresenceRegistry.listInstances", () => {
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = makeTempDir();
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it("returns empty array when directory does not exist", () => {
    const registry = makeRegistry(path.join(tmpDir, "nonexistent"));
    expect(registry.listInstances()).toEqual([]);
  });

  it("returns all valid instances", () => {
    const registry = makeRegistry(tmpDir);
    registry.registerInstance({ ...BASE_INPUT, id: "inst-a" });
    registry.registerInstance({ ...BASE_INPUT, id: "inst-b" });
    registry.registerInstance({ ...BASE_INPUT, id: "inst-c" });

    const list = registry.listInstances();
    expect(list).toHaveLength(3);
    const ids = list.map((r) => r.id).sort();
    expect(ids).toEqual(["inst-a", "inst-b", "inst-c"]);
  });

  it("skips invalid files without throwing", () => {
    const registry = makeRegistry(tmpDir);
    registry.registerInstance(BASE_INPUT);
    // Inject a corrupt file alongside a valid one
    fs.writeFileSync(path.join(tmpDir, "bad.json"), "{}", "utf8");

    const list = registry.listInstances();
    expect(list).toHaveLength(1);
    expect(list[0]!.id).toBe(BASE_INPUT.id);
  });

  it("ignores .tmp files", () => {
    const registry = makeRegistry(tmpDir);
    registry.registerInstance(BASE_INPUT);
    // Simulate a leftover tmp file
    fs.writeFileSync(
      path.join(tmpDir, "test-instance-1.json.tmp"),
      "{}",
      "utf8",
    );

    const list = registry.listInstances();
    expect(list).toHaveLength(1);
  });
});
