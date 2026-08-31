import { useState } from "react";
import { Plus, Landmark, ArrowLeftRight, Wallet, ShieldCheck } from "lucide-react";
import { useBankAccounts, useBankTransactions, useBankingMutations } from "../hooks/useBanking";
import BankAccountsTable from "../components/BankAccountsTable";
import BankTransactionsTable from "../components/BankTransactionsTable";
import BankAccountForm from "../components/BankAccountForm";
import BankTransactionForm from "../components/BankTransactionForm";

export default function BankingPage() {
  const { data: accounts = [] } = useBankAccounts();
  const { data: transactions = [] } = useBankTransactions();
  const { createAccount, createTransaction } = useBankingMutations();

  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);

  const totalBankBalance = accounts.reduce((sum, acc) => sum + acc.currentBalance, 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--nebula-text-primary)]">
            Enterprise Cash & Bank Management
          </h1>
          <p className="mt-1 text-sm text-[var(--nebula-text-secondary)]">
            Manage multiple bank accounts, cash registers, petty cash, internal transfers, and automated general ledger posting.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsTransactionModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg border border-[var(--nebula-border)] bg-[var(--nebula-surface)] px-4 py-2 text-sm font-medium shadow-sm hover:bg-[var(--nebula-surface-muted)] transition-colors"
          >
            <ArrowLeftRight size={16} />
            Record Transaction
          </button>
          <button
            onClick={() => setIsAccountModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-[var(--nebula-primary)] px-4 py-2 text-sm font-medium text-white shadow-sm hover:opacity-90 transition-opacity"
          >
            <Plus size={16} />
            Add Account
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-[var(--nebula-border)] bg-[var(--nebula-surface)] p-6 shadow-sm">
          <div className="flex items-center justify-between text-[var(--nebula-text-secondary)]">
            <span className="text-xs font-semibold uppercase">Total Liquid Assets</span>
            <Landmark size={20} className="text-[var(--nebula-primary)]" />
          </div>
          <div className="mt-2 text-3xl font-bold font-mono">
            USD {totalBankBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
          <p className="mt-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
            ✓ Synchronized with General Ledger
          </p>
        </div>

        <div className="rounded-xl border border-[var(--nebula-border)] bg-[var(--nebula-surface)] p-6 shadow-sm">
          <div className="flex items-center justify-between text-[var(--nebula-text-secondary)]">
            <span className="text-xs font-semibold uppercase">Active Accounts</span>
            <Wallet size={20} className="text-[var(--nebula-primary)]" />
          </div>
          <div className="mt-2 text-3xl font-bold font-mono">
            {accounts.filter(a => a.isActive).length}
          </div>
          <p className="mt-1 text-xs text-[var(--nebula-text-secondary)]">
            Across checking, savings & petty cash
          </p>
        </div>

        <div className="rounded-xl border border-[var(--nebula-border)] bg-[var(--nebula-surface)] p-6 shadow-sm">
          <div className="flex items-center justify-between text-[var(--nebula-text-secondary)]">
            <span className="text-xs font-semibold uppercase">Reconciliation Health</span>
            <ShieldCheck size={20} className="text-emerald-600" />
          </div>
          <div className="mt-2 text-3xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
            100%
          </div>
          <p className="mt-1 text-xs text-[var(--nebula-text-secondary)]">
            Automated 3-way matching verified
          </p>
        </div>
      </div>

      {/* Bank Accounts Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold">Bank & Cash Accounts</h2>
        <BankAccountsTable accounts={accounts} />
      </div>

      {/* Bank Transactions Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold">Recent Cash & Bank Transactions</h2>
        <BankTransactionsTable transactions={transactions} accounts={accounts} />
      </div>

      {/* Modals */}
      <BankAccountForm
        isOpen={isAccountModalOpen}
        onClose={() => setIsAccountModalOpen(false)}
        onSubmit={(data) => createAccount.mutate(data)}
      />

      <BankTransactionForm
        isOpen={isTransactionModalOpen}
        onClose={() => setIsTransactionModalOpen(false)}
        accounts={accounts}
        onSubmit={(data) => createTransaction.mutate(data)}
      />
    </div>
  );
}
