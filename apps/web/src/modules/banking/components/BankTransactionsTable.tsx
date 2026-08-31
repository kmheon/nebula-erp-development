import type { BankAccount, BankTransactionItem } from "../types/banking.types";

interface BankTransactionsTableProps {
  transactions: BankTransactionItem[];
  accounts: BankAccount[];
}

export default function BankTransactionsTable({ transactions, accounts }: BankTransactionsTableProps) {
  const accountMap = new Map(accounts.map((a) => [a.id, a]));

  return (
    <div className="overflow-x-auto rounded-xl border border-[var(--nebula-border)] bg-[var(--nebula-surface)] shadow-sm">
      <table className="w-full text-left text-sm">
        <thead className="bg-[var(--nebula-surface-muted)] text-xs font-semibold uppercase text-[var(--nebula-text-secondary)]">
          <tr>
            <th className="px-4 py-3">Date</th>
            <th className="px-4 py-3">Reference</th>
            <th className="px-4 py-3">Account</th>
            <th className="px-4 py-3">Type</th>
            <th className="px-4 py-3">Memo / Description</th>
            <th className="px-4 py-3 text-right">Amount</th>
            <th className="px-4 py-3 text-center">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--nebula-border)]">
          {transactions.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-4 py-8 text-center text-[var(--nebula-text-secondary)]">
                No bank transactions recorded.
              </td>
            </tr>
          ) : (
            transactions.map((tx) => {
              const account = accountMap.get(tx.bankAccountId);
              const isPositive = tx.type === "deposit" || tx.type === "interest" || tx.type === "transfer_in";
              return (
                <tr key={tx.id} className="hover:bg-[var(--nebula-surface-muted)]/50 transition-colors">
                  <td className="px-4 py-3 text-[var(--nebula-text-secondary)]">{tx.date}</td>
                  <td className="px-4 py-3 font-mono text-xs">{tx.reference}</td>
                  <td className="px-4 py-3 font-medium">{account?.name || "Unknown"}</td>
                  <td className="px-4 py-3 capitalize">
                    <span className="inline-flex items-center rounded-md bg-[var(--nebula-surface-subtle)] px-2 py-0.5 text-xs font-medium text-[var(--nebula-text-secondary)] border border-[var(--nebula-border)]">
                      {tx.type.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[var(--nebula-text-secondary)]">{tx.memo || "—"}</td>
                  <td className={`px-4 py-3 text-right font-mono font-semibold ${
                    isPositive ? "text-emerald-600 dark:text-emerald-400" : "text-[var(--nebula-text-primary)]"
                  }`}>
                    {isPositive ? "+" : "-"}{tx.currency} {tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="inline-flex rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                      {tx.status}
                    </span>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
