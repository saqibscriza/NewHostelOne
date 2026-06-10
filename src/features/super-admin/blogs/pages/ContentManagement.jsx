import React, { useState } from "react";
import { ImagePlus, Pencil, Trash2 } from "lucide-react";
import { Card, CardContent } from "../../../../components/ui/Card";
import { Button } from "../../../../components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "../../../../components/ui/dialog";

export default function ContentManagement() {
  const [activeTab, setActiveTab] = useState("categories");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const categories = [
    {
      id: 1,
      image: "src", // usually you'd pass a placeholder image url here
      name: "Industry News",
      slug: "industry-news",
      posts: 24,
    },
    {
      id: 2,
      image: "src",
      name: "Product Updates",
      slug: "product-updates",
      posts: 12,
    },
    {
      id: 3,
      image: "src",
      name: "Case Studies",
      slug: "case-studies",
      posts: 8,
    },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] p-8 space-y-8 pb-10">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#0f172a] tracking-tight">Content Management</h1>
        <p className="text-slate-500 mt-2 text-[15px] font-medium">
          Configure blog categories and manage contributing authors.
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200">
        <div className="flex gap-8">
          <button
            onClick={() => setActiveTab("categories")}
            className={`pb-4 text-[16px] font-semibold transition-colors ${
              activeTab === "categories"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Categories
          </button>
          {/* <button
            onClick={() => setActiveTab("authors")}
            className={`pb-4 text-[16px] font-semibold transition-colors ${
              activeTab === "authors"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Authors
          </button> */}
        </div>
      </div>

      {activeTab === "categories" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Add New Category Form */}
          <Card className="rounded-xl border-slate-200 shadow-sm bg-white lg:col-span-1">
            <CardContent className="p-6 space-y-6">
              <h2 className="text-xl font-bold text-slate-800">Add New Category</h2>

              <div className="space-y-1.5">
                <label className="text-[14px] font-semibold text-slate-700">Category Image</label>
                <div className="border-2 border-dashed border-slate-300 rounded-xl bg-slate-50 p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-100 transition-colors">
                  <ImagePlus className="w-6 h-6 text-slate-400 mb-2" />
                  <span className="text-[13px] font-medium text-slate-500">Upload or drag an image</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[14px] font-semibold text-slate-700">Category Name</label>
                <input
                  type="text"
                  placeholder="e.g. Technology"
                  className="w-full border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[14px] font-semibold text-slate-700">Slug</label>
                <input
                  type="text"
                  placeholder="e.g. technology"
                  className="w-full border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[14px] font-semibold text-slate-700">Meta Title</label>
                <input
                  type="text"
                  placeholder="enter title"
                  className="w-full border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[14px] font-semibold text-slate-700">Meta Description</label>
                <input
                  type="text"
                  placeholder="enter description"
                  className="w-full border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[14px] font-semibold text-slate-700">Meta Keywords</label>
                <input
                  type="text"
                  placeholder="enter keywords"
                  className="w-full border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[14px] font-semibold text-slate-700">Description</label>
                <textarea
                  placeholder="Brief category description..."
                  rows={4}
                  className="w-full border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all resize-none"
                />
              </div>

              <Button className="w-full bg-[#0052cc] hover:bg-[#0043a6] text-white py-2.5 rounded-lg font-semibold text-[15px] h-auto">
                Create Category
              </Button>
            </CardContent>
          </Card>

          {/* Categories List */}
          <div className="lg:col-span-2 space-y-4">
             <div className="bg-[#eef2f6] rounded-t-xl grid grid-cols-12 gap-4 px-6 py-4 items-center border border-[#e2e8f0] border-b-0">
                 <div className="col-span-2 text-[15px] font-bold text-[#1e293b]">Image</div>
                 <div className="col-span-3 text-[15px] font-bold text-[#1e293b]">Name</div>
                 <div className="col-span-3 text-[15px] font-bold text-[#1e293b]">Slug</div>
                 <div className="col-span-2 text-[15px] font-bold text-[#1e293b]">Posts</div>
                 <div className="col-span-2 text-[15px] font-bold text-[#1e293b] text-right">Actions</div>
             </div>
              <div className="bg-white rounded-b-xl border border-[#e2e8f0] border-t-0 -mt-4 shadow-sm flex flex-col">
                {categories.map((cat, index) => (
                  <div key={cat.id} className={`grid grid-cols-12 gap-4 px-6 py-5 items-center ${index !== categories.length - 1 ? 'border-b border-[#e2e8f0]' : ''}`}>
                    <div className="col-span-2">
                       <div className="w-12 h-12 bg-slate-100 rounded-lg border border-slate-200 flex items-center justify-center p-2">
                           <div className="flex gap-0.5 items-end justify-center h-full text-blue-600 w-full opacity-60">
                               <div className="w-2 h-2 bg-blue-500 rounded-sm"></div>
                               <div className="w-2 h-3 bg-blue-500 rounded-sm"></div>
                               <div className="w-2 h-4 bg-blue-500 rounded-sm"></div>
                           </div>
                       </div>
                    </div>
                    <div className="col-span-3 font-bold text-[15px] text-slate-800">{cat.name}</div>
                    <div className="col-span-3 text-[15px] text-slate-600 font-medium">{cat.slug}</div>
                    <div className="col-span-2">
                       <div className="inline-flex flex-col items-start justify-center bg-slate-200 text-slate-800 text-[13px] font-bold px-3.5 py-1.5 rounded-xl leading-tight">
                           <span>{cat.posts}</span>
                           <span className="text-[11px] font-semibold">Posts</span>
                       </div>
                    </div>
                    <div className="col-span-2 flex items-center justify-end gap-2 flex-wrap sm:flex-nowrap">
                       <button
                           className="text-[#0052cc] hover:bg-blue-50 p-2 rounded-lg transition-colors"
                           onClick={() => {
                               setEditingCategory(cat);
                               setIsEditDialogOpen(true);
                           }}
                       >
                           <Pencil className="w-[18px] h-[18px]" />
                       </button>
                       <button className="text-[#dc2626] hover:bg-red-50 p-2 rounded-lg transition-colors">
                           <Trash2 className="w-[18px] h-[18px]" />
                       </button>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        </div>
      )}

      {/* Edit Category Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md p-0 gap-0 overflow-hidden bg-white border-none rounded-xl shadow-2xl">
          <DialogHeader className="px-6 py-4 flex flex-row items-center justify-between border-b border-slate-100 bg-white m-0">
            <DialogTitle className="text-lg font-bold text-[#0f172a] m-0">Edit Category</DialogTitle>
          </DialogHeader>
          
          <div className="px-6 py-6 space-y-5 bg-white">
            <div className="space-y-1.5">
              <label className="text-[14px] font-semibold text-slate-700">Category Name</label>
              <input
                type="text"
                defaultValue={editingCategory?.name}
                className="w-full border border-slate-300 rounded-lg px-3.5 py-2.5 text-[15px] font-medium focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all text-slate-900"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[14px] font-semibold text-slate-700">Slug</label>
              <input
                type="text"
                defaultValue={editingCategory?.slug}
                className="w-full border border-slate-300 rounded-lg px-3.5 py-2.5 text-[15px] font-medium focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all text-slate-900"
              />
            </div>


            <div className="space-y-1.5">
              <label className="text-[14px] font-semibold text-slate-700">Meta Title</label>
              <input
                type="text"
                defaultValue={editingCategory?.metaTitle}
                className="w-full border border-slate-300 rounded-lg px-3.5 py-2.5 text-[15px] font-medium focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all text-slate-900"
              />
            </div>


            <div className="space-y-1.5">
              <label className="text-[14px] font-semibold text-slate-700">Meta Description</label>
              <input
                type="text"
                defaultValue={editingCategory?.metaDescription}
                className="w-full border border-slate-300 rounded-lg px-3.5 py-2.5 text-[15px] font-medium focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all text-slate-900"
              />
            </div>


            <div className="space-y-1.5">
              <label className="text-[14px] font-semibold text-slate-700">Meta Keywords </label>
              <input
                type="text"
                defaultValue={editingCategory?.metaKeywords}
                className="w-full border border-slate-300 rounded-lg px-3.5 py-2.5 text-[15px] font-medium focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all text-slate-900"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[14px] font-semibold text-slate-700">Description</label>
              <textarea
                defaultValue="Latest updates and insights from across the industry."
                rows={4}
                className="w-full border border-slate-300 rounded-lg px-3.5 py-2.5 text-[15px] font-medium focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all resize-none text-slate-900"
              />
            </div>
          </div>

          <DialogFooter className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3 rounded-b-xl m-0">
            <Button
              variant="ghost"
              className="font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-200"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button className="bg-[#0052cc] hover:bg-[#0043a6] text-white font-semibold">
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}