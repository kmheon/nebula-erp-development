/**
 * 3-Way Matching & Vendor Bill Types.
 * 
 * ARCHITECTURAL RATIONALE:
 * Defines enterprise Procure-to-Pay 3-way matching structures (Purchase Order vs Goods Receipt vs Vendor Bill)
 * to guarantee financial integrity and prevent over-billing or unverified inventory disbursements.
 */

export type VendorBillStatus = "draft" | "matched" | "discrepancy" | "approved";

export interface VendorBillItem {
  id: string;
  productId: string;
  productName: string;
  billedQuantity: number;
  unitPrice: number;
  tax: number;
  total: number;
}

export interface VendorBill {
  id: string;
  supplierId: string;
  purchaseOrderId: string;
  billNumber: string;
  date: string;
  dueDate: string;
  items: VendorBillItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: VendorBillStatus;
  createdAt: string;
}

export interface CreateVendorBillInput {
  supplierId: string;
  purchaseOrderId: string;
  billNumber: string;
  date: string;
  dueDate: string;
  items: VendorBillItem[];
  subtotal: number;
  tax: number;
  total: number;
}

export interface MatchDiscrepancyItem {
  productId: string;
  productName: string;
  poQuantity: number;
  grnQuantity: number;
  billedQuantity: number;
  poUnitPrice: number;
  billedUnitPrice: number;
  quantityMismatch: boolean;
  priceMismatch: boolean;
  discrepancyDetails: string;
}

export interface ThreeWayMatchResult {
  purchaseOrderId: string;
  goodsReceiveId?: string;
  vendorBillId: string;
  status: "matched" | "discrepancy";
  discrepancies: MatchDiscrepancyItem[];
  tolerancePercentage: number;
  checkedAt: string;
}
