# Agentbar

macOS menu bar companion for AI coding sessions (starting with OpenCode).

## Prerequisites

| Tool | Version |
| --- | --- |
| Node.js | >= 22 |
| pnpm | >= 10 |
| just | latest |
| Rust/Cargo | stable |
| Tauri prerequisites | v2 macOS deps |

## Quickstart

```bash
pnpm install
just test
just check
```

## Simulator + UI Automation

```bash
# run simulator
pnpm --filter @agentbar/app dev

# install Playwright browser once
pnpm --filter @agentbar/app exec playwright install --with-deps chromium

# run UI smoke tests
pnpm --filter @agentbar/app test:ui
```

`just test` runs:

- plugin unit tests
- app unit/integration tests
- app Rust tray tests
- app Playwright smoke tests

## Workspace Layout

```text
packages/
  app/      # Tauri + Svelte simulator app
  plugin/   # OpenCode presence registration module
```

## Quality Commands

| Command | Description |
| --- | --- |
| `just lint` | run workspace lint/type checks |
| `just format` | run workspace formatting checks |
| `just test` | run workspace tests |
| `just check` | lint + format + test |

All commands delegate through root `pnpm` scripts (`pnpm -r`).

## CI Gate

GitHub Actions workflow: `.github/workflows/ci.yml`

- Trigger: pull requests to `main` + manual dispatch
- Steps: install dependencies, run `just test`
- Required check name: **`just test`**

## PR-Only Flow and Branch Protection

Branch protection for `main` is enabled with:

1. Require pull request before merge
2. Require status checks to pass (`just test`)
3. Disallow direct pushes/bypass for normal contributors

Verified on 2026-03-20 via GitHub branch protection API.

## Greptile Review Bot

Configured via `greptile.json` with:

- `statusCheck: true`
- `strictness: 2`
- bot exclusions (`dependabot[bot]`, `renovate[bot]`)
- `includeBranches: ["main"]`
- `commentTypes: ["logic", "syntax"]`

Rollout recommendation:

1. advisory mode for first PRs
2. once stable, add Greptile check as required status check

For OSS pricing/program details, apply via Greptile open-source program.

Current repo policy note:

- Greptile is configured in-repo (`greptile.json`) and intended to start as advisory.
- If OSS application is not approved, fallback is to keep Greptile advisory only until paid usage is explicitly approved by maintainers.

## Instance Contract + Versioning Policy

Canonical contract lives in `packages/plugin/src/instance-record.ts`.

Policy:

1. Current schema version is `1`.
2. Additive changes are allowed without version bump.
3. Readers must tolerate unknown fields.
4. Breaking changes (rename/remove/semantic change of required fields) require a schema version bump.
5. App-side parsing must gracefully skip malformed records.

## Specs and Planning

- Product spec driver: `specs/main.md`
- Sprint plan: `.todo/sprint*/`

## Branch Protection Maintenance Checklist

If branch rules are edited in GitHub settings, re-verify:

1. PR required before merge to `main`.
2. Required status check includes `just test`.
3. Direct pushes to `main` remain blocked for contributors.
4. (Optional) keep Greptile as advisory unless maintainers explicitly promote it.
