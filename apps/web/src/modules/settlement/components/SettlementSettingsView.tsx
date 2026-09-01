/**
 * Settlement Settings Component.
 * Enterprise configuration for payment allocation policies and net settlement behaviours.
 */

import { useState } from "react";
import type { SettlementSettings, AllocationPolicy } from "../types/settlement.types";
import { DEFAULT_SETTLEMENT_SETTINGS } from "../services/settlement.service";

export default function SettlementSettingsView() {
  const [settings, setSettings] = useState<SettlementSettings>(DEFAULT_SETTLEMENT_SETTINGS);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-[var(--nebula-border)] bg-[var(--nebula-surface)] p-6 shadow-sm space-y-6">
        <div className="flex justify-between items-center border-b border-[var(--nebula-border)] pb-4">
          <div>
            <h2 className="text-lg font-bold">Enterprise Settlement Policy Settings</h2>
            <p className="text-sm text-[var(--nebula-text-secondary)]">
              Configure global allocation policies, netting rules, and overpayment behaviours across sales, purchase, and POS modules.
            </p>
          </div>
          {saved && (
            <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 animate-pulse">
              Settings Saved Successfully
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[var(--nebula-text-secondary)] uppercase mb-1.5">Default Allocation Policy</label>
              <select
                value={settings.defaultAllocationPolicy}
                onChange={(e) => setSettings({ ...settings, defaultAllocationPolicy: e.target.value as AllocationPolicy })}
                className="w-full rounded-lg border border-[var(--nebula-border)] bg-[var(--nebula-surface-muted)] px-3 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[var(--nebula-primary)]"
              >
                <option value="fifo">FIFO (First In, First Out)</option>
                <option value="lifo">LIFO (Last In, First Out)</option>
                <option value="oldest_invoice">Oldest Invoice First</option>
                <option value="newest_invoice">Newest Invoice First</option>
                <option value="due_date">Due Date Priority</option>
                <option value="largest_amount">Largest Amount First</option>
                <option value="smallest_amount">Smallest Amount First</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--nebula-text-secondary)] uppercase mb-1.5">Default Settlement Behaviour</label>
              <select
                value={settings.defaultSettlementBehaviour}
                onChange={(e) => setSettings({ ...settings, defaultSettlementBehaviour: e.target.value as any })}
                className="w-full rounded-lg border border-[var(--nebula-border)] bg-[var(--nebula-surface-muted)] px-3 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[var(--nebula-primary)]"
              >
                <option value="auto_allocate">Auto-allocate to open invoices</option>
                <option value="hold_unallocated">Hold as unallocated credit / deposit</option>
                <option value="advance_payment">Record as advance payment</option>
              </select>
            </div>
          </div>

          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between p-4 rounded-lg border border-[var(--nebula-border)] bg-[var(--nebula-surface-muted)]">
              <div>
                <span className="text-sm font-bold block">Auto-Net Customer & Supplier</span>
                <span className="text-xs text-[var(--nebula-text-secondary)]">Automatically net receivables and payables for dual-role contacts.</span>
              </div>
              <input
                type="checkbox"
                checked={settings.autoNetCustomerSupplier}
                onChange={(e) => setSettings({ ...settings, autoNetCustomerSupplier: e.target.checked })}
                className="w-5 h-5 rounded text-[var(--nebula-primary)] focus:ring-[var(--nebula-primary)]/20"
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg border border-[var(--nebula-border)] bg-[var(--nebula-surface-muted)]">
              <div>
                <span className="text-sm font-bold block">Allow Manual Override</span>
                <span className="text-xs text-[var(--nebula-text-secondary)]">Allow finance users to manually adjust allocations during settlement.</span>
              </div>
              <input
                type="checkbox"
                checked={settings.allowManualOverride}
                onChange={(e) => setSettings({ ...settings, allowManualOverride: e.target.checked })}
                className="w-5 h-5 rounded text-[var(--nebula-primary)] focus:ring-[var(--nebula-primary)]/20"
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg border border-[var(--nebula-border)] bg-[var(--nebula-surface-muted)]">
              <div>
                <span className="text-sm font-bold block">Allow Overpayment</span>
                <span className="text-xs text-[var(--nebula-text-secondary)]">Permit payment amounts exceeding total open invoice balance.</span>
              </div>
              <input
                type="checkbox"
                checked={settings.allowOverpayment}
                onChange={(e) => setSettings({ ...settings, allowOverpayment: e.target.checked })}
                className="w-5 h-5 rounded text-[var(--nebula-primary)] focus:ring-[var(--nebula-primary)]/20"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-[var(--nebula-border)]">
          <button
            onClick={handleSave}
            className="rounded-lg bg-[var(--nebula-primary)] px-6 py-2.5 text-sm font-medium text-white shadow-sm hover:opacity-90 transition-opacity"
          >
            Save Settlement Settings
          </button>
        </div>
      </div>
    </div>
  );
}
