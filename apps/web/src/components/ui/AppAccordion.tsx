import { useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";

export interface AccordionItem {
  id: string;
  title: ReactNode;
  content: ReactNode;
  icon?: ReactNode;
  badge?: ReactNode;
}

export interface AppAccordionProps {
  items: AccordionItem[];
  allowMultiple?: boolean;
  defaultExpanded?: string[];
  className?: string;
}

export function AppAccordion({
  items,
  allowMultiple = false,
  defaultExpanded = [],
  className = "",
}: AppAccordionProps) {
  const [expanded, setExpanded] = useState<string[]>(defaultExpanded);

  const toggle = (id: string) => {
    if (expanded.includes(id)) {
      setExpanded(expanded.filter((item) => item !== id));
    } else {
      setExpanded(allowMultiple ? [...expanded, id] : [id]);
    }
  };

  return (
    <div className={["space-y-3", className].filter(Boolean).join(" ")}>
      {items.map((item) => {
        const isOpen = expanded.includes(item.id);
        return (
          <div
            key={item.id}
            className="rounded-xl border border-[var(--nebula-border)] bg-[var(--nebula-surface)] shadow-sm overflow-hidden"
          >
            <button
              type="button"
              onClick={() => toggle(item.id)}
              className="flex w-full items-center justify-between p-4 text-left font-semibold text-[var(--nebula-text-primary)] hover:bg-[var(--nebula-surface-muted)] transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                {item.icon}
                <span>{item.title}</span>
                {item.badge}
              </div>
              <ChevronDown
                size={18}
                className={[
                  "text-[var(--nebula-text-muted)] transition-transform duration-200",
                  isOpen ? "rotate-180" : "",
                ].join(" ")}
              />
            </button>
            {isOpen && (
              <div className="p-4 pt-0 border-t border-[var(--nebula-border)] text-sm text-[var(--nebula-text-secondary)]">
                <div className="pt-4">{item.content}</div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default AppAccordion;
