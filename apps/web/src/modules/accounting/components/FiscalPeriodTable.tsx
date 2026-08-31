/**
 * Fiscal Period Status & Governance Table.
 */

import type { FiscalPeriod } from "../types/accounting.types";

type FiscalPeriodTableProps = {
  periods: FiscalPeriod[];
};

export default function FiscalPeriodTable({ periods }: FiscalPeriodTableProps) {
  return (
    <div className="surface overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            <th className="p-3 text-left">Period Name</th>
            <th className="p-3 text-left">Start Date</th>
            <th className="p-3 text-left">End Date</th>
            <th className="p-3 text-left">Status</th>
          </tr>
        </thead>
        <tbody>
          {periods.map((period) => {
            let statusColor = "bg-green-100 text-green-800";
            if (period.status === "locked") statusColor = "bg-amber-100 text-amber-800";
            if (period.status === "closed") statusColor = "bg-red-100 text-red-800";

            return (
              <tr key={period.id} className="border-b hover:bg-muted/30 transition-colors">
                <td className="p-3 font-medium text-sm">{period.name}</td>
                <td className="p-3 text-sm text-muted-foreground">{period.startDate}</td>
                <td className="p-3 text-sm text-muted-foreground">{period.endDate}</td>
                <td className="p-3">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${statusColor}`}>
                    {period.status}
                  </span>
                </td>
              </tr>
            );
          })}
          {periods.length === 0 && (
            <tr>
              <td colSpan={4} className="p-8 text-center text-muted-foreground">
                No fiscal periods defined.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
