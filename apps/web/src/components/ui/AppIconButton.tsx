import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { Loader2 } from "lucide-react";
import type { ButtonVariant, ButtonSize } from "./AppButton";

export interface AppIconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  icon: ReactNode;
  "aria-label": string;
}

const sizeStyles: Record<ButtonSize, string> = {
  sm: "p-1.5 rounded-md",
  md: "p-2 rounded-lg",
  lg: "p-2.5 rounded-xl",
};

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-[var(--nebula-primary)] text-white shadow-sm hover:opacity-90 active:opacity-95",
  secondary:
    "bg-[var(--nebula-surface-muted)] text-[var(--nebula-text-primary)] border border-[var(--nebula-border)] hover:bg-[var(--nebula-border)]/50",
  outline:
    "border border-[var(--nebula-border)] bg-transparent text-[var(--nebula-text-primary)] hover:bg-[var(--nebula-surface-muted)]",
  ghost:
    "bg-transparent text-[var(--nebula-text-secondary)] hover:bg-[var(--nebula-surface-muted)] hover:text-[var(--nebula-text-primary)]",
  danger:
    "bg-[var(--nebula-danger)] text-white shadow-sm hover:opacity-90 active:opacity-95",
  success:
    "bg-[var(--nebula-success)] text-white shadow-sm hover:opacity-90 active:opacity-95",
};

export const AppIconButton = forwardRef<HTMLButtonElement, AppIconButtonProps>(
  (
    {
      variant = "ghost",
      size = "md",
      isLoading = false,
      icon,
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
          "inline-flex items-center justify-center transition-all duration-150 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50",
          variantStyles[variant],
          sizeStyles[size],
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="animate-spin" size={size === "sm" ? 14 : size === "lg" ? 18 : 16} />
        ) : (
          icon
        )}
      </button>
    );
  }
);

AppIconButton.displayName = "AppIconButton";
export default AppIconButton;
