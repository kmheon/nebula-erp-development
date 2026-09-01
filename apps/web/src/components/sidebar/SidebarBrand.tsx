import { useTheme } from "../../theme/useTheme";
import { Zap, ChevronLeft, ChevronRight } from "lucide-react";
import { useSidebar } from "./SidebarContext";
import { appConfig } from "../../config/app.config";

/**
 * Sidebar Brand Header.
 *
 * Full branding (Logo + Application Name + Tagline) is fully visible when
 * the sidebar is expanded.
 * When the sidebar is collapsed, only the icon is displayed.
 */
export default function SidebarBrand() {
  const { theme } = useTheme();
  const { collapsed, toggleCollapsed } = useSidebar();

  return (
    <div
      className={`relative flex items-center border-b border-[var(--nebula-border)] p-3.5 transition-all duration-300 ${
        collapsed ? "justify-center" : "justify-between"
      }`}
    >
      <div className="flex items-center gap-3 min-w-0">
        {/* Brand Icon / Logo */}
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg shadow-sm transition-transform duration-200"
          style={{
            background: `linear-gradient(135deg, ${theme.tokens["--nebula-primary"]} 0%, ${theme.tokens["--nebula-accent"]} 100%)`,
          }}
          title={collapsed ? appConfig.name : undefined}
        >
          <Zap className="h-6 w-6 text-white" />
        </div>

        {/* Brand Name & Tagline: Visible when sidebar is expanded */}
        {!collapsed && (
          <div className="flex flex-col leading-tight min-w-0 overflow-hidden animate-in fade-in duration-200">
            <span className="text-sm font-bold text-[var(--nebula-text-primary)] truncate">
              {appConfig.name}
            </span>
            <span className="text-[10px] font-medium text-[var(--nebula-text-secondary)] uppercase tracking-wider truncate">
              {appConfig.tagline}
            </span>
          </div>
        )}
      </div>

      {/* Collapse Toggle when Expanded */}
      {!collapsed && (
        <button
          type="button"
          onClick={toggleCollapsed}
          className="rounded-lg p-1.5 text-[var(--nebula-text-muted)] transition-colors hover:bg-[var(--nebula-surface-muted)] hover:text-[var(--nebula-text-primary)] shrink-0"
          aria-label="Collapse sidebar"
          title="Collapse sidebar"
        >
          <ChevronLeft size={18} />
        </button>
      )}

      {/* Expand Toggle when Collapsed */}
      {collapsed && (
        <button
          type="button"
          onClick={toggleCollapsed}
          className="absolute -right-3 top-1/2 -translate-y-1/2 z-50 hidden h-6 w-6 items-center justify-center rounded-full border border-[var(--nebula-border)] bg-[var(--nebula-surface)] text-[var(--nebula-text-muted)] shadow-md transition-all hover:scale-110 hover:text-[var(--nebula-text-primary)] lg:flex"
          aria-label="Expand sidebar"
          title="Expand sidebar"
        >
          <ChevronRight size={14} />
        </button>
      )}
    </div>
  );
}
