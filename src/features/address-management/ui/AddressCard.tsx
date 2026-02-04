"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@shared/ui/card";
import { Button } from "@shared/ui/button";
import { Edit, Trash2, MapPin } from "lucide-react";
import { useAddressCard } from "../lib/useAddressCard";
import type { AddressCardProps } from "../model/interface";

export default function AddressCard({
  address,
  onEdit,
  onDelete,
}: AddressCardProps) {
  const { t } = useAddressCard();

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between space-y-0">
        <div className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-muted-foreground" />
          <CardTitle className="text-lg">
            {address.firstname} {address.lastname}
          </CardTitle>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(address)}
            className="h-8 w-8 p-0"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(address.id)}
            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="text-sm">
          {address.street.map((line, index) => (
            <div key={index}>{line}</div>
          ))}
          <div>
            {address.city}, {address.region.region_code} {address.postcode}
          </div>
          <div>{address.country_code}</div>
        </div>
        <div className="text-sm text-muted-foreground">
          {t("phone")}: {address.telephone}
        </div>
        {(address.default_billing || address.default_shipping) && (
          <div className="flex gap-2 pt-2">
            {address.default_billing && (
              <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                {t("defaultBilling")}
              </span>
            )}
            {address.default_shipping && (
              <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-200">
                {t("defaultShipping")}
              </span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
