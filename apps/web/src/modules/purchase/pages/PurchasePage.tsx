import { useState } from "react";
import {
  ShoppingCart,
  Truck,
  FileCheck,
  Calculator,
  Users,
  Plus,
  DollarSign,
  Package,
} from "lucide-react";

import SupplierForm from "../components/SupplierForm";
import SupplierTable from "../components/SupplierTable";
import PurchaseOrderForm from "../components/PurchaseOrderForm";
import PurchaseOrderTable from "../components/PurchaseOrderTable";
import GoodsReceiveForm from "../components/GoodsReceiveForm";
import GoodsReceiveTable from "../components/GoodsReceiveTable";
import VendorBillForm from "../components/VendorBillForm";
import VendorBillTable from "../components/VendorBillTable";
import LandedCostForm from "../components/LandedCostForm";
import LandedCostTable from "../components/LandedCostTable";

import {
  AppPageHeader,
  AppStatCard,
  AppTabs,
  AppButton,
} from "../../../components/ui";

import { useSuppliers } from "../hooks/useSupplier";
import { usePurchaseOrders } from "../hooks/usePurchaseOrder";
import { useGoodsReceives } from "../hooks/useGoodsReceive";
import { useVendorBills } from "../hooks/useVendorBills";
import { useLandedCosts } from "../hooks/useLandedCost";

