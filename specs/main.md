# Agentbar — Main Product Spec (Spec Driver)

This document is the **primary spec driver** for the project. It defines the product goals, priorities, scope, and delivery plan. Component-level specs under `specs/*.md` refine this document.

---

## 1) Product Summary

**Agentbar** is a macOS-first menu bar companion for AI coding sessions.

Initial target integration: **OpenCode**.

Core idea:
- show live coding-session status in the menu bar,
- let the user quickly jump to the right terminal/tab,
- later surface richer agent telemetry (tokens, costs, model usage).

---

## 2) Priority Order

1. **P1 — Status visibility in menu bar**
   - See whether sessions are working/idle/waiting for user input at a glance.
2. **P2 — Fast navigation from menu bar to active session terminal**
   - Click instance in menu bar panel, focus the corresponding Ghostty tab.
3. **P3 — Rich session telemetry**
   - Token usage and other agent-level metadata.

---

## 3) Scope

### In Scope (v1)
- OpenCode plugin using OpenCode hooks/events.
- Tauri v2 menu bar app (macOS focus).
- Discovery and state updates via shared instance files + OpenCode SSE.
- Status indicator (icon + text) in menu bar.
- Popover list of active OpenCode instances.

### Next Scope (v1.x)
- Ghostty tab focusing from popover item click.
- Robustness (reconnect, stale instance cleanup, error states).
- Token usage in popover and light aggregate in tray title.

### Out of Scope (for now)
- Native Windows/Linux behavior parity.
- Claude Code integration implementation (design only for now).
- Full analytics backend / cloud sync.

---

## 4) Platform and Tech Choices

- **Menu bar app**: Tauri v2 + Svelte frontend
- **macOS menu-bar-only mode**: `ActivationPolicy::Accessory`
- **Popover UX**: `tauri-plugin-nspopover`
- **OpenCode integration**: plugin hooks + OpenCode server (`/global/event`, `/session/status`)
- **Local state discovery**: JSON files under `~/.local/share/agentbar/instances/`

---

## 5) Architecture (High-Level)

1. OpenCode plugin starts and registers an instance file in shared directory.
2. Plugin updates lightweight status metadata on key events.
3. Agentbar app watches instance directory, discovers active instances.
4. Agentbar app opens SSE connection(s) to OpenCode server(s) for real-time status.
5. Menu bar icon/title updates from aggregated status.
6. Popover displays per-instance details and actions.
7. (P2) Clicking an instance focuses corresponding Ghostty tab.

See component specs for details:
- `specs/opencode-plugin.md`
- `specs/menubar-app.md`
- `specs/ghostty-navigation.md`
- `specs/agent-telemetry.md`

---

## 6) UX Requirements

- At-a-glance status in menu bar must be understandable in under 1 second.
- Color/icon semantics must be consistent:
  - working,
  - idle,
  - waiting for user action,
  - error/disconnected.
- Popover must be lightweight and fast to open.
- Instance list should include enough context to choose quickly:
  - project name,
  - current status,
  - latest activity.

---

## 7) Non-Functional Requirements

- **Low overhead**: minimal CPU/memory impact while idle.
- **Reliability**: stale instances should self-heal.
- **Local-first privacy**: no cloud dependency for core behavior.
- **Graceful degradation**:
  - if OpenCode server unavailable, show disconnected status,
  - if Ghostty focusing unavailable, keep status features working.

---

## 8) Success Criteria by Priority

### P1 Done when
- User can run OpenCode + plugin and see live aggregate status in menu bar.
- Popover lists discovered active instances and their state.

### P2 Done when
- Clicking an instance can bring Ghostty forward and focus relevant tab in common cases.

### P3 Done when
- Token usage appears per instance and aggregate values are visible without clutter.

---

## 9) Delivery Plan (Sprint Bundles)

Each sprint is intended to be independently meaningful and shippable:

- **Sprint 01**: Foundations + simulator/test baseline + P1 baseline visibility
- **Sprint 02**: Real-time state model (split transport/state/reconciliation) + polished popover details
- **Sprint 03**: P2 Ghostty navigation + permission/recovery UX hardening
- **Sprint 04**: P3 telemetry + test pyramid expansion + multi-agent extensibility groundwork

Sprint tasks are tracked in `.todo/sprintNN/<task-name>.md`.

---

## 10) Documentation Model: Specs vs Tasks

### Spec files (`specs/*.md`)
Spec files are intentionally **high-level**. They define:
- product intent,
- architectural direction,
- responsibilities and boundaries,
- success criteria and scope.

Spec files should avoid implementation-level sequencing details.

### Task files (`.todo/sprintNN/<task-name>.md`)
Task files are intentionally **execution-level** and must include:
- what should be accomplished,
- definition of done,
- how success is tested,
- alternative designs/implementations considered,
- recommended approach and rationale.

This separation keeps strategy in `specs/` and execution details in `.todo/`.
