import React, { Suspense } from "react";
import { SignUpForm } from "@widgets/sign-up-form";
import { AuthFormSkeleton } from "@shared/ui";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { SignUpPageProps } from "../model/interface";

const SignUpPage = async ({ params }: SignUpPageProps) => {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("sign-up");

  return (
    <div className="flex flex-grow flex-col items-center py-10 px-4 text-3xl font-bold">
      <h1 className="">{t("title")}</h1>
      <Suspense fallback={<AuthFormSkeleton />}>
        <SignUpForm className="w-full max-w-[600px] mt-[60px]" />
      </Suspense>
    </div>
  );
};
export default SignUpPage;
