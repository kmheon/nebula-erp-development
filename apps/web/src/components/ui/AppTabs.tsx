import { type ReactNode } from "react";

export interface TabItem<T extends string = string> {
  id: T;
  name: ReactNode;
  icon?: ReactNode;
  badge?: ReactNode;
  disabled?: boolean;
}

export interface AppTabsProps<T extends string = string> {
  tabs: TabItem<T>[];
  activeTab: T;
  onChange: (tabId: T) => void;
  variant?: "solid" | "pill" | "underline";
  className?: string;
}

export function AppTabs<T extends string = string>({
  tabs,
  activeTab,
  onChange,
  variant = "solid",
  className = "",
}: AppTabsProps<T>) {
  if (variant === "underline") {
    return (
      <div className={["flex items-center gap-6 border-b border-[var(--nebula-border)]", className].filter(Boolean).join(" ")}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              disabled={tab.disabled}
              onClick={() => onChange(tab.id)}
              className={[
                "flex items-center gap-2 pb-3 text-sm font-semibold border-b-2 transition-all cursor-pointer disabled:cursor-not-allowed disabled:opacity-50",
                isActive
                  ? "border-[var(--nebula-primary)] text-[var(--nebula-primary)]"
                  : "border-transparent text-[var(--nebula-text-secondary)] hover:text-[var(--nebula-text-primary)] hover:border-[var(--nebula-border)]",
              ].join(" ")}
            >
              {tab.icon}
              <span>{tab.name}</span>
              {tab.badge}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className={["flex flex-wrap items-center gap-2 border-b border-[var(--nebula-border)] pb-3", className].filter(Boolean).join(" ")}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            disabled={tab.disabled}
            onClick={() => onChange(tab.id)}
            className={[
              "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-50",
              isActive
                ? "bg-[var(--nebula-primary)] text-white shadow-sm"
                : "bg-[var(--nebula-surface)] border border-[var(--nebula-border)] text-[var(--nebula-text-primary)] hover:bg-[var(--nebula-surface-muted)]",
            ].join(" ")}
          >
            {tab.icon}
            <span>{tab.name}</span>
            {tab.badge}
          </button>
        );
      })}
    </div>
  );
}

export default AppTabs;
