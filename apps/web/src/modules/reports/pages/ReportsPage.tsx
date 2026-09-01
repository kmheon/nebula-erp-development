import { useState } from "react";
import { BarChart3, TrendingUp, DollarSign, Activity } from "lucide-react";
import {
  useBalanceSheet,
  useCashFlow,
  useFinancialSummary,
  useProfitLoss,
} from "../hooks/useReports";

import ReportFilter from "../components/ReportFilter";
import FinancialSummaryCards from "../components/FinancialSummaryCards";
import ProfitLossTable from "../components/ProfitLossTable";
import BalanceSheetTable from "../components/BalanceSheetTable";
import CashFlowTable from "../components/CashFlowTable";
import {
  AppPageHeader,
  AppTabs,
} from "../../../components/ui";

import type { ReportPeriod } from "../types/report.types";

function defaultPeriod(): ReportPeriod {
  const end = new Date();

  const start = new Date();
  start.setMonth(start.getMonth() - 1);

  return {
    startDate: start.toISOString().slice(0, 10),
    endDate: end.toISOString().slice(0, 10),
    type: "custom",
  };
}

export default function ReportsPage() {
  const [period, setPeriod] = useState<ReportPeriod>(defaultPeriod());
  const [activeTab, setActiveTab] = useState<string>("overview");

  const summary = useFinancialSummary(period);
  const profitLoss = useProfitLoss(period);
  const balanceSheet = useBalanceSheet(period);
  const cashFlow = useCashFlow(period);

  return (
    <div className="space-y-8">
      <AppPageHeader
        title="Financial Intelligence & Executive Reporting"
        subtitle="Consolidated general ledger statements — Profit & Loss, Balance Sheet, Cash Flow, and operational financial metrics."
      />

      {/* Date Filter Foundation */}
      <ReportFilter
        period={period}
        onChange={setPeriod}
        showTypeSelector
      />

      <AppTabs
        tabs={[
          { id: "overview", name: "Executive Overview", icon: <BarChart3 size={16} /> },
          { id: "pnl", name: "Profit & Loss (P&L)", icon: <TrendingUp size={16} /> },
          { id: "balance", name: "Balance Sheet", icon: <DollarSign size={16} /> },
          { id: "cashflow", name: "Cash Flow Statement", icon: <Activity size={16} /> },
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
        variant="pill"
      />

      {/* Financial Overview */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          <FinancialSummaryCards
            summary={summary.data}
            isLoading={summary.isLoading}
          />
        </div>
      )}

      {/* Profit & Loss */}
      {activeTab === "pnl" && (
        <div className="space-y-6">
          <ProfitLossTable
            report={profitLoss.data}
            isLoading={profitLoss.isLoading}
          />
        </div>
      )}

      {/* Balance Sheet */}
      {activeTab === "balance" && (
        <div className="space-y-6">
          <BalanceSheetTable
            report={balanceSheet.data}
            isLoading={balanceSheet.isLoading}
          />
        </div>
      )}

      {/* Cash Flow */}
      {activeTab === "cashflow" && (
        <div className="space-y-6">
          <CashFlowTable
            report={cashFlow.data}
            isLoading={cashFlow.isLoading}
          />
        </div>
      )}
    </div>
  );
}

