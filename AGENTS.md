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
