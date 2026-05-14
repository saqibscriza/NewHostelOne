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
import { Link } from "react-router-dom";
import { getInventoryStockDashboardApi, deleteStockApi } from "../../../../../utils/utils";

export default function InventoryDetailsPage() {
  const [dashboard, setDashboard] = useState({
    totalInventoryValue: 0,
    lowStockAlerts: 0,
    wastagePercent: 0,
    expiringSoon: 0,
  });
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
        <Card className="border-border shadow-sm rounded-2xl bg-card">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                Total Inventory Value
              </p>
              <div className="p-2 bg-muted rounded-xl">
                <Wallet className="w-5 h-5 text-foreground" />
              </div>
            </div>
            <h3 className="text-3xl font-bold text-foreground">
              {formatCurrency(dashboard.totalInventoryValue)}
            </h3>
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm rounded-2xl bg-card">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                Low Stock Alerts
              </p>
              <div className="p-2 bg-muted rounded-xl">
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

        <Card className="border-border shadow-sm rounded-2xl bg-card">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                Monthly Wastage %
              </p>
              <div className="p-2 bg-muted rounded-xl">
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

        <Card className="border-border shadow-sm rounded-2xl bg-card">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                Expiring Soon
              </p>
              <div className="p-2 bg-muted rounded-xl">
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

      <Card className="border-border shadow-sm rounded-2xl bg-card">
        <CardContent className="p-4 flex flex-col sm:flex-row items-center gap-4">
          <span className="text-sm font-medium text-foreground whitespace-nowrap">
            Filter by:
          </span>

          <Select defaultValue="all-location">
            <SelectTrigger className="w-full sm:w-[150px] bg-muted/30 border-border rounded-xl">
              <SelectValue placeholder="All Location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-location">All Location</SelectItem>
            </SelectContent>
          </Select>

          <Select defaultValue="all-category">
            <SelectTrigger className="w-full sm:w-[150px] bg-muted/30 border-border rounded-xl">
              <SelectValue placeholder="All Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-category">All Category</SelectItem>
            </SelectContent>
          </Select>

          <Select defaultValue="all-status">
            <SelectTrigger className="w-full sm:w-[150px] bg-muted/30 border-border rounded-xl">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-status">All Status</SelectItem>
            </SelectContent>
          </Select>

          <button className="text-sm font-medium text-foreground hover:underline sm:ml-auto mt-2 sm:mt-0">
            Clear all filters
          </button>
        </CardContent>
      </Card>

      <Card className="border border-border shadow-sm rounded-2xl overflow-hidden bg-card">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 border-b border-border">
          <CardTitle className="text-xl font-bold text-foreground">
            Inventory Details
          </CardTitle>
          <div className="flex gap-3 w-full sm:w-auto mt-4 sm:mt-0">
            {/* <Button
              variant="outline"
              className="text-sm flex-1 sm:flex-none border-border rounded-xl text-foreground font-medium h-10"
            >
              Filter
            </Button> */}
            {/* <Button
              variant="outline"
              className="text-sm flex-1 sm:flex-none border-border rounded-xl text-foreground font-medium h-10"
            >
              Export CSV
            </Button> */}
          </div>
        </CardHeader>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-transparent border-b border-border">
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-sm font-semibold text-muted-foreground w-[300px] h-14 pl-6">
                  Item & SKU
                </TableHead>
                <TableHead className="text-sm font-semibold text-muted-foreground h-14">
                  Category
                </TableHead>
                <TableHead className="text-sm font-semibold text-muted-foreground h-14">
                  Stock Level
                </TableHead>
                <TableHead className="text-sm font-semibold text-muted-foreground h-14">
                  Valuation
                </TableHead>
                <TableHead className="text-sm font-semibold text-muted-foreground h-14">
                  Expiry
                </TableHead>
                <TableHead className="text-sm font-semibold text-muted-foreground text-center h-14 pr-6">
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
              ) : stocks.length > 0 ? (
                stocks.map((item) => (
                  <TableRow
                    key={item.stockId}
                    className="border-border hover:bg-muted/30 transition-colors"
                  >
                    <TableCell className="pl-6 py-5">
                      <div className="font-bold text-[15px] text-foreground">
                        {item.itemName}
                      </div>
                      <div className="text-xs text-muted-foreground font-medium mt-1">
                        {item.skuId || item.batchNumber || "N/A"}
                      </div>
                    </TableCell>

                    <TableCell className="py-5">
                      <Badge
                        variant="outline"
                        className="bg-muted text-foreground border-border text-[10px] font-bold uppercase tracking-wider py-1 px-3"
                      >
                        {item.categoryName}
                      </Badge>
                    </TableCell>

                    <TableCell className="py-5">
                      <div className="font-bold text-[14px] text-foreground">
                        {item.quantity}{" "}
                        <span className="font-medium text-xs text-muted-foreground">
                          {item.unit}
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground font-medium mt-1">
                        Batch: {item.batchNumber}
                      </div>
                    </TableCell>

                    <TableCell className="py-5">
                      <div className="font-bold text-[14px] text-foreground">
                        {formatCurrency(item.unitCost)}
                        <span className="font-medium text-xs text-muted-foreground">
                          {" "} / unit
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground font-medium mt-1 uppercase tracking-wide">
                        {formatCurrency(item.totalValue)} total
                      </div>
                    </TableCell>

                    <TableCell className="py-5">
                      <span className="text-sm font-bold text-foreground">
                        {item.expiry}
                      </span>
                      <div className="text-xs text-muted-foreground mt-1">
                        {item.expiryDate}
                      </div>
                    </TableCell>

                    <TableCell className="py-5 text-center pr-6">
                      <div className="flex items-center justify-center gap-4">
                        <button
                          type="button"
                          className="text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(item.stockId)}
                          className="text-muted-foreground hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
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

        <div className="flex items-center justify-between px-6 py-5 border-t border-border bg-transparent">
          <span className="text-sm font-medium text-muted-foreground">
            Showing {stocks.length > 0 ? 1 : 0} to {stocks.length} of {stocks.length} items
          </span>
          <div className="flex items-center gap-1.5">
            <button type="button" className="p-1.5 text-muted-foreground hover:text-foreground rounded-lg transition-colors">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button type="button" className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#0f1419] dark:bg-white text-white dark:text-black text-sm font-bold shadow-sm">
              1
            </button>
            <button type="button" className="p-1.5 text-muted-foreground hover:text-foreground rounded-lg transition-colors">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}
