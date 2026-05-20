import React from "react";
import { cn } from "../../lib/utils";

const Input = React.forwardRef(({ className, type = "text", ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-12 w-full rounded-[var(--field-radius)] border border-border bg-background px-4 py-3 text-[15px] text-foreground shadow-[0_1px_2px_rgba(15,23,42,0.03)] outline-none transition-[border-color,box-shadow,background-color] placeholder:text-muted-foreground focus-visible:border-slate-300 focus-visible:ring-4 focus-visible:ring-slate-200/80 disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted/60 aria-invalid:border-destructive aria-invalid:focus-visible:border-destructive aria-invalid:focus-visible:ring-destructive/10 file:border-0 file:bg-transparent file:text-sm file:font-medium",
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});

Input.displayName = "Input";

export { Input };