import React from 'react';
import { 
  Building2, 
  Package, 
  AlertTriangle, 
  Trash2,
  ChevronDown,
  Edit2,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Wallet
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../../components/ui/Card';
import { Button } from '../../../../../components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../../../components/ui/table";
import { Badge } from '../../../../../components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../../components/ui/select";
import { Link } from 'react-router-dom';


export default function InventoryDetailsPage() {

  const inventoryItems = [
    {
      id: 1,
      name: "Organic Whole Milk",
      sku: "SKU-MK - 2091",
      category: "DAIRY",
      stockCurrent: 12,
      stockMax: 100,
      stockUnit: "L",
      pricePerUnit: 1.45,
      totalValuation: 17.40,
      expiry: "2 Days",
    },
    {
      id: 2,
      name: "Chicken Breast (Bulk)",
      sku: "SKU-MK - 2091",
      category: "PROTEIN",
      stockCurrent: 85,
      stockMax: 100,
      stockUnit: "kg",
      pricePerUnit: 450,
      totalValuation: 45000,
      expiry: "14 Days",
    },
    {
      id: 3,
      name: "Jasmin Rice (25kg)",
      sku: "SKU-MK - 2091",
      category: "DRY GOODS",
      stockCurrent: 5,
      stockMax: 20,
      stockUnit: "Bags",
      pricePerUnit: 1450,
      totalValuation: 29000,
      expiry: "Stable",
    }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Inventory</h1>
          <p className="text-muted-foreground mt-1 text-sm">Operational stock oversight and supply chain management.</p>
        </div>
        <Button className="bg-[#0f1419] dark:bg-white dark:text-black hover:bg-[#272c30] dark:hover:bg-gray-100 text-white rounded-xl h-11 px-6 shadow-sm">
         <Link to="/chef/inventory/details/add">+ Add New Stock</Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Total Inventory Value */}
        <Card className="border-border shadow-sm rounded-2xl bg-card">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Total Inventory Value</p>
              <div className="p-2 bg-muted rounded-xl">
                <Wallet className="w-5 h-5 text-foreground" />
              </div>
            </div>
            <h3 className="text-3xl font-bold text-foreground">₹14,820.45</h3>
            <p className="flex items-center text-sm font-semibold text-foreground mt-2">
              <TrendingUp className="w-4 h-4 mr-1" />
              +4.2% from last month
            </p>
          </CardContent>
        </Card>

        {/* Low Stock Alerts */}
        <Card className="border-border shadow-sm rounded-2xl bg-card">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Low Stock Alerts</p>
              <div className="p-2 bg-muted rounded-xl">
                <AlertTriangle className="w-5 h-5 text-foreground" />
              </div>
            </div>
            <div className="flex items-end gap-2">
               <h3 className="text-3xl font-bold text-foreground">12</h3>
               <p className="text-xs font-bold uppercase tracking-widest text-foreground pb-1">Critical Items</p>
            </div>
            {/* Progress bar visual */}
            <div className="w-full bg-muted h-2 rounded-full mt-4 flex overflow-hidden">
               <div className="bg-foreground h-full" style={{ width: '35%' }}></div>
            </div>
          </CardContent>
        </Card>

        {/* Monthly Wastage % */}
        <Card className="border-border shadow-sm rounded-2xl bg-card">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Monthly Wastage %</p>
              <div className="p-2 bg-muted rounded-xl">
                <Trash2 className="w-5 h-5 text-foreground" />
              </div>
            </div>
            <div className="flex justify-between items-end">
              <div>
                <h3 className="text-3xl font-bold text-foreground">2.4%</h3>
                <p className="text-sm font-medium text-muted-foreground mt-2">Goal: &lt; 2.0%</p>
              </div>
              <div className="w-24 h-10 -mb-2">
                 {/* Sparkline SVG representation */}
                 <svg viewBox="0 0 100 30" className="w-full h-full stroke-foreground fill-none stroke-[2]" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M 0 20 C 10 18, 20 22, 30 18 S 50 15, 60 12 S 80 18, 100 5"></path>
                 </svg>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border-border shadow-sm rounded-2xl bg-card">
        <CardContent className="p-4 flex flex-col sm:flex-row items-center gap-4">
          <span className="text-sm font-medium text-foreground whitespace-nowrap">Filter by:</span>

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
              <SelectItem value="dairy">Dairy</SelectItem>
              <SelectItem value="protein">Protein</SelectItem>
              <SelectItem value="dry">Dry Goods</SelectItem>
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

      {/* Table Section */}
      <Card className="border border-border shadow-sm rounded-2xl overflow-hidden bg-card">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 border-b border-border">
          <CardTitle className="text-xl font-bold text-foreground">Inventory Details</CardTitle>
          <div className="flex gap-3 w-full sm:w-auto mt-4 sm:mt-0">
            <Button variant="outline" className="text-sm flex-1 sm:flex-none border-border rounded-xl text-foreground font-medium h-10">
              Filter
            </Button>
            <Button variant="outline" className="text-sm flex-1 sm:flex-none border-border rounded-xl text-foreground font-medium h-10">
              Export CSV
            </Button>
          </div>
        </CardHeader>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-transparent border-b border-border">
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-sm font-semibold text-muted-foreground w-[300px] h-14 pl-6">Item & SKU</TableHead>
                <TableHead className="text-sm font-semibold text-muted-foreground h-14">Category</TableHead>
                <TableHead className="text-sm font-semibold text-muted-foreground h-14">Stock Level</TableHead>
                <TableHead className="text-sm font-semibold text-muted-foreground h-14">Valuation</TableHead>
                <TableHead className="text-sm font-semibold text-muted-foreground h-14">Expiry</TableHead>
                <TableHead className="text-sm font-semibold text-muted-foreground text-center h-14 pr-6">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inventoryItems.map((item) => (
                <TableRow key={item.id} className="border-border hover:bg-muted/30 transition-colors">
                  <TableCell className="pl-6 py-5">
                     <div className="font-bold text-[15px] text-foreground">{item.name}</div>
                     <div className="text-xs text-muted-foreground font-medium mt-1">{item.sku}</div>
                  </TableCell>
                  <TableCell className="py-5">
                    <Badge variant="outline" className="bg-muted text-foreground border-border text-[10px] font-bold uppercase tracking-wider py-1 px-3">
                      {item.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-5">
                    <div className="space-y-2 max-w-[150px]">
                      <div className="flex justify-between items-center text-sm font-bold text-foreground">
                        <span>{item.stockCurrent} / {item.stockMax} <span className="font-medium text-xs">{item.stockUnit}</span></span>
                      </div>
                      <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-foreground rounded-full" 
                          style={{ width: `${(item.stockCurrent / item.stockMax) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-5">
                     <div className="font-bold text-[14px] text-foreground">
                       ₹{item.pricePerUnit.toLocaleString('en-IN', { maximumFractionDigits: 2, minimumFractionDigits: item.pricePerUnit % 1 === 0 ? 0 : 2 })} <span className="font-medium text-xs text-muted-foreground">/ {item.stockUnit === 'L' ? 'Unit' : item.stockUnit === 'kg' ? 'Kg' : 'Unit'}</span>
                     </div>
                     <div className="text-xs text-muted-foreground font-medium mt-1 uppercase tracking-wide">
                       ₹{item.totalValuation.toLocaleString('en-IN', { maximumFractionDigits: 2, minimumFractionDigits: item.totalValuation % 1 === 0 ? 0 : 2 })} <span className="lowercase">Total</span>
                     </div>
                  </TableCell>
                  <TableCell className="py-5">
                     <span className="text-sm font-bold text-foreground">{item.expiry}</span>
                  </TableCell>
                  <TableCell className="py-5 text-center pr-6">
                    <div className="flex items-center justify-center gap-4">
                      <button className="text-muted-foreground hover:text-foreground transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="text-muted-foreground hover:text-red-500 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination placeholder matching the design */}
        <div className="flex items-center justify-between px-6 py-5 border-t border-border bg-transparent">
          <span className="text-sm font-medium text-muted-foreground">Showing 1 to 4 of 24 items</span>
          <div className="flex items-center gap-1.5">
            <button className="p-1.5 text-muted-foreground hover:text-foreground rounded-lg transition-colors">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#0f1419] dark:bg-white text-white dark:text-black text-sm font-bold shadow-sm">1</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg text-foreground hover:bg-muted text-sm font-medium transition-colors">2</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg text-foreground hover:bg-muted text-sm font-medium transition-colors">3</button>
            <span className="text-muted-foreground px-1 font-medium">...</span>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg text-foreground hover:bg-muted text-sm font-medium transition-colors">6</button>
            <button className="p-1.5 text-muted-foreground hover:text-foreground rounded-lg transition-colors">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}
