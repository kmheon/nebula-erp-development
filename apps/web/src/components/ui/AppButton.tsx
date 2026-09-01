import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { Loader2 } from "lucide-react";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger" | "success";
export type ButtonSize = "sm" | "md" | "lg";

export interface AppButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-[var(--nebula-primary)] text-white shadow-sm hover:opacity-90 active:opacity-95 focus-visible:ring-2 focus-visible:ring-[var(--nebula-primary)] focus-visible:ring-offset-2",
  secondary:
    "bg-[var(--nebula-surface-muted)] text-[var(--nebula-text-primary)] border border-[var(--nebula-border)] hover:bg-[var(--nebula-border)]/50 focus-visible:ring-2 focus-visible:ring-[var(--nebula-border)]",
  outline:
    "border border-[var(--nebula-border)] bg-transparent text-[var(--nebula-text-primary)] hover:bg-[var(--nebula-surface-muted)] focus-visible:ring-2 focus-visible:ring-[var(--nebula-primary)]",
  ghost:
    "bg-transparent text-[var(--nebula-text-secondary)] hover:bg-[var(--nebula-surface-muted)] hover:text-[var(--nebula-text-primary)] focus-visible:ring-2 focus-visible:ring-[var(--nebula-primary)]",
  danger:
    "bg-[var(--nebula-danger)] text-white shadow-sm hover:opacity-90 active:opacity-95 focus-visible:ring-2 focus-visible:ring-[var(--nebula-danger)]",
  success:
    "bg-[var(--nebula-success)] text-white shadow-sm hover:opacity-90 active:opacity-95 focus-visible:ring-2 focus-visible:ring-[var(--nebula-success)]",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-2.5 py-1.5 text-xs rounded-md gap-1.5",
  md: "px-4 py-2 text-sm rounded-lg gap-2",
  lg: "px-5 py-2.5 text-base rounded-xl gap-2.5",
};

export const AppButton = forwardRef<HTMLButtonElement, AppButtonProps>(
  (
    {
      children,
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      disabled,
      className = "",
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={[
          "inline-flex items-center justify-center font-medium transition-all duration-150 select-none cursor-pointer disabled:cursor-not-allowed disabled:opacity-50",
          variantStyles[variant],
          sizeStyles[size],
          fullWidth ? "w-full" : "",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="animate-spin" size={size === "sm" ? 14 : size === "lg" ? 18 : 16} />
        ) : (
          leftIcon
        )}
        <span>{children}</span>
        {!isLoading && rightIcon}
      </button>
    );
  }
);

AppButton.displayName = "AppButton";
export default AppButton;
