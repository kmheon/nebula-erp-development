import { AppBadge, type BadgeTone } from "../../../components/ui";
import type { Payment } from "../types/payment.types";

type PaymentTableProps = {
  payments: Payment[];
};

function getStatusTone(status: Payment["status"]): BadgeTone {
  switch (status) {
    case "completed":
      return "success";
    case "cancelled":
      return "danger";
    default:
      return "warning";
  }
}

export default function PaymentTable({ payments }: PaymentTableProps) {
  return (
    <div className="surface overflow-hidden rounded-[var(--nebula-radius-lg)] border border-[var(--nebula-border)]">
      <table className="w-full text-sm">
        <thead className="bg-[var(--nebula-surface-muted)] text-[var(--nebula-text-secondary)]">
          <tr className="border-b border-[var(--nebula-border)]">
            <th className="p-3.5 text-left font-semibold">Type</th>
            <th className="p-3.5 text-left font-semibold">Party</th>
            <th className="p-3.5 text-right font-semibold">Amount</th>
            <th className="p-3.5 text-left font-semibold">Method</th>
            <th className="p-3.5 text-left font-semibold">Date</th>
            <th className="p-3.5 text-left font-semibold">Status</th>
            <th className="p-3.5 text-left font-semibold">Reference</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-[var(--nebula-border)]">
          {payments.map((payment) => (
            <tr key={payment.id} className="transition-colors hover:bg-[var(--nebula-surface-hover)]">
              <td className="p-3.5">
                <AppBadge
                  tone={payment.type === "payable" ? "warning" : "primary"}
                  size="sm"
                >
                  {payment.type === "payable" ? "Payable" : "Receivable"}
                </AppBadge>
              </td>

              <td className="p-3.5 text-[var(--nebula-text-primary)] font-medium">{payment.partyId}</td>

              <td className="p-3.5 text-right font-mono font-medium text-[var(--nebula-text-primary)]">
                ${payment.amount.toFixed(2)}
              </td>

              <td className="p-3.5 text-[var(--nebula-text-secondary)] capitalize">{payment.method}</td>

              <td className="p-3.5 text-[var(--nebula-text-secondary)] font-mono text-xs">{payment.date}</td>

              <td className="p-3.5">
                <AppBadge tone={getStatusTone(payment.status)} size="sm">
                  {payment.status}
                </AppBadge>
              </td>

              <td className="p-3.5 text-[var(--nebula-text-secondary)] font-mono text-xs">
                {payment.reference || "-"}
              </td>
            </tr>
          ))}

          {payments.length === 0 && (
            <tr>
              <td colSpan={7} className="p-8 text-center text-[var(--nebula-text-secondary)]">
                No payment transactions recorded yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
