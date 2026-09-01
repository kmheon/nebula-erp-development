import { useMemo, useState } from "react";
import { Plus, Trash2, BookOpen } from "lucide-react";
import { useJournalMutation } from "../hooks/useJournalEntries";
import {
  AppCard,
  AppInput,
  AppSelect,
  AppButton,
  AppIconButton,
  AppBadge,
  AppAlert,
} from "../../../components/ui";

import type {
  Account,
  CreateJournalLineInput,
} from "../types/accounting.types";

type JournalEntryFormProps = {
  accounts: Account[];
};

type DraftLine = {
  accountId: string;
  debit: string;
  credit: string;
};

const emptyLine: DraftLine = {
  accountId: "",
  debit: "0",
  credit: "0",
};

export default function JournalEntryForm({
  accounts,
}: JournalEntryFormProps) {
  const { create } = useJournalMutation();

  const [date, setDate] = useState("");
  const [reference, setReference] = useState("");
  const [description, setDescription] = useState("");
  const [lines, setLines] = useState<DraftLine[]>([{ ...emptyLine }]);
  const [error, setError] = useState<string | null>(null);

  const { totalDebit, totalCredit } = useMemo(() => {
    const debit = lines.reduce(
      (sum, line) => sum + (Number(line.debit) || 0),
      0,
    );
    const credit = lines.reduce(
      (sum, line) => sum + (Number(line.credit) || 0),
      0,
    );

    return { totalDebit: debit, totalCredit: credit };
  }, [lines]);

  function updateLine(
    index: number,
    key: keyof DraftLine,
    value: string,
  ) {
    setLines((prev) =>
      prev.map((line, i) =>
        i === index ? { ...line, [key]: value } : line,
      ),
    );
  }

  function addLine() {
    setLines((prev) => [...prev, { ...emptyLine }]);
  }

  function removeLine(index: number) {
    setLines((prev) => prev.filter((_, i) => i !== index));
  }

  function submit() {
    setError(null);

    if (!date) {
      setError("Journal entry date is required.");
      return;
    }

    const parsed: CreateJournalLineInput[] = lines
      .map((line) => ({
        accountId: line.accountId,
        debit: Number(line.debit) || 0,
        credit: Number(line.credit) || 0,
      }))
      .filter((line) => line.accountId);

    if (parsed.length === 0) {
      setError("Add at least one line with an account.");
      return;
    }

    if (parsed.some((line) => line.debit === 0 && line.credit === 0)) {
      setError("Each line must have a debit or credit amount.");
      return;
    }

    const debit = parsed.reduce((sum, line) => sum + line.debit, 0);
    const credit = parsed.reduce((sum, line) => sum + line.credit, 0);

    if (Math.abs(debit - credit) > 0.001) {
      setError(
        `Cannot save unbalanced entry. Debit (${debit.toFixed(2)}) must equal Credit (${credit.toFixed(2)}).`,
      );
      return;
    }

    create.mutate({
      date,
      reference,
      description,
      lines: parsed,
    });

    setDate("");
    setReference("");
    setDescription("");
    setLines([{ ...emptyLine }]);
  }

  const balanced = Math.abs(totalDebit - totalCredit) < 0.001;

  return (
    <AppCard
      title={
        <span className="flex items-center gap-2">
          <BookOpen size={18} />
          Record New Journal Entry
        </span>
      }
      subtitle="Create balanced double-entry transactions posted directly to general ledger accounts."
    >
      <div className="space-y-5">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <AppInput
            type="date"
            label="Transaction Date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />

          <AppInput
            label="Reference #"
            placeholder="e.g. JE-2026-0042"
            value={reference}
            onChange={(e) => setReference(e.target.value)}
          />

          <AppInput
            label="Description / Narration"
            placeholder="e.g. Monthly rent allocation"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="space-y-3 pt-2">
          <div className="hidden grid-cols-12 gap-3 px-2 text-xs font-semibold uppercase tracking-wider text-[var(--nebula-text-secondary)] md:grid">
            <span className="col-span-6">GL Account</span>
            <span className="col-span-2 text-right">Debit ($)</span>
            <span className="col-span-2 text-right">Credit ($)</span>
            <span className="col-span-2 text-center">Action</span>
          </div>

          {lines.map((line, index) => (
            <div
              key={index}
              className="grid grid-cols-1 gap-3 rounded-lg border border-[var(--nebula-border)] bg-[var(--nebula-surface-muted)]/50 p-3 md:grid-cols-12 md:items-center"
            >
              <div className="md:col-span-6">
                <AppSelect
                  value={line.accountId}
                  onChange={(e) =>
                    updateLine(index, "accountId", e.target.value)
                  }
                >
                  <option value="">Select Account</option>
                  {accounts.map((account) => (
                    <option key={account.id} value={account.id}>
                      {account.code} - {account.name}
                    </option>
                  ))}
                </AppSelect>
              </div>

              <div className="md:col-span-2">
                <AppInput
                  type="number"
                  min="0"
                  step="0.01"
                  className="text-right font-mono"
                  placeholder="0.00"
                  value={line.debit}
                  onChange={(e) => updateLine(index, "debit", e.target.value)}
                />
              </div>

              <div className="md:col-span-2">
                <AppInput
                  type="number"
                  min="0"
                  step="0.01"
                  className="text-right font-mono"
                  placeholder="0.00"
                  value={line.credit}
                  onChange={(e) =>
                    updateLine(index, "credit", e.target.value)
                  }
                />
              </div>

              <div className="flex justify-center md:col-span-2">
                <AppIconButton
                  icon={<Trash2 size={16} />}
                  variant="ghost"
                  aria-label="Remove line"
                  onClick={() => removeLine(index)}
                  disabled={lines.length <= 1}
                />
              </div>
            </div>
          ))}

          <AppButton
            type="button"
            variant="outline"
            size="sm"
            leftIcon={<Plus size={14} />}
            onClick={addLine}
          >
            Add Line
          </AppButton>
        </div>

        <div className="flex flex-wrap items-center justify-between rounded-lg border border-[var(--nebula-border)] bg-[var(--nebula-surface-muted)] p-4 text-sm font-medium">
          <div className="flex items-center gap-6 font-mono">
            <span>Total Debit: <strong className="text-[var(--nebula-text-primary)]">${totalDebit.toFixed(2)}</strong></span>
            <span>Total Credit: <strong className="text-[var(--nebula-text-primary)]">${totalCredit.toFixed(2)}</strong></span>
          </div>

          <AppBadge tone={balanced ? "success" : "danger"}>
            {balanced ? "✓ Balanced" : "⚠ Unbalanced"}
          </AppBadge>
        </div>

        {error && (
          <AppAlert tone="danger">
            {error}
          </AppAlert>
        )}

        <div className="flex justify-end pt-2">
          <AppButton
            variant="primary"
            onClick={submit}
          >
            Create Journal Entry
          </AppButton>
        </div>
      </div>
    </AppCard>
  );
}
