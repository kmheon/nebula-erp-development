import { AppBadge } from "../../../components/ui";
import type { Supplier } from "../types/purchase.types";

type SupplierTableProps = {
  suppliers: Supplier[];
};

export default function SupplierTable({ suppliers }: SupplierTableProps) {
  return (
    <div className="surface overflow-hidden rounded-[var(--nebula-radius-lg)] border border-[var(--nebula-border)]">
      <table className="w-full text-sm">
        <thead className="bg-[var(--nebula-surface-muted)] text-[var(--nebula-text-secondary)]">
          <tr className="border-b border-[var(--nebula-border)]">
            <th className="p-3.5 text-left font-semibold">Company</th>
            <th className="p-3.5 text-left font-semibold">Contact</th>
            <th className="p-3.5 text-left font-semibold">Phone</th>
            <th className="p-3.5 text-left font-semibold">Email</th>
            <th className="p-3.5 text-left font-semibold">Status</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-[var(--nebula-border)]">
          {suppliers.map((supplier) => (
            <tr key={supplier.id} className="transition-colors hover:bg-[var(--nebula-surface-hover)]">
              <td className="p-3.5">
                <div className="font-medium text-[var(--nebula-text-primary)]">
                  {supplier.companyName}
                </div>
                {supplier.taxNumber && (
                  <div className="text-xs text-[var(--nebula-text-secondary)]">
                    Tax ID: {supplier.taxNumber}
                  </div>
                )}
              </td>

              <td className="p-3.5 text-[var(--nebula-text-secondary)]">
                {supplier.contactPerson}
              </td>

              <td className="p-3.5 text-[var(--nebula-text-secondary)]">{supplier.phone}</td>

              <td className="p-3.5 text-[var(--nebula-text-secondary)]">{supplier.email}</td>

              <td className="p-3.5">
                <AppBadge
                  tone={supplier.status === "active" ? "success" : "neutral"}
                  size="sm"
                >
                  {supplier.status}
                </AppBadge>
              </td>
            </tr>
          ))}

          {suppliers.length === 0 && (
            <tr>
              <td colSpan={5} className="p-8 text-center text-[var(--nebula-text-secondary)]">
                No suppliers registered yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
