import type { BankAccount } from "../types/banking.types";

interface BankAccountsTableProps {
  accounts: BankAccount[];
}

export default function BankAccountsTable({ accounts }: BankAccountsTableProps) {
  return (
    <div className="overflow-x-auto rounded-xl border border-[var(--nebula-border)] bg-[var(--nebula-surface)] shadow-sm">
      <table className="w-full text-left text-sm">
        <thead className="bg-[var(--nebula-surface-muted)] text-xs font-semibold uppercase text-[var(--nebula-text-secondary)]">
          <tr>
            <th className="px-4 py-3">Account Name</th>
            <th className="px-4 py-3">Type</th>
            <th className="px-4 py-3">Bank Institution</th>
            <th className="px-4 py-3">Account Number</th>
            <th className="px-4 py-3 text-right">Current Balance</th>
            <th className="px-4 py-3 text-center">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--nebula-border)]">
          {accounts.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-4 py-8 text-center text-[var(--nebula-text-secondary)]">
                No bank or cash accounts configured.
              </td>
            </tr>
          ) : (
            accounts.map((acc) => (
              <tr key={acc.id} className="hover:bg-[var(--nebula-surface-muted)]/50 transition-colors">
                <td className="px-4 py-3 font-semibold text-[var(--nebula-text-primary)]">
                  {acc.name}
                </td>
                <td className="px-4 py-3 capitalize">
                  <span className="inline-flex items-center rounded-md bg-[var(--nebula-surface-subtle)] px-2 py-0.5 text-xs font-medium text-[var(--nebula-text-secondary)] border border-[var(--nebula-border)]">
                    {acc.type.replace("_", " ")}
                  </span>
                </td>
                <td className="px-4 py-3">{acc.bankName} {acc.branch ? `(${acc.branch})` : ""}</td>
                <td className="px-4 py-3 font-mono text-xs">{acc.accountNumber}</td>
                <td className="px-4 py-3 text-right font-mono font-semibold">
                  {acc.currency} {acc.currentBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </td>
                <td className="px-4 py-3 text-center">
                  <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${
                    acc.isActive ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                  }`}>
                    {acc.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
