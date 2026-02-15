import Link from "next/link";
import { Button } from "@shared/ui/button";
import { Check } from "lucide-react";
import type { OnboardingStepProps } from "../model/interface";

export function OnboardingStep({
  stepNumber,
  title,
  description,
  completed,
  actionLabel,
  actionHref,
}: OnboardingStepProps) {
  return (
    <div
      className={`flex items-center gap-3 rounded-md p-3 ${
        completed ? "bg-green-50 dark:bg-green-950/30" : "bg-muted/50"
      }`}
    >
      <div
        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
          completed
            ? "bg-green-500 text-white"
            : "bg-primary text-primary-foreground"
        }`}
      >
        {completed ? <Check className="h-4 w-4" /> : stepNumber}
      </div>
      <div className="min-w-0 flex-1">
        <p
          className={`text-sm font-medium ${
            completed ? "text-muted-foreground line-through" : ""
          }`}
        >
          {title}
        </p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      {!completed && (
        <Button
          asChild
          variant="outline"
          size="sm"
          className="shrink-0 hover:bg-muted dark:hover:bg-muted/50"
        >
          <Link href={actionHref}>{actionLabel}</Link>
        </Button>
      )}
    </div>
  );
}
