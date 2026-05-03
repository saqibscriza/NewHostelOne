import React from "react";
import { cn } from "../../lib/utils";

function Badge({ className, variant = "default", ...props }) {
  const variants = {
    /**
     * ✅ FIX: replaced slate colors → theme tokens
     */
    default: "border-transparent bg-primary text-primary-foreground",

    /**
     * ✅ FIX: secondary uses theme
     */
    secondary: "border-transparent bg-secondary text-secondary-foreground",

    /**
     * ✅ FIX: destructive uses theme
     */
    destructive:
      "border-transparent bg-destructive text-destructive-foreground",

    /**
     * ✅ FIX: outline should use border + foreground
     */
    outline: "border border-border text-foreground",

    /**
     * ✅ FIX: no custom emerald → use semantic (or keep as custom if needed)
     */
    success: "border-transparent bg-primary/20 text-primary",
  };

  return (
    <div
      className={cn(
        /**
         * ✅ FIX: removed hardcoded ring colors
         */
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ring-offset-background",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}

export { Badge };
