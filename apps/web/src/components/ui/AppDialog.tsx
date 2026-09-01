import { useEffect, type ReactNode } from "react";
import { X } from "lucide-react";
import AppIconButton from "./AppIconButton";

export interface AppDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title?: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "4xl";
}

const maxWidthStyles = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
  "4xl": "max-w-4xl",
};

export function AppDialog({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  maxWidth = "lg",
}: AppDialogProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-200"
        aria-hidden="true"
      />

      {/* Modal Container */}
      <div
        role="dialog"
        aria-modal="true"
        className={[
          "relative w-full rounded-2xl border border-[var(--nebula-border)] bg-[var(--nebula-surface)] p-6 shadow-xl transition-all z-10 overflow-hidden max-h-[90vh] flex flex-col",
          maxWidthStyles[maxWidth],
        ].join(" ")}
      >
        {/* Header */}
        {(title || description) && (
          <div className="flex items-start justify-between pb-4 border-b border-[var(--nebula-border)] mb-4">
            <div>
              {title && <h2 className="text-xl font-bold text-[var(--nebula-text-primary)]">{title}</h2>}
              {description && <p className="mt-1 text-xs text-[var(--nebula-text-secondary)]">{description}</p>}
            </div>
            <AppIconButton
              icon={<X size={18} />}
              aria-label="Close dialog"
              variant="ghost"
              size="sm"
              onClick={onClose}
            />
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto pr-1">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="mt-6 pt-4 border-t border-[var(--nebula-border)] flex items-center justify-end gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

export interface AppDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  position?: "left" | "right";
  width?: "sm" | "md" | "lg" | "xl";
}

const drawerWidthStyles = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
};

export function AppDrawer({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  position = "right",
  width = "md",
}: AppDrawerProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity duration-200"
        aria-hidden="true"
      />
      <div className={`fixed inset-y-0 ${position === "right" ? "right-0" : "left-0"} flex max-w-full`}>
        <div
          className={[
            "relative w-screen border-[var(--nebula-border)] bg-[var(--nebula-surface)] p-6 shadow-2xl flex flex-col",
            position === "right" ? "border-l" : "border-r",
            drawerWidthStyles[width],
          ].join(" ")}
        >
          <div className="flex items-start justify-between pb-4 border-b border-[var(--nebula-border)] mb-4">
            <div>
              {title && <h2 className="text-xl font-bold text-[var(--nebula-text-primary)]">{title}</h2>}
              {description && <p className="mt-1 text-xs text-[var(--nebula-text-secondary)]">{description}</p>}
            </div>
            <AppIconButton
              icon={<X size={18} />}
              aria-label="Close drawer"
              variant="ghost"
              size="sm"
              onClick={onClose}
            />
          </div>

          <div className="flex-1 overflow-y-auto">{children}</div>

          {footer && (
            <div className="mt-6 pt-4 border-t border-[var(--nebula-border)] flex items-center justify-end gap-3">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AppDialog;
