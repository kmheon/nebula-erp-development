import type { WarehouseZone, WarehouseBin, CycleCountSession, ReceivingOrder, DispatchOrder } from "../types/warehouse.types";
import type { BatchLotRecord, SerialNumberRecord, StockReservation } from "../types/tracking.types";
import type { InventoryValuationItem, InventoryAgingItem, ABCAnalysisItem, ReorderRule, DeadStockReportItem } from "../types/valuation.types";

export const initialZones: WarehouseZone[] = [
  { id: "zone-1", warehouseId: "1", name: "Zone A - High Value Electronics", code: "ZA-ELEC", type: "storage", temperatureControlled: true, status: "active", createdAt: "2026-07-01" },
  { id: "zone-2", warehouseId: "1", name: "Zone B - Bulk Pallets", code: "ZB-BULK", type: "storage", temperatureControlled: false, status: "active", createdAt: "2026-07-01" },
  { id: "zone-3", warehouseId: "1", name: "Inbound Receiving Dock", code: "RCV-01", type: "receiving", temperatureControlled: false, status: "active", createdAt: "2026-07-01" },
  { id: "zone-4", warehouseId: "1", name: "Cold Storage Pharma", code: "COLD-01", type: "cold-storage", temperatureControlled: true, status: "active", createdAt: "2026-07-01" },
  { id: "zone-5", warehouseId: "1", name: "Quarantine & Inspect", code: "QRT-01", type: "quarantine", temperatureControlled: false, status: "active", createdAt: "2026-07-01" }
];

export const initialBins: WarehouseBin[] = [
  { id: "bin-101", rackId: "rack-1", code: "ZA-R1-L1-B1", level: 1, position: "A1", capacityKg: 500, currentWeightKg: 120, status: "available" },
  { id: "bin-102", rackId: "rack-1", code: "ZA-R1-L1-B2", level: 1, position: "A2", capacityKg: 500, currentWeightKg: 450, status: "reserved" },
  { id: "bin-103", rackId: "rack-2", code: "ZB-R2-L2-B1", level: 2, position: "B1", capacityKg: 1200, currentWeightKg: 1100, status: "full" },
  { id: "bin-104", rackId: "rack-3", code: "COLD-R1-L1", level: 1, position: "C1", capacityKg: 300, currentWeightKg: 85, status: "available" }
];

export const initialBatches: BatchLotRecord[] = [
  { id: "batch-1", productId: "1", productName: "Enterprise Laptop Pro", batchNumber: "LOT-2026-A1", lotNumber: "L-9901", manufacturingDate: "2026-01-15", expiryDate: "2029-01-15", quantity: 15, warehouseId: "1", binId: "bin-101", status: "active", qualityStatus: "passed" },
  { id: "batch-2", productId: "2", productName: "Industrial Server Blade", batchNumber: "LOT-2026-B2", lotNumber: "L-9902", manufacturingDate: "2026-03-10", expiryDate: "2028-03-10", quantity: 8, warehouseId: "1", binId: "bin-102", status: "active", qualityStatus: "passed" }
];

export const initialSerials: SerialNumberRecord[] = [
  { id: "ser-1", productId: "1", productName: "Enterprise Laptop Pro", serialNumber: "SN-LAP-99812", warehouseId: "1", status: "in-stock", batchNumber: "LOT-2026-A1", receivedDate: "2026-07-10", warrantyExpiry: "2029-07-10" },
  { id: "ser-2", productId: "1", productName: "Enterprise Laptop Pro", serialNumber: "SN-LAP-99813", warehouseId: "1", status: "in-stock", batchNumber: "LOT-2026-A1", receivedDate: "2026-07-10", warrantyExpiry: "2029-07-10" },
  { id: "ser-3", productId: "2", productName: "Industrial Server Blade", serialNumber: "SN-SRV-44102", warehouseId: "1", status: "allocated", batchNumber: "LOT-2026-B2", receivedDate: "2026-07-12", warrantyExpiry: "2031-07-12" }
];

export const initialReservations: StockReservation[] = [
  { id: "res-1", productId: "1", productName: "Enterprise Laptop Pro", warehouseId: "1", quantity: 3, referenceType: "sales-order", referenceId: "SO-2026-881", reservedAt: "2026-08-28", expiresAt: "2026-09-04", status: "active" }
];

