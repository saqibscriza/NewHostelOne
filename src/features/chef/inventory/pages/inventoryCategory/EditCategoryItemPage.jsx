import React from 'react';
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

export default function EditCategoryItemPage() {
  const navigate = useNavigate();

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-10">
      <div>
        <h1 className="text-3xl font-bold text-foreground tracking-tight">Edit Item Details</h1>
        <p className="text-muted-foreground mt-1 text-sm">Update specifications and stock parameters for Fresh Whole Milk.</p>
      </div>

      <Card className="border-border shadow-sm rounded-2xl bg-card">
        <CardContent className="p-8 space-y-8">
          <h2 className="text-xl font-bold text-foreground">Dairy Category Item</h2>
          
          <div className="space-y-6">
            <div className="space-y-3">
              <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Item Name</Label>
              <Input 
                defaultValue="Fresh Whole Milk" 
                className="bg-transparent border-border rounded-xl h-11 text-foreground"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Category</Label>
                <Select defaultValue="dairy">
                  <SelectTrigger className="w-full bg-transparent border-border rounded-xl h-11 text-foreground">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dairy">Dairy</SelectItem>
                    <SelectItem value="protein">Protein</SelectItem>
                    <SelectItem value="vegetables">Vegetables</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-3">
                <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">SKU ID</Label>
                <Input 
                  defaultValue="MK-DAI-001" 
                  className="bg-transparent border-border rounded-xl h-11 text-foreground"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-4 pt-4">
              <Button className="bg-[#0f1419] dark:bg-white dark:text-black hover:bg-[#272c30] dark:hover:bg-gray-100 text-white rounded-xl h-11 px-8 shadow-sm">
                Update
              </Button>
              <Button 
                variant="secondary" 
                className="h-11 px-8 rounded-xl bg-muted hover:bg-muted/80 text-foreground font-semibold"
                onClick={() => navigate(-1)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
