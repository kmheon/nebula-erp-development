import { BatchSerialTracker } from "../components/BatchSerialTracker";
import { AppPageHeader } from "../../../components/ui";

export default function InventoryBatchSerialPage() {
  return (
    <div className="space-y-6">
      <AppPageHeader
        title="Batch, Lot & Serial Number Tracking"
        subtitle="End-to-end lot genealogy, expiration tracking, recall management, and individual unit serial registration."
      />

      <BatchSerialTracker />
    </div>
  );
}
