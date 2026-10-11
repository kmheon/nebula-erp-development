import { AppBadge } from "../../../components/ui";
import type { Customer } from "../types/sales.types";

type CustomerTableProps = {
  customers: Customer[];
};

export default function CustomerTable({ customers }: CustomerTableProps) {
  return (
    <div className="surface overflow-hidden rounded-[var(--nebula-radius-lg)] border border-[var(--nebula-border)]">
      <table className="w-full text-sm">
        <thead className="bg-[var(--nebula-surface-muted)] text-[var(--nebula-text-secondary)]">
          <tr className="border-b border-[var(--nebula-border)]">
            <th className="p-3.5 text-left font-semibold">Name</th>
            <th className="p-3.5 text-left font-semibold">Phone</th>
            <th className="p-3.5 text-left font-semibold">Email</th>
            <th className="p-3.5 text-left font-semibold">Status</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-[var(--nebula-border)]">
          {customers.map((customer) => (
            <tr key={customer.id} className="transition-colors hover:bg-[var(--nebula-surface-hover)]">
              <td className="p-3.5">
                <div className="font-medium text-[var(--nebula-text-primary)]">
                  {customer.name}
                </div>
                {customer.taxNumber && (
                  <div className="text-xs text-[var(--nebula-text-secondary)]">
                    Tax ID: {customer.taxNumber}
                  </div>
                )}
              </td>

              <td className="p-3.5 text-[var(--nebula-text-secondary)]">{customer.phone}</td>

              <td className="p-3.5 text-[var(--nebula-text-secondary)]">{customer.email}</td>

              <td className="p-3.5">
                <AppBadge
                  tone={customer.status === "active" ? "success" : "neutral"}
                  size="sm"
                >
                  {customer.status}
                </AppBadge>
              </td>
            </tr>
          ))}

          {customers.length === 0 && (
            <tr>
              <td colSpan={4} className="p-8 text-center text-[var(--nebula-text-secondary)]">
                No customers recorded.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
