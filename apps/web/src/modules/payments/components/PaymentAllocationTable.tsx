import { useState } from "react";
import { usePaymentAllocations } from "../hooks/usePayments";
import { AppBadge } from "../../../components/ui";
import type { Payment } from "../types/payment.types";

type PaymentAllocationTableProps = {
  payments: Payment[];
};

function documentTypeLabel(type: string): string {
  switch (type) {
    case "sales_invoice":
      return "Sales Invoice";
    case "purchase_invoice":
      return "Purchase Invoice";
    default:
      return type;
  }
}

export default function PaymentAllocationTable({
  payments,
}: PaymentAllocationTableProps) {
  const [selectedPaymentId, setSelectedPaymentId] = useState<string>(
    payments[0]?.id ?? "",
  );

  const paymentId = selectedPaymentId || payments[0]?.id || "";
  const { data: allocations = [] } = usePaymentAllocations(paymentId);
  const selectedPayment = payments.find((p) => p.id === paymentId);

  return (
    <div className="surface overflow-hidden rounded-[var(--nebula-radius-lg)] border border-[var(--nebula-border)]">
      <div className="border-b border-[var(--nebula-border)] bg-[var(--nebula-surface)] p-3.5">
        <label className="block text-xs font-semibold text-[var(--nebula-text-secondary)] mb-1.5">
          Select Source Payment Transaction
        </label>
        <select
          className="w-full max-w-md rounded-lg border border-[var(--nebula-border)] bg-[var(--nebula-surface)] px-3 py-2 text-sm text-[var(--nebula-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--nebula-primary)]"
          value={paymentId}
          onChange={(e) => setSelectedPaymentId(e.target.value)}
        >
          <option value="">Select Payment</option>
          {payments.map((payment) => (
            <option key={payment.id} value={payment.id}>
              {payment.type === "payable" ? "Pay" : "Receipt"}{" "}
              ${payment.amount.toFixed(2)} · {payment.date}
            </option>
          ))}
        </select>
      </div>

      <table className="w-full text-sm">
        <thead className="bg-[var(--nebula-surface-muted)] text-[var(--nebula-text-secondary)]">
          <tr className="border-b border-[var(--nebula-border)]">
            <th className="p-3.5 text-left font-semibold">Payment</th>
            <th className="p-3.5 text-left font-semibold">Invoice</th>
            <th className="p-3.5 text-left font-semibold">Type</th>
            <th className="p-3.5 text-right font-semibold">Allocated</th>
            <th className="p-3.5 text-right font-semibold">Amount</th>
            <th className="p-3.5 text-left font-semibold">Date</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--nebula-border)]">
          {allocations.map((allocation) => (
            <tr key={allocation.id} className="transition-colors hover:bg-[var(--nebula-surface-hover)]">
              <td className="p-3.5 font-medium text-[var(--nebula-text-primary)]">
                {selectedPayment
                  ? `$${selectedPayment.amount.toFixed(2)} · ${selectedPayment.date}`
                  : allocation.paymentId}
              </td>
              <td className="p-3.5 text-[var(--nebula-text-primary)] font-mono text-xs">{allocation.documentNumber}</td>
              <td className="p-3.5">
                <AppBadge
                  tone={allocation.documentType === "sales_invoice" ? "primary" : "warning"}
                  size="sm"
                >
                  {documentTypeLabel(allocation.documentType)}
                </AppBadge>
              </td>
              <td className="p-3.5 text-right font-mono font-medium text-[var(--nebula-text-primary)]">
                ${allocation.allocatedAmount.toFixed(2)}
              </td>
              <td className="p-3.5 text-right font-mono text-[var(--nebula-text-secondary)]">
                ${allocation.documentTotal.toFixed(2)}
              </td>
              <td className="p-3.5 text-[var(--nebula-text-secondary)] font-mono text-xs">{allocation.documentDate}</td>
            </tr>
          ))}

          {allocations.length === 0 && (
            <tr>
              <td
                className="p-8 text-center text-sm text-[var(--nebula-text-secondary)]"
                colSpan={6}
              >
                No allocations for this payment transaction.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
