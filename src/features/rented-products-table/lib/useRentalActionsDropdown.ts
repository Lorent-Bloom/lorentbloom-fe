"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { cancelRental } from "@entities/rented-product";
import { clearExpiredToken } from "@entities/customer";

export const useRentalActionsDropdown = (
  rentalId: string,
  locale: string,
  status: "active" | "completed" | "cancelled",
) => {
  const router = useRouter();
  const t = useTranslations("rented-products-table");
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  const handleEdit = () => {
    router.push(`/${locale}/rented-products/${rentalId}/edit`);
  };

  const handleCancel = async () => {
    const result = await cancelRental(rentalId);

    if (!result.success) {
      if (result.error === "SESSION_EXPIRED") {
        await clearExpiredToken();
        toast.error(t("sessionExpired"));
        router.push(`/${locale}/sign-in`);
        return;
      }

      toast.error(result.error || t("cancelFailed"));
      return;
    }

    toast.success(t("cancelSuccess"));
    router.refresh();
  };

  const canEdit = status === "active";
  const canCancel = status === "active";

  return {
    handleEdit,
    handleCancel,
    showCancelDialog,
    setShowCancelDialog,
    canEdit,
    canCancel,
    t,
  };
};
