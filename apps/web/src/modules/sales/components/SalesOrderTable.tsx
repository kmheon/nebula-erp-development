import { AppBadge } from "../../../components/ui";
import type { SalesOrder } from "../types/sales.types";

type SalesOrderTableProps = {
  orders: SalesOrder[];
};

export default function SalesOrderTable({ orders }: SalesOrderTableProps) {
  return (
    <div className="surface overflow-hidden rounded-[var(--nebula-radius-lg)] border border-[var(--nebula-border)]">
      <table className="w-full text-sm">
        <thead className="bg-[var(--nebula-surface-muted)] text-[var(--nebula-text-secondary)]">
          <tr className="border-b border-[var(--nebula-border)]">
            <th className="p-3.5 text-left font-semibold">Order Number</th>
            <th className="p-3.5 text-left font-semibold">Customer</th>
            <th className="p-3.5 text-left font-semibold">Date</th>
            <th className="p-3.5 text-left font-semibold">Status</th>
            <th className="p-3.5 text-right font-semibold">Total</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-[var(--nebula-border)]">
          {orders.map((order) => (
            <tr key={order.id} className="transition-colors hover:bg-[var(--nebula-surface-hover)]">
              <td className="p-3.5 font-medium text-[var(--nebula-text-primary)] font-mono text-xs">
                {order.orderNumber}
              </td>
              <td className="p-3.5 text-[var(--nebula-text-secondary)]">
                {order.customerId}
              </td>
              <td className="p-3.5 text-[var(--nebula-text-secondary)] font-mono text-xs">
                {order.date}
              </td>
              <td className="p-3.5">
                <AppBadge
                  tone={
                    order.status === "delivered"
                      ? "success"
                      : order.status === "cancelled"
                      ? "danger"
                      : order.status === "confirmed"
                      ? "warning"
                      : "neutral"
                  }
                  size="sm"
                >
                  {order.status}
                </AppBadge>
              </td>
              <td className="p-3.5 text-right font-mono font-medium text-[var(--nebula-text-primary)]">
                ${order.total.toFixed(2)}
              </td>
            </tr>
          ))}

          {orders.length === 0 && (
            <tr>
              <td colSpan={5} className="p-8 text-center text-[var(--nebula-text-secondary)]">
                No sales orders found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
