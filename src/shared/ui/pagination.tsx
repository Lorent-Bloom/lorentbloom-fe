import * as React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

import { cn } from "@shared/lib/utils";
import { type ButtonProps, buttonVariants } from "@shared/ui/button";

type PaginationProps = React.ComponentProps<"nav"> & {
  ariaLabel?: string;
};

const Pagination = ({
  className,
  ariaLabel = "pagination",
  ...props
}: PaginationProps) => (
  <nav
    role="navigation"
    aria-label={ariaLabel}
    className={cn("flex w-full justify-center", className)}
    {...props}
  />
);
Pagination.displayName = "Pagination";

const PaginationContent = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<"ul">
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn("flex flex-row items-center gap-1", className)}
    {...props}
  />
));
PaginationContent.displayName = "PaginationContent";

const PaginationItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<"li">
>(({ className, ...props }, ref) => (
  <li ref={ref} className={cn("", className)} {...props} />
));
PaginationItem.displayName = "PaginationItem";

type PaginationLinkProps = {
  isActive?: boolean;
} & Pick<ButtonProps, "size"> &
  React.ComponentProps<"a">;

const PaginationLink = ({
  className,
  isActive,
  size = "icon",
  ...props
}: PaginationLinkProps) => (
  <a
    aria-current={isActive ? "page" : undefined}
    className={cn(
      buttonVariants({
        variant: isActive ? "outline" : "ghost",
        size,
      }),
      className,
    )}
    {...props}
  />
);
PaginationLink.displayName = "PaginationLink";

type PaginationPreviousProps = React.ComponentProps<typeof PaginationLink> & {
  label?: string;
  ariaLabel?: string;
};

const PaginationPrevious = ({
  className,
  label = "Previous",
  ariaLabel,
  ...props
}: PaginationPreviousProps) => (
  <PaginationLink
    aria-label={ariaLabel || label}
    size="default"
    className={cn("gap-1 pl-2.5", className)}
    {...props}
  >
    <ChevronLeft className="h-4 w-4" />
    <span className="hidden sm:inline">{label}</span>
  </PaginationLink>
);
PaginationPrevious.displayName = "PaginationPrevious";

type PaginationNextProps = React.ComponentProps<typeof PaginationLink> & {
  label?: string;
  ariaLabel?: string;
};

const PaginationNext = ({
  className,
  label = "Next",
  ariaLabel,
  ...props
}: PaginationNextProps) => (
  <PaginationLink
    aria-label={ariaLabel || label}
    size="default"
    className={cn("gap-1 pr-2.5", className)}
    {...props}
  >
    <span className="hidden sm:inline">{label}</span>
    <ChevronRight className="h-4 w-4" />
  </PaginationLink>
);
PaginationNext.displayName = "PaginationNext";

type PaginationEllipsisProps = React.ComponentProps<"span"> & {
  srText?: string;
};

const PaginationEllipsis = ({
  className,
  srText = "More pages",
  ...props
}: PaginationEllipsisProps) => (
  <span
    aria-hidden
    className={cn("flex h-9 w-9 items-center justify-center", className)}
    {...props}
  >
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">{srText}</span>
  </span>
);
PaginationEllipsis.displayName = "PaginationEllipsis";

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
};
