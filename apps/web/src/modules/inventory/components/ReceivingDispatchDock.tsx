import React, { useState } from "react";
import { ArrowDownRight, ArrowUpRight, CheckCircle2, ShieldAlert } from "lucide-react";
import { initialReceivingOrders, initialDispatchOrders } from "../services/enterprise-inventory.service";
import type { ReceivingOrder, DispatchOrder } from "../types/warehouse.types";

export const ReceivingDispatchDock: React.FC = () => {
  const [receiving, setReceiving] = useState<ReceivingOrder[]>(initialReceivingOrders);
  const [dispatch, setDispatch] = useState<DispatchOrder[]>(initialDispatchOrders);
  const [activeTab, setActiveTab] = useState<"receiving" | "dispatch">("receiving");

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 rounded-2xl border border-[var(--nebula-border)] bg-[var(--nebula-surface)] p-6 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-[var(--nebula-text)]">Inbound Receiving & Outbound Dispatch Docks</h2>
          <p className="text-xs text-[var(--nebula-muted)] mt-1">
            Manage purchase order receiving dock inspections, 3-way matching validation, and outbound picking/dispatch workflows.
          </p>
        </div>

        <div className="flex items-center gap-1 bg-[var(--nebula-surface)] p-1 rounded-xl border border-[var(--nebula-border)]">
          <button
            onClick={() => setActiveTab("receiving")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              activeTab === "receiving" ? "bg-blue-600 text-white" : "text-[var(--nebula-text)] hover:bg-[var(--nebula-surface-hover)]"
            }`}
          >
            <ArrowDownRight className="h-4 w-4" /> Receiving Dock ({receiving.length})
          </button>
          <button
            onClick={() => setActiveTab("dispatch")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              activeTab === "dispatch" ? "bg-blue-600 text-white" : "text-[var(--nebula-text)] hover:bg-[var(--nebula-surface-hover)]"
            }`}
          >
            <ArrowUpRight className="h-4 w-4" /> Dispatch Dock ({dispatch.length})
          </button>
        </div>
      </div>

      {activeTab === "receiving" ? (
        <div className="rounded-2xl border border-[var(--nebula-border)] bg-[var(--nebula-surface)] p-6 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-[var(--nebula-text)]">Inbound Receiving & Inspection Queue</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[var(--nebula-border)] text-xs font-semibold uppercase text-[var(--nebula-muted)]">
                  <th className="py-3 px-4">PO Number</th>
                  <th className="py-3 px-4">Supplier Name</th>
                  <th className="py-3 px-4">Expected Date</th>
                  <th className="py-3 px-4">Items Count</th>
                  <th className="py-3 px-4">Inspection QA</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--nebula-border)] text-sm">
                {receiving.map((rcv) => (
                  <tr key={rcv.id} className="hover:bg-[var(--nebula-surface-hover)] transition-colors">
                    <td className="py-3 px-4 font-mono font-semibold text-[var(--nebula-text)]">{rcv.poNumber}</td>
                    <td className="py-3 px-4 font-medium text-[var(--nebula-text)]">{rcv.supplierName}</td>
                    <td className="py-3 px-4 text-[var(--nebula-muted)]">{rcv.expectedDate}</td>
                    <td className="py-3 px-4 text-[var(--nebula-text)]">{rcv.itemCount} units</td>
                    <td className="py-3 px-4">
                      {rcv.inspectionPassed ? (
                        <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold text-xs">
                          <CheckCircle2 className="h-3.5 w-3.5" /> Passed
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-amber-600 font-semibold text-xs">
                          <ShieldAlert className="h-3.5 w-3.5" /> Pending QA
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span className="rounded-full bg-blue-500/10 px-2.5 py-0.5 text-xs font-semibold text-blue-600 capitalize">
                        {rcv.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {rcv.status !== "received" && (
                        <button
                          onClick={() => {
                            setReceiving(receiving.map(r => r.id === rcv.id ? { ...r, status: "received", receivedDate: new Date().toISOString().split("T")[0] } : r));
                          }}
                          className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-500 transition-colors"
                        >
                          Receive Stock
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-[var(--nebula-border)] bg-[var(--nebula-surface)] p-6 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-[var(--nebula-text)]">Outbound Dispatch & Picking Queue</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[var(--nebula-border)] text-xs font-semibold uppercase text-[var(--nebula-muted)]">
                  <th className="py-3 px-4">SO Number</th>
                  <th className="py-3 px-4">Customer Name</th>
                  <th className="py-3 px-4">Picking Method</th>
                  <th className="py-3 px-4">Carrier</th>
                  <th className="py-3 px-4">Tracking #</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--nebula-border)] text-sm">
                {dispatch.map((dsp) => (
                  <tr key={dsp.id} className="hover:bg-[var(--nebula-surface-hover)] transition-colors">
                    <td className="py-3 px-4 font-mono font-semibold text-[var(--nebula-text)]">{dsp.soNumber}</td>
                    <td className="py-3 px-4 font-medium text-[var(--nebula-text)]">{dsp.customerName}</td>
                    <td className="py-3 px-4">
                      <span className="rounded-md bg-purple-500/10 px-2 py-0.5 text-xs font-mono font-bold text-purple-600">
                        {dsp.pickingMethod}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-[var(--nebula-muted)]">{dsp.carrier}</td>
                    <td className="py-3 px-4 font-mono text-xs text-[var(--nebula-text)]">{dsp.trackingNumber}</td>
                    <td className="py-3 px-4">
                      <span className="rounded-full bg-blue-500/10 px-2.5 py-0.5 text-xs font-semibold text-blue-600 capitalize">
                        {dsp.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {dsp.status !== "dispatched" && (
                        <button
                          onClick={() => {
                            setDispatch(dispatch.map(d => d.id === dsp.id ? { ...d, status: "dispatched" } : d));
                          }}
                          className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-500 transition-colors"
                        >
                          Dispatch Order
                        </button>
                      )}
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
