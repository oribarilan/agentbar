# Task: Real-Time SSE Ingestion + State Machine (Deprecated - Split)

## Objective

Connect Agentbar to each discovered OpenCode server SSE stream and implement a normalized per-instance state machine.

## Value Delivered

Status becomes truly real-time and semantically correct (working, idle, waiting, error, disconnected).

## Definition of Done

- [ ] SSE connection established per active instance.
- [ ] Event mapping to internal states is documented and implemented.
- [ ] Reconnect strategy handles drops/backoff.
- [ ] `/session/status` snapshot used as bootstrap/reconciliation source.
- [ ] State transitions are deterministic under event bursts.

## Test Plan / Success Verification

1. Trigger OpenCode work cycle → state transitions working→idle visible.
2. Trigger permission prompt → waiting state visible.
3. Kill server port → disconnected state then recovery after restart.
4. Replay rapid event stream (manual or scripted) → no invalid state loops.

## Alternatives Considered

1. **Pure event-driven with no snapshot reconciliation**
   - Pros: simpler model
   - Cons: fragile after reconnect or missed events
2. **Snapshot-only polling**
   - Pros: deterministic snapshots
   - Cons: lower fidelity, delayed responsiveness
3. **Hybrid SSE + periodic snapshot reconciliation**
   - Pros: real-time + recovery safety
   - Cons: more moving parts

## Recommended Approach

Use **hybrid SSE + snapshot reconciliation**.

Why:
- best reliability under transient failures,
- preserves responsiveness,
- avoids long-lived drift.

## Scope Estimate

Large

## Notes

This task is superseded by the following Sprint 02 split tasks for better execution parallelism and testability:
- `.todo/sprint02/sse-transport-lifecycle-and-reconnect.md`
- `.todo/sprint02/event-to-state-mapping-and-state-machine.md`
- `.todo/sprint02/session-status-snapshot-reconciliation.md`

Keep this file for historical planning context only; do not execute it directly.
