# Task: Integration Smoke — Plugin to App Pipeline

## Objective

Add an automated smoke test that verifies plugin presence registration is discoverable by app state ingestion end-to-end.

## Value Delivered

Proof that the core cross-package contract works in practice, catching integration breakage early.

## Dependencies

- `.todo/sprint01/opencode-plugin-presence-registration.md`
- `.todo/sprint01/menubar-discovery-and-aggregate-status.md`
- `.todo/sprint01/simulator-shell-and-test-runner.md`

## Definition of Done

- [x] A repeatable integration test creates realistic instance record input and asserts app discovery output.
- [x] Test validates add/update/remove lifecycle for at least one instance.
- [x] Test runs in CI as part of `just test`.
- [x] Failure output is actionable (clear assertion messages and fixture context).

## Test Plan / Success Verification

1. Integration: write valid instance fixture and assert it appears in app model/popover data source.
2. Integration: mutate status/activity fields and assert aggregate/tracked state updates.
3. Integration: remove fixture and assert instance disappears from active set.
4. CI: test executes under PR workflow via `just test`.

## Alternatives Considered

1. **Manual integration checks only**
   - Pros: low upfront effort
   - Cons: poor repeatability and regression detection
2. **Unit-only validation of both sides**
   - Pros: fast and isolated
   - Cons: misses boundary mismatches between packages
3. **Automated integration smoke test**
   - Pros: catches contract drift early with modest complexity
   - Cons: some fixture/harness setup cost

## Recommended Approach

Use **automated integration smoke test** as a required CI signal in Sprint 01.

Why:
- directly validates the highest-risk boundary,
- supports fast confidence for subsequent sprint work,
- keeps regression feedback tight.

## Scope Estimate

Small
