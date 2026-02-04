import { getTranslations } from "next-intl/server";
import { getCart } from "@entities/cart";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@shared/ui/sheet";
import MiniCartContent from "./MiniCartContent";
import type { MiniCartProps } from "../model/interface";

export default async function MiniCart({
  isOpen,
  onClose,
  className,
}: MiniCartProps) {
  const cartResponse = await getCart();
  const cart = cartResponse.success ? cartResponse.data || null : null;
  const t = await getTranslations("mini-cart");

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className={className}>
        <SheetHeader>
          <SheetTitle>{t("shoppingCart")}</SheetTitle>
        </SheetHeader>
        <MiniCartContent cart={cart} onClose={onClose} />
      </SheetContent>
    </Sheet>
  );
}
