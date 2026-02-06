import type { Metadata } from "next";
import { getCustomer } from "@entities/customer";
import { getPendingSignatureCount } from "@entities/document";
import { AccountSidebar } from "@widgets/account-sidebar";
import { redirect } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const customer = await getCustomer();
  const locale = await getLocale();
  const t = await getTranslations("account");

  if (!customer) {
    redirect(`/${locale}/sign-in`);
  }

  const pendingResult = await getPendingSignatureCount(customer.email);
  const pendingSignatures = pendingResult.success ? pendingResult.count : 0;

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{t("title")}</h1>
        <p className="text-muted-foreground mt-2">{t("description")}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-8">
        <aside className="md:sticky md:top-8 md:h-fit">
          <AccountSidebar
            locale={locale}
            pendingSignatures={pendingSignatures}
          />
        </aside>
        <main>{children}</main>
      </div>
    </div>
  );
}
