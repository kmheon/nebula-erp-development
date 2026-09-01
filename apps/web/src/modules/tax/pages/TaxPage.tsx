import { useState } from "react";
import { Receipt, Percent, ArrowDownRight, ArrowUpRight, DollarSign } from "lucide-react";
import TaxForm from "../components/TaxForm";
import TaxTable from "../components/TaxTable";
import TaxSummaryCard from "../components/TaxSummaryCard";
import {
  AppPageHeader,
  AppStatCard,
  AppTabs,
} from "../../../components/ui";

import {
  useTaxSummary,
  useTaxTypes,
} from "../hooks/useTaxes";

import type { TaxType } from "../types/tax.types";

export default function TaxPage() {
  const { data: taxes = [] } = useTaxTypes();
  const { data: summary } = useTaxSummary();

  const [activeTab, setActiveTab] = useState<string>("rules");
  const [selected, setSelected] = useState<TaxType | undefined>(undefined);

  const safeSummary = summary ?? {
    totalInputTax: 0,
    totalOutputTax: 0,
    taxPayable: 0,
  };

  return (
    <div className="space-y-8">
      <AppPageHeader
        title="Tax Governance & Compliance"
        subtitle="Define multi-jurisdiction tax rules (VAT, Sales Tax, GST) and track input/output tax liability across sales, purchases, and expenses."
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <AppStatCard
          label="Active Tax Rules"
          value={taxes.length}
          subtext="Configured tax codes"
          icon={<Percent size={20} />}
          tone="primary"
        />
        <AppStatCard
          label="Total Input Tax"
          value={`$${safeSummary.totalInputTax.toFixed(2)}`}
          subtext="Recoverable purchase tax"
          icon={<ArrowDownRight size={20} />}
          tone="success"
        />
        <AppStatCard
          label="Total Output Tax"
          value={`$${safeSummary.totalOutputTax.toFixed(2)}`}
          subtext="Collected sales tax"
          icon={<ArrowUpRight size={20} />}
          tone="primary"
        />
        <AppStatCard
          label="Net Tax Payable"
          value={`$${safeSummary.taxPayable.toFixed(2)}`}
          subtext="Remittance obligation"
          icon={<DollarSign size={20} />}
          tone="warning"
        />
      </div>

      <AppTabs
        tabs={[
          { id: "rules", name: "Tax Rules & Codes", icon: <Percent size={16} /> },
          { id: "summary", name: "Tax Summary & Analytics", icon: <Receipt size={16} /> },
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
        variant="pill"
      />

      {activeTab === "rules" && (
        <div className="space-y-6">
          <TaxForm
            tax={selected}
            onCancel={() => setSelected(undefined)}
          />
          <TaxTable taxes={taxes} />
        </div>
      )}

      {activeTab === "summary" && (
        <div className="space-y-6">
          <TaxSummaryCard summary={safeSummary} />
        </div>
      )}
    </div>
  );
}

