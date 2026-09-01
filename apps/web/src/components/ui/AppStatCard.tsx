import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

export type StatTone = "default" | "success" | "warning" | "danger" | "info" | "primary";

export interface AppStatCardProps extends HTMLAttributes<HTMLDivElement> {
  label: string;
  value: string | number;
  icon?: ReactNode;
  tone?: StatTone;
  trend?: {
    value: string | number;
    isPositive?: boolean;
    label?: string;
  };
  subtext?: string;
  onClick?: () => void;
}

const toneIconStyles: Record<StatTone, string> = {
  default: "text-[var(--nebula-text-secondary)]",
  primary: "text-[var(--nebula-primary)]",
  success: "text-[var(--nebula-success)]",
  warning: "text-[var(--nebula-warning)]",
  danger: "text-[var(--nebula-danger)]",
  info: "text-[var(--nebula-info)]",
};

const toneValueStyles: Record<StatTone, string> = {
  default: "text-[var(--nebula-text-primary)]",
  primary: "text-[var(--nebula-primary)]",
  success: "text-[var(--nebula-success-text)]",
  warning: "text-[var(--nebula-warning-text)]",
  danger: "text-[var(--nebula-danger-text)]",
  info: "text-[var(--nebula-info-text)]",
};

export const AppStatCard = forwardRef<HTMLDivElement, AppStatCardProps>(
  (
    {
      label,
      value,
      icon,
      tone = "default",
      trend,
      subtext,
      onClick,
      className = "",
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        onClick={onClick}
        className={[
          "rounded-xl border border-[var(--nebula-border)] bg-[var(--nebula-surface)] p-6 shadow-sm transition-all duration-150",
          onClick ? "cursor-pointer hover:border-[var(--nebula-primary)] hover:shadow-md" : "",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        {...props}
      >
        <div className="flex items-center justify-between text-[var(--nebula-text-secondary)]">
          <span className="text-xs font-semibold uppercase tracking-wider">{label}</span>
          {icon && <div className={toneIconStyles[tone]}>{icon}</div>}
        </div>

        <div className={["mt-2 text-3xl font-bold font-mono", toneValueStyles[tone]].join(" ")}>
          {value}
        </div>

        {(trend || subtext) && (
          <div className="mt-2 flex items-center gap-2 text-xs text-[var(--nebula-text-secondary)]">
            {trend && (
              <span
                className={[
                  "inline-flex items-center gap-0.5 font-semibold",
                  trend.isPositive ? "text-[var(--nebula-success)]" : "text-[var(--nebula-danger)]",
                ].join(" ")}
              >
                {trend.isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                {trend.value}
              </span>
            )}
            {trend?.label && <span>{trend.label}</span>}
            {subtext && !trend && <span>{subtext}</span>}
          </div>
        )}
      </div>
    );
  }
);

AppStatCard.displayName = "AppStatCard";
export default AppStatCard;
