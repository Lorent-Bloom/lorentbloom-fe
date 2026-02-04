import { getCustomer } from "@entities/customer";
import { ChatIconClient } from "./ChatIcon";
import type { ChatIconProps } from "../model/interface";

export async function ChatIcon({ className }: ChatIconProps) {
  const customer = await getCustomer();

  if (!customer?.email) {
    return null;
  }

  return <ChatIconClient className={className} currentUserId={customer.email} />;
}
