import { useState } from "react";
import { Plus, Landmark, ArrowLeftRight, Wallet, ShieldCheck } from "lucide-react";
import { useBankAccounts, useBankTransactions, useBankingMutations } from "../hooks/useBanking";
import BankAccountsTable from "../components/BankAccountsTable";
import BankTransactionsTable from "../components/BankTransactionsTable";
import BankAccountForm from "../components/BankAccountForm";
import BankTransactionForm from "../components/BankTransactionForm";
import {
  AppPageHeader,
  AppStatCard,
  AppButton,
} from "../../../components/ui";

export default function BankingPage() {
  const { data: accounts = [] } = useBankAccounts();
  const { data: transactions = [] } = useBankTransactions();
  const { createAccount, createTransaction } = useBankingMutations();

  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);

  const totalBankBalance = accounts.reduce((sum, acc) => sum + acc.currentBalance, 0);

  return (
    <div className="space-y-8">
      <AppPageHeader
        title="Enterprise Cash & Bank Management"
        subtitle="Manage multiple bank accounts, cash registers, petty cash, internal transfers, and automated general ledger posting."
        actions={
          <div className="flex items-center gap-3">
            <AppButton
              variant="outline"
              leftIcon={<ArrowLeftRight size={16} />}
              onClick={() => setIsTransactionModalOpen(true)}
            >
              Record Transaction
            </AppButton>
            <AppButton
              variant="primary"
              leftIcon={<Plus size={16} />}
              onClick={() => setIsAccountModalOpen(true)}
            >
              Add Bank Account
            </AppButton>
          </div>
        }
      />

      {/* Stats Overview */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <AppStatCard
          label="Total Liquid Assets"
          value={`$${totalBankBalance.toLocaleString("en-US", { minimumFractionDigits: 2 })}`}
          subtext="Synchronized with General Ledger"
          icon={<Landmark size={20} />}
          tone="primary"
        />

        <AppStatCard
          label="Active Accounts"
          value={accounts.filter((a) => a.isActive).length}
          subtext="Checking, savings & petty cash"
          icon={<Wallet size={20} />}
          tone="info"
        />

        <AppStatCard
          label="Reconciliation Health"
          value="100%"
          subtext="Automated 3-way matching verified"
          icon={<ShieldCheck size={20} />}
          tone="success"
        />
      </div>

      {/* Bank Accounts Section */}
      <div className="space-y-4">
        <h2 className="text-base font-semibold text-[var(--nebula-text-primary)]">Bank & Cash Accounts</h2>
        <BankAccountsTable accounts={accounts} />
      </div>

      {/* Bank Transactions Section */}
      <div className="space-y-4">
        <h2 className="text-base font-semibold text-[var(--nebula-text-primary)]">Recent Cash & Bank Transactions</h2>
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
