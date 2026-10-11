import { AppBadge } from "../../../components/ui";
import type { TaxType } from "../types/tax.types";

type TaxTableProps = {
  taxes: TaxType[];
};

export default function TaxTable({ taxes }: TaxTableProps) {
  return (
    <div className="surface overflow-hidden rounded-[var(--nebula-radius-lg)] border border-[var(--nebula-border)]">
      <table className="w-full text-sm">
        <thead className="bg-[var(--nebula-surface-muted)] text-[var(--nebula-text-secondary)]">
          <tr className="border-b border-[var(--nebula-border)]">
            <th className="p-3.5 text-left font-semibold">Tax Name</th>
            <th className="p-3.5 text-left font-semibold">Rate</th>
            <th className="p-3.5 text-left font-semibold">Description</th>
            <th className="p-3.5 text-left font-semibold">Status</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-[var(--nebula-border)]">
          {taxes.map((tax) => (
            <tr key={tax.id} className="transition-colors hover:bg-[var(--nebula-surface-hover)]">
              <td className="p-3.5 font-medium text-[var(--nebula-text-primary)]">{tax.name}</td>

              <td className="p-3.5 font-mono font-medium text-[var(--nebula-text-primary)]">{tax.rate}%</td>

              <td className="p-3.5 text-[var(--nebula-text-secondary)]">{tax.description || "-"}</td>

              <td className="p-3.5">
                <AppBadge
                  tone={tax.status === "active" ? "success" : "neutral"}
                  size="sm"
                >
                  {tax.status}
                </AppBadge>
              </td>
            </tr>
          ))}

          {taxes.length === 0 && (
            <tr>
              <td colSpan={4} className="p-8 text-center text-[var(--nebula-text-secondary)]">
                No tax rules configured.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
