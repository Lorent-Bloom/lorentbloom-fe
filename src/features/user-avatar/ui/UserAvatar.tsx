import Link from "next/link";
import { getCustomer } from "@entities/customer";
import { getPendingSignatureCount } from "@entities/document";
import { Button } from "@shared/ui/button";
import { UserCircle } from "lucide-react";
import UserAvatarClient from "./UserAvatarClient";
import { getLocale, getTranslations } from "next-intl/server";

export default async function UserAvatar() {
  const customer = await getCustomer();
  const locale = await getLocale();
  const t = await getTranslations("user-avatar");

  if (!customer) {
    return (
      <Link href={`/${locale}/sign-in`} aria-label={t("signIn")}>
        <Button variant="ghost" size="sm" className="gap-2">
          <UserCircle className="h-5 w-5" />
          <span className="hidden sm:inline">{t("signIn")}</span>
        </Button>
      </Link>
    );
  }

  const customerName =
    [customer.firstname, customer.lastname].filter(Boolean).join(" ").trim() ||
    customer.email;

  // Fetch pending signature count for badge display
  const pendingResult = await getPendingSignatureCount(customer.email);
  const pendingSignatures = pendingResult.success ? pendingResult.count : 0;

  return (
    <UserAvatarClient
      customerName={customerName}
      locale={locale}
      pendingSignatures={pendingSignatures}
    />
  );
}
