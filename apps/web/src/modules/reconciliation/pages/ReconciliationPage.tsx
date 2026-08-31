import { useState } from "react";
import ReconciliationDashboard from "../components/ReconciliationDashboard";
import MatchingWorkspace from "../components/MatchingWorkspace";
import StatementImportPreview from "../components/StatementImportPreview";
import ExceptionReview from "../components/ExceptionReview";
import ReconciliationReports from "../components/ReconciliationReports";

import { useAccounts } from "../../accounting/hooks/useAccounts";
import { useJournalEntries } from "../../accounting/hooks/useJournalEntries";
import { usePayments } from "../../payments/hooks/usePayments";
import { useSettlements } from "../../payments/channels/hooks/usePaymentAccounts";
import {
  useBankTransactions,
  useMatches,
  useReconciliationRulesQuery,
  useReconciliationExceptionsQuery,
  useReconciliationAuditQuery,
  useReconciliationMutations,
} from "../hooks/useReconciliation";

export default function ReconciliationPage() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "workspace" | "import" | "exceptions" | "reports">("dashboard");

  const { data: accounts = [] } = useAccounts();
  const { data: journalEntries = [] } = useJournalEntries();
  const { data: payments = [] } = usePayments();
  const { data: settlements = [] } = useSettlements();
  const { data: transactions = [] } = useBankTransactions();
  const { data: matches = [] } = useMatches();
  const { data: rules = [] } = useReconciliationRulesQuery();
  const { data: exceptions = [] } = useReconciliationExceptionsQuery();
  const { data: auditLogs = [] } = useReconciliationAuditQuery();

  const { addBankTransaction, createReconciliationMatch } = useReconciliationMutations();

  function handleMatch(bankTransactionId: string, journalEntryId: string, matchedAmount: number) {
    createReconciliationMatch.mutate({
      bankTransactionId,
      journalEntryId,
      matchedAmount,
      status: "matched",
    });
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--nebula-text-primary)]">
            Enterprise Payment Reconciliation Engine
          </h1>
          <p className="mt-1 text-sm text-[var(--nebula-text-secondary)]">
            Automated statement matching, multi-currency FX revaluation, tolerance rules, exception review, and settlement integration.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab("import")}
            className="inline-flex items-center gap-2 rounded-lg bg-[var(--nebula-primary)] px-4 py-2 text-sm font-medium text-white shadow-sm hover:opacity-90 transition-opacity"
          >
            Import Statement
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[var(--nebula-border)] pb-3">
        {[
          { id: "dashboard", name: "Dashboard Overview" },
          { id: "workspace", name: "Matching Workspace" },
          { id: "import", name: "Statement Import" },
          { id: "exceptions", name: "Exception Review" },
          { id: "reports", name: "Audit & Reports" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? "bg-[var(--nebula-primary)] text-white shadow-sm"
                : "bg-[var(--nebula-surface)] border border-[var(--nebula-border)] hover:bg-[var(--nebula-surface-muted)]"
            }`}
          >
            {tab.name}
          </button>
        ))}
      </div>

      {/* Active Tab Content */}
      {activeTab === "dashboard" && (
        <ReconciliationDashboard
          transactions={transactions}
          matches={matches}
          exceptions={exceptions}
          onNavigateTab={(tab) => setActiveTab(tab as any)}
        />
      )}

      {activeTab === "workspace" && (
        <MatchingWorkspace
          transactions={transactions}
          journalEntries={journalEntries}
          payments={payments}
          settlements={settlements}
          rules={rules}
          onMatch={handleMatch}
        />
      )}

      {activeTab === "import" && (
        <StatementImportPreview
          accountId={accounts[0]?.id || "acc-main"}
          onImport={(input) => addBankTransaction.mutate(input)}
        />
      )}

      {activeTab === "exceptions" && (
        <ExceptionReview exceptions={exceptions} />
      )}

      {activeTab === "reports" && (
        <ReconciliationReports
          transactions={transactions}
          matches={matches}
          exceptions={exceptions}
          auditLogs={auditLogs}
        />
      )}
    </div>
  );
}
