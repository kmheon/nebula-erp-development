/**
 * Settlement & Unified Contact Ledger Page.
 * Enterprise Settlement Engine dashboard for Nebula ERP.
 */

import { useState } from "react";
import UnifiedContactStatementView from "../components/UnifiedContactStatementView";
import SettlementSettingsView from "../components/SettlementSettingsView";
import type { UnifiedContactStatement, SettlementAuditRecord } from "../types/settlement.types";

const MOCK_INITIAL_STATEMENT: UnifiedContactStatement = {
  contactId: "CNT-1001",
  contactName: "Acme Global Industries & Logistics",
  contactType: "both",
  grossReceivable: 45200.0,
  grossPayable: 18500.0,
  netBalance: 26700.0,
  netPositionLabel: "Net Receivable",
  openDocuments: [
    { id: "INV-2026-001", documentNumber: "INV-2026-001", type: "invoice", date: "2026-08-01", dueDate: "2026-08-31", originalAmount: 25000, remainingAmount: 15000, status: "partially_settled", currency: "USD" },
    { id: "INV-2026-014", documentNumber: "INV-2026-014", type: "invoice", date: "2026-08-15", dueDate: "2026-09-15", originalAmount: 30200, remainingAmount: 30200, status: "open", currency: "USD" },
    { id: "BILL-2026-008", documentNumber: "BILL-2026-008", type: "vendor_bill", date: "2026-08-10", dueDate: "2026-09-10", originalAmount: 18500, remainingAmount: 18500, status: "open", currency: "USD" }
  ],
  settlementHistory: [
    {
      id: "STL-1004",
      date: "2026-08-20T10:30:00Z",
      user: "Chief Financial Officer",
      contactId: "CNT-1001",
      contactName: "Acme Global Industries & Logistics",
      policy: "fifo",
      totalSettledAmount: 10000,
      allocations: [
        { documentId: "INV-2026-001", documentNumber: "INV-2026-001", allocatedAmount: 10000, previousBalance: 25000, newBalance: 15000 }
      ],
      journalEntryRef: "JE-STL-9942",
      notes: "Automated FIFO settlement from wire transfer receipt."
    }
  ]
};

export default function SettlementPage() {
  const [activeTab, setActiveTab] = useState<"statement" | "history" | "settings">("statement");
  const [statement, setStatement] = useState<UnifiedContactStatement>(MOCK_INITIAL_STATEMENT);

  const handleSettlementComplete = (record: SettlementAuditRecord) => {
    // Update open documents and history
    const updatedHistory = [record, ...statement.settlementHistory];
    const updatedDocs = statement.openDocuments.map(doc => {
      const match = record.allocations.find(a => a.documentId === doc.id);
      if (match) {
        return {
          ...doc,
          remainingAmount: match.newBalance,
          status: match.newBalance === 0 ? "settled" as const : "partially_settled" as const
        };
      }
      return doc;
    }).filter(d => d.status !== "settled");

    const newGrossRec = updatedDocs.filter(d => d.type === "invoice").reduce((s, d) => s + d.remainingAmount, 0);
    const newGrossPay = updatedDocs.filter(d => d.type === "vendor_bill").reduce((s, d) => s + d.remainingAmount, 0);
    const newNet = newGrossRec - newGrossPay;

    setStatement({
      ...statement,
      grossReceivable: newGrossRec,
      grossPayable: newGrossPay,
      netBalance: newNet,
      netPositionLabel: newNet > 0 ? "Net Receivable" : newNet < 0 ? "Net Payable" : "Balanced",
      openDocuments: updatedDocs,
      settlementHistory: updatedHistory
    });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6 bg-slate-50/50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
              Enterprise Settlement Engine & Unified Ledger
            </h1>
            <span className="text-xs font-mono px-3 py-1 bg-primary/10 text-primary rounded-full font-bold uppercase">
              NEB-007
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Shared settlement service for Sales, Purchase, POS, and Accounting with automated FIFO/LIFO/Due-Date allocation and netting.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200">
          {[
            { id: "statement", label: "Unified Statement" },
            { id: "history", label: "Audit History" },
            { id: "settings", label: "Policy Settings" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all ${
                activeTab === tab.id
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === "statement" && (
        <UnifiedContactStatementView statement={statement} onSettlementComplete={handleSettlementComplete} />
      )}

      {activeTab === "history" && (
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900">Settlement Audit Trail & History</h3>
          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 text-xs font-semibold text-slate-500 uppercase text-left">
                  <th className="p-4">Settlement ID</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">User</th>
                  <th className="p-4">Policy</th>
                  <th className="p-4 text-right">Settled Amount</th>
                  <th className="p-4">Journal Ref</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {statement.settlementHistory.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="p-4 font-mono font-bold text-xs text-slate-900">{item.id}</td>
                    <td className="p-4 text-xs text-slate-500">{new Date(item.date).toLocaleString()}</td>
                    <td className="p-4 text-xs font-semibold text-slate-800">{item.user}</td>
                    <td className="p-4 uppercase font-bold text-xs text-primary">{item.policy}</td>
                    <td className="p-4 text-right font-mono font-bold text-emerald-600">${item.totalSettledAmount.toLocaleString()}</td>
                    <td className="p-4 font-mono text-xs text-slate-600">{item.journalEntryRef || "N/A"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "settings" && <SettlementSettingsView />}
    </div>
  );
}
