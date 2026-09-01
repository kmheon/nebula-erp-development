import { WarehouseZoneManager } from "../components/WarehouseZoneManager";
import WarehouseForm from "../components/WarehouseForm";
import WarehouseTable from "../components/WarehouseTable";
import StockTransferForm from "../components/StockTransferForm";
import StockTransferTable from "../components/StockTransferTable";
import { AppPageHeader } from "../../../components/ui";
import type { Warehouse } from "../types/inventory.types";

const warehouses: Warehouse[] = [
  {
    id: "1",
    name: "Main Distribution Warehouse",
    code: "WH-001",
    location: "Global Logistics Hub A",
    status: "active",
  },
];

export default function InventoryWarehousesPage() {
  return (
    <div className="space-y-6">
      <AppPageHeader
        title="Warehouses & Bins"
        subtitle="Multi-warehouse zoning, bin location tracking, capacity monitoring, and inter-warehouse stock transfers."
      />

      <WarehouseZoneManager />
      <WarehouseForm />
      <WarehouseTable warehouses={warehouses} />
      <StockTransferForm />
      <StockTransferTable />
    </div>
  );
}
