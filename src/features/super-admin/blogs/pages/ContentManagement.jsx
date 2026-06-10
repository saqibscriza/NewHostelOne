import React, { useEffect, useRef, useState } from "react";
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
import {   getAllBlogCategoriesApi,
  addBlogCategoryApi,
  updateBlogCategoryApi,
  deleteBlogCategoryApi, } from "../../../../utils/utils";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

export default function ContentManagement() {
  const [activeTab, setActiveTab] = useState("categories");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm();
  
  const { 
    register: registerEdit, 
    handleSubmit: handleSubmitEdit, 
    setValue: setEditValue, 
    reset: resetEdit,
    formState: { errors: editErrors } 
  } = useForm();
  
  // Watch meta title and description for character count display
  const watchMetaTitle = watch("metaTitle", "");
  const watchMetaDescription = watch("metaDescription", "");

  // Add form image state
  const [addImage, setAddImage] = useState(null);        // File object
  const [addImagePreview, setAddImagePreview] = useState(null); // Object URL
  const addImageInputRef = useRef(null);

  // Edit dialog image state
  const [editImage, setEditImage] = useState(null);
  const [editImagePreview, setEditImagePreview] = useState(null);
  const editImageInputRef = useRef(null);

  const handleSlugChange = (e) => {
    let value = e.target.value;

    value = value.replace(/[^A-Za-z0-9 -]/g, "");
    value = value.replace(/ /g, "-");
    value = value.replace(/-+/g, "-");

    setValue("slug", value);
  };

  const handleAddImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert("Image size must be under 2 MB.");
      return;
    }
    if (addImagePreview) URL.revokeObjectURL(addImagePreview);
    setAddImage(file);
    setAddImagePreview(URL.createObjectURL(file));
  };

  const removeAddImage = () => {
    if (addImagePreview) URL.revokeObjectURL(addImagePreview);
    setAddImage(null);
    setAddImagePreview(null);
    if (addImageInputRef.current) addImageInputRef.current.value = "";
  };

  const handleEditImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert("Image size must be under 2 MB.");
      return;
    }
    if (editImagePreview && !editImagePreview.startsWith("http")) URL.revokeObjectURL(editImagePreview);
    setEditImage(file);
    setEditImagePreview(URL.createObjectURL(file));
  };

  const removeEditImage = () => {
    if (editImagePreview && !editImagePreview.startsWith("http")) URL.revokeObjectURL(editImagePreview);
    setEditImage(null);
    setEditImagePreview(null);
    if (editImageInputRef.current) editImageInputRef.current.value = "";
  };

  const fetchCategories = async () => {
    try {
      setLoading(true);

      const res = await getAllBlogCategoriesApi();

      console.log("CATEGORIES API RESPONSE:", res);

      if (Array.isArray(res)) {
        // API returned array directly
        setCategories(res);
      } else if (Array.isArray(res?.data)) {
        // API returned { data: [...], ... }
        setCategories(res.data);
      } else {
        setCategories([]);
      }
    } catch (error) {
      console.error("GET CATEGORIES ERROR:", error);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

useEffect(() => {
  fetchCategories();
}, []);

const onSubmit = async (data) => {
  try {
    const formData = new FormData();

    formData.append("name", data.name);
    formData.append("slug", data.slug);
    formData.append("heading", data.heading || "");
    formData.append("description", data.description || "");
    formData.append("altText", data.altText || "");
    formData.append("metaTitle", data.metaTitle || "");
    formData.append("metaDescription", data.metaDescription || "");
    formData.append("metaKeywords", data.metaKeywords || "");

    if (addImage) {
      formData.append("image", addImage);
    }
    
    const res = await addBlogCategoryApi(formData);

    if (res?.status === "success") {
      toast.success("Category created successfully");
      reset(); // Reset form fields
      removeAddImage();
      fetchCategories();
    } else {
      toast.error(res?.message || "Failed to create category");
    }
  } catch (error) {
    console.error(error);
    toast.error("An error occurred while creating category");
  }
};

const onEditSubmit = async (data) => {
  try {
    const id = editingCategory?._id || editingCategory?.categoryId || editingCategory?.id;
    if (!id) {
      toast.error("Category ID is missing");
      return;
    }

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("slug", data.slug);
    formData.append("heading", data.heading || "");
    formData.append("description", data.description || "");
    formData.append("altText", data.altText || "");
    formData.append("metaTitle", data.metaTitle || "");
    formData.append("metaDescription", data.metaDescription || "");
    formData.append("metaKeywords", data.metaKeywords || "");

    if (editImage) {
      formData.append("image", editImage);
    }

    const res = await updateBlogCategoryApi(id, formData);

    if (res?.status === "success") {
      toast.success("Category updated successfully");
      setIsEditDialogOpen(false);
      fetchCategories();
    } else {
      toast.error(res?.message || "Failed to update category");
    }
  } catch (error) {
    console.error(error);
    toast.error("An error occurred while updating category");
  }
};

const handleDeleteCategory = (id) => {
  toast((t) => (
    <div className="flex flex-col gap-3">
      <span className="text-[14px] font-semibold text-slate-800">
        Are you sure you want to delete this category?
      </span>
      <div className="flex gap-2 justify-end">
        <button
          className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-3 py-1.5 rounded-md text-[13px] font-medium transition-colors"
          onClick={() => toast.dismiss(t.id)}
        >
          Cancel
        </button>
        <button
          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-md text-[13px] font-medium transition-colors"
          onClick={async () => {
            toast.dismiss(t.id);
            try {
              const res = await deleteBlogCategoryApi(id);
              if (res?.status === "success") {
                toast.success("Category deleted successfully");
                fetchCategories();
              } else {
                toast.error(res?.message || "Failed to delete category");
              }
            } catch (error) {
              console.error(error);
              toast.error("An error occurred while deleting category");
            }
          }}
        >
          Delete
        </button>
      </div>
    </div>
  ), {
    duration: Infinity,
  });
};

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

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

              <div className="space-y-1.5">
                <label className="text-[14px] font-semibold text-slate-700">Category Image</label>
                <input
                  ref={addImageInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAddImageChange}
                />
                {addImagePreview ? (
                  <div className="relative rounded-xl overflow-hidden border border-slate-200 shadow-sm">
                    <img
                      src={addImagePreview}
                      alt="Preview"
                      className="w-full h-40 object-cover"
                    />
                    <button
                      type="button"
                      onClick={removeAddImage}
                      className="absolute top-2 right-2 bg-white/90 hover:bg-red-50 text-red-500 rounded-full p-1 shadow transition-colors"
                      title="Remove image"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                    <div className="px-3 py-1.5 bg-white/90 border-t border-slate-100">
                      <p className="text-[12px] text-slate-500 truncate">{addImage?.name}</p>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => addImageInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-300 rounded-xl bg-slate-50 p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-100 hover:border-blue-300 transition-colors"
                  >
                    <ImagePlus className="w-5 h-5 text-slate-500 mb-2" />
                    <span className="text-[13px] font-medium text-slate-600 block">Click to upload an image</span>
                    <span className="text-[11px] font-medium text-slate-400 block">( under 2 MB, JPG / PNG /JPEG )</span>
                  </div>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-[14px] font-semibold text-slate-700">Alt Text</label>
                <input
                  type="text"
                  {...register("altText")}
                  placeholder="Describe the image for accessibility"
                  className="w-full border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0052cc] focus:border-transparent transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[14px] font-semibold text-slate-700">Category Name *</label>
                <input
                  type="text"
                  {...register("name", { required: "Category Name is required" })}
                  placeholder="e.g. Technology"
                  className="w-full border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0052cc] focus:border-transparent transition-all"
                />
                {errors.name && <p className="text-[11px] text-red-500">{errors.name.message}</p>}
              </div>

<div className="space-y-1.5">
  <label className="text-[14px] font-semibold text-slate-700">
    Slug *
  </label>

  <input
    type="text"
    {...register("slug", { required: "Slug is required" })}
    onChange={handleSlugChange}
    placeholder="e.g. technology-slug"
    className="w-full border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0052cc] focus:border-transparent transition-all"
  />

  {errors.slug ? (
    <p className="text-[11px] text-red-500">{errors.slug.message}</p>
  ) : (
    <p className="text-[11px] text-slate-500">
      Spaces will be converted to dashes (-)
    </p>
  )}
</div>

              <div className="space-y-1.5">
                <label className="text-[14px] font-semibold text-slate-700">Category Heading</label>
                <input
                  type="text"
                  {...register("heading")}
                  placeholder="Enter Category Heading"
                  className="w-full border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0052cc] focus:border-transparent transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[14px] font-semibold text-slate-700">Description</label>
                <textarea
                  {...register("description")}
                  placeholder="Brief category description..."
                  rows={4}
                  className="w-full border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0052cc] focus:border-transparent transition-all resize-none"
                />
              </div>

              <div className="pt-2">
                 <h3 className="text-[12px] font-bold text-[#0f172a] uppercase tracking-wider mb-4 border-b border-slate-200 pb-2">SEO Settings</h3>
                 <div className="space-y-6">
<div className="space-y-1.5">
  <label className="text-[14px] font-semibold text-slate-700">
    Meta Title
  </label>

  <input
    type="text"
    {...register("metaTitle")}
    maxLength={60}
    placeholder="3-60 characters"
    className="w-full border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0052cc] focus:border-transparent transition-all"
  />

  {watchMetaTitle.length > 0 && watchMetaTitle.length < 3 ? (
    <p className="text-[11px] text-red-500">
      Minimum 3 characters required
    </p>
  ) : (
    <p className="text-[11px] text-slate-500">
      {watchMetaTitle.length}/60 Characters
    </p>
  )}
</div>

<div className="space-y-1.5">
  <label className="text-[14px] font-semibold text-slate-700">
    Meta Description
  </label>

  <textarea
    {...register("metaDescription")}
    minLength={3}
    maxLength={160}
    rows={3}
    placeholder="3-160 characters"
    className="w-full border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0052cc] focus:border-transparent transition-all resize-none"
  />

  {watchMetaDescription.length > 0 && watchMetaDescription.length < 3 ? (
    <p className="text-[11px] text-red-500">
      Minimum 3 characters required
    </p>
  ) : (
    <p className="text-[11px] text-slate-500">
      {watchMetaDescription.length}/160 Characters
    </p>
  )}
</div>  

                    <div className="space-y-1.5">
                      <label className="text-[14px] font-semibold text-slate-700">Meta Keywords</label>
                <textarea
                  {...register("metaKeywords")}
                  placeholder="eg, test, hdhja"
                  rows={4}
                  className="w-full border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0052cc] focus:border-transparent transition-all resize-none"
                />
                    </div>
                 </div>
              </div>

              <Button type="submit" className="w-full bg-[#0052cc] hover:bg-[#0043a6] text-white py-2.5 rounded-lg font-semibold text-[15px] h-auto">
                Create Category
              </Button>
              </form>
            </CardContent>
          </Card>

           {/* Categories List */}
          <div className="lg:col-span-2 space-y-0">
            {/* Table Header */}
            <div className="bg-[#eef2f6] rounded-t-xl border border-[#e2e8f0] border-b-0">
              <div className="grid items-center px-6 py-3.5" style={{gridTemplateColumns: '56px 1fr 100px 100px auto'}}>
                <div className="text-[13px] font-bold text-[#64748b] uppercase tracking-wider">Image</div>
                <div className="text-[13px] font-bold text-[#64748b] uppercase tracking-wider pl-4">Name</div>
                <div className="text-[13px] font-bold text-[#64748b] uppercase tracking-wider pl-4">Posts</div>
                <div className="text-[13px] font-bold text-[#64748b] uppercase tracking-wider pl-4">Read</div>
                <div className="text-[13px] font-bold text-[#64748b] uppercase tracking-wider text-right w-24">Actions</div>
              </div>
            </div>

            {/* Table Body */}
            <div className="bg-white rounded-b-xl border border-[#e2e8f0] border-t-0 shadow-sm divide-y divide-[#e2e8f0]">
              {loading ? (
                <div className="py-14 flex flex-col items-center justify-center gap-3 text-slate-400">
                  <svg className="animate-spin w-7 h-7 text-[#0052cc]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  <span className="text-[14px] font-medium">Loading categories...</span>
                </div>
              ) : categories.length > 0 ? (
                categories.map((cat, index) => (
                    <div
                    key={cat.id || index}
                    className="grid items-center px-6 py-4 hover:bg-slate-50 transition-colors"
                    style={{gridTemplateColumns: '56px 1fr 100px 100px auto'}}
                  >
                    {/* Image */}
                    <div className="flex-shrink-0">
                      <div className="w-11 h-11 rounded-lg overflow-hidden border border-slate-200 shadow-sm">
                        {cat.image ? (
                          <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                            <ImagePlus className="w-4 h-4 text-slate-400" />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Name + Date */}
                    <div className="pl-4 min-w-0">
                      <p className="text-[14px] font-semibold text-slate-800 truncate">{cat.name}</p>
                      <p className="text-[12px] text-slate-400 font-medium mt-0.5">
                        {cat.createdAt ? new Date(cat.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                      </p>
                    </div>

                    {/* Posts */}
                    <div className="pl-4">
                      <div className="inline-flex flex-col items-start justify-center bg-slate-100 text-slate-700 text-[13px] font-bold px-3 py-1.5 rounded-xl leading-tight">
                        <span>{cat.post ?? 0}</span>
                        <span className="text-[11px] font-semibold text-slate-500">Posts</span>
                      </div>
                    </div>

                    {/* Read */}
                    <div className="pl-4">
                      <span className="text-[14px] font-semibold text-slate-700">{cat.read ?? '0k'}</span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-1 w-24">
                      <button
                        className="text-[#0052cc] hover:bg-blue-50 p-2 rounded-lg transition-colors"
                        title="Edit category"
                        onClick={() => {
                          setEditingCategory(cat);
                          resetEdit({
                            name: cat.name || "",
                            slug: cat.slug || "",
                            heading: cat.heading || "",
                            description: cat.description || "",
                            altText: cat.altText || "",
                            metaTitle: cat.metaTitle || "",
                            metaDescription: cat.metaDescription || "",
                            metaKeywords: cat.metaKeywords || ""
                          });
                          // Preload existing image as preview
                          setEditImage(null);
                          setEditImagePreview(cat.image || null);
                          if (editImageInputRef.current) editImageInputRef.current.value = "";
                          setIsEditDialogOpen(true);
                        }}
                      >
                        <Pencil className="w-[16px] h-[16px]" />
                      </button>
                      <button
                        className="text-[#dc2626] hover:bg-red-50 p-2 rounded-lg transition-colors"
                        title="Delete category"
                        onClick={() => handleDeleteCategory(cat._id || cat.categoryId || cat.id)}
                      >
                        <Trash2 className="w-[16px] h-[16px]" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-16 flex flex-col items-center justify-center gap-3 text-slate-400">
                  <ImagePlus className="w-8 h-8" />
                  <p className="text-[14px] font-medium">No categories found</p>
                  <p className="text-[13px] text-slate-400">Create your first category using the form on the left.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Edit Category Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md p-0 gap-0 overflow-hidden bg-white border-none rounded-xl shadow-2xl">
          <form onSubmit={handleSubmitEdit(onEditSubmit)} className="flex flex-col h-full max-h-[90vh]">
          <DialogHeader className="px-6 py-4 flex flex-row items-center justify-between border-b border-slate-100 bg-white m-0">
            <DialogTitle className="text-lg font-bold text-[#0f172a] m-0">Edit Category</DialogTitle>
          </DialogHeader>
          
          <div className="px-6 py-6 space-y-5 bg-white overflow-y-auto">
            <div className="space-y-1.5">
              <label className="text-[14px] font-semibold text-slate-700">Thumbnail Image</label>
              <input
                ref={editImageInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleEditImageChange}
              />
              {editImagePreview ? (
                <div className="relative rounded-xl overflow-hidden border border-slate-200 shadow-sm">
                  <img
                    src={editImagePreview}
                    alt="Preview"
                    className="w-full h-40 object-cover"
                  />
                  <button
                    type="button"
                    onClick={removeEditImage}
                    className="absolute top-2 right-2 bg-white/90 hover:bg-red-50 text-red-500 rounded-full p-1 shadow transition-colors"
                    title="Remove image"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  </button>
                  <div className="px-3 py-1.5 bg-white/90 border-t border-slate-100">
                    <p className="text-[12px] text-slate-500 truncate">{editImage?.name ?? editingCategory?.image?.split('/').pop()}</p>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => editImageInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-300 rounded-xl bg-slate-50 p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-100 hover:border-blue-300 transition-colors"
                >
                  <ImagePlus className="w-5 h-5 text-slate-500 mb-2" />
                  <span className="text-[13px] font-medium text-slate-600 block">Click to upload an image</span>
                  <span className="text-[11px] font-medium text-slate-400 block">( under 2 MB, JPG / PNG / WebP )</span>
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-[14px] font-semibold text-slate-700">Alt Text</label>
              <input
                type="text"
                {...registerEdit("altText")}
                placeholder="Describe the image for accessibility"
                className="w-full border border-slate-300 rounded-lg px-3.5 py-2.5 text-[15px] font-medium focus:outline-none focus:ring-2 focus:ring-[#0052cc] focus:border-transparent transition-all text-slate-900"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[14px] font-semibold text-slate-700">Category Name *</label>
              <input
                type="text"
                {...registerEdit("name", { required: "Category Name is required" })}
                placeholder="e.g. Technology"
                className="w-full border border-slate-300 rounded-lg px-3.5 py-2.5 text-[15px] font-medium focus:outline-none focus:ring-2 focus:ring-[#0052cc] focus:border-transparent transition-all text-slate-900"
              />
              {editErrors.name && <p className="text-[11px] text-red-500">{editErrors.name.message}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-[14px] font-semibold text-slate-700">Slug *</label>
              <input
                type="text"
                {...registerEdit("slug", { required: "Slug is required" })}
                onChange={(e) => {
                  let value = e.target.value;
                  value = value.replace(/[^A-Za-z0-9 -]/g, "");
                  value = value.replace(/ /g, "-");
                  value = value.replace(/-+/g, "-");
                  setEditValue("slug", value);
                }}
                placeholder="e.g. technology"
                className="w-full border border-slate-300 rounded-lg px-3.5 py-2.5 text-[15px] font-medium focus:outline-none focus:ring-2 focus:ring-[#0052cc] focus:border-transparent transition-all text-slate-900"
              />
              {editErrors.slug && <p className="text-[11px] text-red-500">{editErrors.slug.message}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-[14px] font-semibold text-slate-700">Category Heading</label>
              <input
                type="text"
                {...registerEdit("heading")}
                placeholder="e.g. Technology"
                className="w-full border border-slate-300 rounded-lg px-3.5 py-2.5 text-[15px] font-medium focus:outline-none focus:ring-2 focus:ring-[#0052cc] focus:border-transparent transition-all text-slate-900"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[14px] font-semibold text-slate-700">Description</label>
              <textarea
                {...registerEdit("description")}
                placeholder="Brief category description..."
                rows={4}
                className="w-full border border-slate-300 rounded-lg px-3.5 py-2.5 text-[15px] font-medium focus:outline-none focus:ring-2 focus:ring-[#0052cc] focus:border-transparent transition-all resize-none text-slate-900"
              />
            </div>

            <div className="pt-2">
               <h3 className="text-[12px] font-bold text-[#0f172a] uppercase tracking-wider mb-4 border-b border-slate-200 pb-2">SEO Settings</h3>
               <div className="space-y-5">
                  <div className="space-y-1.5">
                    <label className="text-[14px] font-semibold text-slate-700">Meta Title</label>
                    <input
                      type="text"
                      {...registerEdit("metaTitle")}
                      maxLength={60}
                      placeholder="3-60 characters"
                      className="w-full border border-slate-300 rounded-lg px-3.5 py-2.5 text-[15px] font-medium focus:outline-none focus:ring-2 focus:ring-[#0052cc] focus:border-transparent transition-all text-slate-900"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[14px] font-semibold text-slate-700">Meta Description</label>
                    <textarea
                      {...registerEdit("metaDescription")}
                      rows={3}
                      maxLength={160}
                      placeholder="3-160 characters"
                      className="w-full border border-slate-300 rounded-lg px-3.5 py-2.5 text-[15px] font-medium focus:outline-none focus:ring-2 focus:ring-[#0052cc] focus:border-transparent transition-all resize-none text-slate-900"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[14px] font-semibold text-slate-700">Meta Keywords</label>
                    <textarea
                      {...registerEdit("metaKeywords")}
                      placeholder="eg, test, hdhja"
                      rows={4}
                      className="w-full border border-slate-300 rounded-lg px-3.5 py-2.5 text-[15px] font-medium focus:outline-none focus:ring-2 focus:ring-[#0052cc] focus:border-transparent transition-all text-slate-900"
                    />
                  </div>
               </div>
            </div>
          </div>

          <DialogFooter className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3 rounded-b-xl m-0">
            <Button
              type="button"
              variant="ghost"
              className="font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-200"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-[#0052cc] hover:bg-[#0043a6] text-white font-semibold">
              Save Changes
            </Button>
          </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}