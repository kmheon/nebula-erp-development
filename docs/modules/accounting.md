# Nebula ERP Module Specification: Accounting

## 1. Purpose
The Accounting module serves as the financial core of Nebula ERP, enforcing strict double-entry bookkeeping, general ledger integrity, and GAAP/IFRS compliance standards. It provides the immutable financial backbone upon which all commercial transactions (Sales, Purchase, POS, Expenses) post their financial impact.

## 2. Business Responsibilities
- Chart of Accounts (COA) hierarchy management (Assets, Liabilities, Equity, Revenue, Expenses).
- Double-entry Journal Entry creation, validation, and posting.
- General Ledger (GL) tracking and real-time account balance aggregation.
- Financial audit trail maintenance and period-end closing support.
- Automated posting hooks for sub-ledger transactions (Sales, Purchases, Payments).

## 3. Current Status
- **Implementation State**: Frontend SPA fully implemented with mock service adapters and React Query integration.
- **Maturity**: Production-ready UI components for Account Management, General Ledger views, and Journal Entry forms. Awaiting backend PostgreSQL/Drizzle ORM synchronization.

## 4. Architecture
- **Bounded Context**: Financial Ledger & Bookkeeping.
- **Pattern**: Domain-Driven Design (DDD) vertical slice. Separates UI components (`components/`), React hooks (`hooks/`), API services (`services/`), and data types (`types/`).
- **Isolation**: Strictly encapsulated; interacts with other modules solely through the Shared Kernel (`core/`) and Anti-Corruption Layer (`integrations/finance`).

## 5. Entities
- `Account`: Represents a General Ledger account (ID, code, name, type, normal balance, currency, active status, parent ID).
- `JournalEntry`: Represents an immutable financial transaction header (ID, entry number, date, reference, description, status, lines).
- `JournalEntryLine`: Represents individual debit and credit legs of a journal entry (account ID, description, debit amount, credit amount).
- `GeneralLedgerEntry`: Consolidated ledger view combining transaction metadata with running account balances.

## 6. Database (Target PostgreSQL Schema)
- `accounting.accounts`: PK id, code (unique), name, type (enum), currency, is_active, created_at.
- `accounting.journal_entries`: PK id, entry_number, date, description, status (draft, posted, void), created_at.
- `accounting.journal_entry_lines`: PK id, journal_entry_id (FK), account_id (FK), debit, credit, memo.
- **Constraints**: CHECK constraint enforcing `SUM(debit) == SUM(credit)` on every posted journal entry.

## 7. API Contracts
- `GET /api/v1/accounting/accounts` - Retrieve Chart of Accounts.
- `POST /api/v1/accounting/accounts` - Create new GL account.
- `GET /api/v1/accounting/journal-entries` - List journal entries with pagination and filtering.
- `POST /api/v1/accounting/journal-entries` - Submit and post new double-entry journal.
- `GET /api/v1/accounting/general-ledger` - Query general ledger activity by account and date range.

## 8. UI Components
- `AccountingPage`: Master dashboard for financial oversight.
- `AccountTable` & `AccountForm`: COA management interface.
- `JournalEntryTable` & `JournalEntryForm`: Double-entry transaction logger with real-time balance validation.
- `GeneralLedgerTable`: Detailed debit/credit transaction ledger view.

## 9. Dependencies
- `@tanstack/react-query`: Server state synchronization and caching.
- `core/`: Shared entity types and reference structures.

## 10. External Integrations
- `integrations/finance`: Exposes financial posting hooks to Sales, Purchase, POS, and Expense modules.

## 11. Business Rules
- **Balanced Entries**: Total debits must precisely equal total credits for any journal entry to be posted.
- **Immutable Postings**: Once a journal entry is posted, it cannot be modified or deleted. Corrections must be executed via reversing or adjusting journal entries.
- **Hierarchy Integrity**: Accounts must adhere to standard accounting classification (Assets, Liabilities, Equity, Revenue, Expenses).

## 12. Permission Rules
- `accounting:account:read` / `write`: Manage Chart of Accounts.
- `accounting:journal:read` / `write` / `post`: Create and post journal entries.
- `accounting:ledger:read`: View General Ledger and financial reports.

## 13. Events Emitted / Consumed
- **Emitted**: `ACCOUNTING_JOURNAL_POSTED`, `ACCOUNT_CREATED`.
- **Consumed**: `SALES_ORDER_INVOICED`, `PURCHASE_ORDER_RECEIVED`, `EXPENSE_APPROVED`, `PAYMENT_SETTLED`.

## 14. Future Improvements
- Automated currency revaluation for multi-currency accounts.
- AI-powered automated journal entry categorization and anomaly detection.
- Period-end closing wizard with automated retained earnings roll-forward.

## 15. Missing Features
- Bank reconciliation integration (currently handled in a separate module, needs deep binding).
- Fixed asset depreciation schedule auto-posting.

## 16. Risks
- Manual journal entries bypassing sub-ledgers, leading to reconciliation gaps.
- Precision errors in floating-point arithmetic (mitigated by integer-based minor currency units or Decimal libraries).

## 17. Technical Debt
- Service layer currently relies on mock local arrays; needs robust validation middleware upon backend connection.
