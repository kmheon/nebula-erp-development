/**
 * Vendor Bill Form Component.
 * 
 * ARCHITECTURAL RATIONALE:
 * Enables recording of vendor bills associated with Purchase Orders for 3-way matching validation.
 */

import { useState } from "react";
import { useVendorBillMutation } from "../hooks/useVendorBills";
import type { PurchaseOrder } from "../types/purchase.types";

type VendorBillFormProps = {
  purchaseOrders: PurchaseOrder[];
};

export default function VendorBillForm({ purchaseOrders }: VendorBillFormProps) {
  const [billNumber, setBillNumber] = useState("");
  const [supplierId, setSupplierId] = useState("");
  const [purchaseOrderId, setPurchaseOrderId] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [dueDate, setDueDate] = useState("");
  const [unitPrice, setUnitPrice] = useState<number>(0);
  const [billedQuantity, setBilledQuantity] = useState<number>(1);

  const { create } = useVendorBillMutation();

  const handlePoChange = (poId: string) => {
    setPurchaseOrderId(poId);
    const po = purchaseOrders.find((p) => p.id === poId);
    if (po) {
      setSupplierId(po.supplierId);
      if (po.items && po.items.length > 0) {
        setUnitPrice(po.items[0].unitPrice);
        setBilledQuantity(po.items[0].quantity);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!billNumber || !purchaseOrderId) {
      alert("Please fill in Bill Number and select a Purchase Order.");
      return;
    }

    const po = purchaseOrders.find((p) => p.id === purchaseOrderId);
    const firstItem = po?.items[0];
    const productId = firstItem?.productId || "prod-1";
    const productName = (firstItem as any)?.productName || `Product ${productId}`;

    const subtotal = unitPrice * billedQuantity;
    const tax = subtotal * 0.1;
    const total = subtotal + tax;

    try {
      await create.mutateAsync({
        supplierId,
        purchaseOrderId,
        billNumber,
        date,
        dueDate: dueDate || date,
        items: [
          {
            id: `vbi-${Date.now()}`,
            productId,
            productName,
            billedQuantity,
            unitPrice,
            tax,
            total,
          },
        ],
        subtotal,
        tax,
        total,
      });

      setBillNumber("");
      setDueDate("");
      alert("Vendor bill recorded successfully!");
    } catch (err: any) {
      alert(`Failed to record vendor bill: ${err.message}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="surface p-6 space-y-4">
      <h3 className="text-lg font-bold">Record New Vendor Bill</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase text-muted-foreground mb-1">
            Bill Number
          </label>
          <input
            type="text"
            value={billNumber}
            onChange={(e) => setBillNumber(e.target.value)}
            placeholder="e.g. BILL-2026-001"
            required
            className="w-full px-3 py-2 border rounded-md text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase text-muted-foreground mb-1">
            Purchase Order
          </label>
          <select
            value={purchaseOrderId}
            onChange={(e) => handlePoChange(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded-md text-sm bg-background"
          >
            <option value="">Select Purchase Order...</option>
            {purchaseOrders.map((po) => (
              <option key={po.id} value={po.id}>
                {po.orderNumber} (${po.total.toFixed(2)})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase text-muted-foreground mb-1">
            Supplier ID
          </label>
          <input
            type="text"
            value={supplierId}
            readOnly
            className="w-full px-3 py-2 border rounded-md text-sm bg-muted text-muted-foreground"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase text-muted-foreground mb-1">
            Bill Date
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded-md text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase text-muted-foreground mb-1">
            Due Date
          </label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full px-3 py-2 border rounded-md text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase text-muted-foreground mb-1">
            Billed Quantity
          </label>
          <input
            type="number"
            value={billedQuantity}
            onChange={(e) => setBilledQuantity(parseFloat(e.target.value) || 0)}
            required
            className="w-full px-3 py-2 border rounded-md text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase text-muted-foreground mb-1">
            Billed Unit Price ($)
          </label>
          <input
            type="number"
            step="0.01"
            value={unitPrice}
            onChange={(e) => setUnitPrice(parseFloat(e.target.value) || 0)}
            required
            className="w-full px-3 py-2 border rounded-md text-sm"
          />
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <button
          type="submit"
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          Record Bill & Verify 3-Way Match
        </button>
      </div>
    </form>
  );
}
