# Task: Menu Bar Discovery + Aggregate Status (P1 Ship)

## Objective

Implement Agentbar app discovery of instance files and render a first useful menu bar status (icon + text) plus a basic popover list.

## Value Delivered

First end-to-end P1 outcome: users can see live OpenCode presence and coarse status in menu bar.

## Dependencies

- `.todo/sprint01/monorepo-scaffold-and-contracts.md`
- `.todo/sprint01/simulator-shell-and-test-runner.md`
- `.todo/sprint01/repo-automation-justfile-and-quality-commands.md`
- `.todo/sprint01/ci-test-gate-and-pr-protection.md`
- `.todo/sprint01/opencode-plugin-presence-registration.md`

## Definition of Done

- [x] App watches instance directory and reflects adds/removals.
- [x] Tray icon and title update based on discovered state.
- [x] Popover lists active instances with project label + basic status.
- [x] Disconnected/malformed records handled without app crash.
- [x] Empty state is clear when no instances exist.
- [x] Unit tests cover aggregate-status derivation and malformed-record isolation.

## Test Plan / Success Verification

1. Unit: aggregate reducer maps mixed instance inputs to expected tray status.
2. Unit: malformed `instance.json` is ignored with warning and does not crash list rendering path.
3. Integration smoke: plugin-produced instance file appears in app popover and updates tray summary.
4. Integration smoke: instance removal is reflected in app state within watcher/reconciliation window.

## Alternatives Considered

1. **Polling-only model**
   - Pros: simple to implement
   - Cons: laggier updates, unnecessary idle work
2. **Filesystem watcher + periodic reconciliation**
   - Pros: responsive + robust
   - Cons: slightly more logic
3. **SSE-only without file discovery**
   - Pros: real-time once connected
   - Cons: no bootstrap discovery source

## Recommended Approach

Use **watcher + lightweight reconciliation** on top of file discovery.

Why:
- responsive UX,
- resilient to missed fs events,
- cleanly composes with SSE in sprint02.

## Scope Estimate

Medium
