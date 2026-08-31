/**
 * Multi-Currency Revaluation Service.
 * 
 * ARCHITECTURAL RATIONALE:
 * Pure enterprise service for calculating unrealized foreign exchange gains and losses across foreign currency balances.
 * Strictly pure with no side effects, API calls, or database mutations in the core calculation engine.
 */

import { apiClient } from "../../../api/client";
import type {
  RevaluationDocument,
  CreateRevaluationInput,
  RevaluationLine,
  JournalProposal,
} from "../types/revaluation.types";

/**
 * Fetch all revaluation documents.
 */
export function getRevaluations() {
  return apiClient.get<RevaluationDocument[]>("/accounting/revaluations");
}

/**
 * Save a new revaluation document.
 */
export function createRevaluation(data: CreateRevaluationInput) {
  return apiClient.post<RevaluationDocument>("/accounting/revaluations", data);
}

/**
 * PURE ENGINE: Calculate unrealized foreign exchange gains/losses for currency balances.
 */
export function calculateCurrencyRevaluation(input: CreateRevaluationInput): RevaluationDocument {
  const { date, rateType, balances, currentRates, policy } = input;
  const baseCurrency = policy.baseCurrency || "USD";
  const precision = policy.precision ?? 2;

  const lines: RevaluationLine[] = balances.map((balance) => {
    const currentRate = currentRates[balance.currency] ?? balance.historicalRate ?? 1.0;
    
    const historicalBaseValue = Math.round((balance.foreignAmount * balance.historicalRate) * (10 ** precision)) / (10 ** precision);
    const revaluedBaseValue = Math.round((balance.foreignAmount * currentRate) * (10 ** precision)) / (10 ** precision);
    
    // Unrealized gain/loss: if revalued > historical for asset -> gain.
    const rawGainLoss = revaluedBaseValue - historicalBaseValue;
    const unrealizedGainLoss = Math.round(rawGainLoss * (10 ** precision)) / (10 ** precision);

    return {
      accountId: balance.accountId,
      accountCode: balance.accountCode,
      accountName: balance.accountName,
      currency: balance.currency,
      foreignAmount: balance.foreignAmount,
      historicalRate: balance.historicalRate,
      currentRate,
      historicalBaseValue,
      revaluedBaseValue,
      unrealizedGainLoss,
    };
  });

  let totalGain = 0;
  let totalLoss = 0;

  lines.forEach((line) => {
    if (line.unrealizedGainLoss > 0) {
      totalGain += line.unrealizedGainLoss;
    } else if (line.unrealizedGainLoss < 0) {
      totalLoss += Math.abs(line.unrealizedGainLoss);
    }
  });

  totalGain = Math.round(totalGain * (10 ** precision)) / (10 ** precision);
  totalLoss = Math.round(totalLoss * (10 ** precision)) / (10 ** precision);
  const netAdjustment = Math.round((totalGain - totalLoss) * (10 ** precision)) / (10 ** precision);

  // Build suggested accounting entries (proposal only)
  const journalLines: { accountId: string; debit: number; credit: number; description: string }[] = [];

  lines.forEach((line) => {
    if (line.unrealizedGainLoss > 0) {
      // Debit Asset/Account, Credit Unrealized Gain
      journalLines.push({
        accountId: line.accountId,
        debit: line.unrealizedGainLoss,
        credit: 0,
        description: `FX Revaluation Gain on ${line.currency} (${line.foreignAmount} @ ${line.currentRate})`,
      });
      journalLines.push({
        accountId: policy.unrealizedGainAccountId || "acc-gain",
        debit: 0,
        credit: line.unrealizedGainLoss,
        description: `Unrealized FX Gain - ${line.currency}`,
      });
    } else if (line.unrealizedGainLoss < 0) {
      const lossAmount = Math.abs(line.unrealizedGainLoss);
      // Debit Unrealized Loss, Credit Asset/Account
      journalLines.push({
        accountId: policy.unrealizedLossAccountId || "acc-loss",
        debit: lossAmount,
        credit: 0,
        description: `Unrealized FX Loss - ${line.currency}`,
      });
      journalLines.push({
        accountId: line.accountId,
        debit: 0,
        credit: lossAmount,
        description: `FX Revaluation Loss on ${line.currency} (${line.foreignAmount} @ ${line.currentRate})`,
      });
    }
  });

  const journalProposal: JournalProposal = {
    reference: `REV-${date.replace(/-/g, "")}`,
    description: `Multi-Currency Revaluation (${rateType.toUpperCase()}) as of ${date}`,
    date,
    lines: journalLines,
  };

  return {
    id: `rev-${Date.now()}`,
    date,
    baseCurrency,
    reportingCurrency: policy.reportingCurrency || baseCurrency,
    rateType,
    lines,
    totalGain,
    totalLoss,
    netAdjustment,
    status: "draft",
    journalProposal,
    createdAt: new Date().toISOString(),
  };
}
