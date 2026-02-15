"use client";

import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import type { CategoryTree } from "@entities/category";
import type {
  TreeExpandedState,
  CategorySelection,
  CategoryTreeNode,
  AddNewModeState,
} from "../model/interface";

interface UseCategoryTreeProps {
  categories: CategoryTree[];
  initialSelection?: {
    category_id: string;
    subcategory_id: string;
    sub_subcategory_id: string;
  };
  onSelectionChange: (selection: CategorySelection | null) => void;
}

const ADD_NEW_PREFIX = "add-new-";
const NEW_CATEGORY_PREFIX = "new:";

/** Represents a user-created category that hasn't been saved yet */
interface PendingCategory {
  uid: string; // Format: "new:CategoryName"
  name: string;
  level: 1 | 2 | 3;
  parentUid: string | null;
}

/**
 * Transform CategoryTree[] to CategoryTreeNode[] with "Add new" virtual nodes
 * and inject pending (user-created) categories
 */
function transformToTreeNodes(
  categories: CategoryTree[],
  pendingCategories: PendingCategory[],
  level: 1 | 2 | 3 = 1,
  parentUid: string | null = null,
): CategoryTreeNode[] {
  const nodes: CategoryTreeNode[] = [];

  // Add existing categories
  for (const cat of categories) {
    let children: CategoryTreeNode[] = [];

    if (level < 3 && cat.children && cat.children.length > 0) {
      children = transformToTreeNodes(
        cat.children,
        pendingCategories,
        (level + 1) as 1 | 2 | 3,
        cat.uid,
      );
    } else if (level < 3) {
      // At level 1 or 2 without children, add "Add new" for next level
      children = transformToTreeNodes(
        [],
        pendingCategories,
        (level + 1) as 1 | 2 | 3,
        cat.uid,
      );
    }

    nodes.push({
      uid: cat.uid,
      id: cat.id,
      name: cat.name,
      level,
      children,
      parentUid: parentUid ?? undefined,
    });
  }

  // Add pending (user-created) categories at this level
  const pendingAtLevel = pendingCategories.filter(
    (p) => p.level === level && p.parentUid === parentUid,
  );

  for (const pending of pendingAtLevel) {
    let children: CategoryTreeNode[] = [];

    if (level < 3) {
      // For new categories at level 1 or 2, create children with pending subcategories + "Add new"
      children = transformToTreeNodes(
        [], // No existing categories under a new one
        pendingCategories,
        (level + 1) as 1 | 2 | 3,
        pending.uid,
      );
    }

    nodes.push({
      uid: pending.uid,
      id: -1,
      name: pending.name,
      level,
      children,
      parentUid: parentUid ?? undefined,
      isNew: true,
    });
  }

  // Add "Add new" virtual node at the end of current level
  // Always add for level 1, or when there's a parent (we're inside a category)
  if (nodes.length > 0 || level === 1 || parentUid !== null) {
    nodes.push({
      uid: `${ADD_NEW_PREFIX}${level}-${parentUid ?? "root"}`,
      id: -1,
      name: "",
      level,
      children: [],
      isAddNew: true,
      parentUid: parentUid ?? undefined,
    });
  }

  return nodes;
}

/**
 * Try to extract a numeric ID from a UID string.
 * Handles plain numbers ("42"), base64-encoded numbers ("NDI="), etc.
 */
function uidToNumericId(uid: string): number | null {
  if (!uid || uid.startsWith(NEW_CATEGORY_PREFIX) || uid.startsWith(ADD_NEW_PREFIX)) return null;
  if (/^\d+$/.test(uid)) return parseInt(uid, 10);
  try {
    const decoded = atob(uid);
    const parsed = parseInt(decoded, 10);
    if (!isNaN(parsed) && String(parsed) === decoded.trim()) return parsed;
  } catch {
    // Not valid base64
  }
  return null;
}

/**
 * Find a node by UID in the tree.
 * Falls back to matching by decoded numeric ID if direct UID match fails.
 */
function findNodeByUid(
  nodes: CategoryTreeNode[],
  uid: string,
): CategoryTreeNode | null {
  // First try exact UID match
  for (const node of nodes) {
    if (node.uid === uid) return node;
    if (node.children.length > 0) {
      const found = findNodeByUid(node.children, uid);
      if (found) return found;
    }
  }

  // Fallback: try matching by decoded numeric ID
  // This handles cases where product returns numeric id but tree uses base64 uid
  const targetId = uidToNumericId(uid);
  if (targetId !== null) {
    return findNodeById(nodes, targetId);
  }

  return null;
}

/**
 * Find a node by numeric ID in the tree
 */
function findNodeById(
  nodes: CategoryTreeNode[],
  id: number,
): CategoryTreeNode | null {
  for (const node of nodes) {
    if (node.id === id) return node;
    // Also check if the node's UID decodes to this ID
    if (uidToNumericId(node.uid) === id) return node;
    if (node.children.length > 0) {
      const found = findNodeById(node.children, id);
      if (found) return found;
    }
  }
  return null;
}

/**
 * Find a node and its ancestors by UID
 */
