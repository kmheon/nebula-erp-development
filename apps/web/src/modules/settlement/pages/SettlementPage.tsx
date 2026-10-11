/**
 * Settlement & Unified Contact Ledger Page.
 * Enterprise Settlement Engine dashboard for Nebula ERP.
 */

import { useState } from "react";
import { FileText, History, Settings, Scale, ArrowDownLeft, ArrowUpRight } from "lucide-react";
import UnifiedContactStatementView from "../components/UnifiedContactStatementView";
import SettlementSettingsView from "../components/SettlementSettingsView";
import {
  AppPageHeader,
  AppStatCard,
  AppTabs,
} from "../../../components/ui";
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
  const [activeTab, setActiveTab] = useState<string>("statement");
  const [statement, setStatement] = useState<UnifiedContactStatement>(MOCK_INITIAL_STATEMENT);

  const handleSettlementComplete = (record: SettlementAuditRecord) => {
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
    <div className="space-y-8">
      <AppPageHeader
        title="Enterprise Settlement Engine & Unified Ledger"
        subtitle="Shared cross-module settlement service for Sales, Purchase, POS, and Accounting with automated FIFO/LIFO/Due-Date netting."
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <AppStatCard
          label="Gross Open Receivables"
          value={`$${statement.grossReceivable.toLocaleString("en-US", { minimumFractionDigits: 2 })}`}
          subtext="Unsettled customer invoices"
          icon={<ArrowDownLeft size={20} />}
          tone="success"
        />
        <AppStatCard
          label="Gross Open Payables"
          value={`$${statement.grossPayable.toLocaleString("en-US", { minimumFractionDigits: 2 })}`}
          subtext="Unsettled supplier bills"
          icon={<ArrowUpRight size={20} />}
          tone="warning"
        />
        <AppStatCard
          label="Net Ledger Position"
          value={`$${Math.abs(statement.netBalance).toLocaleString("en-US", { minimumFractionDigits: 2 })}`}
          subtext={statement.netPositionLabel}
          icon={<Scale size={20} />}
          tone={statement.netBalance >= 0 ? "primary" : "danger"}
        />
      </div>

      {/* Workspace Tabs */}
      <AppTabs
        tabs={[
          { id: "statement", name: "Unified Statement", icon: <FileText size={16} /> },
          { id: "history", name: "Audit Trail & History", icon: <History size={16} /> },
          { id: "settings", name: "Settlement Policies", icon: <Settings size={16} /> },
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
        variant="pill"
      />

      {activeTab === "statement" && (
        <UnifiedContactStatementView statement={statement} onSettlementComplete={handleSettlementComplete} />
      )}

      {activeTab === "history" && (
        <div className="rounded-[var(--nebula-radius-lg)] border border-[var(--nebula-border)] bg-[var(--nebula-surface)] p-6 space-y-4">
          <h2 className="text-base font-semibold text-[var(--nebula-text-primary)]">Settlement Audit Trail & History</h2>
          <div className="overflow-x-auto rounded-[var(--nebula-radius-md)] border border-[var(--nebula-border)]">
            <table className="w-full text-left text-sm">
              <thead className="bg-[var(--nebula-surface-muted)] text-xs font-semibold uppercase text-[var(--nebula-text-secondary)]">
                <tr>
                  <th className="px-4 py-3">Settlement ID</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">User</th>
                  <th className="px-4 py-3">Policy</th>
                  <th className="px-4 py-3 text-right">Settled Amount</th>
                  <th className="px-4 py-3">Journal Ref</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--nebula-border)]">
                {statement.settlementHistory.map((item) => (
                  <tr key={item.id} className="hover:bg-[var(--nebula-surface-hover)] transition-colors">
                    <td className="px-4 py-3 font-mono font-medium text-xs text-[var(--nebula-text-primary)]">{item.id}</td>
                    <td className="px-4 py-3 text-xs text-[var(--nebula-text-secondary)]">{new Date(item.date).toLocaleString()}</td>
                    <td className="px-4 py-3 text-xs font-medium text-[var(--nebula-text-primary)]">{item.user}</td>
                    <td className="px-4 py-3 uppercase font-semibold text-xs text-[var(--nebula-primary)]">{item.policy}</td>
                    <td className="px-4 py-3 text-right font-mono font-medium text-[var(--nebula-success)]">${item.totalSettledAmount.toLocaleString()}</td>
                    <td className="px-4 py-3 font-mono text-xs text-[var(--nebula-text-secondary)]">{item.journalEntryRef || "N/A"}</td>
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
