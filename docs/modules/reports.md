# Nebula ERP Module Specification: Reports

## 1. Purpose
The Reports module generates foundational financial statements (Balance Sheet, Profit & Loss, Cash Flow Statement) and executive analytical summaries in compliance with GAAP/IFRS standards.

## 2. Business Responsibilities
- Balance Sheet generation (Assets = Liabilities + Equity).
- Profit & Loss (Income Statement) aggregation (Revenue - Expenses).
- Cash Flow Statement reporting (Operating, Investing, Financing activities).
- Filterable date-range and multi-dimensional financial reporting.

## 3. Current Status
- **Implementation State**: Fully developed frontend reporting tables, financial summary cards, filtering widgets, and PDF/Excel export utilities.
- **Maturity**: Production-grade enterprise reporting suite.

## 4. Architecture
- **Bounded Context**: Financial Reporting & Analytics.
- **Pattern**: DDD vertical slice residing in `apps/web/src/modules/reports/`.

## 5. Entities
- `BalanceSheetReport`: Structured asset, liability, and equity summary.
- `ProfitLossReport`: Revenue and expense category breakdown with net income calculation.
- `CashFlowReport`: Cash inflow and outflow categorization.

## 6. Database (Target PostgreSQL Schema)
- Operates via complex aggregation queries across `accounting.accounts`, `accounting.journal_entries`, and `accounting.journal_entry_lines`.

## 7. API Contracts
- `GET /api/v1/reports/balance-sheet` - Generate balance sheet for date.
- `GET /api/v1/reports/profit-loss` - Generate P&L statement for period.
- `GET /api/v1/reports/cash-flow` - Generate cash flow statement.

## 8. UI Components
- `ReportsPage`: Master reporting dashboard.
- `BalanceSheetTable`: Formatted balance sheet view.
- `ProfitLossTable`: Formatted income statement.
- `CashFlowTable`: Cash flow statement view.
- `FinancialSummaryCards`: Key financial ratio indicators.
- `ReportFilter`: Date range and currency filter controls.

## 9. Dependencies
- `@tanstack/react-query`, `modules/accounting/`.

## 10. External Integrations
- `integrations/finance`: Pulls live ledger balances from the Accounting module.

## 11. Business Rules
- **Accounting Equation**: Balance sheet reports must strictly prove `Assets = Liabilities + Equity`.
- **Accrual / Cash Basis**: Reports must support both accrual and cash-basis calculation toggles where applicable.

## 12. Permission Rules
- `reports:financial:read`: Access core financial statements and executive reports.

## 13. Events Emitted / Consumed
- **Consumed**: Listens to journal entry postings to invalidate report caches.

## 14. Future Improvements
- Custom report builder with drag-and-drop account groupings.
- XBRL tagging for regulatory electronic filing.

## 15. Missing Features
- Budget vs. Actual variance reporting.

## 16. Risks
- Misinterpretation of financial statements if accounting period closing is incomplete.

## 17. Technical Debt
- Report calculations currently aggregated on client; must shift to high-performance SQL recursive queries.
