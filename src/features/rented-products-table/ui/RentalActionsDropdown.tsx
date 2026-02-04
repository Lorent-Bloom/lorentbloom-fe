"use client";

import { MoreHorizontal, XCircle } from "lucide-react";
import { Button } from "@shared/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@shared/ui/dropdown-menu";
import { ConfirmationDialog } from "@shared/ui/confirmation-dialog";
import { useRentalActionsDropdown } from "../lib/useRentalActionsDropdown";
import type { RentalActionsDropdownProps } from "../model/interface";

export function RentalActionsDropdown({
  rental,
  locale,
}: RentalActionsDropdownProps) {
  const {
    handleCancel,
    showCancelDialog,
    setShowCancelDialog,
    canEdit,
    canCancel,
    t,
  } = useRentalActionsDropdown(rental.id, locale, rental.status);

  // Don't show actions for completed or cancelled rentals
  if (!canEdit && !canCancel) {
    return null;
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">{t("actions")}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {canCancel && (
            <DropdownMenuItem
              onClick={() => setShowCancelDialog(true)}
              className="text-destructive"
            >
              <XCircle className="mr-2 h-4 w-4" />
              {t("cancelRental")}
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmationDialog
        open={showCancelDialog}
        onOpenChange={setShowCancelDialog}
        onConfirm={handleCancel}
        title={t("cancelTitle")}
        description={t("cancelDescription")}
        confirmText={t("cancelRental")}
        cancelText={t("cancel")}
        variant="destructive"
      />
    </>
  );
}
