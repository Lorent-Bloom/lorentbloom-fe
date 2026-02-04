"use client";

import { useState } from "react";
import { useCheckAuth } from "@entities/customer";
import { useLocale } from "next-intl";

export interface UseAddToCartButtonProps {
  productUrlKey: string;
}

export function useAddToCartButton({ productUrlKey }: UseAddToCartButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { checkAuth } = useCheckAuth();
  const locale = useLocale();

  const handleOpenModal = async () => {
    const productDetailsUrl = `/${locale}/products/p/${productUrlKey}`;
    const isAuthenticated = await checkAuth(productDetailsUrl);

    if (isAuthenticated) {
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return {
    isModalOpen,
    handleOpenModal,
    handleCloseModal,
  };
}
