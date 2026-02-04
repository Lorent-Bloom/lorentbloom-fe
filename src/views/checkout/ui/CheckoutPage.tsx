"use client";

import {
  SavedAddressSelector,
  BillingAddressForm,
} from "@features/checkout-billing-address";
import {
  SavedShippingAddressSelector,
  ShippingAddressForm,
} from "@features/checkout-shipping-address";
import { PaymentMethodSelector } from "@features/checkout-payment";
import { OrderSummary } from "@features/checkout-order-summary";
import { SigningFlow } from "@features/document-signing";
import { useTranslations } from "next-intl";
import { Button } from "@shared/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@shared/ui/card";
import { CheckCircle2, FileSignature } from "lucide-react";
import { useCheckoutPage } from "../lib/useCheckoutPage";
import type { CheckoutPageProps } from "../model/interface";

export default function CheckoutPage({
  cart,
  savedAddresses,
  locale,
  customer,
  ownerInfo,
}: CheckoutPageProps) {
  const {
    step,
    setStep,
    selectedPaymentMethod,
    setSelectedPaymentMethod,
    selectedBillingAddressId,
    selectedShippingAddressId,
    isSubmitting,
    isSettingAddresses,
    contractSignature,
    contractPreviewData,
    existingPersonalNumber,
    handleSelectBillingAddress,
    handleSelectShippingAddress,
    handleBillingAddressSubmit,
    handleShippingAddressSubmit,
    handleContinueToPayment,
    handleContinueToContract,
    handleContractSign,
    handlePlaceOrder,
    handleAddressUpdated,
  } = useCheckoutPage(cart, savedAddresses, locale, customer, ownerInfo);
  const t = useTranslations("checkout");
  const tSigning = useTranslations("document-signing");

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">{t("pageTitle")}</h1>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {step === "address" && (
            <div className="space-y-8">
              {/* Billing and Shipping Address Side by Side */}
              <div className="grid gap-6 md:grid-cols-2">
                {/* Billing Address Section */}
                <div className="space-y-6">
                  <h2 className="text-2xl font-semibold">
                    {t("billingAddressTitle")}
                  </h2>
                  <SavedAddressSelector
                    addresses={savedAddresses}
                    selectedAddressId={selectedBillingAddressId!}
                    onSelectAddress={handleSelectBillingAddress}
                    onAddressUpdated={handleAddressUpdated}
                    locale={locale}
                  />

                  {selectedBillingAddressId === null && (
                    <div className="rounded-lg border p-6">
                      <h3 className="mb-4 text-xl font-semibold">
                        {savedAddresses.length > 0
                          ? t("newBillingAddress")
                          : t("enterBillingAddress")}
                      </h3>
                      <BillingAddressForm
                        onSubmit={handleBillingAddressSubmit}
                        isSubmitting={false}
                      />
                    </div>
                  )}
                </div>

                {/* Shipping Address Section */}
                <div className="space-y-6">
                  <h2 className="text-2xl font-semibold">
                    {t("shippingAddressTitle")}
                  </h2>
                  <SavedShippingAddressSelector
                    addresses={savedAddresses}
                    selectedAddressId={selectedShippingAddressId!}
                    onSelectAddress={handleSelectShippingAddress}
                    onAddressUpdated={handleAddressUpdated}
                    locale={locale}
                  />

                  {selectedShippingAddressId === null && (
                    <div className="rounded-lg border p-6">
                      <h3 className="mb-4 text-xl font-semibold">
                        {savedAddresses.length > 0
                          ? t("newShippingAddress")
                          : t("enterShippingAddress")}
                      </h3>
                      <ShippingAddressForm
                        onSubmit={handleShippingAddressSubmit}
                        isSubmitting={false}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Continue to Payment Button */}
              <div className="rounded-lg border p-6">
                <Button
                  onClick={handleContinueToPayment}
                  disabled={isSubmitting || isSettingAddresses}
                  className="w-full"
                  size="lg"
                >
                  {isSettingAddresses
                    ? t("settingAddresses")
                    : t("continueToPayment")}
                </Button>
              </div>
            </div>
          )}

          {step === "payment" && (
            <div className="space-y-6">
              <PaymentMethodSelector
                cartId={cart.id}
                selectedMethod={selectedPaymentMethod}
                onMethodSelected={setSelectedPaymentMethod}
              />

              <div className="rounded-lg border p-6">
                <Button
                  onClick={handleContinueToContract}
                  disabled={isSubmitting || !selectedPaymentMethod}
                  className="w-full hover:bg-primary/80"
                  size="lg"
                >
                  {t("continueToContract")}
                </Button>
              </div>
            </div>
          )}

          {step === "contract" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileSignature className="h-5 w-5" />
                    {tSigning("signContractTitle")}
                  </CardTitle>
                  <CardDescription>
                    {tSigning("signContractDescription")}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {contractPreviewData ? (
                    <SigningFlow
                      contractData={contractPreviewData}
                      onSign={handleContractSign}
                      onCancel={() => setStep("payment")}
                      isSubmitting={isSubmitting}
                      isSigned={!!contractSignature}
                      signerRole="renter"
                      existingPersonalNumber={existingPersonalNumber}
                    />
                  ) : (
                    <p className="text-muted-foreground">
                      {t("missingContractData")}
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Show signed status */}
              {contractSignature && (
                <Card className="border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950">
                  <CardContent className="flex items-center gap-3 p-4">
                    <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                    <span className="text-green-700 dark:text-green-300">
                      {tSigning("signatureComplete")}
                    </span>
                  </CardContent>
                </Card>
              )}

              {/* Place Order Button */}
              <div className="rounded-lg border p-6">
                <Button
                  onClick={handlePlaceOrder}
                  disabled={isSubmitting || !contractSignature}
                  className="w-full hover:bg-primary/80"
                  size="lg"
                >
                  {isSubmitting ? t("placingOrder") : t("placeOrder")}
                </Button>
              </div>
            </div>
          )}
        </div>

        <div>
          <OrderSummary cart={cart} />
        </div>
      </div>
    </div>
  );
}
