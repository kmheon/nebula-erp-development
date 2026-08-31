# ADR-002: Shared Kernel

## ADR Number
ADR-002

## Title
Shared Kernel

## Status
Accepted

## Date
2026-02-01

## Context
As Nebula ERP expands across multiple enterprise domains, cross-cutting concerns (currency formatting, audit logging, toast notifications, base API clients, and UI design primitives) risk being duplicated across modules.

## Problem Statement
Duplicating utility and UI code across domain modules leads to inconsistent formatting, divergent error handling, increased bundle size, and maintenance friction.

## Decision
Establish a centralized Shared Kernel (`src/core/` and `src/components/ui/`) containing standardized utilities, common DTOs, base hooks, and design token primitives safely consumed by all domain modules without violating domain isolation.

## Alternatives Considered
1. Module-Specific Duplication (Rejected to maintain DRY principles and UI consistency).
2. External Monolithic Packages (Rejected to keep repository self-contained and atomic).

## Consequences
- **Positive**: Unified code quality, consistent currency/date formatting, and cohesive enterprise styling.
- **Negative**: Changes to shared kernel components impact all modules, requiring careful regression testing.

## Risks
- Over-coupling domain modules through shared utility leakage.

## Future Considerations
- Periodically audit shared kernel to ensure pure utility status and prevent business domain logic from leaking into global packages.

## Related Tasks
- NEB-000, NEB-001A

## Related Modules
- Core Shared (`src/core/`), UI Library (`src/components/ui/`), and all domain modules.

## Related Documentation
- `/docs/adr/002-shared-kernel.md`
- `/docs/ARCHITECTURE_DECISIONS.md`
