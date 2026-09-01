export type SystemStatusVariant = "online" | "warning" | "offline" | "maintenance";

interface SystemStatusProps {
  variant: SystemStatusVariant;
  /** Show text label next to indicator */
  showLabel?: boolean;
  /** Hide label text on smaller screens (below md) while keeping the indicator */
  responsive?: boolean;
  /** Compact mode - only show the dot indicator */
  compact?: boolean;
  /** Custom className */
  className?: string;
}

const variantConfig: Record<
  SystemStatusVariant,
  {
    label: string;
    shortLabel: string;
    colorToken: string;
    bgToken: string;
  }
> = {
  online: {
    label: "System Online",
    shortLabel: "Online",
    colorToken: "var(--nebula-success, #16a34a)",
    bgToken: "var(--nebula-success-bg, rgba(22, 163, 74, 0.12))",
  },
  warning: {
    label: "System Warning",
    shortLabel: "Warning",
    colorToken: "var(--nebula-warning, #d97706)",
    bgToken: "var(--nebula-warning-bg, rgba(217, 119, 6, 0.12))",
  },
  offline: {
    label: "System Offline",
    shortLabel: "Offline",
    colorToken: "var(--nebula-danger, #dc2626)",
    bgToken: "var(--nebula-danger-bg, rgba(220, 38, 38, 0.12))",
  },
  maintenance: {
    label: "Maintenance",
    shortLabel: "Maint.",
    colorToken: "var(--nebula-info, #0284c7)",
    bgToken: "var(--nebula-info-bg, rgba(2, 132, 199, 0.12))",
  },
};

/**
 * System Status Indicator Component
 *
 * Displays system health status with theme-adaptive styling and pulse effects.
 * Harmonizes with all active theme tokens (light/dark/custom presets) and
 * prevents overlapping on various window viewports.
 */
export default function SystemStatus({
  variant,
  showLabel = true,
  responsive = false,
  compact = false,
  className = "",
}: SystemStatusProps) {
  const { label, shortLabel, colorToken, bgToken } = variantConfig[variant];

  return (
    <div
      className={`inline-flex items-center gap-2 select-none whitespace-nowrap shrink-0 transition-colors duration-200 ${className}`}
      role="status"
      aria-live="polite"
      aria-label={label}
      title={label}
    >
      <div className="relative flex h-3.5 w-3.5 shrink-0 items-center justify-center">
        {/* Glow ring - animated ping */}
        <div
          className="absolute inset-0 rounded-full opacity-75 animate-ping"
          style={{
            backgroundColor: colorToken,
            animationDuration: "2.5s",
          }}
          aria-hidden="true"
        />

        {/* Outer subtle glow badge */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            backgroundColor: bgToken,
          }}
          aria-hidden="true"
        />

        {/* Main solid dot */}
        <div
          className="relative z-10 h-2 w-2 rounded-full transition-transform duration-300"
          style={{ backgroundColor: colorToken }}
          aria-hidden="true"
        />
      </div>

      {!compact && showLabel && (
        <span
          className={`text-xs font-semibold tracking-tight transition-colors duration-200 ${
            responsive ? "hidden sm:inline-block" : "inline-block"
          }`}
          style={{ color: "var(--nebula-text-secondary)" }}
        >
          <span className="hidden md:inline">{label}</span>
          <span className="inline md:hidden">{shortLabel}</span>
        </span>
      )}
    </div>
  );
}
