/**
 * Landed Cost Types & Allocation Schemas.
 * 
 * ARCHITECTURAL RATIONALE:
 * Defines enterprise procurement landed cost structures, allocation strategies (equal, quantity, weight, volume, value, manual),
 * and allocation result DTOs before inventory valuation and accounting posting.
 */

export type LandedCostType =
  | "freight"
  | "shipping"
  | "customs_duty"
  | "insurance"
  | "port_charges"
  | "clearing_charges"
  | "packaging"
  | "local_transportation"
  | "handling"
  | "miscellaneous";

export type AllocationMethod =
  | "equal"
  | "quantity"
  | "weight"
  | "volume"
  | "value"
  | "manual";

export interface LandedCostItem {
  id: string;
  type: LandedCostType;
  description: string;
  amount: number;
  currency: string;
}

export interface LandedCostDocument {
  id: string;
  goodsReceiveId: string;
  purchaseOrderId: string;
  referenceNumber: string;
  date: string;
  allocationMethod: AllocationMethod;
  items: LandedCostItem[];
  totalLandedCost: number;
  status: "draft" | "allocated" | "posted";
  createdAt: string;
}

export interface CreateLandedCostInput {
  goodsReceiveId: string;
  purchaseOrderId: string;
  referenceNumber: string;
  date: string;
  allocationMethod: AllocationMethod;
  items: LandedCostItem[];
  manualWeights?: Record<string, number>;
}

export interface AllocationLine {
  productId: string;
  productName: string;
  quantity: number;
  originalUnitCost: number;
  originalTotalCost: number;
  allocationBasisValue: number;
  allocationPercentage: number;
  allocatedLandedCost: number;
  finalTotalCost: number;
  finalUnitCost: number;
}

export interface LandedCostAllocationResult {
  landedCostId: string;
  goodsReceiveId: string;
  purchaseOrderId: string;
  allocationMethod: AllocationMethod;
  totalLandedCost: number;
  allocations: AllocationLine[];
  allocatedAt: string;
}
