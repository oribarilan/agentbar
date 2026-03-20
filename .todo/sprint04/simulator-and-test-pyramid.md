# Task: Simulator + Test Pyramid (Unit/UI Automation/Integration/E2E)

## Objective

Expand simulator-driven automated testing from Sprint 01 baseline to comprehensive unit, Playwright UI automation, integration, and e2e coverage.

## Value Delivered

Strong regression safety net aligned with required engineering practices.

## Dependencies

- `.todo/sprint01/simulator-shell-and-test-runner.md`
- `.todo/sprint01/integration-smoke-pipeline.md`
- `.todo/sprint01/ci-test-gate-and-pr-protection.md`

## Definition of Done

- [ ] Existing simulator/test baseline from Sprint 01 is extended (not re-created).
- [ ] Unit tests cover key state reducers/mappers and are isolated.
- [ ] Playwright UI automation validates critical popover/tray interaction paths in simulator.
- [ ] Integration tests run simulator against real backend components for selected flows.
- [ ] E2E tests run simulator as UI layer against real stack for at least one complete user journey.
- [ ] Test execution docs + commands are documented for contributors.

## Test Plan / Success Verification

1. `unit` suite runs independently and deterministically.
2. `ui-automation` suite runs in headless mode and catches intentional UI regression.
3. `integration` suite validates component interaction (discovery + state updates).
4. `e2e` suite validates end-to-end flow from plugin presence to UI action handling.

## Alternatives Considered

1. **Rely mainly on manual QA**
   - Pros: low upfront effort
   - Cons: regression risk too high
2. **Only unit + a few integration tests**
   - Pros: faster setup
   - Cons: misses UI regressions and cross-stack user flows
3. **Full simulator-based test pyramid**
   - Pros: best confidence and long-term velocity
   - Cons: highest initial setup cost

## Recommended Approach

Use **full simulator-based test pyramid** incrementally.

Why:
- directly matches project quality goals,
- prevents UI and integration regressions,
- supports rapid iteration with confidence.

## Scope Estimate

Large
