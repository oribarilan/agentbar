# Agent Telemetry Spec

## Overview

Agent telemetry adds richer observability (token usage and related metadata) after core status + navigation are stable.

## Responsibilities

- Extract telemetry-relevant data from OpenCode events/messages.
- Normalize telemetry per instance/session.
- Present telemetry in popover without cluttering core status UX.

## Telemetry Scope (Initial)

- Token usage per instance/session.
- Optional aggregate totals across active instances.

Future telemetry may include model/provider details, estimated cost, and tool activity summaries.

## UX Requirements

- Telemetry is secondary to status clarity.
- Users can access details on demand without increasing cognitive load in tray text.
- Missing telemetry data should be explicit (unknown/not available) rather than misleading.

## Data Quality Expectations

- Prefer clearly sourced values from OpenCode event/message structures.
- Track confidence/availability where fields are provider-dependent.
- Avoid presenting inferred costs as exact unless clearly marked.

## Non-Functional Requirements

- Telemetry collection must not materially impact responsiveness.
- Telemetry failures must not break status monitoring.

## Success Criteria

- Token usage is visible per instance in popover for supported sessions.
- Aggregate telemetry is available in a compact, comprehensible form.
