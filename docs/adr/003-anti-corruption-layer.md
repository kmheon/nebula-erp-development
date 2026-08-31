# ADR-003: Anti-Corruption Layer (ACL) for External Integrations

## Status
Accepted

## Context
Nebula ERP integrates with external banking APIs, payment gateways, and third-party tax/logistics services. External schema volatility must not corrupt internal enterprise domain models.

## Problem
Directly binding external API schemas to core General Ledger and Inventory models creates fragile coupling and cascading database breaking changes when third-party APIs update.

## Decision
Enforce a strict **Anti-Corruption Layer (ACL)** pattern using adapter services that translate incoming external payloads into canonical internal DTOs before committing transactions to core domain modules.

## Alternatives Considered
1. **Direct Domain Binding**: Rejected due to high coupling and vulnerability to upstream API changes.

## Consequences
- **Positive**: Complete insulation of internal ledger integrity from third-party schema drift.
- **Negative**: Requires maintaining explicit mapping/translation functions.
- **Risks**: Translation layer overhead during high-volume batch imports.

## Related Modules
- Banking (`src/modules/banking/`), Payments (`src/modules/payments/`), Accounting (`src/modules/accounting/`).

## Related Tasks
- NEB-008 (Enterprise Cash & Bank Management)
- NEB-010 (Enterprise Payment Reconciliation)

## Future Notes
- Implement JSON schema validation guards at the boundary of every ACL adapter.
