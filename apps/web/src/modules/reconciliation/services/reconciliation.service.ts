/* ---------------------------------------------------------------- */
/* Enterprise Reconciliation Service                                */
/* ---------------------------------------------------------------- */

import type {
  BankTransaction,
  CreateBankTransactionInput,
  CreateMatchInput,
  ReconciliationMatch,
  ReconciliationRule,
  ReconciliationException,
  ReconciliationAuditLog,
} from "../types/reconciliation.types";

const LOCAL_STORAGE_TX_KEY = "nebula-reconciliation-transactions-v1";
const LOCAL_STORAGE_MATCHES_KEY = "nebula-reconciliation-matches-v1";
const LOCAL_STORAGE_RULES_KEY = "nebula-reconciliation-rules-v1";
const LOCAL_STORAGE_EXCEPTIONS_KEY = "nebula-reconciliation-exceptions-v1";
const LOCAL_STORAGE_AUDIT_KEY = "nebula-reconciliation-audit-v1";

const DEFAULT_TRANSACTIONS: BankTransaction[] = [
  {
    id: "bt-101",
    accountId: "ba-1",
    accountName: "Main Operating Account (Chase)",
    date: new Date().toISOString().split("T")[0],
    description: "Incoming Wire Transfer - Acme Corp Invoice #INV-2026-001",
    reference: "REF-998231",
    invoiceNumber: "INV-2026-001",
    partyName: "Acme Corp",
    amount: 15450.00,
    currency: "USD",
    type: "deposit",
    status: "unmatched",
  },
  {
    id: "bt-102",
    accountId: "ba-1",
    accountName: "Main Operating Account (Chase)",
    date: new Date(Date.now() - 86400000).toISOString().split("T")[0],
    description: "Monthly SaaS Hosting Fee - AWS Cloud",
    reference: "AWS-FEES-08",
    amount: 1240.50,
    currency: "USD",
    type: "withdrawal",
    status: "unmatched",
  },
  {
    id: "bt-103",
    accountId: "ba-2",
    accountName: "bKash Merchant Settlement",
    date: new Date(Date.now() - 172800000).toISOString().split("T")[0],
    description: "Daily POS Settlement Batch #BK-8821",
    reference: "BK-8821",
    amount: 4320.00,
    currency: "USD",
    type: "deposit",
    status: "matched",
  },
  {
    id: "bt-104",
    accountId: "ba-1",
    accountName: "Main Operating Account (Chase)",
    date: new Date(Date.now() - 259200000).toISOString().split("T")[0],
    description: "Bank Service Charge & Wire Fee",
    reference: "CHG-2026-03",
    amount: 35.00,
    currency: "USD",
    type: "charge",
    status: "unmatched",
  },
];

const DEFAULT_MATCHES: ReconciliationMatch[] = [
  {
    id: "match-1",
    bankTransactionId: "bt-103",
    journalEntryId: "je-settle-01",
    matchedAmount: 4320.00,
    currency: "USD",
    exchangeRate: 1.0,
    fxGainLoss: 0,
    status: "matched",
    matchRuleUsed: "Standard Enterprise Matching Rule",
  },
];

const DEFAULT_RULES: ReconciliationRule[] = [
  {
    id: "rule-1",
    name: "Standard Enterprise Matching Rule",
    description: "Matches by exact amount or within 1% tolerance, reference similarity, and date proximity.",
    amountTolerancePercent: 1.0,
    dateToleranceDays: 7,
    matchReference: true,
    matchInvoiceNumber: true,
    matchCustomerVendor: true,
    autoApprove: false,
    isActive: true,
  },
];

const DEFAULT_EXCEPTIONS: ReconciliationException[] = [
  {
    id: "exc-1",
    bankTransactionId: "bt-104",
    exceptionType: "unmatched",
    description: "Unmatched bank service charge fee requiring GL expense categorization.",
    amount: 35.00,
    currency: "USD",
    status: "open",
    createdAt: new Date().toISOString(),
  },
];

const DEFAULT_AUDIT: ReconciliationAuditLog[] = [
  {
    id: "audit-1",
    timestamp: new Date().toISOString(),
    action: "SYSTEM_INIT",
    entityId: "system",
    performedBy: "System Architect",
    details: "Initialized Enterprise Payment Reconciliation Engine with default accounts and rules.",
  },
];

