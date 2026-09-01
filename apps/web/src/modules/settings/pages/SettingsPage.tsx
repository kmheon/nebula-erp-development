import { useState } from "react";
import ThemeSelector from "../../../theme/ThemeSelector";
import SettingsPanel from "../components/SettingsPanel";

import type {
  SystemSetting,
} from "../types/settings.types";


const demoSettings: SystemSetting[] = [
  {
    id: "1",
    key: "company_name",
    value: "Nebula ERP",
    category: "General",
  },
  {
    id: "2",
    key: "currency",
    value: "USD",
    category: "Finance",
  },
];


export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<"general" | "themes">("general");

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--nebula-text-primary)]">
            Settings Module
          </h1>
          <p className="mt-1 text-sm text-[var(--nebula-text-secondary)]">
            Configure system preferences, enterprise properties, and appearance themes.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[var(--nebula-border)] pb-3">
        {[
          { id: "general", name: "General Settings" },
          { id: "themes", name: "Themes & Branding" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? "bg-[var(--nebula-primary)] text-white shadow-sm"
                : "bg-[var(--nebula-surface)] border border-[var(--nebula-border)] hover:bg-[var(--nebula-surface-muted)] text-[var(--nebula-text-primary)]"
            }`}
          >
            {tab.name}
          </button>
        ))}
      </div>

      {activeTab === "general" && (
        <SettingsPanel
          settings={demoSettings}
        />
      )}

      {activeTab === "themes" && (
        <ThemeSelector />
      )}
    </div>
  );
}
