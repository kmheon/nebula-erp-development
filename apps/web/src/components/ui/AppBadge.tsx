import { forwardRef, type HTMLAttributes, type ReactNode } from "react";

export type BadgeTone = "neutral" | "primary" | "secondary" | "success" | "warning" | "danger" | "info";
export type BadgeVariant = "subtle" | "solid" | "outline" | "dot";
export type BadgeSize = "sm" | "md" | "lg";

export interface AppBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
  icon?: ReactNode;
}

const toneStyles: Record<BadgeTone, Record<"subtle" | "solid" | "outline", string>> = {
  neutral: {
    subtle: "bg-[var(--nebula-surface-muted)] text-[var(--nebula-text-secondary)] border border-[var(--nebula-border)]",
    solid: "bg-[var(--nebula-text-secondary)] text-white",
    outline: "border border-[var(--nebula-border)] text-[var(--nebula-text-secondary)]",
  },
  primary: {
    subtle: "bg-[var(--nebula-primary)]/10 text-[var(--nebula-primary)] border border-[var(--nebula-primary)]/20",
    solid: "bg-[var(--nebula-primary)] text-white",
    outline: "border border-[var(--nebula-primary)] text-[var(--nebula-primary)]",
  },
  secondary: {
    subtle: "bg-[var(--nebula-secondary)]/10 text-[var(--nebula-secondary)] border border-[var(--nebula-secondary)]/20",
    solid: "bg-[var(--nebula-secondary)] text-white",
    outline: "border border-[var(--nebula-secondary)] text-[var(--nebula-secondary)]",
  },
  success: {
    subtle: "bg-[var(--nebula-success-bg)] text-[var(--nebula-success-text)] border border-[var(--nebula-success)]/20",
    solid: "bg-[var(--nebula-success)] text-white",
    outline: "border border-[var(--nebula-success)] text-[var(--nebula-success)]",
  },
  warning: {
    subtle: "bg-[var(--nebula-warning-bg)] text-[var(--nebula-warning-text)] border border-[var(--nebula-warning)]/20",
    solid: "bg-[var(--nebula-warning)] text-white",
    outline: "border border-[var(--nebula-warning)] text-[var(--nebula-warning)]",
  },
  danger: {
    subtle: "bg-[var(--nebula-danger-bg)] text-[var(--nebula-danger-text)] border border-[var(--nebula-danger)]/20",
    solid: "bg-[var(--nebula-danger)] text-white",
    outline: "border border-[var(--nebula-danger)] text-[var(--nebula-danger)]",
  },
  info: {
    subtle: "bg-[var(--nebula-info-bg)] text-[var(--nebula-info-text)] border border-[var(--nebula-info)]/20",
    solid: "bg-[var(--nebula-info)] text-white",
    outline: "border border-[var(--nebula-info)] text-[var(--nebula-info)]",
  },
};

const dotColors: Record<BadgeTone, string> = {
  neutral: "bg-[var(--nebula-text-muted)]",
  primary: "bg-[var(--nebula-primary)]",
  secondary: "bg-[var(--nebula-secondary)]",
  success: "bg-[var(--nebula-success)]",
  warning: "bg-[var(--nebula-warning)]",
  danger: "bg-[var(--nebula-danger)]",
  info: "bg-[var(--nebula-info)]",
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: "px-2 py-0.5 text-[11px] gap-1",
  md: "px-2.5 py-1 text-xs gap-1.5",
  lg: "px-3 py-1.5 text-sm gap-2",
};

export const AppBadge = forwardRef<HTMLSpanElement, AppBadgeProps>(
  (
    {
      children,
      tone = "neutral",
      variant = "subtle",
      size = "md",
      dot = false,
      icon,
      className = "",
      ...props
    },
    ref
  ) => {
    return (
      <span
        ref={ref}
        className={[
          "inline-flex items-center font-medium rounded-full select-none whitespace-nowrap",
          variant === "dot" ? toneStyles[tone].subtle : toneStyles[tone][variant],
          sizeStyles[size],
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        {...props}
      >
        {(dot || variant === "dot") && (
          <span className={["h-1.5 w-1.5 rounded-full shrink-0", dotColors[tone]].join(" ")} />
        )}
        {icon && <span className="shrink-0">{icon}</span>}
        <span>{children}</span>
      </span>
    );
  }
);
AppBadge.displayName = "AppBadge";

export interface AppStatusIndicatorProps extends HTMLAttributes<HTMLDivElement> {
  status: "active" | "inactive" | "pending" | "error" | "warning" | "success";
  label?: ReactNode;
  pulse?: boolean;
}

const statusToneMap: Record<string, BadgeTone> = {
  active: "success",
  success: "success",
  inactive: "neutral",
  pending: "warning",
  warning: "warning",
  error: "danger",
};

export function AppStatusIndicator({
  status,
  label,
  pulse = false,
  className = "",
  ...props
}: AppStatusIndicatorProps) {
  const tone = statusToneMap[status] || "neutral";

  return (
    <div className={["inline-flex items-center gap-2 text-xs font-medium text-[var(--nebula-text-primary)]", className].filter(Boolean).join(" ")} {...props}>
      <span className="relative flex h-2 w-2">
        {pulse && (
          <span
            className={[
              "absolute inline-flex h-full w-full animate-ping rounded-full opacity-75",
              dotColors[tone],
            ].join(" ")}
          />
        )}
        <span className={["relative inline-flex h-2 w-2 rounded-full", dotColors[tone]].join(" ")} />
      </span>
      {label && <span>{label}</span>}
    </div>
  );
}

export default AppBadge;
