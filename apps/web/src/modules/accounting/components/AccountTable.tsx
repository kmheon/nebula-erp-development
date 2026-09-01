import type { Account } from "../types/accounting.types";
import { AppTable, type Column, AppBadge } from "../../../components/ui";

type AccountTableProps = {
  accounts: Account[];
};

export default function AccountTable({ accounts }: AccountTableProps) {
  const columns: Column<Account>[] = [
    {
      key: "code",
      header: "Code",
      className: "font-mono font-medium text-[var(--nebula-text-primary)]",
      render: (account) => account.code,
    },
    {
      key: "name",
      header: "Account Name",
      className: "font-medium text-[var(--nebula-text-primary)]",
      render: (account) => account.name,
    },
    {
      key: "type",
      header: "Type",
      render: (account) => (
        <AppBadge variant="outline" size="sm" className="capitalize">
          {account.type}
        </AppBadge>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (account) => (
        <AppBadge
          tone={account.status === "active" ? "success" : "neutral"}
          size="sm"
          className="capitalize"
        >
          {account.status}
        </AppBadge>
      ),
    },
  ];

  return (
    <AppTable
      columns={columns}
      data={accounts}
      keyExtractor={(item) => item.id}
      emptyState={
        <div className="py-8 text-center text-sm text-[var(--nebula-text-muted)]">
          No accounts found.
        </div>
      }
    />
  );
}

