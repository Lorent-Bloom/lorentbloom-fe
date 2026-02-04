"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { toggleProductStatus } from "@entities/customer-product";
import { clearExpiredToken } from "@entities/customer";
import type { ProductActionsDropdownProps } from "../model/interface";

export const useProductActionsDropdown = ({
  product,
  locale,
  onEdit,
}: ProductActionsDropdownProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations("my-products-table");
  const [showStatusDialog, setShowStatusDialog] = useState(false);

  const isActive = product.is_active === 1;

  const handleEdit = () => {
    onEdit(product);
  };

  const handleToggleStatus = async () => {
    const newStatus = isActive ? 2 : 1;
    // Pass categories to preserve them during status toggle
    // Backend clears categories on disable, so we send them back
    const result = await toggleProductStatus(product.sku, newStatus, {
      category_id: product.category_id,
      subcategory_id: product.subcategory_id,
      sub_subcategory_id: product.sub_subcategory_id,
    });

    if (!result.success) {
      if (result.error === "SESSION_EXPIRED") {
        await clearExpiredToken();
        toast.error(t("sessionExpired"));
        router.push(`/${locale}/sign-in`);
        return;
      }

      toast.error(result.error || t("statusChangeFailed"));
      return;
    }

    toast.success(isActive ? t("disableSuccess") : t("enableSuccess"));
    // Refresh the page to refetch products from server
    const params = new URLSearchParams(searchParams.toString());
    router.push(`/${locale}/account/my-products?${params.toString()}`);
    router.refresh();
  };

  const openStatusDialog = () => setShowStatusDialog(true);

  return {
    t,
    isActive,
    showStatusDialog,
    setShowStatusDialog,
    handleEdit,
    handleToggleStatus,
    openStatusDialog,
  };
};
