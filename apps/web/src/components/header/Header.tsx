import GlobalSearch from "../../modules/search/components/GlobalSearch";
import NotificationBell from "../../modules/notifications/components/NotificationBell";
import { SidebarMobileToggle } from "../sidebar/Sidebar";
import HeaderBrand from "./HeaderBrand";
import CompanySwitcher from "./CompanySwitcher";
import UserMenu from "./UserMenu";
import SystemStatus from "../system/SystemStatus";
import { AppHeader } from "../ui";

/**
 * Enterprise ERP Application Header.
 * 
 * Built on top of the design-system `AppHeader` component utilizing
 * semantic design tokens from theme.css / tokens.css.
 * 
 * Fully responsive: prevents overlapping elements across ultra-wide, desktop,
 * tablet, and mobile viewport sizes while harmonizing with dynamic theme changes.
 */
export default function Header() {
  return (
    <AppHeader
      id="main-app-header"
      sticky
      blurred
      bordered
      size="md"
      left={
        <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 shrink-0 min-w-0">
          <SidebarMobileToggle />
          <HeaderBrand />
          <div className="hidden h-6 w-px bg-[var(--nebula-border)] lg:block" />
          <div className="hidden xl:block shrink-0">
            <CompanySwitcher />
          </div>
        </div>
      }
      center={
        <div className="hidden w-full max-w-lg min-w-0 justify-center px-2 md:flex">
          <GlobalSearch />
        </div>
      }
      right={
        <div className="flex items-center justify-end gap-1.5 sm:gap-2.5 lg:gap-3.5 shrink-0">
          {/* Mobile Search Button (only shown on small screens) */}
          <div className="md:hidden shrink-0">
            <GlobalSearch />
          </div>

          {/* System Status in Top Bar - Theme Reactive & Responsive */}
          <div
            id="topbar-system-status-container"
            className="flex items-center rounded-lg border border-[var(--nebula-border)] bg-[var(--nebula-surface-muted)]/70 px-2 sm:px-2.5 py-1.5 shadow-2xs transition-colors duration-200 hover:bg-[var(--nebula-surface-muted)] shrink-0"
          >
            <SystemStatus
              variant="online"
              showLabel
              responsive
              className="text-xs"
            />
          </div>

          <div className="shrink-0">
            <NotificationBell />
          </div>

          <div className="hidden h-6 w-px bg-[var(--nebula-border)] sm:block shrink-0" />

          <div className="shrink-0">
            <UserMenu />
          </div>
        </div>
      }
    />
  );
}
