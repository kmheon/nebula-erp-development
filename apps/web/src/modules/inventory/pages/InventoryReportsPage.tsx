import { InventoryReportingDashboard } from "../components/InventoryReportingDashboard";
import { AppPageHeader } from "../../../components/ui";

export default function InventoryReportsPage() {
  return (
    <div className="space-y-6">
      <AppPageHeader
        title="Enterprise Valuation & Warehouse Analytics"
        subtitle="Valuation ledgers, inventory aging, ABC classification, automated reorder triggers, and dead stock analysis."
      />

      <InventoryReportingDashboard />
    </div>
  );
}
