# Nebula ERP Module Specification: POS (Point of Sale)

## 1. Purpose
The POS module is an enterprise-grade, high-performance cashier and retail checkout terminal designed for retail environments, supporting barcode scanning, offline resilience, cash drawer shift management, loyalty points, promotional discounts, returns, and receipt printing.

## 2. Business Responsibilities
- Cashier checkout interface and cart management.
- Barcode scanning and product quick-search.
- Shift opening, cash drawer reconciliation (Z-reports, cash drops, closing counts).
- Payment collection (Cash, Card, Mobile, Loyalty points).
- Promotional discount calculation and loyalty program management.
- Return processing and receipt generation.

## 3. Current Status
- **Implementation State**: Extremely comprehensive frontend implementation with barcode scanning, cart management, checkout panels, shift management, loyalty integration, promotions, offline service workers, and daily reporting.
- **Maturity**: Production-grade retail frontend module.

## 4. Architecture
- **Bounded Context**: Retail Checkout & Storefront Operations.
- **Pattern**: DDD vertical slice residing in `apps/web/src/modules/pos/`. Integrates tightly with Inventory, Sales, and Payments via the Anti-Corruption Layer.

## 5. Entities
- `POSCart`: Active retail cart holding line items, customer association, discounts, and taxes.
- `POSShift`: Cashier shift record tracking opening float, cash drops, cash sales, and closing variance.
- `POSTransaction`: Completed retail sale header and lines.
- `LoyaltyAccount`: Customer rewards points balance and tier history.

## 6. Database (Target PostgreSQL Schema)
- `pos.shifts`: PK id, register_id, cashier_id (FK), opening_float, cash_drops, closing_cash, status (open, closed), opened_at, closed_at.
- `pos.transactions`: PK id, shift_id (FK), customer_id (FK), subtotal, tax_total, discount_total, grand_total, payment_method, status, created_at.
- `pos.transaction_lines`: PK id, transaction_id (FK), product_id (FK), quantity, unit_price, discount, total.
- `pos.loyalty_accounts`: PK id, customer_id (FK), points_balance, tier.

## 7. API Contracts
- `POST /api/v1/pos/shifts/open` - Open cashier shift.
- `POST /api/v1/pos/shifts/close` - Close and reconcile cashier shift.
- `POST /api/v1/pos/transactions` - Complete retail sale checkout.
- `GET /api/v1/pos/reports/daily` - Retrieve daily POS summary.

## 8. UI Components
- `POSPage` & `POSDashboard`: Master retail terminal interface.
- `POSCart` & `POSProductSearch`: Cart item management and product lookup.
- `POSCheckout` & `POSPaymentPanel`: Payment collection interface.
- `POSShiftPanel`, `POSOpenShift`, `POSCloseShift`: Cash drawer shift management.
- `POSBarcodeScanner`: Optical scanner interface.
- `POSReceipt` & `POSPrintReceipt`: Thermal receipt generator.
- `POSCustomerHistory` & `POSCustomerSelect`: Customer association.
- `CustomerPointsCard` & `RedeemPointsPanel`: Loyalty rewards management.
- `POSDailySummary`, `POSPaymentSummary`, `POSTopProducts`: Store reporting.

## 9. Dependencies
- `@tanstack/react-query`, `integrations/inventory`, `integrations/sales`.

## 10. External Integrations
- `integrations/inventory`: Instantly deducts stock from the active warehouse upon transaction completion.
- `integrations/sales`: Generates a corresponding Sales Order and Invoice in the Sales module.
- `integrations/finance`: Posts cash/card receipts to the Treasury and Accounting modules.

## 11. Business Rules
- **Shift Requirement**: Cashiers cannot process transactions without an active, open shift.
- **Stock Reservation**: Cart items trigger real-time inventory availability checks.
- **Offline Resilience**: Transactions processed offline are stored locally and queued for synchronization upon network reconnection.

## 12. Permission Rules
- `pos:register:use`: Access POS terminal.
- `pos:shift:open` / `close`: Open and reconcile cash shifts.
- `pos:override:discount`: Apply manager-level discounts exceeding standard limits.

## 13. Events Emitted / Consumed
- **Emitted**: `POS_TRANSACTION_COMPLETED`, `POS_SHIFT_OPENED`, `POS_SHIFT_CLOSED`, `LOYALTY_POINTS_REDEEMED`.
- **Consumed**: `PRODUCT_STOCK_UPDATED`.

## 14. Future Improvements
- Hardware peripheral integration (Receipt printers, Cash drawers via WebUSB/Serial).
- Multi-terminal cluster synchronization.

## 15. Missing Features
- Split-tender payments across multiple distinct payment methods in a single receipt.

## 16. Risks
- Cash drawer discrepancies during shift reconciliation leading to cash shrinkage.

## 17. Technical Debt
- Offline sync queue currently managed via local storage; needs robust IndexedDB transactional durability.
