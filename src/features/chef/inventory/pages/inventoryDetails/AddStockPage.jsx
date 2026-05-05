import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../../../../../components/ui/Card';
import { Button } from '../../../../../components/ui/button';
import { Input } from '../../../../../components/ui/input';
import { Label } from '../../../../../components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../../components/ui/select";

export default function AddStockPage() {
  const navigate = useNavigate();

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-10">
      <div>
        <h1 className="text-3xl font-bold text-foreground tracking-tight">Add New Stock</h1>
        <p className="text-muted-foreground mt-1 text-sm">Record new arrivals of kitchen ingredients and supplies.</p>
      </div>

      <Card className="border-border shadow-sm rounded-2xl bg-card">
        <CardContent className="p-8 sm:p-10 space-y-12">
          
          {/* Section 1 */}
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center font-bold text-sm text-foreground">
                1
              </div>
              <h2 className="text-lg font-bold text-foreground">Ingredient Details</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-0 md:pl-12">
              <div className="space-y-3">
                <Label className="text-sm font-semibold text-foreground">Select Ingredient</Label>
                <Select>
                  <SelectTrigger className="w-full bg-transparent border-border rounded-xl h-11">
                    <SelectValue placeholder="Search or select ingredient..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="milk">Organic Whole Milk</SelectItem>
                    <SelectItem value="chicken">Chicken Breast</SelectItem>
                    <SelectItem value="rice">Jasmin Rice</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-1">Current stock levels will be updated automatically.</p>
              </div>
              <div className="space-y-3">
                <Label className="text-sm font-semibold text-foreground">Category</Label>
                <Input 
                  disabled 
                  placeholder="Auto-filled based on selection" 
                  className="bg-muted/30 border-border rounded-xl h-11"
                />
              </div>
            </div>
          </div>

          {/* Section 2 */}
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center font-bold text-sm text-foreground">
                2
              </div>
              <h2 className="text-lg font-bold text-foreground">Arrival & Expiry Information</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pl-0 md:pl-12">
              <div className="space-y-3">
                <Label className="text-sm font-semibold text-foreground">Quantity Received</Label>
                <div className="flex">
                  <Input 
                    type="number" 
                    placeholder="0.00" 
                    className="rounded-r-none border-r-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent border-border rounded-l-xl h-11"
                  />
                  <Select defaultValue="kg">
                    <SelectTrigger className="w-[80px] rounded-l-none bg-muted/30 border-border rounded-r-xl h-11 focus:ring-0 focus:ring-offset-0 border-l border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kg">kg</SelectItem>
                      <SelectItem value="L">L</SelectItem>
                      <SelectItem value="units">units</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-3">
                <Label className="text-sm font-semibold text-foreground">Batch Number</Label>
                <Input 
                  placeholder="e.g. BATCH-2024-001" 
                  className="bg-transparent border-border rounded-xl h-11"
                />
              </div>
              <div className="space-y-3">
                <Label className="text-sm font-semibold text-foreground">Expiry Date</Label>
                <Input 
                  type="date" 
                  className="bg-transparent border-border rounded-xl h-11 text-foreground block w-full"
                />
              </div>
            </div>
          </div>

          {/* Section 3 */}
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center font-bold text-sm text-foreground">
                3
              </div>
              <h2 className="text-lg font-bold text-foreground">Financial & Sourcing</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-0 md:pl-12">
              <div className="space-y-3">
                <Label className="text-sm font-semibold text-foreground">Unit Cost (₹)</Label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">₹</span>
                  <Input 
                    type="number" 
                    placeholder="0.00" 
                    className="pl-8 pr-12 bg-transparent border-border rounded-xl h-11"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium text-sm">INR</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex justify-end gap-4 pt-6 mt-10">
            <Button 
              variant="outline" 
              className="h-11 px-8 rounded-xl border-border text-foreground font-medium hover:bg-muted/50"
              onClick={() => navigate(-1)}
            >
              Cancel
            </Button>
            <Button className="bg-[#0f1419] dark:bg-white dark:text-black hover:bg-[#272c30] dark:hover:bg-gray-100 text-white rounded-xl h-11 px-8 shadow-sm">
              + Add to Inventory
            </Button>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}
