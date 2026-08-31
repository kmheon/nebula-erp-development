/**
 * Landed Cost Query & Mutation Hooks.
 * 
 * ARCHITECTURAL RATIONALE:
 * Orchestrates landed cost document retrieval and mutation with standardized purchase query key factories.
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { purchaseKeys } from "../queries/purchase.keys";
import {
  getLandedCosts,
  createLandedCost,
  allocateLandedCost,
} from "../services/landedCost.service";
import type { CreateLandedCostInput } from "../types/landedCost.types";

export function useLandedCosts() {
  return useQuery({
    queryKey: purchaseKeys.landedCosts(),
    queryFn: async () => {
      const response = await getLandedCosts();
      return response.data;
    },
  });
}

export function useLandedCostMutation() {
  const queryClient = useQueryClient();

  const create = useMutation({
    mutationFn: (data: CreateLandedCostInput) => createLandedCost(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: purchaseKeys.landedCosts() });
    },
  });

  return { create };
}

export function useLandedCostAllocationSimulation() {
  return useMutation({
    mutationFn: async ({
      goodsReceive,
      purchaseOrder,
      items,
      allocationMethod,
      manualWeights,
    }: {
      goodsReceive: Parameters<typeof allocateLandedCost>[0];
      purchaseOrder: Parameters<typeof allocateLandedCost>[1];
      items: Parameters<typeof allocateLandedCost>[2];
      allocationMethod: Parameters<typeof allocateLandedCost>[3];
      manualWeights?: Parameters<typeof allocateLandedCost>[4];
    }) => {
      return allocateLandedCost(
        goodsReceive,
        purchaseOrder,
        items,
        allocationMethod,
        manualWeights
      );
    },
  });
}
