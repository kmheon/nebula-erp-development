import { useState } from "react";
import { Check, Sliders } from "lucide-react";
import type { BankTransaction, ReconciliationRule } from "../types/reconciliation.types";
import { findPossibleMatchesForTransaction } from "../services/matching.service";
import type { PossibleMatch } from "../services/matching.service";
import type { JournalEntry } from "../../accounting/types/accounting.types";
import type { Payment } from "../../payments/types/payment.types";
import type { Settlement } from "../../payments/channels/types/channel.types";

interface MatchingWorkspaceProps {
  transactions: BankTransaction[];
  journalEntries: JournalEntry[];
  payments: Payment[];
  settlements: Settlement[];
  rules: ReconciliationRule[];
  onMatch: (bankTransactionId: string, sourceId: string, amount: number) => void;
}

export default function MatchingWorkspace({
  transactions,
  journalEntries,
  payments,
  settlements,
  rules,
  onMatch,
}: MatchingWorkspaceProps) {
  const [selectedTxId, setSelectedTxId] = useState<string>(transactions[0]?.id || "");
  const [selectedRuleId, setSelectedRuleId] = useState<string>(rules[0]?.id || "rule-1");

  const activeTx = transactions.find((t) => t.id === selectedTxId) || transactions[0];
  const activeRule = rules.find((r) => r.id === selectedRuleId) || rules[0];

  const possibleMatches: PossibleMatch[] = activeTx
    ? findPossibleMatchesForTransaction(activeTx, { journalEntries, payments, settlements }, activeRule)
    : [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left: Transaction Queue */}
      <div className="rounded-xl border border-[var(--nebula-border)] bg-[var(--nebula-surface)] p-4 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-bold">Bank Statement Queue</h2>
          <span className="rounded-full bg-[var(--nebula-surface-muted)] px-2.5 py-0.5 text-xs font-semibold">
            {transactions.filter(t => t.status === "unmatched").length} Unmatched
          </span>
        </div>

        <div className="space-y-2 max-h-[600px] overflow-y-auto">
          {transactions.map((tx) => {
            const isSelected = tx.id === activeTx?.id;
            return (
              <div
                key={tx.id}
                onClick={() => setSelectedTxId(tx.id)}
                className={`p-3 rounded-lg border cursor-pointer transition-all ${
                  isSelected
                    ? "border-[var(--nebula-primary)] bg-[var(--nebula-primary)]/5"
                    : "border-[var(--nebula-border)] hover:bg-[var(--nebula-surface-muted)]"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-xs text-[var(--nebula-text-secondary)]">{tx.date}</span>
                  <span className={`text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full ${
                    tx.status === "matched" ? "bg-emerald-500/10 text-emerald-600" : "bg-amber-500/10 text-amber-600"
                  }`}>
                    {tx.status}
                  </span>
                </div>
                <p className="text-sm font-semibold truncate">{tx.description}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="font-mono text-xs text-[var(--nebula-text-secondary)]">{tx.reference || "No Ref"}</span>
                  <span className="font-mono font-bold text-sm">${tx.amount.toFixed(2)}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right: Matching Workspace Detail & Candidates */}
      <div className="lg:col-span-2 space-y-6">
        {activeTx ? (
          <div className="rounded-xl border border-[var(--nebula-border)] bg-[var(--nebula-surface)] p-6 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-[var(--nebula-border)]">
              <div>
                <span className="text-xs font-semibold uppercase text-[var(--nebula-text-secondary)]">Active Selection</span>
                <h3 className="text-lg font-bold">{activeTx.description}</h3>
                <p className="text-xs font-mono text-[var(--nebula-text-secondary)] mt-0.5">
                  Ref: {activeTx.reference || "—"} | Date: {activeTx.date}
                </p>
              </div>
              <div className="mt-2 sm:mt-0 text-right">
                <span className="text-2xl font-bold font-mono text-[var(--nebula-primary)]">
                  ${activeTx.amount.toFixed(2)}
                </span>
                <span className="block text-xs uppercase font-semibold text-[var(--nebula-text-secondary)]">
                  {activeTx.type} ({activeTx.currency})
                </span>
              </div>
            </div>

            {/* Rule Selector */}
            <div className="flex items-center justify-between bg-[var(--nebula-surface-subtle)] p-3 rounded-lg border border-[var(--nebula-border)]">
              <div className="flex items-center gap-2">
                <Sliders size={18} className="text-[var(--nebula-primary)]" />
                <span className="text-xs font-semibold uppercase text-[var(--nebula-text-secondary)]">Matching Rule:</span>
              </div>
              <select
                value={selectedRuleId}
                onChange={(e) => setSelectedRuleId(e.target.value)}
                className="rounded-lg border border-[var(--nebula-border)] bg-[var(--nebula-surface)] px-3 py-1 text-sm font-medium"
              >
                {rules.map((r) => (
                  <option key={r.id} value={r.id}>{r.name} ({r.amountTolerancePercent}% tol)</option>
                ))}
              </select>
            </div>

            {/* Candidate Matches */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold uppercase tracking-wider text-[var(--nebula-text-secondary)]">
                Recommended Accounting Candidates ({possibleMatches.length})
              </h4>

              {possibleMatches.length > 0 ? (
                <div className="space-y-3">
                  {possibleMatches.map((match, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-4 rounded-xl border border-[var(--nebula-border)] bg-[var(--nebula-surface-subtle)] hover:border-[var(--nebula-primary)]/50 transition-colors"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="rounded-md bg-[var(--nebula-primary)]/10 px-2 py-0.5 text-xs font-semibold uppercase text-[var(--nebula-primary)]">
                            {match.sourceType.replace("_", " ")}
                          </span>
                          <span className="font-mono text-xs text-[var(--nebula-text-secondary)]">
                            Score: {Math.round(match.score * 100)}% Match
                          </span>
                        </div>
                        <p className="font-medium text-sm">{match.description}</p>
                        <p className="text-xs text-[var(--nebula-text-secondary)] font-mono">
                          Ref: {match.reference} | Date: {match.date}
                        </p>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <span className="font-mono font-bold text-base">${match.amount.toFixed(2)}</span>
                          {match.fxDifference !== 0 && match.fxDifference !== undefined && (
                            <span className="block text-[10px] text-amber-600 font-medium">
                              FX Diff: ${match.fxDifference.toFixed(2)}
                            </span>
                          )}
                        </div>
                        {activeTx.status === "unmatched" && (
                          <button
                            onClick={() => onMatch(activeTx.id, match.sourceId, match.amount)}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--nebula-primary)] px-3 py-2 text-xs font-medium text-white shadow-sm hover:opacity-90"
                          >
                            <Check size={14} />
                            Match
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-[var(--nebula-border)] p-8 text-center text-sm text-[var(--nebula-text-secondary)]">
                  No automated candidate matches found within current tolerance rules. Try adjusting the rule tolerance or creating a manual journal match.
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-[var(--nebula-border)] bg-[var(--nebula-surface)] p-12 text-center text-[var(--nebula-text-secondary)]">
            Select a bank statement line from the queue to inspect matching candidates.
          </div>
        )}
      </div>
    </div>
  );
}
