/**
 * ARCHITECTURAL NOTE:
 * Product master data is defined canonically in `product.types.ts` via `ProductMaster`.
 * This file contains stock movements, warehouses, stock adjustments, and stock transfers.
 */

export type StockMovementType =
  | "stock-in"
  | "stock-out"
  | "adjustment";


export interface StockMovement {
  id: string;

  productId: string;

  productName: string;


  warehouseId: string;


  type: StockMovementType;


  quantity: number;


  unitId: string;


  baseQuantity: number;


  referenceType?: 
    | "purchase"
    | "sale"
    | "transfer"
    | "adjustment";


  referenceId?: string;


  transactionDate?: string;


  note: string;


  createdAt: string;
}



export interface CreateStockMovementInput {

  productId: string;


  warehouseId: string;


  type: StockMovementType;


  quantity: number;


  unitId: string;


  baseQuantity: number;


  referenceType?:
    | "purchase"
    | "sale"
    | "transfer"
    | "adjustment";


  referenceId?: string;


  transactionDate?: string;


  note: string;

}


export interface Warehouse {
  id: string;
  name: string;
  code: string;
  location: string;
  status: "active" | "inactive";
}


export interface CreateWarehouseInput {
  name: string;
  code: string;
  location: string;
}


export interface StockLedgerEntry {
  id: string;
  productName: string;
  warehouse: string;
  type: StockMovementType;
  quantity: number;
  balance: number;
  referenceType?:
    | "purchase"
    | "sale"
    | "transfer"
    | "adjustment";
  referenceId?: string;
  createdAt: string;
}


export interface InventorySummary {
  totalProducts: number;
  totalStock: number;
  lowStock: number;
  inventoryValue: number;
}


export type StockAdjustmentType =
  | "increase"
  | "decrease";


export interface StockAdjustment {
  id: string;

  productId: string;

  warehouseId: string;

  unitId: string;

  quantity: number;

  baseQuantity: number;

  type: StockAdjustmentType;

  reason: string;

  note: string;

  createdAt: string;
}


export interface CreateStockAdjustmentInput {
  productId: string;

  warehouseId: string;

  unitId: string;

  quantity: number;

  baseQuantity: number;

  type: StockAdjustmentType;

  reason: string;

  note: string;
}


export interface StockTransfer {
  id: string;

  productId: string;

  fromWarehouseId: string;

  toWarehouseId: string;

  unitId: string;

  quantity: number;

  baseQuantity: number;

  note: string;

  createdAt: string;
}


export interface CreateStockTransferInput {
  productId: string;

  fromWarehouseId: string;

  toWarehouseId: string;

  unitId: string;

  quantity: number;

  baseQuantity: number;

  note: string;
}
