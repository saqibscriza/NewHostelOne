import React from "react";
import { cn } from "../../lib/utils";

/**
 * 🔹 Table Wrapper
 * Uses card surface
 */
const Table = React.forwardRef(({ className, ...props }, ref) => (
  <div className="relative w-full overflow-auto bg-card text-card-foreground rounded-lg border border-border">
    <table
      ref={ref}
      className={cn("w-full caption-bottom text-sm", className)}
      {...props}
    />
  </div>
));
Table.displayName = "Table";

/**
 * 🔹 Header
 */
const TableHeader = React.forwardRef(({ className, ...props }, ref) => (
  <thead
    ref={ref}
    className={cn("[&_tr]:border-b border-border", className)}
    {...props}
  />
));
TableHeader.displayName = "TableHeader";

/**
 * 🔹 Body
 */
const TableBody = React.forwardRef(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn("[&_tr:last-child]:border-0", className)}
    {...props}
  />
));
TableBody.displayName = "TableBody";

/**
 * 🔹 Row
 */
const TableRow = React.forwardRef(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      /**
       * ✅ FIX 1:
       * hover:bg-slate-100 ❌ → bg-muted
       * selected:bg-slate ❌ → bg-muted
       */
      "border-b border-border transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
      className,
    )}
    {...props}
  />
));
TableRow.displayName = "TableRow";

/**
 * 🔹 Head cell
 */
const TableHead = React.forwardRef(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      /**
       * ✅ FIX 2:
       * text-slate-500 ❌ → text-muted-foreground
       */
      "h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0",
      className,
    )}
    {...props}
  />
));
TableHead.displayName = "TableHead";

/**
 * 🔹 Cell
 */
const TableCell = React.forwardRef(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn(
      /**
       * ✅ FIX 3:
       * ensure readable text
       */
      "p-4 align-middle text-foreground [&:has([role=checkbox])]:pr-0",
      className,
    )}
    {...props}
  />
));
TableCell.displayName = "TableCell";

export { Table, TableHeader, TableBody, TableRow, TableHead, TableCell };
