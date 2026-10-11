import { AppBadge } from "../../../components/ui";
import type { Delivery } from "../types/sales.types";

type DeliveryTableProps = {
  deliveries: Delivery[];
};

export default function DeliveryTable({ deliveries }: DeliveryTableProps) {
  return (
    <div className="surface overflow-hidden rounded-[var(--nebula-radius-lg)] border border-[var(--nebula-border)]">
      <table className="w-full text-sm">
        <thead className="bg-[var(--nebula-surface-muted)] text-[var(--nebula-text-secondary)]">
          <tr className="border-b border-[var(--nebula-border)]">
            <th className="p-3.5 text-left font-semibold">Delivery Number</th>
            <th className="p-3.5 text-left font-semibold">Sales Order</th>
            <th className="p-3.5 text-left font-semibold">Warehouse</th>
            <th className="p-3.5 text-left font-semibold">Date</th>
            <th className="p-3.5 text-left font-semibold">Status</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-[var(--nebula-border)]">
          {deliveries.map((delivery) => (
            <tr key={delivery.id} className="transition-colors hover:bg-[var(--nebula-surface-hover)]">
              <td className="p-3.5 font-medium text-[var(--nebula-text-primary)] font-mono text-xs">
                {delivery.id}
              </td>
              <td className="p-3.5 text-[var(--nebula-text-secondary)] font-mono text-xs">
                {delivery.salesOrderId}
              </td>
              <td className="p-3.5 text-[var(--nebula-text-secondary)]">
                {delivery.warehouseId}
              </td>
              <td className="p-3.5 text-[var(--nebula-text-secondary)] font-mono text-xs">
                {delivery.date}
              </td>
              <td className="p-3.5">
                <AppBadge
                  tone={
                    delivery.status === "delivered"
                      ? "success"
                      : delivery.status === "partial"
                      ? "warning"
                      : "neutral"
                  }
                  size="sm"
                >
                  {delivery.status}
                </AppBadge>
              </td>
            </tr>
          ))}

          {deliveries.length === 0 && (
            <tr>
              <td colSpan={5} className="p-8 text-center text-[var(--nebula-text-secondary)]">
                No delivery dispatches recorded yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
