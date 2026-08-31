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
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm space-y-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Gross Receivable</span>
          <div className="text-2xl font-black text-blue-600">${statement.grossReceivable.toLocaleString()}</div>
          <span className="text-xs text-slate-500">Open Invoices / Debit Notes</span>
        </div>

        <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm space-y-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Gross Payable</span>
          <div className="text-2xl font-black text-purple-600">${statement.grossPayable.toLocaleString()}</div>
          <span className="text-xs text-slate-500">Open Vendor Bills / Credit Notes</span>
        </div>

        <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm space-y-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Net Position</span>
          <div className={`text-2xl font-black ${statement.netBalance >= 0 ? "text-emerald-600" : "text-amber-600"}`}>
            ${Math.abs(statement.netBalance).toLocaleString()}
          </div>
          <span className="text-xs font-bold uppercase text-slate-700">{statement.netPositionLabel}</span>
        </div>

        <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm space-y-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Contact Classification</span>
          <div className="text-xl font-bold text-slate-900 uppercase pt-1">{statement.contactType}</div>
          <span className="text-xs text-emerald-600 font-medium">Auto-Netted Active</span>
        </div>
      </div>

      {/* Settlement Allocation Engine Simulator */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900">Execute Settlement Allocation</h3>
        <p className="text-xs text-slate-500">
          Apply incoming payments or credit notes across open documents using configurable allocation policies.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Allocation Policy</label>
            <select
              value={selectedPolicy}
              onChange={(e) => setSelectedPolicy(e.target.value as AllocationPolicy)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary/20"
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
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Settlement Amount ($)</label>
            <input
              type="number"
              value={settlementAmount}
              onChange={(e) => setSettlementAmount(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={handlePreview}
              className="w-full py-2.5 bg-primary text-primary-foreground rounded-xl text-xs font-bold uppercase hover:bg-primary/90 transition-all shadow-sm"
            >
              Preview Allocation
            </button>
          </div>
        </div>

        {/* Preview Results Modal / Panel */}
        {previewResult && (
          <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl space-y-4 mt-4">
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <h4 className="font-bold text-sm text-slate-900">Allocation Preview ({selectedPolicy.toUpperCase()})</h4>
              <span className="text-xs font-mono font-bold text-emerald-600">
                Settled: ${previewResult.auditRecord.totalSettledAmount.toLocaleString()} | Remaining: ${previewResult.remainingPayment}
              </span>
            </div>

            <div className="space-y-2">
              {previewResult.allocations.map((alloc: any, i: number) => (
                <div key={i} className="flex justify-between items-center text-xs bg-white p-3 border border-slate-200 rounded-lg">
                  <span className="font-mono font-bold text-slate-800">{alloc.documentNumber}</span>
                  <span className="text-slate-500">Prev: ${alloc.previousBalance}</span>
                  <span className="font-bold text-emerald-700">Allocated: -${alloc.allocatedAmount}</span>
                  <span className="font-mono font-bold text-slate-900">New: ${alloc.newBalance}</span>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setPreviewResult(null)}
                className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-bold uppercase text-slate-700 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmSettlement}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-bold uppercase hover:bg-emerald-700 shadow-sm"
              >
                Confirm & Post to Ledger
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Open Documents Table */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900">Open Documents ({statement.openDocuments.length})</h3>
        <div className="overflow-x-auto border border-slate-200 rounded-xl">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-xs font-semibold text-slate-500 uppercase text-left">
                <th className="p-4">Document #</th>
                <th className="p-4">Type</th>
                <th className="p-4">Date</th>
                <th className="p-4">Due Date</th>
                <th className="p-4 text-right">Original</th>
                <th className="p-4 text-right">Remaining Due</th>
                <th className="p-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {statement.openDocuments.map((doc) => (
                <tr key={doc.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="p-4 font-mono font-bold text-xs text-slate-900">{doc.documentNumber}</td>
                  <td className="p-4 uppercase text-xs font-bold text-slate-700">{doc.type.replace("_", " ")}</td>
                  <td className="p-4 text-xs text-slate-500">{doc.date}</td>
                  <td className="p-4 text-xs text-slate-500">{doc.dueDate || "N/A"}</td>
                  <td className="p-4 text-right font-mono">${doc.originalAmount.toLocaleString()}</td>
                  <td className="p-4 text-right font-mono font-bold text-slate-900">${doc.remainingAmount.toLocaleString()}</td>
                  <td className="p-4 text-center">
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold uppercase border bg-amber-50 text-amber-700 border-amber-200">
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
