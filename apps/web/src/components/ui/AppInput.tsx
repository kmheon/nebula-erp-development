import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";

export interface AppInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  required?: boolean;
}

export const AppInput = forwardRef<HTMLInputElement, AppInputProps>(
  (
    {
      label,
      helperText,
      error,
      leftIcon,
      rightIcon,
      required,
      id,
      className = "",
      disabled,
      ...props
    },
    ref
  ) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label htmlFor={inputId} className="block text-xs font-semibold uppercase tracking-wider text-[var(--nebula-text-secondary)]">
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
          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            className={[
              "w-full rounded-lg border bg-[var(--nebula-surface)] px-3 py-2 text-sm text-[var(--nebula-text-primary)] placeholder-[var(--nebula-text-muted)] transition-colors duration-150",
              "focus:outline-none focus:ring-2 focus:ring-[var(--nebula-focus-ring)] focus:border-[var(--nebula-primary)]",
              "disabled:cursor-not-allowed disabled:bg-[var(--nebula-surface-muted)] disabled:opacity-60",
              error
                ? "border-[var(--nebula-danger)] focus:border-[var(--nebula-danger)] focus:ring-[var(--nebula-danger)]/20"
                : "border-[var(--nebula-border)]",
              leftIcon ? "pl-9" : "",
              rightIcon ? "pr-9" : "",
              className,
            ]
              .filter(Boolean)
              .join(" ")}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 text-[var(--nebula-text-muted)]">
              {rightIcon}
            </div>
          )}
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

AppInput.displayName = "AppInput";
export default AppInput;
