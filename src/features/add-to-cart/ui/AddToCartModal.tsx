"use client";

import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@shared/ui/dialog";
import { Button } from "@shared/ui/button";
import { RentalDateSelector } from "@features/rental-date-selector";
import ConfigurableOptionsSelector from "./ConfigurableOptionsSelector";
import { useAddToCartModal } from "../lib/useAddToCartModal";
import type { AddToCartModalProps } from "../model/interface";

export default function AddToCartModal({
  isOpen,
  onClose,
  productId,
  productSku,
  productName,
  initialQuantity = 1,
  configurableOptions,
  reservations,
  productQuantity,
}: AddToCartModalProps) {
  const {
    dateRange,
    isPending,
    selectedOptions,
    hasRequiredOptions,
    allOptionsSelected,
    handleDateRangeChange,
    handleOptionChange,
    handleSubmit,
  } = useAddToCartModal(
    productId,
    productSku,
    initialQuantity,
    configurableOptions,
    onClose,
  );

  const t = useTranslations("add-to-cart");

  // Handle dialog close - component unmounts so state resets automatically
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{t("addToCart")}</DialogTitle>
            <DialogDescription>{productName}</DialogDescription>
          </DialogHeader>

          <div className="grid gap-6 py-4">
            {/* Rental Period Section */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                {t("rentalPeriod")}
              </h3>
              <RentalDateSelector
                dateRange={dateRange}
                onDateRangeChange={handleDateRangeChange}
                reservations={reservations}
                quantity={productQuantity ?? 1}
              />
            </div>

            {/* Product Options Section */}
            {hasRequiredOptions && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  {t("productOptions")}
                </h3>
                <ConfigurableOptionsSelector
                  options={configurableOptions || []}
                  selectedOptions={selectedOptions}
                  onOptionChange={handleOptionChange}
                />
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isPending}
            >
              {t("cancel")}
            </Button>
            <Button
              type="submit"
              disabled={
                isPending ||
                !dateRange?.from ||
                !dateRange?.to ||
                (hasRequiredOptions && !allOptionsSelected)
              }
            >
              {isPending ? t("adding") : t("addToCart")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
