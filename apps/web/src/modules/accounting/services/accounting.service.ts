import { apiClient } from "../../../api/client";

import type {
  Account,
  CreateAccountInput,
  UpdateAccountInput,
  JournalEntry,
  CreateJournalEntryInput,
  UpdateJournalEntryInput,
  LedgerEntry,
  AccountingSummary,
  Transaction,
  FiscalPeriod,
} from "../types/accounting.types";

/* ---------------------------------------------------------------- */
/* Chart of Accounts                                                */
/* ---------------------------------------------------------------- */

export function getAccounts() {
  return apiClient.get<Account[]>("/accounting/accounts");
}

export function createAccount(data: CreateAccountInput) {
  return apiClient.post<Account>("/accounting/accounts", data);
}

export function updateAccount(data: UpdateAccountInput) {
  return apiClient.post<Account>(`/accounting/accounts/${data.id}`, data);
}

export function deleteAccount(id: string) {
  return apiClient.post(`/accounting/accounts/${id}/delete`, {});
}

/* ---------------------------------------------------------------- */
/* Journal Entries & Fiscal Period Governance                       */
/* ---------------------------------------------------------------- */

export async function assertFiscalPeriodOpen(dateStr: string) {
  try {
    const res = await getFiscalPeriods();
    const periods = res.data ?? [];
    const txDate = new Date(dateStr).getTime();

    for (const period of periods) {
      const start = new Date(period.startDate).getTime();
      const end = new Date(period.endDate).getTime();
      if (txDate >= start && txDate <= end) {
        if (period.status === "locked" || period.status === "closed") {
          throw new Error(
            `Enterprise Governance Error: Fiscal period "${period.name}" is ${period.status}. Transactions cannot be posted, created, or modified in locked or closed periods.`
          );
        }
      }
    }
  } catch (err: any) {
    if (err.message && err.message.includes("Enterprise Governance Error")) {
      throw err;
    }
  }
}

export function getJournalEntries() {
  return apiClient.get<JournalEntry[]>("/accounting/journal-entries");
}

export async function createJournalEntry(data: CreateJournalEntryInput) {
  if (data.date) {
    await assertFiscalPeriodOpen(data.date);
  }
  return apiClient.post<JournalEntry>("/accounting/journal-entries", data);
}

export async function updateJournalEntry(data: UpdateJournalEntryInput) {
  if (data.date) {
    await assertFiscalPeriodOpen(data.date);
  }
  return apiClient.post<JournalEntry>(`/accounting/journal-entries/${data.id}`, data);
}

export async function postJournalEntry(id: string) {
  try {
    const res = await getJournalEntries();
    const entries = res.data ?? [];
    const entry = entries.find((e) => e.id === id);
    if (entry && entry.date) {
      await assertFiscalPeriodOpen(entry.date);
    }
  } catch (err: any) {
    if (err.message && err.message.includes("Enterprise Governance Error")) {
      throw err;
    }
  }
  return apiClient.post<JournalEntry>(`/accounting/journal-entries/${id}/post`, {});
}

export function deleteJournalEntry(id: string) {
  return apiClient.post(`/accounting/journal-entries/${id}/delete`, {});
}

/* ---------------------------------------------------------------- */
/* General Ledger                                                   */
/* ---------------------------------------------------------------- */

export function getGeneralLedger(accountId?: string) {
  const endpoint = accountId
    ? `/accounting/ledger?accountId=${accountId}`
    : "/accounting/ledger";
  return apiClient.get<LedgerEntry[]>(endpoint);
}

/* ---------------------------------------------------------------- */
/* Summary & Transactions (existing)                                */
/* ---------------------------------------------------------------- */

export function getAccountingSummary() {
  return apiClient.get<AccountingSummary>("/accounting/summary");
}

export function getTransactions() {
  return apiClient.get<Transaction[]>("/accounting/transactions");
}

export function getFiscalPeriods() {
  return apiClient.get<FiscalPeriod[]>("/accounting/fiscal-periods");
}
