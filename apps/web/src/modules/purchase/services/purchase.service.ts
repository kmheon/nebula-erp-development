import { apiClient } from "../../../api/client";

import {
  getSuppliers as getCanonicalSuppliers,
  createSupplier as createCanonicalSupplier,
  updateSupplier as updateCanonicalSupplier,
  deleteSupplier as deleteCanonicalSupplier,
} from "../../../integrations/supplier";

import {
  createStockMovement,
} from "../../inventory/services/inventory.service";

import type {
  CreateSupplierInput,
  CreatePurchaseOrderInput,
  CreateGoodsReceiveInput,
  GoodsReceive,
  PurchaseOrder,
  UpdateSupplierInput,
} from "../types/purchase.types";

import type {
  CreateStockMovementInput,
  StockMovement,
} from "../../inventory/types/inventory.types";


/* ---------------------------------------------------------------- */
/* Supplier (Unified via Contact Registry ACL)                       */
/* ---------------------------------------------------------------- */

export async function getSuppliers() {
  const data = await getCanonicalSuppliers();
  return { data };
}


export async function createSupplier(
  data: CreateSupplierInput,
) {
  const result = await createCanonicalSupplier(data);
  return { data: result };
}


export async function updateSupplier(
  data: UpdateSupplierInput,
) {
  const result = await updateCanonicalSupplier(data);
  return { data: result };
}


export async function deleteSupplier(
  id: string,
) {
  await deleteCanonicalSupplier(id);
  return { data: { success: true } };
}


/* ---------------------------------------------------------------- */
/* Purchase Order                                                   */
/* ---------------------------------------------------------------- */

export function getPurchaseOrders() {
  return apiClient.get<PurchaseOrder[]>(
    "/purchase/orders",
  );
}


export function createPurchaseOrder(
  data: CreatePurchaseOrderInput,
) {
  return apiClient.post<PurchaseOrder>(
    "/purchase/orders",
    data,
  );
}


export function updatePurchaseOrder(
  data: PurchaseOrder,
) {
  return apiClient.post<PurchaseOrder>(
    `/purchase/orders/${data.id}`,
    data,
  );
}


/* ---------------------------------------------------------------- */
/* Goods Receive                                                    */
/* ---------------------------------------------------------------- */

export function getGoodsReceives() {
  return apiClient.post<GoodsReceive[]>(
    "/purchase/goods-receives",
    {},
  );
}


export function createGoodsReceive(
  data: CreateGoodsReceiveInput,
) {
  return apiClient.post<GoodsReceive>(
    "/purchase/goods-receives",
    data,
  );
}


/**
 * Goods Receive → Stock Movement (stock-in) flow.
 *
 * Inventory is NEVER updated directly. The only valid inventory path is:
 *
 *   Goods Receive → Stock Movement (stock-in) → Stock Ledger → Inventory
 *
 * For every received item we create a `stock-in` movement that references
 * this goods receive. The downstream Stock Ledger / Inventory update is
 * owned by the inventory engine, not by the purchase module.
 */
export function createGoodsReceiveWithStockMovements(
  goodsReceive: GoodsReceive,
) {
  const movements: CreateStockMovementInput[] =
    goodsReceive.items.map((item) => ({
      productId: item.productId,

      warehouseId: goodsReceive.warehouseId,

      type: "stock-in",

      quantity: item.receivedQuantity,

      unitId: item.unitId,

      baseQuantity: item.baseQuantity,

      referenceType: "purchase",

      referenceId: goodsReceive.id,

      transactionDate: goodsReceive.date,

      note:
        `Goods receipt for PO ${goodsReceive.purchaseOrderId}`,
    }));


  const created: StockMovement[] = [];

  return movements
    .reduce(
      (chain, movement) =>
        chain.then(async (acc) => {
          const response =
            await createStockMovement(movement);

          acc.push(response.data);

          return acc;
        }),
      Promise.resolve(created),
    )
    .then((acc) => acc);
}
