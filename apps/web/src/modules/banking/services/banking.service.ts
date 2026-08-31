import { apiClient } from "../../../api/client";
import { createJournalEntry, getAccounts } from "../../accounting/services/accounting.service";
import type { CreateJournalEntryInput } from "../../accounting/types/accounting.types";
import type {
  BankAccount,
  BankTransactionItem,
  CreateBankAccountInput,
  CreateBankTransactionInput,
  UpdateBankAccountInput,
} from "../types/banking.types";

const LOCAL_STORAGE_ACCOUNTS_KEY = "nebula-banking-accounts-v1";
const LOCAL_STORAGE_TX_KEY = "nebula-banking-transactions-v1";

const DEFAULT_ACCOUNTS: BankAccount[] = [
  {
    id: "bank-acc-1",
    name: "Primary Corporate Checking",
    accountNumber: "1002938481",
    bankName: "Chase Bank Enterprise",
    branch: "New York Main",
    currency: "USD",
    type: "checking",
    currentBalance: 245000.00,
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "bank-acc-2",
    name: "Operating Reserve Savings",
    accountNumber: "2003849582",
    bankName: "Silicon Valley Bank",
    branch: "SF Financial",
    currency: "USD",
    type: "savings",
    currentBalance: 520000.00,
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "bank-acc-3",
    name: "Petty Cash Drawer",
    accountNumber: "CASH-01",
    bankName: "Internal Cash",
    currency: "USD",
    type: "petty_cash",
    currentBalance: 2500.00,
    isActive: true,
    createdAt: new Date().toISOString(),
  },
];

const DEFAULT_TRANSACTIONS: BankTransactionItem[] = [
  {
    id: "tx-1",
    bankAccountId: "bank-acc-1",
    type: "deposit",
    amount: 35000.00,
    currency: "USD",
    reference: "DEP-2026-001",
    memo: "Customer Enterprise Invoice Settlement Batch",
    date: new Date().toISOString().split("T")[0],
    status: "posted",
    createdAt: new Date().toISOString(),
  },
  {
    id: "tx-2",
    bankAccountId: "bank-acc-1",
    type: "bank_charge",
    amount: 45.00,
    currency: "USD",
    reference: "CHG-2026-001",
    memo: "Monthly wire transfer and maintenance fees",
    date: new Date().toISOString().split("T")[0],
    status: "posted",
    createdAt: new Date().toISOString(),
  },
];

export async function getBankAccounts(): Promise<{ data: BankAccount[] }> {
  try {
    const res = await apiClient.get<BankAccount[]>("/banking/accounts");
    return { data: res.data || [] };
  } catch {
    if (typeof window === "undefined") return { data: DEFAULT_ACCOUNTS };
    const stored = window.localStorage.getItem(LOCAL_STORAGE_ACCOUNTS_KEY);
    if (!stored) {
      window.localStorage.setItem(LOCAL_STORAGE_ACCOUNTS_KEY, JSON.stringify(DEFAULT_ACCOUNTS));
      return { data: DEFAULT_ACCOUNTS };
    }
    return { data: JSON.parse(stored) };
  }
}

export async function getBankTransactions(): Promise<{ data: BankTransactionItem[] }> {
  try {
    const res = await apiClient.get<BankTransactionItem[]>("/banking/transactions");
    return { data: res.data || [] };
  } catch {
    if (typeof window === "undefined") return { data: DEFAULT_TRANSACTIONS };
    const stored = window.localStorage.getItem(LOCAL_STORAGE_TX_KEY);
    if (!stored) {
      window.localStorage.setItem(LOCAL_STORAGE_TX_KEY, JSON.stringify(DEFAULT_TRANSACTIONS));
      return { data: DEFAULT_TRANSACTIONS };
    }
    return { data: JSON.parse(stored) };
  }
}

export async function createBankAccount(input: CreateBankAccountInput): Promise<{ data: BankAccount }> {
  const { data: accounts } = await getBankAccounts();
  const newAccount: BankAccount = {
    id: `bank-acc-${Date.now()}`,
    name: input.name,
    accountNumber: input.accountNumber,
    bankName: input.bankName,
    branch: input.branch,
    currency: input.currency,
    type: input.type,
    currentBalance: input.initialBalance,
    generalLedgerAccountId: input.generalLedgerAccountId,
    isActive: true,
    notes: input.notes,
    createdAt: new Date().toISOString(),
  };

  const updated = [newAccount, ...accounts];
  if (typeof window !== "undefined") {
    window.localStorage.setItem(LOCAL_STORAGE_ACCOUNTS_KEY, JSON.stringify(updated));
  }

  return { data: newAccount };
}

