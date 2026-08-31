/**
 * Multi-Currency Revaluation Form Component.
 * 
 * ARCHITECTURAL RATIONALE:
 * Enables simulation and recording of foreign currency revaluation documents, unrealized FX gains/losses,
 * and proposed journal entries without automatically mutating ledgers or posting journals.
 */

import { useState } from "react";
import { useRevaluationMutation, useRevaluationSimulation } from "../hooks/useRevaluation";
import type { Account } from "../types/accounting.types";
import type { CurrencyBalance, ExchangeRateType, RevaluationDocument } from "../types/revaluation.types";

type RevaluationFormProps = {
  accounts: Account[];
};

export default function RevaluationForm({ accounts }: RevaluationFormProps) {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [rateType, setRateType] = useState<ExchangeRateType>("closing");
  const [baseCurrency] = useState("USD");

  // Sample default foreign balances
  const [balances, setBalances] = useState<CurrencyBalance[]>([
    {
      id: "bal-1",
      accountId: accounts[0]?.id || "acc-1",
      accountCode: accounts[0]?.code || "1020",
      accountName: accounts[0]?.name || "Euro Bank Account",
      currency: "EUR",
      foreignAmount: 25000,
      historicalRate: 1.08,
    },
    {
      id: "bal-2",
      accountId: accounts[1]?.id || "acc-2",
      accountCode: accounts[1]?.code || "1030",
      accountName: accounts[1]?.name || "GBP Clearing Account",
      currency: "GBP",
      foreignAmount: 15000,
      historicalRate: 1.25,
    },
  ]);

  const [currentRates, setCurrentRates] = useState<Record<string, number>>({
    EUR: 1.12,
    GBP: 1.22,
    JPY: 0.0068,
    CAD: 0.74,
  });

  const [simulationResult, setSimulationResult] = useState<RevaluationDocument | null>(null);

  const { create } = useRevaluationMutation();
  const simulate = useRevaluationSimulation();

  const handleRateChange = (currency: string, rate: number) => {
    setCurrentRates({
      ...currentRates,
      [currency]: rate,
    });
  };

  const handleSimulate = async () => {
    try {
      const result = await simulate.mutateAsync({
        date,
        rateType,
        balances,
        currentRates,
        policy: {
          baseCurrency,
          reportingCurrency: baseCurrency,
          rateType,
          precision: 2,
          unrealizedGainAccountId: accounts.find((a) => a.type === "income")?.id || "acc-gain",
          unrealizedLossAccountId: accounts.find((a) => a.type === "expense")?.id || "acc-loss",
        },
      });
      setSimulationResult(result);
    } catch (err: any) {
      alert(`Simulation failed: ${err.message}`);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!simulationResult) {
      alert("Please simulate revaluation first.");
      return;
    }

    try {
      await create.mutateAsync({
        date,
        rateType,
        balances,
        currentRates,
        policy: {
          baseCurrency,
          reportingCurrency: baseCurrency,
          rateType,
          precision: 2,
          unrealizedGainAccountId: accounts.find((a) => a.type === "income")?.id || "acc-gain",
          unrealizedLossAccountId: accounts.find((a) => a.type === "expense")?.id || "acc-loss",
        },
      });
      setSimulationResult(null);
      alert("Revaluation document and journal proposal recorded successfully!");
    } catch (err: any) {
      alert(`Failed to record revaluation: ${err.message}`);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSave} className="surface p-6 space-y-6">
        <h3 className="text-lg font-bold">Multi-Currency Revaluation Engine</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-muted-foreground mb-1">
              Revaluation Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-md text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-muted-foreground mb-1">
              Exchange Rate Type
            </label>
            <select
              value={rateType}
              onChange={(e) => setRateType(e.target.value as ExchangeRateType)}
              className="w-full px-3 py-2 border rounded-md text-sm bg-background"
            >
              <option value="closing">Closing Rate (Period End)</option>
              <option value="spot">Spot Rate</option>
              <option value="average">Average Rate</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-muted-foreground mb-1">
              Base Currency
            </label>
            <input
              type="text"
              value={baseCurrency}
              disabled
              className="w-full px-3 py-2 border rounded-md text-sm bg-muted text-muted-foreground"
            />
          </div>
        </div>

        {/* Current Exchange Rates Configuration */}
        <div className="border-t pt-4 space-y-3">
          <h4 className="font-semibold text-sm">Current Market Exchange Rates (vs {baseCurrency})</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Object.entries(currentRates).map(([currency, rate]) => (
              <div key={currency} className="p-3 border rounded-md bg-muted/10 space-y-1">
                <label className="block text-xs font-semibold text-muted-foreground">{currency} Rate</label>
                <input
                  type="number"
                  step="0.0001"
                  value={rate}
                  onChange={(e) => handleRateChange(currency, parseFloat(e.target.value) || 0)}
                  className="w-full px-2 py-1 border rounded text-sm font-bold"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Foreign Currency Balances */}
        <div className="border-t pt-4 space-y-3">
          <h4 className="font-semibold text-sm">Foreign Currency Accounts & Balances</h4>
          <div className="space-y-2">
            {balances.map((bal, idx) => (
              <div key={bal.id} className="grid grid-cols-1 md:grid-cols-5 gap-3 p-3 border rounded-md bg-muted/20 items-center text-sm">
                <div>
                  <span className="font-mono text-xs text-muted-foreground">{bal.accountCode}</span>
                  <div className="font-medium">{bal.accountName}</div>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block">Currency</span>
                  <span className="font-bold">{bal.currency}</span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block">Foreign Amount</span>
                  <input
                    type="number"
                    value={bal.foreignAmount}
                    onChange={(e) => {
                      const updated = [...balances];
                      updated[idx].foreignAmount = parseFloat(e.target.value) || 0;
                      setBalances(updated);
                    }}
                    className="w-full px-2 py-1 border rounded text-sm"
                  />
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block">Historical Rate</span>
                  <input
                    type="number"
                    step="0.0001"
                    value={bal.historicalRate}
                    onChange={(e) => {
                      const updated = [...balances];
                      updated[idx].historicalRate = parseFloat(e.target.value) || 0;
                      setBalances(updated);
                    }}
                    className="w-full px-2 py-1 border rounded text-sm"
                  />
                </div>
                <div className="text-right">
                  <span className="text-xs text-muted-foreground block">Historical Base ($)</span>
                  <span className="font-semibold">${(bal.foreignAmount * bal.historicalRate).toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t">
          <button
            type="button"
            onClick={handleSimulate}
            className="px-4 py-2 bg-muted text-foreground border rounded-md text-sm font-medium hover:bg-muted/80 transition-colors"
          >
            Calculate Revaluation Preview
          </button>

          <button
            type="submit"
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            Record Revaluation & Journal Proposal
          </button>
        </div>
      </form>

      {/* Simulation Result / Proposal Preview */}
      {simulationResult && (
        <div className="surface p-6 space-y-6 border border-primary/30 bg-primary/5 rounded-lg">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold">Revaluation Simulation Results</h3>
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold bg-green-100 text-green-800 px-3 py-1 rounded-full uppercase">
                Total Gain: +${simulationResult.totalGain.toFixed(2)}
              </span>
              <span className="text-xs font-semibold bg-red-100 text-red-800 px-3 py-1 rounded-full uppercase">
                Total Loss: -${simulationResult.totalLoss.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="overflow-hidden border rounded-md">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/40 text-xs font-semibold text-muted-foreground uppercase">
                  <th className="p-3 text-left">Account</th>
                  <th className="p-3 text-right">Foreign Amt</th>
                  <th className="p-3 text-right">Hist. Rate</th>
                  <th className="p-3 text-right">Curr. Rate</th>
                  <th className="p-3 text-right">Hist. Base ($)</th>
                  <th className="p-3 text-right">Revalued ($)</th>
                  <th className="p-3 text-right">Unrealized Gain/Loss</th>
                </tr>
              </thead>
              <tbody>
                {simulationResult.lines.map((line) => (
                  <tr key={line.accountId} className="border-b">
                    <td className="p-3 font-medium">{line.accountName} ({line.currency})</td>
                    <td className="p-3 text-right">{line.foreignAmount.toLocaleString()}</td>
                    <td className="p-3 text-right">{line.historicalRate}</td>
                    <td className="p-3 text-right">{line.currentRate}</td>
                    <td className="p-3 text-right">${line.historicalBaseValue.toFixed(2)}</td>
                    <td className="p-3 text-right">${line.revaluedBaseValue.toFixed(2)}</td>
                    <td className={`p-3 text-right font-bold ${line.unrealizedGainLoss >= 0 ? "text-green-700" : "text-red-600"}`}>
                      {line.unrealizedGainLoss >= 0 ? `+${line.unrealizedGainLoss.toFixed(2)}` : line.unrealizedGainLoss.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Suggested Journal Proposal */}
          <div className="space-y-3 pt-2">
            <h4 className="font-semibold text-sm">Suggested Accounting Journal Entry Proposal (Proposal Only)</h4>
            <div className="p-4 bg-background border rounded-md space-y-2 text-sm">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Ref: {simulationResult.journalProposal.reference}</span>
                <span>Date: {simulationResult.journalProposal.date}</span>
              </div>
              <p className="font-medium text-xs">{simulationResult.journalProposal.description}</p>
              
              <div className="border-t pt-2 space-y-1">
                {simulationResult.journalProposal.lines.map((jl, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs py-1 border-b border-muted/30">
                    <span className="truncate max-w-md">{jl.description}</span>
                    <div className="flex gap-6 font-mono">
                      <span>Debit: ${jl.debit.toFixed(2)}</span>
                      <span>Credit: ${jl.credit.toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
