# @agentbar/plugin

OpenCode plugin package for Agentbar presence registration.

## Overview

This package implements the file-based instance registration protocol used by Agentbar to discover running OpenCode instances. Each active plugin session writes a single JSON file to `~/.local/share/agentbar/instances/<id>.json`; the Agentbar menu-bar app polls that directory to show live status.

## Instance Record Schema (v1)

| Field            | Type     | Description                                                                        |
| ---------------- | -------- | ---------------------------------------------------------------------------------- |
| `schemaVersion`  | `1`      | Schema version. Increment on breaking changes.                                     |
| `id`             | `string` | Stable unique identifier for this plugin session (UUID v4).                        |
| `pid`            | `number` | OS process ID of the OpenCode process.                                             |
| `serverUrl`      | `string` | Base URL of the OpenCode HTTP/SSE server.                                          |
| `projectPath`    | `string` | Absolute path to the project root directory.                                       |
| `projectName`    | `string` | Human-readable project name.                                                       |
| `startedAt`      | `string` | ISO-8601 timestamp of when this instance was registered.                           |
| `lastActivityAt` | `string` | ISO-8601 timestamp of the most recent activity event.                              |
| `statusHint`     | `string` | Latest derived status: `idle`, `working`, `waiting_for_input`, `error`, `unknown`. |

**Versioning policy**: additive-only changes are allowed without a version bump. Readers **must** tolerate unknown extra fields.

## API

```ts
import { PresenceRegistry } from "@agentbar/plugin";

const registry = new PresenceRegistry(); // uses ~/.local/share/agentbar/instances
// or
const registry = new PresenceRegistry({ instancesDir: "/tmp/test-instances" });

// Register a new instance
const record = registry.registerInstance({
  id: crypto.randomUUID(),
  pid: process.pid,
  serverUrl: "http://localhost:4000",
  projectPath: "/home/user/my-project",
  projectName: "my-project",
});

// Update activity on events
registry.updateInstanceActivity(record.id, {
  lastActivityAt: new Date().toISOString(),
  statusHint: "working",
});

// Cleanup on shutdown
registry.cleanupInstance(record.id);

// Remove files for dead PIDs on startup
registry.cleanupStaleInstances();

// List all valid instances
const instances = registry.listInstances();
```

## Scripts

| Command           | Description                       |
| ----------------- | --------------------------------- |
| `pnpm build`      | Compile TypeScript to `dist/`     |
| `pnpm lint`       | Type-check with `tsc --noEmit`    |
| `pnpm format`     | Check formatting with Prettier    |
| `pnpm format:fix` | Auto-fix formatting with Prettier |
| `pnpm test`       | Run unit tests with Vitest        |
| `pnpm test:watch` | Run Vitest in watch mode          |

## Development

```sh
# From monorepo root
pnpm install
pnpm --filter @agentbar/plugin test
pnpm --filter @agentbar/plugin build
```

## Design Notes

- **Atomic writes**: files are written to `<id>.json.tmp` then renamed to `<id>.json` to prevent partial reads.
- **Tolerant readers**: `listInstances` and `cleanupStaleInstances` silently skip invalid or corrupt files.
- **No external dependencies**: only Node built-ins (`fs`, `os`, `path`).
- **Testable by default**: `instancesDir` and `isPidAlive` are constructor options for full isolation in tests.
