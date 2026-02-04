"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Mail } from "lucide-react";
import { Button } from "@shared/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@shared/ui/tooltip";
import { cn } from "@shared/lib/utils";

interface ContactIconProps {
  className?: string;
}

export function ContactIcon({ className }: ContactIconProps) {
  const locale = useLocale();
  const t = useTranslations("contact-icon");

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn("h-8 w-8", className)}
          aria-label={t("ariaLabel")}
          asChild
        >
          <Link href={`/${locale}/contact-us`}>
            <Mail className="h-4 w-4" />
          </Link>
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{t("tooltip")}</p>
      </TooltipContent>
    </Tooltip>
  );
}
