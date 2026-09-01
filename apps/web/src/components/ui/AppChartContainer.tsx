import { forwardRef, type HTMLAttributes, type ReactNode } from "react";

export interface AppChartContainerProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  title?: ReactNode;
  subtitle?: ReactNode;
  actions?: ReactNode;
  height?: number | string;
}

export const AppChartContainer = forwardRef<HTMLDivElement, AppChartContainerProps>(
  ({ title, subtitle, actions, height = 300, children, className = "", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={[
          "rounded-xl border border-[var(--nebula-border)] bg-[var(--nebula-surface)] p-6 shadow-sm",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        {...props}
      >
        {(title || subtitle || actions) && (
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-[var(--nebula-border)] pb-3">
            <div>
              {title && <h3 className="text-base font-bold text-[var(--nebula-text-primary)]">{title}</h3>}
              {subtitle && <p className="mt-0.5 text-xs text-[var(--nebula-text-secondary)]">{subtitle}</p>}
            </div>
            {actions && <div className="flex items-center gap-2">{actions}</div>}
          </div>
        )}
        <div style={{ height: typeof height === "number" ? `${height}px` : height }} className="w-full">
          {children}
        </div>
      </div>
    );
  }
);
AppChartContainer.displayName = "AppChartContainer";

export interface BreadcrumbItem {
  label: ReactNode;
  href?: string;
  onClick?: () => void;
  active?: boolean;
}

export interface AppBreadcrumbProps extends HTMLAttributes<HTMLElement> {
  items: BreadcrumbItem[];
  separator?: ReactNode;
}

export function AppBreadcrumb({ items, separator = "/", className = "", ...props }: AppBreadcrumbProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={["flex items-center gap-2 text-xs text-[var(--nebula-text-secondary)]", className].filter(Boolean).join(" ")}
      {...props}
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <div key={index} className="flex items-center gap-2">
            {item.href ? (
              <a href={item.href} className="hover:text-[var(--nebula-primary)] transition-colors">
                {item.label}
              </a>
            ) : item.onClick ? (
              <button
                type="button"
                onClick={item.onClick}
                className="hover:text-[var(--nebula-primary)] transition-colors cursor-pointer"
              >
                {item.label}
              </button>
            ) : (
              <span className={isLast || item.active ? "font-semibold text-[var(--nebula-text-primary)]" : ""}>
                {item.label}
              </span>
            )}
            {!isLast && <span className="text-[var(--nebula-text-muted)] select-none">{separator}</span>}
          </div>
        );
      })}
    </nav>
  );
}

export default AppChartContainer;
