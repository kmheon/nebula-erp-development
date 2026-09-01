import { forwardRef, type HTMLAttributes, type ReactNode } from "react";

export interface AppPageHeaderProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  title: ReactNode;
  subtitle?: ReactNode;
  breadcrumbs?: ReactNode;
  actions?: ReactNode;
  statusBadge?: ReactNode;
}

export const AppPageHeader = forwardRef<HTMLDivElement, AppPageHeaderProps>(
  (
    {
      title,
      subtitle,
      breadcrumbs,
      actions,
      statusBadge,
      className = "",
      ...props
    },
    ref
  ) => {
    return (
      <header
        ref={ref}
        className={["space-y-2", className].filter(Boolean).join(" ")}
        {...props}
      >
        {breadcrumbs && <div className="mb-1">{breadcrumbs}</div>}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight text-[var(--nebula-text-primary)]">
                {title}
              </h1>
              {statusBadge}
            </div>
            {subtitle && (
              <p className="mt-1 text-sm text-[var(--nebula-text-secondary)]">
                {subtitle}
              </p>
            )}
          </div>
          {actions && <div className="flex flex-wrap items-center gap-3">{actions}</div>}
        </div>
      </header>
    );
  }
);

AppPageHeader.displayName = "AppPageHeader";
export default AppPageHeader;
