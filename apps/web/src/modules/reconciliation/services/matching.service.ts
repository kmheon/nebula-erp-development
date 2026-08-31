/* ---------------------------------------------------------------- */
/* Enterprise Matching Engine Service                               */
/* ---------------------------------------------------------------- */

import type { BankTransaction, ReconciliationRule } from "../types/reconciliation.types";
import type { JournalEntry } from "../../accounting/types/accounting.types";
import type { Payment } from "../../payments/types/payment.types";
import type { Settlement } from "../../payments/channels/types/channel.types";

export type MatchSourceType = "journal_entry" | "payment" | "settlement";

export interface PossibleMatch {
  sourceType: MatchSourceType;
  sourceId: string;
  reference: string;
  description: string;
  date: string;
  amount: number;
  currency: string;
  score: number;
  ruleMatched?: string;
  fxDifference?: number;
}

const DEFAULT_RULE: ReconciliationRule = {
  id: "rule-default",
  name: "Standard Enterprise Matching Rule",
  description: "Matches by exact amount or within 1% tolerance, reference similarity, and date proximity (7 days).",
  amountTolerancePercent: 1.0,
  dateToleranceDays: 7,
  matchReference: true,
  matchInvoiceNumber: true,
  matchCustomerVendor: true,
  autoApprove: false,
  isActive: true,
};

function normalizeRef(val?: string): string {
  if (!val) return "";
  return val.toLowerCase().replace(/[^a-z0-9]/g, "").trim();
}

function dateDiffDays(dateA: string, dateB: string): number {
  const a = new Date(dateA).getTime();
  const b = new Date(dateB).getTime();
  if (isNaN(a) || isNaN(b)) return 999;
  return Math.abs(a - b) / (1000 * 3600 * 24);
}

export function findPossibleMatchesForTransaction(
  bankTx: BankTransaction,
  sources: {
    journalEntries?: JournalEntry[];
    payments?: Payment[];
    settlements?: Settlement[];
  },
  rule: ReconciliationRule = DEFAULT_RULE,
): PossibleMatch[] {
  const results: PossibleMatch[] = [];

  const targetAmount = Math.abs(bankTx.amount);

  // 1. Journal Entries
  for (const entry of (sources.journalEntries || [])) {
    const entryAmount = entry.lines.reduce((s, l) => s + Math.abs(l.debit || l.credit), 0) / 2;
    const amountDiff = Math.abs(entryAmount - targetAmount);
    const amountTolerance = targetAmount * (rule.amountTolerancePercent / 100);

    if (amountDiff <= amountTolerance || entryAmount === targetAmount) {
      const days = dateDiffDays(bankTx.date, entry.date);
      if (days <= rule.dateToleranceDays) {
        let score = 0.6;
        if (entryAmount === targetAmount) score += 0.2;
        if (days === 0) score += 0.1;

        const refMatch = rule.matchReference && normalizeRef(entry.reference) && normalizeRef(bankTx.reference) && 
          (normalizeRef(entry.reference) === normalizeRef(bankTx.reference) || normalizeRef(entry.reference).includes(normalizeRef(bankTx.reference)));
        
        if (refMatch) score += 0.1;

        results.push({
          sourceType: "journal_entry",
          sourceId: entry.id,
          reference: entry.reference || "JE-000",
          description: entry.description,
          date: entry.date,
          amount: entryAmount,
          currency: "USD",
          score: Math.min(score, 1.0),
          ruleMatched: rule.name,
          fxDifference: entryAmount !== targetAmount ? entryAmount - targetAmount : 0,
        });
      }
    }
  }

  // 2. Payments
  for (const payment of (sources.payments || [])) {
    const payAmount = Math.abs(payment.amount);
    const amountDiff = Math.abs(payAmount - targetAmount);
    const amountTolerance = targetAmount * (rule.amountTolerancePercent / 100);

    if (amountDiff <= amountTolerance || payAmount === targetAmount) {
      const days = dateDiffDays(bankTx.date, payment.date);
      if (days <= rule.dateToleranceDays) {
        let score = 0.7;
        if (payAmount === targetAmount) score += 0.2;
        if (days === 0) score += 0.1;

        results.push({
          sourceType: "payment",
          sourceId: payment.id,
          reference: payment.reference,
          description: payment.note || payment.status,
          date: payment.date,
          amount: payAmount,
          currency: "USD",
          score: Math.min(score, 1.0),
          ruleMatched: rule.name,
          fxDifference: payAmount !== targetAmount ? payAmount - targetAmount : 0,
        });
      }
    }
  }

  // 3. Settlements
  for (const settlement of (sources.settlements || [])) {
    const settAmount = Math.abs(settlement.amount);
    const amountDiff = Math.abs(settAmount - targetAmount);
    const amountTolerance = targetAmount * (rule.amountTolerancePercent / 100);

    if (amountDiff <= amountTolerance || settAmount === targetAmount) {
      const days = dateDiffDays(bankTx.date, settlement.settlementDate);
      if (days <= rule.dateToleranceDays) {
        let score = 0.65;
        if (settAmount === targetAmount) score += 0.25;

        results.push({
          sourceType: "settlement",
          sourceId: settlement.id,
          reference: settlement.id,
          description: `Settlement Account ${settlement.paymentAccountId}`,
          date: settlement.settlementDate,
          amount: settAmount,
          currency: "USD",
          score: Math.min(score, 1.0),
          ruleMatched: rule.name,
          fxDifference: settAmount !== targetAmount ? settAmount - targetAmount : 0,
        });
      }
    }
  }

  return results.sort((a, b) => b.score - a.score);
}

export function findPossibleMatchesForMany(
  bankTransactions: BankTransaction[],
  sources: {
    journalEntries?: JournalEntry[];
    payments?: Payment[];
    settlements?: Settlement[];
  },
  rule: ReconciliationRule = DEFAULT_RULE,
): Record<string, PossibleMatch[]> {
  const map: Record<string, PossibleMatch[]> = {};
  for (const tx of bankTransactions) {
    map[tx.id] = findPossibleMatchesForTransaction(tx, sources, rule);
  }
  return map;
}
