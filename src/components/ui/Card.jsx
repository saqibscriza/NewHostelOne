import React from "react";
import { cn } from "../../lib/utils";

const Card = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-xl border border-border bg-card text-card-foreground shadow-sm",

      className,
    )}
    {...props}
  />
));
Card.displayName = "Card";

/**
 * 🔹 CardHeader
 * Structure only — no color logic here
 */
const CardHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

/**
 * 🔹 CardTitle
 * Title should ALWAYS be clearly visible on card
 */
const CardTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      // ✅ FIX 4: Added text-card-foreground
      // 👉 ensures title is readable in dark mode

      "text-lg font-semibold leading-none tracking-tight text-card-foreground",

      className,
    )}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";


// ✅ ADD THIS (missing earlier)
const CardDescription = React.forwardRef(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";



const CardFooter = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";




/**
 * CardContent
 * Content container — no color override
 * Use text-muted-foreground INSIDE when needed
 */
const CardContent = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

export { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter };
