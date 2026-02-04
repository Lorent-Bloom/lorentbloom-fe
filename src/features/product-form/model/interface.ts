import type { CustomerProduct } from "@entities/customer-product";
import type { CategoryTree } from "@entities/category";
import type { City } from "@entities/city";

export interface ProductFormProps {
  product?: CustomerProduct | null;
  mode: "create" | "edit";
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  locale: string;
  categories?: CategoryTree[];
  cities?: City[];
  hasIdnp?: boolean;
}

/** Node in the category tree for UI rendering */
export interface CategoryTreeNode {
  uid: string;
  id: number;
  name: string;
  level: 1 | 2 | 3;
  children: CategoryTreeNode[];
  isAddNew?: boolean;
  isNew?: boolean; // User-created category (not yet saved)
  parentUid?: string;
}

/** Tracks which nodes are expanded in the tree */
export interface TreeExpandedState {
  [nodeUid: string]: boolean;
}

/** State for "Add new" inline input mode */
export interface AddNewModeState {
  activeLevel: 1 | 2 | 3 | null;
  parentUid: string | null;
  inputValue: string;
}

/** Result of a category selection */
export interface CategorySelection {
  categoryUid: string;
  categoryName: string;
  subcategoryUid: string | null;
  subcategoryName: string | null;
  subSubcategoryUid: string | null;
  subSubcategoryName: string | null;
  displayPath: string[];
}

/** Props for CategoryTreeNode component */
export interface CategoryTreeNodeProps {
  node: CategoryTreeNode;
  isSelected: boolean;
  isExpanded: boolean;
  isInSelectedPath: boolean;
  hasChildren: boolean;
  onSelect: () => void;
  onToggleExpand: () => void;
  children?: React.ReactNode;
}

/** Props for CategoryAddNewInput component */
export interface CategoryAddNewInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
  placeholder: string;
  level: 1 | 2 | 3;
}
