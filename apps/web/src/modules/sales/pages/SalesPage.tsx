import { useState } from "react";
import {
  ShoppingBag,
  Truck,
  Users,
  TrendingUp,
  Plus,
  History,
  FileText,
} from "lucide-react";
import CustomerForm from "../components/CustomerForm";
import CustomerTable from "../components/CustomerTable";
import SalesOrderForm from "../components/SalesOrderForm";
import SalesOrderTable from "../components/SalesOrderTable";
import DeliveryForm from "../components/DeliveryForm";
import DeliveryTable from "../components/DeliveryTable";
import SalesTable from "../components/SalesTable";

import {
  AppPageHeader,
  AppStatCard,
  AppTabs,
  AppButton,
} from "../../../components/ui";

import { useCustomers } from "../hooks/useCustomer";
import { useSalesOrders } from "../hooks/useSalesOrder";
import { useDeliveries } from "../hooks/useDelivery";

export default function SalesPage() {
  const [activeTab, setActiveTab] = useState<string>("orders");
  const [showOrderForm, setShowOrderForm] = useState<boolean>(false);
  const [showCustomerForm, setShowCustomerForm] = useState<boolean>(false);
  const [showDeliveryForm, setShowDeliveryForm] = useState<boolean>(false);

  const { data: customers = [] } = useCustomers();
  const { data: orders = [] } = useSalesOrders();
  const { data: deliveries = [] } = useDeliveries();

  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const pendingDeliveries = orders.filter(
    (o) => o.status !== "delivered" && o.status !== "cancelled"
  ).length;

  return (
    <div className="space-y-8">
      <AppPageHeader
        title="Sales & Revenue Operations"
        subtitle="Manage customer relationships, sales order processing, delivery dispatch, and multi-channel revenue workflows."
        actions={
          <div className="flex flex-wrap items-center gap-3">
            <AppButton
              variant="outline"
              leftIcon={<Plus size={16} />}
              onClick={() => {
                setActiveTab("customers");
                setShowCustomerForm((prev) => !prev);
              }}
            >
              {showCustomerForm ? "Close Form" : "New Customer"}
            </AppButton>
            <AppButton
              variant="primary"
              leftIcon={<Plus size={16} />}
              onClick={() => {
                setActiveTab("orders");
                setShowOrderForm((prev) => !prev);
              }}
            >
              {showOrderForm ? "Close Form" : "New Sales Order"}
            </AppButton>
          </div>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <AppStatCard
          label="Total Booked Revenue"
          value={`$${totalRevenue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          subtext="Cumulative sales orders value"
          icon={<TrendingUp size={20} />}
          tone="primary"
        />
        <AppStatCard
          label="Sales Orders"
          value={orders.length}
          subtext="Total transaction volume"
          icon={<ShoppingBag size={20} />}
          tone="success"
        />
        <AppStatCard
          label="Pending Deliveries"
          value={pendingDeliveries}
          subtext="Orders awaiting dispatch"
          icon={<Truck size={20} />}
          tone="warning"
        />
        <AppStatCard
          label="Customer Accounts"
          value={customers.length}
          subtext="Active customer profiles"
          icon={<Users size={20} />}
          tone="info"
        />
      </div>

      {/* Workspace Tabs */}
      <AppTabs
        tabs={[
          { id: "orders", name: "Sales Orders", icon: <ShoppingBag size={16} /> },
          { id: "deliveries", name: "Deliveries & Fulfillment", icon: <Truck size={16} /> },
          { id: "customers", name: "Customer Directory", icon: <Users size={16} /> },
          { id: "history", name: "Sales Analytics & History", icon: <History size={16} /> },
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
        variant="pill"
      />

      {/* Tab Panels */}
      {activeTab === "orders" && (
        <div className="space-y-6">
          {showOrderForm && (
            <div className="rounded-[var(--nebula-radius-lg)] border border-[var(--nebula-border)] bg-[var(--nebula-surface)] p-6">
              <h3 className="text-base font-semibold text-[var(--nebula-text-primary)] mb-4">
                Create New Sales Order
              </h3>
              <SalesOrderForm />
            </div>
          )}
          <SalesOrderTable orders={orders} />
        </div>
      )}

      {activeTab === "deliveries" && (
        <div className="space-y-6">
          <div className="flex justify-end">
            <AppButton
              variant="outline"
              size="sm"
              leftIcon={<Plus size={14} />}
              onClick={() => setShowDeliveryForm((prev) => !prev)}
            >
              {showDeliveryForm ? "Hide Dispatch Form" : "Record Delivery Dispatch"}
            </AppButton>
          </div>

          {showDeliveryForm && (
            <div className="rounded-[var(--nebula-radius-lg)] border border-[var(--nebula-border)] bg-[var(--nebula-surface)] p-6">
              <h3 className="text-base font-semibold text-[var(--nebula-text-primary)] mb-4">
                Record Delivery & Stock Deduction
              </h3>
              <DeliveryForm />
            </div>
          )}
          <DeliveryTable deliveries={deliveries} />
        </div>
      )}

      {activeTab === "customers" && (
        <div className="space-y-6">
          {showCustomerForm && (
            <div className="rounded-[var(--nebula-radius-lg)] border border-[var(--nebula-border)] bg-[var(--nebula-surface)] p-6">
              <h3 className="text-base font-semibold text-[var(--nebula-text-primary)] mb-4">
                Add Customer Account
              </h3>
              <CustomerForm />
            </div>
          )}
          <CustomerTable customers={customers} />
        </div>
      )}

      {activeTab === "history" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-[var(--nebula-text-primary)] flex items-center gap-2">
                <FileText size={16} className="text-[var(--nebula-primary)]" />
                All Sales Orders
              </h3>
              <SalesTable orders={orders} />
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-[var(--nebula-text-primary)] flex items-center gap-2">
                <Truck size={16} className="text-[var(--nebula-primary)]" />
                Fulfillment Logs
              </h3>
              <DeliveryTable deliveries={deliveries} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
