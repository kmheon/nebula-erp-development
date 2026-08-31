/**
 * Enterprise Settlement Engine Service.
 * Pure business logic for payment allocation, auto-netting customer/vendor positions,
 * and generating settlement audit records. No UI logic or API mutations.
 */

import type {
  AllocationPolicy,
  DocumentItem,
  SettlementAllocationEntry,
  SettlementAuditRecord,
  UnifiedContactStatement,
  SettlementSettings,
} from "../types/settlement.types";

export const DEFAULT_SETTLEMENT_SETTINGS: SettlementSettings = {
  defaultAllocationPolicy: "fifo",
  allowManualOverride: true,
  allowOverpayment: false,
  allowNegativeBalance: false,
  autoNetCustomerSupplier: true,
  defaultSettlementBehaviour: "auto_allocate",
};

/**
 * Calculates unified net position for a contact holding both receivables (invoices) and payables (vendor bills).
 */
export function calculateUnifiedStatement(
  contactId: string,
  contactName: string,
  contactType: "customer" | "supplier" | "partner" | "both",
  documents: DocumentItem[],
  settlementHistory: SettlementAuditRecord[]
): UnifiedContactStatement {
  let grossReceivable = 0;
  let grossPayable = 0;

  for (const doc of documents) {
    if (doc.status === "void") continue;
    if (doc.type === "invoice" || doc.type === "debit_note") {
      grossReceivable += doc.remainingAmount;
    } else if (doc.type === "vendor_bill" || doc.type === "credit_note") {
      grossPayable += doc.remainingAmount;
    }
  }

  const netBalance = grossReceivable - grossPayable;
  let netPositionLabel: "Net Receivable" | "Net Payable" | "Balanced" = "Balanced";
  if (netBalance > 0.01) {
    netPositionLabel = "Net Receivable";
  } else if (netBalance < -0.01) {
    netPositionLabel = "Net Payable";
  }

  return {
    contactId,
    contactName,
    contactType,
    grossReceivable,
    grossPayable,
    netBalance,
    netPositionLabel,
    openDocuments: documents.filter((d) => d.status !== "settled" && d.status !== "void"),
    settlementHistory,
  };
}

/**
 * Executes settlement allocation based on the selected policy.
 */
export function executeSettlementAllocation(
  paymentAmount: number,
  openDocuments: DocumentItem[],
  policy: AllocationPolicy,
  currentUser: string,
  contactId: string,
  contactName: string,
  manualAllocations?: Record<string, number>
): { remainingPayment: number; allocations: SettlementAllocationEntry[]; auditRecord: SettlementAuditRecord } {
  let remaining = paymentAmount;
  const allocations: SettlementAllocationEntry[] = [];
  const docs = [...openDocuments];

  // Sort docs according to policy
  if (policy === "fifo" || policy === "oldest_invoice") {
    docs.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  } else if (policy === "lifo" || policy === "newest_invoice") {
    docs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } else if (policy === "due_date") {
    docs.sort((a, b) => {
      const dateA = a.dueDate ? new Date(a.dueDate).getTime() : new Date(a.date).getTime();
      const dateB = b.dueDate ? new Date(b.dueDate).getTime() : new Date(b.date).getTime();
      return dateA - dateB;
    });
  } else if (policy === "largest_amount") {
    docs.sort((a, b) => b.remainingAmount - a.remainingAmount);
  } else if (policy === "smallest_amount") {
    docs.sort((a, b) => a.remainingAmount - b.remainingAmount);
  } else if (policy === "proportional") {
    const totalOpen = docs.reduce((sum, d) => sum + d.remainingAmount, 0);
    if (totalOpen > 0) {
      for (const doc of docs) {
        if (remaining <= 0) break;
        const proportion = doc.remainingAmount / totalOpen;
        const allocate = Math.min(doc.remainingAmount, Number((paymentAmount * proportion).toFixed(2)));
        if (allocate > 0) {
          const prev = doc.remainingAmount;
          const next = Number((prev - allocate).toFixed(2));
          allocations.push({
            documentId: doc.id,
            documentNumber: doc.documentNumber,
            allocatedAmount: allocate,
            previousBalance: prev,
            newBalance: next,
          });
          remaining = Number((remaining - allocate).toFixed(2));
        }
      }
    }
  } else if (policy === "manual" && manualAllocations) {
    for (const doc of docs) {
      if (remaining <= 0) break;
      const requested = manualAllocations[doc.id] || 0;
      const allocate = Math.min(doc.remainingAmount, requested, remaining);
      if (allocate > 0) {
        const prev = doc.remainingAmount;
        const next = Number((prev - allocate).toFixed(2));
        allocations.push({
          documentId: doc.id,
          documentNumber: doc.documentNumber,
          allocatedAmount: allocate,
          previousBalance: prev,
          newBalance: next,
        });
        remaining = Number((remaining - allocate).toFixed(2));
      }
    }
  }

  // Default automated iterative allocation (FIFO / LIFO / Due Date etc.)
  if (policy !== "proportional" && policy !== "manual") {
    for (const doc of docs) {
      if (remaining <= 0) break;
      const allocate = Math.min(doc.remainingAmount, remaining);
      if (allocate > 0) {
        const prev = doc.remainingAmount;
        const next = Number((prev - allocate).toFixed(2));
        allocations.push({
          documentId: doc.id,
          documentNumber: doc.documentNumber,
          allocatedAmount: allocate,
          previousBalance: prev,
          newBalance: next,
        });
        remaining = Number((remaining - allocate).toFixed(2));
      }
    }
  }

  const totalSettled = paymentAmount - remaining;

  const auditRecord: SettlementAuditRecord = {
    id: `STL-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    date: new Date().toISOString(),
    user: currentUser,
    contactId,
    contactName,
    policy,
    totalSettledAmount: totalSettled,
    allocations,
    journalEntryRef: `JE-STL-${Date.now()}`,
    notes: `Automated settlement allocation via ${policy.toUpperCase()} policy.`,
  };

  return {
    remainingPayment: remaining,
    allocations,
    auditRecord,
  };
}