export async function updateBankAccount(input: UpdateBankAccountInput): Promise<{ data: BankAccount }> {
  const { data: accounts } = await getBankAccounts();
  let updatedAccount: BankAccount | null = null;

  const updated = accounts.map((acc) => {
    if (acc.id === input.id) {
      updatedAccount = {
        ...acc,
        ...input,
      };
      return updatedAccount;
    }
    return acc;
  });

  if (!updatedAccount) throw new Error("Bank account not found");

  if (typeof window !== "undefined") {
    window.localStorage.setItem(LOCAL_STORAGE_ACCOUNTS_KEY, JSON.stringify(updated));
  }

  return { data: updatedAccount };
}

export async function createBankTransactionWithAccounting(
  input: CreateBankTransactionInput,
): Promise<{ data: BankTransactionItem }> {
  const { data: accounts } = await getBankAccounts();
  const { data: txs } = await getBankTransactions();

  const sourceAccount = accounts.find((a) => a.id === input.bankAccountId);
  if (!sourceAccount) throw new Error("Source bank account not found");

  let targetAccount: BankAccount | undefined;
  if (input.targetAccountId) {
    targetAccount = accounts.find((a) => a.id === input.targetAccountId);
  }

  // Calculate new balance updates
  let newSourceBalance = sourceAccount.currentBalance;
  let newTargetBalance = targetAccount ? targetAccount.currentBalance : 0;

  if (input.type === "deposit" || input.type === "interest" || input.type === "transfer_in") {
    newSourceBalance += input.amount;
  } else if (input.type === "withdrawal" || input.type === "bank_charge" || input.type === "transfer_out" || input.type === "cheque") {
    newSourceBalance -= input.amount;
  }

  if (targetAccount && (input.type === "transfer_out" || input.type === "deposit")) {
    // If it's an internal transfer from source to target
    newTargetBalance += input.amount;
  }

  // Post accounting journal entry if possible
  let journalEntryId: string | undefined;
  try {
    const glAccountsRes = await getAccounts();
    const glAccounts = glAccountsRes.data || [];
    const cashGl = glAccounts.find((a) => a.type === "asset" && (a.name.toLowerCase().includes("bank") || a.name.toLowerCase().includes("cash"))) || glAccounts[0];

    if (cashGl) {
      const jeInput: CreateJournalEntryInput = {
        date: input.date,
        reference: input.reference,
        description: input.memo || `${input.type.toUpperCase()}: ${sourceAccount.name}`,
        lines: [
          {
            accountId: cashGl.id,
            debit: input.type === "deposit" || input.type === "interest" ? input.amount : 0,
            credit: input.type !== "deposit" && input.type !== "interest" ? input.amount : 0,
          },
          {
            accountId: cashGl.id, // balancing contra line
            debit: input.type !== "deposit" && input.type !== "interest" ? input.amount : 0,
            credit: input.type === "deposit" || input.type === "interest" ? input.amount : 0,
          },
        ],
      };
      const jeRes = await createJournalEntry(jeInput);
      journalEntryId = jeRes.data.id;
    }
  } catch (err) {
    console.warn("Could not auto-post journal entry for bank transaction:", err);
  }

  const newTx: BankTransactionItem = {
    id: `tx-${Date.now()}`,
    bankAccountId: input.bankAccountId,
    targetAccountId: input.targetAccountId,
    type: input.type,
    amount: input.amount,
    currency: input.currency,
    reference: input.reference,
    memo: input.memo,
    date: input.date,
    status: "posted",
    journalEntryId,
    createdAt: new Date().toISOString(),
  };

  const updatedTxs = [newTx, ...txs];
  const updatedAccounts = accounts.map((acc) => {
    if (acc.id === sourceAccount.id) {
      return { ...acc, currentBalance: newSourceBalance };
    }
    if (targetAccount && acc.id === targetAccount.id) {
      return { ...acc, currentBalance: newTargetBalance };
    }
    return acc;
  });

  if (typeof window !== "undefined") {
    window.localStorage.setItem(LOCAL_STORAGE_TX_KEY, JSON.stringify(updatedTxs));
    window.localStorage.setItem(LOCAL_STORAGE_ACCOUNTS_KEY, JSON.stringify(updatedAccounts));
  }

  return { data: newTx };
}
