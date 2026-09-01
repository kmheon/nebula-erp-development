import { forwardRef, type TextareaHTMLAttributes } from "react";

export interface AppTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helperText?: string;
  error?: string;
  required?: boolean;
}

export const AppTextarea = forwardRef<HTMLTextAreaElement, AppTextareaProps>(
  (
    {
      label,
      helperText,
      error,
      required,
      id,
      className = "",
      disabled,
      rows = 3,
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
        <textarea
          ref={ref}
          id={inputId}
          disabled={disabled}
          rows={rows}
          className={[
            "w-full rounded-lg border bg-[var(--nebula-surface)] px-3 py-2 text-sm text-[var(--nebula-text-primary)] placeholder-[var(--nebula-text-muted)] transition-colors duration-150",
            "focus:outline-none focus:ring-2 focus:ring-[var(--nebula-focus-ring)] focus:border-[var(--nebula-primary)]",
            "disabled:cursor-not-allowed disabled:bg-[var(--nebula-surface-muted)] disabled:opacity-60",
            error
              ? "border-[var(--nebula-danger)] focus:border-[var(--nebula-danger)] focus:ring-[var(--nebula-danger)]/20"
              : "border-[var(--nebula-border)]",
            className,
          ]
            .filter(Boolean)
            .join(" ")}
          {...props}
        />
        {error ? (
          <p className="text-xs font-medium text-[var(--nebula-danger-text)]">{error}</p>
        ) : helperText ? (
          <p className="text-xs text-[var(--nebula-text-muted)]">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

AppTextarea.displayName = "AppTextarea";
export default AppTextarea;
