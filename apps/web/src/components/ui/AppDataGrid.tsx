import { useState, type ReactNode } from "react";
import AppTable, { type Column } from "./AppTable";
import AppButton from "./AppButton";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface AppDataGridProps<T> {
  columns: Column<T>[];
  data: T[];
  pageSize?: number;
  keyExtractor?: (item: T, index: number) => string | number;
  isLoading?: boolean;
  emptyState?: ReactNode;
  onRowClick?: (item: T) => void;
}

export function AppDataGrid<T>({
  columns,
  data,
  pageSize = 10,
  keyExtractor,
  isLoading,
  emptyState,
  onRowClick,
}: AppDataGridProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(data.length / pageSize));

  const pagedData = data.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="space-y-3">
      <AppTable
        columns={columns}
        data={pagedData}
        keyExtractor={keyExtractor}
        isLoading={isLoading}
        emptyState={emptyState}
        onRowClick={onRowClick}
      />
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-2 text-xs text-[var(--nebula-text-secondary)]">
          <div>
            Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, data.length)} of {data.length} entries
          </div>
          <div className="flex items-center gap-1.5">
            <AppButton
              variant="outline"
              size="sm"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              aria-label="Previous Page"
            >
              <ChevronLeft size={14} />
            </AppButton>
            <span className="px-2 font-medium">
              Page {currentPage} of {totalPages}
            </span>
            <AppButton
              variant="outline"
              size="sm"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              aria-label="Next Page"
            >
              <ChevronRight size={14} />
            </AppButton>
          </div>
        </div>
      )}
    </div>
  );
}

export default AppDataGrid;
