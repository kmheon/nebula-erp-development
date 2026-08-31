# Nebula ERP — Business Rules Repository

This document records all canonical business rules governing Nebula ERP. Every business rule defined here is enforced across backend services and frontend validation engines.

---

## 1. Financial & General Ledger Rules (EPIC-01)

### BR-FIN-001: Double-Entry Balancing
- **Rule**: Every journal entry, invoice posting, payment settlement, and inventory adjustment must have total debits exactly equal to total credits (balanced to 4 decimal places). Unbalanced postings are rejected at the transaction boundary.
- **Enforcement**: General Ledger Service / Settlement Engine.

### BR-FIN-002: Fiscal Period Locking
- **Rule**: Transactions cannot be posted to a closed or locked fiscal period. Only users with the `Finance Admin` role can reopen periods with an immutable audit log entry.
- **Enforcement**: Accounting Period Control Middleware.

### BR-FIN-003: Settlement Allocation Policy
- **Rule**: Incoming payments or vendor disbursements must be allocated against open invoices/bills using defined allocation strategies: FIFO (default), LIFO, Due Date, Proportional, or Manual.
- **Enforcement**: Enterprise Settlement Engine (`NEB-007`).

### BR-FIN-004: Dual-Role Contact Netting
- **Rule**: Entities acting as both Customer and Vendor in the Unified Contact Ledger must maintain real-time net position calculation (Receivables minus Payables) for credit limit evaluation and payment netting.
- **Enforcement**: Unified Contact Ledger (`NEB-007`).

---

## 2. Procurement & Inventory Rules (EPIC-04 & EPIC-05)

### BR-PUR-001: Automated 3-Way Matching
- **Rule**: Vendor bills must match Purchase Orders and Goods Receipt Notes within configured tolerance bands (default: 1% value variance, 0% quantity variance over receipt). Bills exceeding tolerance require supervisor approval.
- **Enforcement**: 3-Way Matching Engine (`NEB-003`).

### BR-INV-001: Landed Cost Apportionment
- **Rule**: Freight, customs duty, and insurance costs associated with procurement shipments must be apportioned across received inventory items based on quantity, weight, or purchase value before inventory valuation is finalized.
- **Enforcement**: Landed Cost Allocation Service (`NEB-006`).

### BR-INV-002: Negative Inventory Prevention
- **Rule**: Inventory issues, sales fulfillments, and stock transfers cannot result in negative stock balances unless explicit warehouse override permissions are granted.
- **Enforcement**: Inventory Valuation & Stock Movement Service.

---

## 3. Governance & Control Rules (EPIC-02)

### BR-GOV-001: Strict Phased Sequencing
- **Rule**: Core financial infrastructure (Phase 2 / EPIC-01) must be fully completed before enterprise workflow automation and approval matrix engines (Phase 4 / EPIC-02) are enforced.
- **Enforcement**: Architecture Decision Record (ADR-006) & Master Implementation Roadmap.

### BR-GOV-002: Mandatory Documentation Protocol
- **Rule**: Every completed task must update the master roadmap, changelog, mission control telemetry, project journal, and business rules. No implementation decision may exist solely in conversational history.
- **Enforcement**: Project Governance & CI Audit.
