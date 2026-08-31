export type BankAccountType = "checking" | "savings" | "cash" | "petty_cash" | "merchant_gateway";

export interface BankAccount {
  id: string;
  name: string;
  accountNumber: string;
  bankName: string;
  branch?: string;
  currency: string;
  type: BankAccountType;
  currentBalance: number;
  generalLedgerAccountId?: string;
  isActive: boolean;
  notes?: string;
  createdAt: string;
}

export type BankTransactionType = 
  | "deposit"
  | "withdrawal"
  | "transfer_in"
  | "transfer_out"
  | "bank_charge"
  | "interest"
  | "cheque";

export interface BankTransactionItem {
  id: string;
  bankAccountId: string;
  targetAccountId?: string; // For internal transfers
  type: BankTransactionType;
  amount: number;
  currency: string;
  reference: string;
  memo: string;
  date: string;
  status: "posted" | "pending" | "void" | "reconciled";
  journalEntryId?: string;
  createdAt: string;
}

export interface CreateBankAccountInput {
  name: string;
  accountNumber: string;
  bankName: string;
  branch?: string;
  currency: string;
  type: BankAccountType;
  initialBalance: number;
  generalLedgerAccountId?: string;
  notes?: string;
}

export interface UpdateBankAccountInput extends Partial<CreateBankAccountInput> {
  id: string;
  isActive?: boolean;
}

export interface CreateBankTransactionInput {
  bankAccountId: string;
  targetAccountId?: string;
  type: BankTransactionType;
  amount: number;
  currency: string;
  reference: string;
  memo: string;
  date: string;
}
