import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Info, List, Plus, X } from 'lucide-react';
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

export default function AddCategoryItemPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState([
    { id: 1, name: '', sku: '' },
    { id: 2, name: '', sku: '' }
  ]);

  const handleAddItem = () => {
    setItems([...items, { id: Date.now(), name: '', sku: '' }]);
  };

  const handleRemoveItem = (idToRemove) => {
    setItems(items.filter(item => item.id !== idToRemove));
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-10">
      <div>
        <h1 className="text-3xl font-bold text-foreground tracking-tight">Add New Items</h1>
      </div>

      <div className="space-y-6">
        <Card className="border-border shadow-sm rounded-2xl bg-card">
          <CardContent className="p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Info className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-foreground">Category Details</h2>
            </div>
            
            <div className="pl-0 md:pl-14">
              <div className="space-y-3">
                <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Category Name</Label>
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
            </div>
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm rounded-2xl bg-card">
          <CardContent className="p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <List className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-foreground">Initial Items in Category</h2>
            </div>
            
            <div className="space-y-6 pl-0 md:pl-14">
              {items.map((item, index) => (
                <div key={item.id} className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-6 items-end relative">
                  <div className="space-y-3">
                    <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Item Name</Label>
                    <Input 
                      placeholder="Enter Item Name" 
                      className="bg-transparent border-border rounded-xl h-11 text-foreground"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">SKU ID</Label>
                    <Input 
                      placeholder="Enter SKU Id" 
                      className="bg-transparent border-border rounded-xl h-11 text-foreground"
                    />
                  </div>
                  {items.length > 1 && (
                    <button 
                      onClick={() => handleRemoveItem(item.id)}
                      className="h-11 w-11 flex items-center justify-center rounded-xl text-muted-foreground hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10 transition-colors"
                      title="Remove Item"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}

              <button 
                onClick={handleAddItem}
                className="text-blue-600 dark:text-blue-400 text-sm font-bold flex items-center gap-2 hover:underline mt-2"
              >
                <Plus className="w-4 h-4" /> ADD MORE ITEM
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Footer Actions */}
        <div className="flex justify-end gap-4 pt-4">
          <Button 
            variant="outline" 
            className="h-11 px-8 rounded-xl border-border text-foreground font-medium hover:bg-muted/50"
            onClick={() => navigate(-1)}
          >
            Cancel
          </Button>
          <Button className="bg-[#0f1419] dark:bg-white dark:text-black hover:bg-[#272c30] dark:hover:bg-gray-100 text-white rounded-xl h-11 px-8 shadow-sm">
            <Plus className="w-4 h-4 mr-2" /> Add New Item
          </Button>
        </div>
      </div>
    </div>
  );
}
