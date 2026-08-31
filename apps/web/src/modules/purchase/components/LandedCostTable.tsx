/**
 * Landed Cost Table Component.
 * 
 * ARCHITECTURAL RATIONALE:
 * Displays recorded landed cost documents with reference numbers, methods, and total allocated amounts.
 */

import type { LandedCostDocument } from "../types/landedCost.types";

type LandedCostTableProps = {
  landedCosts: LandedCostDocument[];
};

export default function LandedCostTable({ landedCosts }: LandedCostTableProps) {
  return (
    <div className="surface overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            <th className="p-3 text-left">Ref #</th>
            <th className="p-3 text-left">GRN Reference</th>
            <th className="p-3 text-left">Method</th>
            <th className="p-3 text-left">Date</th>
            <th className="p-3 text-left">Status</th>
            <th className="p-3 text-right">Total Landed Cost</th>
          </tr>
        </thead>
        <tbody>
          {landedCosts.map((lc) => (
            <tr key={lc.id} className="border-b hover:bg-muted/30 transition-colors">
              <td className="p-3 font-medium text-sm">{lc.referenceNumber}</td>
              <td className="p-3 text-sm text-muted-foreground">{lc.goodsReceiveId}</td>
              <td className="p-3">
                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary uppercase">
                  {lc.allocationMethod}
                </span>
              </td>
              <td className="p-3 text-sm text-muted-foreground">{lc.date}</td>
              <td className="p-3">
                <span className="px-2 py-0.5 rounded-full text-xs font-medium uppercase bg-green-100 text-green-800">
                  {lc.status}
                </span>
              </td>
              <td className="p-3 text-right font-medium text-sm">${lc.totalLandedCost.toFixed(2)}</td>
            </tr>
          ))}
          {landedCosts.length === 0 && (
            <tr>
              <td colSpan={6} className="p-8 text-center text-muted-foreground">
                No landed cost documents recorded.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