function findNodePath(
  nodes: CategoryTreeNode[],
  uid: string,
  path: CategoryTreeNode[] = [],
): CategoryTreeNode[] | null {
  for (const node of nodes) {
    if (node.uid === uid) {
      return [...path, node];
    }
    if (node.children.length > 0) {
      const found = findNodePath(node.children, uid, [...path, node]);
      if (found) return found;
    }
  }
  return null;
}

/**
 * Build CategorySelection from a selected node
 */
function buildSelectionFromNode(
  treeNodes: CategoryTreeNode[],
  node: CategoryTreeNode,
): CategorySelection {
  const path = findNodePath(treeNodes, node.uid) || [node];
  const displayPath = path.filter((n) => !n.isAddNew).map((n) => n.name);

  let categoryNode: CategoryTreeNode | null = null;
  let subcategoryNode: CategoryTreeNode | null = null;
  let subSubcategoryNode: CategoryTreeNode | null = null;

  for (const n of path) {
    if (n.isAddNew) continue;
    if (n.level === 1) categoryNode = n;
    else if (n.level === 2) subcategoryNode = n;
    else if (n.level === 3) subSubcategoryNode = n;
  }

  return {
    categoryUid: categoryNode?.uid || "",
    categoryName: categoryNode?.name || "",
    subcategoryUid: subcategoryNode?.uid || null,
    subcategoryName: subcategoryNode?.name || null,
    subSubcategoryUid: subSubcategoryNode?.uid || null,
    subSubcategoryName: subSubcategoryNode?.name || null,
    displayPath,
  };
}

/**
 * Build initial selection from IDs
 */
function buildSelectionFromIds(
  treeNodes: CategoryTreeNode[],
  ids: {
    category_id: string;
    subcategory_id: string;
    sub_subcategory_id: string;
  },
): CategorySelection | null {
  const targetUid =
    ids.sub_subcategory_id || ids.subcategory_id || ids.category_id;
  if (!targetUid) return null;

  const node = findNodeByUid(treeNodes, targetUid);
  if (!node) return null;

  return buildSelectionFromNode(treeNodes, node);
}

/**
 * Get UIDs of nodes in the selected path
 */
function getSelectedPathUids(selection: CategorySelection | null): Set<string> {
  const uids = new Set<string>();
  if (!selection) return uids;

  if (selection.categoryUid) uids.add(selection.categoryUid);
  if (selection.subcategoryUid) uids.add(selection.subcategoryUid);
  if (selection.subSubcategoryUid) uids.add(selection.subSubcategoryUid);

  return uids;
}

