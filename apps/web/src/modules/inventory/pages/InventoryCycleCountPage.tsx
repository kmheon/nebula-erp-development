import { CycleCountWorkspace } from "../components/CycleCountWorkspace";
import { AppPageHeader } from "../../../components/ui";

export default function InventoryCycleCountPage() {
  return (
    <div className="space-y-6">
      <AppPageHeader
        title="Cycle Count & Stock Auditing Workspace"
        subtitle="Scheduled physical audits, zone-based count assignments, variance reconciliation, and approval workflows."
      />

      <CycleCountWorkspace />
    </div>
  );
}
