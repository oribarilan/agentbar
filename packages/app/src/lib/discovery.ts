import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import {
  parseInstanceJson,
  type AppInstanceRecord,
} from "./instance-contract.js";

const DEFAULT_INSTANCES_DIR = path.join(
  os.homedir(),
  ".local",
  "share",
  "agentbar",
  "instances",
);

export interface DiscoveryResult {
  records: AppInstanceRecord[];
  errors: string[];
}

export function defaultInstancesDir(): string {
  return process.env["AGENTBAR_INSTANCES_DIR"] ?? DEFAULT_INSTANCES_DIR;
}

export function discoverInstancesFromDir(
  instancesDir = defaultInstancesDir(),
): DiscoveryResult {
  let entries: string[];
  try {
    entries = fs.readdirSync(instancesDir);
  } catch {
    return { records: [], errors: [] };
  }

  const records: AppInstanceRecord[] = [];
  const errors: string[] = [];

  for (const entry of entries) {
    if (!entry.endsWith(".json") || entry.endsWith(".json.tmp")) continue;

    const filePath = path.join(instancesDir, entry);
    let jsonText: string;
    try {
      jsonText = fs.readFileSync(filePath, "utf8");
    } catch {
      errors.push(`${entry}: unreadable file`);
      continue;
    }

    const parsed = parseInstanceJson(jsonText);
    if (parsed.ok) {
      records.push(parsed.record);
    } else {
      errors.push(`${entry}: ${parsed.error}`);
    }
  }

  return { records, errors };
}
