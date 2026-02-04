"use client";

import Link from "next/link";
import { cn } from "@shared/lib/utils/helpers";
import { useSettingsSidebar } from "../lib/useSettingsSidebar";
import type { SettingsSidebarProps } from "../model/interface";

export default function SettingsSidebar(props: SettingsSidebarProps) {
  const { pathname, navItems } = useSettingsSidebar(props);

  return (
    <nav className="space-y-1">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-4 py-2 text-sm rounded-md transition-colors",
              isActive
                ? "bg-secondary text-secondary-foreground font-medium"
                : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground",
            )}
          >
            <Icon className="h-4 w-4" />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
