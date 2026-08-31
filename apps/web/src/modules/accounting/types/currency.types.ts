export type CurrencyCode = string; // e.g., 'USD', 'EUR', 'GBP', 'JPY', 'CAD'

export interface Currency {
  code: CurrencyCode;
  name: string;
  symbol: string;
  decimalPrecision: number;
  isActive: boolean;
  isBaseCurrency: boolean;
  isReportingCurrency: boolean;
}

export interface ExchangeRate {
  id: string;
  fromCurrency: CurrencyCode;
  toCurrency: CurrencyCode;
  rate: number;
  buyRate?: number;
  sellRate?: number;
  midRate?: number;
  effectiveDate: string; // YYYY-MM-DD
  source: "manual" | "ecb" | "fed" | "bloomberg" | "custom";
}

export interface CurrencyRevaluationRecord {
  id: string;
  date: string;
  accountId: string;
  accountName: string;
  currency: CurrencyCode;
  foreignAmount: number;
  oldBaseAmount: number;
  newBaseAmount: number;
  unrealizedGainLoss: number;
  journalEntryId?: string;
}

export interface RealizedGainLossRecord {
  id: string;
  date: string;
  documentId: string;
  documentType: string;
  currency: CurrencyCode;
  originalExchangeRate: number;
  settlementExchangeRate: number;
  foreignAmount: number;
  gainLossAmount: number; // positive = gain, negative = loss
  type: "realized_gain" | "realized_loss";
  journalEntryId?: string;
}

export interface CurrencySettings {
  baseCurrency: CurrencyCode;
  reportingCurrency: CurrencyCode;
  defaultRateProvider: string;
  ratePrecision: number;
  autoUpdates: boolean;
  manualOverride: boolean;
}
