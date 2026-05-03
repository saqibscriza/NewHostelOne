import React from "react";
import { cn } from "../../lib/utils";

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        /**
         * ✅ FIX 1: bg-backgraound ❌ → bg-background ✅
         * ✅ FIX 2: removed slate text + placeholder
         * ✅ FIX 3: added text-foreground + placeholder-muted
         * ✅ FIX 4: fixed focus ring to theme
         */
        "flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background disabled:cursor-not-allowed disabled:opacity-50",

        className,
      )}
      ref={ref}
      {...props}
    />
  );
});

Input.displayName = "Input";

export { Input };
