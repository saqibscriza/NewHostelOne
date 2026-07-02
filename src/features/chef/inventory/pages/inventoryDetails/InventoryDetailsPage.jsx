import React, { useEffect, useState } from "react";
import {
  AlertTriangle,
  Trash2,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Wallet,
  Clock3,
  Edit2,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../../../components/ui/Card";
import { Button } from "../../../../../components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../../../components/ui/Table";
import { Badge } from "../../../../../components/ui/Badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../../components/ui/select";
import { useNavigate, Link } from "react-router-dom";
import { getInventoryStockDashboardApi, deleteStockApi } from "../../../../../utils/utils";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../../../../../components/ui/pagination";

export default function InventoryDetailsPage() {
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState({
    totalInventoryValue: 0,
    lowStockAlerts: 0,
    wastagePercent: 0,
    expiringSoon: 0,
  });
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all-category");

  const fetchInventoryDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await getInventoryStockDashboardApi();
      console.log("STOCK DASHBOARD:", res);

      if (res?.status !== "success") {
        setError(res?.message || "Failed to fetch inventory dashboard.");
        return;
      }

      setDashboard(res?.inventory?.dashboard || {});
      setStocks(res?.inventory?.stocks || []);
    } catch (err) {
      console.error("Error fetching stock dashboard:", err);
      setError("Something went wrong while fetching inventory dashboard.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventoryDashboard();
  }, []);

  const formatCurrency = (value) =>
    `₹${Number(value || 0).toLocaleString("en-IN", {
      maximumFractionDigits: 2,
      minimumFractionDigits: 0,
    })}`;


  const handleDelete = async (stockId) => {
    try {
      const res = await deleteStockApi(stockId);
      console.log("DELETE RESPONSE =>", res);
      // API success check
      if (res?.status === "success" || res?.statusCode === 200) {
        // UI se remove instantly
        setStocks((prev) =>
          prev.filter((item) => item.stockId !== stockId)
        );
      } else {
        console.log("Stock delete error");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const uniqueCategories = Array.from(new Set(stocks.map((item) => item.categoryName).filter(Boolean)));
  const filteredStocks = selectedCategory === "all-category" ? stocks : stocks.filter((item) => item.categoryName === selectedCategory);
  console.log('my data of invenory', filteredStocks);

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">
            Inventory
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Operational stock oversight and supply chain management.
          </p>
        </div>

        <Button className="bg-[#0f1419] dark:bg-white dark:text-black hover:bg-[#272c30] dark:hover:bg-gray-100 text-white rounded-xl h-11 px-6 shadow-sm">
          <Link to="/chef/inventory/details/add">+ Add New Stock</Link>
        </Button>
      </div>

      {error ? <p className="text-sm text-red-500">{error}</p> : null}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <Card className="border-border shadow-sm rounded-sm bg-card">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                Total Inventory Value
              </p>
              <div className="p-2 bg-muted rounded-md">
                <Wallet className="w-5 h-5 text-foreground" />
              </div>
            </div>
            <h3 className="text-3xl font-bold text-foreground">
              {formatCurrency(dashboard.totalInventoryValue)}
            </h3>
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm rounded-sm bg-card">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                Low Stock Alerts
              </p>
              <div className="p-2 bg-muted rounded-md">
                <AlertTriangle className="w-5 h-5 text-foreground" />
              </div>
            </div>
            <div className="flex items-end gap-2">
              <h3 className="text-3xl font-bold text-foreground">
                {dashboard.lowStockAlerts || 0}
              </h3>
              <p className="text-xs font-bold uppercase tracking-widest text-foreground pb-1">
                Critical Items
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm rounded-sm bg-card">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                Monthly Wastage %
              </p>
              <div className="p-2 bg-muted rounded-md">
                <Trash2 className="w-5 h-5 text-foreground" />
              </div>
            </div>
            <h3 className="text-3xl font-bold text-foreground">
              {dashboard.wastagePercent || 0}%
            </h3>
            <p className="flex items-center text-sm font-semibold text-foreground mt-2">
              <TrendingUp className="w-4 h-4 mr-1" />
              Wastage Report
            </p>
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm rounded-sm bg-card">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                Expiring Soon
              </p>
              <div className="p-2 bg-muted rounded-md">
                <Clock3 className="w-5 h-5 text-foreground" />
              </div>
            </div>
            <h3 className="text-3xl font-bold text-foreground">
              {dashboard.expiringSoon || 0}
            </h3>
            <p className="text-sm font-medium text-muted-foreground mt-2">
              Items near expiry
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border shadow-sm rounded-sm bg-card">
        <CardContent className="p-4 flex flex-col sm:flex-row items-center gap-4">
          <span className="text-sm font-medium text-foreground whitespace-nowrap">
            Filter by:
          </span>

          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full sm:w-[150px] bg-muted/30 border-border rounded-md px-3 flex justify-between font-medium">
              <SelectValue placeholder="All Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-category">All Category</SelectItem>
              {uniqueCategories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <button
            type="button"
            onClick={() => setSelectedCategory("all-category")}
            className="text-sm font-medium text-foreground hover:underline sm:ml-auto mt-2 sm:mt-0"
          >
            Clear all filters
          </button>
        </CardContent>
      </Card>

      <Card className="border border-border shadow-sm rounded-sm overflow-hidden bg-card">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 bg-transparent pb-4">
          <CardTitle className="text-xl font-bold text-foreground">
            Inventory Details
          </CardTitle>
          <div className="flex gap-3 w-full sm:w-auto mt-4 sm:mt-0">
            {/* <Button
              variant="outline"
              className="text-sm flex-1 sm:flex-none border-border rounded-md text-foreground font-medium h-10"
            >
              Filter
            </Button> */}
            {/* <Button
              variant="outline"
              className="text-sm flex-1 sm:flex-none border-border rounded-md text-foreground font-medium h-10"
            >
              Export CSV
            </Button> */}
          </div>
        </CardHeader>

        <div className="overflow-x-auto px-6 pb-4 w-full">
          <Table>
            <TableHeader className="bg-slate-50 dark:bg-muted/50 border-t border-b border-border">
              <TableRow className="hover:bg-transparent border-none">
                <TableHead className="text-sm font-bold text-slate-500 dark:text-slate-400 w-[300px] h-14 pl-6">
                  Item & SKU
                </TableHead>
                <TableHead className="text-sm font-bold text-slate-500 dark:text-slate-400 h-14">
                  Category
                </TableHead>
                <TableHead className="text-sm font-bold text-slate-500 dark:text-slate-400 h-14">
                  Stock Level
                </TableHead>
                <TableHead className="text-sm font-bold text-slate-500 dark:text-slate-400 h-14">
                  Valuation
                </TableHead>
                <TableHead className="text-sm font-bold text-slate-500 dark:text-slate-400 h-14">
                  Expiry
                </TableHead>
                <TableHead className="text-sm font-bold text-slate-500 dark:text-slate-400 text-right h-14 pr-6">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    Loading inventory...
                  </TableCell>
                </TableRow>
              ) : filteredStocks.length > 0 ? (
                filteredStocks.map((item) => (
                  <TableRow
                    key={item.stockId}
                    className={`hover:bg-muted/30 transition-colors border-b border-border  ${item.expiry === "Expired"
                      ? "bg-red-50 "
                      : ""
                      }`}
                  // className="hover:bg-muted/30 transition-colors border-b border-border"
                  >
                    <TableCell className="py-3 pl-3">
                      <div className="font-bold text-[15px] text-foreground">
                        {item.itemName}
                      </div>
                      <div className="text-xs text-muted-foreground font-medium mt-1">
                        {item.skuId || item.batchNumber || "N/A"}
                      </div>
                    </TableCell>

                    <TableCell className="py-3">
                      <Badge
                        variant="secondary"
                        className="bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300 rounded-full text-[10px] font-bold uppercase tracking-wider py-1 px-3 border-none"
                      >
                        {item.categoryName}
                      </Badge>
                    </TableCell>

                    <TableCell className="py-3">
                      <div className="w-[120px]">
                        <div className="font-bold text-[13px] text-foreground mb-1.5 flex items-center">
                          {item.quantity} / {item.maxQuantity || (item.quantity > 50 ? 100 : item.quantity > 10 ? 20 : 10)} {item.unit}
                        </div>
                        <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${item.expiry === "Expired"
                                ? "bg-red-600 dark:bg-red-500"
                                : "bg-slate-800 dark:bg-slate-200"
                              }`}
                            // className="h-full bg-slate-800 dark:bg-slate-200 rounded-full"
                            style={{ width: `${Math.min(100, Math.max(0, (item.quantity / (item.maxQuantity || (item.quantity > 50 ? 100 : item.quantity > 10 ? 20 : 10))) * 100))}%` }}
                          />
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="py-3">
                      <div className="font-bold text-[14px] text-slate-800 dark:text-slate-100">
                        {formatCurrency(item.unitCost)}
                        <span className="font-medium text-[12px] text-slate-400">
                          {" "} / {item.unit === 'g' || item.unit === 'kg' ? 'Kg' : 'Unit'}
                        </span>
                      </div>
                      <div className="text-[13px] text-slate-400 font-medium mt-0.5">
                        {formatCurrency(item.totalValue)} Total
                      </div>
                    </TableCell>


                    <TableCell className="py-3">
                      <span
                        className={`text-[13px] ${item.expiry === "Expired"
                          ? "text-red-600 dark:text-red-400 "
                          : "text-slate-800 dark:text-slate-100"
                          }`}
                      // className={`text-[13px]  text-slate-800 dark:text-slate-100 ${item.expiry === "Expired" ? "text-red-600 dark:text-red-400 font-bold" : ""}`}
                      >
                        <b>{item.expiry}</b> <br />
                        {item.expiryDate}
                      </span>
                    </TableCell>

                    <TableCell className="py-3 text-right pr-6">
                      <div className="flex items-center justify-end gap-3">
                        <button
                          type="button"
                          onClick={() => navigate(`/chef/inventory/details/${item.stockId}/edit`, { state: { stockData: item } })}
                          className="p-1.5 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted"
                        >
                          <Edit2 className="w-[18px] h-[18px]" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(item.stockId)}
                          className="p-1.5 text-muted-foreground hover:text-red-500 transition-colors rounded-lg hover:bg-muted"
                        >
                          <Trash2 className="w-[18px] h-[18px]" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No inventory data found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex justify-between items-center px-6 py-5 border-t border-border bg-transparent">
          <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">
            Showing {filteredStocks.length > 0 ? 1 : 0} to {filteredStocks.length} data   
            {/* Showing {filteredStocks.length > 0 ? 1 : 0} to {filteredStocks.length} of {filteredStocks.length} items */}
          </span>

          <Pagination className="!justify-end">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className={"cursor-not-allowed pointer-events-none opacity-50"}
                />
              </PaginationItem>

              <PaginationItem>
                <PaginationLink
                  href="#"
                  isActive={true}
                  onClick={(e) => e.preventDefault()}
                >
                  1
                </PaginationLink>
              </PaginationItem>

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className={"cursor-not-allowed pointer-events-none opacity-50"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </Card>
    </div>
  );
}
