import { AppBadge, type BadgeTone } from "../../../components/ui";
import type { BankTransaction } from "../types/reconciliation.types";
import type { PossibleMatch } from "../services/matching.service";

type ReconciliationTableProps = {
  transactions: BankTransaction[];
  possibleMatches: Record<string, PossibleMatch[]>;
  onMatch?: (bankTransactionId: string, sourceId: string) => void;
};

function getStatusTone(status: BankTransaction["status"]): BadgeTone {
  switch (status) {
    case "reconciled":
      return "success";
    case "matched":
      return "primary";
    default:
      return "warning";
  }
}

function describeMatch(match?: PossibleMatch): string {
  if (!match) return "—";

  const label =
    match.sourceType === "journal_entry"
      ? "Journal"
      : match.sourceType === "payment"
        ? "Payment"
        : "Settlement";

  return `${label} ${match.reference || match.sourceId.slice(0, 8)} ($${match.amount.toFixed(2)})`;
}

export default function ReconciliationTable({
  transactions,
  possibleMatches,
  onMatch,
}: ReconciliationTableProps) {
  return (
    <div className="surface overflow-hidden rounded-[var(--nebula-radius-lg)] border border-[var(--nebula-border)]">
      <table className="w-full text-sm">
        <thead className="bg-[var(--nebula-surface-muted)] text-[var(--nebula-text-secondary)]">
          <tr className="border-b border-[var(--nebula-border)]">
            <th className="p-3.5 text-left font-semibold">Type</th>
            <th className="p-3.5 text-left font-semibold">Date</th>
            <th className="p-3.5 text-left font-semibold">Description</th>
            <th className="p-3.5 text-left font-semibold">Reference</th>
            <th className="p-3.5 text-right font-semibold">Amount</th>
            <th className="p-3.5 text-left font-semibold">Possible Match</th>
            <th className="p-3.5 text-left font-semibold">Status</th>
            <th className="p-3.5 text-right font-semibold">Action</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-[var(--nebula-border)]">
          {transactions.map((transaction) => {
            const candidates = possibleMatches[transaction.id] ?? [];
            const best = candidates[0];

            return (
              <tr key={transaction.id} className="transition-colors hover:bg-[var(--nebula-surface-hover)]">
                <td className="p-3.5">
                  <AppBadge
                    tone={transaction.type === "credit" ? "success" : "neutral"}
                    size="sm"
                  >
                    {transaction.type === "credit" ? "Credit" : "Debit"}
                  </AppBadge>
                </td>

                <td className="p-3.5 text-[var(--nebula-text-secondary)] font-mono text-xs">{transaction.date}</td>

                <td className="p-3.5 text-[var(--nebula-text-primary)] font-medium">{transaction.description}</td>

                <td className="p-3.5 text-[var(--nebula-text-secondary)] font-mono text-xs">{transaction.reference ?? "—"}</td>

                <td className="p-3.5 text-right font-mono font-medium text-[var(--nebula-text-primary)]">
                  ${transaction.amount.toFixed(2)}
                </td>

                <td className="p-3.5 text-[var(--nebula-text-secondary)]">
                  {describeMatch(best)}

                  {candidates.length > 1 && (
                    <span className="ml-1 text-xs text-[var(--nebula-text-muted)]">
                      +{candidates.length - 1} more
                    </span>
                  )}
                </td>

                <td className="p-3.5">
                  <AppBadge tone={getStatusTone(transaction.status)} size="sm">
                    {transaction.status}
                  </AppBadge>
                </td>

                <td className="p-3.5 text-right">
                  {transaction.status === "unmatched" &&
                    best &&
                    onMatch && (
                      <button
                        className="rounded-lg bg-[var(--nebula-primary)] px-3 py-1 text-xs font-semibold text-white hover:opacity-90 transition-opacity"
                        onClick={() =>
                          onMatch(transaction.id, best.sourceId)
                        }
                      >
                        Match
                      </button>
                    )}
                </td>
              </tr>
            );
          })}

          {transactions.length === 0 && (
            <tr>
              <td
                className="p-8 text-center text-sm text-[var(--nebula-text-muted)]"
                colSpan={8}
              >
                No bank transactions found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
