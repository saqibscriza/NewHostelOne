import React from "react";
import { cn } from "../../lib/utils";

/**
 * 🔹 Button Component
 * Fully theme-driven (NO hardcoded Tailwind colors)
 */
const Button = React.forwardRef(
  (
    { className, variant = "default", size = "default", ...props },
    ref
  ) => {
    const variants = {
      /**
       * ✅ FIX 1: default → uses theme primary
       * Replaces slate colors with semantic tokens
       */
      default:
        "bg-primary text-primary-foreground hover:bg-primary/90",

      /**
       * ✅ FIX 2: destructive → use destructive token
       */
      destructive:
        "bg-destructive text-destructive-foreground hover:bg-destructive/90",

      /**
       * ✅ FIX 3: outline → fixed typo + proper theme usage
       * ❌ bg-backgraound (wrong)
       * ✅ bg-background + hover states from theme
       */
      outline:
        "border border-border bg-background hover:bg-accent hover:text-accent-foreground",

      /**
       * ✅ FIX 4: secondary → theme-based
       */
      secondary:
        "bg-secondary text-secondary-foreground hover:bg-secondary/80",

      /**
       * ✅ FIX 5: ghost → no background, only hover using theme
       */
      ghost:
        "hover:bg-accent hover:text-accent-foreground",

      /**
       * ✅ FIX 6: link → theme-aware text
       */
      link:
        "text-primary underline-offset-4 hover:underline",
    };

    const sizes = {
      default: "h-10 px-4 py-2",
      sm: "h-9 rounded-md px-3",
      lg: "h-11 rounded-md px-8",
      icon: "h-10 w-10",
    };

    return (
      <button
        ref={ref}
        className={cn(
          /**
           * ✅ FIX 7: replaced hardcoded ring colors
           * ❌ ring-offset-white, ring-slate-950
           * ✅ theme-based ring
           */
          "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background disabled:pointer-events-none disabled:opacity-50",

          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button };