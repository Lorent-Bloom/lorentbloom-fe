"use client";

import AddressCard from "./AddressCard";
import AddressFormDialog from "./AddressFormDialog";
import { Button } from "@shared/ui/button";
import { Plus } from "lucide-react";
import { useAddressList } from "../lib/useAddressList";
import type { AddressListProps } from "../model/interface";

export default function AddressList({ addresses, locale }: AddressListProps) {
  const {
    t,
    dialogOpen,
    setDialogOpen,
    editingAddress,
    handleEdit,
    handleAdd,
    handleDelete,
    handleSuccess,
  } = useAddressList({ locale });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          {addresses.length === 0
            ? t("noAddresses")
            : t("addressCount", { count: addresses.length })}
        </p>
        <Button onClick={handleAdd}>
          <Plus className="h-4 w-4 mr-2" />
          {t("addAddress")}
        </Button>
      </div>

      {addresses.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed rounded-lg">
          <p className="text-muted-foreground mb-4">
            {t("noAddressesDescription")}
          </p>
          <Button onClick={handleAdd}>
            <Plus className="h-4 w-4 mr-2" />
            {t("addFirstAddress")}
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((address) => (
            <AddressCard
              key={address.id}
              address={address}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <AddressFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        address={editingAddress}
        onSuccess={handleSuccess}
        locale={locale}
      />
    </div>
  );
}
