import type { TableHTMLAttributes, ReactNode } from "react";

export interface Column<T> {
  key: string;
  header: ReactNode;
  render?: (item: T, index: number) => ReactNode;
  align?: "left" | "center" | "right";
  width?: string;
  className?: string;
}

export interface AppTableProps<T> extends TableHTMLAttributes<HTMLTableElement> {
  columns: Column<T>[];
  data: T[];
  keyExtractor?: (item: T, index: number) => string | number;
  isLoading?: boolean;
  emptyState?: ReactNode;
  onRowClick?: (item: T) => void;
  striped?: boolean;
}

export function AppTable<T>({
  columns,
  data,
  keyExtractor,
  isLoading = false,
  emptyState,
  onRowClick,
  striped = false,
  className = "",
  ...props
}: AppTableProps<T>) {
  return (
    <div className="w-full overflow-x-auto rounded-xl border border-[var(--nebula-border)] bg-[var(--nebula-surface)] shadow-sm">
      <table className={["w-full border-collapse text-left text-sm", className].filter(Boolean).join(" ")} {...props}>
        <thead>
          <tr className="border-b border-[var(--nebula-border)] bg-[var(--nebula-surface-muted)]">
            {columns.map((col) => (
              <th
                key={col.key}
                style={{ width: col.width }}
                className={[
                  "p-3.5 text-xs font-semibold uppercase tracking-wider text-[var(--nebula-text-secondary)]",
                  col.align === "center" ? "text-center" : col.align === "right" ? "text-right" : "text-left",
                  col.className,
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--nebula-border)]">
          {isLoading ? (
            <tr>
              <td colSpan={columns.length} className="p-8 text-center text-[var(--nebula-text-muted)]">
                <div className="flex flex-col items-center justify-center gap-2">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-[var(--nebula-primary)] border-t-transparent" />
                  <span className="text-xs">Loading data...</span>
                </div>
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="p-8 text-center text-[var(--nebula-text-secondary)]">
                {emptyState || "No records found."}
              </td>
            </tr>
          ) : (
            data.map((item, index) => {
              const key = keyExtractor ? keyExtractor(item, index) : ((item as any).id ?? index);
              return (
                <tr
                  key={key}
                  onClick={() => onRowClick?.(item)}
                  className={[
                    "transition-colors duration-100",
                    onRowClick ? "cursor-pointer hover:bg-[var(--nebula-surface-muted)]/80" : "hover:bg-[var(--nebula-surface-muted)]/40",
                    striped && index % 2 === 1 ? "bg-[var(--nebula-surface-muted)]/30" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={[
                        "p-3.5 text-sm text-[var(--nebula-text-primary)]",
                        col.align === "center" ? "text-center" : col.align === "right" ? "text-right" : "text-left",
                        col.className,
                      ]
                        .filter(Boolean)
                        .join(" ")}
                    >
                      {col.render ? col.render(item, index) : ((item as any)[col.key] ?? "-")}
                    </td>
                  ))}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}

export default AppTable;
