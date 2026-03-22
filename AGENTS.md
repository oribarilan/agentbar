# AGENTS.md

This file is the operating guide for coding agents in this repository.

---

## Project Documentation Model

### `specs/` = high-level product and architecture intent

Specs define:
- what we are building,
- why it exists,
- component boundaries,
- high-level success criteria.

Specs intentionally stay high-level and avoid detailed implementation sequencing.

`specs/main.md` is the **primary spec driver**.
All component specs (`specs/<component>.md`) must align with and refine `specs/main.md`.

### `.todo/` = execution plan and delivery work

Task files define implementation-level execution for each sprint/task.
They are the actionable source of truth for delivery.

---

## Task File Requirements (Mandatory)

Every task file under `.todo/sprintNN/<task-name>.md` must include:

1. **Objective / what should be accomplished**
2. **Definition of Done (DoD)**
3. **Test Plan / success verification**
4. **Alternatives considered**
5. **Recommended approach + why**

If any of these are missing, the task is incomplete as a planning artifact.

---

## Sprint Structure

Sprints are grouped by independent value bundles:

- `.todo/sprint01/` = foundational + first shippable baseline
- `.todo/sprint02/` = next shippable improvement bundle
- `.todo/sprint03/` = navigation-focused bundle
- `.todo/sprint04/` = telemetry + extensibility groundwork

Each sprint should make sense as its own step and deliver meaningful user value.

---

## Engineering Practices (Required)

### 1) Single Responsibility
- Every class/file/struct should have a clear single responsibility.
- If a file handles unrelated concerns, split it.

### 2) Small Files
- Keep files as small as reasonably possible.
- Target: **under 500 lines of code per file**.
- If approaching limit, refactor before adding more complexity.

### 3) Unit Tests First-Class
- Write unit tests as much as possible.
- Unit tests must be isolated and deterministic.
- No external network, filesystem, or process dependencies unless explicitly mocked/faked.

### 4) Web Simulator Requirement
- Maintain a simulator web app surface for the app UI/state flows.
- Simulator enables fast feedback and browser-based automation.

### 5) UI Automation Requirement
- Build UI automation tests on top of simulator using Playwright.
- Cover critical UX paths and regressions for visual/behavioral correctness.

### 6) Integration Tests Requirement
- Use simulator with a real backend for tested components.
- Verify component interaction contracts and state transitions.

### 7) E2E Tests Requirement
- Use simulator UI layer on top of the real stack where feasible.
- Automate full user flows to prevent cross-layer regressions.

### 8) KISS
- Prefer simple, robust solutions over clever abstractions.
- If complexity is necessary, document why.

### 9) DRY
- Reuse logic when repetition appears.
- Avoid premature abstraction; apply the rule of three.

### 10) Challenge Ideas Interactively
- Do not blindly execute questionable ideas.
- Challenge concepts/designs with concise trade-off feedback.
- Ask targeted questions and act as an interactive partner.

---

## How Agents Should Work

1. Read `specs/main.md` first.
2. Read relevant component specs under `specs/`.
3. Read active sprint task file(s) under `.todo/sprintNN/<task-name>.md`.
4. Implement according to task details (DoD + test plan + chosen recommendation).
5. Keep implementation aligned with spec priority order:
   - P1 status visibility,
   - P2 navigation,
   - P3 telemetry.

---

## Additional Cross-Project Engineering Standards

### Engineering Principles

These apply on top of the Engineering Practices above and are non-negotiable. When any are at risk, raise a red flag.

4. **Clean Code.** Readable, intention-revealing names. No dead code, no commented-out code. Small functions. Code should explain itself; comments explain _why_, not _what_.
5. **Performance.** Never block the main thread. Be allocation-aware in hot paths. Defer non-critical work. Virtualize long lists. Debounce expensive operations. Every feature should be evaluated for its performance impact.
6. **Security.** Minimize attack surface. Apply least-privilege. Sanitize and validate all inputs — especially file paths and API/IPC parameters. Never log secrets or PII. Treat dependencies as attack surface: audit, minimize, prefer well-maintained libraries.
7. **Accessibility.** Focus management, ARIA roles, and semantic HTML are required. Screen reader support is a goal, not an afterthought.
8. **Observability.** Use structured logging. Errors should be traceable. Define clear log levels and never log sensitive data.
9. **Error Resilience.** Handle failures gracefully at every layer. Never expose raw stack traces or internal error details to the UI.
10. **TDD When Debugging.** When an issue surfaces, write a failing test first if feasible, then fix and see it go green. Regression tests are mandatory for bugs.

**Challenge and suggest.** When implementing any feature, if there is an alternative approach that is more performant, more secure, simpler, or more accessible — raise it. Don't silently pick a suboptimal path. Present the tradeoff and let the decision be made explicitly.

---

### Rust Conventions

- **Error handling**: Use `Result`/`Option` everywhere. `thiserror` for library-style errors, `anyhow` only in top-level handlers. Never `unwrap()`/`expect()` in production code.
- **Naming**: `snake_case` for modules, functions, variables. Types are `PascalCase`.
- **Module boundaries**: One responsibility per module. Keep functions under 50 lines. Split early.
- **Immutability**: Prefer `let` over `let mut`. Clone only when borrowing is not feasible.
- **Iteration**: Prefer iterators and combinators over manual loops. Don't `.collect()` too early.
- **Documentation**: `///` doc comments on all public items. `//!` for module-level docs.
- **Linting**: Code must pass `cargo clippy -- -D warnings` and `cargo fmt --check`.
- **Unsafe**: Never use `unsafe` unless there is a clear, documented justification.
- **Dependencies**: Pin major versions in `Cargo.toml`. Audit new crates before adding.

---

### TypeScript / React Conventions

- **Components**: Functional only. PascalCase filenames and component names.
- **Types**: Strict mode enabled. Explicit interfaces/types for props, state, and API responses. No `any`.
- **Hooks**: Extract reusable logic into custom hooks. Prefix with `use`.
- **State**: Local state by default. Shared stores (Zustand/Context) for cross-cutting concerns only.
- **Naming**: `camelCase` functions/variables, `PascalCase` components/types, `UPPER_SNAKE` constants.
- **Styling**: CSS Modules. No global styles in component files.
- **Imports**: Relative imports. No `require()`. Environment variables via `import.meta.env`.

---

### Git Conventions

- **Conventional commits**: `feat:`, `fix:`, `refactor:`, `test:`, `docs:`, `chore:`.
- **Focused commits**: One logical change per commit. Keep diffs small and reviewable.
- **Never commit or push without explicit user approval.** Present the changes and wait for confirmation before running `git commit` or `git push`.

---

## Contribution Workflow

- Follow `CONTRIBUTE.md` for the repository feature workflow.
- Do not develop directly on `main`.
- Create a dedicated feature branch for each change.
- Push branch changes and merge via Pull Request only.
