"use client";

import React, { useState } from "react";
import { Input, Button } from "@shared/ui";
import { cn } from "@shared/lib/utils/helpers";
import { Eye, EyeOff } from "lucide-react";

type PasswordInputProps = React.ComponentProps<"input"> & {
  toggleButtonClassName?: string;
};

const PasswordInput = ({
  className,
  toggleButtonClassName,
  ...props
}: PasswordInputProps) => {
  const [show, setShow] = useState(false);

  return (
    <div className="relative">
      <Input
        type={show ? "text" : "password"}
        className={cn("pr-10", className)}
        {...props}
      />
      <Button
        variant="ghost"
        type="button"
        onClick={() => setShow(!show)}
        className={cn(
          "absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground hover:bg-unset has-[>svg]:px-0 py-0 [&_svg:not([class*='size-'])]:size-6",
          toggleButtonClassName,
        )}
      >
        {show ? <EyeOff /> : <Eye />}
      </Button>
    </div>
  );
};

export default PasswordInput;
