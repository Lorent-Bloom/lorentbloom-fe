"use client";

import { getCustomer } from "./server";

/**
 * Client-side wrapper for getCustomer server action
 * Used to check authentication status from client components
 */
export async function getCustomerClient() {
  return await getCustomer();
}
