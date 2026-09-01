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
    <div className="rounded-[var(--nebula-radius-lg)] border border-[var(--nebula-border)] bg-[var(--nebula-surface)] shadow-[var(--nebula-shadow-sm)] overflow-hidden flex flex-col">
      <div className="border-b border-[var(--nebula-border)] bg-[var(--nebula-surface-muted)]">
        <table className="w-full">
          <thead>
            <tr className="text-xs font-semibold text-[var(--nebula-text-secondary)] uppercase tracking-wider">
              <th className="p-3.5 text-left w-1/4">Account</th>
              <th className="p-3.5 text-left w-32">Date</th>
              <th className="p-3.5 text-left flex-1">Description</th>
              <th className="p-3.5 text-right w-28">Debit</th>
              <th className="p-3.5 text-right w-28">Credit</th>
              <th className="p-3.5 text-right w-32">Balance</th>
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
                    className="border-b border-[var(--nebula-border)]/60 hover:bg-[var(--nebula-surface-muted)]/50 transition-colors absolute top-0 left-0 w-full flex items-center"
                    style={{
                      height: `${virtualRow.size}px`,
                      transform: `translateY(${virtualRow.start}px)`,
                    }}
                  >
                    <td className="p-3.5 w-1/4 truncate">
                      <div className="font-medium text-sm text-[var(--nebula-text-primary)]">
                        {entry.accountCode} - {entry.accountName}
                      </div>
                    </td>

                    <td className="p-3.5 w-32 text-sm text-[var(--nebula-text-secondary)]">
                      {entry.date}
                    </td>

                    <td className="p-3.5 flex-1 text-sm text-[var(--nebula-text-primary)] truncate">
                      {entry.description}
                    </td>

                    <td className="p-3.5 w-28 text-right font-mono text-sm text-[var(--nebula-text-primary)]">
                      {entry.debit > 0 ? `$${entry.debit.toFixed(2)}` : "-"}
                    </td>

                    <td className="p-3.5 w-28 text-right font-mono text-sm text-[var(--nebula-text-primary)]">
                      {entry.credit > 0 ? `$${entry.credit.toFixed(2)}` : "-"}
                    </td>

                    <td className="p-3.5 w-32 text-right font-mono font-medium text-sm text-[var(--nebula-text-primary)]">
                      ${entry.balance.toFixed(2)}
                    </td>
                  </tr>
                );
              })}
              {entries.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-[var(--nebula-text-muted)] text-sm">
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

