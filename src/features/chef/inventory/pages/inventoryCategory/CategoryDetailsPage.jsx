import React from "react";
import { Search, Edit2, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "../../../../../components/ui/Card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../../admin/Table";
import { Badge } from "../../../../../components/ui/badge";

export default function CategoryDetailsPage() {
  const items = [
    { id: 1, name: "Fresh Whole Milk", sku: "MK-DAI-001" },
    { id: 2, name: "Amul Butter (500g)", sku: "MK-DAI-008" },
    { id: 3, name: "Curd (Bulk)", sku: "MK-DAI-012" },
    { id: 4, name: "Amul Butter (500g)", sku: "MK-DAI-008" },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-10">
      <div>
        <h1 className="text-3xl font-bold text-foreground tracking-tight">
          Dairy Category Item Details
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          View and update all dairy category item information
        </p>
      </div>

      <Card className="border border-border shadow-sm rounded-2xl overflow-hidden bg-card">
        <div className="p-6 border-b border-border">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search dairy products, SKUs..."
              className="w-full bg-muted/40 border-none text-foreground text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-foreground py-2.5 pl-10 pr-4"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/10 border-b border-border">
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-xs font-bold text-muted-foreground uppercase tracking-wider h-14 pl-6">
                  Item Details
                </TableHead>
                <TableHead className="text-xs font-bold text-muted-foreground uppercase tracking-wider h-14">
                  SKU Identifier
                </TableHead>
                <TableHead className="text-xs font-bold text-muted-foreground uppercase tracking-wider text-right h-14 pr-6">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item, index) => (
                <TableRow
                  key={index}
                  className="border-border hover:bg-muted/30 transition-colors"
                >
                  <TableCell className="pl-6 py-5">
                    <span className="font-bold text-[15px] text-foreground">
                      {item.name}
                    </span>
                  </TableCell>
                  <TableCell className="py-5">
                    <Badge
                      variant="secondary"
                      className="bg-muted text-muted-foreground font-semibold rounded-md px-2 py-0.5 pointer-events-none hover:bg-muted"
                    >
                      {item.sku}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-5 text-right pr-6">
                    <Link
                      to={`/chef/inventory/category/1/item/${item.id}/edit`}
                      className="inline-flex text-muted-foreground hover:text-foreground transition-colors p-2 rounded-lg hover:bg-muted"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Link>

                    <Link
                      to={`/chef/inventory/category/1/item/${item.id}/delete`}
                      className="inline-flex text-muted-foreground hover:text-foreground transition-colors p-2 rounded-lg hover:bg-muted"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-transparent">
          <span className="text-sm font-medium text-muted-foreground">
            Showing 1 to 4 of 24 items
          </span>
          <div className="flex items-center gap-1.5">
            <button className="p-1.5 text-muted-foreground hover:text-foreground rounded-lg transition-colors cursor-not-allowed opacity-50">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#0f1419] dark:bg-white text-white dark:text-black text-sm font-bold shadow-sm">
              1
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg text-foreground hover:bg-muted text-sm font-medium">
              2
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg text-foreground hover:bg-muted text-sm font-medium">
              3
            </button>
            <span className="px-2 text-muted-foreground">...</span>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg text-foreground hover:bg-muted text-sm font-medium">
              6
            </button>
            <button className="p-1.5 text-muted-foreground hover:text-foreground rounded-lg transition-colors">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}
