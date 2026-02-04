"use server";

import { logoutCustomer } from "@entities/customer";
import { redirect } from "next/navigation";

export async function handleLogout(locale: string) {
  await logoutCustomer();
  redirect(`/${locale}/sign-in`);
}
