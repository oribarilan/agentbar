# Task: Repo Automation Justfile + Quality Commands

## Objective

Introduce a root `justfile` with stable project commands:
- `just lint`
- `just format`
- `just test`
- `just check` (runs lint + format + test)

## Value Delivered

A single, repeatable quality interface for local development and CI, reducing command drift and onboarding friction.

## Dependencies

- `.todo/sprint01/monorepo-scaffold-and-contracts.md`

## Definition of Done

- [x] Root `justfile` exists and defines `lint`, `format`, `test`, and `check`.
- [x] `just check` executes `lint`, `format`, and `test` in a deterministic order.
- [x] README documents required `just` installation and command usage.
- [x] Commands delegate to package manager scripts rather than duplicating logic.
- [x] CI can invoke `just test` without local-only assumptions.

## Test Plan / Success Verification

1. Automation: running `just lint` executes workspace lint script(s) and returns non-zero on violations.
2. Automation: running `just format` applies or verifies formatting per chosen formatter strategy.
3. Automation: running `just test` executes test suite(s) and exits non-zero on failure.
4. Automation: running `just check` runs all three commands in documented order.

## Alternatives Considered

1. **Direct npm/pnpm scripts only**
   - Pros: no extra tool dependency
   - Cons: weaker discoverability and less ergonomic task composition
2. **Makefile**
   - Pros: ubiquitous and familiar
   - Cons: less ergonomic command UX on macOS developer setups using modern tooling
3. **Justfile wrapper over workspace scripts**
   - Pros: clean UX, easy local/CI parity, low complexity
   - Cons: requires contributors to install `just`

## Recommended Approach

Use **Justfile as a thin wrapper** over workspace scripts.

Why:
- provides a stable command interface early,
- keeps implementation logic in package scripts,
- simplifies CI and contributor workflows.

## Scope Estimate

Small
