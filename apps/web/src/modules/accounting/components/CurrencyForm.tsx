import { useState } from "react";
import { X } from "lucide-react";
import type { Currency } from "../types/currency.types";

interface CurrencyFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (currency: Currency) => void;
}

export default function CurrencyForm({ isOpen, onClose, onSubmit }: CurrencyFormProps) {
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [decimalPrecision, setDecimalPrecision] = useState(2);

  if (!isOpen) return null;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit({
      code: code.toUpperCase(),
      name,
      symbol,
      decimalPrecision,
      isActive: true,
      isBaseCurrency: false,
      isReportingCurrency: false,
    });
    setCode("");
    setName("");
    setSymbol("");
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-xl bg-[var(--nebula-surface)] p-6 shadow-xl border border-[var(--nebula-border)]">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">Add New Currency</h2>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-[var(--nebula-surface-muted)]">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-[var(--nebula-text-secondary)] mb-1">
                ISO Code
              </label>
              <input
                type="text"
                required
                maxLength={3}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="e.g. CHF"
                className="w-full rounded-lg border border-[var(--nebula-border)] bg-[var(--nebula-surface-subtle)] px-3 py-2 text-sm uppercase font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-[var(--nebula-text-secondary)] mb-1">
                Symbol
              </label>
              <input
                type="text"
                required
                value={symbol}
                onChange={(e) => setSymbol(e.target.value)}
                placeholder="e.g. CHF"
                className="w-full rounded-lg border border-[var(--nebula-border)] bg-[var(--nebula-surface-subtle)] px-3 py-2 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-[var(--nebula-text-secondary)] mb-1">
              Currency Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Swiss Franc"
              className="w-full rounded-lg border border-[var(--nebula-border)] bg-[var(--nebula-surface-subtle)] px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-[var(--nebula-text-secondary)] mb-1">
              Decimal Precision
            </label>
            <select
              value={decimalPrecision}
              onChange={(e) => setDecimalPrecision(parseInt(e.target.value))}
              className="w-full rounded-lg border border-[var(--nebula-border)] bg-[var(--nebula-surface-subtle)] px-3 py-2 text-sm"
            >
              <option value={0}>0 Decimals (e.g. JPY 100)</option>
              <option value={2}>2 Decimals (e.g. USD $100.00)</option>
              <option value={3}>3 Decimals (e.g. BHD 100.000)</option>
            </select>
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
              Save Currency
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
