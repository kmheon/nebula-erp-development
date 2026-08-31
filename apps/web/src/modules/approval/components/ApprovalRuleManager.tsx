import React from "react";
import { Plus, CheckCircle2 } from "lucide-react";
import type { ApprovalRule } from "../types/approval.types";

interface ApprovalRuleManagerProps {
  rules: ApprovalRule[];
}

export const ApprovalRuleManager: React.FC<ApprovalRuleManagerProps> = ({ rules }) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 rounded-2xl border border-[var(--nebula-border)] bg-[var(--nebula-surface)] p-6 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-[var(--nebula-text)]">Approval Routing & Decision Rules</h2>
          <p className="text-xs text-[var(--nebula-muted)] mt-1">
            Configure dynamic rules based on amount, currency, department, risk score, and vendor criteria.
          </p>
        </div>
        <button
          onClick={() => alert("Rule builder modal available in enterprise tier.")}
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors"
        >
          <Plus className="h-4 w-4" /> Add Rule
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {rules.map((rule) => (
          <div key={rule.id} className="rounded-2xl border border-[var(--nebula-border)] bg-[var(--nebula-surface)] p-6 shadow-sm flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-purple-500/10 px-2.5 py-0.5 text-xs font-semibold text-purple-600 uppercase">
                  {rule.module}
                </span>
                <span className="text-xs text-[var(--nebula-muted)]">Priority: {rule.priority}</span>
              </div>
              <h3 className="text-base font-bold text-[var(--nebula-text)]">{rule.name}</h3>
              <p className="text-xs text-[var(--nebula-muted)]">{rule.description}</p>
              <div className="flex items-center gap-2 pt-2">
                {rule.conditions.map((cond, idx) => (
                  <span key={idx} className="rounded-lg bg-[var(--nebula-background)] px-2.5 py-1 text-xs font-mono border border-[var(--nebula-border)] text-[var(--nebula-text)]">
                    {cond.field} {cond.operator} {cond.value}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600">
                <CheckCircle2 className="h-3.5 w-3.5" /> Active
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
