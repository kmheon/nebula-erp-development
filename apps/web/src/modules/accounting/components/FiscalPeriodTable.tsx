import type { FiscalPeriod } from "../types/accounting.types";
import { AppTable, type Column, AppBadge, type BadgeTone } from "../../../components/ui";

type FiscalPeriodTableProps = {
  periods: FiscalPeriod[];
};

export default function FiscalPeriodTable({ periods }: FiscalPeriodTableProps) {
  const columns: Column<FiscalPeriod>[] = [
    {
      key: "name",
      header: "Period Name",
      className: "font-medium text-[var(--nebula-text-primary)]",
      render: (period) => period.name,
    },
    {
      key: "startDate",
      header: "Start Date",
      className: "text-[var(--nebula-text-secondary)]",
      render: (period) => period.startDate,
    },
    {
      key: "endDate",
      header: "End Date",
      className: "text-[var(--nebula-text-secondary)]",
      render: (period) => period.endDate,
    },
    {
      key: "status",
      header: "Status",
      render: (period) => {
        const badgeTone: BadgeTone =
          period.status === "open"
            ? "success"
            : period.status === "locked"
            ? "warning"
            : "danger";

        return (
          <AppBadge tone={badgeTone} size="sm" className="capitalize">
            {period.status}
          </AppBadge>
        );
      },
    },
  ];

  return (
    <AppTable
      columns={columns}
      data={periods}
      keyExtractor={(item) => item.id}
      emptyState={
        <div className="py-8 text-center text-sm text-[var(--nebula-text-muted)]">
          No fiscal periods defined.
        </div>
      }
    />
  );
}


