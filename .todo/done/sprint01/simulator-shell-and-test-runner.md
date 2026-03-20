# Task: Simulator Shell + Test Runner Baseline

## Objective

Create the simulator shell and baseline test tooling (unit + Playwright scaffolding) in Sprint 01 so all subsequent features are built with tests by default.

## Value Delivered

Early verification infrastructure that reduces rework and supports fast, safe iteration across all later sprints.

## Dependencies

- `.todo/sprint01/monorepo-scaffold-and-contracts.md`
- `.todo/sprint01/repo-automation-justfile-and-quality-commands.md`

## Definition of Done

- [x] Simulator web app shell can run in local dev and CI.
- [x] Unit test runner is configured and can execute at least one deterministic test.
- [x] Playwright is configured with at least one smoke test placeholder targeting simulator shell.
- [x] `just test` includes simulator-relevant suites intended for Sprint 01.
- [x] Contributor docs explain how to run simulator and tests locally.

## Test Plan / Success Verification

1. Automation: unit suite runs in headless mode and passes with deterministic outputs.
2. Automation: Playwright smoke test launches simulator and asserts initial render.
3. CI: workflow invoking `just test` includes these suites and reports pass/fail.

## Alternatives Considered

1. **Defer simulator/test setup to later sprint**
   - Pros: faster initial feature work
   - Cons: high retrofit risk and weaker regression safety
2. **Unit tests only in Sprint 01**
   - Pros: lower setup cost
   - Cons: delayed UI automation foundation
3. **Baseline simulator + unit + minimal Playwright now**
   - Pros: best long-term velocity and confidence with modest early cost
   - Cons: slightly longer Sprint 01

## Recommended Approach

Use **baseline simulator + unit tests + minimal Playwright scaffolding** in Sprint 01.

Why:
- aligns with engineering requirements,
- avoids late-stage test retrofits,
- enables each sprint to ship with automated verification.

## Scope Estimate

Medium
