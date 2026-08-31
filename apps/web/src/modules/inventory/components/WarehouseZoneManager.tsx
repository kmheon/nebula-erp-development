import React, { useState } from "react";
import { Plus, MapPin, Layers, Thermometer, CheckCircle2 } from "lucide-react";
import { initialZones, initialBins } from "../services/enterprise-inventory.service";
import type { WarehouseZone, WarehouseBin } from "../types/warehouse.types";

export const WarehouseZoneManager: React.FC = () => {
  const [zones, setZones] = useState<WarehouseZone[]>(initialZones);
  const [bins] = useState<WarehouseBin[]>(initialBins);
  const [showAddZone, setShowAddZone] = useState(false);
  const [newZoneName, setNewZoneName] = useState("");
  const [newZoneCode, setNewZoneCode] = useState("");
  const [newZoneType, setNewZoneType] = useState<WarehouseZone["type"]>("storage");

  const handleAddZone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newZoneName || !newZoneCode) return;
    const zone: WarehouseZone = {
      id: `zone-${Date.now()}`,
      warehouseId: "1",
      name: newZoneName,
      code: newZoneCode,
      type: newZoneType,
      temperatureControlled: newZoneType === "cold-storage",
      status: "active",
      createdAt: new Date().toISOString().split("T")[0],
    };
    setZones([zone, ...zones]);
    setNewZoneName("");
    setNewZoneCode("");
    setShowAddZone(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 rounded-2xl border border-[var(--nebula-border)] bg-[var(--nebula-surface)] p-6 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-[var(--nebula-text)]">Warehouse Zones, Racks & Bins</h2>
          <p className="text-xs text-[var(--nebula-muted)] mt-1">
            Configure multi-zone layouts, temperature-controlled aisles, and bin-level location granularity.
          </p>
        </div>
        <button
          onClick={() => setShowAddZone(!showAddZone)}
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors"
        >
          <Plus className="h-4 w-4" /> Add Zone
        </button>
      </div>

      {showAddZone && (
        <form onSubmit={handleAddZone} className="rounded-2xl border border-[var(--nebula-border)] bg-[var(--nebula-surface)] p-6 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-[var(--nebula-text)]">Create Warehouse Zone</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-[var(--nebula-muted)] mb-1">Zone Name</label>
              <input
                type="text"
                required
                value={newZoneName}
                onChange={(e) => setNewZoneName(e.target.value)}
                placeholder="e.g., Zone C - Heavy Industrial"
                className="w-full rounded-xl border border-[var(--nebula-border)] bg-[var(--nebula-background)] px-3 py-2 text-sm text-[var(--nebula-text)]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-[var(--nebula-muted)] mb-1">Zone Code</label>
              <input
                type="text"
                required
                value={newZoneCode}
                onChange={(e) => setNewZoneCode(e.target.value)}
                placeholder="e.g., ZC-HVY"
                className="w-full rounded-xl border border-[var(--nebula-border)] bg-[var(--nebula-background)] px-3 py-2 text-sm text-[var(--nebula-text)]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-[var(--nebula-muted)] mb-1">Zone Type</label>
              <select
                value={newZoneType}
                onChange={(e) => setNewZoneType(e.target.value as WarehouseZone["type"])}
                className="w-full rounded-xl border border-[var(--nebula-border)] bg-[var(--nebula-background)] px-3 py-2 text-sm text-[var(--nebula-text)] capitalize"
              >
                <option value="storage">Storage</option>
                <option value="receiving">Receiving Dock</option>
                <option value="dispatch">Dispatch Dock</option>
                <option value="quarantine">Quarantine</option>
                <option value="returns">Returns Area</option>
                <option value="cold-storage">Cold Storage</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowAddZone(false)}
              className="rounded-xl border border-[var(--nebula-border)] px-4 py-2 text-sm font-semibold text-[var(--nebula-text)] hover:bg-[var(--nebula-surface-hover)]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500"
            >
              Save Zone
            </button>
          </div>
        </form>
      )}

      {/* Zones Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {zones.map((zone) => (
          <div key={zone.id} className="rounded-2xl border border-[var(--nebula-border)] bg-[var(--nebula-surface)] p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="rounded-lg bg-blue-500/10 px-2.5 py-1 text-xs font-mono font-bold text-blue-600 uppercase">
                {zone.code}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-600">
                <CheckCircle2 className="h-3 w-3" /> {zone.status}
              </span>
            </div>

            <div>
              <h3 className="text-base font-bold text-[var(--nebula-text)]">{zone.name}</h3>
              <div className="flex items-center gap-4 mt-2 text-xs text-[var(--nebula-muted)]">
                <span className="capitalize inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> Type: {zone.type}</span>
                {zone.temperatureControlled && (
                  <span className="inline-flex items-center gap-1 text-cyan-600"><Thermometer className="h-3.5 w-3.5" /> Climate Controlled</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bin Locations Table */}
      <div className="rounded-2xl border border-[var(--nebula-border)] bg-[var(--nebula-surface)] p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-[var(--nebula-text)]">Bin & Rack Capacity Registry</h3>
            <p className="text-xs text-[var(--nebula-muted)]">Real-time weight and capacity utilization per bin location</p>
          </div>
          <button
            onClick={() => alert("Bin location optimizer available in enterprise tier.")}
            className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--nebula-border)] bg-[var(--nebula-background)] px-3 py-2 text-xs font-semibold text-[var(--nebula-text)] hover:bg-[var(--nebula-surface-hover)]"
          >
            <Layers className="h-4 w-4" /> Optimize Bins
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[var(--nebula-border)] text-xs font-semibold uppercase text-[var(--nebula-muted)]">
                <th className="py-3 px-4">Bin Code</th>
                <th className="py-3 px-4">Level / Pos</th>
                <th className="py-3 px-4">Capacity (Kg)</th>
                <th className="py-3 px-4">Current Weight (Kg)</th>
                <th className="py-3 px-4">Utilization</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--nebula-border)] text-sm">
              {bins.map((bin) => {
                const pct = Math.round((bin.currentWeightKg / bin.capacityKg) * 100);
                return (
                  <tr key={bin.id} className="hover:bg-[var(--nebula-surface-hover)] transition-colors">
                    <td className="py-3 px-4 font-mono font-semibold text-[var(--nebula-text)]">{bin.code}</td>
                    <td className="py-3 px-4 text-[var(--nebula-muted)]">L{bin.level} - {bin.position}</td>
                    <td className="py-3 px-4 text-[var(--nebula-text)]">{bin.capacityKg} kg</td>
                    <td className="py-3 px-4 text-[var(--nebula-text)]">{bin.currentWeightKg} kg</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${pct > 90 ? "bg-rose-500" : pct > 75 ? "bg-amber-500" : "bg-emerald-500"}`}
                            style={{ width: `${Math.min(pct, 100)}%` }}
                          />
                        </div>
                        <span className="text-xs font-semibold text-[var(--nebula-muted)]">{pct}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${
                        bin.status === "available" ? "bg-emerald-500/10 text-emerald-600" :
                        bin.status === "reserved" ? "bg-blue-500/10 text-blue-600" :
                        bin.status === "full" ? "bg-amber-500/10 text-amber-600" : "bg-rose-500/10 text-rose-600"
                      }`}>
                        {bin.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
