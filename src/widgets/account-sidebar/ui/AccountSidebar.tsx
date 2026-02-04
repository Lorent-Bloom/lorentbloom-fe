"use client";

import Link from "next/link";
import { cn } from "@shared/lib/utils/helpers";
import { Badge } from "@shared/ui/badge";
import { useAccountSidebar } from "../lib/useAccountSidebar";
import type { AccountSidebarProps } from "../model/interface";

export default function AccountSidebar(props: AccountSidebarProps) {
  const { pathname, navItems } = useAccountSidebar(props);
  const { pendingSignatures = 0 } = props;

  return (
    <nav className="space-y-1">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;
        const isDocuments = item.href.includes("/documents");

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center justify-between px-4 py-2 text-sm rounded-md transition-colors",
              isActive
                ? "bg-secondary text-secondary-foreground font-medium"
                : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground",
            )}
          >
            <span className="flex items-center gap-3">
              <Icon className="h-4 w-4" />
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
        );
      })}
    </nav>
  );
}
