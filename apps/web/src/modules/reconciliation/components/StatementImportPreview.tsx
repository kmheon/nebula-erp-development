import { useState } from "react";
import { Upload, FileSpreadsheet } from "lucide-react";
import type { CreateBankTransactionInput } from "../types/reconciliation.types";

interface StatementImportPreviewProps {
  onImport: (data: CreateBankTransactionInput) => void;
  accountId: string;
}

export default function StatementImportPreview({ onImport, accountId }: StatementImportPreviewProps) {
  const [parsedRows, setParsedRows] = useState<CreateBankTransactionInput[]>([]);
  const [isSimulated, setIsSimulated] = useState(false);

  function handleSimulateUpload() {
    const mockRows: CreateBankTransactionInput[] = [
      {
        accountId,
        date: new Date().toISOString().split("T")[0],
        description: "Customer Wire Transfer - Global Freight Inc",
        reference: "WIRE-9921",
        invoiceNumber: "INV-2026-042",
        partyName: "Global Freight Inc",
        amount: 8750.00,
        currency: "USD",
        type: "deposit",
      },
      {
        accountId,
        date: new Date().toISOString().split("T")[0],
        description: "Office Rent Payment - Metro Properties",
        reference: "RENT-AUG",
        amount: 3200.00,
        currency: "USD",
        type: "withdrawal",
      },
    ];
    setParsedRows(mockRows);
    setIsSimulated(true);
  }

  function handleCommitImport() {
    for (const row of parsedRows) {
      onImport(row);
    }
    setParsedRows([]);
    setIsSimulated(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-[var(--nebula-border)] bg-[var(--nebula-surface)] p-6 shadow-sm">
        <h2 className="text-lg font-bold mb-2">Statement File Import & MT940 Parser</h2>
        <p className="text-sm text-[var(--nebula-text-secondary)] mb-6">
          Upload bank statement CSV, OFX, or MT940 files. The enterprise parser automatically validates currency codes, dates, and amounts.
        </p>

        <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-[var(--nebula-border)] p-8 text-center bg-[var(--nebula-surface-subtle)]">
          <Upload size={40} className="text-[var(--nebula-text-secondary)] mb-3" />
          <p className="text-sm font-semibold text-[var(--nebula-text-primary)] mb-1">
            Drag and drop statement file here, or click to browse
          </p>
          <p className="text-xs text-[var(--nebula-text-secondary)] mb-4">
            Supports CSV, TXT, OFX, MT940 (Up to 50MB)
          </p>
          <button
            onClick={handleSimulateUpload}
            className="rounded-lg bg-[var(--nebula-primary)] px-4 py-2 text-sm font-medium text-white shadow-sm hover:opacity-90 transition-opacity"
          >
            Simulate File Upload & Parse
          </button>
        </div>
      </div>

      {isSimulated && parsedRows.length > 0 && (
        <div className="rounded-xl border border-[var(--nebula-border)] bg-[var(--nebula-surface)] p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="text-emerald-600" size={20} />
              <h3 className="font-bold">Statement Parse Preview ({parsedRows.length} transactions found)</h3>
            </div>
            <button
              onClick={handleCommitImport}
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:opacity-90 transition-opacity"
            >
              Commit & Import to Reconciliation Queue
            </button>
          </div>

          <div className="overflow-x-auto rounded-lg border border-[var(--nebula-border)]">
            <table className="w-full text-left text-sm">
              <thead className="bg-[var(--nebula-surface-muted)] text-xs font-semibold uppercase text-[var(--nebula-text-secondary)]">
                <tr>
                  <th className="px-4 py-2.5">Date</th>
                  <th className="px-4 py-2.5">Description</th>
                  <th className="px-4 py-2.5">Reference</th>
                  <th className="px-4 py-2.5">Party</th>
                  <th className="px-4 py-2.5 text-right">Amount</th>
                  <th className="px-4 py-2.5 text-center">Type</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--nebula-border)]">
                {parsedRows.map((row, idx) => (
                  <tr key={idx} className="hover:bg-[var(--nebula-surface-muted)]/50">
                    <td className="px-4 py-2.5 font-mono">{row.date}</td>
                    <td className="px-4 py-2.5">{row.description}</td>
                    <td className="px-4 py-2.5 font-mono">{row.reference}</td>
                    <td className="px-4 py-2.5 font-medium">{row.partyName}</td>
                    <td className="px-4 py-2.5 text-right font-mono font-bold">${row.amount.toFixed(2)}</td>
                    <td className="px-4 py-2.5 text-center uppercase text-xs font-semibold">{row.type}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
