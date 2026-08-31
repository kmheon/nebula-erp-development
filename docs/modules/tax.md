# Nebula ERP Module Specification: Tax

## 1. Purpose
The Tax module manages sales tax rates, value-added tax (VAT) schedules, jurisdiction rules, tax grouping, and tax liability reporting for compliance with local and international tax authorities.

## 2. Business Responsibilities
- Tax rate and tax code catalog management (Standard, Reduced, Exempt).
- Multi-jurisdiction tax configuration.
- Tax calculation hooks for Sales, POS, and Purchase modules.
- Tax liability summary reporting for tax filing.

## 3. Current Status
- **Implementation State**: Fully developed frontend tax tables, forms, summary cards, and calculation hooks.
- **Maturity**: Production-ready tax management module.

## 4. Architecture
- **Bounded Context**: Taxation & Regulatory Compliance.
- **Pattern**: DDD vertical slice residing in `apps/web/src/modules/tax/`.

## 5. Entities
- `TaxRate`: Represents a tax code (ID, name, rate percentage, jurisdiction, is_active).
- `TaxSummary`: Aggregated tax collected vs. tax paid for filing periods.

## 6. Database (Target PostgreSQL Schema)
- `tax.rates`: PK id, code, name, percentage, jurisdiction, is_active, gl_tax_liability_account_id.
- `tax.transactions`: PK id, document_id, tax_rate_id (FK), taxable_amount, tax_amount, recorded_at.

## 7. API Contracts
- `GET /api/v1/tax/rates` - List active tax rates.
- `POST /api/v1/tax/rates` - Create tax rate.
- `GET /api/v1/tax/summary` - Retrieve tax liability summary report.

## 8. UI Components
- `TaxPage`: Master tax management dashboard.
- `TaxTable` & `TaxForm`: Tax rate configuration.
- `TaxSummaryCard`: Tax liability metrics.

## 9. Dependencies
- `@tanstack/react-query`, `core/`.

## 10. External Integrations
- `integrations/sales` & `integrations/purchase`: Provides real-time tax calculation for invoices and purchase orders.
- `integrations/finance`: Posts tax liabilities to dedicated GL tax accounts.

## 11. Business Rules
- **Accurate Computation**: Tax amounts must be rounded to minor currency units in accordance with local tax authority guidelines.
- **Liability Posting**: Collected sales tax must be credited to a Tax Liability GL account, separate from revenue accounts.

## 12. Permission Rules
- `tax:rate:read` / `write`: Manage tax rates and rules.
- `tax:report:read`: Access tax liability reports.

## 13. Events Emitted / Consumed
- **Emitted**: `TAX_RATE_UPDATED`, `TAX_LIABILITY_RECORDED`.

## 14. Future Improvements
- Automated Avalara / Vertex tax API integration for complex multi-state address taxation.

## 15. Missing Features
- Multi-tier compound tax calculations.

## 16. Risks
- Incorrect tax rate application leading to audit penalties.

## 17. Technical Debt
- Tax calculation logic currently client-side; needs centralized server-side computation.
