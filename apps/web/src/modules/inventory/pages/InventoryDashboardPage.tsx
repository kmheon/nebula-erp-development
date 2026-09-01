import InventoryStats from "../components/InventoryStats";
import InventoryDashboard from "../components/InventoryDashboard";
import { AppPageHeader } from "../../../components/ui";

const products = [
  {
    id: "1",
    name: "Enterprise Laptop Pro",
    sku: "LAP-001",
    sellingPrice: 950,
    currentStock: 15,
  },
];

export default function InventoryDashboardPage() {
  return (
    <div className="space-y-6">
      <AppPageHeader
        title="Inventory Dashboard & Overview"
        subtitle="Real-time stock valuation, turnover velocity, and warehouse performance metrics."
      />

      <InventoryDashboard />
      <InventoryStats
        totalProducts={products.length}
        totalStock={products.reduce((sum, p) => sum + p.currentStock, 0)}
        lowStock={0}
        value={products.reduce((sum, p) => sum + (p.currentStock * p.sellingPrice), 0)}
      />
    </div>
  );
}
