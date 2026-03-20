# Task: Accessibility Permission Flow + Recovery UX

## Objective

Implement first-run accessibility permission detection, guidance, and recovery UX for Ghostty focus actions on macOS.

## Value Delivered

Users can successfully enable required permissions with minimal confusion, improving Ghostty navigation success rates.

## Dependencies

- `.todo/sprint03/ghostty-focus-action.md`

## Definition of Done

- [ ] Permission state is detected before or during focus action.
- [ ] UI feedback clearly explains why permission is required and how to enable it.
- [ ] Recovery path includes actionable remediation steps and retry behavior.
- [ ] Failure messaging differentiates permission issues from mapping/no-tab issues.
- [ ] Unit/UI automation tests cover denied, granted-after-prompt, and retry flows.

## Test Plan / Success Verification

1. UI automation: denied-permission state shows remediation guidance and does not crash action flow.
2. UI automation: after permission is granted, retry action succeeds in common path.
3. Unit: error mapping surfaces distinct user-facing messages for permission vs no-match failures.

## Alternatives Considered

1. **Generic error toast only**
   - Pros: minimal implementation
   - Cons: poor user recovery and high support burden
2. **Documentation-only workaround**
   - Pros: no UI complexity
   - Cons: weak discoverability during real usage
3. **In-flow permission guidance and recovery UX**
   - Pros: best completion rate and clarity
   - Cons: additional UX/state handling logic

## Recommended Approach

Use **in-flow permission guidance with explicit retry path**.

Why:
- directly reduces navigation friction,
- matches graceful-failure requirements,
- keeps user trust by making failures actionable.

## Scope Estimate

Small
