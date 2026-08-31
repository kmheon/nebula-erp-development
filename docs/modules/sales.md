# Nebula ERP Module Specification: Sales

## 1. Purpose
The Sales module manages commercial sales orders, customer quotations, fulfillment delivery notes, invoicing, and revenue recognition.

## 2. Business Responsibilities
- Customer sales quotation and Sales Order (SO) creation.
- Delivery Note processing and outbound warehouse fulfillment.
- Sales invoicing and integration with Accounts Receivable.

## 3. Current Status
- **Implementation State**: Fully developed frontend module with sales order forms, tables, customer management, and delivery processing.
- **Maturity**: Production-ready enterprise sales module.

## 4. Architecture
- **Bounded Context**: Order-to-Cash & Revenue Management.
- **Pattern**: DDD vertical slice residing in `apps/web/src/modules/sales/`.

## 5. Entities
- `SalesOrder`: Commercial sales contract header and lines (ID, customer ID, order date, status, total).
- `DeliveryNote`: Outbound shipment confirmation record.
- `SalesInvoice`: Billing document generated from sales order.

## 6. Database (Target PostgreSQL Schema)
- `sales.sales_orders`: PK id, customer_id (FK), order_date, status (draft, confirmed, fulfilled, invoiced, cancelled), total.
- `sales.sales_order_lines`: PK id, sales_order_id (FK), product_id (FK), quantity, unit_price, tax, total.
- `sales.delivery_notes`: PK id, sales_order_id (FK), warehouse_id (FK), shipped_date, tracking_number.

## 7. API Contracts
- `GET /api/v1/sales/orders` - List sales orders.
- `POST /api/v1/sales/orders` - Create sales order.
- `POST /api/v1/sales/delivery-notes` - Process outbound delivery and deduct inventory.
- `POST /api/v1/sales/invoices` - Generate sales invoice.

## 8. UI Components
- `SalesPage`: Master sales dashboard.
- `SalesOrderTable` & `SalesOrderForm`: Sales contract management.
- `DeliveryTable` & `DeliveryForm`: Outbound fulfillment workstation.
- `CustomerTable` & `CustomerForm`: Sales customer management.

## 9. Dependencies
- `@tanstack/react-query`, `integrations/inventory`, `integrations/finance`.

## 10. External Integrations
- `integrations/inventory`: Automatically reserves or deducts stock when sales orders are confirmed and delivered.
- `integrations/finance`: Posts sales invoices to Accounts Receivable and General Ledger.

## 11. Business Rules
- **Stock Reservation**: Confirming a sales order reserves physical stock in the designated warehouse.
- **Revenue Recognition**: Generating a sales invoice posts revenue to the GL and debits Accounts Receivable.

## 12. Permission Rules
- `sales:order:read` / `write`: Manage sales orders and quotations.
- `sales:delivery:process`: Confirm outbound shipments.
- `sales:invoice:create`: Generate customer invoices.

## 13. Events Emitted / Consumed
- **Emitted**: `SALES_ORDER_CREATED`, `SALES_ORDER_CONFIRMED`, `DELIVERY_SHIPPED`, `SALES_INVOICED`.
- **Consumed**: `POS_TRANSACTION_COMPLETED`.

## 14. Future Improvements
- Electronic signature integration for customer sales contracts.
- Automated tax calculation based on customer shipping address jurisdiction.

## 15. Missing Features
- Sales commission tracking per sales representative.

## 16. Risks
- Fulfilling orders for customers exceeding credit limits without managerial sign-off.

## 17. Technical Debt
- Order state transition logic currently client-side; needs strict backend finite state machine validation.
