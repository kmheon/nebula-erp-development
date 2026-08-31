# Nebula ERP Module Specification: Payments

## 1. Purpose
The Payments module manages accounts receivable (customer collections), accounts payable (supplier disbursements), payment allocation against invoices, payment accounts, and gateway settlements.

## 2. Business Responsibilities
- Recording customer incoming payments and supplier disbursements.
- Payment allocation against outstanding sales invoices or purchase bills.
- Multi-channel payment account management (Bank accounts, Cash registers, Stripe/Gateway accounts).
- Settlement tracking and reconciliation.

## 3. Current Status
- **Implementation State**: Highly comprehensive frontend implementation including payment tables, forms, allocations, customer receivables, supplier payables, and payment channel management.
- **Maturity**: Production-grade enterprise UI architecture.

## 4. Architecture
- **Bounded Context**: Financial Settlements & Treasury.
- **Pattern**: DDD vertical slice residing in `apps/web/src/modules/payments/`.

## 5. Entities
- `Payment`: Represents a financial settlement transaction (ID, contact ID, amount, currency, payment method, reference number, date, status).
- `PaymentAllocation`: Links a payment amount to specific invoices or bills.
- `PaymentAccount`: Treasury account (Bank, Cash drawer, POS terminal account).
- `Settlement`: Gateway or bank batch settlement record.

## 6. Database (Target PostgreSQL Schema)
- `payments.accounts`: PK id, name, type, currency, current_balance, gl_account_id.
- `payments.payments`: PK id, contact_id (FK), amount, currency, payment_method, reference_code, payment_date, status.
- `payments.allocations`: PK id, payment_id (FK), document_id, allocated_amount.
- `payments.settlements`: PK id, account_id (FK), batch_reference, total_amount, settlement_date, status.

## 7. API Contracts
- `GET /api/v1/payments` - List payment transactions.
- `POST /api/v1/payments` - Record new payment.
- `POST /api/v1/payments/allocate` - Allocate payment against open invoices.
- `GET /api/v1/payments/receivables` - Outstanding customer receivables aging report.
- `GET /api/v1/payments/payables` - Outstanding supplier payables aging report.

## 8. UI Components
- `PaymentsPage`: Master treasury and settlement dashboard.
- `PaymentTable` & `PaymentForm`: Payment record management.
- `PaymentAllocationTable` & `PaymentAllocationForm`: Invoice matching interface.
- `CustomerReceivableTable` & `SupplierPayableTable`: Aging reports.
- `PaymentAccountTable` & `PaymentAccountForm`: Treasury account management.
- `SettlementTable` & `SettlementForm`: Gateway reconciliation.

## 9. Dependencies
- `@tanstack/react-query`, `core/`.

## 10. External Integrations
- `integrations/finance`: Posts settlement journal entries directly to Accounting (Debit: Cash/Bank, Credit: Accounts Receivable).

## 11. Business Rules
- **Exact Allocation**: Total payment amount allocated across invoices cannot exceed the total payment amount.
- **Ledger Impact**: Recording a payment must immediately update the customer/supplier contact balance and post to the General Ledger.

## 12. Permission Rules
- `payments:payment:read` / `write`: Manage payment records.
- `payments:settlement:process`: Execute bank and gateway settlements.

## 13. Events Emitted / Consumed
- **Emitted**: `PAYMENT_RECEIVED`, `PAYMENT_ALLOCATED`, `PAYMENT_SETTLED`.
- **Consumed**: `SALES_ORDER_INVOICED`, `PURCHASE_ORDER_BILLED`.

## 14. Future Improvements
- Automated Stripe and bank webhook payment ingestion.
- Multi-currency exchange gain/loss calculation on settlement.

## 15. Missing Features
- Direct credit card processing terminal integration.

## 16. Risks
- Unallocated payments creating ambiguity in customer aging balances.

## 17. Technical Debt
- Allocation matching logic currently performed client-side; needs robust server-side validation.
