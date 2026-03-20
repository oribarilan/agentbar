# Task: Monorepo Scaffold + Contracts

## Objective

Create the initial repository scaffold for:
- `packages/plugin` (OpenCode plugin package)
- `packages/app` (Tauri v2 + Svelte app package)

Define and document the first shared data contract (`instance.json`) used between plugin and app.

## Value Delivered

A runnable foundation that unblocks all implementation work and prevents integration drift.

## Dependencies

- None
- `.todo/sprint01/repo-automation-justfile-and-quality-commands.md` (parallel-compatible if desired)

## Definition of Done

- [x] Workspace root is configured (package manager workspaces).
- [x] `packages/plugin` and `packages/app` both build successfully.
- [x] Tauri app can launch a minimal menu bar shell (no full logic yet).
- [x] Shared instance record schema is documented in repo (versioned format).
- [x] Contract versioning policy is documented (required fields, additive changes, unknown-field tolerance).
- [x] Basic developer setup instructions are present in README.

## Test Plan / Success Verification

1. Automation: `pnpm install` succeeds from a fresh clone.
2. Automation: `pnpm --filter plugin build` and `pnpm --filter app build` both succeed.
3. Manual sanity: `pnpm --filter app dev` launches and shows tray icon.
4. Unit: schema fixture tests validate valid and invalid `instance.json` payloads.
5. Contract doc is reviewable and unambiguous for both plugin and app.

## Alternatives Considered

1. **Single package repo**
   - Pros: less tooling overhead now
   - Cons: poor separation, harder future Claude Code support
2. **Three-package split (`shared` package from day one)**
   - Pros: strict contracts
   - Cons: more initial complexity before proving shape
3. **Two-package monorepo with contract doc first**
   - Pros: balanced speed + clarity
   - Cons: shared package may still be needed later

## Recommended Approach

Use **two-package monorepo + explicit contract doc**.

Why:
- fastest path to delivery,
- clear boundary between plugin and app,
- low migration cost if a shared package is needed later.

## Scope Estimate

Medium
