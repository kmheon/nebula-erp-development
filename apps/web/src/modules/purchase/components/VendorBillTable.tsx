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
import { AppBadge } from "../../../components/ui";

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
      <div className="surface overflow-hidden rounded-[var(--nebula-radius-lg)] border border-[var(--nebula-border)]">
        <table className="w-full text-sm">
          <thead className="bg-[var(--nebula-surface-muted)] text-[var(--nebula-text-secondary)]">
            <tr className="border-b border-[var(--nebula-border)]">
              <th className="p-3.5 text-left font-semibold">Bill #</th>
              <th className="p-3.5 text-left font-semibold">Supplier</th>
              <th className="p-3.5 text-left font-semibold">PO Reference</th>
              <th className="p-3.5 text-left font-semibold">Date</th>
              <th className="p-3.5 text-left font-semibold">Status</th>
              <th className="p-3.5 text-right font-semibold">Total</th>
              <th className="p-3.5 text-center font-semibold">3-Way Match</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--nebula-border)]">
            {bills.map((bill) => (
              <tr key={bill.id} className="transition-colors hover:bg-[var(--nebula-surface-hover)]">
                <td className="p-3.5 font-medium text-[var(--nebula-text-primary)] font-mono text-xs">{bill.billNumber}</td>
                <td className="p-3.5 text-[var(--nebula-text-secondary)]">{bill.supplierId}</td>
                <td className="p-3.5 text-[var(--nebula-text-secondary)] font-mono text-xs">{bill.purchaseOrderId}</td>
                <td className="p-3.5 text-[var(--nebula-text-secondary)] font-mono text-xs">{bill.date}</td>
                <td className="p-3.5">
                  <AppBadge
                    tone={
                      bill.status === "matched"
                        ? "success"
                        : bill.status === "discrepancy"
                        ? "danger"
                        : bill.status === "approved"
                        ? "primary"
                        : "neutral"
                    }
                    size="sm"
                  >
                    {bill.status}
                  </AppBadge>
                </td>
                <td className="p-3.5 text-right font-mono font-medium text-[var(--nebula-text-primary)]">
                  ${bill.total.toFixed(2)}
                </td>
                <td className="p-3.5 text-center">
                  <button
                    onClick={() => handleRunMatch(bill)}
                    className="rounded-lg bg-[var(--nebula-primary)] px-3 py-1 text-xs font-medium text-white hover:opacity-90 transition-opacity"
                  >
                    Run Match
                  </button>
                </td>
              </tr>
            ))}
            {bills.length === 0 && (
              <tr>
                <td colSpan={7} className="p-8 text-center text-[var(--nebula-text-secondary)]">
                  No vendor bills recorded.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 3-Way Match Audit Modal / Panel */}
      {selectedBill && matchResult && (
        <div className="surface p-6 space-y-4 rounded-[var(--nebula-radius-lg)] border border-[var(--nebula-border)] bg-[var(--nebula-surface)]">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-[var(--nebula-text-primary)]">
                3-Way Match Audit: Bill {selectedBill.billNumber}
              </h3>
              <p className="text-xs text-[var(--nebula-text-secondary)]">
                Checked at: {new Date(matchResult.checkedAt).toLocaleString()} | Tolerance: {tolerance}%
              </p>
            </div>
            <button
              onClick={() => {
                setSelectedBill(null);
                setMatchResult(null);
              }}
              className="text-[var(--nebula-text-secondary)] hover:text-[var(--nebula-text-primary)] text-sm font-semibold transition-colors"
            >
              ✕ Close
            </button>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-[var(--nebula-text-primary)]">Set Tolerance %:</span>
            <input
              type="number"
              step="0.1"
              min="0"
              max="5"
              value={tolerance}
              onChange={(e) => setTolerance(parseFloat(e.target.value) || 0)}
              className="px-3 py-1 border border-[var(--nebula-border)] bg-[var(--nebula-surface)] text-[var(--nebula-text-primary)] rounded-lg w-24 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--nebula-primary)]"
            />
            <button
              onClick={() => handleRunMatch(selectedBill)}
              className="px-3 py-1 bg-[var(--nebula-surface-muted)] text-[var(--nebula-text-primary)] border border-[var(--nebula-border)] rounded-lg text-xs font-medium hover:bg-[var(--nebula-surface-hover)] transition-colors"
            >
              Recalculate
            </button>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-sm text-[var(--nebula-text-primary)]">Match Status:</h4>
              <AppBadge
                tone={matchResult.status === "matched" ? "success" : "danger"}
                size="md"
              >
                {matchResult.status}
              </AppBadge>
            </div>

            {matchResult.discrepancies.length > 0 ? (
              <div className="space-y-2 mt-4">
                <h5 className="text-xs font-semibold uppercase text-[var(--nebula-danger)]">Discrepancies Detected:</h5>
                <div className="space-y-2">
                  {matchResult.discrepancies.map((disc, idx) => (
                    <div key={idx} className="p-3.5 bg-[var(--nebula-danger-bg)] border border-[var(--nebula-danger)]/20 rounded-lg text-sm space-y-1">
                      <div className="font-semibold text-[var(--nebula-danger)]">{disc.productName}</div>
                      <div className="text-xs text-[var(--nebula-text-secondary)] grid grid-cols-3 gap-2">
                        <div>PO Qty: {disc.poQuantity}</div>
                        <div>GRN Qty: {disc.grnQuantity}</div>
                        <div>Billed Qty: {disc.billedQuantity}</div>
                      </div>
                      <div className="text-xs text-[var(--nebula-text-secondary)] grid grid-cols-2 gap-2">
                        <div>PO Unit Price: ${disc.poUnitPrice.toFixed(2)}</div>
                        <div>Billed Unit Price: ${disc.billedUnitPrice.toFixed(2)}</div>
                      </div>
                      <p className="text-xs font-medium text-[var(--nebula-danger)] mt-1">{disc.discrepancyDetails}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="p-4 bg-[var(--nebula-success-bg)] border border-[var(--nebula-success)]/20 text-[var(--nebula-success)] rounded-lg text-sm font-medium">
                All line items perfectly matched across Purchase Order, Goods Receipt Note, and Vendor Bill within tolerance!
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
