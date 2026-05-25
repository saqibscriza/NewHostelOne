import React, {useEffect, useState } from "react";
import { 
  Plus,
  Wheat,
  Flame,
  Fish,
  Brush,
  Croissant,
  Coffee,
  Apple,
  Egg,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Edit2
} from 'lucide-react';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../../../../../components/ui/pagination";
import { Link } from 'react-router-dom';
import { Card, CardContent } from '../../../../../components/ui/Card';
import { Button } from '../../../../../components/ui/button';
import {getAllInventoryCategoryApi} from '../../../../../utils/utils';
import { deleteInventoryCategoryApi } from "../../../../../utils/utils";


export default function InventoryCategoryPage() {

const [categories, setCategories] = useState([]);
const [currentPage, setCurrentPage] = useState(1);
const itemsPerPage = 12;

// Get all categories from the API
const getAllCategories = async () => {
    try {
      const response = await getAllInventoryCategoryApi();
      console.log('Categories:', response);
      setCategories(response.categories || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };
  useEffect(() => {
    getAllCategories();
  }, []);

  //Delete category By Id
const deleteCategory = async (id) => {
  try {
    await deleteInventoryCategoryApi(id);
    setCategories(prev =>
      prev.filter((cat) => cat.category.id !== id)
    );
  } catch (error) {
    console.error('Error deleting category:', error);
  }
};


  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCategories = categories.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(categories.length / itemsPerPage);


  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Inventory Category</h1>
          <p className="text-muted-foreground mt-1 text-sm">Operational stock oversight and supply chain management.</p>
        </div>
        <Button asChild className="bg-[#0f1419] dark:bg-white dark:text-black hover:bg-[#272c30] dark:hover:bg-gray-100 text-white rounded-xl h-11 px-6 shadow-sm">
          <Link to="/chef/inventory/category/add" className="flex items-center">
            <Plus className="w-4 h-4 mr-2" />
            Add New Category
          </Link>
        </Button>
      </div>

      {/* Grid Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {currentCategories.map((catObj) => {
            const category = catObj.category;
            const items = catObj.items;

          return (
            <Card key={category.id} className="border-none shadow-sm rounded-2xl bg-card ring-1 ring-border/50 hover:shadow-md transition-all">
              <CardContent className="p-6 flex flex-col items-start relative">
                <div className="flex items-center justify-between w-full mb-5">
<div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
  {category.iconPath ? (
    <img
      src={category.iconPath}
      alt={category.categoryName}
      className="w-full h-full object-cover"
    />
  ) : (
    <span className="text-lg font-semibold text-slate-600 dark:text-slate-300 uppercase">
      {category.categoryName?.charAt(0)}
    </span>
  )}
</div>
                  <div className="flex items-center gap-3">
                    <button 
                      className="text-slate-400 hover:text-red-500 transition-colors p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                      onClick={() => deleteCategory(category.id)}
                    >
                      <Trash2 className="w-[18px] h-[18px]" />
                    </button>
                    <Link to={`/chef/inventory/category/${category.id}/edit`} className="text-slate-400 hover:text-foreground transition-colors p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                      <Edit2 className="w-[18px] h-[18px]" />
                    </Link>
                  </div>
                </div>
                <h3 className="text-[19px] font-bold text-foreground mb-1">{category.categoryName}</h3>
                <p className="text-[13px] font-medium text-muted-foreground mb-7">{category.skuCount} SKUs tracked</p>
<Link to={`/chef/inventory/category/${category.id}`}>
  <Button
    variant="outline"
    className="w-full rounded-xl h-11 border-border/80 text-foreground font-semibold hover:bg-muted/50 transition-colors"
  >
    View Items
  </Button>
</Link>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Pagination */}
      {totalPages > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between pt-4 border-t border-border mt-8 gap-4">
          <span className="text-sm font-medium text-muted-foreground">
            Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, categories.length)} of {categories.length} categories
          </span>
          <Pagination className="mx-0 w-auto">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
              
              {/* Logic for page numbers */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                if (
                  page === 1 ||
                  page === totalPages ||
                  (page >= currentPage - 1 && page <= currentPage + 1)
                ) {
                  return (
                    <PaginationItem key={page}>
                      <PaginationLink 
                        onClick={() => setCurrentPage(page)}
                        isActive={currentPage === page}
                        className="cursor-pointer"
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  );
                }
                
                if (
                  page === currentPage - 2 ||
                  page === currentPage + 2
                ) {
                  return (
                    <PaginationItem key={`ellipsis-${page}`}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  );
                }
                
                return null;
              })}

              <PaginationItem>
                <PaginationNext 
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}

