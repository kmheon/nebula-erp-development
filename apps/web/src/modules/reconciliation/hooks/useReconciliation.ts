import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { reconciliationKeys } from "../queries/reconciliation.keys";
import {
  getBankTransactions,
  createBankTransaction,
  getMatches,
  createMatch,
  getReconciliationRules,
  saveReconciliationRules,
  getReconciliationExceptions,
  getReconciliationAuditLogs,
} from "../services/reconciliation.service";

import type {
  CreateBankTransactionInput,
  CreateMatchInput,
  ReconciliationRule,
} from "../types/reconciliation.types";

export function useBankTransactions() {
  return useQuery({
    queryKey: reconciliationKeys.transactions(),
    queryFn: async () => getBankTransactions().data,
  });
}

export function useMatches() {
  return useQuery({
    queryKey: reconciliationKeys.matches(),
    queryFn: async () => getMatches().data,
  });
}

export function useReconciliationRulesQuery() {
  return useQuery({
    queryKey: reconciliationKeys.rules(),
    queryFn: async () => getReconciliationRules().data,
  });
}

export function useReconciliationExceptionsQuery() {
  return useQuery({
    queryKey: reconciliationKeys.exceptions(),
    queryFn: async () => getReconciliationExceptions().data,
  });
}

export function useReconciliationAuditQuery() {
  return useQuery({
    queryKey: reconciliationKeys.audit(),
    queryFn: async () => getReconciliationAuditLogs().data,
  });
}

export function useReconciliationMutations() {
  const queryClient = useQueryClient();

  const refresh = () => {
    queryClient.invalidateQueries({
      queryKey: reconciliationKeys.all,
    });
  };

  const addBankTransaction = useMutation({
    mutationFn: async (data: CreateBankTransactionInput) => createBankTransaction(data),
    onSuccess: refresh,
  });

  const createReconciliationMatch = useMutation({
    mutationFn: async (data: CreateMatchInput) => createMatch(data),
    onSuccess: refresh,
  });

  const updateRules = useMutation({
    mutationFn: async (rules: ReconciliationRule[]) => {
      saveReconciliationRules(rules);
      return rules;
    },
    onSuccess: refresh,
  });

  return {
    addBankTransaction,
    createReconciliationMatch,
    updateRules,
  };
}
