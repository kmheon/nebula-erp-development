import SidebarThemeSwitcher from "./SidebarThemeSwitcher";

/**
 * Sidebar Footer Component
 *
 * Pinned at the bottom of the sidebar.
 * Navigation area scrolls independently while footer stays fixed.
 *
 * Contains:
 * - Theme Switcher button (adapts seamlessly to current theme)
 * - ERP Edition & Versioning
 */
export default function SidebarFooter({ collapsed = false }: { collapsed?: boolean }) {
  const version = "1.0.0";
  const productName = "Nebula ERP";

  if (collapsed) {
    return (
      <footer
        className="relative flex-shrink-0 border-t border-[var(--nebula-border)] p-2.5 transition-all duration-300"
        role="contentinfo"
        aria-label="Sidebar footer"
      >
        <div className="flex flex-col items-center justify-center gap-2">
          {/* Theme Switcher Button */}
          <SidebarThemeSwitcher collapsed={true} />

          {/* Compact Version Label */}
          <span
            className="text-[10px] font-medium text-[var(--nebula-text-muted)] tracking-wider uppercase"
            title={`${productName} v${version}`}
            aria-label={`${productName} version ${version}`}
          >
            v{version}
          </span>
        </div>
      </footer>
    );
  }

  // Expanded mode
  return (
    <footer
      className="flex-shrink-0 border-t border-[var(--nebula-border)] p-3 transition-all duration-300"
      role="contentinfo"
      aria-label="Sidebar footer"
    >
      {/* Theme Switcher Button right before version */}
      <div className="mb-2.5">
        <SidebarThemeSwitcher collapsed={false} />
      </div>

      {/* Version & Platform Info */}
      <div className="flex items-center justify-between pt-2 border-t border-[var(--nebula-border)] text-xs text-[var(--nebula-text-muted)]">
        <span className="truncate font-medium">{productName}</span>
        <span className="font-mono font-medium text-[11px] text-[var(--nebula-text-secondary)]">
          v{version}
        </span>
      </div>
    </footer>
  );
}
