/* ---------------------------------------------------------------- */
/* Enterprise Bank Reconciliation Types                             */
/* ---------------------------------------------------------------- */

export type BankTransactionType = "credit" | "debit" | "deposit" | "withdrawal" | "transfer" | "charge" | "interest";

export type BankTransactionStatus =
  | "unmatched"
  | "matched"
  | "reconciled"
  | "exception"
  | "ignored"
  | "suspense";

export interface BankTransaction {
  id: string;
  accountId: string;
  accountName?: string;
  date: string;
  description: string;
  reference?: string;
  invoiceNumber?: string;
  bankReference?: string;
  partyName?: string; // customer or vendor
  amount: number;
  currency: string;
  exchangeRate?: number;
  type: BankTransactionType;
  status: BankTransactionStatus;
  toleranceApplied?: number;
  fxDifference?: number;
  suspenseReason?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateBankTransactionInput {
  accountId: string;
  date: string;
  description: string;
  reference?: string;
  invoiceNumber?: string;
  bankReference?: string;
  partyName?: string;
  amount: number;
  currency?: string;
  exchangeRate?: number;
  type: BankTransactionType;
}

export type ReconciliationMatchStatus =
  | "matched"
  | "split"
  | "merged"
  | "approved"
  | "rejected"
  | "ignored";

export interface ReconciliationMatch {
  id: string;
  bankTransactionId: string;
  journalEntryId: string;
  matchedAmount: number;
  currency: string;
  exchangeRate: number;
  fxGainLoss: number;
  status: ReconciliationMatchStatus;
  matchRuleUsed?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateMatchInput {
  bankTransactionId: string;
  journalEntryId: string;
  matchedAmount: number;
  currency?: string;
  exchangeRate?: number;
  fxGainLoss?: number;
  status?: ReconciliationMatchStatus;
  matchRuleUsed?: string;
}

export interface ReconciliationRule {
  id: string;
  name: string;
  description: string;
  amountTolerancePercent: number;
  dateToleranceDays: number;
  matchReference: boolean;
  matchInvoiceNumber: boolean;
  matchCustomerVendor: boolean;
  autoApprove: boolean;
  isActive: boolean;
}

export interface ReconciliationException {
  id: string;
  bankTransactionId: string;
  exceptionType: 
    | "duplicate_payment" 
    | "missing_payment" 
    | "overpayment" 
    | "underpayment" 
    | "currency_difference" 
    | "exchange_difference" 
    | "unmatched" 
    | "suspense_item";
  description: string;
  amount: number;
  currency: string;
  status: "open" | "resolved" | "routed_to_suspense";
  resolvedJournalEntryId?: string;
  createdAt: string;
}

export interface ReconciliationAuditLog {
  id: string;
  timestamp: string;
  action: string;
  entityId: string;
  performedBy: string;
  details: string;
}
