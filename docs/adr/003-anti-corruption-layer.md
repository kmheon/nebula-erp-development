# ADR-003: Anti-Corruption Layer

## ADR Number
ADR-003

## Title
Anti-Corruption Layer

## Status
Accepted

## Date
2026-02-20

## Context
Nebula ERP integrates with external banking APIs, payment gateways, and third-party tax/logistics services. External schema volatility must not corrupt internal enterprise domain models.

## Problem Statement
Directly binding external API schemas to core General Ledger and Inventory models creates fragile coupling and cascading database breaking changes when third-party APIs update.

## Decision
Enforce a strict Anti-Corruption Layer (ACL) pattern using adapter services that translate incoming external payloads into canonical internal DTOs before committing transactions to core domain modules.

## Alternatives Considered
1. Direct Domain Binding (Rejected due to high coupling and vulnerability to upstream API schema drift).

## Consequences
- **Positive**: Complete insulation of internal ledger integrity from third-party schema changes.
- **Negative**: Requires maintaining explicit mapping and translation functions.

## Risks
- Translation layer overhead during high-volume batch imports.

## Future Considerations
- Implement JSON schema validation guards at the boundary of every ACL adapter.

## Related Tasks
- NEB-008 (Enterprise Cash & Bank Management)
- NEB-010 (Enterprise Payment Reconciliation)

## Related Modules
- Banking (`src/modules/banking/`), Payments (`src/modules/payments/`), Accounting (`src/modules/accounting/`).

## Related Documentation
- `/docs/adr/003-anti-corruption-layer.md`
- `/docs/ARCHITECTURE_DECISIONS.md`
