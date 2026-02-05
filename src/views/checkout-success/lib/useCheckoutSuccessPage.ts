import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { useEffect, useRef } from "react";
import { createConversationFromOrder } from "@entities/conversation";
import { getOrderDetail } from "@entities/order";

export const useCheckoutSuccessPage = (orderNumber?: string) => {
  const router = useRouter();
  const locale = useLocale();
  const conversationCreated = useRef(false);

  // Create conversation for the order (only once)
  useEffect(() => {
    const createConversation = async () => {
      if (!orderNumber || conversationCreated.current) return;
      conversationCreated.current = true;

      try {
        // Fetch order details with customer_info and parent_customer_info
        const orderResult = await getOrderDetail(orderNumber);
        if (!orderResult.success || !orderResult.data) {
          return;
        }

        const order = orderResult.data;
        const { customer_info, parent_customer_info } = order;

        // Validate we have owner (parent_customer) info
        if (!parent_customer_info?.id) {
          return;
        }

        // Validate we have buyer (customer) info
        if (!customer_info?.id) {
          return;
        }

        // Build names from firstname + lastname
        const ownerName =
          [parent_customer_info.firstname, parent_customer_info.lastname]
            .filter(Boolean)
            .join(" ") || null;

        const receiverName =
          [customer_info.firstname, customer_info.lastname]
            .filter(Boolean)
            .join(" ") || null;

        // Use increment_id (human-readable order number) as orderId for display
        const incrementId = order.number || order.order_number || orderNumber;

        await createConversationFromOrder({
          orderId: incrementId,
          // Owner (product seller) from parent_customer_info
          ownerId: String(parent_customer_info.id),
          ownerEmail: parent_customer_info.email,
          ownerName,
          // Receiver (buyer) from customer_info
          receiverId: String(customer_info.id),
          receiverEmail: customer_info.email,
          receiverName,
        });
      } catch {
        // Silently handle errors - conversation creation is not critical
      }
    };

    void createConversation();
  }, [orderNumber]);

  const handleContinueShopping = () => {
    router.push(`/${locale}`);
  };

  const handleViewOrder = () => {
    if (orderNumber) {
      router.push(`/${locale}/account/order/view/${orderNumber}`);
    } else {
      router.push(`/${locale}/account/my-rents`);
    }
  };

  return {
    orderNumber,
    handleContinueShopping,
    handleViewOrder,
  };
};
