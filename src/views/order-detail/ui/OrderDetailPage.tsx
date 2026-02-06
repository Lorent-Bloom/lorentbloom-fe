"use client";

import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@shared/ui/card";
import { Badge } from "@shared/ui/badge";
import { Button } from "@shared/ui/button";
import { Separator } from "@shared/ui/separator";
import { Download, FileText, CheckCircle, Clock } from "lucide-react";
import { useOrderDetailPage } from "../lib/useOrderDetailPage";
import type { OrderDetailPageProps } from "../model/interface";

export function OrderDetailPage({
  order,
  isRentalOrder,
}: OrderDetailPageProps) {
  // isRentalOrder indicates if this is a rental order (product owner viewing) vs buyer order
  void isRentalOrder;
  const t = useTranslations("order-detail");

  const {
    formattedDate,
    formatCurrency,
    billingAddressFormatted,
    shippingAddressFormatted,
    getStatusVariant,
    contractUrl,
    contractStatus,
    isLoadingContract,
    handleDownloadContract,
  } = useOrderDetailPage({ order });

  return (
    <div className="space-y-6">
      {/* Order & Account Information */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-xl">
            {t("orderTitle", {
              number: order.order_number || order.number || "",
            })}{" "}
            ({t("orderConfirmationSent")})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            {/* Order Details */}
            <div className="space-y-3">
              <div className="grid grid-cols-[140px_1fr] gap-2 text-sm">
                <span className="text-muted-foreground">{t("orderDate")}</span>
                <span className="text-right">{formattedDate}</span>
              </div>
              <div className="grid grid-cols-[140px_1fr] gap-2 text-sm">
                <span className="text-muted-foreground">
                  {t("orderStatus")}
                </span>
                <span className="text-right">
                  <Badge variant={getStatusVariant(order.status)}>
                    {order.status}
                  </Badge>
                </span>
              </div>
            </div>

            {/* Account Information */}
            <div>
              <h4 className="mb-3 font-semibold">{t("accountInformation")}</h4>
              <div className="space-y-2 text-sm">
                <div className="grid grid-cols-[140px_1fr] gap-2">
                  <span className="text-muted-foreground">
                    {t("customerName")}
                  </span>
                  <span className="text-right text-primary">
                    {order.customer_info?.firstname &&
                    order.customer_info?.lastname
                      ? `${order.customer_info.firstname} ${order.customer_info.lastname}`
                      : billingAddressFormatted?.name || "N/A"}
                  </span>
                </div>
                {order.customer_info?.email && (
                  <div className="grid grid-cols-[140px_1fr] gap-2">
                    <span className="text-muted-foreground">{t("email")}</span>
                    <span className="text-right text-primary">
                      {order.customer_info.email}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contract Section */}
      {(contractUrl || isLoadingContract) && (
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-xl">
              <FileText className="h-5 w-5" />
              {t("rentalContract")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                {contractStatus === "partially_signed" && (
                  <Badge
                    variant="outline"
                    className="text-amber-600 border-amber-300"
                  >
                    <Clock className="mr-1 h-3 w-3" />
                    {t("contractPending")}
                  </Badge>
                )}
                {contractStatus === "signed" && (
                  <Badge
                    variant="outline"
                    className="text-green-600 border-green-300"
                  >
                    <CheckCircle className="mr-1 h-3 w-3" />
                    {t("contractSigned")}
                  </Badge>
                )}
                {contractStatus === "pending" && (
                  <Badge variant="outline" className="text-muted-foreground">
                    {t("contractPendingSignatures")}
                  </Badge>
                )}
              </div>
              {/* Only show download button when contract is fully signed */}
              {contractStatus === "signed" && (
                <Button
                  onClick={handleDownloadContract}
                  disabled={isLoadingContract || !contractUrl}
                  variant="outline"
                >
                  <Download className="mr-2 h-4 w-4" />
                  {t("downloadContract")}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Address Information */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-xl">{t("addressInformation")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            {/* Billing Address */}
            <div>
              <h4 className="mb-3 font-semibold">{t("billingAddress")}</h4>
              {billingAddressFormatted ? (
                <div className="space-y-1 text-sm">
                  <p>{billingAddressFormatted.name}</p>
                  {billingAddressFormatted.street.split("\n").map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
                  <p>{billingAddressFormatted.cityRegionPostcode}</p>
                  <p>{billingAddressFormatted.country}</p>
                  <p>
                    {t("phone")}: {billingAddressFormatted.telephone}
                  </p>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  {t("noAddress")}
                </p>
              )}
            </div>

            {/* Shipping Address */}
            <div>
              <h4 className="mb-3 font-semibold">{t("shippingAddress")}</h4>
              {shippingAddressFormatted ? (
                <div className="space-y-1 text-sm">
                  <p>{shippingAddressFormatted.name}</p>
                  {shippingAddressFormatted.street
                    .split("\n")
                    .map((line, i) => (
                      <p key={i}>{line}</p>
                    ))}
                  <p>{shippingAddressFormatted.cityRegionPostcode}</p>
                  <p>{shippingAddressFormatted.country}</p>
                  <p>
                    {t("phone")}: {shippingAddressFormatted.telephone}
                  </p>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  {t("noAddress")}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Items Ordered */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-xl">{t("itemsOrdered")}</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {/* Desktop Table View */}
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full text-sm">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">
                    {t("table.product")}
                  </th>
                  <th className="px-4 py-3 text-left font-medium">
                    {t("sku")}
                  </th>
                  <th className="px-4 py-3 text-left font-medium">
                    {t("table.itemStatus")}
                  </th>
                  <th className="px-4 py-3 text-right font-medium">
                    {t("table.price")}
                  </th>
                  <th className="px-4 py-3 text-center font-medium">
                    {t("table.qty")}
                  </th>
                  <th className="px-4 py-3 text-right font-medium">
                    {t("table.rowTotal")}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {order.items.map((item) => {
                  const rowTotal =
                    item.product_sale_price.value * item.quantity_ordered;

                  return (
                    <tr key={item.id}>
                      <td className="px-4 py-4">
                        <p className="font-medium">{item.product_name}</p>
                      </td>
                      <td className="px-4 py-4 text-muted-foreground">
                        {item.product_sku}
                      </td>
                      <td className="px-4 py-4">{item.status}</td>
                      <td className="px-4 py-4 text-right">
                        {formatCurrency(item.product_sale_price)}
                      </td>
                      <td className="px-4 py-4 text-center">
                        {t("ordered")} {item.quantity_ordered}
                      </td>
                      <td className="px-4 py-4 text-right font-medium">
                        {item.product_sale_price.currency} {rowTotal.toFixed(2)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="divide-y md:hidden">
            {order.items.map((item) => {
              const rowTotal =
                item.product_sale_price.value * item.quantity_ordered;

              return (
                <div key={item.id} className="space-y-3 p-4">
                  <div>
                    <p className="font-medium">{item.product_name}</p>
                    <p className="text-xs text-muted-foreground">
                      {t("sku")}: {item.product_sku}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">
                        {t("table.itemStatus")}:
                      </span>
                      <span className="ml-2">{item.status}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-muted-foreground">
                        {t("table.qty")}:
                      </span>
                      <span className="ml-2">{item.quantity_ordered}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">
                        {t("table.price")}:
                      </span>
                      <span className="ml-2">
                        {formatCurrency(item.product_sale_price)}
                      </span>
                    </div>
                    <div className="text-right font-medium">
                      {item.product_sale_price.currency} {rowTotal.toFixed(2)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Order Totals */}
      <Card>
        <CardContent className="pt-6">
          <div className="ml-auto max-w-xs space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t("subtotal")}</span>
              <span>{formatCurrency(order.total.subtotal)}</span>
            </div>
            {order.total.rental_total &&
              order.total.rental_total.value > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    {t("rentalTotal")}
                  </span>
                  <span>{formatCurrency(order.total.rental_total)}</span>
                </div>
              )}
            {order.total.discounts?.map((discount, idx) => (
              <div key={idx} className="flex justify-between text-green-600">
                <span>{discount.label}</span>
                <span>-{formatCurrency(discount.amount)}</span>
              </div>
            ))}
            <Separator className="my-2" />
            <div className="flex justify-between text-base font-semibold">
              <span>{t("grandTotal")}</span>
              <span>{formatCurrency(order.total.grand_total)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
