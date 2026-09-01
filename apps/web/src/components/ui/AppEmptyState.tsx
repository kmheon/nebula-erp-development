import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { FolderOpen } from "lucide-react";

export interface AppEmptyStateProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  icon?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
}

export const AppEmptyState = forwardRef<HTMLDivElement, AppEmptyStateProps>(
  (
    {
      icon = <FolderOpen size={36} className="text-[var(--nebula-text-muted)]" />,
      title,
      description,
      action,
      className = "",
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={[
          "flex flex-col items-center justify-center p-8 text-center rounded-xl border border-dashed border-[var(--nebula-border)] bg-[var(--nebula-surface-muted)]/40",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        {...props}
      >
        <div className="mb-3 rounded-full bg-[var(--nebula-surface)] p-3 border border-[var(--nebula-border)] shadow-xs">
          {icon}
        </div>
        <h4 className="text-base font-bold text-[var(--nebula-text-primary)]">{title}</h4>
        {description && (
          <p className="mt-1 max-w-sm text-xs text-[var(--nebula-text-secondary)]">{description}</p>
        )}
        {action && <div className="mt-4">{action}</div>}
      </div>
    );
  }
);

AppEmptyState.displayName = "AppEmptyState";
export default AppEmptyState;
