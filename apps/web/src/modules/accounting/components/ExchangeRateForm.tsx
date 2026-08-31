import { useState } from "react";
import { X } from "lucide-react";
import type { Currency, ExchangeRate } from "../types/currency.types";

interface ExchangeRateFormProps {
  isOpen: boolean;
  onClose: () => void;
  currencies: Currency[];
  onSubmit: (rate: ExchangeRate) => void;
}

export default function ExchangeRateForm({ isOpen, onClose, currencies, onSubmit }: ExchangeRateFormProps) {
  const [fromCurrency, setFromCurrency] = useState(currencies[0]?.code || "EUR");
  const [toCurrency, setToCurrency] = useState("USD");
  const [rate, setRate] = useState<number>(1.0);
  const [source, setSource] = useState<ExchangeRate["source"]>("manual");

  if (!isOpen) return null;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit({
      id: `rate-${Date.now()}`,
      fromCurrency,
      toCurrency,
      rate,
      buyRate: rate * 0.998,
      sellRate: rate * 1.002,
      midRate: rate,
      effectiveDate: new Date().toISOString().split("T")[0],
      source,
    });
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-xl bg-[var(--nebula-surface)] p-6 shadow-xl border border-[var(--nebula-border)]">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">Add Exchange Rate</h2>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-[var(--nebula-surface-muted)]">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-[var(--nebula-text-secondary)] mb-1">
                From Currency
              </label>
              <select
                value={fromCurrency}
                onChange={(e) => setFromCurrency(e.target.value)}
                className="w-full rounded-lg border border-[var(--nebula-border)] bg-[var(--nebula-surface-subtle)] px-3 py-2 text-sm"
              >
                {currencies.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.code} — {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-[var(--nebula-text-secondary)] mb-1">
                To Currency (Base)
              </label>
              <select
                value={toCurrency}
                onChange={(e) => setToCurrency(e.target.value)}
                className="w-full rounded-lg border border-[var(--nebula-border)] bg-[var(--nebula-surface-subtle)] px-3 py-2 text-sm"
              >
                {currencies.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.code} — {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-[var(--nebula-text-secondary)] mb-1">
                Exchange Rate
              </label>
              <input
                type="number"
                step="0.0001"
                required
                value={rate}
                onChange={(e) => setRate(parseFloat(e.target.value) || 0)}
                className="w-full rounded-lg border border-[var(--nebula-border)] bg-[var(--nebula-surface-subtle)] px-3 py-2 text-sm font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-[var(--nebula-text-secondary)] mb-1">
                Source Provider
              </label>
              <select
                value={source}
                onChange={(e) => setSource(e.target.value as ExchangeRate["source"])}
                className="w-full rounded-lg border border-[var(--nebula-border)] bg-[var(--nebula-surface-subtle)] px-3 py-2 text-sm"
              >
                <option value="manual">Manual Entry</option>
                <option value="ecb">European Central Bank</option>
                <option value="fed">Federal Reserve</option>
                <option value="bloomberg">Bloomberg FX</option>
                <option value="custom">Custom Feed</option>
              </select>
            </div>
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
              Save Exchange Rate
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
