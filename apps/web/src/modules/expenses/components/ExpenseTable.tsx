import { AppBadge, type BadgeTone } from "../../../components/ui";
import type { Expense, ExpenseCategory } from "../types/expense.types";

type ExpenseTableProps = {
  expenses: Expense[];
  categories?: ExpenseCategory[];
  contactNames?: Record<string, string>;
  onEdit?: (expense: Expense) => void;
  onDelete?: (id: string) => void;
};

function getStatusTone(status: Expense["status"]): BadgeTone {
  switch (status) {
    case "approved":
      return "success";
    case "cancelled":
      return "danger";
    default:
      return "warning";
  }
}

function getPaymentTone(status: Expense["paymentStatus"]): BadgeTone {
  switch (status) {
    case "paid":
      return "success";
    case "partial":
      return "info";
    default:
      return "neutral";
  }
}

function categoryName(
  categoryId: string,
  categories?: ExpenseCategory[],
): string {
  const category = categories?.find((c) => c.id === categoryId);
  return category ? category.name : categoryId;
}

export default function ExpenseTable({
  expenses,
  categories,
  contactNames = {},
  onEdit,
  onDelete,
}: ExpenseTableProps) {
  return (
    <div className="surface overflow-hidden rounded-[var(--nebula-radius-lg)] border border-[var(--nebula-border)]">
      <table className="w-full text-sm">
        <thead className="bg-[var(--nebula-surface-muted)] text-[var(--nebula-text-secondary)]">
          <tr className="border-b border-[var(--nebula-border)]">
            <th className="p-3.5 text-left font-semibold">Date</th>
            <th className="p-3.5 text-left font-semibold">Title</th>
            <th className="p-3.5 text-left font-semibold">Category</th>
            <th className="p-3.5 text-left font-semibold">Contact</th>
            <th className="p-3.5 text-right font-semibold">Amount</th>
            <th className="p-3.5 text-left font-semibold">Payment</th>
            <th className="p-3.5 text-left font-semibold">Status</th>
            <th className="p-3.5 text-right font-semibold">Actions</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-[var(--nebula-border)]">
          {expenses.map((expense) => (
            <tr key={expense.id} className="transition-colors hover:bg-[var(--nebula-surface-hover)]">
              <td className="p-3.5 text-[var(--nebula-text-secondary)] font-mono text-xs">{expense.date}</td>
              <td className="p-3.5 font-medium text-[var(--nebula-text-primary)]">{expense.title}</td>
              <td className="p-3.5 text-[var(--nebula-text-secondary)]">
                {categoryName(expense.categoryId, categories)}
              </td>
              <td className="p-3.5 text-[var(--nebula-text-secondary)]">
                {expense.contactId
                  ? (contactNames[expense.contactId] ?? expense.contactId)
                  : "-"}
              </td>
              <td className="p-3.5 text-right font-mono font-medium text-[var(--nebula-text-primary)]">
                ${expense.amount.toFixed(2)}
              </td>
              <td className="p-3.5">
                <AppBadge tone={getPaymentTone(expense.paymentStatus)} size="sm">
                  {expense.paymentStatus}
                </AppBadge>
              </td>
              <td className="p-3.5">
                <AppBadge tone={getStatusTone(expense.status)} size="sm">
                  {expense.status}
                </AppBadge>
              </td>
              <td className="p-3.5 text-right">
                <div className="flex justify-end gap-2">
                  {onEdit && (
                    <button
                      className="rounded-lg border border-[var(--nebula-border)] px-2.5 py-1 text-xs font-medium text-[var(--nebula-text-primary)] hover:bg-[var(--nebula-surface-muted)] transition-colors"
                      onClick={() => onEdit(expense)}
                    >
                      Edit
                    </button>
                  )}
                  {onDelete && (
                    <button
                      className="rounded-lg border border-[var(--nebula-danger)]/30 px-2.5 py-1 text-xs font-medium text-[var(--nebula-danger)] hover:bg-[var(--nebula-danger-bg)] transition-colors"
                      onClick={() => onDelete(expense.id)}
                    >
                      Delete
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}

          {expenses.length === 0 && (
            <tr>
              <td
                colSpan={8}
                className="p-8 text-center text-[var(--nebula-text-secondary)]"
              >
                No expenses recorded yet. Record one to get started.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
