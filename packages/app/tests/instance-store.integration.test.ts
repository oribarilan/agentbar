import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { PresenceRegistry } from "@agentbar/plugin";
import { createAgentbarInstanceStore } from "../src/lib/instance-store.js";
import { discoverInstancesFromDir } from "../src/lib/discovery.js";

function makeTempDir(): string {
  return fs.mkdtempSync(path.join(os.tmpdir(), "agentbar-app-test-"));
}

describe("instance discovery integration", () => {
  it("discovers plugin-written records and computes aggregate", () => {
    const tempDir = makeTempDir();
    try {
      const registry = new PresenceRegistry({
        instancesDir: tempDir,
        isPidAlive: () => true,
      });
      const store = createAgentbarInstanceStore();

      const a = registry.registerInstance({
        id: "inst-a",
        pid: 1001,
        serverUrl: "http://127.0.0.1:4101",
        projectPath: "/Users/dev/a",
        projectName: "a",
      });
      registry.updateInstanceActivity(a.id, { statusHint: "working" });

      const b = registry.registerInstance({
        id: "inst-b",
        pid: 1002,
        serverUrl: "http://127.0.0.1:4102",
        projectPath: "/Users/dev/b",
        projectName: "b",
      });
      registry.updateInstanceActivity(b.id, {
        statusHint: "waiting_for_input",
      });

      const result = discoverInstancesFromDir(tempDir);
      store.reconcile(result.records);

      expect(result.errors).toHaveLength(0);
      expect(result.records).toHaveLength(2);
      expect(store.getInstances().size).toBe(2);
      expect(store.getAggregate().counts.working).toBe(1);
      expect(store.getAggregate().counts.waiting).toBe(1);
      expect(store.getAggregate().dominant).toBe("waiting");
    } finally {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });

  it("isolates malformed files without crashing valid discovery", () => {
    const tempDir = makeTempDir();
    try {
      const registry = new PresenceRegistry({
        instancesDir: tempDir,
        isPidAlive: () => true,
      });
      registry.registerInstance({
        id: "inst-good",
        pid: 2001,
        serverUrl: "http://127.0.0.1:4201",
        projectPath: "/Users/dev/good",
        projectName: "good",
      });

      fs.writeFileSync(path.join(tempDir, "broken.json"), "{not-json", "utf8");

      const result = discoverInstancesFromDir(tempDir);
      expect(result.records).toHaveLength(1);
      expect(result.records[0]?.id).toBe("inst-good");
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0]).toContain("broken.json");
    } finally {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });

  it("reflects instance removal on re-scan", () => {
    const tempDir = makeTempDir();
    try {
      const registry = new PresenceRegistry({
        instancesDir: tempDir,
        isPidAlive: () => true,
      });
      const store = createAgentbarInstanceStore();

      registry.registerInstance({
        id: "inst-a",
        pid: 3001,
        serverUrl: "http://127.0.0.1:4301",
        projectPath: "/Users/dev/a",
        projectName: "a",
      });
      registry.registerInstance({
        id: "inst-b",
        pid: 3002,
        serverUrl: "http://127.0.0.1:4302",
        projectPath: "/Users/dev/b",
        projectName: "b",
      });

      store.reconcile(discoverInstancesFromDir(tempDir).records);
      expect(store.getInstances().size).toBe(2);

      registry.cleanupInstance("inst-b");
      store.reconcile(discoverInstancesFromDir(tempDir).records);
      expect(store.getInstances().size).toBe(1);
      expect(store.getInstances().has("inst-a")).toBe(true);
      expect(store.getInstances().has("inst-b")).toBe(false);
    } finally {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });
});
