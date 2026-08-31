import { useState } from "react";
import { X } from "lucide-react";
import type { BankAccount, BankTransactionType, CreateBankTransactionInput } from "../types/banking.types";

interface BankTransactionFormProps {
  isOpen: boolean;
  onClose: () => void;
  accounts: BankAccount[];
  onSubmit: (data: CreateBankTransactionInput) => void;
}

export default function BankTransactionForm({ isOpen, onClose, accounts, onSubmit }: BankTransactionFormProps) {
  const [form, setForm] = useState<CreateBankTransactionInput>({
    bankAccountId: accounts[0]?.id || "",
    targetAccountId: "",
    type: "deposit",
    amount: 0,
    currency: "USD",
    reference: "TX-10001",
    memo: "",
    date: new Date().toISOString().split("T")[0],
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
          <h2 className="text-lg font-bold">Record Bank / Cash Transaction</h2>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-[var(--nebula-surface-muted)]">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-[var(--nebula-text-secondary)] mb-1">
                Transaction Type
              </label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value as BankTransactionType })}
                className="w-full rounded-lg border border-[var(--nebula-border)] bg-[var(--nebula-surface-subtle)] px-3 py-2 text-sm"
              >
                <option value="deposit">Deposit / Inflow</option>
                <option value="withdrawal">Withdrawal / Outflow</option>
                <option value="transfer_out">Internal Transfer (Out)</option>
                <option value="bank_charge">Bank Charge / Fee</option>
                <option value="interest">Interest Earned</option>
                <option value="cheque">Cheque Payment</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-[var(--nebula-text-secondary)] mb-1">
                Bank / Cash Account
              </label>
              <select
                value={form.bankAccountId}
                onChange={(e) => setForm({ ...form, bankAccountId: e.target.value })}
                className="w-full rounded-lg border border-[var(--nebula-border)] bg-[var(--nebula-surface-subtle)] px-3 py-2 text-sm"
              >
                {accounts.map((acc) => (
                  <option key={acc.id} value={acc.id}>
                    {acc.name} ({acc.currency} {acc.currentBalance.toLocaleString()})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {form.type === "transfer_out" && (
            <div>
              <label className="block text-xs font-semibold uppercase text-[var(--nebula-text-secondary)] mb-1">
                Target Destination Account
              </label>
              <select
                value={form.targetAccountId || ""}
                onChange={(e) => setForm({ ...form, targetAccountId: e.target.value })}
                className="w-full rounded-lg border border-[var(--nebula-border)] bg-[var(--nebula-surface-subtle)] px-3 py-2 text-sm"
              >
                <option value="">Select target account...</option>
                {accounts.filter(a => a.id !== form.bankAccountId).map((acc) => (
                  <option key={acc.id} value={acc.id}>
                    {acc.name} ({acc.currency})
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-[var(--nebula-text-secondary)] mb-1">
                Amount
              </label>
              <input
                type="number"
                step="0.01"
                required
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: parseFloat(e.target.value) || 0 })}
                className="w-full rounded-lg border border-[var(--nebula-border)] bg-[var(--nebula-surface-subtle)] px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-[var(--nebula-text-secondary)] mb-1">
                Date
              </label>
              <input
                type="date"
                required
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="w-full rounded-lg border border-[var(--nebula-border)] bg-[var(--nebula-surface-subtle)] px-3 py-2 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-[var(--nebula-text-secondary)] mb-1">
              Reference / Check No.
            </label>
            <input
              type="text"
              required
              value={form.reference}
              onChange={(e) => setForm({ ...form, reference: e.target.value })}
              className="w-full rounded-lg border border-[var(--nebula-border)] bg-[var(--nebula-surface-subtle)] px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-[var(--nebula-text-secondary)] mb-1">
              Memo / Description
            </label>
            <input
              type="text"
              value={form.memo}
              onChange={(e) => setForm({ ...form, memo: e.target.value })}
              placeholder="e.g. Monthly bank service fee"
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
              Post Transaction
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
