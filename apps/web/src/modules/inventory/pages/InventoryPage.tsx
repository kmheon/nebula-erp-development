import { useState } from "react";
import { LayoutDashboard, Package, Warehouse as WarehouseIcon, QrCode, Truck, ClipboardCheck, BarChart3 } from "lucide-react";
import InventoryStats from "../components/InventoryStats";
import InventoryDashboard from "../components/InventoryDashboard";
import ProductTable from "../components/ProductTable";
import ProductForm from "../components/ProductForm";
import StockMovementForm from "../components/StockMovementForm";
import StockMovementTable from "../components/StockMovementTable";
import WarehouseForm from "../components/WarehouseForm";
import WarehouseTable from "../components/WarehouseTable";
import StockLedgerTable from "../components/StockLedgerTable";
import StockAdjustmentForm from "../components/StockAdjustmentForm";
import StockTransferForm from "../components/StockTransferForm";
import StockTransferTable from "../components/StockTransferTable";

import { WarehouseZoneManager } from "../components/WarehouseZoneManager";
import { BatchSerialTracker } from "../components/BatchSerialTracker";
import { ReceivingDispatchDock } from "../components/ReceivingDispatchDock";
import { CycleCountWorkspace } from "../components/CycleCountWorkspace";
import { InventoryReportingDashboard } from "../components/InventoryReportingDashboard";
import { AppPageHeader, AppTabs } from "../../../components/ui";

import type {
  StockLedgerEntry,
  StockMovement,
  Warehouse,
} from "../types/inventory.types";
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
    warranty: {
      enabled: true,
      duration: 2,
      unit: "years",
    },
    integration: {
      syncStatus: "synced",
    },
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

const warehouses: Warehouse[] = [
  {
    id: "1",
    name: "Main Distribution Warehouse",
    code: "WH-001",
    location: "Global Logistics Hub A",
    status: "active",
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

export default function InventoryPage() {
  const [activeTab, setActiveTab] = useState<string>("dashboard");

  return (
    <div className="space-y-8">
      {/* Header Bar */}
      <AppPageHeader
        title="Enterprise Inventory & Warehouse Management"
        subtitle="Multi-warehouse zones, bin locations, batch/serial tracking, FEFO picking, cycle counts, and valuation analytics."
      />

      {/* Tab Navigation */}
      <AppTabs
        tabs={[
          { id: "dashboard", name: "Dashboard", icon: <LayoutDashboard size={16} /> },
          { id: "products", name: "Products & Stock", icon: <Package size={16} /> },
          { id: "warehouses", name: "Warehouses & Bins", icon: <WarehouseIcon size={16} /> },
          { id: "tracking", name: "Batch & Serials", icon: <QrCode size={16} /> },
          { id: "docks", name: "Receiving & Dispatch", icon: <Truck size={16} /> },
          { id: "audit", name: "Cycle Count", icon: <ClipboardCheck size={16} /> },
          { id: "reports", name: "Valuation & Reports", icon: <BarChart3 size={16} /> },
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
        variant="pill"
      />

      {/* Main Tab Content */}
      {activeTab === "dashboard" && (
        <div className="space-y-6">
          <InventoryDashboard />
          <InventoryStats
            totalProducts={products.length}
            totalStock={products.reduce((sum, p) => sum + p.currentStock, 0)}
            lowStock={0}
            value={products.reduce((sum, p) => sum + (p.currentStock * p.sellingPrice), 0)}
          />
        </div>
      )}

      {activeTab === "products" && (
        <div className="space-y-6">
          <ProductForm />
          <ProductTable products={products} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <StockMovementForm />
            <StockAdjustmentForm />
          </div>
          <StockMovementTable movements={movements} />
          <StockLedgerTable entries={ledger} />
        </div>
      )}

      {activeTab === "warehouses" && (
        <div className="space-y-6">
          <WarehouseZoneManager />
          <WarehouseForm />
          <WarehouseTable warehouses={warehouses} />
          <StockTransferForm />
          <StockTransferTable />
        </div>
      )}

      {activeTab === "tracking" && (
        <BatchSerialTracker />
      )}

      {activeTab === "docks" && (
        <ReceivingDispatchDock />
      )}

      {activeTab === "audit" && (
        <CycleCountWorkspace />
      )}

      {activeTab === "reports" && (
        <InventoryReportingDashboard />
      )}
    </div>
  );
}
