import React, { useState } from "react";
import { Plus, CheckCircle2, AlertTriangle, Calendar } from "lucide-react";
import { initialCycleCounts } from "../services/enterprise-inventory.service";
import type { CycleCountSession } from "../types/warehouse.types";

export const CycleCountWorkspace: React.FC = () => {
  const [sessions, setSessions] = useState<CycleCountSession[]>(initialCycleCounts);
  const [showNew, setShowNew] = useState(false);
  const [notes, setNotes] = useState("");
  const [auditor, setAuditor] = useState("");

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notes || !auditor) return;
    const newSession: CycleCountSession = {
      id: `cc-${Date.now()}`,
      warehouseId: "1",
      status: "in-progress",
      assignedAuditor: auditor,
      scheduledDate: new Date().toISOString().split("T")[0],
      discrepancyCount: 0,
      notes,
    };
    setSessions([newSession, ...sessions]);
    setNotes("");
    setAuditor("");
    setShowNew(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 rounded-2xl border border-[var(--nebula-border)] bg-[var(--nebula-surface)] p-6 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-[var(--nebula-text)]">Cycle Counting & Physical Inventory Audit</h2>
          <p className="text-xs text-[var(--nebula-muted)] mt-1">
            Conduct scheduled zone audits, reconcile physical stock discrepancies, and post general ledger adjustments.
          </p>
        </div>
        <button
          onClick={() => setShowNew(!showNew)}
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors"
        >
          <Plus className="h-4 w-4" /> New Cycle Count
        </button>
      </div>

      {showNew && (
        <form onSubmit={handleCreate} className="rounded-2xl border border-[var(--nebula-border)] bg-[var(--nebula-surface)] p-6 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-[var(--nebula-text)]">Schedule Cycle Count Audit</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-[var(--nebula-muted)] mb-1">Assigned Auditor</label>
              <input
                type="text"
                required
                value={auditor}
                onChange={(e) => setAuditor(e.target.value)}
                placeholder="e.g., Sarah Jenkins"
                className="w-full rounded-xl border border-[var(--nebula-border)] bg-[var(--nebula-background)] px-3 py-2 text-sm text-[var(--nebula-text)]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-[var(--nebula-muted)] mb-1">Audit Objective / Notes</label>
              <input
                type="text"
                required
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g., Weekly high-value inventory spot check"
                className="w-full rounded-xl border border-[var(--nebula-border)] bg-[var(--nebula-background)] px-3 py-2 text-sm text-[var(--nebula-text)]"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowNew(false)}
              className="rounded-xl border border-[var(--nebula-border)] px-4 py-2 text-sm font-semibold text-[var(--nebula-text)]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500"
            >
              Schedule Audit
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 gap-4">
        {sessions.map((session) => (
          <div key={session.id} className="rounded-2xl border border-[var(--nebula-border)] bg-[var(--nebula-surface)] p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-purple-500/10 px-2.5 py-0.5 text-xs font-semibold text-purple-600 uppercase">
                  {session.id}
                </span>
                <span className="text-xs text-[var(--nebula-muted)]">Auditor: {session.assignedAuditor}</span>
              </div>
              <h3 className="text-base font-bold text-[var(--nebula-text)]">{session.notes}</h3>
              <div className="flex items-center gap-4 text-xs text-[var(--nebula-muted)] pt-1">
                <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> Scheduled: {session.scheduledDate}</span>
                {session.completedDate && <span>Completed: {session.completedDate}</span>}
                <span className="flex items-center gap-1 text-amber-600 font-semibold">
                  <AlertTriangle className="h-3.5 w-3.5" /> {session.discrepancyCount} Discrepancies
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                session.status === "reconciled" ? "bg-emerald-500/10 text-emerald-600" : "bg-blue-500/10 text-blue-600"
              }`}>
                <CheckCircle2 className="h-3.5 w-3.5" /> {session.status}
              </span>
              {session.status === "in-progress" && (
                <button
                  onClick={() => {
                    setSessions(sessions.map(s => s.id === session.id ? { ...s, status: "reconciled", completedDate: new Date().toISOString().split("T")[0] } : s));
                  }}
                  className="rounded-xl bg-emerald-600 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-500 transition-colors"
                >
                  Reconcile & Post
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
