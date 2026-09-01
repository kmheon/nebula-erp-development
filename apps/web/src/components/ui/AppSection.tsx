import { forwardRef, type HTMLAttributes, type ReactNode } from "react";

export interface AppSectionProps extends Omit<HTMLAttributes<HTMLElement>, "title"> {
  title?: ReactNode;
  subtitle?: ReactNode;
  badge?: ReactNode;
  actions?: ReactNode;
}

export const AppSection = forwardRef<HTMLElement, AppSectionProps>(
  (
    {
      title,
      subtitle,
      badge,
      actions,
      children,
      className = "",
      ...props
    },
    ref
  ) => {
    return (
      <section
        ref={ref}
        className={["space-y-4", className].filter(Boolean).join(" ")}
        {...props}
      >
        {(title || subtitle || actions || badge) && (
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                {title && <h2 className="text-xl font-bold text-[var(--nebula-text-primary)]">{title}</h2>}
                {badge}
              </div>
              {subtitle && <p className="mt-1 text-sm text-[var(--nebula-text-secondary)]">{subtitle}</p>}
            </div>
            {actions && <div className="flex items-center gap-3">{actions}</div>}
          </div>
        )}
        {children}
      </section>
    );
  }
);

AppSection.displayName = "AppSection";

export interface AppPanelProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  icon?: ReactNode;
  title: ReactNode;
  description?: string;
  action?: ReactNode;
}

export const AppPanel = forwardRef<HTMLDivElement, AppPanelProps>(
  (
    {
      icon,
      title,
      description,
      action,
      children,
      className = "",
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={[
          "rounded-xl border border-[var(--nebula-border)] bg-[var(--nebula-surface)] p-6 shadow-sm flex flex-col justify-between",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        {...props}
      >
        <div>
          <div className="flex items-center gap-3 mb-3">
            {icon && (
              <div className="rounded-lg bg-[var(--nebula-primary)]/10 p-2 text-[var(--nebula-primary)]">
                {icon}
              </div>
            )}
            <h3 className="text-lg font-bold text-[var(--nebula-text-primary)]">{title}</h3>
          </div>
          {description && (
            <p className="text-sm text-[var(--nebula-text-secondary)] mb-6">{description}</p>
          )}
          {children}
        </div>
        {action && <div className="mt-4">{action}</div>}
      </div>
    );
  }
);

AppPanel.displayName = "AppPanel";

export default AppSection;

