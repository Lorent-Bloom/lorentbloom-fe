"use client";

import { useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import {
  setBillingAddress,
  setShippingAddress,
  setShippingMethod,
} from "@entities/cart";
import { setPaymentMethod } from "@entities/payment";
import { placeOrder, getOrderDetail } from "@entities/order";
import { createCustomerAddress } from "@entities/customer-address";
import {
  getCustomAttributeValue,
  updateCustomerAttributes,
  buildCustomAttributesInput,
} from "@entities/customer";
import { createAndUploadContract } from "@features/document-signing";
import type { ContractPreviewData } from "@features/document-signing";
import type { SignatureMethod } from "@entities/document";
import type { Cart } from "@entities/cart";
import type { CustomerAddress } from "@entities/customer-address";
import type { Customer } from "@entities/customer";
import type { BillingAddressFormData } from "@features/checkout-billing-address";
import type { ShippingAddressFormData } from "@features/checkout-shipping-address";

export interface OwnerInfo {
  id: string;
  email: string;
  name: string;
  phone: string;
  address: string;
}

export const useCheckoutPage = (
  cart: Cart,
  savedAddresses: CustomerAddress[],
  locale: string,
  customer?: Customer | null,
  ownerInfo?: OwnerInfo | null,
) => {
  const router = useRouter();
  const t = useTranslations("checkout");
  const [step, setStep] = useState<"address" | "payment" | "contract">(
    "address",
  );
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    string | null
  >(null);
  // Contract signing state
  const [contractSignature, setContractSignature] = useState<{
    data: string;
    method: SignatureMethod;
    personalNumber?: string;
  } | null>(null);
  const [isSigningContract] = useState(false);

  // Auto-select default billing and shipping addresses if available
  // Fall back to first address if no default is set
  const defaultBillingAddress =
    savedAddresses.find((addr) => addr.default_billing) || savedAddresses[0];
  const defaultShippingAddress =
    savedAddresses.find((addr) => addr.default_shipping) || savedAddresses[0];
  const [selectedBillingAddressId, setSelectedBillingAddressId] = useState<
    number | null
  >(defaultBillingAddress?.id || null);
  const [selectedShippingAddressId, setSelectedShippingAddressId] = useState<
    number | null
  >(defaultShippingAddress?.id || null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isBillingAddressSet, setIsBillingAddressSet] = useState(false);
  const [isShippingAddressSet, setIsShippingAddressSet] = useState(false);
  const [isSettingAddresses, setIsSettingAddresses] = useState(false);

  // Handler for creating a new billing address
  const handleBillingAddressSubmit = useCallback(
    async (data: BillingAddressFormData) => {
      try {
        // Create a new customer address (save to account)
        const createResult = await createCustomerAddress({
          firstname: data.firstname,
          lastname: data.lastname,
          street: data.street,
          city: data.city,
          region: data.region ? { region: data.region } : { region: data.city },
          postcode: data.postcode,
          country_code: data.countryCode,
          telephone: data.telephone,
          default_billing: true,
          default_shipping: false,
        });

        if (!createResult.success) {
          if (createResult.error === "SESSION_EXPIRED") {
            router.push("/sign-in");
            return;
          }
          toast.error(createResult.error || t("failedToSetBillingAddress"));
          return;
        }

        const newAddressId = createResult.data?.id;
        if (!newAddressId) {
          toast.error(t("failedToSetBillingAddress"));
          return;
        }

        // Update state and refresh to show new address in the list
        setSelectedBillingAddressId(newAddressId);
        setIsBillingAddressSet(false); // Will be set on cart when continuing to payment
        router.refresh();
        toast.success(t("billingAddressSaved"));
      } catch (error) {
        console.error("Billing address submission error:", error);
      }
    },
    [router, t],
  );

  // Handler for creating a new shipping address
  const handleShippingAddressSubmit = useCallback(
    async (data: ShippingAddressFormData) => {
      try {
        // Create a new customer address (save to account)
        const createResult = await createCustomerAddress({
          firstname: data.firstname,
          lastname: data.lastname,
          street: data.street,
          city: data.city,
          region: data.region ? { region: data.region } : { region: data.city },
          postcode: data.postcode,
          country_code: data.countryCode,
          telephone: data.telephone,
          default_billing: false,
          default_shipping: true,
        });

        if (!createResult.success) {
          if (createResult.error === "SESSION_EXPIRED") {
            router.push("/sign-in");
            return;
          }
          toast.error(createResult.error || t("failedToSetShippingAddress"));
          return;
        }

        const newAddressId = createResult.data?.id;
        if (!newAddressId) {
          toast.error(t("failedToSetShippingAddress"));
          return;
        }

        // Update state and refresh to show new address in the list
        setSelectedShippingAddressId(newAddressId);
        setIsShippingAddressSet(false); // Will be set on cart when continuing to payment
        router.refresh();
        toast.success(t("shippingAddressSaved"));
      } catch (error) {
        console.error("Shipping address submission error:", error);
      }
    },
    [router, t],
  );

  const handleContinueToPayment = useCallback(async () => {
    // Validate billing address
    if (!selectedBillingAddressId) {
      toast.error(t("pleaseSelectBillingAddress"));
      return;
    }

    // Validate shipping address
    if (!selectedShippingAddressId) {
      toast.error(t("pleaseSelectShippingAddress"));
      return;
    }

    // If addresses are selected but not yet set on cart, set them now
    if (!isBillingAddressSet || !isShippingAddressSet) {
      setIsSettingAddresses(true);
      try {
        // Set billing address if not already set
        if (!isBillingAddressSet && selectedBillingAddressId) {
          const billingResult = await setBillingAddress({
            cartId: cart.id,
            customerAddressId: selectedBillingAddressId,
          });

          if (!billingResult.success) {
            if (billingResult.error === "SESSION_EXPIRED") {
              router.push("/sign-in");
              return;
            }
            toast.error(billingResult.error || t("failedToSetBillingAddress"));
            return;
          }
          setIsBillingAddressSet(true);
        }

        // Set shipping address if not already set
        if (!isShippingAddressSet && selectedShippingAddressId) {
          const shippingResult = await setShippingAddress({
            cartId: cart.id,
            customerAddressId: selectedShippingAddressId,
          });

          if (!shippingResult.success) {
            if (shippingResult.error === "SESSION_EXPIRED") {
              router.push("/sign-in");
              return;
            }
            toast.error(
              shippingResult.error || t("failedToSetShippingAddress"),
            );
            return;
          }
          setIsShippingAddressSet(true);
        }
      } catch (error) {
        console.error("Error setting addresses:", error);
        toast.error(t("failedToSetAddresses"));
        return;
      } finally {
        setIsSettingAddresses(false);
      }
    }

    setStep("payment");
  }, [
    selectedBillingAddressId,
    selectedShippingAddressId,
    isBillingAddressSet,
    isShippingAddressSet,
    cart.id,
    router,
    t,
  ]);

  // Build contract preview data from cart and customer info
  // Note: Owner info may not be available at checkout - will be filled after order is placed
  const contractPreviewData = useMemo((): ContractPreviewData | null => {
    if (!customer) return null;

    const billingAddress = savedAddresses.find(
      (addr) => addr.id === selectedBillingAddressId,
    );
    if (!billingAddress) return null;

    // Get first cart item for product info (assuming single product per order for now)
    const firstItem = cart.items[0];
    if (!firstItem) return null;

    // Calculate rental days
    const rentFrom = firstItem.rent_from_date
      ? new Date(firstItem.rent_from_date)
      : new Date();
    const rentTo = firstItem.rent_to_date
      ? new Date(firstItem.rent_to_date)
      : new Date();
    const totalDays = Math.max(
      1,
      Math.ceil(
        (rentTo.getTime() - rentFrom.getTime()) / (1000 * 60 * 60 * 24),
      ),
    );

    // Use owner info if available, otherwise use placeholder for draft preview
    // The actual owner info will be retrieved from the order after it's placed
    const ownerData = ownerInfo || {
      name: "[Owner Name - To Be Filled]",
      email: "",
      phone: "",
      address: "[Owner Address - To Be Filled]",
    };

    // Get renter personal number from customer custom attributes
    const renterPersonalNumber = getCustomAttributeValue(
      customer,
      "personal_number",
    );

    return {
      contractNumber: `DRAFT-${cart.id.slice(0, 8).toUpperCase()}`,
      contractDate: new Date().toLocaleDateString("ro-RO"),
      ownerName: ownerData.name,
      ownerEmail: ownerData.email,
      ownerPhone: ownerData.phone,
      ownerAddress: ownerData.address,
      renterName: `${customer.firstname} ${customer.lastname}`,
      renterEmail: customer.email,
      renterPhone: billingAddress.telephone,
      renterAddress: `${billingAddress.street.join(", ")}, ${billingAddress.city}, ${billingAddress.country_code}`,
      renterPersonalNumber: renterPersonalNumber || undefined,
      productName: firstItem.product.name,
      productSku: firstItem.product.sku,
      rentFromDate: rentFrom.toLocaleDateString("ro-RO"),
      rentToDate: rentTo.toLocaleDateString("ro-RO"),
      totalDays,
      totalPrice: cart.prices.grand_total.value.toFixed(2),
      currency: cart.prices.grand_total.currency,
      paymentMethod: selectedPaymentMethod || "Cash",
    };
  }, [
    customer,
    ownerInfo,
    savedAddresses,
    selectedBillingAddressId,
    cart,
    selectedPaymentMethod,
  ]);

  const handleContinueToContract = useCallback(async () => {
    if (!selectedPaymentMethod) {
      toast.error(t("pleaseSelectPaymentMethod"));
      return;
    }

    if (!contractPreviewData) {
      toast.error(t("missingContractData"));
      return;
    }

    setStep("contract");
  }, [selectedPaymentMethod, contractPreviewData, t]);

  const handleContractSign = useCallback(
    async (
      signatureData: string,
      method: SignatureMethod,
      personalNumber?: string,
    ) => {
      setContractSignature({ data: signatureData, method, personalNumber });
    },
    [],
  );

  const handlePlaceOrder = useCallback(async () => {
    // Verify contract is signed
    if (!contractSignature) {
      toast.error(t("pleaseSignContract"));
      setStep("contract");
      return;
    }

    if (!selectedPaymentMethod) {
      toast.error(t("pleaseSelectPaymentMethod"));
      return;
    }

    // Verify addresses are selected
    if (!selectedBillingAddressId || !selectedShippingAddressId) {
      toast.error(t("pleaseSelectAddresses"));
      setStep("address");
      return;
    }

    setIsSubmitting(true);

    try {
      // Ensure billing address is set on cart using customer_address_id
      const billingResult = await setBillingAddress({
        cartId: cart.id,
        customerAddressId: selectedBillingAddressId,
      });

      if (!billingResult.success) {
        if (billingResult.error === "SESSION_EXPIRED") {
          router.push("/sign-in");
          return;
        }
        toast.error(billingResult.error || t("failedToSetBillingAddress"));
        return;
      }

      // Ensure shipping address is set on cart using customer_address_id
      const shippingAddressResult = await setShippingAddress({
        cartId: cart.id,
        customerAddressId: selectedShippingAddressId,
      });

      if (!shippingAddressResult.success) {
        if (shippingAddressResult.error === "SESSION_EXPIRED") {
          router.push("/sign-in");
          return;
        }
        toast.error(
          shippingAddressResult.error || t("failedToSetShippingAddress"),
        );
        return;
      }

      // Step 1: Set shipping method (use flatrate as default)
      const shippingResult = await setShippingMethod({
        cartId: cart.id,
        carrierCode: "flatrate",
        methodCode: "flatrate",
      });

      if (!shippingResult.success) {
        if (shippingResult.error === "SESSION_EXPIRED") {
          router.push("/sign-in");
          return;
        }
        console.error("Shipping method error:", shippingResult.error);
        toast.error(shippingResult.error || t("failedToSetShippingMethod"));
        return;
      }

      // Step 2: Set payment method on cart
      const paymentResult = await setPaymentMethod({
        cartId: cart.id,
        paymentMethodCode: selectedPaymentMethod,
      });

      if (!paymentResult.success) {
        if (paymentResult.error === "SESSION_EXPIRED") {
          router.push("/sign-in");
          return;
        }
        toast.error(paymentResult.error || t("failedToSetPaymentMethod"));
        return;
      }

      // Step 3: Place order
      const orderResult = await placeOrder({ cartId: cart.id });

      if (!orderResult.success) {
        if (orderResult.error === "SESSION_EXPIRED") {
          router.push("/sign-in");
          return;
        }
        toast.error(orderResult.error || t("failedToPlaceOrder"));
        return;
      }

      const orderNumber = orderResult.data?.order_number;

      // Step 4: Create and upload contract with renter signature
      if (orderNumber && contractPreviewData && contractSignature && customer) {
        // Save personal number to customer if it was provided during signing and not already set
        const existingPersonalNumber = getCustomAttributeValue(
          customer,
          "personal_number",
        );
        if (contractSignature.personalNumber && !existingPersonalNumber) {
          try {
            const attributesInput = buildCustomAttributesInput({
              personal_number: contractSignature.personalNumber,
            });
            await updateCustomerAttributes({
              custom_attributes: attributesInput,
            });
          } catch (err) {
            console.error("Failed to save personal number to customer:", err);
            // Don't fail the order, just log the error
          }
        }

        // Fetch order detail to get parent_customer_info (owner info)
        const orderDetailResult = await getOrderDetail(orderNumber);
        const parentCustomerInfo = orderDetailResult.data?.parent_customer_info;

        // Build owner info from parent_customer_info
        const ownerName = parentCustomerInfo
          ? [parentCustomerInfo.firstname, parentCustomerInfo.lastname]
              .filter(Boolean)
              .join(" ")
          : "";
        const ownerAddress = orderDetailResult.data?.billing_address
          ? [
              orderDetailResult.data.billing_address.street?.join(", "),
              orderDetailResult.data.billing_address.city,
              orderDetailResult.data.billing_address.postcode,
            ]
              .filter(Boolean)
              .join(", ")
          : "";

        // Use personal number from signature (which includes existing or newly entered)
        const renterPersonalNumber =
          contractSignature.personalNumber ||
          contractPreviewData.renterPersonalNumber;

        // Update contract data with actual order number and owner info
        const finalContractData: ContractPreviewData = {
          ...contractPreviewData,
          contractNumber: orderNumber,
          ownerName: ownerName || contractPreviewData.ownerName,
          ownerEmail:
            parentCustomerInfo?.email || contractPreviewData.ownerEmail,
          ownerPhone:
            parentCustomerInfo?.telephone || contractPreviewData.ownerPhone,
          ownerAddress: ownerAddress || contractPreviewData.ownerAddress,
          ownerPersonalNumber: contractPreviewData.ownerPersonalNumber,
          renterPersonalNumber: renterPersonalNumber,
        };

        const contractResult = await createAndUploadContract({
          orderId: orderNumber,
          contractData: finalContractData,
          renterSignature: {
            data: contractSignature.data,
            method: contractSignature.method,
            signerName: `${customer.firstname} ${customer.lastname}`,
            signerEmail: customer.email,
            signerPersonalNumber: renterPersonalNumber,
          },
          locale,
        });

        if (!contractResult.success) {
          console.error("Contract creation error:", contractResult.error);
          // Don't fail the order, just log the error
          // The contract can be regenerated later if needed
        }
      }

      // Step 5: Redirect to success page
      if (orderNumber) {
        router.push(`/${locale}/checkout/success?order=${orderNumber}`);
      } else {
        router.push(`/${locale}/checkout/success`);
      }
    } catch (error) {
      console.error("Place order error:", error);
      toast.error(t("failedToPlaceOrderRetry"));
    } finally {
      setIsSubmitting(false);
    }
  }, [
    contractSignature,
    selectedPaymentMethod,
    selectedBillingAddressId,
    selectedShippingAddressId,
    cart.id,
    router,
    locale,
    t,
    contractPreviewData,
    customer,
  ]);

  const handleSelectBillingAddress = useCallback(
    async (addressId: number | null) => {
      setSelectedBillingAddressId(addressId);
      setIsBillingAddressSet(false);

      if (addressId) {
        // User selected a saved address - set it on cart using customer_address_id
        try {
          const result = await setBillingAddress({
            cartId: cart.id,
            customerAddressId: addressId,
          });

          if (!result.success) {
            if (result.error === "SESSION_EXPIRED") {
              router.push("/sign-in");
              return;
            }
            toast.error(result.error || t("failedToSetBillingAddress"));
          } else {
            setIsBillingAddressSet(true);
          }
        } catch (error) {
          console.error("Select billing address error:", error);
        }
      }
    },
    [cart.id, router, t],
  );

  const handleSelectShippingAddress = useCallback(
    async (addressId: number | null) => {
      setSelectedShippingAddressId(addressId);
      setIsShippingAddressSet(false);

      if (addressId) {
        // User selected a saved address - set it on cart using customer_address_id
        try {
          const result = await setShippingAddress({
            cartId: cart.id,
            customerAddressId: addressId,
          });

          if (!result.success) {
            if (result.error === "SESSION_EXPIRED") {
              router.push("/sign-in");
              return;
            }
            toast.error(result.error || t("failedToSetShippingAddress"));
          } else {
            setIsShippingAddressSet(true);
          }
        } catch (error) {
          console.error("Select shipping address error:", error);
        }
      }
    },
    [cart.id, router, t],
  );

  // Note: Default addresses are already selected via useState initial values
  // They will be submitted to cart when user clicks "Continue to Payment"

  const handleAddressUpdated = useCallback(() => {
    // Refresh the page to get updated addresses
    router.refresh();
  }, [router]);

  // Get existing personal number from customer
  const existingPersonalNumber = customer
    ? getCustomAttributeValue(customer, "personal_number")
    : undefined;

  return {
    step,
    setStep,
    selectedPaymentMethod,
    setSelectedPaymentMethod,
    selectedBillingAddressId,
    selectedShippingAddressId,
    isSubmitting,
    isSettingAddresses,
    isSigningContract,
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
    cart,
    savedAddresses,
    locale,
  };
};
