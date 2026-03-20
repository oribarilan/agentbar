# Task: Ghostty Mapping Reliability + UX Recovery Paths

## Objective

Improve instance→tab mapping reliability and implement clear fallback UX when exact focus is unavailable.

## Value Delivered

Navigation becomes dependable enough for daily usage, with reduced confusion on edge cases.

## Dependencies

- `.todo/sprint03/ghostty-focus-action.md`
- `.todo/sprint03/accessibility-permission-flow.md`

## Definition of Done

- [ ] Mapping strategy supports common naming/title variations.
- [ ] Ambiguous matches are handled deterministically.
- [ ] Fallback flow is user-friendly (activate Ghostty + guidance).
- [ ] Mapping diagnostics are logged for debugging.
- [ ] Basic settings/flags for mapping strictness are introduced (if needed).
- [ ] Unit tests cover scoring/tie-breaker determinism and fallback selection.

## Test Plan / Success Verification

1. Unit: named-tab scenarios across at least two projects resolve to expected best match.
2. Unit: ambiguous candidate set produces deterministic tie-break result and explicit rationale.
3. Integration: missing title metadata still yields useful fallback behavior.
4. Regression: simulator/integration harness captures mapping behavior for future changes.

## Alternatives Considered

1. **Strict exact-match only**
   - Pros: simple, predictable
   - Cons: brittle in real-world title variance
2. **Heuristic matching with scoring**
   - Pros: higher hit rate
   - Cons: more complexity, needs observability
3. **Manual user selection every time**
   - Pros: always accurate
   - Cons: defeats quick-navigation goal

## Recommended Approach

Use **lightweight heuristic matching + deterministic fallback**.

Why:
- balances usability and complexity,
- improves success rate without overbuilding.

## Scope Estimate

Medium
