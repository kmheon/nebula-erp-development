# Nebula ERP Module Specification: Inventory

## 1. Purpose
The Inventory module is the mission-critical stock management engine of Nebula ERP. It governs product master data, multi-warehouse stock tracking, stock adjustments, movements, transfers, unit conversions, and real-time stock ledger valuation.

## 2. Business Responsibilities
- Product Master catalog management (SKUs, barcodes, pricing, attributes).
- Multi-warehouse location and bin management.
- Stock Ledger tracking (immutable ledger of all inventory inflows and outflows).
- Stock movements (receipts, issues), adjustments (shrinkage, damage), and inter-warehouse transfers.
- Unit of measure (UOM) conversions and stock valuation (FIFO, Weighted Average).

## 3. Current Status
- **Implementation State**: Extremely robust frontend implementation with dedicated dashboards, product tables, stock ledgers, warehouse management, adjustments, and unit conversions.
- **Maturity**: Production-grade UI architecture, fully structured for enterprise supply chain operations.

## 4. Architecture
- **Bounded Context**: Supply Chain & Stock Management.
- **Pattern**: DDD vertical slice residing in `apps/web/src/modules/inventory/`. Implements CQRS-style read queries and transactional mutation hooks.

## 5. Entities
- `Product`: Master catalog item (ID, sku, barcode, name, description, category, unit, cost price, selling price, stock level).
- `Warehouse`: Physical storage facility location (ID, code, name, address, manager).
- `StockLedgerEntry`: Immutable audit record of inventory quantity changes (product ID, warehouse ID, quantity change, movement type, reference ID, cost).
- `StockMovement`: Inbound/outbound stock transfer transaction.
- `StockAdjustment`: Inventory count reconciliation record.

## 6. Database (Target PostgreSQL Schema)
- `inventory.warehouses`: PK id, code, name, address, is_active.
- `inventory.products`: PK id, sku (unique), barcode, name, category_id, unit_id, cost_price, selling_price, min_stock_level.
- `inventory.warehouse_stocks`: PK (warehouse_id, product_id), quantity, reserved_quantity.
- `inventory.stock_ledger`: PK id, timestamp, warehouse_id (FK), product_id (FK), quantity_change, balance_after, reference_type, reference_id, unit_cost.

## 7. API Contracts
- `GET /api/v1/inventory/products` - List products with inventory balances.
- `POST /api/v1/inventory/products` - Create product master.
- `GET /api/v1/inventory/stock-ledger` - Query stock movement ledger.
- `POST /api/v1/inventory/stock-adjustments` - Submit stock count adjustment.
- `POST /api/v1/inventory/stock-transfers` - Execute inter-warehouse transfer.

## 8. UI Components
- `InventoryPage` & `InventoryDashboard`: High-level supply chain overview.
- `ProductTable`, `ProductForm`, `ProductDetails`: Master catalog management.
- `StockLedgerTable`: Immutable movement audit trail.
- `StockAdjustmentTable` & `StockAdjustmentForm`: Inventory reconciliation.
- `StockTransferTable` & `StockTransferForm`: Inter-warehouse logistics.
- `WarehouseTable` & `WarehouseForm`: Facility management.
- `UnitTable` & `UnitConversionTable`: Unit of measure management.

## 9. Dependencies
- `@tanstack/react-query`, `core/entities/product.types.ts`.

## 10. External Integrations
- `integrations/inventory`: Exposes stock reservation and availability checks to POS and Sales modules.

## 11. Business Rules
- **Negative Stock Prevention**: Stock issues and sales fulfillment cannot reduce warehouse stock below zero unless explicitly authorized by managerial override.
- **Immutable Ledger**: Stock ledger entries are strictly append-only. Corrections require compensating adjustment entries.
- **Valuation Consistency**: Inventory asset valuation must be consistently maintained using Weighted Average Cost or FIFO.

## 12. Permission Rules
- `inventory:product:read` / `write`: Manage product catalog.
- `inventory:stock:adjust`: Perform stock adjustments and write-offs.
- `inventory:warehouse:manage`: Configure warehouse facilities.

## 13. Events Emitted / Consumed
- **Emitted**: `PRODUCT_CREATED`, `STOCK_LEVEL_CHANGED`, `STOCK_ADJUSTED`, `STOCK_TRANSFERRED`, `LOW_STOCK_ALERT`.
- **Consumed**: `SALES_ORDER_CONFIRMED`, `GOODS_RECEIVED`.

## 14. Future Improvements
- Automated reorder point purchase order generation.
- Barcode scanner integration for physical cycle counting.
- Serial number and batch/lot tracking for traceability.

## 15. Missing Features
- Multi-tier bill of materials (BOM) light manufacturing assembly.

## 16. Risks
- Inventory shrinkage or count discrepancies causing financial variances between inventory asset accounts and physical stock value.

## 17. Technical Debt
- Local state caching in some inventory components needs rigorous synchronization with server mutations.
