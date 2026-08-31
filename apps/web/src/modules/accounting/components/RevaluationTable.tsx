/**
 * Multi-Currency Revaluation Table Component.
 * 
 * ARCHITECTURAL RATIONALE:
 * Displays recorded revaluation documents, net unrealized gains/losses, and proposal status.
 */

import type { RevaluationDocument } from "../types/revaluation.types";

type RevaluationTableProps = {
  revaluations: RevaluationDocument[];
};

export default function RevaluationTable({ revaluations }: RevaluationTableProps) {
  return (
    <div className="surface overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            <th className="p-3 text-left">Date</th>
            <th className="p-3 text-left">Rate Type</th>
            <th className="p-3 text-left">Base Currency</th>
            <th className="p-3 text-left">Status</th>
            <th className="p-3 text-right">Total Gain</th>
            <th className="p-3 text-right">Total Loss</th>
            <th className="p-3 text-right">Net Adjustment</th>
          </tr>
        </thead>
        <tbody>
          {revaluations.map((rev) => (
            <tr key={rev.id} className="border-b hover:bg-muted/30 transition-colors">
              <td className="p-3 font-medium text-sm">{rev.date}</td>
              <td className="p-3">
                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary uppercase">
                  {rev.rateType}
                </span>
              </td>
              <td className="p-3 text-sm text-muted-foreground">{rev.baseCurrency}</td>
              <td className="p-3">
                <span className="px-2 py-0.5 rounded-full text-xs font-medium uppercase bg-green-100 text-green-800">
                  {rev.status}
                </span>
              </td>
              <td className="p-3 text-right font-medium text-sm text-green-700">+${rev.totalGain.toFixed(2)}</td>
              <td className="p-3 text-right font-medium text-sm text-red-600">-${rev.totalLoss.toFixed(2)}</td>
              <td className={`p-3 text-right font-bold text-sm ${rev.netAdjustment >= 0 ? "text-green-700" : "text-red-600"}`}>
                {rev.netAdjustment >= 0 ? `+${rev.netAdjustment.toFixed(2)}` : rev.netAdjustment.toFixed(2)}
              </td>
            </tr>
          ))}
          {revaluations.length === 0 && (
            <tr>
              <td colSpan={7} className="p-8 text-center text-muted-foreground">
                No currency revaluation documents recorded.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
