import { forwardRef, type HTMLAttributes, type InputHTMLAttributes, type ReactNode } from "react";
import { Search, X, Filter } from "lucide-react";

export interface AppToolbarProps extends HTMLAttributes<HTMLDivElement> {
  left?: ReactNode;
  right?: ReactNode;
}

export const AppToolbar = forwardRef<HTMLDivElement, AppToolbarProps>(
  ({ left, right, children, className = "", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={[
          "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-xl border border-[var(--nebula-border)] bg-[var(--nebula-surface)] p-3 shadow-sm",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        {...props}
      >
        <div className="flex flex-wrap items-center gap-2">{left || children}</div>
        {right && <div className="flex flex-wrap items-center gap-2">{right}</div>}
      </div>
    );
  }
);
AppToolbar.displayName = "AppToolbar";

export interface AppSearchBarProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  value: string;
  onChange: (value: string) => void;
  onClear?: () => void;
}

export const AppSearchBar = forwardRef<HTMLInputElement, AppSearchBarProps>(
  ({ value, onChange, onClear, placeholder = "Search...", className = "", ...props }, ref) => {
    return (
      <div className={["relative flex items-center min-w-[220px]", className].filter(Boolean).join(" ")}>
        <Search size={16} className="absolute left-3 text-[var(--nebula-text-muted)] pointer-events-none" />
        <input
          ref={ref}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-lg border border-[var(--nebula-border)] bg-[var(--nebula-surface)] py-1.5 pl-9 pr-8 text-sm text-[var(--nebula-text-primary)] placeholder-[var(--nebula-text-muted)] focus:border-[var(--nebula-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--nebula-primary)]"
          {...props}
        />
        {value && (
          <button
            type="button"
            onClick={() => {
              onChange("");
              onClear?.();
            }}
            className="absolute right-2.5 text-[var(--nebula-text-muted)] hover:text-[var(--nebula-text-primary)] cursor-pointer"
            aria-label="Clear search"
          >
            <X size={14} />
          </button>
        )}
      </div>
    );
  }
);
AppSearchBar.displayName = "AppSearchBar";

export interface AppFilterBarProps extends HTMLAttributes<HTMLDivElement> {
  activeCount?: number;
  onClearAll?: () => void;
}

export const AppFilterBar = forwardRef<HTMLDivElement, AppFilterBarProps>(
  ({ activeCount = 0, onClearAll, children, className = "", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={[
          "flex flex-wrap items-center gap-2.5 text-xs text-[var(--nebula-text-secondary)]",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        {...props}
      >
        <div className="flex items-center gap-1 font-semibold text-[var(--nebula-text-primary)]">
          <Filter size={14} className="text-[var(--nebula-text-secondary)]" />
          <span>Filters:</span>
        </div>
        {children}
        {activeCount > 0 && onClearAll && (
          <button
            type="button"
            onClick={onClearAll}
            className="ml-auto text-xs font-semibold text-[var(--nebula-primary)] hover:underline cursor-pointer"
          >
            Reset Filters ({activeCount})
          </button>
        )}
      </div>
    );
  }
);
AppFilterBar.displayName = "AppFilterBar";

export default AppToolbar;
