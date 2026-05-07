import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import { Search, Edit2, Trash2, ChevronLeft, ChevronRight,Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '../../../../../components/ui/Card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../../../components/ui/Table";
import { Badge } from '../../../../../components/ui/Badge';
import {getCategoryItemsByIdApi, deleteInventoryItemApi, } from '../../../../../utils/utils';

export default function CategoryDetailsPage() {
  const { id } = useParams(); // 🔥 URL se id mil rahi hai
  const [category, setCategory] = useState(null);
  const [items, setItems] = useState([]);
  const navigate = useNavigate();

    const getCategoryDetails = async () => {
    try {
      const res = await getCategoryItemsByIdApi(id);
      console.log("DETAIL:", res);

      // ✅ Correct extraction
      const categoryData = res.categoryDetails?.category;
      const itemsData = res.categoryDetails?.items;

      setCategory(categoryData);
      setItems(itemsData || []);
      
    } catch (error) {
      console.error("Error fetching category:", error);
    }
  };

  useEffect(() => {
    getCategoryDetails();
  }, [id]);


  const handleDeleteItem = async (itemId) => {
    console.log('DELETE FUNCTION CALLED:', itemId);
  
    try {
      const res = await deleteInventoryItemApi(itemId);
      console.log('DELETE RESPONSE:', res);
  
      if (res?.status === 'success') {
        await getCategoryDetails();
      } else {
        setError(res?.message || 'Failed to delete item.');
      }
    } catch (error) {
      console.error('Error deleting item:', error);
      setError('Failed to delete item.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-10">
      <div>
        <h1 className="text-3xl font-bold text-foreground tracking-tight">
            "{category?.categoryName} Category Item Details"
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          View and update all {category?.categoryName} category item information
        </p>
      </div>

      <Card className="border border-border shadow-sm rounded-2xl overflow-hidden bg-card">
<div className="p-6 border-b border-border">
  <div className="flex items-center justify-between gap-4">
    
    {/* Search Input */}
    <div className="relative w-full max-w-md">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
      <input
        type="text"
        placeholder="Search dairy products, SKUs..."
        className="w-full bg-muted/40 border-none text-foreground text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-foreground py-2.5 pl-10 pr-4"
      />
    </div>

    {/* Add Button */}
    <button onClick={() => navigate(`/chef/inventory/category/${id}/item/add`)}
     className="bg-black text-white text-sm font-semibold px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-gray-800 transition">
      <Plus className="w-4 h-4" />
      ADD MORE ITEM
    </button>

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
                <TableRow key={index.id} className="border-border hover:bg-muted/30 transition-colors">
                  <TableCell className="pl-6 py-5">
                     <span className="font-bold text-[15px] text-foreground">{item.itemName}</span>
                  </TableCell>
                  <TableCell className="py-5">
                    <Badge variant="secondary" className="bg-muted text-muted-foreground font-semibold rounded-md px-2 py-0.5 pointer-events-none hover:bg-muted">
                      {item.skuId}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-5 text-right pr-6">
                    <Link to={`/chef/inventory/category/${item.categoryId}/item/${item.id}/edit`} className="inline-flex text-muted-foreground hover:text-foreground transition-colors p-2 rounded-lg hover:bg-muted">
                      <Edit2 className="w-4 h-4" />
                    </Link>

                          <button
                          type="button"
                          onClick={() => handleDeleteItem(item.id)}
                          className="inline-flex text-muted-foreground hover:text-red-500 transition-colors p-2 rounded-lg hover:bg-muted"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
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
