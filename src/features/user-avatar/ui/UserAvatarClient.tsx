"use client";

import { Avatar, AvatarFallback } from "@shared/ui/avatar";
import { Badge } from "@shared/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@shared/ui/dropdown-menu";
import { LogOut } from "lucide-react";
import Link from "next/link";
import { useUserAvatar } from "../lib/useUserAvatar";
import type { UserAvatarClientProps } from "../model/interface";

export default function UserAvatarClient(props: UserAvatarClientProps) {
  const { t, customerName, getInitials, onLogout, navItems } =
    useUserAvatar(props);

  const { pendingSignatures = 0 } = props;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary rounded-full">
          <Avatar>
            <AvatarFallback>{getInitials(customerName)}</AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>{customerName}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {navItems.map((item) => {
          const Icon = item.icon;
          const isDocuments = item.href.includes("/documents");
          return (
            <DropdownMenuItem
              key={item.href}
              asChild
              className="cursor-pointer"
            >
              <Link href={item.href} className="flex items-center justify-between w-full">
                <span className="flex items-center">
                  <Icon className="mr-2 h-4 w-4" />
                  <span>{item.label}</span>
                </span>
                {isDocuments && pendingSignatures > 0 && (
                  <Badge
                    variant="destructive"
                    className="h-5 min-w-5 rounded-full p-0 text-xs flex items-center justify-center"
                  >
                    {pendingSignatures}
                  </Badge>
                )}
              </Link>
            </DropdownMenuItem>
          );
        })}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onLogout} className="cursor-pointer">
          <LogOut className="mr-2 h-4 w-4" />
          <span>{t("logout")}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
