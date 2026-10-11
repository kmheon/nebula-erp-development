import { AppBadge } from "../../../components/ui";
import type { ContactLedgerEntry } from "../types/contact.types";

type ContactLedgerTableProps = {
  entries: ContactLedgerEntry[];
};

export default function ContactLedgerTable({ entries }: ContactLedgerTableProps) {
  return (
    <div className="surface overflow-hidden rounded-[var(--nebula-radius-lg)] border border-[var(--nebula-border)]">
      <table className="w-full text-sm">
        <thead className="bg-[var(--nebula-surface-muted)] text-[var(--nebula-text-secondary)]">
          <tr className="border-b border-[var(--nebula-border)]">
            <th className="p-3.5 text-left font-semibold">Date</th>
            <th className="p-3.5 text-left font-semibold">Description</th>
            <th className="p-3.5 text-left font-semibold">Reference</th>
            <th className="p-3.5 text-right font-semibold">Debit</th>
            <th className="p-3.5 text-right font-semibold">Credit</th>
            <th className="p-3.5 text-right font-semibold">Balance</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-[var(--nebula-border)]">
          {entries.map((entry) => (
            <tr key={entry.id} className="transition-colors hover:bg-[var(--nebula-surface-hover)]">
              <td className="p-3.5 font-mono text-xs text-[var(--nebula-text-secondary)]">{entry.date}</td>

              <td className="p-3.5 text-[var(--nebula-text-primary)]">{entry.description}</td>

              <td className="p-3.5">
                <div className="flex items-center gap-2">
                  <AppBadge
                    tone={
                      entry.referenceType === "purchase"
                        ? "secondary"
                        : entry.referenceType === "sale"
                        ? "primary"
                        : entry.referenceType === "payment"
                        ? "success"
                        : "neutral"
                    }
                    size="sm"
                  >
                    {entry.referenceType}
                  </AppBadge>
                  <span className="font-mono text-xs text-[var(--nebula-text-secondary)]">#{entry.referenceId}</span>
                </div>
              </td>

              <td className="p-3.5 text-right font-mono text-[var(--nebula-text-primary)]">
                {entry.debit > 0 ? `$${entry.debit.toFixed(2)}` : "-"}
              </td>

              <td className="p-3.5 text-right font-mono text-[var(--nebula-text-primary)]">
                {entry.credit > 0 ? `$${entry.credit.toFixed(2)}` : "-"}
              </td>

              <td className="p-3.5 text-right font-mono font-medium text-[var(--nebula-text-primary)]">
                ${entry.balance.toFixed(2)}
              </td>
            </tr>
          ))}

          {entries.length === 0 && (
            <tr>
              <td colSpan={6} className="p-8 text-center text-[var(--nebula-text-secondary)]">
                No ledger transactions recorded for this contact.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
