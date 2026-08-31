# ADR-006: Financial Foundation Prioritization over Workflow Controls

## Status
Approved

## Context
Nebula ERP is architected as an enterprise-grade modular monolith designed to compete with tier-one ERP platforms (SAP, NetSuite, Odoo). During architectural review, a critical sequencing principle was established: financial transactions, multi-currency ledgers, cash management, and automated payment reconciliations form the indispensable economic spine of any ERP system. Implementing workflow approvals and multi-tier routing (Phase 4) prior to cementing robust financial accounting and settlement infrastructure (Phase 2) introduces severe architectural risk and rework.

## Decision
1. **Strict Phased Sequencing**: We mandate the completion of Phase 2 (Financial Foundation, including Cash & Bank Management, Multi-Currency Revaluation, and Payment Reconciliation) before advancing to Phase 4 (Enterprise Controls & Approval Workflows).
2. **Economic Spine Integrity**: All transactional postings (sales, purchase, POS, bank transfers) must route through the Enterprise Settlement Engine and General Ledger before workflow governance rules are enforced.
3. **ADR Enforcement**: Any future deviation from this sequence requires a formal Architecture Decision Record (ADR) override approved by the Principal Software Architect.

## Consequences
- **Positive**: Guarantees zero architectural debt in ledger settlement and cash visibility; prevents premature optimization of workflow routing over fundamental double-entry accounting.
- **Negative**: Defers enterprise approval matrix features until core financial modules are certified.
- **Risks**: Stakeholder requests for approval workflows must be managed against the foundational dependency chain.