export const initialCycleCounts: CycleCountSession[] = [
  { id: "cc-1", warehouseId: "1", zoneId: "zone-1", status: "in-progress", assignedAuditor: "Sarah Jenkins", scheduledDate: "2026-08-31", discrepancyCount: 2, notes: "Monthly cycle count for high value electronics." },
  { id: "cc-2", warehouseId: "1", zoneId: "zone-2", status: "reconciled", assignedAuditor: "David Vance", scheduledDate: "2026-08-25", completedDate: "2026-08-26", discrepancyCount: 0, notes: "Quarterly pallet audit verified." }
];

export const initialReceivingOrders: ReceivingOrder[] = [
  { id: "rcv-1", poNumber: "PO-2026-301", supplierName: "Global Tech Silicon Corp", warehouseId: "1", status: "inspecting", expectedDate: "2026-08-31", itemCount: 50, inspectionPassed: true, notes: "Awaiting QA clearance for batch acceptance." },
  { id: "rcv-2", poNumber: "PO-2026-302", supplierName: "Apex Logistics Hardware", warehouseId: "1", status: "expected", expectedDate: "2026-09-02", itemCount: 120, inspectionPassed: false, notes: "In transit from port." }
];

export const initialDispatchOrders: DispatchOrder[] = [
  { id: "dsp-1", soNumber: "SO-2026-901", customerName: "Acme Enterprise Corp", warehouseId: "1", status: "picking", pickingMethod: "FIFO", carrier: "FedEx Freight", trackingNumber: "FX-99823100", dispatchDate: "2026-08-31" }
];

export const initialValuationItems: InventoryValuationItem[] = [
  { productId: "1", productName: "Enterprise Laptop Pro", sku: "LAP-001", category: "Electronics", totalQuantity: 15, averageCost: 800, totalValuation: 12000, valuationMethod: "Weighted Average", lastUpdated: "2026-08-30" },
  { productId: "2", productName: "Industrial Server Blade", sku: "SRV-002", category: "Hardware", totalQuantity: 8, averageCost: 3500, totalValuation: 28000, valuationMethod: "Weighted Average", lastUpdated: "2026-08-30" }
];

export const initialAgingItems: InventoryAgingItem[] = [
  { productId: "1", productName: "Enterprise Laptop Pro", sku: "LAP-001", warehouseName: "Main Warehouse", currentStock: 15, days0to30: 10, days31to60: 5, days61to90: 0, daysOver90: 0, status: "healthy" },
  { productId: "2", productName: "Industrial Server Blade", sku: "SRV-002", warehouseName: "Main Warehouse", currentStock: 8, days0to30: 2, days31to60: 1, days61to90: 2, daysOver90: 3, status: "slow-moving" }
];

export const initialABCItems: ABCAnalysisItem[] = [
  { productId: "2", productName: "Industrial Server Blade", sku: "SRV-002", annualConsumptionValue: 140000, percentageOfTotal: 65, abcClass: "A", recommendedReviewFrequency: "Weekly" },
  { productId: "1", productName: "Enterprise Laptop Pro", sku: "LAP-001", annualConsumptionValue: 55000, percentageOfTotal: 25, abcClass: "B", recommendedReviewFrequency: "Monthly" }
];

export const initialReorderRules: ReorderRule[] = [
  { id: "rr-1", productId: "1", productName: "Enterprise Laptop Pro", warehouseId: "1", minLevel: 5, maxLevel: 50, reorderPoint: 10, reorderQuantity: 25, safetyStock: 3, autoReorder: true, preferredSupplier: "Global Tech Silicon Corp" },
  { id: "rr-2", productId: "2", productName: "Industrial Server Blade", warehouseId: "1", minLevel: 2, maxLevel: 15, reorderPoint: 4, reorderQuantity: 10, safetyStock: 1, autoReorder: true, preferredSupplier: "Apex Logistics Hardware" }
];

export const initialDeadStock: DeadStockReportItem[] = [
  { productId: "DS-99", productName: "Legacy CRT Terminal Monitor", sku: "CRT-99", warehouseName: "Main Warehouse", stockQty: 6, unitCost: 120, totalValue: 720, lastMovementDate: "2025-11-10", daysWithoutMovement: 294, recommendedAction: "scrap" }
];
