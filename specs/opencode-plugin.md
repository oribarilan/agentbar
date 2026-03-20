# OpenCode Plugin Spec

## Overview

The OpenCode plugin is Agentbar's integration layer inside OpenCode. It is responsible for exposing local runtime presence and lightweight session state so the menu bar app can discover and track active instances.

This spec stays high-level; detailed implementation trade-offs belong in `.todo/sprint*/task*.md` files.

## Responsibilities

- Register each running OpenCode instance to a shared local directory.
- Keep minimal metadata current (project, server URL, health/status hints).
- Subscribe to OpenCode hook/events and publish status-relevant changes.
- Clean up stale registration files when possible.

## Inputs

- OpenCode plugin context (`project`, `directory`, `client`, etc.).
- OpenCode event bus (`session.*`, `message.*`, `permission.*`).
- Runtime environment hints (PID, hostname, terminal context).

## Outputs

- One instance registration file per running OpenCode instance in:
  - `~/.local/share/agentbar/instances/`
- Event-driven updates to instance file metadata.

## Data Contract (High-Level)

Instance records should include at least:
- unique instance id,
- process id,
- OpenCode server base URL,
- project path/name,
- timestamps (`startedAt`, `lastActivityAt`),
- latest derived status hint.

Exact field naming and versioning strategy are task-level concerns.

## Lifecycle Expectations

1. Plugin init → create/refresh instance record.
2. Runtime events → update status hint and activity time.
3. Shutdown/termination path → best-effort cleanup.
4. Recovery path → stale record cleanup by PID validity.

## Non-Functional Requirements

- Must add minimal overhead during normal OpenCode use.
- Must degrade safely when file system operations fail.
- Must never block core OpenCode behavior.

## Success Criteria

- Agentbar app can discover active OpenCode instances without manual setup.
- Instance status changes are visible in near real-time.
- Stale records do not accumulate indefinitely.
