import React from "react";
import { CheckCircle2, XCircle, Clock } from "lucide-react";
import type { ApprovalRequest } from "../types/approval.types";

interface ApprovalHistoryViewProps {
  requests: ApprovalRequest[];
}

export const ApprovalHistoryView: React.FC<ApprovalHistoryViewProps> = ({ requests }) => {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-[var(--nebula-border)] bg-[var(--nebula-surface)] p-6 shadow-sm">
        <h2 className="text-xl font-bold text-[var(--nebula-text)]">Approval Audit History & Logs</h2>
        <p className="text-xs text-[var(--nebula-muted)] mt-1">
          Complete tamper-evident audit trail of every authorization event, reviewer comment, and state transition across the enterprise.
        </p>
      </div>

      <div className="rounded-2xl border border-[var(--nebula-border)] bg-[var(--nebula-surface)] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[var(--nebula-border)] bg-[var(--nebula-background)]/50 text-xs font-semibold text-[var(--nebula-muted)] uppercase tracking-wider">
                <th className="p-4">Document Number</th>
                <th className="p-4">Module</th>
                <th className="p-4">Requester</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Final Status</th>
                <th className="p-4">Audit Entries</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--nebula-border)] text-sm">
              {requests.map((req) => (
                <tr key={req.id} className="hover:bg-[var(--nebula-surface-hover)] transition-colors">
                  <td className="p-4 font-semibold text-[var(--nebula-text)]">{req.documentNumber}</td>
                  <td className="p-4 capitalize">
                    <span className="rounded-md bg-[var(--nebula-background)] px-2.5 py-1 text-xs font-medium border border-[var(--nebula-border)]">
                      {req.module}
                    </span>
                  </td>
                  <td className="p-4 text-[var(--nebula-text)]">{req.requestedByName}</td>
                  <td className="p-4 font-mono font-medium text-[var(--nebula-text)]">
                    ${req.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })} {req.currency}
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                      req.status === "approved" ? "bg-emerald-500/10 text-emerald-600" :
                      req.status === "rejected" ? "bg-rose-500/10 text-rose-600" :
                      "bg-amber-500/10 text-amber-600"
                    }`}>
                      {req.status === "approved" && <CheckCircle2 className="h-3.5 w-3.5" />}
                      {req.status === "rejected" && <XCircle className="h-3.5 w-3.5" />}
                      {req.status === "pending" && <Clock className="h-3.5 w-3.5" />}
                      <span className="capitalize">{req.status}</span>
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="text-xs font-semibold text-blue-600">
                      {req.history.length} audit events recorded
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
};
