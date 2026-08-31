/**
 * React Query Hooks for Vendor Bills & 3-Way Matching.
 * 
 * ARCHITECTURAL RATIONALE:
 * Provides data-fetching and mutation hooks for vendor bills and 3-way match evaluations,
 * leveraging standardized query keys for robust cache invalidation across the Procure-to-Pay workflow.
 */

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  getVendorBills,
  createVendorBill,
  evaluateThreeWayMatch,
} from "../services/matching.service";

import {
  purchaseKeys,
} from "../queries/purchase.keys";

import type {
  VendorBill,
} from "../types/matching.types";
import type { PurchaseOrder, GoodsReceive } from "../types/purchase.types";

export function useVendorBills() {
  return useQuery({
    queryKey: purchaseKeys.vendorBills(),
    queryFn: async () => {
      const response = await getVendorBills();
      return response.data ?? [];
    },
  });
}

export function useVendorBillMutation() {
  const queryClient = useQueryClient();

  const create = useMutation({
    mutationFn: createVendorBill,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: purchaseKeys.vendorBills(),
      });
    },
  });

  return {
    create,
  };
}

export function useThreeWayMatchEvaluation() {
  return useMutation({
    mutationFn: async ({
      purchaseOrder,
      goodsReceive,
      vendorBill,
      tolerancePercentage,
    }: {
      purchaseOrder: PurchaseOrder;
      goodsReceive?: GoodsReceive;
      vendorBill: VendorBill;
      tolerancePercentage?: number;
    }) => {
      return evaluateThreeWayMatch(
        purchaseOrder,
        goodsReceive,
        vendorBill,
        tolerancePercentage
      );
    },
  });
}
