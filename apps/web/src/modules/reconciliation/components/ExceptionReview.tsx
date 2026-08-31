import { ShieldAlert } from "lucide-react";
import type { ReconciliationException } from "../types/reconciliation.types";

interface ExceptionReviewProps {
  exceptions: ReconciliationException[];
}

export default function ExceptionReview({ exceptions }: ExceptionReviewProps) {
  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-[var(--nebula-border)] bg-[var(--nebula-surface)] p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold">Exception & Discrepancy Review</h2>
            <p className="text-sm text-[var(--nebula-text-secondary)]">
              Manage payment discrepancies, duplicate deposits, over/underpayments, and suspense account routing.
            </p>
          </div>
          <span className="rounded-full bg-rose-500/10 px-3 py-1 text-xs font-semibold text-rose-600 dark:text-rose-400">
            {exceptions.filter(e => e.status === "open").length} Open Exceptions
          </span>
        </div>

        <div className="overflow-x-auto rounded-lg border border-[var(--nebula-border)]">
          <table className="w-full text-left text-sm">
            <thead className="bg-[var(--nebula-surface-muted)] text-xs font-semibold uppercase text-[var(--nebula-text-secondary)]">
              <tr>
                <th className="px-4 py-3">Exception Type</th>
                <th className="px-4 py-3">Description</th>
                <th className="px-4 py-3 text-right">Amount</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-right">Date</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--nebula-border)]">
              {exceptions.map((exc) => (
                <tr key={exc.id} className="hover:bg-[var(--nebula-surface-muted)]/50 transition-colors">
                  <td className="px-4 py-3 font-semibold uppercase text-xs">
                    <span className="inline-flex items-center gap-1 text-rose-600 dark:text-rose-400">
                      <ShieldAlert size={14} />
                      {exc.exceptionType.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-4 py-3">{exc.description}</td>
                  <td className="px-4 py-3 text-right font-mono font-bold">${exc.amount.toFixed(2)}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      exc.status === "open" ? "bg-amber-500/10 text-amber-600" : "bg-emerald-500/10 text-emerald-600"
                    }`}>
                      {exc.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right text-[var(--nebula-text-secondary)] font-mono text-xs">
                    {new Date(exc.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {exc.status === "open" && (
                      <button className="rounded-lg bg-[var(--nebula-primary)] px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:opacity-90">
                        Resolve Exception
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {exceptions.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-sm text-[var(--nebula-text-secondary)]">
                    No reconciliation exceptions detected. All bank statements balanced cleanly.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
