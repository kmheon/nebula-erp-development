import { useEffect, useRef, useState } from "react";
import { Palette, ChevronUp } from "lucide-react";
import { useTheme } from "../../theme/useTheme";
import ThemeOptions from "../../theme/ThemeOptions";

/**
 * Quick theme switcher for the sidebar footer.
 *
 * Renders a button with a palette icon showing the current theme; clicking it
 * opens a compact popover that lists all themes. Selecting a theme switches
 * the application instantly and harmonizes with all CSS variables.
 */
export default function SidebarThemeSwitcher({
  collapsed = false,
}: {
  collapsed?: boolean;
}) {
  const { theme } = useTheme();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: PointerEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <div ref={containerRef} className="relative w-full">
      <button
        type="button"
        id="sidebar-theme-switcher-btn"
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="menu"
        aria-expanded={open}
        title={collapsed ? `Theme: ${theme.name}` : undefined}
        className={`group flex w-full items-center gap-2.5 rounded-lg border border-[var(--nebula-border)] bg-[var(--nebula-surface)] px-3 py-2 text-xs font-medium text-[var(--nebula-text-primary)] shadow-2xs transition-all duration-200 hover:border-[var(--nebula-primary)] hover:bg-[var(--nebula-surface-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--nebula-primary)]/20 ${
          collapsed ? "justify-center px-2" : ""
        } ${open ? "border-[var(--nebula-primary)] ring-2 ring-[var(--nebula-primary)]/20" : ""}`}
      >
        <div
          className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md text-white shadow-2xs transition-transform group-hover:scale-105"
          style={{
            background: `linear-gradient(135deg, ${theme.tokens["--nebula-primary"]} 0%, ${theme.tokens["--nebula-accent"]} 100%)`,
          }}
        >
          <Palette size={12} className="drop-shadow-xs" />
        </div>

        {!collapsed && (
          <span className="min-w-0 flex-1 truncate text-left">
            {theme.name}
          </span>
        )}

        {!collapsed && (
          <span
            className="h-3.5 w-3.5 shrink-0 rounded-full ring-1 ring-black/10 shadow-2xs"
            style={{
              background: `linear-gradient(135deg, ${theme.tokens["--nebula-primary"]} 0 50%, ${theme.tokens["--nebula-accent"]} 50% 100%)`,
            }}
          />
        )}

        {!collapsed && (
          <ChevronUp
            size={14}
            className={`text-[var(--nebula-text-muted)] transition-transform duration-200 ${
              open ? "" : "rotate-180"
            }`}
          />
        )}
      </button>

      {open && (
        <div
          role="menu"
          className={`absolute bottom-full z-50 mb-2 w-64 rounded-xl border border-[var(--nebula-border)] bg-[var(--nebula-surface)] p-2 shadow-xl backdrop-blur-md transition-all duration-200 animate-in fade-in zoom-in-95 ${
            collapsed ? "left-12" : "left-0"
          }`}
        >
          <div className="px-2 py-1 mb-1 border-b border-[var(--nebula-border)] flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-[var(--nebula-text-muted)]">
            <span>Themes</span>
            <span className="text-[10px] lowercase font-normal text-[var(--nebula-text-muted)]">select style</span>
          </div>
          <div className="max-h-60 overflow-y-auto pr-0.5">
            <ThemeOptions
              className="grid grid-cols-1 gap-1.5"
              onSelect={() => setOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
