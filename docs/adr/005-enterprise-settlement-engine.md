# ADR-005: Enterprise Settlement Engine

## ADR Number
ADR-005

## Title
Enterprise Settlement Engine

## Status
Accepted

## Date
2026-08-31

## Context
Enterprise order-to-cash and procure-to-pay cycles require flexible allocation of payments and receipts across multiple invoices and credit notes, alongside real-time netting for dual-role entities (customers who are also vendors).

## Problem Statement
Scattering payment allocation logic across Sales, Accounts Receivable, Accounts Payable, and POS modules leads to inconsistent ledger posting and un-netted counterparty exposure.

## Decision
Build a centralized Enterprise Settlement Engine supporting configurable allocation policies (FIFO, LIFO, Due Date, Proportional, Manual) and a Unified Contact Ledger that automatically computes net positions (Receivables minus Payables).

## Alternatives Considered
1. Module-Isolated Allocation (Rejected because payments frequently cross sales and purchase boundaries in enterprise supply chains).

## Consequences
- **Positive**: Flawless double-entry settlement audit trails, automated customer/vendor netting, and flexible cash application policies.
- **Negative**: Centralized engine requires rigorous unit testing across all allocation policies.

## Risks
- Complex allocation edge cases during partial currency revaluations.

## Future Considerations
- Extend settlement allocation engine to support multi-currency realized gain/loss auto-posting.

## Related Tasks
- NEB-007 (Enterprise Settlement Engine & Unified Contact Ledger)

## Related Modules
- Settlement (`src/modules/settlement/`), Accounting (`src/modules/accounting/`), Sales (`src/modules/sales/`), Purchase (`src/modules/purchase/`).

## Related Documentation
- `/docs/adr/005-enterprise-settlement-engine.md`
- `/docs/ARCHITECTURE_DECISIONS.md`
