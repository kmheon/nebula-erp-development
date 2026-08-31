# ADR-007: Reusable Module Policy

## ADR Number
ADR-007

## Title
Reusable Module Policy

## Status
Accepted

## Date
2026-08-31

## Context
As Nebula ERP grows, developers and AI agents risk writing redundant UI components, tables, and forms instead of inspecting existing codebase modules.

## Problem Statement
Uncontrolled duplication of UI components and service methods leads to bloated codebase size, divergent component APIs, and inconsistent user experience across enterprise modules.

## Decision
Enforce a strict Reusable Module Policy (Phase 1 & Phase 2 of development governance): Before creating any new component, service, hook, form, or table, engineers must thoroughly search the codebase and reuse or extend existing implementations.

## Alternatives Considered
1. Ad-hoc component creation per module (Rejected due to code bloat and inconsistency).

## Consequences
- **Positive**: Lean bundle size, highly cohesive design system usage, consistent UX patterns, and rapid feature velocity.
- **Negative**: Requires upfront search and code discovery before feature implementation.

## Risks
- Developers bypassing search due to time pressure.

## Future Considerations
- Implement static analysis linter rules to flag duplicate or near-identical component declarations.

## Related Tasks
- NEB-GOV-01, NEB-GOV-02

## Related Modules
- All modules across Nebula ERP.

## Related Documentation
- `/docs/DEVELOPMENT_GOVERNANCE.md`
- `/AGENTS.md`
