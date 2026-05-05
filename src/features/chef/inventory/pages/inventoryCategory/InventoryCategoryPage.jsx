import React from 'react';
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
import { Link } from 'react-router-dom';
import { Card, CardContent } from '../../../../../components/ui/Card';
import { Button } from '../../../../../components/ui/button';
import {getAllInventoryCategoryApi} from '../../../../../utils/utils';


export default function InventoryCategoryPage() {
  const categories = [
    { id: 1, name: "Dairy", skus: 12, icon: Egg },
    { id: 2, name: "Grains & Cereals", skus: 24, icon: Wheat },
    { id: 3, name: "Vegetables", skus: 48, icon: Apple },
    { id: 4, name: "Spices", skus: 65, icon: Flame },
    { id: 5, name: "Meat & Poultry", skus: 18, icon: Fish },
    { id: 6, name: "Cleaning Supplies", skus: 32, icon: Brush },
    { id: 7, name: "Bakery", skus: 15, icon: Croissant },
    { id: 8, name: "Beverages", skus: 42, icon: Coffee },
    { id: 9, name: "Dairy", skus: 12, icon: Egg },
    { id: 10, name: "Grains & Cereals", skus: 24, icon: Wheat },
    { id: 11, name: "Vegetables", skus: 48, icon: Apple },
    { id: 12, name: "Spices", skus: 65, icon: Flame }
  ];


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
        {categories.map((category) => {
          const IconComponent = category.icon || Egg;
          return (
            <Card key={category.id} className="border-none shadow-sm rounded-2xl bg-card ring-1 ring-border/50 hover:shadow-md transition-all">
              <CardContent className="p-6 flex flex-col items-start relative">
                <div className="flex items-center justify-between w-full mb-5">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300">
                    <IconComponent className="w-6 h-6 stroke-[1.5]" />
                  </div>
                  <div className="flex items-center gap-3">
                    <button className="text-slate-400 hover:text-red-500 transition-colors p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                      <Trash2 className="w-[18px] h-[18px]" />
                    </button>
                    <Link to={`/chef/inventory/category/${category.id}/edit`} className="text-slate-400 hover:text-foreground transition-colors p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                      <Edit2 className="w-[18px] h-[18px]" />
                    </Link>
                  </div>
                </div>
                <h3 className="text-[19px] font-bold text-foreground mb-1">{category.name}</h3>
                <p className="text-[13px] font-medium text-muted-foreground mb-7">{category.skus} SKUs tracked</p>
                <Button asChild variant="outline" className="w-full rounded-xl h-11 border-border/80 text-foreground font-semibold hover:bg-muted/50 transition-colors">
                  <Link to={`/chef/inventory/category/${category.id}`}>
                    View Items
                  </Link>
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between pt-4 border-t border-border mt-8">
        <span className="text-sm font-medium text-muted-foreground">Showing 1 to 12 of 24 categories</span>
        <div className="flex items-center gap-1.5">
          <button className="p-1.5 text-muted-foreground hover:text-foreground rounded-lg transition-colors">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#0f1419] dark:bg-white text-white dark:text-black text-sm font-bold shadow-sm">1</button>
          <button className="w-8 h-8 flex items-center justify-center rounded-lg text-foreground hover:bg-muted text-sm font-medium">2</button>
          <button className="w-8 h-8 flex items-center justify-center rounded-lg text-foreground hover:bg-muted text-sm font-medium">3</button>
          <span className="px-2 text-muted-foreground">...</span>
          <button className="w-8 h-8 flex items-center justify-center rounded-lg text-foreground hover:bg-muted text-sm font-medium">6</button>
          <button className="p-1.5 text-muted-foreground hover:text-foreground rounded-lg transition-colors">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