export const useCategoryTree = ({
  categories,
  initialSelection,
  onSelectionChange,
}: UseCategoryTreeProps) => {
  // Track user-created pending categories
  const [pendingCategories, setPendingCategories] = useState<PendingCategory[]>(
    [],
  );

  // Transform categories to tree nodes with pending categories injected
  const treeNodes = useMemo(() => {
    return transformToTreeNodes(categories, pendingCategories);
  }, [categories, pendingCategories]);

  // Use ref to access treeNodes in callbacks without causing re-renders
  const treeNodesRef = useRef(treeNodes);
  useEffect(() => {
    treeNodesRef.current = treeNodes;
  }, [treeNodes]);

  // Build initial selection
  const initialSelectionResult = useMemo(() => {
    if (!initialSelection?.category_id) return null;
    return buildSelectionFromIds(treeNodes, initialSelection);
  }, [treeNodes, initialSelection]);

  // Expanded nodes state
  const [expandedNodes, setExpandedNodes] = useState<TreeExpandedState>(() => {
    const expanded: TreeExpandedState = {};
    if (initialSelection?.category_id) {
      expanded[initialSelection.category_id] = true;
    }
    if (initialSelection?.subcategory_id) {
      expanded[initialSelection.subcategory_id] = true;
    }
    return expanded;
  });

  // Current selection state
  const [selection, setSelection] = useState<CategorySelection | null>(
    initialSelectionResult,
  );

  // Add new mode state
  const [addNewMode, setAddNewMode] = useState<AddNewModeState>({
    activeLevel: null,
    parentUid: null,
    inputValue: "",
  });

  // Get UIDs in the selected path for highlighting
  const selectedPathUids = useMemo(() => {
    return getSelectedPathUids(selection);
  }, [selection]);

  const isInSelectedPath = useCallback(
    (nodeUid: string): boolean => {
      return selectedPathUids.has(nodeUid);
    },
    [selectedPathUids],
  );

  const isSelected = useCallback(
    (nodeUid: string): boolean => {
      if (!selection) return false;
      return (
        nodeUid === selection.subSubcategoryUid ||
        (nodeUid === selection.subcategoryUid &&
          !selection.subSubcategoryUid) ||
        (nodeUid === selection.categoryUid &&
          !selection.subcategoryUid &&
          !selection.subSubcategoryUid)
      );
    },
    [selection],
  );

  const handleToggleExpand = useCallback((nodeUid: string) => {
    setExpandedNodes((prev) => ({
      ...prev,
      [nodeUid]: !prev[nodeUid],
    }));
  }, []);

  const handleSelect = useCallback(
    (node: CategoryTreeNode) => {
      if (node.isAddNew) {
        setAddNewMode({
          activeLevel: node.level,
          parentUid: node.parentUid ?? null,
          inputValue: "",
        });
        return;
      }

      const newSelection = buildSelectionFromNode(treeNodesRef.current, node);
      setSelection(newSelection);
      onSelectionChange(newSelection);

      // Auto-expand if has real children
      if (node.children.filter((c) => !c.isAddNew).length > 0) {
        setExpandedNodes((prev) => ({
          ...prev,
          [node.uid]: true,
        }));
      }
    },
    [onSelectionChange],
  );

  const handleAddNewStart = useCallback(
    (level: 1 | 2 | 3, parentUid: string | null) => {
      setAddNewMode({
        activeLevel: level,
        parentUid,
        inputValue: "",
      });
    },
    [],
  );

  const handleAddNewChange = useCallback((value: string) => {
    setAddNewMode((prev) => ({ ...prev, inputValue: value }));
  }, []);

  const handleAddNewCancel = useCallback(() => {
    setAddNewMode({
      activeLevel: null,
      parentUid: null,
      inputValue: "",
    });
  }, []);

  const handleAddNewSubmit = useCallback(() => {
    if (!addNewMode.inputValue.trim() || !addNewMode.activeLevel) return;

    const newCategoryName = addNewMode.inputValue.trim();
    const level = addNewMode.activeLevel;
    const parentUid = addNewMode.parentUid;
    const newUid = `${NEW_CATEGORY_PREFIX}${newCategoryName}`;

    // Add to pending categories
    const newPending: PendingCategory = {
      uid: newUid,
      name: newCategoryName,
      level,
      parentUid,
    };

    setPendingCategories((prev) => [...prev, newPending]);

    // Auto-expand the new category so user can add children
    setExpandedNodes((prev) => ({
      ...prev,
      [newUid]: true,
      // Also expand parent if it exists
      ...(parentUid ? { [parentUid]: true } : {}),
    }));

    // Clear add new mode
    setAddNewMode({
      activeLevel: null,
      parentUid: null,
      inputValue: "",
    });

    // Note: We don't select the new category automatically
    // User can click on it to select it, then continue adding children
  }, [addNewMode]);

  // Reset selection (for form reset)
  const resetSelection = useCallback(() => {
    setSelection(null);
    setExpandedNodes({});
    setPendingCategories([]);
    setAddNewMode({
      activeLevel: null,
      parentUid: null,
      inputValue: "",
    });
  }, []);

  // Update selection from external source
  // Using ref to avoid dependency on treeNodes which would cause infinite loops
  const updateSelectionFromIds = useCallback(
    (ids: {
      category_id: string;
      subcategory_id: string;
      sub_subcategory_id: string;
    }) => {
      const newSelection = buildSelectionFromIds(treeNodesRef.current, ids);
      setSelection(newSelection);

      const expanded: TreeExpandedState = {};
      if (ids.category_id) expanded[ids.category_id] = true;
      if (ids.subcategory_id) expanded[ids.subcategory_id] = true;
      setExpandedNodes(expanded);
    },
    [],
  );

  // Restore pending categories from a saved new_category_path (for edit mode)
  const addPendingCategoriesFromPath = useCallback(
    (path: string) => {
      const parts = path
        .split(" > ")
        .map((p) => p.trim())
        .filter(Boolean);
      if (parts.length === 0) return;

      const pending: PendingCategory[] = [];
      const expanded: TreeExpandedState = {};

      for (let i = 0; i < parts.length && i < 3; i++) {
        const name = parts[i];
        const uid = `${NEW_CATEGORY_PREFIX}${name}`;
        const level = (i + 1) as 1 | 2 | 3;
        const parentUid =
          i > 0 ? `${NEW_CATEGORY_PREFIX}${parts[i - 1]}` : null;

        pending.push({ uid, name, level, parentUid });
        expanded[uid] = true;
      }

      setPendingCategories(pending);
      setExpandedNodes(expanded);

      // Build selection from the deepest level
      const newSelection: CategorySelection = {
        categoryUid: pending[0]?.uid || "",
        categoryName: pending[0]?.name || "",
        subcategoryUid: pending[1]?.uid || null,
        subcategoryName: pending[1]?.name || null,
        subSubcategoryUid: pending[2]?.uid || null,
        subSubcategoryName: pending[2]?.name || null,
        displayPath: pending.map((p) => p.name),
      };

      setSelection(newSelection);
      onSelectionChange(newSelection);
    },
    [onSelectionChange],
  );

  return {
    treeNodes,
    selection,
    expandedNodes,
    addNewMode,
    handleToggleExpand,
    handleSelect,
    handleAddNewStart,
    handleAddNewChange,
    handleAddNewSubmit,
    handleAddNewCancel,
    isSelected,
    isInSelectedPath,
    resetSelection,
    updateSelectionFromIds,
    addPendingCategoriesFromPath,
  };
};
