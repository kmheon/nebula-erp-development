import { useState } from "react";
import {
  BookOpen,
  FileText,
  Lock,
  Layers,
  RefreshCw,
  Plus,
} from "lucide-react";
import AccountForm from "../components/AccountForm";
import AccountTable from "../components/AccountTable";
import JournalEntryForm from "../components/JournalEntryForm";
import JournalEntryTable from "../components/JournalEntryTable";
import GeneralLedgerTable from "../components/GeneralLedgerTable";
import FiscalPeriodTable from "../components/FiscalPeriodTable";
import RevaluationForm from "../components/RevaluationForm";
import RevaluationTable from "../components/RevaluationTable";

import {
  AppPageHeader,
  AppTabs,
  AppStatCard,
  AppButton,
} from "../../../components/ui";

import { useAccounts } from "../hooks/useAccounts";
import {
  useJournalEntries,
  useJournalMutation,
} from "../hooks/useJournalEntries";
import { useGeneralLedger } from "../hooks/useGeneralLedger";
import { useFiscalPeriods } from "../hooks/useFiscalPeriods";
import { useRevaluations } from "../hooks/useRevaluation";

export default function AccountingPage() {
  const [activeTab, setActiveTab] = useState<string>("accounts");
  const [showAddAccount, setShowAddAccount] = useState(false);
  const [showAddJournal, setShowAddJournal] = useState(false);

  const { data: accounts = [] } = useAccounts();
  const { data: journalEntries = [] } = useJournalEntries();
  const { data: ledger = [] } = useGeneralLedger();
  const { data: fiscalPeriods = [] } = useFiscalPeriods();
  const { data: revaluations = [] } = useRevaluations();
  const { post } = useJournalMutation();

  const postedJournals = journalEntries.filter((j) => j.status === "posted").length;
  const draftJournals = journalEntries.filter((j) => j.status === "draft").length;
  const activePeriods = fiscalPeriods.filter((p) => p.status === "open").length;

  return (
    <div className="space-y-8">
      {/* Enterprise Page Header */}
      <AppPageHeader
        title="Enterprise Financial Accounting"
        subtitle="Double-entry chart of accounts, automated journal entries, fiscal period governance locks, multi-currency revaluations, and real-time general ledger."
        actions={
          <div className="flex items-center gap-3">
            <AppButton
              variant="outline"
              leftIcon={<Plus size={16} />}
              onClick={() => {
                setActiveTab("journal");
                setShowAddJournal(true);
              }}
            >
              New Journal Entry
            </AppButton>
            <AppButton
              variant="primary"
              leftIcon={<Plus size={16} />}
              onClick={() => {
                setActiveTab("accounts");
                setShowAddAccount(true);
              }}
            >
              Add GL Account
            </AppButton>
          </div>
        }
      />

      {/* High-level KPI summary cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <AppStatCard
          label="Chart of Accounts"
          value={accounts.length}
          subtext="Active General Ledger registers"
          icon={<Layers size={20} />}
          tone="primary"
        />

        <AppStatCard
          label="Posted Journals"
          value={postedJournals}
          subtext={`${draftJournals} draft pending review`}
          icon={<BookOpen size={20} />}
          tone="success"
        />

        <AppStatCard
          label="Fiscal Governance"
          value={`${activePeriods} Open`}
          subtext={`${fiscalPeriods.length} total fiscal periods`}
          icon={<Lock size={20} />}
          tone="info"
        />

        <AppStatCard
          label="Ledger Postings"
          value={ledger.length}
          subtext="Real-time synchronized entries"
          icon={<FileText size={20} />}
          tone="default"
        />
      </div>

      {/* Tab Navigation */}
      <AppTabs
        tabs={[
          { id: "accounts", name: "Chart of Accounts", icon: <Layers size={16} /> },
          { id: "journal", name: `Journal Entries (${draftJournals > 0 ? `${draftJournals} draft` : journalEntries.length})`, icon: <BookOpen size={16} /> },
          { id: "periods", name: "Fiscal Governance & Locks", icon: <Lock size={16} /> },
          { id: "revaluation", name: "FX Revaluation", icon: <RefreshCw size={16} /> },
          { id: "ledger", name: "General Ledger", icon: <FileText size={16} /> },
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
        variant="pill"
      />

      {/* Tab Content Panels */}
      {activeTab === "accounts" && (
        <div className="space-y-6">
          {showAddAccount && (
            <AccountForm
              accounts={accounts}
              onCancel={() => setShowAddAccount(false)}
            />
          )}
          <AccountTable accounts={accounts} />
        </div>
      )}

      {activeTab === "journal" && (
        <div className="space-y-6">
          {showAddJournal && (
            <JournalEntryForm accounts={accounts} />
          )}
          <JournalEntryTable
            entries={journalEntries}
            onPost={(id) => post.mutate(id)}
          />
        </div>
      )}

      {activeTab === "periods" && (
        <div className="space-y-6">
          <FiscalPeriodTable periods={fiscalPeriods} />
        </div>
      )}

      {activeTab === "revaluation" && (
        <div className="space-y-6">
          <RevaluationForm accounts={accounts} />
          <RevaluationTable revaluations={revaluations} />
        </div>
      )}

      {activeTab === "ledger" && (
        <div className="space-y-6">
          <GeneralLedgerTable entries={ledger} />
        </div>
      )}
    </div>
  );
}
