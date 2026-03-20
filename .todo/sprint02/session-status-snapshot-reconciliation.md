# Task: Session Status Snapshot Reconciliation

## Objective

Integrate `/session/status` snapshot bootstrap and periodic reconciliation to recover from missed events and reconnect drift.

## Value Delivered

Improved correctness over long-running sessions by preventing state divergence from transport interruptions.

## Dependencies

- `.todo/sprint02/sse-transport-lifecycle-and-reconnect.md`
- `.todo/sprint02/event-to-state-mapping-and-state-machine.md`

## Definition of Done

- [ ] Snapshot fetch on initial connect seeds per-instance state safely.
- [ ] Reconciliation policy (triggered and/or periodic) is defined and implemented.
- [ ] Snapshot/event merge strategy is deterministic and documented.
- [ ] Failures to fetch snapshot degrade gracefully to SSE-only behavior.
- [ ] Unit/integration tests cover drift recovery and merge precedence rules.

## Test Plan / Success Verification

1. Integration harness: start with stale local state, apply snapshot, assert corrected state.
2. Integration harness: drop event(s), run reconciliation, assert convergence to source-of-truth state.
3. Unit: merge rules are deterministic for conflicting snapshot/event timestamps.
4. Unit: snapshot fetch failure does not crash state loop and surfaces disconnected/degraded signal.

## Alternatives Considered

1. **SSE-only model with no reconciliation**
   - Pros: simpler implementation
   - Cons: drift risk after reconnects/missed events
2. **Snapshot-only polling model**
   - Pros: deterministic snapshots
   - Cons: poorer real-time responsiveness
3. **Hybrid SSE + snapshot reconciliation**
   - Pros: responsive and resilient
   - Cons: more merge logic to maintain

## Recommended Approach

Use **hybrid SSE + snapshot reconciliation** with explicit merge precedence.

Why:
- best reliability for long-lived sessions,
- aligns with graceful-degradation goals,
- reduces hidden state drift.

## Scope Estimate

Medium
