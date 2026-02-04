"use client";

import { MoreHorizontal, Edit, Power, PowerOff } from "lucide-react";
import { Button } from "@shared/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@shared/ui/dropdown-menu";
import { ConfirmationDialog } from "@shared/ui/confirmation-dialog";
import { useProductActionsDropdown } from "../lib/useProductActionsDropdown";
import type { ProductActionsDropdownProps } from "../model/interface";

export function ProductActionsDropdown(props: ProductActionsDropdownProps) {
  const {
    t,
    isActive,
    showStatusDialog,
    setShowStatusDialog,
    handleEdit,
    handleToggleStatus,
    openStatusDialog,
  } = useProductActionsDropdown(props);

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
          <DropdownMenuItem onClick={handleEdit}>
            <Edit className="mr-2 h-4 w-4" />
            {t("edit")}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={openStatusDialog}
            className={isActive ? "text-destructive" : "text-green-600"}
          >
            {isActive ? (
              <PowerOff className="mr-2 h-4 w-4" />
            ) : (
              <Power className="mr-2 h-4 w-4" />
            )}
            {isActive ? t("disable") : t("enable")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmationDialog
        open={showStatusDialog}
        onOpenChange={setShowStatusDialog}
        onConfirm={handleToggleStatus}
        title={isActive ? t("disableTitle") : t("enableTitle")}
        description={
          isActive ? t("disableDescription") : t("enableDescription")
        }
        confirmText={isActive ? t("disable") : t("enable")}
        cancelText={t("cancel")}
        variant={isActive ? "destructive" : "default"}
      />
    </>
  );
}
