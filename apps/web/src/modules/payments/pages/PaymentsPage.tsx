import { useState } from "react";
import {
  DollarSign,
  ArrowDownLeft,
  ArrowUpRight,
  Split,
  Building2,
  Users,
  Plus,
  CreditCard,
} from "lucide-react";

import PaymentAllocationForm from "../components/PaymentAllocationForm";
import PaymentAllocationTable from "../components/PaymentAllocationTable";
import PaymentForm from "../components/PaymentForm";
import PaymentTable from "../components/PaymentTable";
import SupplierPayableTable from "../components/SupplierPayableTable";
import CustomerReceivableTable from "../components/CustomerReceivableTable";
import PaymentChannelsPage from "../channels/pages/PaymentChannelsPage";

import {
  AppPageHeader,
  AppStatCard,
  AppTabs,
  AppButton,
} from "../../../components/ui";

import { usePayments } from "../hooks/usePayments";
import { usePurchaseOrders } from "../../purchase/hooks/usePurchaseOrder";
import { useSalesOrders } from "../../sales/hooks/useSalesOrder";
import { useSuppliers } from "../../purchase/hooks/useSupplier";
import { useCustomers } from "../../sales/hooks/useCustomer";

import type {
  CustomerReceivable,
  OutstandingDocument,
  PayableStatus,
  Payment,
  SupplierPayable,
} from "../types/payment.types";

import type { PurchaseOrder } from "../../purchase/types/purchase.types";
import type { SalesOrder } from "../../sales/types/sales.types";

function deriveStatus(
  invoiceAmount: number,
  paidAmount: number,
): PayableStatus {
  if (paidAmount <= 0) return "due";
  if (paidAmount >= invoiceAmount) return "paid";
  return "partial";
}

function buildOutstandingDocuments(
  payments: Payment[],
  salesOrders: SalesOrder[],
  purchaseOrders: PurchaseOrder[],
): OutstandingDocument[] {
  const docs: OutstandingDocument[] = [];

  // Sales orders -> Customer invoices (receivable)
  for (const so of salesOrders) {
    if (so.status === "draft" || so.status === "cancelled") continue;

    const receivedAmount = payments
      .filter(
        (p) => p.type === "receivable" && p.partyId === so.customerId,
      )
      .reduce((sum, p) => sum + p.amount, 0);

    const dueAmount = Math.max(so.total - receivedAmount, 0);

    if (dueAmount > 0) {
      docs.push({
        documentId: so.id,
        documentType: "sales_invoice",
        documentNumber: so.orderNumber,
        date: so.date,
        total: so.total,
        paid: receivedAmount,
        due: dueAmount,
      });
    }
  }

  // Purchase orders -> Supplier invoices (payable)
  for (const po of purchaseOrders) {
    if (po.status === "draft" || po.status === "cancelled") continue;

    const paidAmount = payments
      .filter((p) => p.type === "payable" && p.partyId === po.supplierId)
      .reduce((sum, p) => sum + p.amount, 0);

    const dueAmount = Math.max(po.total - paidAmount, 0);

    if (dueAmount > 0) {
      docs.push({
        documentId: po.id,
        documentType: "purchase_invoice",
        documentNumber: po.orderNumber,
        date: po.date,
        total: po.total,
        paid: paidAmount,
        due: dueAmount,
      });
    }
  }

  return docs;
}

