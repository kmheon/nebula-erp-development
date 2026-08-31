/**
 * Multi-Currency Revaluation Query & Mutation Hooks.
 * 
 * ARCHITECTURAL RATIONALE:
 * Orchestrates currency revaluation retrieval, creation, and calculation simulations
 * using standardized accounting query key factories.
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { accountingKeys } from "../queries/accounting.keys";
import {
  getRevaluations,
  createRevaluation,
  calculateCurrencyRevaluation,
} from "../services/revaluation.service";
import type { CreateRevaluationInput } from "../types/revaluation.types";

export function useRevaluations() {
  return useQuery({
    queryKey: accountingKeys.revaluations(),
    queryFn: async () => {
      const response = await getRevaluations();
      return response.data;
    },
    initialData: [],
  });
}

export function useRevaluationMutation() {
  const queryClient = useQueryClient();

  const create = useMutation({
    mutationFn: (data: CreateRevaluationInput) => createRevaluation(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: accountingKeys.revaluations() });
    },
  });

  return { create };
}

export function useRevaluationSimulation() {
  return useMutation({
    mutationFn: async (input: CreateRevaluationInput) => {
      return calculateCurrencyRevaluation(input);
    },
  });
}
