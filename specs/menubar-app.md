# Menu Bar App Spec (Tauri v2)

## Overview

The Agentbar menu bar app is the user-facing surface for session awareness. It aggregates OpenCode instance state and presents it as concise menu bar status plus a popover for per-instance details.

## Responsibilities

- Run as a menu-bar-only app on macOS.
- Discover active instances from shared local registration files.
- Subscribe to OpenCode real-time event streams for state updates.
- Maintain a normalized internal state model and aggregate status.
- Render icon + text summary in the menu bar.
- Render popover list with actionable instance entries.

## UX Requirements

- Tray title must remain compact and glanceable.
- Popover opens quickly and reflects current state.
- State indicators are visually consistent across list and tray.
- Empty/disconnected states are explicit and understandable.

## State Model (High-Level)

Per instance, represent at least:
- identity (id/project),
- connectivity,
- operational status (working/idle/waiting/error),
- last activity time.

Aggregate state should support:
- per-status counts,
- simplified tray text and icon state,
- optional ordering by urgency/recent activity.

## Integration Points

- File discovery path: `~/.local/share/agentbar/instances/`
- OpenCode server endpoints:
  - SSE stream (`/global/event`)
  - status snapshot (`/session/status`)

## Non-Functional Requirements

- Robust reconnect behavior for dropped SSE streams.
- No crash on malformed instance records; isolate failures per instance.
- Low idle resource usage suitable for always-on menu bar utility.

## Success Criteria

- User sees correct aggregate state in tray while OpenCode sessions run.
- Popover accurately lists active instances and states.
- Transient OpenCode failures do not require app restart to recover.
