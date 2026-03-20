# Task: CI Test Gate + PR Protection

## Objective

Establish CI and branch protection so all changes flow through pull requests and cannot merge unless `just test` passes.

## Value Delivered

A reliable merge gate that prevents regressions and enforces the intended contribution workflow from day one.

## Dependencies

- `.todo/sprint01/repo-automation-justfile-and-quality-commands.md`

## Definition of Done

- [x] GitHub Actions workflow runs `just test` on pull requests targeting main branch.
- [x] Workflow status check name is stable and documented.
- [x] Branch protection requires pull request before merge to main.
- [x] Branch protection requires the `just test` workflow check to pass.
- [x] Direct pushes to protected branch are disabled for regular contributors.

> Verified via GitHub branch protection API on 2026-03-20.

## Test Plan / Success Verification

1. CI: open PR with passing tests; workflow succeeds and merge is allowed (subject to review rules).
2. CI: open PR with intentionally failing test; workflow fails and merge is blocked.
3. Governance: direct push attempt to protected branch is rejected by GitHub policy.

## Alternatives Considered

1. **Manual maintainer discipline (no protection rules)**
   - Pros: fast initial setup
   - Cons: high risk of accidental bypass and regressions
2. **Require full `just check` in CI from day one**
   - Pros: stricter quality gate
   - Cons: higher initial fragility before lint/format conventions stabilize
3. **Require `just test` first, expand later**
   - Pros: pragmatic baseline with low friction
   - Cons: lint/format not yet merge-blocking

## Recommended Approach

Use **`just test` as initial required CI gate**, then optionally graduate to `just check` once toolchain stabilizes.

Why:
- meets immediate reliability goal,
- enforces PR-only flow early,
- avoids over-constraining early scaffolding iteration.

## Scope Estimate

Small
