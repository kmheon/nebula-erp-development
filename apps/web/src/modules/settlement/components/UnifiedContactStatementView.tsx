/**
 * Unified Contact Statement & Net Settlement Component.
 * Displays combined receivables, payables, net position, and settlement engine execution.
 */

import { useState } from "react";
import type { UnifiedContactStatement, AllocationPolicy } from "../types/settlement.types";
import { executeSettlementAllocation } from "../services/settlement.service";

type Props = {
  statement: UnifiedContactStatement;
  onSettlementComplete?: (record: any) => void;
};

export default function UnifiedContactStatementView({ statement, onSettlementComplete }: Props) {
  const [selectedPolicy, setSelectedPolicy] = useState<AllocationPolicy>("fifo");
  const [settlementAmount, setSettlementAmount] = useState<string>("500");
  const [previewResult, setPreviewResult] = useState<any | null>(null);

  const handlePreview = () => {
    const amt = parseFloat(settlementAmount) || 0;
    const res = executeSettlementAllocation(
      amt,
      statement.openDocuments,
      selectedPolicy,
      "Current Administrator",
      statement.contactId,
      statement.contactName
    );
    setPreviewResult(res);
  };

  const handleConfirmSettlement = () => {
    if (!previewResult) return;
    if (onSettlementComplete) {
      onSettlementComplete(previewResult.auditRecord);
    }
    alert(`Settlement successfully executed! Audit Ref: ${previewResult.auditRecord.id}`);
    setPreviewResult(null);
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-[var(--nebula-border)] bg-[var(--nebula-surface)] p-6 shadow-sm">
          <span className="text-xs font-semibold uppercase text-[var(--nebula-text-secondary)]">Gross Receivable</span>
          <div className="mt-2 text-2xl font-bold font-mono text-blue-600 dark:text-blue-400">
            ${statement.grossReceivable.toLocaleString()}
          </div>
          <p className="mt-1 text-xs text-[var(--nebula-text-secondary)]">Open Invoices / Debit Notes</p>
        </div>

        <div className="rounded-xl border border-[var(--nebula-border)] bg-[var(--nebula-surface)] p-6 shadow-sm">
          <span className="text-xs font-semibold uppercase text-[var(--nebula-text-secondary)]">Gross Payable</span>
          <div className="mt-2 text-2xl font-bold font-mono text-purple-600 dark:text-purple-400">
            ${statement.grossPayable.toLocaleString()}
          </div>
          <p className="mt-1 text-xs text-[var(--nebula-text-secondary)]">Open Vendor Bills / Credit Notes</p>
        </div>

        <div className="rounded-xl border border-[var(--nebula-border)] bg-[var(--nebula-surface)] p-6 shadow-sm">
          <span className="text-xs font-semibold uppercase text-[var(--nebula-text-secondary)]">Net Position</span>
          <div className={`mt-2 text-2xl font-bold font-mono ${statement.netBalance >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"}`}>
            ${Math.abs(statement.netBalance).toLocaleString()}
          </div>
          <p className="mt-1 text-xs font-bold uppercase text-[var(--nebula-text-primary)]">{statement.netPositionLabel}</p>
        </div>

        <div className="rounded-xl border border-[var(--nebula-border)] bg-[var(--nebula-surface)] p-6 shadow-sm">
          <span className="text-xs font-semibold uppercase text-[var(--nebula-text-secondary)]">Contact Classification</span>
          <div className="mt-2 text-xl font-bold uppercase">{statement.contactType}</div>
          <p className="mt-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium">Auto-Netted Active</p>
        </div>
      </div>

      {/* Settlement Allocation Engine Simulator */}
      <div className="rounded-xl border border-[var(--nebula-border)] bg-[var(--nebula-surface)] p-6 shadow-sm space-y-4">
        <div>
          <h2 className="text-lg font-bold">Execute Settlement Allocation</h2>
          <p className="text-sm text-[var(--nebula-text-secondary)]">
            Apply incoming payments or credit notes across open documents using configurable allocation policies.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div>
            <label className="block text-xs font-semibold text-[var(--nebula-text-secondary)] uppercase mb-1">Allocation Policy</label>
            <select
              value={selectedPolicy}
              onChange={(e) => setSelectedPolicy(e.target.value as AllocationPolicy)}
              className="w-full rounded-lg border border-[var(--nebula-border)] bg-[var(--nebula-surface-muted)] px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[var(--nebula-primary)]"
            >
              <option value="fifo">FIFO (First In, First Out)</option>
              <option value="lifo">LIFO (Last In, First Out)</option>
              <option value="oldest_invoice">Oldest Invoice First</option>
              <option value="newest_invoice">Newest Invoice First</option>
              <option value="due_date">Due Date Priority</option>
              <option value="largest_amount">Largest Amount First</option>
              <option value="smallest_amount">Smallest Amount First</option>
              <option value="proportional">Proportional Allocation</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--nebula-text-secondary)] uppercase mb-1">Settlement Amount ($)</label>
            <input
              type="number"
              value={settlementAmount}
              onChange={(e) => setSettlementAmount(e.target.value)}
              className="w-full rounded-lg border border-[var(--nebula-border)] bg-[var(--nebula-surface-muted)] px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[var(--nebula-primary)]"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={handlePreview}
              className="w-full rounded-lg bg-[var(--nebula-primary)] px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:opacity-90 transition-opacity"
            >
              Preview Allocation
            </button>
          </div>
        </div>

        {/* Preview Results Modal / Panel */}
        {previewResult && (
          <div className="rounded-lg border border-[var(--nebula-border)] bg-[var(--nebula-surface-muted)] p-5 space-y-4 mt-4">
            <div className="flex justify-between items-center border-b border-[var(--nebula-border)] pb-3">
              <h4 className="font-bold text-sm">Allocation Preview ({selectedPolicy.toUpperCase()})</h4>
              <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                Settled: ${previewResult.auditRecord.totalSettledAmount.toLocaleString()} | Remaining: ${previewResult.remainingPayment}
              </span>
            </div>

            <div className="space-y-2">
              {previewResult.allocations.map((alloc: any, i: number) => (
                <div key={i} className="flex justify-between items-center text-xs rounded-lg border border-[var(--nebula-border)] bg-[var(--nebula-surface)] p-3">
                  <span className="font-mono font-bold">{alloc.documentNumber}</span>
                  <span className="text-[var(--nebula-text-secondary)]">Prev: ${alloc.previousBalance}</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">Allocated: -${alloc.allocatedAmount}</span>
                  <span className="font-mono font-bold">New: ${alloc.newBalance}</span>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setPreviewResult(null)}
                className="rounded-lg border border-[var(--nebula-border)] px-4 py-2 text-xs font-semibold hover:bg-[var(--nebula-surface)] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmSettlement}
                className="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-emerald-700 transition-colors"
              >
                Confirm & Post to Ledger
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Open Documents Table */}
      <div className="rounded-xl border border-[var(--nebula-border)] bg-[var(--nebula-surface)] p-6 shadow-sm space-y-4">
        <h2 className="text-lg font-bold">Open Documents ({statement.openDocuments.length})</h2>
        <div className="overflow-x-auto rounded-lg border border-[var(--nebula-border)]">
          <table className="w-full text-left text-sm">
            <thead className="bg-[var(--nebula-surface-muted)] text-xs font-semibold uppercase text-[var(--nebula-text-secondary)]">
              <tr>
                <th className="px-4 py-3">Document #</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Due Date</th>
                <th className="px-4 py-3 text-right">Original</th>
                <th className="px-4 py-3 text-right">Remaining Due</th>
                <th className="px-4 py-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--nebula-border)]">
              {statement.openDocuments.map((doc) => (
                <tr key={doc.id} className="hover:bg-[var(--nebula-surface-muted)]/50 transition-colors">
                  <td className="px-4 py-3 font-mono font-bold text-xs">{doc.documentNumber}</td>
                  <td className="px-4 py-3 uppercase text-xs font-bold text-[var(--nebula-text-secondary)]">{doc.type.replace("_", " ")}</td>
                  <td className="px-4 py-3 text-xs text-[var(--nebula-text-secondary)]">{doc.date}</td>
                  <td className="px-4 py-3 text-xs text-[var(--nebula-text-secondary)]">{doc.dueDate || "N/A"}</td>
                  <td className="px-4 py-3 text-right font-mono">${doc.originalAmount.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right font-mono font-bold">${doc.remainingAmount.toLocaleString()}</td>
                  <td className="px-4 py-3 text-center">
                    <span className="inline-flex rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-semibold text-amber-600 dark:text-amber-400">
                      {doc.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
