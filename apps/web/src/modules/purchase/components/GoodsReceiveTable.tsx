import { AppBadge } from "../../../components/ui";
import type { GoodsReceive } from "../types/purchase.types";

type GoodsReceiveTableProps = {
  goodsReceives: GoodsReceive[];
};

export default function GoodsReceiveTable({
  goodsReceives,
}: GoodsReceiveTableProps) {
  return (
    <div className="surface overflow-hidden rounded-[var(--nebula-radius-lg)] border border-[var(--nebula-border)]">
      <table className="w-full text-sm">
        <thead className="bg-[var(--nebula-surface-muted)] text-[var(--nebula-text-secondary)]">
          <tr className="border-b border-[var(--nebula-border)]">
            <th className="p-3.5 text-left font-semibold">Purchase Order</th>
            <th className="p-3.5 text-left font-semibold">Warehouse</th>
            <th className="p-3.5 text-left font-semibold">Date</th>
            <th className="p-3.5 text-left font-semibold">Status</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-[var(--nebula-border)]">
          {goodsReceives.map((gr) => (
            <tr key={gr.id} className="transition-colors hover:bg-[var(--nebula-surface-hover)]">
              <td className="p-3.5 font-medium text-[var(--nebula-text-primary)] font-mono text-xs">
                {gr.purchaseOrderId}
              </td>

              <td className="p-3.5 text-[var(--nebula-text-secondary)]">
                {gr.warehouseId}
              </td>

              <td className="p-3.5 text-[var(--nebula-text-secondary)] font-mono text-xs">
                {gr.date}
              </td>

              <td className="p-3.5">
                <AppBadge
                  tone={
                    gr.status === "received"
                      ? "success"
                      : gr.status === "partial"
                      ? "warning"
                      : "neutral"
                  }
                  size="sm"
                >
                  {gr.status}
                </AppBadge>
              </td>
            </tr>
          ))}

          {goodsReceives.length === 0 && (
            <tr>
              <td colSpan={4} className="p-8 text-center text-[var(--nebula-text-secondary)]">
                No goods receipt notes found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
