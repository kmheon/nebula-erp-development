# Nebula ERP Module Specification: Purchase

## 1. Purpose
The Purchase module manages procurement operations, supplier relationships, Purchase Orders (POs), Goods Receive Notes (GRNs), supplier bill matching, and inbound inventory logistics.

## 2. Business Responsibilities
- Supplier directory management and vendor performance tracking.
- Purchase Order creation, approval, and issuance.
- Goods Receive (GRN) processing for inbound shipments and quality inspection.
- Supplier bill matching against purchase orders and receipts (3-way matching).

## 3. Current Status
- **Implementation State**: Fully developed frontend module with supplier tables, PO forms, GRN receiving workflows, and purchase dashboards.
- **Maturity**: Production-ready enterprise procurement module.

## 4. Architecture
- **Bounded Context**: Procurement & Supply Chain Inflow.
- **Pattern**: DDD vertical slice residing in `apps/web/src/modules/purchase/`.

## 5. Entities
- `Supplier`: Vendor contact entity.
- `PurchaseOrder`: Procurement contract header and lines (ID, supplier ID, order date, expected date, status, total).
- `GoodsReceiveNote`: Inbound warehouse delivery receipt confirming physical quantities received.
- `SupplierBill`: Vendor invoice pending payment and 3-way match verification.

## 6. Database (Target PostgreSQL Schema)
- `purchase.suppliers`: PK id, name, contact_person, email, phone, payment_terms.
- `purchase.purchase_orders`: PK id, supplier_id (FK), order_date, expected_date, status (draft, issued, received, billed, closed), total.
- `purchase.purchase_order_lines`: PK id, purchase_order_id (FK), product_id (FK), quantity, unit_price, received_quantity.
- `purchase.goods_receives`: PK id, purchase_order_id (FK), warehouse_id (FK), received_date, received_by, notes.

## 7. API Contracts
- `GET /api/v1/purchase/orders` - List purchase orders.
- `POST /api/v1/purchase/orders` - Create purchase order.
- `POST /api/v1/purchase/goods-receives` - Process inbound shipment and update inventory.
- `POST /api/v1/purchase/bills` - Record supplier bill.

## 8. UI Components
- `PurchasePage`: Master procurement dashboard.
- `PurchaseOrderTable` & `PurchaseOrderForm`: Procurement order management.
- `GoodsReceiveTable` & `GoodsReceiveForm`: Inbound receiving warehouse workflow.
- `SupplierTable` & `SupplierForm`: Supplier directory management.

## 9. Dependencies
- `@tanstack/react-query`, `integrations/inventory`, `integrations/finance`.

## 10. External Integrations
- `integrations/inventory`: Automatically increases stock in the target warehouse upon Goods Receive Note confirmation.
- `integrations/finance`: Posts supplier bills to Accounts Payable and General Ledger.

## 11. Business Rules
- **3-Way Matching**: Supplier bills must match quantities on Goods Receive Notes and prices on Purchase Orders before payment approval.
- **Inventory Inflow**: Confirming a GRN immediately updates warehouse stock balances and posts valuation entries.

## 12. Permission Rules
- `purchase:order:read` / `write`: Manage procurement orders.
- `purchase:receive:process`: Confirm inbound warehouse shipments.
- `purchase:bill:approve`: Approve vendor disbursements.

## 13. Events Emitted / Consumed
- **Emitted**: `PURCHASE_ORDER_ISSUED`, `GOODS_RECEIVED`, `SUPPLIER_BILLED`.
- **Consumed**: `INVENTORY_STOCK_UPDATED`.

## 14. Future Improvements
- Automated purchase requisition workflow based on inventory reorder thresholds.
- Supplier portal for electronic purchase order acceptance and ASN (Advanced Shipping Notice) submission.

## 15. Missing Features
- Multi-currency purchase order pricing.

## 16. Risks
- Discrepancies between ordered quantities and physical goods received causing invoice payment disputes.

## 17. Technical Debt
- Bill matching validation rules currently client-side; needs strict server-side accounting invariants.
