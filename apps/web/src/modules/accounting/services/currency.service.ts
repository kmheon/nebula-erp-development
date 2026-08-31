import type { Currency, ExchangeRate, CurrencySettings } from "../types/currency.types";

const LOCAL_STORAGE_CURRENCIES_KEY = "nebula-currencies-v1";
const LOCAL_STORAGE_RATES_KEY = "nebula-exchange-rates-v1";
const LOCAL_STORAGE_SETTINGS_KEY = "nebula-currency-settings-v1";

const DEFAULT_CURRENCIES: Currency[] = [
  { code: "USD", name: "US Dollar", symbol: "$", decimalPrecision: 2, isActive: true, isBaseCurrency: true, isReportingCurrency: true },
  { code: "EUR", name: "Euro", symbol: "€", decimalPrecision: 2, isActive: true, isBaseCurrency: false, isReportingCurrency: false },
  { code: "GBP", name: "British Pound", symbol: "£", decimalPrecision: 2, isActive: true, isBaseCurrency: false, isReportingCurrency: false },
  { code: "JPY", name: "Japanese Yen", symbol: "¥", decimalPrecision: 0, isActive: true, isBaseCurrency: false, isReportingCurrency: false },
  { code: "CAD", name: "Canadian Dollar", symbol: "CA$", decimalPrecision: 2, isActive: true, isBaseCurrency: false, isReportingCurrency: false },
  { code: "AUD", name: "Australian Dollar", symbol: "AU$", decimalPrecision: 2, isActive: true, isBaseCurrency: false, isReportingCurrency: false },
];

const DEFAULT_RATES: ExchangeRate[] = [
  { id: "rate-eur", fromCurrency: "EUR", toCurrency: "USD", rate: 1.08, buyRate: 1.078, sellRate: 1.082, midRate: 1.08, effectiveDate: new Date().toISOString().split("T")[0], source: "ecb" },
  { id: "rate-gbp", fromCurrency: "GBP", toCurrency: "USD", rate: 1.28, buyRate: 1.277, sellRate: 1.283, midRate: 1.28, effectiveDate: new Date().toISOString().split("T")[0], source: "ecb" },
  { id: "rate-jpy", fromCurrency: "JPY", toCurrency: "USD", rate: 0.0067, buyRate: 0.0066, sellRate: 0.0068, midRate: 0.0067, effectiveDate: new Date().toISOString().split("T")[0], source: "fed" },
  { id: "rate-cad", fromCurrency: "CAD", toCurrency: "USD", rate: 0.74, buyRate: 0.738, sellRate: 0.742, midRate: 0.74, effectiveDate: new Date().toISOString().split("T")[0], source: "bloomberg" },
];

const DEFAULT_SETTINGS: CurrencySettings = {
  baseCurrency: "USD",
  reportingCurrency: "USD",
  defaultRateProvider: "European Central Bank (ECB)",
  ratePrecision: 4,
  autoUpdates: true,
  manualOverride: true,
};

export function getCurrencies(): { data: Currency[] } {
  if (typeof window === "undefined") return { data: DEFAULT_CURRENCIES };
  const stored = window.localStorage.getItem(LOCAL_STORAGE_CURRENCIES_KEY);
  if (!stored) {
    window.localStorage.setItem(LOCAL_STORAGE_CURRENCIES_KEY, JSON.stringify(DEFAULT_CURRENCIES));
    return { data: DEFAULT_CURRENCIES };
  }
  return { data: JSON.parse(stored) };
}

export function saveCurrencies(currencies: Currency[]): void {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(LOCAL_STORAGE_CURRENCIES_KEY, JSON.stringify(currencies));
  }
}

export function getExchangeRates(): { data: ExchangeRate[] } {
  if (typeof window === "undefined") return { data: DEFAULT_RATES };
  const stored = window.localStorage.getItem(LOCAL_STORAGE_RATES_KEY);
  if (!stored) {
    window.localStorage.setItem(LOCAL_STORAGE_RATES_KEY, JSON.stringify(DEFAULT_RATES));
    return { data: DEFAULT_RATES };
  }
  return { data: JSON.parse(stored) };
}

export function saveExchangeRates(rates: ExchangeRate[]): void {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(LOCAL_STORAGE_RATES_KEY, JSON.stringify(rates));
  }
}

export function getCurrencySettings(): { data: CurrencySettings } {
  if (typeof window === "undefined") return { data: DEFAULT_SETTINGS };
  const stored = window.localStorage.getItem(LOCAL_STORAGE_SETTINGS_KEY);
  if (!stored) {
    window.localStorage.setItem(LOCAL_STORAGE_SETTINGS_KEY, JSON.stringify(DEFAULT_SETTINGS));
    return { data: DEFAULT_SETTINGS };
  }
  return { data: JSON.parse(stored) };
}

export function saveCurrencySettings(settings: CurrencySettings): void {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(LOCAL_STORAGE_SETTINGS_KEY, JSON.stringify(settings));
  }
}

/**
 * Pure currency conversion service supporting base, foreign, and historical cross-rates.
 */
export function convertCurrency(
  amount: number,
  fromCurrency: string,
  toCurrency: string,
): { convertedAmount: number; exchangeRate: number } {
  if (fromCurrency === toCurrency) {
    return { convertedAmount: amount, exchangeRate: 1.0 };
  }

  const { data: rates } = getExchangeRates();
  getCurrencies();
  const settings = getCurrencySettings().data;

  const base = settings.baseCurrency;

  // Find direct rate from -> to
  let rateObj = rates.find(
    (r) => r.fromCurrency === fromCurrency && r.toCurrency === toCurrency,
  );

  if (rateObj) {
    return {
      convertedAmount: amount * rateObj.rate,
      exchangeRate: rateObj.rate,
    };
  }

  // Find inverse rate to -> from
  const inverseObj = rates.find(
    (r) => r.fromCurrency === toCurrency && r.toCurrency === fromCurrency,
  );

  if (inverseObj && inverseObj.rate > 0) {
    const invRate = 1 / inverseObj.rate;
    return {
      convertedAmount: amount * invRate,
      exchangeRate: invRate,
    };
  }

  // Convert via base currency if neither direct nor inverse exists
  let fromToBaseRate = 1.0;
  if (fromCurrency !== base) {
    const directToBase = rates.find(
      (r) => r.fromCurrency === fromCurrency && r.toCurrency === base,
    );
    if (directToBase) {
      fromToBaseRate = directToBase.rate;
    } else {
      const inverseBase = rates.find(
        (r) => r.fromCurrency === base && r.toCurrency === fromCurrency,
      );
      if (inverseBase && inverseBase.rate > 0) {
        fromToBaseRate = 1 / inverseBase.rate;
      }
    }
  }

  let baseToTargetRate = 1.0;
  if (toCurrency !== base) {
    const directToTarget = rates.find(
      (r) => r.fromCurrency === base && r.toCurrency === toCurrency,
    );
    if (directToTarget) {
      baseToTargetRate = directToTarget.rate;
    } else {
      const inverseTarget = rates.find(
        (r) => r.fromCurrency === toCurrency && r.toCurrency === base,
      );
      if (inverseTarget && inverseTarget.rate > 0) {
        baseToTargetRate = 1 / inverseTarget.rate;
      }
    }
  }

  const crossRate = fromToBaseRate * baseToTargetRate;
  return {
    convertedAmount: amount * crossRate,
    exchangeRate: crossRate,
  };
}
