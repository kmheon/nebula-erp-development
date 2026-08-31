export interface InventoryValuationItem {
  productId: string;
  productName: string;
  sku: string;
  category: string;
  totalQuantity: number;
  averageCost: number;
  totalValuation: number;
  valuationMethod: "FIFO" | "LIFO" | "Weighted Average";
  lastUpdated: string;
}

export interface InventoryAgingItem {
  productId: string;
  productName: string;
  sku: string;
  warehouseName: string;
  currentStock: number;
  days0to30: number;
  days31to60: number;
  days61to90: number;
  daysOver90: number;
  status: "healthy" | "slow-moving" | "dead-stock";
}

export interface ABCAnalysisItem {
  productId: string;
  productName: string;
  sku: string;
  annualConsumptionValue: number;
  percentageOfTotal: number;
  abcClass: "A" | "B" | "C";
  recommendedReviewFrequency: string;
}

export interface ReorderRule {
  id: string;
  productId: string;
  productName: string;
  warehouseId: string;
  minLevel: number;
  maxLevel: number;
  reorderPoint: number;
  reorderQuantity: number;
  safetyStock: number;
  autoReorder: boolean;
  preferredSupplier: string;
}

export interface DeadStockReportItem {
  productId: string;
  productName: string;
  sku: string;
  warehouseName: string;
  stockQty: number;
  unitCost: number;
  totalValue: number;
  lastMovementDate: string;
  daysWithoutMovement: number;
  recommendedAction: "liquidation" | "discount" | "scrap" | "transfer";
}
