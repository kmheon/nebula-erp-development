import { AppBadge } from "../../../components/ui";
import type { ExpenseCategory } from "../types/expense.types";

type ExpenseCategoryTableProps = {
  categories: ExpenseCategory[];
  onEdit?: (category: ExpenseCategory) => void;
  onDelete?: (id: string) => void;
};

export default function ExpenseCategoryTable({
  categories,
  onEdit,
  onDelete,
}: ExpenseCategoryTableProps) {
  return (
    <div className="surface overflow-hidden rounded-[var(--nebula-radius-lg)] border border-[var(--nebula-border)]">
      <table className="w-full text-sm">
        <thead className="bg-[var(--nebula-surface-muted)] text-[var(--nebula-text-secondary)]">
          <tr className="border-b border-[var(--nebula-border)]">
            <th className="p-3.5 text-left font-semibold">Name</th>
            <th className="p-3.5 text-left font-semibold">Description</th>
            <th className="p-3.5 text-left font-semibold">Status</th>
            <th className="p-3.5 text-right font-semibold">Actions</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-[var(--nebula-border)]">
          {categories.map((category) => (
            <tr key={category.id} className="transition-colors hover:bg-[var(--nebula-surface-hover)]">
              <td className="p-3.5 font-medium text-[var(--nebula-text-primary)]">{category.name}</td>
              <td className="p-3.5 text-[var(--nebula-text-secondary)]">{category.description || "-"}</td>
              <td className="p-3.5">
                <AppBadge tone={category.status === "active" ? "success" : "neutral"} size="sm">
                  {category.status}
                </AppBadge>
              </td>
              <td className="p-3.5 text-right">
                <div className="flex justify-end gap-2">
                  {onEdit && (
                    <button
                      className="rounded-lg border border-[var(--nebula-border)] px-2.5 py-1 text-xs font-medium text-[var(--nebula-text-primary)] hover:bg-[var(--nebula-surface-muted)] transition-colors"
                      onClick={() => onEdit(category)}
                    >
                      Edit
                    </button>
                  )}
                  {onDelete && (
                    <button
                      className="rounded-lg border border-[var(--nebula-danger)]/30 px-2.5 py-1 text-xs font-medium text-[var(--nebula-danger)] hover:bg-[var(--nebula-danger-bg)] transition-colors"
                      onClick={() => onDelete(category.id)}
                    >
                      Delete
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}

          {categories.length === 0 && (
            <tr>
              <td
                colSpan={4}
                className="p-8 text-center text-[var(--nebula-text-secondary)]"
              >
                No expense categories defined.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
