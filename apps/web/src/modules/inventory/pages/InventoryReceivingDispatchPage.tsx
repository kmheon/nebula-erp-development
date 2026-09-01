import { ReceivingDispatchDock } from "../components/ReceivingDispatchDock";
import { AppPageHeader } from "../../../components/ui";

export default function InventoryReceivingDispatchPage() {
  return (
    <div className="space-y-6">
      <AppPageHeader
        title="Inbound Receiving & Outbound Dispatch Docks"
        subtitle="Purchase order receiving inspections, 3-way matching validation, and outbound picking/dispatch workflows."
      />

      <ReceivingDispatchDock />
    </div>
  );
}