export default function PurchasePage() {
  const [activeTab, setActiveTab] = useState<string>("orders");
  const [showPOForm, setShowPOForm] = useState<boolean>(false);
  const [showSupplierForm, setShowSupplierForm] = useState<boolean>(false);
  const [showGRNForm, setShowGRNForm] = useState<boolean>(false);
  const [showBillForm, setShowBillForm] = useState<boolean>(false);
  const [showLandedCostForm, setShowLandedCostForm] = useState<boolean>(false);

  const { data: suppliers = [] } = useSuppliers();
  const { data: orders = [] } = usePurchaseOrders();
  const { data: goodsReceives = [] } = useGoodsReceives();
  const { data: vendorBills = [] } = useVendorBills();
  const { data: landedCosts = [] } = useLandedCosts();

  const totalSpend = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const pendingReceipts = orders.filter((o) => o.status === "pending").length;

  return (
    <div className="space-y-8">
      <AppPageHeader
        title="Procurement & Purchase Governance"
        subtitle="Manage supplier lifecycle, purchase order commitments, goods receipts, automated 3-way matching, and landed cost allocations."
        actions={
          <div className="flex flex-wrap items-center gap-3">
            <AppButton
              variant="outline"
              leftIcon={<Plus size={16} />}
              onClick={() => {
                setActiveTab("suppliers");
                setShowSupplierForm((prev) => !prev);
              }}
            >
              {showSupplierForm ? "Close Form" : "New Supplier"}
            </AppButton>
            <AppButton
              variant="primary"
              leftIcon={<Plus size={16} />}
              onClick={() => {
                setActiveTab("orders");
                setShowPOForm((prev) => !prev);
              }}
            >
              {showPOForm ? "Close Form" : "New Purchase Order"}
            </AppButton>
          </div>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <AppStatCard
          label="Total Procurement Spend"
          value={`$${totalSpend.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          subtext="Cumulative purchase commitments"
          icon={<DollarSign size={20} />}
          tone="primary"
        />
        <AppStatCard
          label="Purchase Orders"
          value={orders.length}
          subtext="Total POs issued"
          icon={<ShoppingCart size={20} />}
          tone="success"
        />
        <AppStatCard
          label="Pending Receipts"
          value={pendingReceipts}
          subtext="Goods awaiting dock check-in"
          icon={<Package size={20} />}
          tone="warning"
        />
        <AppStatCard
          label="Active Suppliers"
          value={suppliers.length}
          subtext="Verified vendor accounts"
          icon={<Users size={20} />}
          tone="info"
        />
      </div>

      {/* Workspace Tabs */}
      <AppTabs
        tabs={[
          { id: "orders", name: "Purchase Orders", icon: <ShoppingCart size={16} /> },
          { id: "receipts", name: "Goods Receiving", icon: <Truck size={16} /> },
          { id: "bills", name: "Vendor Bills & 3-Way Match", icon: <FileCheck size={16} /> },
          { id: "landed", name: "Landed Cost Allocation", icon: <Calculator size={16} /> },
          { id: "suppliers", name: "Supplier Directory", icon: <Users size={16} /> },
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
        variant="pill"
      />

      {/* Tab Panels */}
      {activeTab === "orders" && (
        <div className="space-y-6">
          {showPOForm && (
            <div className="rounded-[var(--nebula-radius-lg)] border border-[var(--nebula-border)] bg-[var(--nebula-surface)] p-6">
              <h3 className="text-base font-semibold text-[var(--nebula-text-primary)] mb-4">
                Issue New Purchase Order
              </h3>
              <PurchaseOrderForm />
            </div>
          )}
          <PurchaseOrderTable orders={orders} />
        </div>
      )}

      {activeTab === "receipts" && (
        <div className="space-y-6">
          <div className="flex justify-end">
            <AppButton
              variant="outline"
              size="sm"
              leftIcon={<Plus size={14} />}
              onClick={() => setShowGRNForm((prev) => !prev)}
            >
              {showGRNForm ? "Hide Receipt Form" : "Record Goods Receipt"}
            </AppButton>
          </div>

          {showGRNForm && (
            <div className="rounded-[var(--nebula-radius-lg)] border border-[var(--nebula-border)] bg-[var(--nebula-surface)] p-6">
              <h3 className="text-base font-semibold text-[var(--nebula-text-primary)] mb-4">
                Record Goods Receipt Note (GRN)
              </h3>
              <GoodsReceiveForm />
            </div>
          )}
          <GoodsReceiveTable goodsReceives={goodsReceives} />
        </div>
      )}

      {activeTab === "bills" && (
        <div className="space-y-6">
          <div className="flex justify-end">
            <AppButton
              variant="outline"
              size="sm"
              leftIcon={<Plus size={14} />}
              onClick={() => setShowBillForm((prev) => !prev)}
            >
              {showBillForm ? "Hide Bill Form" : "Register Vendor Bill"}
            </AppButton>
          </div>

          {showBillForm && (
            <div className="rounded-[var(--nebula-radius-lg)] border border-[var(--nebula-border)] bg-[var(--nebula-surface)] p-6">
              <h3 className="text-base font-semibold text-[var(--nebula-text-primary)] mb-4">
                Register Vendor Bill for 3-Way Match
              </h3>
              <VendorBillForm purchaseOrders={orders} />
            </div>
          )}
          <VendorBillTable
            bills={vendorBills}
            purchaseOrders={orders}
            goodsReceives={goodsReceives}
          />
        </div>
      )}

      {activeTab === "landed" && (
        <div className="space-y-6">
          <div className="flex justify-end">
            <AppButton
              variant="outline"
              size="sm"
              leftIcon={<Plus size={14} />}
              onClick={() => setShowLandedCostForm((prev) => !prev)}
            >
              {showLandedCostForm ? "Hide Landed Cost Form" : "Allocate Landed Cost"}
            </AppButton>
          </div>

          {showLandedCostForm && (
            <div className="rounded-[var(--nebula-radius-lg)] border border-[var(--nebula-border)] bg-[var(--nebula-surface)] p-6">
              <h3 className="text-base font-semibold text-[var(--nebula-text-primary)] mb-4">
                Allocate Freight, Customs & Handling Surcharges
              </h3>
              <LandedCostForm
                goodsReceives={goodsReceives}
                purchaseOrders={orders}
              />
            </div>
          )}
          <LandedCostTable landedCosts={landedCosts} />
        </div>
      )}

      {activeTab === "suppliers" && (
        <div className="space-y-6">
          {showSupplierForm && (
            <div className="rounded-[var(--nebula-radius-lg)] border border-[var(--nebula-border)] bg-[var(--nebula-surface)] p-6">
              <h3 className="text-base font-semibold text-[var(--nebula-text-primary)] mb-4">
                Add Supplier Profile
              </h3>
              <SupplierForm />
            </div>
          )}
          <SupplierTable suppliers={suppliers} />
        </div>
      )}
    </div>
  );
}
