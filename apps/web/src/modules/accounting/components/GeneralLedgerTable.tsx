import { useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import type { LedgerEntry } from "../types/accounting.types";

type GeneralLedgerTableProps = {
  entries: LedgerEntry[];
};

export default function GeneralLedgerTable({
  entries,
}: GeneralLedgerTableProps) {
  const parentRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: entries.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 52,
    overscan: 10,
  });

  return (
    <div className="surface overflow-hidden flex flex-col">
      <div className="border-b bg-muted/50">
        <table className="w-full">
          <thead>
            <tr className="border-b text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              <th className="p-3 text-left w-1/4">Account</th>
              <th className="p-3 text-left w-32">Date</th>
              <th className="p-3 text-left flex-1">Description</th>
              <th className="p-3 text-right w-28">Debit</th>
              <th className="p-3 text-right w-28">Credit</th>
              <th className="p-3 text-right w-32">Balance</th>
            </tr>
          </thead>
        </table>
      </div>

      <div
        ref={parentRef}
        className="max-h-[650px] overflow-y-auto relative w-full"
      >
        <div
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            width: "100%",
            position: "relative",
          }}
        >
          <table className="w-full absolute top-0 left-0">
            <tbody>
              {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                const entry = entries[virtualRow.index];
                return (
                  <tr
                    key={entry.id}
                    className="border-b hover:bg-muted/30 transition-colors absolute top-0 left-0 w-full flex items-center"
                    style={{
                      height: `${virtualRow.size}px`,
                      transform: `translateY(${virtualRow.start}px)`,
                    }}
                  >
                    <td className="p-3 w-1/4 truncate">
                      <div className="font-medium text-sm">
                        {entry.accountCode} - {entry.accountName}
                      </div>
                    </td>

                    <td className="p-3 w-32 text-sm text-muted-foreground">
                      {entry.date}
                    </td>

                    <td className="p-3 flex-1 text-sm truncate">
                      {entry.description}
                    </td>

                    <td className="p-3 w-28 text-right text-sm">
                      {entry.debit > 0 ? `$${entry.debit.toFixed(2)}` : "-"}
                    </td>

                    <td className="p-3 w-28 text-right text-sm">
                      {entry.credit > 0 ? `$${entry.credit.toFixed(2)}` : "-"}
                    </td>

                    <td className="p-3 w-32 text-right font-medium text-sm">
                      ${entry.balance.toFixed(2)}
                    </td>
                  </tr>
                );
              })}
              {entries.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted-foreground">
                    No ledger entries found for the selected period.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
