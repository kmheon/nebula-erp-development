import { AppBadge } from "../../../components/ui";
import type {
  Asset,
  AssetCategory,
} from "../types/asset.types";

type AssetTableProps = {
  assets: Asset[];
  categories?: AssetCategory[];
  onEdit?: (asset: Asset) => void;
  onDelete?: (id: string) => void;
};

function categoryName(
  categoryId: string,
  categories?: AssetCategory[],
): string {
  const category = categories?.find((c) => c.id === categoryId);
  return category ? category.name : categoryId;
}

export default function AssetTable({
  assets,
  categories,
  onEdit,
  onDelete,
}: AssetTableProps) {
  return (
    <div className="surface overflow-hidden rounded-[var(--nebula-radius-lg)] border border-[var(--nebula-border)]">
      <table className="w-full text-sm">
        <thead className="bg-[var(--nebula-surface-muted)] text-[var(--nebula-text-secondary)]">
          <tr className="border-b border-[var(--nebula-border)]">
            <th className="p-3.5 text-left font-semibold">Name</th>
            <th className="p-3.5 text-left font-semibold">Category</th>
            <th className="p-3.5 text-right font-semibold">Purchase Value</th>
            <th className="p-3.5 text-right font-semibold">Current Value</th>
            <th className="p-3.5 text-left font-semibold">Status</th>
            <th className="p-3.5 text-right font-semibold">Actions</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-[var(--nebula-border)]">
          {assets.map((asset) => (
            <tr key={asset.id} className="transition-colors hover:bg-[var(--nebula-surface-hover)]">
              <td className="p-3.5 font-medium text-[var(--nebula-text-primary)]">{asset.name}</td>
              <td className="p-3.5 text-[var(--nebula-text-secondary)]">
                {categoryName(asset.categoryId, categories)}
              </td>
              <td className="p-3.5 text-right font-mono font-medium text-[var(--nebula-text-primary)]">
                ${asset.purchaseValue?.toFixed(2) ?? "0.00"}
              </td>
              <td className="p-3.5 text-right font-mono font-medium text-[var(--nebula-text-primary)]">
                ${asset.currentValue?.toFixed(2) ?? "0.00"}
              </td>
              <td className="p-3.5">
                <AppBadge
                  tone={
                    asset.status === "active"
                      ? "success"
                      : asset.status === "retired"
                      ? "warning"
                      : "neutral"
                  }
                  size="sm"
                >
                  {asset.status}
                </AppBadge>
              </td>
              <td className="p-3.5 text-right">
                <div className="flex justify-end gap-2">
                  {onEdit && (
                    <button
                      className="rounded-lg border border-[var(--nebula-border)] px-2.5 py-1 text-xs font-medium text-[var(--nebula-text-primary)] hover:bg-[var(--nebula-surface-muted)] transition-colors"
                      onClick={() => onEdit(asset)}
                    >
                      Edit
                    </button>
                  )}
                  {onDelete && (
                    <button
                      className="rounded-lg border border-[var(--nebula-danger)]/30 px-2.5 py-1 text-xs font-medium text-[var(--nebula-danger)] hover:bg-[var(--nebula-danger-bg)] transition-colors"
                      onClick={() => onDelete(asset.id)}
                    >
                      Delete
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}

          {assets.length === 0 && (
            <tr>
              <td colSpan={6} className="p-8 text-center text-[var(--nebula-text-secondary)]">
                No fixed assets registered.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
