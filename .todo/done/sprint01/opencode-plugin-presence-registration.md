# Task: OpenCode Plugin Presence Registration (P1 Baseline)

## Objective

Implement OpenCode plugin lifecycle registration so Agentbar can discover running OpenCode instances via local files.

## Value Delivered

Agentbar can reliably know "which OpenCode instances exist right now" without any manual user linking.

## Dependencies

- `.todo/sprint01/monorepo-scaffold-and-contracts.md`
- `.todo/sprint01/simulator-shell-and-test-runner.md`
- `.todo/sprint01/repo-automation-justfile-and-quality-commands.md`
- `.todo/sprint01/ci-test-gate-and-pr-protection.md`

## Definition of Done

- [x] Plugin writes one instance file per running process in `~/.local/share/agentbar/instances/`.
- [x] File includes required identity fields (id, pid, serverUrl, project path/name, timestamps).
- [x] Plugin updates activity metadata on key events.
- [x] Plugin performs best-effort cleanup on process termination.
- [x] Stale file cleanup is implemented for dead PIDs on startup.
- [x] Unit tests cover file write/update/cleanup behavior with mocked filesystem and PID checks.

## Test Plan / Success Verification

1. Unit: `registerInstance()` writes required fields to expected location.
2. Unit: event updates mutate `lastActivityAt` and status hints deterministically.
3. Unit: stale-PID sweep removes invalid instance records and preserves live ones.
4. Integration smoke (or scripted harness): two concurrent plugin sessions produce two independent files.

## Alternatives Considered

1. **Plugin pushes directly to app over HTTP**
   - Pros: instant updates
   - Cons: requires app to be running; tighter coupling
2. **SQLite shared DB owned by plugin/app**
   - Pros: robust schema/querying
   - Cons: overkill for early phase, lock/contention complexity
3. **File-based registration + SSE for runtime updates**
   - Pros: decoupled startup order, simple, resilient
   - Cons: requires stale file handling

## Recommended Approach

Use **file-based registration + later SSE runtime enrichment**.

Why:
- matches agreed architecture,
- startup-order independent,
- simplest durable discovery primitive.

## Scope Estimate

Medium
