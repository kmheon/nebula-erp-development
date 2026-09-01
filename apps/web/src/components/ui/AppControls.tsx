import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";

export interface AppCheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: ReactNode;
  description?: ReactNode;
  error?: string;
}

export const AppCheckbox = forwardRef<HTMLInputElement, AppCheckboxProps>(
  ({ label, description, error, className = "", id, ...props }, ref) => {
    const inputId = id || (typeof label === "string" ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="space-y-1">
        <label className="flex items-start gap-2.5 cursor-pointer select-none">
          <input
            ref={ref}
            id={inputId}
            type="checkbox"
            className={[
              "mt-0.5 h-4 w-4 rounded border-[var(--nebula-border)] text-[var(--nebula-primary)] focus:ring-[var(--nebula-focus-ring)] cursor-pointer accent-[var(--nebula-primary)]",
              className,
            ]
              .filter(Boolean)
              .join(" ")}
            {...props}
          />
          {(label || description) && (
            <div className="text-sm">
              {label && <div className="font-medium text-[var(--nebula-text-primary)]">{label}</div>}
              {description && <div className="text-xs text-[var(--nebula-text-secondary)]">{description}</div>}
            </div>
          )}
        </label>
        {error && <p className="text-xs font-medium text-[var(--nebula-danger-text)]">{error}</p>}
      </div>
    );
  }
);
AppCheckbox.displayName = "AppCheckbox";

export interface AppRadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: ReactNode;
  description?: ReactNode;
}

export const AppRadio = forwardRef<HTMLInputElement, AppRadioProps>(
  ({ label, description, className = "", id, ...props }, ref) => {
    const inputId = id || (typeof label === "string" ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <label className="flex items-start gap-2.5 cursor-pointer select-none">
        <input
          ref={ref}
          id={inputId}
          type="radio"
          className={[
            "mt-0.5 h-4 w-4 border-[var(--nebula-border)] text-[var(--nebula-primary)] focus:ring-[var(--nebula-focus-ring)] cursor-pointer accent-[var(--nebula-primary)]",
            className,
          ]
            .filter(Boolean)
            .join(" ")}
          {...props}
        />
        {(label || description) && (
          <div className="text-sm">
            {label && <div className="font-medium text-[var(--nebula-text-primary)]">{label}</div>}
            {description && <div className="text-xs text-[var(--nebula-text-secondary)]">{description}</div>}
          </div>
        )}
      </label>
    );
  }
);
AppRadio.displayName = "AppRadio";

export interface AppSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: ReactNode;
  description?: ReactNode;
  disabled?: boolean;
  size?: "sm" | "md";
}

export function AppSwitch({
  checked,
  onChange,
  label,
  description,
  disabled = false,
  size = "md",
}: AppSwitchProps) {
  const isSm = size === "sm";

  return (
    <label
      className={[
        "flex items-center justify-between gap-3 cursor-pointer select-none",
        disabled ? "cursor-not-allowed opacity-50" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {(label || description) && (
        <div>
          {label && <div className="text-sm font-medium text-[var(--nebula-text-primary)]">{label}</div>}
          {description && <div className="text-xs text-[var(--nebula-text-secondary)]">{description}</div>}
        </div>
      )}
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className={[
          "relative inline-flex shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[var(--nebula-focus-ring)]",
          isSm ? "h-5 w-9" : "h-6 w-11",
          checked ? "bg-[var(--nebula-primary)]" : "bg-[var(--nebula-surface-muted)] border-[var(--nebula-border)]",
        ].join(" ")}
      >
        <span
          className={[
            "pointer-events-none inline-block rounded-full bg-white shadow-transform transition duration-200 ease-in-out",
            isSm ? "h-4 w-4" : "h-5 w-5",
            checked
              ? isSm
                ? "translate-x-4"
                : "translate-x-5"
              : "translate-x-0 bg-white dark:bg-gray-300",
          ].join(" ")}
        />
      </button>
    </label>
  );
}

export interface AppDatePickerProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  helperText?: string;
  error?: string;
  required?: boolean;
}

export const AppDatePicker = forwardRef<HTMLInputElement, AppDatePickerProps>(
  ({ label, helperText, error, required, className = "", ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--nebula-text-secondary)]">
            {label}
            {required && <span className="text-[var(--nebula-danger)] ml-0.5">*</span>}
          </label>
        )}
        <input
          ref={ref}
          type="date"
          className={[
            "w-full rounded-lg border bg-[var(--nebula-surface)] px-3 py-2 text-sm text-[var(--nebula-text-primary)] transition-colors duration-150 cursor-pointer",
            "focus:outline-none focus:ring-2 focus:ring-[var(--nebula-focus-ring)] focus:border-[var(--nebula-primary)]",
            error ? "border-[var(--nebula-danger)]" : "border-[var(--nebula-border)]",
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
AppDatePicker.displayName = "AppDatePicker";

export default AppCheckbox;
