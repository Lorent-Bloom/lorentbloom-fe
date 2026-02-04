import { useState, useEffect, useCallback } from "react";
import { format } from "date-fns";
import { formatCurrency } from "@shared/lib/formatCurrency";
import { getContractPdfUrl } from "@features/document-signing";
import type { OrderDetail, OrderAddress, Money } from "@entities/order";

interface UseOrderDetailPageProps {
  order: OrderDetail;
}

interface FormattedAddress {
  name: string;
  company?: string;
  street: string;
  cityRegionPostcode: string;
  country: string;
  telephone: string;
}

export const useOrderDetailPage = ({ order }: UseOrderDetailPageProps) => {
  const [contractUrl, setContractUrl] = useState<string | null>(null);
  const [contractStatus, setContractStatus] = useState<string | null>(null);
  const [isLoadingContract, setIsLoadingContract] = useState(false);

  // Fetch contract PDF URL
  const fetchContractUrl = useCallback(async () => {
    const orderNumber = order.order_number || order.number;
    if (!orderNumber) return;

    setIsLoadingContract(true);
    try {
      const result = await getContractPdfUrl(orderNumber);
      if (result.success && result.url) {
        setContractUrl(result.url);
        setContractStatus(result.status || null);
      }
    } catch {
      // Silently handle - contract might not exist
    } finally {
      setIsLoadingContract(false);
    }
  }, [order.order_number, order.number]);

  useEffect(() => {
    void fetchContractUrl();
  }, [fetchContractUrl]);

  const handleDownloadContract = useCallback(() => {
    if (contractUrl) {
      window.open(contractUrl, "_blank");
    }
  }, [contractUrl]);
  const dateString = order.created_at || order.order_date || new Date().toISOString();
  const formattedDate = format(
    new Date(dateString),
    "MMM dd, yyyy, h:mm:ss a",
  );

  const formatAddress = (
    address: OrderAddress | null,
  ): FormattedAddress | null => {
    if (!address) return null;

    const cityRegionPostcode = [address.city, address.region, address.postcode]
      .filter(Boolean)
      .join(", ");

    return {
      name: `${address.firstname} ${address.lastname}`,
      company: address.company,
      street: address.street.join("\n"),
      cityRegionPostcode,
      country: address.country_code,
      telephone: address.telephone,
    };
  };

  const billingAddressFormatted = formatAddress(order.billing_address);
  const shippingAddressFormatted = formatAddress(order.shipping_address);

  const paymentMethodName = order.payment_methods?.[0]?.name || "N/A";

  const shippingMethodDisplay = order.shipping_method || "N/A";
  const shippingCost = order.total.total_shipping;

  const getStatusVariant = (
    status: string,
  ): "default" | "secondary" | "destructive" | "outline" => {
    switch (status.toLowerCase()) {
      case "complete":
      case "completed":
        return "secondary";
      case "canceled":
      case "cancelled":
        return "destructive";
      case "pending":
      case "processing":
        return "outline";
      default:
        return "default";
    }
  };

  const calculateItemDiscount = (
    discounts?: Array<{ amount: Money; label: string }>,
  ) => {
    if (!discounts || discounts.length === 0) return 0;
    return discounts.reduce((sum, d) => sum + d.amount.value, 0);
  };

  return {
    formattedDate,
    formatCurrency,
    billingAddressFormatted,
    shippingAddressFormatted,
    paymentMethodName,
    shippingMethodDisplay,
    shippingCost,
    getStatusVariant,
    calculateItemDiscount,
    contractUrl,
    contractStatus,
    isLoadingContract,
    handleDownloadContract,
  };
};
