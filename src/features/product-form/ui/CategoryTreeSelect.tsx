import { Plus } from "lucide-react";
import { cn } from "@shared/lib/utils/helpers";
import { CategoryTreeNode } from "./CategoryTreeNode";
import { CategoryAddNewInput } from "./CategoryAddNewInput";
import type {
  CategoryTreeNode as CategoryTreeNodeType,
  CategorySelection,
  TreeExpandedState,
  AddNewModeState,
} from "../model/interface";

const LEVEL_INDENT: Record<1 | 2 | 3, string> = {
  1: "pl-0",
  2: "pl-6",
  3: "pl-12",
};

interface CategoryTreeSelectProps {
  treeNodes: CategoryTreeNodeType[];
  selection: CategorySelection | null;
  expandedNodes: TreeExpandedState;
  addNewMode: AddNewModeState;
  onSelect: (node: CategoryTreeNodeType) => void;
  onToggleExpand: (nodeUid: string) => void;
  onAddNewStart: (level: 1 | 2 | 3, parentUid: string | null) => void;
  onAddNewChange: (value: string) => void;
  onAddNewSubmit: () => void;
  onAddNewCancel: () => void;
  isSelected: (uid: string) => boolean;
  isInSelectedPath: (uid: string) => boolean;
  error?: string;
  disabled?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  t: (key: any) => string;
}

function AddNewButton({
  level,
  onClick,
  label,
}: {
  level: 1 | 2 | 3;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      className={cn(
        "flex items-center gap-2 py-1.5 px-2 rounded-md w-full text-left",
        "hover:bg-muted/50 transition-colors",
        "text-muted-foreground text-sm",
        LEVEL_INDENT[level],
      )}
      onClick={onClick}
    >
      <span className="w-5 shrink-0" />
      <Plus className="h-4 w-4" />
      <span>{label}</span>
    </button>
  );
}

function renderTree(
  nodes: CategoryTreeNodeType[],
  props: {
    expandedNodes: TreeExpandedState;
    addNewMode: AddNewModeState;
    onSelect: (node: CategoryTreeNodeType) => void;
    onToggleExpand: (nodeUid: string) => void;
    onAddNewStart: (level: 1 | 2 | 3, parentUid: string | null) => void;
    onAddNewChange: (value: string) => void;
    onAddNewSubmit: () => void;
    onAddNewCancel: () => void;
    isSelected: (uid: string) => boolean;
    isInSelectedPath: (uid: string) => boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    t: (key: any) => string;
  },
): React.ReactNode {
  return nodes.map((node) => {
    // Handle "Add new" virtual node
    if (node.isAddNew) {
      const isAddNewActive =
        props.addNewMode.activeLevel === node.level &&
        props.addNewMode.parentUid === (node.parentUid ?? null);

      if (isAddNewActive) {
        return (
          <CategoryAddNewInput
            key={node.uid}
            value={props.addNewMode.inputValue}
            onChange={props.onAddNewChange}
            onSubmit={props.onAddNewSubmit}
            onCancel={props.onAddNewCancel}
            placeholder={props.t("addCategoryPlaceholder")}
            level={node.level}
          />
        );
      }

      const label =
        node.level === 1
          ? props.t("addNewCategory")
          : node.level === 2
            ? props.t("addNewSubcategory")
            : props.t("addNewSubSubcategory");

      return (
        <AddNewButton
          key={node.uid}
          level={node.level}
          onClick={() => props.onAddNewStart(node.level, node.parentUid ?? null)}
          label={label}
        />
      );
    }

    // Regular node
    const hasChildren = node.children.filter((c) => !c.isAddNew).length > 0;
    const isExpanded = props.expandedNodes[node.uid] || false;
    const nodeIsSelected = props.isSelected(node.uid);
    const nodeIsInPath = props.isInSelectedPath(node.uid);

    return (
      <CategoryTreeNode
        key={node.uid}
        node={node}
        isSelected={nodeIsSelected}
        isExpanded={isExpanded}
        isInSelectedPath={nodeIsInPath}
        hasChildren={hasChildren || node.children.some((c) => c.isAddNew)}
        onSelect={() => props.onSelect(node)}
        onToggleExpand={() => props.onToggleExpand(node.uid)}
      >
        {(isExpanded || (node.children.length > 0 && isExpanded)) &&
          renderTree(node.children, props)}
      </CategoryTreeNode>
    );
  });
}

export function CategoryTreeSelect({
  treeNodes,
  selection,
  expandedNodes,
  addNewMode,
  onSelect,
  onToggleExpand,
  onAddNewStart,
  onAddNewChange,
  onAddNewSubmit,
  onAddNewCancel,
  isSelected,
  isInSelectedPath,
  error,
  disabled,
  t,
}: CategoryTreeSelectProps) {
  return (
    <div
      className={cn(
        "border rounded-md",
        error && "border-destructive",
        disabled && "opacity-50 pointer-events-none",
      )}
    >
      {/* Selected path breadcrumb */}
      {selection && selection.displayPath.length > 0 && (
        <div className="px-3 py-2 border-b bg-muted/30">
          <span className="text-xs text-muted-foreground mr-2">
            {t("selectedPath")}:
          </span>
          <span className="text-sm font-medium">
            {selection.displayPath.join(" > ")}
          </span>
        </div>
      )}

      {/* Tree content */}
      <div
        className="max-h-64 overflow-y-auto p-2"
        role="tree"
        aria-label={t("categoryTree")}
      >
        {treeNodes.length === 0 ? (
          <div className="text-center py-4 text-muted-foreground text-sm">
            {t("noCategories")}
          </div>
        ) : (
          renderTree(treeNodes, {
            expandedNodes,
            addNewMode,
            onSelect,
            onToggleExpand,
            onAddNewStart,
            onAddNewChange,
            onAddNewSubmit,
            onAddNewCancel,
            isSelected,
            isInSelectedPath,
            t,
          })
        )}
      </div>
    </div>
  );
}
