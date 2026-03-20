# Task: SSE Transport Lifecycle + Reconnect

## Objective

Implement robust per-instance SSE connection lifecycle management, including connect/disconnect detection, bounded retries, and backoff behavior.

## Value Delivered

Reliable real-time event transport that remains stable under transient network/server failures.

## Dependencies

- `.todo/sprint01/menubar-discovery-and-aggregate-status.md`
- `.todo/sprint01/simulator-shell-and-test-runner.md`

## Definition of Done

- [ ] Per-instance SSE connection manager exists with explicit lifecycle states.
- [ ] Reconnect policy implements bounded exponential backoff with jitter (or documented equivalent).
- [ ] Connection failures are isolated per instance and do not cascade.
- [ ] Transport emits normalized connectivity events for downstream state logic.
- [ ] Unit tests cover reconnect/backoff transitions and failure isolation.

## Test Plan / Success Verification

1. Unit: dropped stream triggers reconnect attempts according to policy.
2. Unit: repeated failures transition instance to disconnected transport state.
3. Unit: one failing instance does not interrupt active streams for others.
4. Integration harness: restarting mocked SSE source recovers stream without app restart.

## Alternatives Considered

1. **No reconnect, fail closed**
   - Pros: simple behavior
   - Cons: brittle and poor UX under transient failures
2. **Aggressive tight-loop reconnect**
   - Pros: quick recovery in some cases
   - Cons: resource spikes and noisy failure patterns
3. **Bounded backoff reconnect lifecycle**
   - Pros: robust and resource-aware
   - Cons: slightly more implementation complexity

## Recommended Approach

Use **bounded backoff reconnect lifecycle** with per-instance isolation.

Why:
- aligns with reliability goals,
- avoids global failure amplification,
- creates stable foundation for state machine logic.

## Scope Estimate

Medium
