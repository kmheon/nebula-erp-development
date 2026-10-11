import { AppBadge } from "../../../components/ui";
import type { PurchaseOrder } from "../types/purchase.types";

type PurchaseOrderTableProps = {
  orders: PurchaseOrder[];
};

export default function PurchaseOrderTable({ orders }: PurchaseOrderTableProps) {
  return (
    <div className="surface overflow-hidden rounded-[var(--nebula-radius-lg)] border border-[var(--nebula-border)]">
      <table className="w-full text-sm">
        <thead className="bg-[var(--nebula-surface-muted)] text-[var(--nebula-text-secondary)]">
          <tr className="border-b border-[var(--nebula-border)]">
            <th className="p-3.5 text-left font-semibold">PO Number</th>
            <th className="p-3.5 text-left font-semibold">Supplier</th>
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
                {order.supplierId}
              </td>

              <td className="p-3.5 text-[var(--nebula-text-secondary)] font-mono text-xs">{order.date}</td>

              <td className="p-3.5">
                <AppBadge
                  tone={
                    order.status === "received"
                      ? "success"
                      : order.status === "cancelled"
                      ? "danger"
                      : order.status === "pending"
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
                No purchase orders found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
