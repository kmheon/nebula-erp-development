import { AppBadge, type BadgeTone } from "../../../../components/ui";
import type { PaymentAccount } from "../types/channel.types";

type PaymentAccountTableProps = {
  accounts: PaymentAccount[];
};

function typeTone(type: PaymentAccount["type"]): BadgeTone {
  const map: Record<PaymentAccount["type"], BadgeTone> = {
    cash: "neutral",
    bank: "primary",
    mobile_wallet: "secondary",
    marketplace: "warning",
    gateway: "info",
  };
  return map[type] || "neutral";
}

function formatType(type: PaymentAccount["type"]): string {
  return type
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export default function PaymentAccountTable({ accounts }: PaymentAccountTableProps) {
  return (
    <div className="surface overflow-hidden rounded-[var(--nebula-radius-lg)] border border-[var(--nebula-border)]">
      <table className="w-full text-sm">
        <thead className="bg-[var(--nebula-surface-muted)] text-[var(--nebula-text-secondary)]">
          <tr className="border-b border-[var(--nebula-border)]">
            <th className="p-3.5 text-left font-semibold">Name</th>
            <th className="p-3.5 text-left font-semibold">Type</th>
            <th className="p-3.5 text-left font-semibold">Provider</th>
            <th className="p-3.5 text-left font-semibold">Account Number</th>
            <th className="p-3.5 text-left font-semibold">Status</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-[var(--nebula-border)]">
          {accounts.map((account) => (
            <tr key={account.id} className="transition-colors hover:bg-[var(--nebula-surface-hover)]">
              <td className="p-3.5 font-medium text-[var(--nebula-text-primary)]">{account.name}</td>

              <td className="p-3.5">
                <AppBadge tone={typeTone(account.type)} size="sm">
                  {formatType(account.type)}
                </AppBadge>
              </td>

              <td className="p-3.5 text-[var(--nebula-text-secondary)]">
                {account.provider || (
                  <span className="italic text-[var(--nebula-text-muted)]">—</span>
                )}
              </td>

              <td className="p-3.5 font-mono text-xs text-[var(--nebula-text-secondary)]">
                {account.accountNumber || (
                  <span className="italic text-[var(--nebula-text-muted)]">—</span>
                )}
              </td>

              <td className="p-3.5">
                <AppBadge
                  tone={account.status === "active" ? "success" : "neutral"}
                  size="sm"
                >
                  {account.status}
                </AppBadge>
              </td>
            </tr>
          ))}

          {accounts.length === 0 && (
            <tr>
              <td colSpan={5} className="p-8 text-center text-[var(--nebula-text-secondary)]">
                No payment accounts configured yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
