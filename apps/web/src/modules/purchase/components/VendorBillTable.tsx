/**
 * Vendor Bill Table & 3-Way Matching UI.
 * 
 * ARCHITECTURAL RATIONALE:
 * Displays vendor bills and provides an interactive 3-way match audit widget
 * comparing Purchase Orders, Goods Receipt Notes, and Vendor Bills before accounts payable posting.
 */

import { useState } from "react";
import type { VendorBill, ThreeWayMatchResult } from "../types/matching.types";
import type { PurchaseOrder, GoodsReceive } from "../types/purchase.types";
import { useThreeWayMatchEvaluation } from "../hooks/useVendorBills";

type VendorBillTableProps = {
  bills: VendorBill[];
  purchaseOrders: PurchaseOrder[];
  goodsReceives: GoodsReceive[];
};

export default function VendorBillTable({
  bills,
  purchaseOrders,
  goodsReceives,
}: VendorBillTableProps) {
  const [selectedBill, setSelectedBill] = useState<VendorBill | null>(null);
  const [matchResult, setMatchResult] = useState<ThreeWayMatchResult | null>(null);
  const [tolerance, setTolerance] = useState<number>(0);

  const evaluateMatch = useThreeWayMatchEvaluation();

  const handleRunMatch = async (bill: VendorBill) => {
    setSelectedBill(bill);
    const po = purchaseOrders.find((p) => p.id === bill.purchaseOrderId);
    const grn = goodsReceives.find((g) => g.purchaseOrderId === bill.purchaseOrderId);

    if (!po) {
      alert("Associated Purchase Order not found for matching.");
      return;
    }

    try {
      const result = await evaluateMatch.mutateAsync({
        purchaseOrder: po,
        goodsReceive: grn,
        vendorBill: bill,
        tolerancePercentage: tolerance,
      });
      setMatchResult(result);
    } catch (err: any) {
      alert(`3-Way Matching failed: ${err.message}`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="surface overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              <th className="p-3 text-left">Bill #</th>
              <th className="p-3 text-left">Supplier</th>
              <th className="p-3 text-left">PO Reference</th>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-right">Total</th>
              <th className="p-3 text-center">3-Way Match</th>
            </tr>
          </thead>
          <tbody>
            {bills.map((bill) => {
              let statusColor = "bg-gray-100 text-gray-700";
              if (bill.status === "matched") statusColor = "bg-green-100 text-green-700";
              if (bill.status === "discrepancy") statusColor = "bg-red-100 text-red-700";
              if (bill.status === "approved") statusColor = "bg-blue-100 text-blue-700";

              return (
                <tr key={bill.id} className="border-b hover:bg-muted/30 transition-colors">
                  <td className="p-3 font-medium text-sm">{bill.billNumber}</td>
                  <td className="p-3 text-sm text-muted-foreground">{bill.supplierId}</td>
                  <td className="p-3 text-sm text-muted-foreground">{bill.purchaseOrderId}</td>
                  <td className="p-3 text-sm text-muted-foreground">{bill.date}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium uppercase ${statusColor}`}>
                      {bill.status}
                    </span>
                  </td>
                  <td className="p-3 text-right font-medium text-sm">${bill.total.toFixed(2)}</td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => handleRunMatch(bill)}
                      className="px-3 py-1 bg-primary text-primary-foreground rounded text-xs font-medium hover:bg-primary/90 transition-colors"
                    >
                      Run Match
                    </button>
                  </td>
                </tr>
              );
            })}
            {bills.length === 0 && (
              <tr>
                <td colSpan={7} className="p-8 text-center text-muted-foreground">
                  No vendor bills recorded.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 3-Way Match Audit Modal / Panel */}
      {selectedBill && matchResult && (
        <div className="surface p-6 space-y-4 border border-primary/20 bg-muted/10 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold">
                3-Way Match Audit: Bill {selectedBill.billNumber}
              </h3>
              <p className="text-xs text-muted-foreground">
                Checked at: {new Date(matchResult.checkedAt).toLocaleString()} | Tolerance: {tolerance}%
              </p>
            </div>
            <button
              onClick={() => {
                setSelectedBill(null);
                setMatchResult(null);
              }}
              className="text-muted-foreground hover:text-foreground text-sm font-semibold"
            >
              ✕ Close
            </button>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm font-medium">Set Tolerance %:</span>
            <input
              type="number"
              step="0.1"
              min="0"
              max="5"
              value={tolerance}
              onChange={(e) => setTolerance(parseFloat(e.target.value) || 0)}
              className="px-3 py-1 border rounded w-24 text-sm"
            />
            <button
              onClick={() => handleRunMatch(selectedBill)}
              className="px-3 py-1 bg-secondary text-secondary-foreground rounded text-xs font-medium"
            >
              Recalculate
            </button>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-sm">Match Status:</h4>
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                  matchResult.status === "matched"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {matchResult.status}
              </span>
            </div>

            {matchResult.discrepancies.length > 0 ? (
              <div className="space-y-2 mt-4">
                <h5 className="text-xs font-semibold uppercase text-red-600">Discrepancies Detected:</h5>
                <div className="space-y-2">
                  {matchResult.discrepancies.map((disc, idx) => (
                    <div key={idx} className="p-3 bg-red-50 border border-red-200 rounded text-sm space-y-1">
                      <div className="font-semibold text-red-900">{disc.productName}</div>
                      <div className="text-xs text-red-700 grid grid-cols-3 gap-2">
                        <div>PO Qty: {disc.poQuantity}</div>
                        <div>GRN Qty: {disc.grnQuantity}</div>
                        <div>Billed Qty: {disc.billedQuantity}</div>
                      </div>
                      <div className="text-xs text-red-700 grid grid-cols-2 gap-2">
                        <div>PO Unit Price: ${disc.poUnitPrice.toFixed(2)}</div>
                        <div>Billed Unit Price: ${disc.billedUnitPrice.toFixed(2)}</div>
                      </div>
                      <p className="text-xs font-medium text-red-800 mt-1">{disc.discrepancyDetails}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="p-4 bg-green-50 border border-green-200 text-green-800 rounded text-sm font-medium">
                All line items perfectly matched across Purchase Order, Goods Receipt Note, and Vendor Bill within tolerance!
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
