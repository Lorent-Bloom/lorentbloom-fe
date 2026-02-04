"use client";

import { useTransition } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { removeCartItem } from "@entities/cart";

export const useCartPage = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const t = useTranslations("cart");

  // Extract locale from pathname
  const locale = pathname?.split("/")[1] || "en";

  const handleRemoveItem = (itemId: string) => {
    startTransition(async () => {
      const result = await removeCartItem({ cartItemUid: itemId });

      if (!result.success) {
        if (result.error === "SESSION_EXPIRED") {
          toast.error(t("sessionExpired"));
          router.push("/sign-in");
        } else {
          toast.error(result.error || t("failedToRemoveItem"));
        }
        return;
      }

      toast.success(t("itemRemoved"));
      router.refresh();
    });
  };

  const handleCheckout = () => {
    router.push(`/${locale}/checkout`);
  };

  return {
    isPending,
    handleRemoveItem,
    handleCheckout,
    locale,
  };
};
