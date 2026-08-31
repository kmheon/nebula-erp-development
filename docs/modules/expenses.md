# Nebula ERP Module Specification: Expenses

## 1. Purpose
The Expenses module tracks operational expenditures, employee expense claims, category classifications, and vendor expense disbursement.

## 2. Business Responsibilities
- Expense category configuration and GL account mapping.
- Expense claim submission, review, approval, and reimbursement workflow.
- Integration with accounts payable and general ledger.

## 3. Current Status
- **Implementation State**: Fully developed frontend module with expense forms, tables, and category management.
- **Maturity**: Production-ready UI components awaiting backend linking.

## 4. Architecture
- **Bounded Context**: Operational Expenditures.
- **Pattern**: DDD vertical slice residing in `apps/web/src/modules/expenses/`.

## 5. Entities
- `Expense`: Represents an individual expenditure (ID, title, amount, category ID, vendor ID, date, status, receipt URL, employee ID).
- `ExpenseCategory`: Classification grouping for expenses with default GL account mapping.

## 6. Database (Target PostgreSQL Schema)
- `expenses.categories`: PK id, name, description, default_gl_account_id.
- `expenses.expenses`: PK id, title, amount, currency, category_id (FK), vendor_id (FK), date, status (draft, pending, approved, paid), receipt_url, created_at.

## 7. API Contracts
- `GET /api/v1/expenses` - List expenses.
- `POST /api/v1/expenses` - Submit new expense claim.
- `POST /api/v1/expenses/{id}/approve` - Approve expense claim.

## 8. UI Components
- `ExpensesPage`: Master expense management view.
- `ExpenseTable` & `ExpenseForm`: Expense record management and submission.
- `ExpenseCategoryTable` & `ExpenseCategoryForm`: Category classification settings.

## 9. Dependencies
- `@tanstack/react-query`, `core/`.

## 10. External Integrations
- `integrations/finance`: Automatically posts approved expenses to the General Ledger and Accounts Payable.

## 11. Business Rules
- **Approval Workflow**: Expenses above configured thresholds require managerial approval before payment disbursement.
- **GL Posting**: Upon approval and payment, an automatic journal entry is created (Debit: Expense Account, Credit: Cash / Accounts Payable).

## 12. Permission Rules
- `expenses:expense:read` / `write`: Submit and manage expenses.
- `expenses:expense:approve`: Approve expenditure claims.

## 13. Events Emitted / Consumed
- **Emitted**: `EXPENSE_SUBMITTED`, `EXPENSE_APPROVED`, `EXPENSE_PAID`.

## 14. Future Improvements
- AI receipt OCR scanning for automatic field extraction.
- Corporate credit card transaction reconciliation feeds.

## 15. Missing Features
- Multi-currency expense conversion.

## 16. Risks
- Fraudulent or duplicate expense submissions without rigorous receipt validation.

## 17. Technical Debt
- Receipt storage currently mocked; requires object storage integration (S3/GCS).
