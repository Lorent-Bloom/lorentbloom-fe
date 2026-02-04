import { Suspense } from "react";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { ConfirmEmailPageProps } from "../model/interface";
import { ConfirmEmailCard } from "./ConfirmEmailCard";
import { Skeleton } from "@shared/ui";

const ConfirmEmailPage = async ({
  params,
  searchParams,
}: ConfirmEmailPageProps) => {
  const { locale } = await params;
  const { email, id, key } = await searchParams;
  setRequestLocale(locale);
  const t = await getTranslations("confirm-email");

  const hasValidParams = Boolean(email && id && key);

  return (
    <div className="flex flex-grow flex-col items-center py-10 px-4">
      <h1 className="text-3xl font-bold">{t("title")}</h1>
      <Suspense
        fallback={<Skeleton className="w-full max-w-[500px] h-[300px] mt-15" />}
      >
        <ConfirmEmailCard
          className="w-full max-w-[500px] mt-15"
          email={email}
          id={id}
          confirmationKey={key}
          hasValidParams={hasValidParams}
        />
      </Suspense>
    </div>
  );
};

export default ConfirmEmailPage;
