"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { getCart, type Cart } from "@entities/cart";
import { toast } from "sonner";

// Hook to detect if user is on mobile
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024); // lg breakpoint
    };

    // Check on mount
    checkMobile();

    // Listen for resize
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return isMobile;
};

export const useCartMenu = () => {
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("cart-menu");
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);
  const [cart, setCart] = useState<Cart | null>(null);
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

  // Load cart on mount and when pathname changes (route navigation)
  useEffect(() => {
    loadCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Reload cart when menu opens to ensure fresh data
  useEffect(() => {
    if (isOpen) {
      loadCart();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // Poll cart every 10 seconds to keep badge updated
  useEffect(() => {
    const interval = setInterval(() => {
      loadCart();
    }, 10000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCartClick = () => {
    // On mobile, navigate to cart page instead of opening sidebar
    if (isMobile) {
      // Extract locale from pathname (e.g., /en/products -> en)
      const localeMatch = pathname.match(/^\/([^/]+)/);
      const locale = localeMatch ? localeMatch[1] : "en";
      router.push(`/${locale}/cart`);
    } else {
      // On desktop, toggle sidebar
      setIsOpen((prev) => !prev);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const itemCount = cart?.total_quantity || 0;

  return {
    isOpen,
    handleCartClick,
    handleClose,
    itemCount,
    cart,
    isLoading,
    refreshCart: loadCart,
  };
};
