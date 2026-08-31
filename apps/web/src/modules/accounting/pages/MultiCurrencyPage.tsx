import { useState } from "react";
import { Plus, Globe, TrendingUp, RefreshCw, Layers, ShieldCheck } from "lucide-react";
import { useCurrencies, useExchangeRates, useCurrencySettings, useCurrencyMutations } from "../hooks/useCurrency";
import CurrencyForm from "../components/CurrencyForm";
import ExchangeRateForm from "../components/ExchangeRateForm";

export default function MultiCurrencyPage() {
  const { data: currencies = [] } = useCurrencies();
  const { data: rates = [] } = useExchangeRates();
  const settings = useCurrencySettings().data;
  const { addCurrency, addExchangeRate, convert } = useCurrencyMutations();

  const [isCurrencyModalOpen, setIsCurrencyModalOpen] = useState(false);
  const [isRateModalOpen, setIsRateModalOpen] = useState(false);

  // Conversion calculator state
  const [calcAmount, setCalcAmount] = useState<number>(1000);
  const [calcFrom, setCalcFrom] = useState("EUR");
  const [calcTo, setCalcTo] = useState("USD");

  const conversionResult = convert(calcAmount, calcFrom, calcTo);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--nebula-text-primary)]">
            Enterprise Multi-Currency Engine
          </h1>
          <p className="mt-1 text-sm text-[var(--nebula-text-secondary)]">
            Manage global currencies, historical exchange rates, daily market feeds, unrealized revaluations, and FX gain/loss settlements.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsRateModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg border border-[var(--nebula-border)] bg-[var(--nebula-surface)] px-4 py-2 text-sm font-medium shadow-sm hover:bg-[var(--nebula-surface-muted)] transition-colors"
          >
            <TrendingUp size={16} />
            Add Exchange Rate
          </button>
          <button
            onClick={() => setIsCurrencyModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-[var(--nebula-primary)] px-4 py-2 text-sm font-medium text-white shadow-sm hover:opacity-90 transition-opacity"
          >
            <Plus size={16} />
            Add Currency
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-[var(--nebula-border)] bg-[var(--nebula-surface)] p-6 shadow-sm">
          <div className="flex items-center justify-between text-[var(--nebula-text-secondary)]">
            <span className="text-xs font-semibold uppercase">Base Currency</span>
            <Globe size={20} className="text-[var(--nebula-primary)]" />
          </div>
          <div className="mt-2 text-3xl font-bold font-mono">
            {settings?.baseCurrency || "USD"}
          </div>
          <p className="mt-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
            ✓ Enterprise Functional Currency
          </p>
        </div>

        <div className="rounded-xl border border-[var(--nebula-border)] bg-[var(--nebula-surface)] p-6 shadow-sm">
          <div className="flex items-center justify-between text-[var(--nebula-text-secondary)]">
            <span className="text-xs font-semibold uppercase">Active Currencies</span>
            <Layers size={20} className="text-[var(--nebula-primary)]" />
          </div>
          <div className="mt-2 text-3xl font-bold font-mono">
            {currencies.filter(c => c.isActive).length}
          </div>
          <p className="mt-1 text-xs text-[var(--nebula-text-secondary)]">
            Global ISO 4217 registers
          </p>
        </div>

        <div className="rounded-xl border border-[var(--nebula-border)] bg-[var(--nebula-surface)] p-6 shadow-sm">
          <div className="flex items-center justify-between text-[var(--nebula-text-secondary)]">
            <span className="text-xs font-semibold uppercase">Exchange Rate Feeds</span>
            <RefreshCw size={20} className="text-[var(--nebula-primary)]" />
          </div>
          <div className="mt-2 text-3xl font-bold font-mono">
            {rates.length}
          </div>
          <p className="mt-1 text-xs text-[var(--nebula-text-secondary)]">
            {settings?.defaultRateProvider}
          </p>
        </div>

        <div className="rounded-xl border border-[var(--nebula-border)] bg-[var(--nebula-surface)] p-6 shadow-sm">
          <div className="flex items-center justify-between text-[var(--nebula-text-secondary)]">
            <span className="text-xs font-semibold uppercase">Engine Status</span>
            <ShieldCheck size={20} className="text-emerald-600" />
          </div>
          <div className="mt-2 text-3xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
            Active
          </div>
          <p className="mt-1 text-xs text-[var(--nebula-text-secondary)]">
            Pure service conversion verified
          </p>
        </div>
      </div>

      {/* Live Conversion Sandbox */}
      <div className="rounded-xl border border-[var(--nebula-border)] bg-[var(--nebula-surface)] p-6 shadow-sm">
        <h2 className="text-lg font-bold mb-4">Multi-Currency Pure Conversion Engine Sandbox</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-xs font-semibold uppercase text-[var(--nebula-text-secondary)] mb-1">
              Amount
            </label>
            <input
              type="number"
              value={calcAmount}
              onChange={(e) => setCalcAmount(parseFloat(e.target.value) || 0)}
              className="w-full rounded-lg border border-[var(--nebula-border)] bg-[var(--nebula-surface-subtle)] px-3 py-2 text-sm font-mono"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase text-[var(--nebula-text-secondary)] mb-1">
              From Currency
            </label>
            <select
              value={calcFrom}
              onChange={(e) => setCalcFrom(e.target.value)}
              className="w-full rounded-lg border border-[var(--nebula-border)] bg-[var(--nebula-surface-subtle)] px-3 py-2 text-sm"
            >
              {currencies.map((c) => (
                <option key={c.code} value={c.code}>{c.code} ({c.name})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase text-[var(--nebula-text-secondary)] mb-1">
              To Currency
            </label>
            <select
              value={calcTo}
              onChange={(e) => setCalcTo(e.target.value)}
              className="w-full rounded-lg border border-[var(--nebula-border)] bg-[var(--nebula-surface-subtle)] px-3 py-2 text-sm"
            >
              {currencies.map((c) => (
                <option key={c.code} value={c.code}>{c.code} ({c.name})</option>
              ))}
            </select>
          </div>
          <div className="rounded-lg bg-[var(--nebula-surface-subtle)] p-3 border border-[var(--nebula-border)]">
            <span className="block text-xs font-semibold uppercase text-[var(--nebula-text-secondary)]">Converted Total</span>
            <span className="text-lg font-bold font-mono text-[var(--nebula-primary)]">
              {conversionResult.convertedAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })} {calcTo}
            </span>
            <span className="block text-[10px] text-[var(--nebula-text-secondary)] mt-0.5">
              Rate: {conversionResult.exchangeRate.toFixed(4)}
            </span>
          </div>
        </div>
      </div>

      {/* Currency Registry Table */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold">Supported Currencies (ISO 4217)</h2>
        <div className="overflow-x-auto rounded-xl border border-[var(--nebula-border)] bg-[var(--nebula-surface)] shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-[var(--nebula-surface-muted)] text-xs font-semibold uppercase text-[var(--nebula-text-secondary)]">
              <tr>
                <th className="px-4 py-3">Code</th>
                <th className="px-4 py-3">Currency Name</th>
                <th className="px-4 py-3">Symbol</th>
                <th className="px-4 py-3">Precision</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-center">Base / Reporting</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--nebula-border)]">
              {currencies.map((c) => (
                <tr key={c.code} className="hover:bg-[var(--nebula-surface-muted)]/50 transition-colors">
                  <td className="px-4 py-3 font-mono font-bold text-[var(--nebula-text-primary)]">{c.code}</td>
                  <td className="px-4 py-3 font-medium">{c.name}</td>
                  <td className="px-4 py-3 font-mono">{c.symbol}</td>
                  <td className="px-4 py-3 font-mono">{c.decimalPrecision} decimals</td>
                  <td className="px-4 py-3 text-center">
                    <span className="inline-flex rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                      Active
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {c.isBaseCurrency && (
                      <span className="inline-flex rounded-md bg-[var(--nebula-primary)]/10 px-2 py-0.5 text-xs font-semibold text-[var(--nebula-primary)]">
                        Base Currency
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Exchange Rates Table */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold">Active Exchange Rates</h2>
        <div className="overflow-x-auto rounded-xl border border-[var(--nebula-border)] bg-[var(--nebula-surface)] shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-[var(--nebula-surface-muted)] text-xs font-semibold uppercase text-[var(--nebula-text-secondary)]">
              <tr>
                <th className="px-4 py-3">Pair</th>
                <th className="px-4 py-3 text-right">Mid Rate</th>
                <th className="px-4 py-3 text-right">Buy Rate</th>
                <th className="px-4 py-3 text-right">Sell Rate</th>
                <th className="px-4 py-3">Source Feed</th>
                <th className="px-4 py-3 text-right">Effective Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--nebula-border)]">
              {rates.map((r) => (
                <tr key={r.id} className="hover:bg-[var(--nebula-surface-muted)]/50 transition-colors">
                  <td className="px-4 py-3 font-mono font-bold">{r.fromCurrency} / {r.toCurrency}</td>
                  <td className="px-4 py-3 text-right font-mono font-semibold">{r.rate.toFixed(4)}</td>
                  <td className="px-4 py-3 text-right font-mono text-[var(--nebula-text-secondary)]">{r.buyRate?.toFixed(4) || "—"}</td>
                  <td className="px-4 py-3 text-right font-mono text-[var(--nebula-text-secondary)]">{r.sellRate?.toFixed(4) || "—"}</td>
                  <td className="px-4 py-3 uppercase text-xs font-semibold">{r.source}</td>
                  <td className="px-4 py-3 text-right text-[var(--nebula-text-secondary)]">{r.effectiveDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <CurrencyForm
        isOpen={isCurrencyModalOpen}
        onClose={() => setIsCurrencyModalOpen(false)}
        onSubmit={(c) => addCurrency.mutate(c)}
      />

      <ExchangeRateForm
        isOpen={isRateModalOpen}
        onClose={() => setIsRateModalOpen(false)}
        currencies={currencies}
        onSubmit={(r) => addExchangeRate.mutate(r)}
      />
    </div>
  );
}
