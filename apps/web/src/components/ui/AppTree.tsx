import { useState, type ReactNode } from "react";
import { ChevronRight, Folder, FolderOpen, File } from "lucide-react";

export interface TreeNode {
  id: string;
  label: ReactNode;
  icon?: ReactNode;
  children?: TreeNode[];
  data?: any;
}

export interface AppTreeProps {
  nodes: TreeNode[];
  onSelect?: (node: TreeNode) => void;
  selectedId?: string;
  className?: string;
}

function TreeNodeItem({
  node,
  level = 0,
  onSelect,
  selectedId,
}: {
  node: TreeNode;
  level?: number;
  onSelect?: (node: TreeNode) => void;
  selectedId?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = Boolean(node.children && node.children.length > 0);
  const isSelected = selectedId === node.id;

  return (
    <div className="select-none">
      <div
        onClick={() => {
          if (hasChildren) setIsOpen(!isOpen);
          onSelect?.(node);
        }}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
        className={[
          "flex items-center gap-2 py-1.5 pr-3 text-sm rounded-lg cursor-pointer transition-colors",
          isSelected
            ? "bg-[var(--nebula-primary)]/10 text-[var(--nebula-primary)] font-semibold"
            : "text-[var(--nebula-text-primary)] hover:bg-[var(--nebula-surface-muted)]",
        ].join(" ")}
      >
        {hasChildren ? (
          <ChevronRight
            size={14}
            className={[
              "text-[var(--nebula-text-muted)] transition-transform duration-150",
              isOpen ? "rotate-90" : "",
            ].join(" ")}
          />
        ) : (
          <span className="w-3.5" />
        )}
        <div className="text-[var(--nebula-primary)]">
          {node.icon || (hasChildren ? (isOpen ? <FolderOpen size={16} /> : <Folder size={16} />) : <File size={16} />)}
        </div>
        <span className="truncate">{node.label}</span>
      </div>
      {hasChildren && isOpen && (
        <div className="space-y-0.5">
          {node.children!.map((child) => (
            <TreeNodeItem
              key={child.id}
              node={child}
              level={level + 1}
              onSelect={onSelect}
              selectedId={selectedId}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function AppTree({ nodes, onSelect, selectedId, className = "" }: AppTreeProps) {
  return (
    <div className={["space-y-0.5 rounded-xl border border-[var(--nebula-border)] bg-[var(--nebula-surface)] p-2 shadow-sm", className].filter(Boolean).join(" ")}>
      {nodes.map((node) => (
        <TreeNodeItem
          key={node.id}
          node={node}
          onSelect={onSelect}
          selectedId={selectedId}
        />
      ))}
    </div>
  );
}

export default AppTree;
