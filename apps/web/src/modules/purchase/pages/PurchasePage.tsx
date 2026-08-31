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
  useSuppliers,
} from "../hooks/useSupplier";

import {
  usePurchaseOrders,
} from "../hooks/usePurchaseOrder";

import {
  useGoodsReceives,
} from "../hooks/useGoodsReceive";

import {
  useVendorBills,
} from "../hooks/useVendorBills";

import {
  useLandedCosts,
} from "../hooks/useLandedCost";


export default function PurchasePage() {
  const { data: suppliers = [] } = useSuppliers();
  const { data: orders = [] } = usePurchaseOrders();
  const { data: goodsReceives = [] } =
    useGoodsReceives();
  const { data: vendorBills = [] } = useVendorBills();
  const { data: landedCosts = [] } = useLandedCosts();

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-bold">
          Purchase Module
        </h1>

        <p className="mt-2 text-[var(--nebula-text-secondary)]">
          Manage suppliers, purchase orders, goods receiving, vendor bills, and automated 3-way matching.
        </p>
      </div>

      {/* Supplier Management */}
      <section
        id="purchase-suppliers"
        className="space-y-4"
      >
        <h2 className="text-xl font-semibold">
          Supplier Management
        </h2>

        <SupplierForm />

        <SupplierTable suppliers={suppliers} />
      </section>

      {/* Purchase Orders */}
      <section
        id="purchase-orders"
        className="space-y-4"
      >
        <h2 className="text-xl font-semibold">
          Purchase Orders
        </h2>

        <PurchaseOrderForm />

        <PurchaseOrderTable orders={orders} />
      </section>

      {/* Goods Receiving */}
      <section
        id="purchase-goods-receiving"
        className="space-y-4"
      >
        <h2 className="text-xl font-semibold">
          Goods Receiving
        </h2>

        <GoodsReceiveForm />

        <GoodsReceiveTable
          goodsReceives={goodsReceives}
        />
      </section>

      {/* Vendor Bills & 3-Way Matching */}
      <section
        id="purchase-vendor-bills"
        className="space-y-4"
      >
        <h2 className="text-xl font-semibold">
          Vendor Bills & Automated 3-Way Matching
        </h2>

        <VendorBillForm purchaseOrders={orders} />

        <VendorBillTable
          bills={vendorBills}
          purchaseOrders={orders}
          goodsReceives={goodsReceives}
        />
      </section>

      {/* Landed Cost Allocation Engine */}
      <section
        id="purchase-landed-costs"
        className="space-y-4"
      >
        <h2 className="text-xl font-semibold">
          Landed Cost Allocation Engine
        </h2>

        <LandedCostForm
          goodsReceives={goodsReceives}
          purchaseOrders={orders}
        />

        <LandedCostTable landedCosts={landedCosts} />
      </section>

      {/* Purchase History */}
      <section
        id="purchase-history"
        className="space-y-4"
      >
        <h2 className="text-xl font-semibold">
          Purchase History
        </h2>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="space-y-2">
            <h3 className="font-semibold">
              Orders
            </h3>
            <PurchaseOrderTable orders={orders} />
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold">
              Received Goods
            </h3>
            <GoodsReceiveTable
              goodsReceives={goodsReceives}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
