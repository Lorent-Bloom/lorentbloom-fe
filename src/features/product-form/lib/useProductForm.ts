import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import {
  createCustomerProduct,
  updateCustomerProduct,
} from "@entities/customer-product";
import { clearExpiredToken } from "@entities/customer";
import type { ImageFile } from "@features/multi-image-upload";
import { ProductFormSchema, type TProductFormSchema } from "../model/schema";
import { PRODUCT_FORM_DEFAULT_VALUES } from "../model/const";
import type { ProductFormProps, CategorySelection } from "../model/interface";
import { useCategoryTree } from "./useCategoryTree";
import { useRecaptcha, verifyRecaptcha } from "@shared/lib/recaptcha";

export const useProductForm = ({
  product,
  mode,
  open,
  onOpenChange,
  onSuccess,
  locale,
  categories,
  cities = [],
}: ProductFormProps) => {
  const router = useRouter();
  const t = useTranslations("product-form");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { executeRecaptcha } = useRecaptcha();

  const form = useForm<TProductFormSchema>({
    resolver: zodResolver(ProductFormSchema),
    defaultValues: PRODUCT_FORM_DEFAULT_VALUES,
  });

  // The backend returns root categories, but we need their children as the first level
  // Category dropdown = children of root categories (flatten all root children)
  const topLevelCategories = useMemo(() => {
    if (!categories) return [];
    // Flatten children from all root categories
    return categories.flatMap((root) => root.children || []);
  }, [categories]);

  // Handle selection change from tree
  const handleCategorySelectionChange = useCallback(
    (selection: CategorySelection | null) => {
      if (!selection) {
        form.setValue("category_id", "");
        form.setValue("subcategory_id", "");
        form.setValue("sub_subcategory_id", "");
        return;
      }

      form.setValue("category_id", selection.categoryUid);
      form.setValue("subcategory_id", selection.subcategoryUid || "");
      form.setValue("sub_subcategory_id", selection.subSubcategoryUid || "");
    },
    [form],
  );

  // Initialize category tree with initial selection from product (if editing)
  const initialCategorySelection = useMemo(() => {
    if (!product || mode !== "edit") return undefined;
    return {
      category_id: product.category_id || "",
      subcategory_id: product.subcategory_id || "",
      sub_subcategory_id: product.sub_subcategory_id || "",
    };
  }, [product, mode]);

  // Category tree hook
  const {
    treeNodes,
    selection: categorySelection,
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
  } = useCategoryTree({
    categories: topLevelCategories,
    initialSelection: initialCategorySelection,
    onSelectionChange: handleCategorySelectionChange,
  });

  // Reset form when product changes (edit mode) or mode changes
  useEffect(() => {
    if (product && mode === "edit") {
      // Convert ProductImage to ImageFile format
      const imageFiles: ImageFile[] = product.images.map((img) => ({
        id: img.id,
        file: null,
        preview: img.url,
        position: img.position,
        is_main: img.is_main,
        base64: img.file,
      }));

      // Always clear previous pending categories first
      resetSelection();

      // Only use new_category_path if the product has NO existing category IDs.
      // The backend may return new_category as a truthy value (e.g., "1") even
      // when the product has real category associations.
      const hasExistingCategories = !!(
        product.category_id ||
        product.subcategory_id ||
        product.sub_subcategory_id
      );

      if (product.new_category_path && !hasExistingCategories) {
        // Product has a new category path - restore as pending nodes
        const parts = product.new_category_path.split(" > ").filter(Boolean);
        form.reset({
          name: product.name,
          description: product.description || "",
          short_description: product.short_description || "",
          category_id: parts[0] ? `new:${parts[0]}` : "",
          subcategory_id: parts[1] ? `new:${parts[1]}` : "",
          sub_subcategory_id: parts[2] ? `new:${parts[2]}` : "",
          city: product.city != null ? String(product.city) : "",
          manufacturer: product.manufacturer || "",
          price: product.price ?? 0,
          quantity: product.quantity ?? 1,
          images: imageFiles,
          is_active: product.is_active,
        });
        addPendingCategoriesFromPath(product.new_category_path);
      } else {
        // Product uses existing categories
        form.reset({
          name: product.name,
          description: product.description || "",
          short_description: product.short_description || "",
          category_id: product.category_id || "",
          subcategory_id: product.subcategory_id || "",
          sub_subcategory_id: product.sub_subcategory_id || "",
          city: product.city != null ? String(product.city) : "",
          manufacturer: product.manufacturer || "",
          price: product.price ?? 0,
          quantity: product.quantity ?? 1,
          images: imageFiles,
          is_active: product.is_active,
        });
        updateSelectionFromIds({
          category_id: product.category_id || "",
          subcategory_id: product.subcategory_id || "",
          sub_subcategory_id: product.sub_subcategory_id || "",
        });
      }
    } else {
      form.reset(PRODUCT_FORM_DEFAULT_VALUES);
      resetSelection();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product, mode, form]);

  // Reset form when dialog closes (transition from open to closed)
  const prevOpenRef = useRef(open);
  useEffect(() => {
    if (prevOpenRef.current && !open) {
      form.reset(PRODUCT_FORM_DEFAULT_VALUES);
      resetSelection();
    }
    prevOpenRef.current = open;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Helper function to get numeric ID from uid
  // Magento uid is base64-encoded, e.g., "MjA0NQ==" decodes to "2045"
  const getNumericId = (uid: string): number | null => {
    if (!uid) return null;

    // Check for new category prefix - these are user-created categories
    if (uid.startsWith("new:")) {
      return null; // New categories don't have IDs yet
    }

    // If it's already a numeric string, parse directly
    if (/^\d+$/.test(uid)) {
      return parseInt(uid, 10);
    }

    // Try to decode base64 uid
    try {
      const decoded = atob(uid);
      const parsed = parseInt(decoded, 10);
      if (!isNaN(parsed)) {
        return parsed;
      }
    } catch {
      // Not valid base64, continue to fallback
    }

    return null;
  };

  const onSubmit = async (values: TProductFormSchema) => {
    setIsSubmitting(true);

    try {
      const recaptchaToken = await executeRecaptcha("product_form");
      const recaptchaResult = await verifyRecaptcha(
        recaptchaToken,
        "product_form",
      );
      if (!recaptchaResult.success) {
        toast.error("Verification failed. Please try again.");
        return;
      }

      // Convert ImageFile to ProductImageInput format
      // Include url for existing images so server can fetch and convert to base64
      const imageInputs = values.images.map((img, idx) => ({
        file: img.base64 || "",
        position: img.position || idx,
        is_main: img.is_main,
        // For existing images without base64, include the preview URL for server-side fetching
        url: !img.base64 && img.preview ? img.preview : undefined,
      }));

      // Check if any category level is new
      const hasNewCategory =
        values.category_id?.startsWith("new:") ||
        values.subcategory_id?.startsWith("new:") ||
        values.sub_subcategory_id?.startsWith("new:");

      let new_category_path: string | undefined;
      let categoryId: number | undefined;
      let subcategoryId: number | undefined;
      let subSubcategoryId: number | undefined;

      if (hasNewCategory && categorySelection) {
        // Full path from displayPath (includes existing + new names)
        new_category_path = categorySelection.displayPath.join(" > ");
      } else {
        // All existing: send numeric IDs
        categoryId = getNumericId(values.category_id) || undefined;
        subcategoryId = getNumericId(values.subcategory_id) || undefined;
        subSubcategoryId = getNumericId(values.sub_subcategory_id) || undefined;
      }

      const cityId = values.city ? parseInt(values.city, 10) : undefined;

      const result =
        mode === "create"
          ? await createCustomerProduct({
              name: values.name,
              description: values.description || undefined,
              short_description: values.short_description || undefined,
              category: categoryId,
              subcategory: subcategoryId,
              sub_subcategory: subSubcategoryId,
              new_category_path,
              city: cityId,
              manufacturer: values.manufacturer || undefined,
              price: values.price,
              quantity: values.quantity,
              images: imageInputs,
              is_active: values.is_active,
            })
          : await updateCustomerProduct({
              id: product!.sku,
              name: values.name,
              description: values.description || undefined,
              short_description: values.short_description || undefined,
              category: categoryId,
              subcategory: subcategoryId,
              sub_subcategory: subSubcategoryId,
              new_category_path,
              city: cityId,
              manufacturer: values.manufacturer || undefined,
              price: values.price,
              quantity: values.quantity,
              images: imageInputs,
              is_active: values.is_active,
            });

      if (!result.success) {
        if (result.error === "SESSION_EXPIRED") {
          await clearExpiredToken();
          toast.error(t("sessionExpired"));
          router.push(`/${locale}/sign-in`);
          return;
        }

        toast.error(result.error || t("saveFailed"));
        return;
      }

      toast.success(
        mode === "create" ? t("createSuccess") : t("updateSuccess"),
      );

      form.reset(PRODUCT_FORM_DEFAULT_VALUES);
      resetSelection();
      onOpenChange(false);
      onSuccess();
    } catch {
      toast.error(t("saveFailed"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    onSubmit,
    isSubmitting,
    t,
    cities,
    // Category tree props
    treeNodes,
    categorySelection,
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
  };
};
