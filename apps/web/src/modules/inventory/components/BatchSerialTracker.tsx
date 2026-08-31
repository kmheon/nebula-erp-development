import React, { useState } from "react";
import { QrCode, ShieldCheck, Calendar, Tag } from "lucide-react";
import { initialBatches, initialSerials } from "../services/enterprise-inventory.service";
import type { BatchLotRecord, SerialNumberRecord } from "../types/tracking.types";

export const BatchSerialTracker: React.FC = () => {
  const [batches] = useState<BatchLotRecord[]>(initialBatches);
  const [serials] = useState<SerialNumberRecord[]>(initialSerials);
  const [activeTab, setActiveTab] = useState<"batches" | "serials">("batches");
  const [pickingStrategy, setPickingStrategy] = useState<"FEFO" | "FIFO" | "LIFO">("FEFO");

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 rounded-2xl border border-[var(--nebula-border)] bg-[var(--nebula-surface)] p-6 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-[var(--nebula-text)]">Batch, Lot & Serial Number Traceability</h2>
          <p className="text-xs text-[var(--nebula-muted)] mt-1">
            Track lot numbers, expiry dates, warranty records, and automated {pickingStrategy} picking rules.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-[var(--nebula-background)] p-1 rounded-xl border border-[var(--nebula-border)]">
            <span className="text-xs font-semibold px-2 text-[var(--nebula-muted)]">Picking Rule:</span>
            {(["FEFO", "FIFO", "LIFO"] as const).map((strat) => (
              <button
                key={strat}
                onClick={() => setPickingStrategy(strat)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                  pickingStrategy === strat ? "bg-blue-600 text-white" : "text-[var(--nebula-text)] hover:bg-[var(--nebula-surface-hover)]"
                }`}
              >
                {strat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 bg-[var(--nebula-surface)] p-1 rounded-xl border border-[var(--nebula-border)]">
            <button
              onClick={() => setActiveTab("batches")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === "batches" ? "bg-blue-600 text-white" : "text-[var(--nebula-text)] hover:bg-[var(--nebula-surface-hover)]"
              }`}
            >
              Batches ({batches.length})
            </button>
            <button
              onClick={() => setActiveTab("serials")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === "serials" ? "bg-blue-600 text-white" : "text-[var(--nebula-text)] hover:bg-[var(--nebula-surface-hover)]"
              }`}
            >
              Serial Numbers ({serials.length})
            </button>
          </div>
        </div>
      </div>

      {activeTab === "batches" ? (
        <div className="rounded-2xl border border-[var(--nebula-border)] bg-[var(--nebula-surface)] p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-[var(--nebula-text)]">Active Batch & Expiry Management</h3>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-500/10 px-3 py-1 rounded-full flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5" /> Expiry Guard Active
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[var(--nebula-border)] text-xs font-semibold uppercase text-[var(--nebula-muted)]">
                  <th className="py-3 px-4">Batch / Lot #</th>
                  <th className="py-3 px-4">Product Name</th>
                  <th className="py-3 px-4">Mfg Date</th>
                  <th className="py-3 px-4">Expiry Date</th>
                  <th className="py-3 px-4">Quantity</th>
                  <th className="py-3 px-4">Quality Status</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--nebula-border)] text-sm">
                {batches.map((batch) => (
                  <tr key={batch.id} className="hover:bg-[var(--nebula-surface-hover)] transition-colors">
                    <td className="py-3 px-4 font-mono font-semibold text-[var(--nebula-text)]">
                      {batch.batchNumber}
                      <span className="block text-[11px] text-[var(--nebula-muted)] font-normal">{batch.lotNumber}</span>
                    </td>
                    <td className="py-3 px-4 font-medium text-[var(--nebula-text)]">{batch.productName}</td>
                    <td className="py-3 px-4 text-[var(--nebula-muted)]">{batch.manufacturingDate}</td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 text-[var(--nebula-text)]">
                        <Calendar className="h-3.5 w-3.5 text-blue-500" /> {batch.expiryDate}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-[var(--nebula-text)]">{batch.quantity} units</td>
                    <td className="py-3 px-4">
                      <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 capitalize">
                        {batch.qualityStatus}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="rounded-full bg-blue-500/10 px-2.5 py-0.5 text-xs font-semibold text-blue-600 capitalize">
                        {batch.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-[var(--nebula-border)] bg-[var(--nebula-surface)] p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-[var(--nebula-text)]">Individual Serial Number Registry</h3>
            <span className="text-xs font-semibold text-blue-600 bg-blue-500/10 px-3 py-1 rounded-full flex items-center gap-1">
              <QrCode className="h-3.5 w-3.5" /> Unique Unit Traceability
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[var(--nebula-border)] text-xs font-semibold uppercase text-[var(--nebula-muted)]">
                  <th className="py-3 px-4">Serial Number</th>
                  <th className="py-3 px-4">Product Name</th>
                  <th className="py-3 px-4">Batch #</th>
                  <th className="py-3 px-4">Received Date</th>
                  <th className="py-3 px-4">Warranty Expiry</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--nebula-border)] text-sm">
                {serials.map((ser) => (
                  <tr key={ser.id} className="hover:bg-[var(--nebula-surface-hover)] transition-colors">
                    <td className="py-3 px-4 font-mono font-semibold text-[var(--nebula-text)] flex items-center gap-1.5">
                      <Tag className="h-3.5 w-3.5 text-purple-500" /> {ser.serialNumber}
                    </td>
                    <td className="py-3 px-4 font-medium text-[var(--nebula-text)]">{ser.productName}</td>
                    <td className="py-3 px-4 text-[var(--nebula-muted)] font-mono">{ser.batchNumber || "N/A"}</td>
                    <td className="py-3 px-4 text-[var(--nebula-muted)]">{ser.receivedDate}</td>
                    <td className="py-3 px-4 text-[var(--nebula-muted)]">{ser.warrantyExpiry || "N/A"}</td>
                    <td className="py-3 px-4">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${
                        ser.status === "in-stock" ? "bg-emerald-500/10 text-emerald-600" :
                        ser.status === "allocated" ? "bg-amber-500/10 text-amber-600" : "bg-purple-500/10 text-purple-600"
                      }`}>
                        {ser.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
