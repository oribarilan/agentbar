# Task: Popover UX Refinement + Actionable States

## Objective

Refine the popover UI to make per-instance status quickly scannable and actionable.

## Value Delivered

Users can confidently identify where attention is needed and choose the right session quickly.

## Dependencies

- `.todo/sprint02/event-to-state-mapping-and-state-machine.md`
- `.todo/sprint02/mock-data-and-dev-harness.md`

## Definition of Done

- [ ] Instance cards show status, project, and recent activity consistently.
- [ ] Visual system for states is consistent with tray semantics.
- [ ] Ordering strategy prioritizes attention-requiring instances.
- [ ] Clear empty/loading/error states implemented.
- [ ] Keyboard + click behavior is predictable.
- [ ] Playwright UI automation covers critical mixed-state rendering and keyboard navigation behavior.

## Test Plan / Success Verification

1. UI automation: mixed statuses are visually distinct and selector/assertion stable.
2. UI automation: permission-waiting instances appear above idle by default ordering rule.
3. UI automation: loading/disconnected states render explicit labels/icons.
4. UI automation: keyboard navigation and activation behavior is predictable.

## Alternatives Considered

1. **Dense table layout**
   - Pros: more info per row
   - Cons: poor glanceability in small popover
2. **Card list with compact metadata**
   - Pros: strong readability and hierarchy
   - Cons: slightly less density
3. **Minimal text-only list**
   - Pros: fastest to implement
   - Cons: weak urgency signaling

## Recommended Approach

Use **compact card list** with clear visual hierarchy.

Why:
- best tradeoff for menu bar popover constraints,
- aligns with priority on fast status recognition.

## Scope Estimate

Medium
