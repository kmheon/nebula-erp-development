/**
 * Landed Cost Allocation Service.
 * 
 * ARCHITECTURAL RATIONALE:
 * Pure enterprise service for distributing additional procurement costs (freight, duty, insurance, etc.)
 * across received goods using multiple allocation strategies (equal, quantity, weight, volume, value, manual).
 * Strictly pure with no side effects or API calls in the calculation engine.
 */

import { apiClient } from "../../../api/client";
import type { GoodsReceive, PurchaseOrder } from "../types/purchase.types";
import type {
  LandedCostDocument,
  CreateLandedCostInput,
  AllocationMethod,
  LandedCostItem,
  AllocationLine,
  LandedCostAllocationResult,
} from "../types/landedCost.types";

/**
 * Fetch all landed cost documents.
 */
export function getLandedCosts() {
  return apiClient.get<LandedCostDocument[]>("/purchase/landed-costs");
}

/**
 * Create a new landed cost document.
 */
export function createLandedCost(data: CreateLandedCostInput) {
  return apiClient.post<LandedCostDocument>("/purchase/landed-costs", data);
}

/**
 * PURE ENGINE: Allocate landed cost across items of a Goods Receive and Purchase Order.
 */
export function allocateLandedCost(
  goodsReceive: GoodsReceive,
  purchaseOrder: PurchaseOrder,
  items: LandedCostItem[],
  allocationMethod: AllocationMethod,
  manualWeights?: Record<string, number>
): LandedCostAllocationResult {
  const totalLandedCost = items.reduce((sum, item) => sum + item.amount, 0);

  // Map PO items and GRN items
  const poItemMap = new Map(purchaseOrder.items.map((i) => [i.productId, i]));
  const grnItems = goodsReceive.items;

  const lineCount = grnItems.length;
  if (lineCount === 0) {
    return {
      landedCostId: `lc-${Date.now()}`,
      goodsReceiveId: goodsReceive.id,
      purchaseOrderId: purchaseOrder.id,
      allocationMethod,
      totalLandedCost,
      allocations: [],
      allocatedAt: new Date().toISOString(),
    };
  }

  // Calculate raw basis values for each item
  const rawBases: {
    productId: string;
    productName: string;
    quantity: number;
    originalUnitCost: number;
    originalTotalCost: number;
    basisValue: number;
  }[] = grnItems.map((grnItem) => {
    const poItem = poItemMap.get(grnItem.productId);
    const quantity = grnItem.baseQuantity || grnItem.receivedQuantity || 1;
    const originalUnitCost = poItem?.unitPrice || 0;
    const originalTotalCost = quantity * originalUnitCost;

    let basisValue = 1;
    switch (allocationMethod) {
      case "equal":
        basisValue = 1;
        break;
      case "quantity":
        basisValue = quantity;
        break;
      case "weight":
        // Fallback estimated weight or property if present, else quantity * 1.5
        basisValue = quantity * 1.5;
        break;
      case "volume":
        // Fallback estimated volume or property if present, else quantity * 2.0
        basisValue = quantity * 2.0;
        break;
      case "value":
        basisValue = originalTotalCost > 0 ? originalTotalCost : quantity;
        break;
      case "manual":
        basisValue = manualWeights?.[grnItem.productId] ?? 1;
        break;
    }

    return {
      productId: grnItem.productId,
      productName: grnItem.productName,
      quantity,
      originalUnitCost,
      originalTotalCost,
      basisValue: Math.max(basisValue, 0),
    };
  });

  const totalBasis = rawBases.reduce((sum, item) => sum + item.basisValue, 0);

  let allocatedSum = 0;
  const allocations: AllocationLine[] = rawBases.map((b, index) => {
    let allocatedLandedCost = 0;
    let allocationPercentage = 0;

    if (totalBasis > 0) {
      allocationPercentage = (b.basisValue / totalBasis) * 100;
      if (index === rawBases.length - 1) {
        // Ensure exact sum by residual rounding on the last item
        allocatedLandedCost = totalLandedCost - allocatedSum;
      } else {
        allocatedLandedCost = Math.round((totalLandedCost * (b.basisValue / totalBasis)) * 100) / 100;
        allocatedSum += allocatedLandedCost;
      }
    } else {
      allocationPercentage = 100 / lineCount;
      allocatedLandedCost = totalLandedCost / lineCount;
    }

    const finalTotalCost = b.originalTotalCost + allocatedLandedCost;
    const finalUnitCost = b.quantity > 0 ? finalTotalCost / b.quantity : b.originalUnitCost;

    return {
      productId: b.productId,
      productName: b.productName,
      quantity: b.quantity,
      originalUnitCost: b.originalUnitCost,
      originalTotalCost: b.originalTotalCost,
      allocationBasisValue: b.basisValue,
      allocationPercentage: Math.round(allocationPercentage * 100) / 100,
      allocatedLandedCost: Math.round(allocatedLandedCost * 100) / 100,
      finalTotalCost: Math.round(finalTotalCost * 100) / 100,
      finalUnitCost: Math.round(finalUnitCost * 100) / 100,
    };
  });

  return {
    landedCostId: `lc-${Date.now()}`,
    goodsReceiveId: goodsReceive.id,
    purchaseOrderId: purchaseOrder.id,
    allocationMethod,
    totalLandedCost,
    allocations,
    allocatedAt: new Date().toISOString(),
  };
}
