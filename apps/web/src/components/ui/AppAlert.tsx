import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from "lucide-react";

export type AlertTone = "info" | "success" | "warning" | "danger";

export interface AppAlertProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  tone?: AlertTone;
  title?: ReactNode;
  icon?: ReactNode;
  onDismiss?: () => void;
  action?: ReactNode;
}

const toneIcons: Record<AlertTone, ReactNode> = {
  info: <Info size={18} className="text-[var(--nebula-info)] shrink-0" />,
  success: <CheckCircle2 size={18} className="text-[var(--nebula-success)] shrink-0" />,
  warning: <AlertTriangle size={18} className="text-[var(--nebula-warning)] shrink-0" />,
  danger: <AlertCircle size={18} className="text-[var(--nebula-danger)] shrink-0" />,
};

const toneStyles: Record<AlertTone, string> = {
  info: "bg-[var(--nebula-info-bg)] border-[var(--nebula-info)]/30 text-[var(--nebula-info-text)]",
  success: "bg-[var(--nebula-success-bg)] border-[var(--nebula-success)]/30 text-[var(--nebula-success-text)]",
  warning: "bg-[var(--nebula-warning-bg)] border-[var(--nebula-warning)]/30 text-[var(--nebula-warning-text)]",
  danger: "bg-[var(--nebula-danger-bg)] border-[var(--nebula-danger)]/30 text-[var(--nebula-danger-text)]",
};

export const AppAlert = forwardRef<HTMLDivElement, AppAlertProps>(
  (
    {
      tone = "info",
      title,
      icon,
      children,
      onDismiss,
      action,
      className = "",
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        role="alert"
        className={[
          "flex items-start gap-3 rounded-xl border p-4 text-sm transition-all shadow-sm",
          toneStyles[tone],
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        {...props}
      >
        <div className="mt-0.5">{icon || toneIcons[tone]}</div>
        <div className="flex-1">
          {title && <div className="font-bold text-[var(--nebula-text-primary)] mb-0.5">{title}</div>}
          <div className="text-xs text-[var(--nebula-text-secondary)]">{children}</div>
          {action && <div className="mt-3">{action}</div>}
        </div>
        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            className="text-[var(--nebula-text-muted)] hover:text-[var(--nebula-text-primary)] cursor-pointer"
            aria-label="Dismiss alert"
          >
            <X size={16} />
          </button>
        )}
      </div>
    );
  }
);

AppAlert.displayName = "AppAlert";
export default AppAlert;
