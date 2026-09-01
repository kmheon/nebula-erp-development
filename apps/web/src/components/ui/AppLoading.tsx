import { type HTMLAttributes, type ReactNode } from "react";
import { Loader2 } from "lucide-react";

export interface AppLoadingProps extends HTMLAttributes<HTMLDivElement> {
  label?: ReactNode;
  size?: "sm" | "md" | "lg";
  fullScreen?: boolean;
}

export function AppLoading({
  label = "Loading...",
  size = "md",
  fullScreen = false,
  className = "",
  ...props
}: AppLoadingProps) {
  const iconSize = size === "sm" ? 18 : size === "lg" ? 36 : 24;

  const content = (
    <div
      className={["flex flex-col items-center justify-center gap-3 p-6 text-[var(--nebula-text-secondary)]", className].filter(Boolean).join(" ")}
      {...props}
    >
      <Loader2 size={iconSize} className="animate-spin text-[var(--nebula-primary)]" />
      {label && <span className="text-xs font-medium">{label}</span>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--nebula-background)]/80 backdrop-blur-xs">
        {content}
      </div>
    );
  }

  return content;
}

export interface AppSkeletonProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "text" | "circular" | "rectangular";
  width?: string | number;
  height?: string | number;
}

export function AppSkeleton({
  variant = "rectangular",
  width,
  height,
  className = "",
  style,
  ...props
}: AppSkeletonProps) {
  const customStyle = {
    width: typeof width === "number" ? `${width}px` : width,
    height: typeof height === "number" ? `${height}px` : height,
    ...style,
  };

  const variantClass =
    variant === "circular"
      ? "rounded-full"
      : variant === "text"
      ? "rounded h-4 w-full"
      : "rounded-xl";

  return (
    <div
      className={[
        "animate-pulse bg-[var(--nebula-surface-muted)] border border-[var(--nebula-border)]/50",
        variantClass,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={customStyle}
      {...props}
    />
  );
}

export default AppLoading;
