export type AllocationPolicy =
  | "fifo"
  | "lifo"
  | "oldest_invoice"
  | "newest_invoice"
  | "due_date"
  | "largest_amount"
  | "smallest_amount"
  | "manual"
  | "proportional";

export interface SettlementSettings {
  defaultAllocationPolicy: AllocationPolicy;
  allowManualOverride: boolean;
  allowOverpayment: boolean;
  allowNegativeBalance: boolean;
  autoNetCustomerSupplier: boolean;
  defaultSettlementBehaviour: "auto_allocate" | "hold_unallocated" | "advance_payment";
}

export interface DocumentItem {
  id: string;
  documentNumber: string;
  type: "invoice" | "vendor_bill" | "credit_note" | "debit_note" | "payment" | "receipt";
  date: string;
  dueDate?: string;
  originalAmount: number;
  remainingAmount: number;
  status: "open" | "partially_settled" | "settled" | "void";
  currency: string;
}

export interface UnifiedContactStatement {
  contactId: string;
  contactName: string;
  contactType: "customer" | "supplier" | "partner" | "both";
  grossReceivable: number;
  grossPayable: number;
  netBalance: number; // positive = net receivable (customer owes us), negative = net payable (we owe vendor)
  netPositionLabel: "Net Receivable" | "Net Payable" | "Balanced";
  openDocuments: DocumentItem[];
  settlementHistory: SettlementAuditRecord[];
}

export interface SettlementAllocationEntry {
  documentId: string;
  documentNumber: string;
  allocatedAmount: number;
  previousBalance: number;
  newBalance: number;
}

export interface SettlementAuditRecord {
  id: string;
  date: string;
  user: string;
  contactId: string;
  contactName: string;
  policy: AllocationPolicy;
  totalSettledAmount: number;
  allocations: SettlementAllocationEntry[];
  journalEntryRef?: string;
  notes?: string;
}
