import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { bankingKeys } from "../queries/banking.keys";
import {
  createBankAccount,
  createBankTransactionWithAccounting,
  getBankAccounts,
  getBankTransactions,
  updateBankAccount,
} from "../services/banking.service";

import type {
  CreateBankAccountInput,
  CreateBankTransactionInput,
  UpdateBankAccountInput,
} from "../types/banking.types";

export function useBankAccounts() {
  return useQuery({
    queryKey: bankingKeys.accounts(),
    queryFn: async () => {
      const res = await getBankAccounts();
      return res.data;
    },
  });
}

export function useBankTransactions() {
  return useQuery({
    queryKey: bankingKeys.transactions(),
    queryFn: async () => {
      const res = await getBankTransactions();
      return res.data;
    },
  });
}

export function useBankingMutations() {
  const queryClient = useQueryClient();

  const refresh = () => {
    queryClient.invalidateQueries({
      queryKey: bankingKeys.all,
    });
  };

  const createAccount = useMutation({
    mutationFn: (input: CreateBankAccountInput) => createBankAccount(input),
    onSuccess: refresh,
  });

  const updateAccount = useMutation({
    mutationFn: (input: UpdateBankAccountInput) => updateBankAccount(input),
    onSuccess: refresh,
  });

  const createTransaction = useMutation({
    mutationFn: (input: CreateBankTransactionInput) => createBankTransactionWithAccounting(input),
    onSuccess: refresh,
  });

  return {
    createAccount,
    updateAccount,
    createTransaction,
  };
}
