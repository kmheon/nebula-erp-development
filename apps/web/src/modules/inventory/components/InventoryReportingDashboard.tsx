import React, { useState } from "react";
import { DollarSign, Clock, ShieldAlert, Sliders, TrendingUp } from "lucide-react";
import { initialValuationItems, initialAgingItems, initialABCItems, initialReorderRules, initialDeadStock } from "../services/enterprise-inventory.service";

export const InventoryReportingDashboard: React.FC = () => {
  const [reportTab, setReportTab] = useState<"valuation" | "aging" | "abc" | "reorder" | "dead">("valuation");

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 rounded-2xl border border-[var(--nebula-border)] bg-[var(--nebula-surface)] p-6 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-[var(--nebula-text)]">Enterprise Inventory & Warehouse Analytics</h2>
          <p className="text-xs text-[var(--nebula-muted)] mt-1">
            Valuation ledgers, inventory aging, ABC classification, automated reorder triggers, and dead stock liquidation analysis.
          </p>
        </div>

        <div className="flex items-center gap-1 bg-[var(--nebula-surface)] p-1.5 rounded-xl border border-[var(--nebula-border)] overflow-x-auto">
          {[
            { id: "valuation", label: "Valuation", icon: DollarSign },
            { id: "aging", label: "Aging", icon: Clock },
            { id: "abc", label: "ABC Analysis", icon: TrendingUp },
            { id: "reorder", label: "Reorder Rules", icon: Sliders },
            { id: "dead", label: "Dead Stock", icon: ShieldAlert },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = reportTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setReportTab(tab.id as any)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                  isActive ? "bg-blue-600 text-white shadow-sm" : "text-[var(--nebula-text)] hover:bg-[var(--nebula-surface-hover)]"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {reportTab === "valuation" && (
        <div className="rounded-2xl border border-[var(--nebula-border)] bg-[var(--nebula-surface)] p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-[var(--nebula-text)]">Stock Valuation Report (Weighted Average & FIFO)</h3>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-500/10 px-3 py-1 rounded-full">
              Total Valuation: $40,000.00
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[var(--nebula-border)] text-xs font-semibold uppercase text-[var(--nebula-muted)]">
                  <th className="py-3 px-4">SKU & Product</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Total Quantity</th>
                  <th className="py-3 px-4">Average Cost</th>
                  <th className="py-3 px-4">Total Valuation</th>
                  <th className="py-3 px-4">Method</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--nebula-border)] text-sm">
                {initialValuationItems.map((item) => (
                  <tr key={item.productId} className="hover:bg-[var(--nebula-surface-hover)] transition-colors">
                    <td className="py-3 px-4 font-semibold text-[var(--nebula-text)]">
                      {item.productName}
                      <span className="block text-[11px] text-[var(--nebula-muted)] font-mono">{item.sku}</span>
                    </td>
                    <td className="py-3 px-4 text-[var(--nebula-muted)]">{item.category}</td>
                    <td className="py-3 px-4 font-semibold text-[var(--nebula-text)]">{item.totalQuantity}</td>
                    <td className="py-3 px-4 text-[var(--nebula-text)]">${item.averageCost.toLocaleString()}</td>
                    <td className="py-3 px-4 font-bold text-emerald-600">${item.totalValuation.toLocaleString()}</td>
                    <td className="py-3 px-4">
                      <span className="rounded-md bg-blue-500/10 px-2 py-0.5 text-xs font-mono font-bold text-blue-600">
                        {item.valuationMethod}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {reportTab === "aging" && (
        <div className="rounded-2xl border border-[var(--nebula-border)] bg-[var(--nebula-surface)] p-6 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-[var(--nebula-text)]">Inventory Aging Analysis (0-30 to 90+ Days)</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[var(--nebula-border)] text-xs font-semibold uppercase text-[var(--nebula-muted)]">
                  <th className="py-3 px-4">Product Name</th>
                  <th className="py-3 px-4">Warehouse</th>
                  <th className="py-3 px-4">0-30 Days</th>
                  <th className="py-3 px-4">31-60 Days</th>
                  <th className="py-3 px-4">61-90 Days</th>
                  <th className="py-3 px-4">90+ Days</th>
                  <th className="py-3 px-4">Health Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--nebula-border)] text-sm">
                {initialAgingItems.map((item) => (
                  <tr key={item.productId} className="hover:bg-[var(--nebula-surface-hover)] transition-colors">
                    <td className="py-3 px-4 font-semibold text-[var(--nebula-text)]">
                      {item.productName}
                      <span className="block text-[11px] text-[var(--nebula-muted)] font-mono">{item.sku}</span>
                    </td>
                    <td className="py-3 px-4 text-[var(--nebula-muted)]">{item.warehouseName}</td>
                    <td className="py-3 px-4 text-[var(--nebula-text)]">{item.days0to30}</td>
                    <td className="py-3 px-4 text-[var(--nebula-text)]">{item.days31to60}</td>
                    <td className="py-3 px-4 text-[var(--nebula-text)]">{item.days61to90}</td>
                    <td className="py-3 px-4 font-bold text-rose-600">{item.daysOver90}</td>
                    <td className="py-3 px-4">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${
                        item.status === "healthy" ? "bg-emerald-500/10 text-emerald-600" : "bg-amber-500/10 text-amber-600"
                      }`}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {reportTab === "abc" && (
        <div className="rounded-2xl border border-[var(--nebula-border)] bg-[var(--nebula-surface)] p-6 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-[var(--nebula-text)]">ABC Inventory Classification (Pareto Analysis)</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[var(--nebula-border)] text-xs font-semibold uppercase text-[var(--nebula-muted)]">
                  <th className="py-3 px-4">ABC Class</th>
                  <th className="py-3 px-4">Product Name</th>
                  <th className="py-3 px-4">Annual Consumption Value</th>
                  <th className="py-3 px-4">% of Total Value</th>
                  <th className="py-3 px-4">Review Frequency</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--nebula-border)] text-sm">
                {initialABCItems.map((item) => (
                  <tr key={item.productId} className="hover:bg-[var(--nebula-surface-hover)] transition-colors">
                    <td className="py-3 px-4">
                      <span className={`inline-flex h-8 w-8 items-center justify-center rounded-xl font-bold text-white ${
                        item.abcClass === "A" ? "bg-rose-600" : item.abcClass === "B" ? "bg-amber-600" : "bg-blue-600"
                      }`}>
                        {item.abcClass}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-[var(--nebula-text)]">
                      {item.productName}
                      <span className="block text-[11px] text-[var(--nebula-muted)] font-mono">{item.sku}</span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-[var(--nebula-text)]">${item.annualConsumptionValue.toLocaleString()}</td>
                    <td className="py-3 px-4 text-[var(--nebula-muted)]">{item.percentageOfTotal}%</td>
                    <td className="py-3 px-4 font-medium text-[var(--nebula-text)]">{item.recommendedReviewFrequency}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {reportTab === "reorder" && (
        <div className="rounded-2xl border border-[var(--nebula-border)] bg-[var(--nebula-surface)] p-6 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-[var(--nebula-text)]">Automated Reorder Rules & Safety Stock Thresholds</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[var(--nebula-border)] text-xs font-semibold uppercase text-[var(--nebula-muted)]">
                  <th className="py-3 px-4">Product Name</th>
                  <th className="py-3 px-4">Min Level</th>
                  <th className="py-3 px-4">Max Level</th>
                  <th className="py-3 px-4">Reorder Point</th>
                  <th className="py-3 px-4">Safety Stock</th>
                  <th className="py-3 px-4">Preferred Supplier</th>
                  <th className="py-3 px-4">Auto-Reorder</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--nebula-border)] text-sm">
                {initialReorderRules.map((rule) => (
                  <tr key={rule.id} className="hover:bg-[var(--nebula-surface-hover)] transition-colors">
                    <td className="py-3 px-4 font-semibold text-[var(--nebula-text)]">{rule.productName}</td>
                    <td className="py-3 px-4 text-[var(--nebula-muted)]">{rule.minLevel}</td>
                    <td className="py-3 px-4 text-[var(--nebula-muted)]">{rule.maxLevel}</td>
                    <td className="py-3 px-4 font-semibold text-blue-600">{rule.reorderPoint}</td>
                    <td className="py-3 px-4 text-[var(--nebula-text)]">{rule.safetyStock}</td>
                    <td className="py-3 px-4 text-[var(--nebula-muted)]">{rule.preferredSupplier}</td>
                    <td className="py-3 px-4">
                      <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-600">
                        Active
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {reportTab === "dead" && (
        <div className="rounded-2xl border border-[var(--nebula-border)] bg-[var(--nebula-surface)] p-6 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-[var(--nebula-text)]">Dead Stock & Slow-Moving Inventory Liquidation Report</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[var(--nebula-border)] text-xs font-semibold uppercase text-[var(--nebula-muted)]">
                  <th className="py-3 px-4">Product Name</th>
                  <th className="py-3 px-4">Warehouse</th>
                  <th className="py-3 px-4">Stock Qty</th>
                  <th className="py-3 px-4">Total Value</th>
                  <th className="py-3 px-4">Days Inactive</th>
                  <th className="py-3 px-4">Recommended Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--nebula-border)] text-sm">
                {initialDeadStock.map((item) => (
                  <tr key={item.productId} className="hover:bg-[var(--nebula-surface-hover)] transition-colors">
                    <td className="py-3 px-4 font-semibold text-[var(--nebula-text)]">
                      {item.productName}
                      <span className="block text-[11px] text-[var(--nebula-muted)] font-mono">{item.sku}</span>
                    </td>
                    <td className="py-3 px-4 text-[var(--nebula-muted)]">{item.warehouseName}</td>
                    <td className="py-3 px-4 text-[var(--nebula-text)]">{item.stockQty}</td>
                    <td className="py-3 px-4 font-bold text-rose-600">${item.totalValue.toLocaleString()}</td>
                    <td className="py-3 px-4 text-[var(--nebula-muted)]">{item.daysWithoutMovement} days</td>
                    <td className="py-3 px-4">
                      <span className="rounded-full bg-rose-500/10 px-2.5 py-0.5 text-xs font-semibold text-rose-600 uppercase">
                        {item.recommendedAction}
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
