import { useState } from "react";
import { X } from "lucide-react";
import type { BankAccountType, CreateBankAccountInput } from "../types/banking.types";

interface BankAccountFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateBankAccountInput) => void;
}

export default function BankAccountForm({ isOpen, onClose, onSubmit }: BankAccountFormProps) {
  const [form, setForm] = useState<CreateBankAccountInput>({
    name: "",
    accountNumber: "",
    bankName: "",
    branch: "",
    currency: "USD",
    type: "checking",
    initialBalance: 0,
    notes: "",
  });

  if (!isOpen) return null;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit(form);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-xl bg-[var(--nebula-surface)] p-6 shadow-xl border border-[var(--nebula-border)]">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">Add Bank / Cash Account</h2>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-[var(--nebula-surface-muted)]">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-[var(--nebula-text-secondary)] mb-1">
              Account Name
            </label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Primary Operating Account"
              className="w-full rounded-lg border border-[var(--nebula-border)] bg-[var(--nebula-surface-subtle)] px-3 py-2 text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-[var(--nebula-text-secondary)] mb-1">
                Account Number / Identifier
              </label>
              <input
                type="text"
                required
                value={form.accountNumber}
                onChange={(e) => setForm({ ...form, accountNumber: e.target.value })}
                placeholder="e.g. 1002938481"
                className="w-full rounded-lg border border-[var(--nebula-border)] bg-[var(--nebula-surface-subtle)] px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-[var(--nebula-text-secondary)] mb-1">
                Bank / Institution Name
              </label>
              <input
                type="text"
                required
                value={form.bankName}
                onChange={(e) => setForm({ ...form, bankName: e.target.value })}
                placeholder="e.g. Chase Bank"
                className="w-full rounded-lg border border-[var(--nebula-border)] bg-[var(--nebula-surface-subtle)] px-3 py-2 text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-[var(--nebula-text-secondary)] mb-1">
                Account Type
              </label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value as BankAccountType })}
                className="w-full rounded-lg border border-[var(--nebula-border)] bg-[var(--nebula-surface-subtle)] px-3 py-2 text-sm"
              >
                <option value="checking">Checking</option>
                <option value="savings">Savings</option>
                <option value="cash">Cash Register</option>
                <option value="petty_cash">Petty Cash</option>
                <option value="merchant_gateway">Merchant Gateway</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-[var(--nebula-text-secondary)] mb-1">
                Currency
              </label>
              <input
                type="text"
                required
                value={form.currency}
                onChange={(e) => setForm({ ...form, currency: e.target.value })}
                className="w-full rounded-lg border border-[var(--nebula-border)] bg-[var(--nebula-surface-subtle)] px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-[var(--nebula-text-secondary)] mb-1">
                Initial Balance
              </label>
              <input
                type="number"
                step="0.01"
                required
                value={form.initialBalance}
                onChange={(e) => setForm({ ...form, initialBalance: parseFloat(e.target.value) || 0 })}
                className="w-full rounded-lg border border-[var(--nebula-border)] bg-[var(--nebula-surface-subtle)] px-3 py-2 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-[var(--nebula-text-secondary)] mb-1">
              Branch / Notes (Optional)
            </label>
            <input
              type="text"
              value={form.branch || ""}
              onChange={(e) => setForm({ ...form, branch: e.target.value })}
              placeholder="e.g. Main Branch"
              className="w-full rounded-lg border border-[var(--nebula-border)] bg-[var(--nebula-surface-subtle)] px-3 py-2 text-sm"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-[var(--nebula-border)] px-4 py-2 text-sm font-medium hover:bg-[var(--nebula-surface-muted)]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-[var(--nebula-primary)] px-4 py-2 text-sm font-medium text-white shadow-sm hover:opacity-90"
            >
              Create Account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
