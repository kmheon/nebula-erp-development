/**
 * Multi-Currency Revaluation Types & Schemas.
 * 
 * ARCHITECTURAL RATIONALE:
 * Defines enterprise multi-currency revaluation structures, exchange rates, foreign currency balances,
 * unrealized FX gain/loss lines, and journal proposal structures owned strictly by the Accounting module.
 */

export type CurrencyCode = string; // e.g., "USD", "EUR", "GBP", "JPY", "CAD"

export type ExchangeRateType = "spot" | "closing" | "average";

export interface ExchangeRate {
  id: string;
  fromCurrency: CurrencyCode;
  toCurrency: CurrencyCode; // usually base currency
  rateType: ExchangeRateType;
  rate: number;
  effectiveDate: string;
}

export interface CurrencyBalance {
  id: string;
  accountId: string;
  accountCode: string;
  accountName: string;
  currency: CurrencyCode;
  foreignAmount: number;
  historicalRate: number;
}

export interface RevaluationPolicy {
  baseCurrency: CurrencyCode;
  reportingCurrency: CurrencyCode;
  rateType: ExchangeRateType;
  precision: number;
  unrealizedGainAccountId: string;
  unrealizedLossAccountId: string;
}

export interface RevaluationLine {
  accountId: string;
  accountCode: string;
  accountName: string;
  currency: CurrencyCode;
  foreignAmount: number;
  historicalRate: number;
  currentRate: number;
  historicalBaseValue: number;
  revaluedBaseValue: number;
  unrealizedGainLoss: number; // Positive = Gain, Negative = Loss
}

export interface JournalProposalLine {
  accountId: string;
  debit: number;
  credit: number;
  description: string;
}

export interface JournalProposal {
  reference: string;
  description: string;
  date: string;
  lines: JournalProposalLine[];
}

export interface RevaluationDocument {
  id: string;
  date: string;
  baseCurrency: CurrencyCode;
  reportingCurrency: CurrencyCode;
  rateType: ExchangeRateType;
  lines: RevaluationLine[];
  totalGain: number;
  totalLoss: number;
  netAdjustment: number; // Net unrealized gain/loss
  status: "draft" | "approved" | "posted";
  journalProposal: JournalProposal;
  createdAt: string;
}

export interface CreateRevaluationInput {
  date: string;
  rateType: ExchangeRateType;
  balances: CurrencyBalance[];
  currentRates: Record<CurrencyCode, number>;
  policy: RevaluationPolicy;
}
