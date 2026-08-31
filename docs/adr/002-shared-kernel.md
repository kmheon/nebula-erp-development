# ADR-002: Shared Kernel & Cross-Cutting Services

## Status
Accepted

## Context
As Nebula ERP expands across multiple enterprise domains, cross-cutting concerns (currency formatting, audit logging, toast notifications, API clients, base UI components) risk being duplicated across modules.

## Problem
Duplication of core utility logic leads to inconsistent formatting, divergent error handling, and bloated bundle sizes.

## Decision
Establish a rigorous **Shared Kernel** (`src/core/` and `src/components/ui/`) containing standardized utilities, common DTOs, base hooks, and design token primitives that can be safely consumed by all modules without violating domain isolation.

## Alternatives Considered
1. **Module-Specific Duplication**: Rejected to maintain DRY principles and consistent UI/UX.
2. **External Monolithic Library**: Rejected to keep repository self-contained and modular.

## Consequences
- **Positive**: Unified code quality, consistent currency/date formatting, and cohesive enterprise styling.
- **Negative**: Changes to shared kernel components impact all modules, requiring careful regression testing.
- **Risks**: Over-coupling domain modules through shared utilities.

## Related Modules
- Core Shared (`src/core/`), UI Library (`src/components/ui/`), and all domain modules.

## Related Tasks
- NEB-000, NEB-001A

## Future Notes
- Periodically audit shared kernel to ensure domain logic does not leak into global utility packages.
