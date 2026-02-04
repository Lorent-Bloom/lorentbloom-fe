"use client";

import React, { FC } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@shared/ui/accordion";
import { HelpCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import type { FaqListProps } from "../model/interface";
import { cn } from "@shared/lib/utils";

const FaqList: FC<FaqListProps> = ({ className }) => {
  const t = useTranslations("faq-list");

  const rawItems = t.raw("items");

  // Handle both array format and object format (from i18n merge)
  let items: Array<{ question: string; answer: string }> = [];
  if (Array.isArray(rawItems)) {
    items = rawItems;
  } else if (rawItems && typeof rawItems === "object") {
    items = Object.values(rawItems);
  }

  return (
    <Accordion
      type="single"
      collapsible
      className={cn("w-full space-y-3", className)}
    >
      {items.map((item, index) => (
        <AccordionItem
          key={index}
          value={`item-${index}`}
          className="border rounded-lg px-4"
        >
          <AccordionTrigger className="text-left gap-3">
            <HelpCircle className="h-5 w-5 shrink-0 text-muted-foreground" />
            <span className="flex-1">{item.question}</span>
          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground pl-8">
            {item.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

export default FaqList;