export default function PaymentsPage() {
  const [activeTab, setActiveTab] = useState<string>("records");
  const [showPaymentForm, setShowPaymentForm] = useState<boolean>(false);
  const [showAllocationForm, setShowAllocationForm] = useState<boolean>(false);

  const { data: payments = [] } = usePayments();
  const { data: suppliers = [] } = useSuppliers();
  const { data: customers = [] } = useCustomers();
  const { data: salesOrders = [] } = useSalesOrders();
  const { data: purchaseOrders = [] } = usePurchaseOrders();

  const payablePayments = payments.filter((p) => p.type === "payable");
  const receivablePayments = payments.filter((p) => p.type === "receivable");

  const totalPayableAmount = payablePayments.reduce((sum, p) => sum + p.amount, 0);
  const totalReceivableAmount = receivablePayments.reduce((sum, p) => sum + p.amount, 0);
  const netCashFlow = totalReceivableAmount - totalPayableAmount;

  const supplierPayables: SupplierPayable[] = suppliers.map((supplier) => {
    const paidAmount = payablePayments
      .filter((p) => p.partyId === supplier.id)
      .reduce((sum, p) => sum + p.amount, 0);

    const invoiceAmount = paidAmount;
    const dueAmount = Math.max(invoiceAmount - paidAmount, 0);

    return {
      supplierId: supplier.id,
      supplierName: supplier.companyName,
      invoiceAmount,
      paidAmount,
      dueAmount,
      status: deriveStatus(invoiceAmount, paidAmount),
    };
  });

  const customerReceivables: CustomerReceivable[] = customers.map((customer) => {
    const receivedAmount = receivablePayments
      .filter((p) => p.partyId === customer.id)
      .reduce((sum, p) => sum + p.amount, 0);

    const invoiceAmount = receivedAmount;
    const dueAmount = Math.max(invoiceAmount - receivedAmount, 0);

    return {
      customerId: customer.id,
      customerName: customer.name,
      invoiceAmount,
      receivedAmount,
      dueAmount,
      status: deriveStatus(invoiceAmount, receivedAmount),
    };
  });

  const outstandingDocuments = buildOutstandingDocuments(
    payments,
    salesOrders,
    purchaseOrders,
  );

  return (
    <div className="space-y-8">
      <AppPageHeader
        title="Treasury & Payments Management"
        subtitle="Process customer receipts, supplier disbursements, multi-document payment allocations, and channel bank settlements."
        actions={
          <div className="flex flex-wrap items-center gap-3">
            <AppButton
              variant="outline"
              leftIcon={<Split size={16} />}
              onClick={() => {
                setActiveTab("allocation");
                setShowAllocationForm((prev) => !prev);
              }}
            >
              {showAllocationForm ? "Close Allocation" : "Allocate Payment"}
            </AppButton>
            <AppButton
              variant="primary"
              leftIcon={<Plus size={16} />}
              onClick={() => {
                setActiveTab("records");
                setShowPaymentForm((prev) => !prev);
              }}
            >
              {showPaymentForm ? "Close Form" : "Record Payment"}
            </AppButton>
          </div>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <AppStatCard
          label="Total Receipts (Inbound)"
          value={`$${totalReceivableAmount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          subtext="Customer receipts processed"
          icon={<ArrowDownLeft size={20} />}
          tone="success"
        />
        <AppStatCard
          label="Total Disbursements (Outbound)"
          value={`$${totalPayableAmount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          subtext="Supplier payments issued"
          icon={<ArrowUpRight size={20} />}
          tone="warning"
        />
        <AppStatCard
          label="Net Treasury Cash Flow"
          value={`$${netCashFlow.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          subtext="Receipts less disbursements"
          icon={<DollarSign size={20} />}
          tone={netCashFlow >= 0 ? "primary" : "danger"}
        />
        <AppStatCard
          label="Total Transactions"
          value={payments.length}
          subtext="Ledger payment entries"
          icon={<CreditCard size={20} />}
          tone="info"
        />
      </div>

      {/* Workspace Tabs */}
      <AppTabs
        tabs={[
          { id: "records", name: "Payment Transactions", icon: <DollarSign size={16} /> },
          { id: "allocation", name: "Payment Allocation", icon: <Split size={16} /> },
          { id: "payables", name: "Supplier Payables", icon: <Building2 size={16} /> },
          { id: "receivables", name: "Customer Receivables", icon: <Users size={16} /> },
          { id: "channels", name: "Channels & Settlement", icon: <CreditCard size={16} /> },
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
        variant="pill"
      />

      {/* Tab Panels */}
      {activeTab === "records" && (
        <div className="space-y-6">
          {showPaymentForm && (
            <div className="rounded-[var(--nebula-radius-lg)] border border-[var(--nebula-border)] bg-[var(--nebula-surface)] p-6">
              <h3 className="text-base font-semibold text-[var(--nebula-text-primary)] mb-4">
                Record Payment / Customer Receipt
              </h3>
              <PaymentForm suppliers={suppliers} customers={customers} />
            </div>
          )}
          <PaymentTable payments={payments} />
        </div>
      )}

      {activeTab === "allocation" && (
        <div className="space-y-6">
          {showAllocationForm && (
            <div className="rounded-[var(--nebula-radius-lg)] border border-[var(--nebula-border)] bg-[var(--nebula-surface)] p-6">
              <h3 className="text-base font-semibold text-[var(--nebula-text-primary)] mb-4">
                Allocate Payment to Invoices
              </h3>
              <PaymentAllocationForm
                payments={payments}
                outstandingDocuments={outstandingDocuments}
              />
            </div>
          )}
          <PaymentAllocationTable payments={payments} />
        </div>
      )}

      {activeTab === "payables" && (
        <div className="space-y-6">
          <SupplierPayableTable payables={supplierPayables} />
        </div>
      )}

      {activeTab === "receivables" && (
        <div className="space-y-6">
          <CustomerReceivableTable receivables={customerReceivables} />
        </div>
      )}

      {activeTab === "channels" && (
        <div className="space-y-6">
          <PaymentChannelsPage />
        </div>
      )}
    </div>
  );
}
