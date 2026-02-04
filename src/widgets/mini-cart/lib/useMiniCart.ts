"use client";

import { useState, useEffect, useTransition } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { getCart, removeCartItem, type Cart } from "@entities/cart";

export const useMiniCart = (isOpen: boolean, initialCart?: Cart | null) => {
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("mini-cart");
  const [cart, setCart] = useState<Cart | null>(null);
  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState(false);

  const loadCart = async () => {
    setIsLoading(true);
    const result = await getCart();
    if (result.success && result.data) {
      setCart(result.data);
    } else if (result.error === "SESSION_EXPIRED") {
      toast.error(t("sessionExpired"));
      router.push("/sign-in");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (isOpen) {
      loadCart();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const handleRemoveItem = (itemId: string) => {
    startTransition(async () => {
      const result = await removeCartItem({ cartItemUid: itemId });

      if (!result.success) {
        if (result.error === "SESSION_EXPIRED") {
          toast.error(t("sessionExpired"));
          router.push("/sign-in");
        } else {
          toast.error(result.error || t("failedToRemove"));
        }
        return;
      }

      setCart(result.data || null);
      toast.success(t("itemRemoved"));
      router.refresh();
    });
  };

  // Display logic
  const displayCart = cart || initialCart;
  const displayItems = displayCart?.items || [];

  // Extract locale from pathname (e.g., /en/products -> en)
  const locale = pathname?.split("/")[1] || "en";

  const handleNavigateToCart = () => {
    router.push(`/${locale}/cart`);
  };

  const handleNavigateToCheckout = () => {
    router.push(`/${locale}/checkout`);
  };

  return {
    cart,
    displayCart,
    displayItems,
    isLoading,
    isPending,
    handleRemoveItem,
    handleNavigateToCart,
    handleNavigateToCheckout,
  };
};
