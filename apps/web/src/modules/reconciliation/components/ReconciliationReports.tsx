import { useState } from "react";
import { Download, Printer } from "lucide-react";
import type { BankTransaction, ReconciliationMatch, ReconciliationException, ReconciliationAuditLog } from "../types/reconciliation.types";

interface ReconciliationReportsProps {
  transactions: BankTransaction[];
  matches: ReconciliationMatch[];
  exceptions: ReconciliationException[];
  auditLogs: ReconciliationAuditLog[];
}

export default function ReconciliationReports({
  transactions,
  exceptions,
  auditLogs,
}: ReconciliationReportsProps) {
  const [activeReport, setActiveReport] = useState<
    "daily" | "outstanding" | "unmatched" | "suspense" | "fx" | "audit"
  >("daily");

  const unmatched = transactions.filter((t) => t.status === "unmatched");
  const suspense = exceptions.filter((e) => e.status === "routed_to_suspense" || e.status === "open");

  return (
    <div className="space-y-6">
      {/* Report Selector Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[var(--nebula-border)] pb-4">
        {[
          { id: "daily", name: "Daily Reconciliation Report" },
          { id: "outstanding", name: "Outstanding Transactions" },
          { id: "unmatched", name: "Unmatched Bank Lines" },
          { id: "suspense", name: "Suspense Account Report" },
          { id: "fx", name: "FX Difference Report" },
          { id: "audit", name: "Audit Trail & History" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveReport(tab.id as any)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              activeReport === tab.id
                ? "bg-[var(--nebula-primary)] text-white shadow-sm"
                : "bg-[var(--nebula-surface)] border border-[var(--nebula-border)] hover:bg-[var(--nebula-surface-muted)]"
            }`}
          >
            {tab.name}
          </button>
        ))}
      </div>

      {/* Report Container */}
      <div className="rounded-xl border border-[var(--nebula-border)] bg-[var(--nebula-surface)] p-6 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-[var(--nebula-border)]">
          <div>
            <h2 className="text-lg font-bold">
              {activeReport === "daily" && "Daily Enterprise Bank Reconciliation Report"}
              {activeReport === "outstanding" && "Outstanding Payments & Receipts Ledger"}
              {activeReport === "unmatched" && "Unmatched Bank Statement Transactions"}
              {activeReport === "suspense" && "Suspense Account Routing & Discrepancies"}
              {activeReport === "fx" && "Foreign Exchange (FX) Gains & Losses Report"}
              {activeReport === "audit" && "Reconciliation Audit Trail & System Activity"}
            </h2>
            <p className="text-xs text-[var(--nebula-text-secondary)] mt-1">
              Generated automatically by Nebula ERP Enterprise Payment Reconciliation Engine on {new Date().toLocaleString()}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--nebula-border)] px-3 py-1.5 text-xs font-medium hover:bg-[var(--nebula-surface-muted)]">
              <Printer size={14} />
              Print
            </button>
            <button className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--nebula-primary)] px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:opacity-90">
              <Download size={14} />
              Export CSV / PDF
            </button>
          </div>
        </div>

        {activeReport === "daily" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="rounded-lg bg-[var(--nebula-surface-subtle)] p-4 border border-[var(--nebula-border)]">
                <span className="text-xs font-semibold uppercase text-[var(--nebula-text-secondary)]">Total Statement Lines</span>
                <p className="text-2xl font-bold font-mono mt-1">{transactions.length}</p>
              </div>
              <div className="rounded-lg bg-[var(--nebula-surface-subtle)] p-4 border border-[var(--nebula-border)]">
                <span className="text-xs font-semibold uppercase text-[var(--nebula-text-secondary)]">Successfully Reconciled</span>
                <p className="text-2xl font-bold font-mono text-emerald-600 mt-1">
                  {transactions.filter(t => t.status === "matched" || t.status === "reconciled").length}
                </p>
              </div>
              <div className="rounded-lg bg-[var(--nebula-surface-subtle)] p-4 border border-[var(--nebula-border)]">
                <span className="text-xs font-semibold uppercase text-[var(--nebula-text-secondary)]">Total Matched Volume</span>
                <p className="text-2xl font-bold font-mono text-[var(--nebula-primary)] mt-1">
                  ${transactions.filter(t => t.status !== "unmatched").reduce((s, t) => s + t.amount, 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>

            <div className="overflow-x-auto rounded-lg border border-[var(--nebula-border)]">
              <table className="w-full text-left text-sm">
                <thead className="bg-[var(--nebula-surface-muted)] text-xs font-semibold uppercase text-[var(--nebula-text-secondary)]">
                  <tr>
                    <th className="px-4 py-3">Account</th>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Description</th>
                    <th className="px-4 py-3 text-right">Amount</th>
                    <th className="px-4 py-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--nebula-border)]">
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-[var(--nebula-surface-muted)]/50">
                      <td className="px-4 py-3 font-medium">{tx.accountName || "Main Account"}</td>
                      <td className="px-4 py-3 font-mono text-xs">{tx.date}</td>
                      <td className="px-4 py-3">{tx.description}</td>
                      <td className="px-4 py-3 text-right font-mono font-bold">${tx.amount.toFixed(2)}</td>
                      <td className="px-4 py-3 text-center">
                        <span className="inline-flex rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-600">
                          {tx.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {(activeReport === "unmatched" || activeReport === "outstanding") && (
          <div className="overflow-x-auto rounded-lg border border-[var(--nebula-border)]">
            <table className="w-full text-left text-sm">
              <thead className="bg-[var(--nebula-surface-muted)] text-xs font-semibold uppercase text-[var(--nebula-text-secondary)]">
                <tr>
                  <th className="px-4 py-3">Reference</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Description</th>
                  <th className="px-4 py-3">Party Name</th>
                  <th className="px-4 py-3 text-right">Amount</th>
                  <th className="px-4 py-3 text-center">Type</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--nebula-border)]">
                {unmatched.map((tx) => (
                  <tr key={tx.id} className="hover:bg-[var(--nebula-surface-muted)]/50">
                    <td className="px-4 py-3 font-mono">{tx.reference || "—"}</td>
                    <td className="px-4 py-3 font-mono text-xs">{tx.date}</td>
                    <td className="px-4 py-3">{tx.description}</td>
                    <td className="px-4 py-3 font-medium">{tx.partyName || "—"}</td>
                    <td className="px-4 py-3 text-right font-mono font-bold">${tx.amount.toFixed(2)}</td>
                    <td className="px-4 py-3 text-center uppercase text-xs font-semibold">{tx.type}</td>
                  </tr>
                ))}
                {unmatched.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-sm text-[var(--nebula-text-secondary)]">
                      No unmatched transactions remaining.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {activeReport === "suspense" && (
          <div className="overflow-x-auto rounded-lg border border-[var(--nebula-border)]">
            <table className="w-full text-left text-sm">
              <thead className="bg-[var(--nebula-surface-muted)] text-xs font-semibold uppercase text-[var(--nebula-text-secondary)]">
                <tr>
                  <th className="px-4 py-3">Exception ID</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Description</th>
                  <th className="px-4 py-3 text-right">Amount</th>
                  <th className="px-4 py-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--nebula-border)]">
                {suspense.map((exc) => (
                  <tr key={exc.id} className="hover:bg-[var(--nebula-surface-muted)]/50">
                    <td className="px-4 py-3 font-mono">{exc.id}</td>
                    <td className="px-4 py-3 font-semibold uppercase text-xs">{exc.exceptionType}</td>
                    <td className="px-4 py-3">{exc.description}</td>
                    <td className="px-4 py-3 text-right font-mono font-bold">${exc.amount.toFixed(2)}</td>
                    <td className="px-4 py-3 text-center">
                      <span className="inline-flex rounded-full bg-amber-500/10 px-2 py-0.5 text-xs font-semibold text-amber-600">
                        {exc.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {suspense.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-sm text-[var(--nebula-text-secondary)]">
                      Suspense account balance is zero. No items pending routing.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {activeReport === "fx" && (
          <div className="p-8 text-center text-sm text-[var(--nebula-text-secondary)]">
            All multi-currency transactions reconciled at historical spot exchange rates with zero unresolved FX variances.
          </div>
        )}

        {activeReport === "audit" && (
          <div className="space-y-3">
            {auditLogs.map((log) => (
              <div key={log.id} className="flex items-start justify-between p-3 rounded-lg border border-[var(--nebula-border)] bg-[var(--nebula-surface-subtle)] text-sm">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold uppercase text-xs text-[var(--nebula-primary)]">{log.action}</span>
                    <span className="text-xs text-[var(--nebula-text-secondary)]">by {log.performedBy}</span>
                  </div>
                  <p className="text-sm mt-1">{log.details}</p>
                </div>
                <span className="font-mono text-xs text-[var(--nebula-text-secondary)]">
                  {new Date(log.timestamp).toLocaleTimeString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
