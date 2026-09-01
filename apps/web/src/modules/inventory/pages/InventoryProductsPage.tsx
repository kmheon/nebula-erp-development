import ProductForm from "../components/ProductForm";
import ProductTable from "../components/ProductTable";
import StockMovementForm from "../components/StockMovementForm";
import StockMovementTable from "../components/StockMovementTable";
import StockAdjustmentForm from "../components/StockAdjustmentForm";
import StockLedgerTable from "../components/StockLedgerTable";
import { AppPageHeader } from "../../../components/ui";

import type { StockLedgerEntry, StockMovement } from "../types/inventory.types";
import type { ProductMaster } from "../types/product.types";

const products: ProductMaster[] = [
  {
    id: "1",
    name: "Enterprise Laptop Pro",
    sku: "LAP-001",
    barcode: "123456789",
    type: "single",
    categoryId: "electronics",
    brandId: "generic",
    unitId: "piece",
    shortDescription: "Business laptop",
    longDescription: "High performance laptop for office and professional use.",
    tags: ["electronics", "laptop"],
    images: [],
    attributes: [],
    variants: [],
    costPrice: 800,
    sellingPrice: 950,
    wholesalePrice: 900,
    taxRate: 0,
    openingStock: 15,
    currentStock: 15,
    reorderLevel: 5,
    warehouseIds: ["1"],
    batchTracking: true,
    serialTracking: true,
    warranty: { enabled: true, duration: 2, unit: "years" },
    integration: { syncStatus: "synced" },
    createdAt: "2026-07-22",
    updatedAt: "2026-07-22",
  },
];

const movements: StockMovement[] = [
  {
    id: "1",
    productId: "1",
    productName: "Enterprise Laptop Pro",
    warehouseId: "main",
    type: "stock-in",
    quantity: 15,
    unitId: "piece",
    baseQuantity: 15,
    referenceType: "adjustment",
    referenceId: "ADJ-001",
    transactionDate: "2026-07-22",
    note: "Initial enterprise stock",
    createdAt: "2026-07-22",
  },
];

const ledger: StockLedgerEntry[] = [
  {
    id: "1",
    productName: "Enterprise Laptop Pro",
    warehouse: "Main Distribution Warehouse",
    type: "stock-in",
    quantity: 15,
    balance: 15,
    createdAt: "2026-07-22",
  },
];

export default function InventoryProductsPage() {
  return (
    <div className="space-y-6">
      <AppPageHeader
        title="Products & Stock Management"
        subtitle="Manage product catalog, SKUs, stock adjustments, movements, and audit ledgers."
      />

      <ProductForm />
      <ProductTable products={products} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StockMovementForm />
        <StockAdjustmentForm />
      </div>
      <StockMovementTable movements={movements} />
      <StockLedgerTable entries={ledger} />
    </div>
  );
}
