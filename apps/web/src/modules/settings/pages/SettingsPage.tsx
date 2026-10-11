import { useState } from "react";
import { Settings, Palette } from "lucide-react";
import ThemeSelector from "../../../theme/ThemeSelector";
import SettingsPanel from "../components/SettingsPanel";
import { AppPageHeader, AppTabs } from "../../../components/ui";

import type { SystemSetting } from "../types/settings.types";

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
  const [activeTab, setActiveTab] = useState<string>("general");

  return (
    <div className="space-y-8">
      <AppPageHeader
        title="Enterprise System Settings & Preferences"
        subtitle="Configure organization metadata, default fiscal currency, system policies, and visual theme customization."
      />

      <AppTabs
        tabs={[
          { id: "general", name: "General Settings", icon: <Settings size={16} /> },
          { id: "themes", name: "Themes & Visual Branding", icon: <Palette size={16} /> },
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
        variant="pill"
      />

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
