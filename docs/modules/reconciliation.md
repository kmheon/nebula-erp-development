# Nebula ERP Module Specification: Reconciliation

## 1. Purpose
The Reconciliation module manages bank statement imports, automated transaction matching algorithms, bank fee adjustments, and general ledger reconciliation to ensure treasury accuracy.

## 2. Business Responsibilities
- Bank statement CSV/OFX/MT940 file ingestion.
- Automated and manual transaction matching against General Ledger cash accounts.
- Discrepancy flagging and adjusting journal entry generation.

## 3. Current Status
- **Implementation State**: Fully developed frontend reconciliation tables, bank import forms, and matching service logic.
- **Maturity**: Production-ready UI and matching engine.

## 4. Architecture
- **Bounded Context**: Treasury & Financial Reconciliation.
- **Pattern**: DDD vertical slice residing in `apps/web/src/modules/reconciliation/`.

## 5. Entities
- `BankStatementItem`: Ingested bank transaction record (date, description, amount, reference).
- `LedgerTransaction`: Internal payment or journal entry line.
- `ReconciliationMatch`: Matched pair or group linking bank statement lines to ledger transactions.

## 6. Database (Target PostgreSQL Schema)
- `reconciliation.statements`: PK id, bank_account_id (FK), import_date, statement_date, opening_balance, closing_balance.
- `reconciliation.statement_lines`: PK id, statement_id (FK), date, description, amount, status (unmatched, matched).
- `reconciliation.matches`: PK id, statement_line_id (FK), ledger_transaction_id, matched_at, matched_by.

## 7. API Contracts
- `POST /api/v1/reconciliation/import` - Upload bank statement file.
- `GET /api/v1/reconciliation/unmatched` - Retrieve unmatched bank and ledger items.
- `POST /api/v1/reconciliation/match` - Manually match statement line to ledger transaction.

## 8. UI Components
- `ReconciliationPage`: Master reconciliation dashboard.
- `BankImportForm`: Statement file upload interface.
- `ReconciliationTable`: Side-by-side matching workstation.

## 9. Dependencies
- `@tanstack/react-query`, `modules/accounting/`, `modules/payments/`.

## 10. External Integrations
- `integrations/finance`: Interacts with Accounting and Payments ledgers to verify cash balances.

## 11. Business Rules
- **Zero Variance**: A reconciliation period is closed only when statement ending balances match ledger cash balances after accounting for outstanding deposits and unpresented checks.

## 12. Permission Rules
- `reconciliation:bank:reconcile`: Perform bank reconciliations and post adjustments.

## 13. Events Emitted / Consumed
- **Emitted**: `BANK_RECONCILED`, `RECONCILIATION_DISCREPANCY_FLAGGED`.

## 14. Future Improvements
- Plaid / Open Banking API integration for automatic daily bank statement synchronization.
- Machine learning fuzzy matching for complex transaction descriptions.

## 15. Missing Features
- Multi-currency bank statement conversion.

## 16. Risks
- Unreconciled bank fees or missing transactions remaining undetected over long fiscal periods.

## 17. Technical Debt
- Matching service algorithm currently runs client-side; needs high-performance server-side indexing.
