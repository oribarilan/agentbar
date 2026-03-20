# Task: Greptile PR Review Integration

## Objective

Integrate Greptile GitHub App for pull-request code review, configure repository review behavior, and wire review checks into PR workflow.

## Value Delivered

Automated AI code review on every PR with a consistent, auditable process that complements human review.

## Dependencies

- `.todo/sprint01/ci-test-gate-and-pr-protection.md`

## Definition of Done

- [ ] Greptile app is installed for this repository with indexing enabled.
- [ ] OSS program application is submitted and tracked (or explicit fallback plan documented if not approved).
- [x] `greptile.json` is added with baseline configuration (`statusCheck`, strictness, bot excludes, branch scope).
- [ ] At least one test PR confirms Greptile review runs and emits status check.
- [ ] Branch protection optionally requires Greptile status check once first check is observed and stable.

> Note: unchecked items require GitHub-side app installation and live PR validation by maintainers.

## Test Plan / Success Verification

1. Open test PR and confirm Greptile review appears within expected window.
2. Verify `statusCheck: true` behavior (status check present; no noisy default comment pattern).
3. Validate bot PR exclusion behavior (e.g., dependabot) using configuration review or controlled test.
4. Confirm required-check behavior blocks merge when Greptile check is pending/failing (if enforced).

## Alternatives Considered

1. **Human-only review process**
   - Pros: no external tooling dependency
   - Cons: inconsistent coverage and slower review feedback
2. **Other AI review bots**
   - Pros: potentially different strengths/pricing
   - Cons: switching cost and less alignment with requested tool choice
3. **Greptile advisory only (non-required)**
   - Pros: lower friction and fewer false-block cases initially
   - Cons: easier to bypass if not consistently monitored

## Recommended Approach

Start with **Greptile enabled and advisory for first few PRs**, then promote to required check after signal quality is validated.

Why:
- de-risks early false positives,
- still gives immediate review value,
- allows tightening policy once behavior is proven.

## Scope Estimate

Small
