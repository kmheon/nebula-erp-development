# ADR-006: Financial Foundation Strategy

## ADR Number
ADR-006

## Title
Financial Foundation Strategy

## Status
Accepted

## Date
2026-08-31

## Context
During architectural planning, competing stakeholder requests demanded the immediate implementation of multi-tier approval workflows (Phase 4). However, core financial accounting infrastructure (Phase 2) is the economic spine of Nebula ERP.

## Problem Statement
Implementing approval routing and workflow automation before cementing double-entry accounting, general ledgers, cash management, and settlement engines introduces severe financial integrity risk.

## Decision
Strictly mandate Financial Foundation Prioritization: Phase 2 (Financial Foundation: Cash & Bank, Multi-Currency, Settlement, Reconciliation) must be fully completed and certified before advancing to Phase 4 (Enterprise Controls & Approval Workflows).

## Alternatives Considered
1. Parallel Workflow & Financial Development (Rejected due to risk of approving financially unsound transactions through unverified ledgers).

## Consequences
- **Positive**: Guaranteed zero architectural debt in settlement and general ledger posting; rigorous accounting integrity before governance activation.
- **Negative**: Defers approval matrix features until core financial modules are complete.

## Risks
- Managing stakeholder expectations regarding workflow feature delivery.

## Future Considerations
- Once Phase 2 financial modules are locked, proceed immediately to EPIC-02 Enterprise Controls.

## Related Tasks
- NEB-001A (Roadmap Revision & Governance)
- NEB-008, NEB-009, NEB-010

## Related Modules
- Accounting (`src/modules/accounting/`), Settlement (`src/modules/settlement/`), Banking (`src/modules/banking/`), Workflows (`src/modules/workflows/`).

## Related Documentation
- `/docs/adr/006-financial-foundation-strategy.md`
- `/docs/ARCHITECTURE_DECISIONS.md`
