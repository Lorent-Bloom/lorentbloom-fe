"use client";

import { useTranslations } from "next-intl";
import { Button } from "@shared/ui/button";
import { ShoppingCart } from "lucide-react";
import AddToCartModal from "./AddToCartModal";
import type { AddToCartButtonProps } from "../model/interface";
import { useAddToCartButton } from "../lib/useAddToCartButton";

export default function AddToCartButton({
  productId,
  productSku,
  productName,
  productUrlKey,
  initialQuantity = 1,
  className,
  configurableOptions,
  reservations,
  productQuantity,
}: AddToCartButtonProps) {
  const { isModalOpen, handleOpenModal, handleCloseModal } = useAddToCartButton(
    { productUrlKey },
  );
  const t = useTranslations("add-to-cart");

  return (
    <>
      <Button onClick={handleOpenModal} className={className} size="lg">
        <ShoppingCart className="mr-2 h-5 w-5" />
        {t("addToCart")}
      </Button>

      {isModalOpen && (
        <AddToCartModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          productId={productId}
          productSku={productSku}
          productName={productName}
          initialQuantity={initialQuantity}
          configurableOptions={configurableOptions}
          reservations={reservations}
          productQuantity={productQuantity}
        />
      )}
    </>
  );
}
