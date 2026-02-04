"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { CustomerAddress } from "@entities/customer-address";
import { deleteCustomerAddress } from "@entities/customer-address";
import { clearExpiredToken } from "@entities/customer";

interface UseAddressListProps {
  locale: string;
}

export const useAddressList = ({ locale }: UseAddressListProps) => {
  const t = useTranslations("address-management");
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<CustomerAddress | null>(
    null,
  );

  const handleEdit = (address: CustomerAddress) => {
    setEditingAddress(address);
    setDialogOpen(true);
  };

  const handleAdd = () => {
    setEditingAddress(null);
    setDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm(t("confirmDelete"))) {
      return;
    }

    try {
      const result = await deleteCustomerAddress(id);

      if (result.success) {
        toast.success(t("addressDeletedSuccess"));
        router.refresh();
      } else {
        if (result.error === "SESSION_EXPIRED") {
          await clearExpiredToken();
          toast.error(t("sessionExpired"));
          router.push(`/${locale}/sign-in`);
        } else {
          toast.error(result.error || t("addressDeleteError"));
        }
      }
    } catch {
      toast.error(t("addressDeleteError"));
    }
  };

  const handleSuccess = () => {
    router.refresh();
  };

  return {
    t,
    dialogOpen,
    setDialogOpen,
    editingAddress,
    handleEdit,
    handleAdd,
    handleDelete,
    handleSuccess,
  };
};
