import { forwardRef, type HTMLAttributes, type ReactNode } from "react";

export type HeaderSize = "sm" | "md" | "lg";

export interface AppHeaderProps extends HTMLAttributes<HTMLElement> {
  /** Slot for brand, hamburger menu, company selector, or breadcrumbs */
  left?: ReactNode;
  /** Slot for global search, title, or navigation links */
  center?: ReactNode;
  /** Slot for quick actions, notifications, status badges, and user profile */
  right?: ReactNode;
  /** Custom children override if left/center/right slots are not used */
  children?: ReactNode;
  /** Height preset for the header */
  size?: HeaderSize;
  /** Fixes header to the top of viewport with high z-index */
  sticky?: boolean;
  /** Applies frosted glass translucent backdrop blur */
  blurred?: boolean;
  /** Displays bottom divider border using semantic border token */
  bordered?: boolean;
}

const sizeClasses: Record<HeaderSize, string> = {
  sm: "h-14",
  md: "h-16",
  lg: "h-20",
};

export const AppHeader = forwardRef<HTMLElement, AppHeaderProps>(
  (
    {
      left,
      center,
      right,
      children,
      size = "md",
      sticky = true,
      blurred = true,
      bordered = true,
      id = "app-header",
      className = "",
      ...props
    },
    ref
  ) => {
    return (
      <header
        ref={ref}
        id={id}
        role="banner"
        className={[
          "flex w-full items-center justify-between px-4 lg:px-6 text-[var(--nebula-text-primary)] transition-colors",
          sizeClasses[size],
          sticky ? "sticky top-0 z-30" : "relative",
          blurred
            ? "bg-[var(--nebula-surface)]/80 backdrop-blur-md"
            : "bg-[var(--nebula-surface)]",
          bordered ? "border-b border-[var(--nebula-border)]" : "",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        {...props}
      >
        {children ? (
          children
        ) : (
          <>
            {/* Left Slot: Identity, Navigation & Context */}
            {left && (
              <div className="flex items-center min-w-0 shrink-0">
                {left}
              </div>
            )}

            {/* Center Slot: Global Search / Title / Context */}
            {center && (
              <div className="flex flex-1 items-center justify-center min-w-0 px-2 sm:px-4">
                {center}
              </div>
            )}

            {/* Right Slot: Actions, Notifications & Profile */}
            {right && (
              <div className="flex items-center justify-end min-w-0 shrink-0">
                {right}
              </div>
            )}
          </>
        )}
      </header>
    );
  }
);

AppHeader.displayName = "AppHeader";
export default AppHeader;
