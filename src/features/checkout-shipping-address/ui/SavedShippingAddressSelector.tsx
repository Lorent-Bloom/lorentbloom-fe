"use client";

import { useTranslations } from "next-intl";
import { RadioGroup, RadioGroupItem } from "@shared/ui/radio-group";
import { Label } from "@shared/ui/label";
import { Card } from "@shared/ui/card";
import { Button } from "@shared/ui/button";
import { PenLine } from "lucide-react";
import { AddressFormDialog } from "@features/address-management";
import { useSavedShippingAddressSelector } from "../lib/useSavedShippingAddressSelector";
import type { SavedShippingAddressSelectorProps } from "../model/interface";

export default function SavedShippingAddressSelector({
  addresses,
  selectedAddressId,
  onSelectAddress,
  onAddressUpdated,
  locale,
  className,
}: SavedShippingAddressSelectorProps) {
  const {
    handleSelectAddress,
    isEditDialogOpen,
    editingAddress,
    handleEditAddress,
    handleCloseEditDialog,
    handleEditSuccess,
  } = useSavedShippingAddressSelector(addresses, onSelectAddress);
  const t = useTranslations("checkout-shipping-address");

  const handleSuccess = () => {
    handleEditSuccess();
    onAddressUpdated?.();
  };

  if (addresses.length === 0) {
    return null;
  }

  return (
    <>
      <div className={className}>
        <h3 className="mb-4 text-lg font-semibold">{t("selectAddress")}</h3>
        <RadioGroup
          value={selectedAddressId?.toString() || "new"}
          onValueChange={(value) =>
            handleSelectAddress(value === "new" ? null : parseInt(value))
          }
        >
          {addresses.map((address) => (
            <Card key={address.id} className="p-4">
              <div className="flex items-start space-x-3">
                <RadioGroupItem
                  value={address.id.toString()}
                  id={`shipping-address-${address.id}`}
                />
                <Label
                  htmlFor={`shipping-address-${address.id}`}
                  className="flex-1 cursor-pointer"
                >
                  <div className="space-y-1">
                    <div className="font-medium">
                      {address.firstname} {address.lastname}
                      {address.telephone && (
                        <span className="ml-2 text-sm font-normal text-muted-foreground">
                          {address.telephone}
                        </span>
                      )}
                      {address.company && (
                        <span className="ml-2 text-sm font-normal text-muted-foreground">
                          {address.company}
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {address.street.join(", ")}, {address.city},{" "}
                      {address.region?.region && `${address.region.region}, `}
                      {address.country_code}, {address.postcode}
                    </div>
                  </div>
                </Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.preventDefault();
                    handleEditAddress(address);
                  }}
                  className="hover:bg-accent"
                >
                  <PenLine className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
          <Card className="p-4">
            <div className="flex items-start space-x-3">
              <RadioGroupItem value="new" id="shipping-address-new" />
              <Label
                htmlFor="shipping-address-new"
                className="flex-1 cursor-pointer"
              >
                <div className="font-medium">{t("addNewAddress")}</div>
              </Label>
            </div>
          </Card>
        </RadioGroup>
      </div>

      <AddressFormDialog
        open={isEditDialogOpen}
        onOpenChange={handleCloseEditDialog}
        address={editingAddress}
        onSuccess={handleSuccess}
        locale={locale}
      />
    </>
  );
}
