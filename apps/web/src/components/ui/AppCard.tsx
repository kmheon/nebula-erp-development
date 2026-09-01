import { forwardRef, type HTMLAttributes, type ReactNode } from "react";

export interface AppCardProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  variant?: "default" | "muted" | "flat" | "elevated";
  padding?: "none" | "sm" | "md" | "lg";
  header?: ReactNode;
  footer?: ReactNode;
  title?: ReactNode;
  subtitle?: ReactNode;
  actions?: ReactNode;
}

const variantStyles = {
  default: "bg-[var(--nebula-surface)] border border-[var(--nebula-border)] shadow-sm",
  muted: "bg-[var(--nebula-surface-muted)] border border-[var(--nebula-border)]",
  flat: "bg-[var(--nebula-surface)] border border-transparent",
  elevated: "bg-[var(--nebula-surface-elevated)] border border-[var(--nebula-border)] shadow-md",
};

const paddingStyles = {
  none: "p-0",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

export const AppCard = forwardRef<HTMLDivElement, AppCardProps>(
  (
    {
      children,
      variant = "default",
      padding = "md",
      header,
      footer,
      title,
      subtitle,
      actions,
      className = "",
      ...props
    },
    ref
  ) => {
    const hasHeader = header || title || subtitle || actions;

    return (
      <div
        ref={ref}
        className={[
          "rounded-xl transition-colors duration-150 overflow-hidden",
          variantStyles[variant],
          padding === "none" ? "" : paddingStyles[padding],
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        {...props}
      >
        {hasHeader && (
          <div className={padding === "none" ? "p-6 border-b border-[var(--nebula-border)]" : "mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"}>
            {header ? (
              header
            ) : (
              <>
                <div>
                  {title && <h3 className="text-lg font-bold text-[var(--nebula-text-primary)]">{title}</h3>}
                  {subtitle && <p className="mt-0.5 text-xs text-[var(--nebula-text-secondary)]">{subtitle}</p>}
                </div>
                {actions && <div className="flex items-center gap-2">{actions}</div>}
              </>
            )}
          </div>
        )}

        <div>{children}</div>

        {footer && (
          <div className={padding === "none" ? "p-4 border-t border-[var(--nebula-border)] bg-[var(--nebula-surface-muted)]" : "mt-4 pt-4 border-t border-[var(--nebula-border)]"}>
            {footer}
          </div>
        )}
      </div>
    );
  }
);

AppCard.displayName = "AppCard";
export default AppCard;
