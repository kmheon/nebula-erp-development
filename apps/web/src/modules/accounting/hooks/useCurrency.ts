import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { currencyKeys } from "../queries/currency.keys";
import {
  getCurrencies,
  saveCurrencies,
  getExchangeRates,
  saveExchangeRates,
  getCurrencySettings,
  saveCurrencySettings,
  convertCurrency,
} from "../services/currency.service";

import type { Currency, ExchangeRate, CurrencySettings } from "../types/currency.types";

export function useCurrencies() {
  return useQuery({
    queryKey: currencyKeys.currencies(),
    queryFn: async () => {
      const res = getCurrencies();
      return res.data;
    },
  });
}

export function useExchangeRates() {
  return useQuery({
    queryKey: currencyKeys.rates(),
    queryFn: async () => {
      const res = getExchangeRates();
      return res.data;
    },
  });
}

export function useCurrencySettings() {
  return useQuery({
    queryKey: currencyKeys.settings(),
    queryFn: async () => {
      const res = getCurrencySettings();
      return res.data;
    },
  });
}

export function useCurrencyMutations() {
  const queryClient = useQueryClient();

  const refresh = () => {
    queryClient.invalidateQueries({
      queryKey: currencyKeys.all,
    });
  };

  const addCurrency = useMutation({
    mutationFn: async (newCurrency: Currency) => {
      const { data } = getCurrencies();
      saveCurrencies([...data, newCurrency]);
      return newCurrency;
    },
    onSuccess: refresh,
  });

  const updateCurrency = useMutation({
    mutationFn: async (updated: Currency) => {
      const { data } = getCurrencies();
      const next = data.map((c) => (c.code === updated.code ? updated : c));
      saveCurrencies(next);
      return updated;
    },
    onSuccess: refresh,
  });

  const addExchangeRate = useMutation({
    mutationFn: async (rate: ExchangeRate) => {
      const { data } = getExchangeRates();
      saveExchangeRates([rate, ...data]);
      return rate;
    },
    onSuccess: refresh,
  });

  const updateSettings = useMutation({
    mutationFn: async (settings: CurrencySettings) => {
      saveCurrencySettings(settings);
      return settings;
    },
    onSuccess: refresh,
  });

  return {
    addCurrency,
    updateCurrency,
    addExchangeRate,
    updateSettings,
    convert: convertCurrency,
  };
}
