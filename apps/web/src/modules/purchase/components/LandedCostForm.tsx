/**
 * Landed Cost Form Component.
 * 
 * ARCHITECTURAL RATIONALE:
 * Enables recording and simulation of additional procurement costs (freight, duties, insurance, etc.)
 * across received goods using multiple allocation strategies. All calculations are delegated to the pure service.
 */

import { useState } from "react";
import { useLandedCostMutation, useLandedCostAllocationSimulation } from "../hooks/useLandedCost";
import type { GoodsReceive, PurchaseOrder } from "../types/purchase.types";
import type { LandedCostItem, AllocationMethod, LandedCostType, LandedCostAllocationResult } from "../types/landedCost.types";

type LandedCostFormProps = {
  goodsReceives: GoodsReceive[];
  purchaseOrders: PurchaseOrder[];
};

export default function LandedCostForm({
  goodsReceives,
  purchaseOrders,
}: LandedCostFormProps) {
  const [goodsReceiveId, setGoodsReceiveId] = useState("");
  const [purchaseOrderId, setPurchaseOrderId] = useState("");
  const [referenceNumber, setReferenceNumber] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [allocationMethod, setAllocationMethod] = useState<AllocationMethod>("value");
  
  const [costType, setCostType] = useState<LandedCostType>("freight");
  const [costDescription, setCostDescription] = useState("");
  const [costAmount, setCostAmount] = useState<number>(150);
  const [items, setItems] = useState<LandedCostItem[]>([
    {
      id: `lci-${Date.now()}`,
      type: "freight",
      description: "International Ocean Freight & Port Handling",
      amount: 450,
      currency: "USD",
    },
  ]);

  const [allocationResult, setAllocationResult] = useState<LandedCostAllocationResult | null>(null);

  const { create } = useLandedCostMutation();
  const simulateAllocation = useLandedCostAllocationSimulation();

  const handleGrnChange = (grnId: string) => {
    setGoodsReceiveId(grnId);
    const grn = goodsReceives.find((g) => g.id === grnId);
    if (grn) {
      setPurchaseOrderId(grn.purchaseOrderId);
    }
  };

  const handleAddItem = () => {
    if (costAmount <= 0) return;
    setItems([
      ...items,
      {
        id: `lci-${Date.now()}`,
        type: costType,
        description: costDescription || costType.replace("_", " ").toUpperCase(),
        amount: costAmount,
        currency: "USD",
      },
    ]);
    setCostDescription("");
    setCostAmount(100);
  };

  const handleRemoveItem = (id: string) => {
    setItems(items.filter((i) => i.id !== id));
  };

  const handleSimulate = async () => {
    if (!goodsReceiveId || !purchaseOrderId || items.length === 0) {
      alert("Please select a Goods Receipt and add at least one cost item.");
      return;
    }

    const grn = goodsReceives.find((g) => g.id === goodsReceiveId);
    const po = purchaseOrders.find((p) => p.id === purchaseOrderId);

    if (!grn || !po) {
      alert("Selected Goods Receipt or Purchase Order not found.");
      return;
    }

    try {
      const result = await simulateAllocation.mutateAsync({
        goodsReceive: grn,
        purchaseOrder: po,
        items,
        allocationMethod,
      });
      setAllocationResult(result);
    } catch (err: any) {
      alert(`Simulation failed: ${err.message}`);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!goodsReceiveId || !purchaseOrderId || items.length === 0) {
      alert("Please fill in required fields.");
      return;
    }

    try {
      await create.mutateAsync({
        goodsReceiveId,
        purchaseOrderId,
        referenceNumber: referenceNumber || `LC-${Date.now().toString().slice(-6)}`,
        date,
        allocationMethod,
        items,
      });

      setReferenceNumber("");
      setAllocationResult(null);
      alert("Landed cost document recorded and allocated successfully!");
    } catch (err: any) {
      alert(`Failed to save landed cost: ${err.message}`);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSave} className="surface p-6 space-y-6">
        <h3 className="text-lg font-bold">Record & Allocate Landed Costs</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-muted-foreground mb-1">
              Goods Receive Note (GRN)
            </label>
            <select
              value={goodsReceiveId}
              onChange={(e) => handleGrnChange(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-md text-sm bg-background"
            >
              <option value="">Select Goods Receive...</option>
              {goodsReceives.map((grn) => (
                <option key={grn.id} value={grn.id}>
                  GRN #{grn.id.slice(-6)} (PO: {grn.purchaseOrderId.slice(-6)})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-muted-foreground mb-1">
              Reference Number
            </label>
            <input
              type="text"
              value={referenceNumber}
              onChange={(e) => setReferenceNumber(e.target.value)}
              placeholder="e.g. LC-INV-2026-001"
              className="w-full px-3 py-2 border rounded-md text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-muted-foreground mb-1">
              Date
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
              Allocation Method
            </label>
            <select
              value={allocationMethod}
              onChange={(e) => setAllocationMethod(e.target.value as AllocationMethod)}
              className="w-full px-3 py-2 border rounded-md text-sm bg-background"
            >
              <option value="value">By Value (Proportional to Cost)</option>
              <option value="quantity">By Quantity (Item Count)</option>
              <option value="weight">By Weight (Estimated / Actual)</option>
              <option value="volume">By Volume (CBM)</option>
              <option value="equal">Equal Distribution</option>
              <option value="manual">Manual Weighting</option>
            </select>
          </div>
        </div>

        {/* Additional Cost Items Adder */}
        <div className="border-t pt-4 space-y-4">
          <h4 className="font-semibold text-sm">Additional Cost Items (Freight, Duty, Insurance, etc.)</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">Cost Type</label>
              <select
                value={costType}
                onChange={(e) => setCostType(e.target.value as LandedCostType)}
                className="w-full px-3 py-2 border rounded-md text-sm bg-background"
              >
                <option value="freight">Freight</option>
                <option value="shipping">Shipping</option>
                <option value="customs_duty">Customs Duty</option>
                <option value="insurance">Insurance</option>
                <option value="port_charges">Port Charges</option>
                <option value="clearing_charges">Clearing Charges</option>
                <option value="packaging">Packaging</option>
                <option value="local_transportation">Local Transportation</option>
                <option value="handling">Handling</option>
                <option value="miscellaneous">Miscellaneous</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">Description</label>
              <input
                type="text"
                value={costDescription}
                onChange={(e) => setCostDescription(e.target.value)}
                placeholder="e.g. Express Courier Fee"
                className="w-full px-3 py-2 border rounded-md text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">Amount ($)</label>
              <input
                type="number"
                step="0.01"
                value={costAmount}
                onChange={(e) => setCostAmount(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 border rounded-md text-sm"
              />
            </div>

            <button
              type="button"
              onClick={handleAddItem}
              className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md text-sm font-medium hover:bg-secondary/90 transition-colors"
            >
              + Add Cost
            </button>
          </div>

          {/* Added Costs List */}
          <div className="space-y-2">
            {items.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 bg-muted/20 border rounded-md text-sm">
                <div>
                  <span className="font-semibold uppercase text-xs px-2 py-0.5 bg-primary/10 text-primary rounded mr-2">
                    {item.type}
                  </span>
                  <span>{item.description}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-bold">${item.amount.toFixed(2)}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(item.id)}
                    className="text-red-500 hover:text-red-700 text-xs font-semibold"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t">
          <button
            type="button"
            onClick={handleSimulate}
            className="px-4 py-2 bg-muted text-foreground border rounded-md text-sm font-medium hover:bg-muted/80 transition-colors"
          >
            Simulate Allocation Preview
          </button>

          <button
            type="submit"
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            Post Landed Cost & Valuation
          </button>
        </div>
      </form>

      {/* Allocation Simulation Preview Panel */}
      {allocationResult && (
        <div className="surface p-6 space-y-4 border border-primary/30 bg-primary/5 rounded-lg">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold">Landed Cost Allocation Preview</h3>
            <span className="text-xs font-semibold bg-green-100 text-green-800 px-3 py-1 rounded-full uppercase">
              Method: {allocationResult.allocationMethod}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            Total Landed Cost to Distribute: <strong className="text-foreground">${allocationResult.totalLandedCost.toFixed(2)}</strong>
          </p>

          <div className="overflow-hidden border rounded-md">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/40 text-xs font-semibold text-muted-foreground uppercase">
                  <th className="p-3 text-left">Product</th>
                  <th className="p-3 text-right">Qty</th>
                  <th className="p-3 text-right">Original Unit Cost</th>
                  <th className="p-3 text-right">Allocated Cost</th>
                  <th className="p-3 text-right">Final Unit Cost</th>
                </tr>
              </thead>
              <tbody>
                {allocationResult.allocations.map((alloc) => (
                  <tr key={alloc.productId} className="border-b">
                    <td className="p-3 font-medium">{alloc.productName}</td>
                    <td className="p-3 text-right">{alloc.quantity}</td>
                    <td className="p-3 text-right">${alloc.originalUnitCost.toFixed(2)}</td>
                    <td className="p-3 text-right text-primary font-semibold">+${alloc.allocatedLandedCost.toFixed(2)} ({alloc.allocationPercentage}%)</td>
                    <td className="p-3 text-right font-bold text-green-700">${alloc.finalUnitCost.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
