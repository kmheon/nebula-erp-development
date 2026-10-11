import { useMemo, useState } from "react";
import {
  Receipt,
  Tag,
  TrendingDown,
  Plus,
  Layers,
  Calculator,
} from "lucide-react";

import ExpenseForm from "../components/ExpenseForm";
import ExpenseTable from "../components/ExpenseTable";
import ExpenseCategoryForm from "../components/ExpenseCategoryForm";
import ExpenseCategoryTable from "../components/ExpenseCategoryTable";

import {
  AppPageHeader,
  AppStatCard,
  AppTabs,
  AppButton,
} from "../../../components/ui";

import {
  useExpenses,
  useExpenseMutation,
  useExpenseCategories,
  useExpenseCategoryMutation,
} from "../hooks/useExpenses";
import { useContacts } from "../../contacts/hooks/useContacts";

import type {
  Expense,
  ExpenseCategory,
} from "../types/expense.types";

export default function ExpensesPage() {
  const [activeTab, setActiveTab] = useState<string>("records");
  const [showExpenseForm, setShowExpenseForm] = useState<boolean>(false);
  const [showCategoryForm, setShowCategoryForm] = useState<boolean>(false);

  const { data: expenses = [] } = useExpenses();
  const { data: categories = [] } = useExpenseCategories();
  const { data: contacts = [] } = useContacts();

  const { remove: removeExpense } = useExpenseMutation();
  const { remove: removeCategory } = useExpenseCategoryMutation();

  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [editingCategory, setEditingCategory] = useState<ExpenseCategory | null>(null);

  const contactNames = useMemo(() => {
    const map: Record<string, string> = {};
    contacts.forEach((contact) => {
      map[contact.id] = contact.name;
    });
    return map;
  }, [contacts]);

  const totalExpenseAmount = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);
  const averageExpense = expenses.length > 0 ? totalExpenseAmount / expenses.length : 0;

  function handleEditExpense(expense: Expense) {
    setEditingExpense(expense);
    setShowExpenseForm(true);
    setActiveTab("records");
  }

  function handleDeleteExpense(id: string) {
    if (window.confirm("Delete this expense record?")) {
      removeExpense.mutate(id);
    }
  }

  function handleEditCategory(category: ExpenseCategory) {
    setEditingCategory(category);
    setShowCategoryForm(true);
    setActiveTab("categories");
  }

  function handleDeleteCategory(id: string) {
    if (window.confirm("Delete this expense category?")) {
      removeCategory.mutate(id);
    }
  }

  return (
    <div className="space-y-8">
      <AppPageHeader
        title="Operational Expense Management"
        subtitle="Track company expenditures, operational overheads, vendor services, and category budgeting with general ledger synchronization."
        actions={
          <div className="flex flex-wrap items-center gap-3">
            <AppButton
              variant="outline"
              leftIcon={<Plus size={16} />}
              onClick={() => {
                setActiveTab("categories");
                setEditingCategory(null);
                setShowCategoryForm((prev) => !prev);
              }}
            >
              {showCategoryForm ? "Close Form" : "New Category"}
            </AppButton>
            <AppButton
              variant="primary"
              leftIcon={<Plus size={16} />}
              onClick={() => {
                setActiveTab("records");
                setEditingExpense(null);
                setShowExpenseForm((prev) => !prev);
              }}
            >
              {showExpenseForm ? "Close Form" : "Record Expense"}
            </AppButton>
          </div>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <AppStatCard
          label="Total Operational Expenses"
          value={`$${totalExpenseAmount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          subtext="Cumulative operational spend"
          icon={<TrendingDown size={20} />}
          tone="warning"
        />
        <AppStatCard
          label="Expense Records"
          value={expenses.length}
          subtext="Total logged transactions"
          icon={<Receipt size={20} />}
          tone="primary"
        />
        <AppStatCard
          label="Active Categories"
          value={categories.length}
          subtext="Configured cost centers"
          icon={<Tag size={20} />}
          tone="info"
        />
        <AppStatCard
          label="Average Ticket Size"
          value={`$${averageExpense.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          subtext="Mean cost per expense line"
          icon={<Calculator size={20} />}
          tone="default"
        />
      </div>

      {/* Workspace Tabs */}
      <AppTabs
        tabs={[
          { id: "records", name: "Expense Transactions", icon: <Receipt size={16} /> },
          { id: "categories", name: "Expense Categories & Cost Centers", icon: <Layers size={16} /> },
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
        variant="pill"
      />

      {/* Tab Panels */}
      {activeTab === "records" && (
        <div className="space-y-6">
          {showExpenseForm && (
            <div className="rounded-[var(--nebula-radius-lg)] border border-[var(--nebula-border)] bg-[var(--nebula-surface)] p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold text-[var(--nebula-text-primary)]">
                  {editingExpense ? "Edit Expense Record" : "Record Operational Expense"}
                </h3>
                <button
                  onClick={() => {
                    setShowExpenseForm(false);
                    setEditingExpense(null);
                  }}
                  className="text-xs font-semibold text-[var(--nebula-text-secondary)] hover:text-[var(--nebula-text-primary)]"
                >
                  ✕ Close
                </button>
              </div>
              <ExpenseForm
                expense={editingExpense}
                onClose={() => {
                  setEditingExpense(null);
                  setShowExpenseForm(false);
                }}
              />
            </div>
          )}

          <ExpenseTable
            expenses={expenses}
            categories={categories}
            contactNames={contactNames}
            onEdit={handleEditExpense}
            onDelete={handleDeleteExpense}
          />
        </div>
      )}

      {activeTab === "categories" && (
        <div className="space-y-6">
          {showCategoryForm && (
            <div className="rounded-[var(--nebula-radius-lg)] border border-[var(--nebula-border)] bg-[var(--nebula-surface)] p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold text-[var(--nebula-text-primary)]">
                  {editingCategory ? "Edit Expense Category" : "Add Expense Category"}
                </h3>
                <button
                  onClick={() => {
                    setShowCategoryForm(false);
                    setEditingCategory(null);
                  }}
                  className="text-xs font-semibold text-[var(--nebula-text-secondary)] hover:text-[var(--nebula-text-primary)]"
                >
                  ✕ Close
                </button>
              </div>
              <ExpenseCategoryForm
                category={editingCategory}
                onClose={() => {
                  setEditingCategory(null);
                  setShowCategoryForm(false);
                }}
              />
            </div>
          )}

          <ExpenseCategoryTable
            categories={categories}
            onEdit={handleEditCategory}
            onDelete={handleDeleteCategory}
          />
        </div>
      )}
    </div>
  );
}
