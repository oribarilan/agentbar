# Ghostty Navigation Spec

## Overview

Ghostty navigation provides the "jump to session" workflow from Agentbar popover entries. It is secondary priority after status visibility but essential for fast context switching.

## Responsibilities

- Bring Ghostty to foreground on demand.
- Focus the user-selected tab when a mapping can be resolved.
- Report actionable failure states when focusing is not possible.

## Mapping Strategy (High-Level)

- Agentbar should use best-effort mapping between instance and Ghostty tab identity.
- Mapping may use project-based title hints and runtime metadata.
- If precise focus fails, fallback should still activate Ghostty and guide the user.

## Platform Constraints

- macOS implementation relies on system automation/accessibility capabilities.
- Accessibility permission requirements must be documented and surfaced.
- Behavior should fail gracefully when permissions are denied.

## UX Expectations

- Click action feels immediate.
- Failures are explicit and actionable (permission prompt guidance, missing tab guidance).
- Navigation actions should not disrupt status monitoring.

## Non-Functional Requirements

- Navigation logic must be isolated from core status ingestion.
- A failed focus action must not degrade other instances.

## Success Criteria

- In common developer workflows, selecting an instance in popover activates Ghostty and focuses the intended tab.
- Fallback behavior remains useful when exact tab targeting fails.
