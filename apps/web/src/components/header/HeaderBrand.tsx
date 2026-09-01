import { Zap } from "lucide-react";
import { appConfig } from "../../config/app.config";
import { useTheme } from "../../theme/useTheme";
import { useSidebar } from "../sidebar/SidebarContext";

/**
 * Header branding component.
 *
 * Coordinates with the sidebar state:
 * - On mobile (lg:hidden where sidebar is a drawer), shows the brand logo and title.
 * - On desktop, the primary branding is integrated directly in the sidebar (showing full branding when expanded and icon when collapsed).
 */
export default function HeaderBrand() {
  const { theme } = useTheme();
  const { collapsed } = useSidebar();

  return (
    <div className="flex items-center gap-2.5 min-w-0">
      {/* Mobile Branding (when sidebar is hidden in drawer) */}
      <div className="flex items-center gap-2.5 lg:hidden">
        <div
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg shadow-sm"
          style={{
            background: `linear-gradient(135deg, ${theme.tokens["--nebula-primary"]} 0%, ${theme.tokens["--nebula-accent"]} 100%)`,
          }}
        >
          <Zap className="h-5 w-5 text-white" />
        </div>
        <span className="text-sm font-bold text-[var(--nebula-text-primary)] truncate">
          {appConfig.name}
        </span>
      </div>

      {/* Desktop Indicator when sidebar is collapsed */}
      {collapsed && (
        <div className="hidden lg:flex items-center gap-2 animate-in fade-in duration-200">
          <span className="text-xs font-bold text-[var(--nebula-text-primary)] tracking-wide">
            {appConfig.name}
          </span>
          <span className="text-[10px] font-medium text-[var(--nebula-text-muted)] uppercase tracking-wider hidden xl:inline">
            • {appConfig.tagline}
          </span>
        </div>
      )}
    </div>
  );
}
