import { CheckCircle2, AlertCircle, Clock, ShieldCheck, FileText, ArrowRightLeft } from "lucide-react";
import type { BankTransaction, ReconciliationMatch, ReconciliationException } from "../types/reconciliation.types";

interface ReconciliationDashboardProps {
  transactions: BankTransaction[];
  matches: ReconciliationMatch[];
  exceptions: ReconciliationException[];
  onNavigateTab: (tab: string) => void;
}

export default function ReconciliationDashboard({
  transactions,
  matches,
  exceptions,
  onNavigateTab,
}: ReconciliationDashboardProps) {
  const totalCount = transactions.length;
  const matchedCount = transactions.filter((t) => t.status === "matched" || t.status === "reconciled").length;
  const unmatchedCount = transactions.filter((t) => t.status === "unmatched").length;
  const exceptionCount = exceptions.filter((e) => e.status === "open").length;

  const matchRate = totalCount > 0 ? Math.round((matchedCount / totalCount) * 100) : 100;

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-[var(--nebula-border)] bg-[var(--nebula-surface)] p-6 shadow-sm">
          <div className="flex items-center justify-between text-[var(--nebula-text-secondary)]">
            <span className="text-xs font-semibold uppercase">Reconciliation Match Rate</span>
            <CheckCircle2 size={20} className="text-emerald-600" />
          </div>
          <div className="mt-2 text-3xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
            {matchRate}%
          </div>
          <p className="mt-1 text-xs text-[var(--nebula-text-secondary)]">
            {matchedCount} of {totalCount} lines successfully matched
          </p>
        </div>

        <div className="rounded-xl border border-[var(--nebula-border)] bg-[var(--nebula-surface)] p-6 shadow-sm">
          <div className="flex items-center justify-between text-[var(--nebula-text-secondary)]">
            <span className="text-xs font-semibold uppercase">Unmatched Bank Lines</span>
            <Clock size={20} className="text-amber-600" />
          </div>
          <div className="mt-2 text-3xl font-bold font-mono text-amber-600 dark:text-amber-400">
            {unmatchedCount}
          </div>
          <p className="mt-1 text-xs text-[var(--nebula-text-secondary)]">
            Pending matching workspace review
          </p>
        </div>

        <div className="rounded-xl border border-[var(--nebula-border)] bg-[var(--nebula-surface)] p-6 shadow-sm">
          <div className="flex items-center justify-between text-[var(--nebula-text-secondary)]">
            <span className="text-xs font-semibold uppercase">Open Exceptions</span>
            <AlertCircle size={20} className="text-rose-600" />
          </div>
          <div className="mt-2 text-3xl font-bold font-mono text-rose-600 dark:text-rose-400">
            {exceptionCount}
          </div>
          <p className="mt-1 text-xs text-[var(--nebula-text-secondary)]">
            Requires supervisor exception sign-off
          </p>
        </div>

        <div className="rounded-xl border border-[var(--nebula-border)] bg-[var(--nebula-surface)] p-6 shadow-sm">
          <div className="flex items-center justify-between text-[var(--nebula-text-secondary)]">
            <span className="text-xs font-semibold uppercase">Active Matches</span>
            <ShieldCheck size={20} className="text-[var(--nebula-primary)]" />
          </div>
          <div className="mt-2 text-3xl font-bold font-mono">
            {matches.length}
          </div>
          <p className="mt-1 text-xs text-[var(--nebula-text-secondary)]">
            Linked to general ledger & settlement
          </p>
        </div>
      </div>

      {/* Quick Action Panels */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-xl border border-[var(--nebula-border)] bg-[var(--nebula-surface)] p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="rounded-lg bg-[var(--nebula-primary)]/10 p-2 text-[var(--nebula-primary)]">
                <ArrowRightLeft size={24} />
              </div>
              <h2 className="text-lg font-bold">Matching Workspace</h2>
            </div>
            <p className="text-sm text-[var(--nebula-text-secondary)] mb-6">
              Review unmatched statement transactions, evaluate tolerance rules, and execute instant matching against GL journal entries.
            </p>
          </div>
          <button
            onClick={() => onNavigateTab("workspace")}
            className="w-full rounded-lg bg-[var(--nebula-primary)] px-4 py-2 text-sm font-medium text-white shadow-sm hover:opacity-90 transition-opacity"
          >
            Launch Workspace
          </button>
        </div>

        <div className="rounded-xl border border-[var(--nebula-border)] bg-[var(--nebula-surface)] p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="rounded-lg bg-rose-500/10 p-2 text-rose-600">
                <AlertCircle size={24} />
              </div>
              <h2 className="text-lg font-bold">Exception Review</h2>
            </div>
            <p className="text-sm text-[var(--nebula-text-secondary)] mb-6">
              Investigate payment discrepancies, duplicate deposits, currency exchange variances, and route suspense items.
            </p>
          </div>
          <button
            onClick={() => onNavigateTab("exceptions")}
            className="w-full rounded-lg border border-[var(--nebula-border)] px-4 py-2 text-sm font-medium hover:bg-[var(--nebula-surface-muted)] transition-colors"
          >
            Review Exceptions ({exceptionCount})
          </button>
        </div>

        <div className="rounded-xl border border-[var(--nebula-border)] bg-[var(--nebula-surface)] p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="rounded-lg bg-emerald-500/10 p-2 text-emerald-600">
                <FileText size={24} />
              </div>
              <h2 className="text-lg font-bold">Reconciliation Reports</h2>
            </div>
            <p className="text-sm text-[var(--nebula-text-secondary)] mb-6">
              Generate audit-ready daily reconciliation summaries, outstanding transaction ledgers, and FX difference reports.
            </p>
          </div>
          <button
            onClick={() => onNavigateTab("reports")}
            className="w-full rounded-lg border border-[var(--nebula-border)] px-4 py-2 text-sm font-medium hover:bg-[var(--nebula-surface-muted)] transition-colors"
          >
            View Reports
          </button>
        </div>
      </div>
    </div>
  );
}
