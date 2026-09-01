import { forwardRef, type SelectHTMLAttributes, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";

export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

export interface AppSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  helperText?: string;
  error?: string;
  options?: SelectOption[];
  leftIcon?: ReactNode;
  required?: boolean;
}

export const AppSelect = forwardRef<HTMLSelectElement, AppSelectProps>(
  (
    {
      label,
      helperText,
      error,
      options,
      leftIcon,
      required,
      id,
      children,
      className = "",
      disabled,
      ...props
    },
    ref
  ) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label htmlFor={selectId} className="block text-xs font-semibold uppercase tracking-wider text-[var(--nebula-text-secondary)]">
            {label}
            {required && <span className="text-[var(--nebula-danger)] ml-0.5">*</span>}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3 text-[var(--nebula-text-muted)] pointer-events-none">
              {leftIcon}
            </div>
          )}
          <select
            ref={ref}
            id={selectId}
            disabled={disabled}
            className={[
              "w-full appearance-none rounded-lg border bg-[var(--nebula-surface)] px-3 py-2 pr-9 text-sm text-[var(--nebula-text-primary)] transition-colors duration-150 cursor-pointer",
              "focus:outline-none focus:ring-2 focus:ring-[var(--nebula-focus-ring)] focus:border-[var(--nebula-primary)]",
              "disabled:cursor-not-allowed disabled:bg-[var(--nebula-surface-muted)] disabled:opacity-60",
              error
                ? "border-[var(--nebula-danger)] focus:border-[var(--nebula-danger)] focus:ring-[var(--nebula-danger)]/20"
                : "border-[var(--nebula-border)]",
              leftIcon ? "pl-9" : "",
              className,
            ]
              .filter(Boolean)
              .join(" ")}
            {...props}
          >
            {options
              ? options.map((opt) => (
                  <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                    {opt.label}
                  </option>
                ))
              : children}
          </select>
          <ChevronDown
            size={16}
            className="pointer-events-none absolute right-3 text-[var(--nebula-text-muted)]"
          />
        </div>
        {error ? (
          <p className="text-xs font-medium text-[var(--nebula-danger-text)]">{error}</p>
        ) : helperText ? (
          <p className="text-xs text-[var(--nebula-text-muted)]">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

AppSelect.displayName = "AppSelect";
export default AppSelect;
