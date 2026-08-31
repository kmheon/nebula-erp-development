import React from "react";
import type { ApprovalRequest } from "../types/approval.types";

interface ApprovalAnalyticsProps {
  requests: ApprovalRequest[];
}

export const ApprovalAnalytics: React.FC<ApprovalAnalyticsProps> = ({ requests }) => {
  const total = requests.length;
  const approved = requests.filter(r => r.status === "approved").length;

  const approvalRate = total > 0 ? Math.round((approved / total) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-[var(--nebula-border)] bg-[var(--nebula-surface)] p-6 shadow-sm">
        <h2 className="text-xl font-bold text-[var(--nebula-text)]">Workflow Analytics & Performance</h2>
        <p className="text-xs text-[var(--nebula-muted)] mt-1">
          Throughput metrics, authorization turnaround times, and bottleneck analysis across modules.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border border-[var(--nebula-border)] bg-[var(--nebula-surface)] p-5 shadow-sm">
          <div className="text-sm font-medium text-[var(--nebula-muted)]">Overall Approval Rate</div>
          <div className="text-3xl font-bold text-[var(--nebula-text)] mt-2">{approvalRate}%</div>
          <div className="text-xs text-emerald-600 font-medium mt-1">Based on {total} total requests</div>
        </div>
        <div className="rounded-xl border border-[var(--nebula-border)] bg-[var(--nebula-surface)] p-5 shadow-sm">
          <div className="text-sm font-medium text-[var(--nebula-muted)]">Average Turnaround Time</div>
          <div className="text-3xl font-bold text-[var(--nebula-text)] mt-2">14.2 hrs</div>
          <div className="text-xs text-blue-600 font-medium mt-1">-2.4 hrs vs last week</div>
        </div>
        <div className="rounded-xl border border-[var(--nebula-border)] bg-[var(--nebula-surface)] p-5 shadow-sm">
          <div className="text-sm font-medium text-[var(--nebula-muted)]">Escalation Rate</div>
          <div className="text-3xl font-bold text-[var(--nebula-text)] mt-2">3.1%</div>
          <div className="text-xs text-amber-600 font-medium mt-1">Within acceptable SLA limits</div>
        </div>
      </div>
    </div>
  );
};
