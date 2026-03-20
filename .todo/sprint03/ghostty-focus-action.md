# Task: Ghostty Focus Action (P2 Core)

## Objective

Enable clicking an instance in Agentbar popover to activate Ghostty and focus the relevant tab when mapping is available.

## Value Delivered

P2 core workflow: status in menu bar becomes actionable, reducing context-switch friction.

## Dependencies

- `.todo/sprint02/event-to-state-mapping-and-state-machine.md`
- `.todo/sprint03/accessibility-permission-flow.md`

## Definition of Done

- [ ] Popover row action invokes backend focus command.
- [ ] Ghostty app is activated before tab focus attempt.
- [ ] Tab focus works in common single-window and multi-tab workflows.
- [ ] Failures return actionable user feedback (permissions, no match, app closed).
- [ ] Failure in one focus attempt does not affect monitoring loop.
- [ ] Unit/integration tests cover activation-first behavior and no-match fallback behavior.

## Test Plan / Success Verification

1. Integration: with multiple tabs, click instance A and verify expected tab focus.
2. Integration: with Ghostty backgrounded, verify activation happens before focus attempt.
3. Integration: no matching tab case returns deterministic fallback message and keeps monitoring healthy.
4. Unit: error mapping differentiates app-closed/no-match/system-automation failures.

## Alternatives Considered

1. **Direct Ghostty CLI/API control**
   - Pros: potentially cleaner control channel
   - Cons: not available/reliable on macOS today
2. **macOS Accessibility automation (AppleScript/System Events)**
   - Pros: available now, proven tab focus path
   - Cons: permission friction, selector fragility
3. **Only activate Ghostty, no tab targeting**
   - Pros: very robust
   - Cons: misses key value of precise navigation

## Recommended Approach

Use **Accessibility automation with explicit fallbacks**.

Why:
- only practical macOS mechanism for tab-level focus,
- provides P2 value now,
- fallback keeps behavior useful when targeting fails.

## Scope Estimate

Medium
