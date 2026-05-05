import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from "react-router-dom";
import { Upload, Search, Plus, Edit2, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '../../../../../components/ui/Card';
import { Button } from '../../../../../components/ui/button';
import { Input } from '../../../../../components/ui/input';
import { Label } from '../../../../../components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../../../components/ui/Table";
import { Badge } from '../../../../../components/ui/Badge';
import { getCategoryItemsByIdApi } from '../../../../../utils/utils';
import { updateInventoryCategoryApi } from '../../../../../utils/utils';

export default function EditCategoryPage() {
  const { id } = useParams(); // 🔥 URL se id
  const navigate = useNavigate();

  const [iconFileName, setIconFileName] = useState('');
  const [iconFile, setIconFile] = useState(null);
  const [items, setItems] = useState([]);

  const [formData, setFormData] = useState({
  categoryName: "",
  status: true
});

const getCategoryDetails = async () => {
  try {
    const res = await getCategoryItemsByIdApi(id);
    console.log("EDIT DATA:", res);
    const category = res.categoryDetails?.category;
    const itemsData = res.categoryDetails?.items;
    // Category form data set
    setFormData({
      categoryName: category?.categoryName || "",
      status: category?.status ?? true
    });
    // Items set
    setItems(itemsData || []);

  } catch (error) {
    console.error("Error fetching category:", error);
  }
};
useEffect(() => {
  getCategoryDetails();
}, [id]);

  const updateCategory = async () => {
    try {
      const form = new FormData();
      form.append("categoryName", formData.categoryName);
      form.append("status", formData.status);
      if (iconFile) {
        form.append("icon", iconFile); // backend field name confirm kar lena
      }
      const res = await updateInventoryCategoryApi(id, form);
      if (res?.status === "success") {
        console.log("Category updated successfully");
        navigate(-1);
      } else {
        console.error("Failed to update category:", res);
      }
    } catch (error) {
      console.error("Error updating category:", error);
    }
  };
  

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-10">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground tracking-tight">
          Edit Category
        </h1>
      </div>

      {/* Category Item Section */}
      <Card className="border-border shadow-sm rounded-2xl bg-card">
        <CardContent className="p-8 space-y-8">
          <h2 className="text-xl font-bold text-foreground">Category Item</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Category Name</Label>
  <Input 
  value={formData.categoryName}
  onChange={(e) =>
    setFormData({ ...formData, categoryName: e.target.value })
  }
  className="bg-transparent border-border rounded-xl h-11 text-foreground"
/>
            </div>

            <div className="space-y-3">
              <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Primary Icon
              </Label>
              <div
                className="relative cursor-pointer"
                onClick={() => document.getElementById("icon-upload")?.click()}
              >
                <Input 
                  value={iconFileName}
                  placeholder="Upload Icon"
                  className="bg-transparent border-border rounded-xl h-11 pr-10 cursor-pointer"
                />
              <input
                  type="file"
                  id="icon-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setIconFile(file); // ✅ IMPORTANT FIX
                      setIconFileName(file.name);
                    }
                  }}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors pointer-events-none">
                  <Upload className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 pt-2">
            <Button 
            className="bg-[#0f1419] dark:bg-white dark:text-black hover:bg-[#272c30] dark:hover:bg-gray-100 text-white rounded-xl h-11 px-8 shadow-sm"
            onClick={updateCategory}
            >
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
        </CardContent>
      </Card>

      {/* Item Details Section */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-6">
          Item Details
        </h2>

        <Card className="border border-border shadow-sm rounded-2xl overflow-hidden bg-card">
          {/* Controls: Search and Add New */}
          <div className="p-6 border-b border-border flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full max-w-md">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-muted-foreground" />
              </div>
              <Input
                type="text"
                placeholder="Search dairy products, SKUs..."
                className="pl-10 bg-muted/50 border-none rounded-xl h-11"
              />
            </div>
            
            <Button asChild className="w-full sm:w-auto bg-[#0f1419] dark:bg-white dark:text-black hover:bg-[#272c30] dark:hover:bg-gray-100 text-white rounded-xl h-11 px-6 shadow-sm">
              <Link to="/chef/inventory/category/1/item/add" className='flex items-center'>
                <Plus className="w-4 h-4 mr-2" />
                Add New Item
              </Link>
            </Button>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/10 border-b border-border text-xs uppercase tracking-wider">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="font-bold text-muted-foreground h-14 pl-6">
                    ITEM DETAILS
                  </TableHead>
                  <TableHead className="font-bold text-muted-foreground h-14 w-[30%]">
                    SKU IDENTIFIER
                  </TableHead>
                  <TableHead className="font-bold text-muted-foreground h-14 text-right pr-6 w-[20%]">
                    ACTIONS
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
                      <div className="font-bold text-[15px] text-foreground">{item.itemName}</div>
                    </TableCell>
                    <TableCell className="py-5">
                      <Badge variant="secondary" className="bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-300 rounded font-mono text-[11px] font-bold py-1 px-2">
                        {item.skuId}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-5 text-right pr-6">
                      <div className="flex items-center justify-end gap-3">
                        <Link to={`/chef/inventory/category/${id}/item/${item.id}/edit`} className="text-muted-foreground hover:text-foreground transition-colors p-2 rounded-lg hover:bg-muted">
                          <Edit2 className="w-[18px] h-[18px]" />
                        </Link>
                        <button className="text-muted-foreground hover:text-red-500 transition-colors p-2 rounded-lg hover:bg-muted">
                          <Trash2 className="w-[18px] h-[18px]" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 border-t border-border bg-transparent gap-4">
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
    </div>
  );
}
