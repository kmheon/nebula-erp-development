import type { JournalEntry } from "../types/accounting.types";
import {
  AppTable,
  type Column,
  AppBadge,
  type BadgeTone,
  AppButton,
} from "../../../components/ui";

type JournalEntryTableProps = {
  entries: JournalEntry[];
  onPost?: (id: string) => void;
};

function entryTotal(entry: JournalEntry): number {
  return entry.lines.reduce((sum, line) => sum + line.debit, 0);
}

export default function JournalEntryTable({
  entries,
  onPost,
}: JournalEntryTableProps) {
  const columns: Column<JournalEntry>[] = [
    {
      key: "date",
      header: "Date",
      className: "text-[var(--nebula-text-secondary)]",
      render: (entry) => entry.date,
    },
    {
      key: "reference",
      header: "Reference",
      className: "font-mono font-medium text-[var(--nebula-text-primary)]",
      render: (entry) => entry.reference,
    },
    {
      key: "description",
      header: "Description",
      className: "text-[var(--nebula-text-primary)] max-w-xs truncate",
      render: (entry) => entry.description,
    },
    {
      key: "status",
      header: "Status",
      render: (entry) => {
        const badgeTone: BadgeTone =
          entry.status === "posted"
            ? "success"
            : entry.status === "cancelled"
            ? "danger"
            : "neutral";

        return (
          <AppBadge tone={badgeTone} size="sm" className="capitalize">
            {entry.status}
          </AppBadge>
        );
      },
    },
    {
      key: "total",
      header: "Total",
      align: "right",
      className: "text-right font-mono font-medium text-[var(--nebula-text-primary)]",
      render: (entry) => `$${entryTotal(entry).toFixed(2)}`,
    },
    {
      key: "actions",
      header: "Action",
      align: "right",
      render: (entry) =>
        entry.status === "draft" && onPost ? (
          <AppButton
            variant="primary"
            size="sm"
            onClick={() => onPost(entry.id)}
          >
            Post
          </AppButton>
        ) : null,
    },
  ];

  return (
    <AppTable
      columns={columns}
      data={entries}
      keyExtractor={(item) => item.id}
      emptyState={
        <div className="py-8 text-center text-sm text-[var(--nebula-text-muted)]">
          No journal entries recorded yet.
        </div>
      }
    />
  );
}

