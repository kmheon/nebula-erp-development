import React from "react";
import { 
  CheckCircle2, 
  Clock, 
  XCircle, 
  ShieldCheck, 
  Workflow, 
  GitBranch, 
  ArrowUpRight
} from "lucide-react";
import type { ApprovalRequest, ApprovalWorkflowTemplate } from "../types/approval.types";

interface ApprovalDashboardProps {
  requests: ApprovalRequest[];
  templates: ApprovalWorkflowTemplate[];
  onNavigateTab: (tab: string) => void;
}

export const ApprovalDashboard: React.FC<ApprovalDashboardProps> = ({
  requests,
  templates,
  onNavigateTab,
}) => {
  const pendingCount = requests.filter(r => r.status === "pending").length;
  const approvedCount = requests.filter(r => r.status === "approved").length;
  const totalVolume = requests.reduce((sum, r) => sum + r.amount, 0);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-2xl border border-[var(--nebula-border)] bg-[var(--nebula-surface)] p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold text-emerald-600">
                Enterprise Engine Active
              </span>
              <span className="text-xs text-[var(--nebula-muted)]">NEB-011 Multi-Tier Governance</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-[var(--nebula-text)] mt-1">
              Multi-Tier Approval Control Center
            </h2>
            <p className="text-sm text-[var(--nebula-muted)] mt-1">
              Unified cross-module governance engine powering purchase orders, expenses, accounting, and operational workflows.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigateTab("inbox")}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors"
            >
              <Clock className="h-4 w-4" />
              Approval Inbox ({pendingCount})
            </button>
            <button
              onClick={() => onNavigateTab("builder")}
              className="inline-flex items-center gap-2 rounded-xl border border-[var(--nebula-border)] bg-[var(--nebula-background)] px-4 py-2.5 text-sm font-semibold text-[var(--nebula-text)] hover:bg-[var(--nebula-surface-hover)] transition-colors"
            >
              <Workflow className="h-4 w-4" />
              Workflow Designer
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-[var(--nebula-border)] bg-[var(--nebula-surface)] p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-[var(--nebula-muted)]">Pending Approvals</span>
            <div className="rounded-lg bg-amber-500/10 p-2 text-amber-600">
              <Clock className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-[var(--nebula-text)]">{pendingCount}</span>
            <span className="text-xs font-medium text-amber-600">Requires review</span>
          </div>
        </div>

        <div className="rounded-xl border border-[var(--nebula-border)] bg-[var(--nebula-surface)] p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-[var(--nebula-muted)]">Approved Documents</span>
            <div className="rounded-lg bg-emerald-500/10 p-2 text-emerald-600">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-[var(--nebula-text)]">{approvedCount}</span>
            <span className="text-xs font-medium text-emerald-600">Fully authorized</span>
          </div>
        </div>

        <div className="rounded-xl border border-[var(--nebula-border)] bg-[var(--nebula-surface)] p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-[var(--nebula-muted)]">Active Workflows</span>
            <div className="rounded-lg bg-blue-500/10 p-2 text-blue-600">
              <GitBranch className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-[var(--nebula-text)]">{templates.length}</span>
            <span className="text-xs font-medium text-blue-600">Templates deployed</span>
          </div>
        </div>

        <div className="rounded-xl border border-[var(--nebula-border)] bg-[var(--nebula-surface)] p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-[var(--nebula-muted)]">Total Exposure Volume</span>
            <div className="rounded-lg bg-indigo-500/10 p-2 text-indigo-600">
              <ShieldCheck className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-[var(--nebula-text)]">
              ${totalVolume.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
            <span className="text-xs font-medium text-indigo-600">Tracked value</span>
          </div>
        </div>
      </div>

      {/* Recent Requests Table */}
      <div className="rounded-2xl border border-[var(--nebula-border)] bg-[var(--nebula-surface)] shadow-sm overflow-hidden">
        <div className="p-5 border-b border-[var(--nebula-border)] flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-[var(--nebula-text)]">Active Approval Requests</h3>
            <p className="text-xs text-[var(--nebula-muted)]">Real-time status tracking across enterprise modules</p>
          </div>
          <button
            onClick={() => onNavigateTab("inbox")}
            className="text-sm font-semibold text-blue-600 hover:text-blue-500 flex items-center gap-1"
          >
            View All Inbox <ArrowUpRight className="h-4 w-4" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[var(--nebula-border)] bg-[var(--nebula-background)]/50 text-xs font-semibold text-[var(--nebula-muted)] uppercase tracking-wider">
                <th className="p-4">Document</th>
                <th className="p-4">Module</th>
                <th className="p-4">Requester</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Progress</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--nebula-border)] text-sm">
              {requests.slice(0, 5).map((req) => (
                <tr key={req.id} className="hover:bg-[var(--nebula-surface-hover)] transition-colors">
                  <td className="p-4">
                    <div className="font-semibold text-[var(--nebula-text)]">{req.documentNumber}</div>
                    <div className="text-xs text-[var(--nebula-muted)] line-clamp-1">{req.documentTitle}</div>
                  </td>
                  <td className="p-4">
                    <span className="inline-flex items-center rounded-md bg-[var(--nebula-background)] px-2.5 py-1 text-xs font-medium text-[var(--nebula-text)] border border-[var(--nebula-border)] capitalize">
                      {req.module}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="text-[var(--nebula-text)]">{req.requestedByName}</div>
                  </td>
                  <td className="p-4 font-mono font-medium text-[var(--nebula-text)]">
                    ${req.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })} {req.currency}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${(req.currentLevel / req.totalLevels) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium text-[var(--nebula-muted)]">
                        L{req.currentLevel}/{req.totalLevels}
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                      req.status === "approved" 
                        ? "bg-emerald-500/10 text-emerald-600"
                        : req.status === "rejected"
                        ? "bg-rose-500/10 text-rose-600"
                        : "bg-amber-500/10 text-amber-600"
                    }`}>
                      {req.status === "approved" && <CheckCircle2 className="h-3.5 w-3.5" />}
                      {req.status === "rejected" && <XCircle className="h-3.5 w-3.5" />}
                      {req.status === "pending" && <Clock className="h-3.5 w-3.5" />}
                      <span className="capitalize">{req.status.replace("_", " ")}</span>
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
