# Task: Event-to-State Mapping + Deterministic State Machine

## Objective

Define and implement deterministic mapping from OpenCode events to internal operational states (`working`, `idle`, `waiting`, `error`) with explicit transition rules.

## Value Delivered

Semantically correct status behavior that remains predictable under rapid event bursts.

## Dependencies

- `.todo/sprint02/sse-transport-lifecycle-and-reconnect.md`
- `.todo/sprint01/simulator-shell-and-test-runner.md`

## Definition of Done

- [ ] Event mapping table is documented and versioned in repo.
- [ ] State reducer/machine enforces deterministic transitions and invalid-transition handling.
- [ ] Burst handling logic avoids oscillation or impossible state loops.
- [ ] Unit harness replays representative event sequences and asserts expected transitions.
- [ ] Unit tests cover normal, edge, and malformed-event cases.

## Test Plan / Success Verification

1. Unit: canonical work cycle transitions `idle → working → idle`.
2. Unit: permission-related events transition into `waiting` and back out on resolution.
3. Unit: malformed/unknown events are safely ignored or mapped to documented fallback.
4. Unit harness: rapid mixed event sequence yields stable final state with no illegal transitions.

## Alternatives Considered

1. **Ad-hoc inline state updates**
   - Pros: fast initial coding
   - Cons: difficult reasoning and brittle behavior
2. **Overly strict finite-state machine with many microstates**
   - Pros: precise modeling
   - Cons: unnecessary complexity for current product scope
3. **Deterministic reduced state model with explicit mapping table**
   - Pros: clarity, testability, maintainability
   - Cons: requires upfront transition design

## Recommended Approach

Use **deterministic reduced state model + explicit mapping table**.

Why:
- balances correctness and simplicity,
- is easy to unit test,
- keeps UX semantics stable.

## Scope Estimate

Medium
