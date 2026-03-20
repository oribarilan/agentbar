# Agentbar — `@agentbar/app`

Menu bar companion app (Tauri v2 + Svelte simulator).

## Overview

This package includes:

- **Simulator UI** in `src/` for fast browser iteration.
- **State ingestion logic** in `src/lib/` for instance parsing, directory discovery, and aggregate tray status.
- **Native tray shell** in `src-tauri/` for macOS menu-bar execution.
- **Automated tests** (Vitest + Playwright smoke).

The native tray shell scans instance files every 2 seconds and updates:

- tray title (status icon + active count)
- tray tooltip (status breakdown)
- tray menu entries (project + status lines)

## Quickstart

```bash
# from repo root
pnpm install

# run simulator
pnpm --filter @agentbar/app dev

# run unit + integration tests
pnpm --filter @agentbar/app test

# run playwright smoke
pnpm --filter @agentbar/app test:ui

# build web + tauri check
pnpm --filter @agentbar/app build
```

## Instance Contract

This app consumes plugin-written instance records from:

`~/.local/share/agentbar/instances/<id>.json`

Canonical fields (v1):

- `schemaVersion: 1`
- `id`, `pid`, `serverUrl`
- `projectPath`, `projectName`
- `startedAt`, `lastActivityAt`
- `statusHint` (`idle`, `working`, `waiting_for_input`, `error`, `unknown`)

The app maps `statusHint` into UI status semantics:

- `waiting_for_input -> waiting`
- `unknown -> disconnected`

## Testing

| Suite              | Command                               | Purpose                            |
| ------------------ | ------------------------------------- | ---------------------------------- |
| Unit + integration | `pnpm --filter @agentbar/app test`    | TS tests + Rust tray summary tests |
| UI smoke           | `pnpm --filter @agentbar/app test:ui` | Simulator render sanity            |

Integration tests create real temp instance files and validate discovery + aggregate transitions.
