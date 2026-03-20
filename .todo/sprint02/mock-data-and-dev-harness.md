# Task: Mock Data + Dev Harness for UI Iteration

## Objective

Provide deterministic mock instance data and simulated event streams so popover/status UX can be developed without requiring live OpenCode sessions.

## Value Delivered

Faster local iteration and reproducible bug reports for state and UX behavior.

## Dependencies

- `.todo/sprint01/simulator-shell-and-test-runner.md`

## Definition of Done

- [ ] Mock fixture set covers core statuses (`working`, `idle`, `waiting`, `error`, disconnected).
- [ ] Simulated stream can replay scripted event sequences.
- [ ] Developer workflow docs explain how to switch simulator between mock/live modes.
- [ ] Harness supports at least one burst scenario used by state-machine tests.

## Test Plan / Success Verification

1. Unit/integration: scripted stream replay produces expected state sequence.
2. Manual sanity: simulator can render mixed-status instance list in mock mode.
3. Regression: known state bug can be reproduced deterministically with fixture + replay script.

## Alternatives Considered

1. **Live OpenCode only for development**
   - Pros: real data always
   - Cons: slower iteration and hard-to-reproduce bugs
2. **Static fixtures only (no stream replay)**
   - Pros: easy setup
   - Cons: weak for transition-related bugs
3. **Fixtures + replayable simulated stream**
   - Pros: deterministic and practical
   - Cons: moderate harness setup effort

## Recommended Approach

Use **fixtures + replayable simulated stream**.

Why:
- enables rapid UI iteration,
- supports deterministic debugging,
- improves confidence in transition-heavy flows.

## Scope Estimate

Small
