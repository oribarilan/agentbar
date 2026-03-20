import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import {
  type ActivityPatch,
  type InstanceRecord,
  type RegisterInput,
  SCHEMA_VERSION,
  isValidInstanceRecord,
} from "./instance-record.js";

/** Default directory where instance files are stored. */
const DEFAULT_INSTANCES_DIR = path.join(
  os.homedir(),
  ".local",
  "share",
  "agentbar",
  "instances",
);

export interface PresenceRegistryOptions {
  /**
   * Override the directory used to store instance files.
   * Primarily useful for tests.
   */
  instancesDir?: string;
  /**
   * Override the function used to check if a PID is alive.
   * Receives a pid and returns true if the process is running.
   * Defaults to sending signal 0 via process.kill.
   */
  isPidAlive?: (pid: number) => boolean;
}

function defaultIsPidAlive(pid: number): boolean {
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}

/**
 * Manages per-instance JSON presence files for Agentbar discovery.
 *
 * File layout: <instancesDir>/<id>.json
 * Writes are atomic: write to <id>.json.tmp then rename.
 */
export class PresenceRegistry {
  private readonly dir: string;
  private readonly isPidAlive: (pid: number) => boolean;

  constructor(options: PresenceRegistryOptions = {}) {
    this.dir = options.instancesDir ?? DEFAULT_INSTANCES_DIR;
    this.isPidAlive = options.isPidAlive ?? defaultIsPidAlive;
  }

  /** Ensure the instances directory exists. */
  private ensureDir(): void {
    fs.mkdirSync(this.dir, { recursive: true });
  }

  private filePath(id: string): string {
    return path.join(this.dir, `${id}.json`);
  }

  private tmpPath(id: string): string {
    return path.join(this.dir, `${id}.json.tmp`);
  }

  /** Atomically write record to disk. */
  private writeRecord(record: InstanceRecord): void {
    this.ensureDir();
    const tmp = this.tmpPath(record.id);
    const dest = this.filePath(record.id);
    fs.writeFileSync(tmp, JSON.stringify(record, null, 2), "utf8");
    fs.renameSync(tmp, dest);
  }

  /**
   * Read and parse a single instance file.
   * Returns null if the file is missing, unreadable, or fails validation.
   */
  private readRecord(id: string): InstanceRecord | null {
    const fp = this.filePath(id);
    try {
      const raw = fs.readFileSync(fp, "utf8");
      const parsed: unknown = JSON.parse(raw);
      if (!isValidInstanceRecord(parsed)) return null;
      return parsed;
    } catch {
      return null;
    }
  }

  /**
   * Register a new instance and write its file.
   * Returns the full record that was written.
   */
  registerInstance(input: RegisterInput): InstanceRecord {
    const now = new Date().toISOString();
    const record: InstanceRecord = {
      schemaVersion: SCHEMA_VERSION,
      id: input.id,
      pid: input.pid,
      serverUrl: input.serverUrl,
      projectPath: input.projectPath,
      projectName: input.projectName,
      startedAt: now,
      lastActivityAt: now,
      statusHint: "idle",
    };
    this.writeRecord(record);
    return record;
  }

  /**
   * Merge a patch into an existing instance record and persist it.
   * Returns the updated record, or null if the record does not exist.
   */
  updateInstanceActivity(
    id: string,
    patch: ActivityPatch,
  ): InstanceRecord | null {
    const existing = this.readRecord(id);
    if (existing === null) return null;
    const updated: InstanceRecord = {
      ...existing,
      lastActivityAt: patch.lastActivityAt ?? new Date().toISOString(),
      statusHint: patch.statusHint ?? existing.statusHint,
    };
    this.writeRecord(updated);
    return updated;
  }

  /**
   * Delete the instance file for the given id.
   * Silently succeeds if the file does not exist.
   */
  cleanupInstance(id: string): void {
    try {
      fs.unlinkSync(this.filePath(id));
    } catch {
      // best-effort; ignore missing file
    }
    // also remove any leftover tmp file
    try {
      fs.unlinkSync(this.tmpPath(id));
    } catch {
      // ignore
    }
  }

  /**
   * Remove instance files whose PIDs are no longer alive.
   * Preserves files for live PIDs.
   * Invalid/unreadable files are also removed.
   *
   * @param isPidAlive - Optional override (falls back to registry-level override).
   * @returns Array of ids that were removed.
   */
  cleanupStaleInstances(isPidAlive?: (pid: number) => boolean): string[] {
    const check = isPidAlive ?? this.isPidAlive;
    const removed: string[] = [];

    let entries: string[];
    try {
      entries = fs.readdirSync(this.dir);
    } catch {
      return removed; // directory does not exist yet; nothing to clean
    }

    for (const entry of entries) {
      if (!entry.endsWith(".json") || entry.endsWith(".json.tmp")) continue;
      const id = entry.slice(0, -5); // strip .json
      const record = this.readRecord(id);
      if (record === null || !check(record.pid)) {
        this.cleanupInstance(id);
        removed.push(id);
      }
    }

    return removed;
  }

  /**
   * Return all valid instance records in the directory.
   * Invalid/unreadable files are silently skipped.
   */
  listInstances(): InstanceRecord[] {
    let entries: string[];
    try {
      entries = fs.readdirSync(this.dir);
    } catch {
      return [];
    }

    const records: InstanceRecord[] = [];
    for (const entry of entries) {
      if (!entry.endsWith(".json") || entry.endsWith(".json.tmp")) continue;
      const id = entry.slice(0, -5);
      const record = this.readRecord(id);
      if (record !== null) records.push(record);
    }
    return records;
  }
}