export function getBankTransactions(): { data: BankTransaction[] } {
  if (typeof window === "undefined") return { data: DEFAULT_TRANSACTIONS };
  const stored = window.localStorage.getItem(LOCAL_STORAGE_TX_KEY);
  if (!stored) {
    window.localStorage.setItem(LOCAL_STORAGE_TX_KEY, JSON.stringify(DEFAULT_TRANSACTIONS));
    return { data: DEFAULT_TRANSACTIONS };
  }
  return { data: JSON.parse(stored) };
}

export function saveBankTransactions(items: BankTransaction[]): void {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(LOCAL_STORAGE_TX_KEY, JSON.stringify(items));
  }
}

export function getMatches(): { data: ReconciliationMatch[] } {
  if (typeof window === "undefined") return { data: DEFAULT_MATCHES };
  const stored = window.localStorage.getItem(LOCAL_STORAGE_MATCHES_KEY);
  if (!stored) {
    window.localStorage.setItem(LOCAL_STORAGE_MATCHES_KEY, JSON.stringify(DEFAULT_MATCHES));
    return { data: DEFAULT_MATCHES };
  }
  return { data: JSON.parse(stored) };
}

export function saveMatches(items: ReconciliationMatch[]): void {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(LOCAL_STORAGE_MATCHES_KEY, JSON.stringify(items));
  }
}

export function getReconciliationRules(): { data: ReconciliationRule[] } {
  if (typeof window === "undefined") return { data: DEFAULT_RULES };
  const stored = window.localStorage.getItem(LOCAL_STORAGE_RULES_KEY);
  if (!stored) {
    window.localStorage.setItem(LOCAL_STORAGE_RULES_KEY, JSON.stringify(DEFAULT_RULES));
    return { data: DEFAULT_RULES };
  }
  return { data: JSON.parse(stored) };
}

export function saveReconciliationRules(items: ReconciliationRule[]): void {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(LOCAL_STORAGE_RULES_KEY, JSON.stringify(items));
  }
}

export function getReconciliationExceptions(): { data: ReconciliationException[] } {
  if (typeof window === "undefined") return { data: DEFAULT_EXCEPTIONS };
  const stored = window.localStorage.getItem(LOCAL_STORAGE_EXCEPTIONS_KEY);
  if (!stored) {
    window.localStorage.setItem(LOCAL_STORAGE_EXCEPTIONS_KEY, JSON.stringify(DEFAULT_EXCEPTIONS));
    return { data: DEFAULT_EXCEPTIONS };
  }
  return { data: JSON.parse(stored) };
}

export function saveReconciliationExceptions(items: ReconciliationException[]): void {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(LOCAL_STORAGE_EXCEPTIONS_KEY, JSON.stringify(items));
  }
}

export function getReconciliationAuditLogs(): { data: ReconciliationAuditLog[] } {
  if (typeof window === "undefined") return { data: DEFAULT_AUDIT };
  const stored = window.localStorage.getItem(LOCAL_STORAGE_AUDIT_KEY);
  if (!stored) {
    window.localStorage.setItem(LOCAL_STORAGE_AUDIT_KEY, JSON.stringify(DEFAULT_AUDIT));
    return { data: DEFAULT_AUDIT };
  }
  return { data: JSON.parse(stored) };
}

export function saveReconciliationAuditLogs(items: ReconciliationAuditLog[]): void {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(LOCAL_STORAGE_AUDIT_KEY, JSON.stringify(items));
  }
}

export function createBankTransaction(data: CreateBankTransactionInput): BankTransaction {
  const { data: list } = getBankTransactions();
  const newTx: BankTransaction = {
    id: `bt-${Date.now()}`,
    ...data,
    currency: data.currency || "USD",
    status: "unmatched",
    createdAt: new Date().toISOString(),
  };
  saveBankTransactions([newTx, ...list]);
  return newTx;
}

export function createMatch(data: CreateMatchInput): ReconciliationMatch {
  const { data: matches } = getMatches();
  const newMatch: ReconciliationMatch = {
    id: `match-${Date.now()}`,
    currency: "USD",
    exchangeRate: 1.0,
    fxGainLoss: 0,
    status: "matched",
    ...data,
    createdAt: new Date().toISOString(),
  };
  saveMatches([newMatch, ...matches]);

  // Update bank transaction status to matched
  const { data: txs } = getBankTransactions();
  const updatedTxs = txs.map((tx) =>
    tx.id === data.bankTransactionId ? { ...tx, status: "matched" as const } : tx,
  );
  saveBankTransactions(updatedTxs);

  return newMatch;
}
