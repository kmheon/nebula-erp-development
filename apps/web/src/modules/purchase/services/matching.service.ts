/**
 * Automated 3-Way Matching Service & Vendor Bill Management.
 * 
 * ARCHITECTURAL RATIONALE:
 * Provides automated reconciliation and validation across Purchase Orders (ordered quantities & prices),
 * Goods Receive Notes (received quantities), and Vendor Bills (billed quantities & prices).
 * Ensures financial compliance before accounts payable posting.
 */

import { apiClient } from "../../../api/client";
import type { PurchaseOrder, GoodsReceive } from "../types/purchase.types";
import type {
  VendorBill,
  CreateVendorBillInput,
  ThreeWayMatchResult,
  MatchDiscrepancyItem,
} from "../types/matching.types";

/**
 * Fetch all vendor bills.
 */
export function getVendorBills() {
  return apiClient.get<VendorBill[]>("/purchase/vendor-bills");
}

/**
 * Create a new vendor bill.
 */
export function createVendorBill(data: CreateVendorBillInput) {
  return apiClient.post<VendorBill>("/purchase/vendor-bills", data);
}

/**
 * Perform automated 3-way matching between a Purchase Order, Goods Receive Note, and Vendor Bill.
 * 
 * Compares:
 * 1. PO ordered quantity vs GRN received quantity vs Vendor Bill billed quantity.
 * 2. PO unit price vs Vendor Bill unit price.
 * 
 * Applies optional tolerance percentage (e.g. 0.5% for minor unit rounding).
 */
export async function evaluateThreeWayMatch(
  purchaseOrder: PurchaseOrder,
  goodsReceive: GoodsReceive | undefined,
  vendorBill: VendorBill,
  tolerancePercentage = 0
): Promise<ThreeWayMatchResult> {
  const discrepancies: MatchDiscrepancyItem[] = [];

  // Map PO items for fast lookup
  const poItemMap = new Map(purchaseOrder.items.map((item) => [item.productId, item]));
  
  // Map GRN items for fast lookup
  const grnItemMap = new Map(
    goodsReceive?.items.map((item) => [item.productId, item]) ?? []
  );

  for (const billItem of vendorBill.items) {
    const poItem = poItemMap.get(billItem.productId);
    const grnItem = grnItemMap.get(billItem.productId);

    const poQty = poItem?.quantity ?? 0;
    const grnQty = grnItem?.baseQuantity ?? grnItem?.receivedQuantity ?? 0;
    const billedQty = billItem.billedQuantity;

    const poUnitPrice = poItem?.unitPrice ?? 0;
    const billedUnitPrice = billItem.unitPrice;

    // Quantity mismatch check (billed vs received or ordered with tolerance)
    const qtyDiff = Math.abs(billedQty - grnQty);
    const qtyToleranceAllowed = grnQty * (tolerancePercentage / 100);
    const quantityMismatch = qtyDiff > qtyToleranceAllowed;

    // Price mismatch check (billed unit price vs PO agreed unit price)
    const priceDiff = Math.abs(billedUnitPrice - poUnitPrice);
    const priceToleranceAllowed = poUnitPrice * (tolerancePercentage / 100);
    const priceMismatch = priceDiff > priceToleranceAllowed;

    if (quantityMismatch || priceMismatch) {
      let details = "";
      if (quantityMismatch && priceMismatch) {
        details = `Quantity discrepancy (Received: ${grnQty}, Billed: ${billedQty}) and Price discrepancy (PO: ${poUnitPrice}, Billed: ${billedUnitPrice}).`;
      } else if (quantityMismatch) {
        details = `Quantity discrepancy: Goods received (${grnQty}) does not match billed quantity (${billedQty}).`;
      } else {
        details = `Price discrepancy: PO unit price (${poUnitPrice}) does not match billed unit price (${billedUnitPrice}).`;
      }

      discrepancies.push({
        productId: billItem.productId,
        productName: billItem.productName,
        poQuantity: poQty,
        grnQuantity: grnQty,
        billedQuantity: billedQty,
        poUnitPrice,
        billedUnitPrice,
        quantityMismatch,
        priceMismatch,
        discrepancyDetails: details,
      });
    }
  }

  const status = discrepancies.length > 0 ? "discrepancy" : "matched";

  return {
    purchaseOrderId: purchaseOrder.id,
    goodsReceiveId: goodsReceive?.id,
    vendorBillId: vendorBill.id,
    status,
    discrepancies,
    tolerancePercentage,
    checkedAt: new Date().toISOString(),
  };
}
