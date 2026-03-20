# Task: Token Telemetry Pipeline (P3 Core)

## Objective

Implement per-instance token telemetry extraction, normalization, and display in popover.

## Value Delivered

Users gain visibility into agent usage intensity and can reason about resource consumption.

## Dependencies

- `.todo/sprint02/event-to-state-mapping-and-state-machine.md`
- `.todo/sprint02/session-status-snapshot-reconciliation.md`
- `.todo/sprint02/popover-ux-refinement-and-actionable-states.md`

## Definition of Done

- [ ] Token-related data is extracted from OpenCode event/message surfaces.
- [ ] Normalized telemetry model supports missing/partial provider data.
- [ ] Popover shows per-instance token usage without cluttering core status.
- [ ] Aggregated token summary is available at app level.
- [ ] Unknown/unavailable telemetry is explicitly represented.
- [ ] Unit tests cover normalization and missing-field handling for provider-variant payloads.

## Test Plan / Success Verification

1. Unit: sessions with token metadata normalize to expected per-instance values.
2. Unit: sessions without metadata map to explicit `unknown`/`N/A` representation.
3. Integration/UI: aggregate equals sum of available visible instance values.
4. Performance sanity: frequent telemetry updates do not degrade popover interaction responsiveness.

## Alternatives Considered

1. **Only show aggregate tokens**
   - Pros: simple UI
   - Cons: loses per-session diagnostic value
2. **Only show per-instance tokens**
   - Pros: precise detail
   - Cons: no high-level overview
3. **Both aggregate + per-instance (progressive disclosure)**
   - Pros: complete picture with manageable cognitive load
   - Cons: extra design work

## Recommended Approach

Use **both aggregate + per-instance** with progressive disclosure.

Why:
- preserves glanceability while enabling deeper diagnostics.

## Scope Estimate

Medium
