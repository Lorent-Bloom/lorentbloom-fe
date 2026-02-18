import { ChevronRight, ChevronDown, Circle, CircleDot } from "lucide-react";
import { cn } from "@shared/lib/utils/helpers";
import type { CategoryTreeNodeProps } from "../model/interface";

const LEVEL_INDENT: Record<1 | 2 | 3, string> = {
  1: "pl-0",
  2: "pl-6",
  3: "pl-12",
};

export function CategoryTreeNode({
  node,
  isSelected,
  isExpanded,
  isInSelectedPath,
  hasChildren,
  onSelect,
  onToggleExpand,
  children,
}: CategoryTreeNodeProps) {
  return (
    <div>
      <div
        className={cn(
          "flex items-center gap-2 py-1.5 px-2 rounded-md cursor-pointer transition-colors",
          "hover:bg-muted/50",
          isSelected && "bg-primary/10",
          isInSelectedPath && !isSelected && "font-medium",
          LEVEL_INDENT[node.level],
        )}
        onClick={onSelect}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onSelect();
          }
        }}
        role="treeitem"
        tabIndex={0}
        aria-selected={isSelected}
        aria-expanded={hasChildren ? isExpanded : undefined}
      >
        {/* Expand/collapse button */}
        {hasChildren ? (
          <button
            type="button"
            className="p-0.5 hover:bg-muted rounded shrink-0"
            onClick={(e) => {
              e.stopPropagation();
              onToggleExpand();
            }}
            aria-label={isExpanded ? "Collapse" : "Expand"}
          >
            {isExpanded ? (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            )}
          </button>
        ) : (
          <span className="w-5 shrink-0" />
        )}

        {/* Node name */}
        <span
          className={cn(
            "flex-1 truncate text-sm",
            node.isNew && "italic text-muted-foreground",
          )}
        >
          {node.name}
          {node.isNew && " (new)"}
        </span>

        {/* Selection indicator - only for level 3 */}
        {node.level === 3 && (
          isSelected ? (
            <CircleDot className="h-4 w-4 text-primary shrink-0" />
          ) : (
            <Circle className="h-4 w-4 text-muted-foreground shrink-0" />
          )
        )}
      </div>

      {/* Children (only visible when expanded) */}
      {hasChildren && isExpanded && (
        <div role="group" aria-label={`${node.name} children`}>
          {children}
        </div>
      )}
    </div>
  );
}
