import React, { Suspense } from "react";
import { SignInForm } from "@widgets/sign-in-form";
import { AuthFormSkeleton } from "@shared/ui";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { SignInPageProps } from "../model/interface";

const SignInPage = async ({ params }: SignInPageProps) => {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("sign-in");

  return (
    <div className="flex flex-grow flex-col items-center py-10 px-4 text-3xl font-bold">
      <h1 className="">{t("title")}</h1>
      <Suspense fallback={<AuthFormSkeleton />}>
        <SignInForm className="w-full max-w-[600px] mt-[60px]" />
      </Suspense>
    </div>
  );
};
export default SignInPage;
