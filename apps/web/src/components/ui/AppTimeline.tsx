import { type ReactNode } from "react";

export interface TimelineEvent {
  id: string;
  title: ReactNode;
  timestamp?: string;
  description?: ReactNode;
  icon?: ReactNode;
  tone?: "primary" | "success" | "warning" | "danger" | "info" | "neutral";
}

export interface AppTimelineProps {
  events: TimelineEvent[];
  className?: string;
}

const toneDotStyles = {
  primary: "bg-[var(--nebula-primary)] ring-4 ring-[var(--nebula-primary)]/20",
  success: "bg-[var(--nebula-success)] ring-4 ring-[var(--nebula-success)]/20",
  warning: "bg-[var(--nebula-warning)] ring-4 ring-[var(--nebula-warning)]/20",
  danger: "bg-[var(--nebula-danger)] ring-4 ring-[var(--nebula-danger)]/20",
  info: "bg-[var(--nebula-info)] ring-4 ring-[var(--nebula-info)]/20",
  neutral: "bg-[var(--nebula-text-muted)] ring-4 ring-[var(--nebula-border)]",
};

export function AppTimeline({ events, className = "" }: AppTimelineProps) {
  return (
    <div className={["relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-[var(--nebula-border)]", className].filter(Boolean).join(" ")}>
      {events.map((event) => (
        <div key={event.id} className="relative group">
          <div
            className={[
              "absolute -left-6 top-1 h-4 w-4 rounded-full flex items-center justify-center text-white",
              toneDotStyles[event.tone || "primary"],
            ].join(" ")}
          >
            {event.icon}
          </div>
          <div className="rounded-xl border border-[var(--nebula-border)] bg-[var(--nebula-surface)] p-4 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h4 className="font-semibold text-sm text-[var(--nebula-text-primary)]">{event.title}</h4>
              {event.timestamp && (
                <span className="text-xs text-[var(--nebula-text-muted)] font-mono">{event.timestamp}</span>
              )}
            </div>
            {event.description && (
              <div className="mt-1 text-xs text-[var(--nebula-text-secondary)]">{event.description}</div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default AppTimeline;
