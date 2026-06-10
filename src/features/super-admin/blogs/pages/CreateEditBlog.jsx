import React, { useEffect, useRef, useState} from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronRight, Info, UploadCloud } from "lucide-react";
import { Card, CardContent } from "../../../../components/ui/Card";
import { Button } from "../../../../components/ui/button";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { useForm, Controller } from "react-hook-form";
import toast from "react-hot-toast";
import { getAllBlogCategoriesApi, addBlogPostApi, updateBlogPostApi, getAllBlogPostsApi } from "../../../../utils/utils";


export default function CreateEditBlog() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;
  const todayDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const { register, handleSubmit, control, setValue, watch, reset, formState: { errors } } = useForm();

  // Watch for character count
  const watchMetaTitle = watch("metaTitle", "");
  const watchMetaDescription = watch("metaDescription", "");
  
  // Custom states that need separate handling
  const [categories, setCategories] = useState([]);
  const [wordCount, setWordCount] = useState(0);
  const [originalPost, setOriginalPost] = useState(null);

  // Cover image state
  const [coverImage, setCoverImage] = useState(null);         // File object
  const [coverImagePreview, setCoverImagePreview] = useState(null); // Object URL or existing URL
  const coverImageInputRef = useRef(null);

  const handleSlugChange = (e) => {
    let value = e.target.value;

    // Special characters remove
    value = value.replace(/[^A-Za-z0-9 -]/g, "");

    // Space ko dash me convert karo
    value = value.replace(/ /g, "-");

    // Multiple dashes ko single dash karo
    value = value.replace(/-+/g, "-");

    setValue("urlSlug", value);
  };

  const fetchCategories = async () => {
    try {
      const res = await getAllBlogCategoriesApi();
      if (res?.data) {
        setCategories(res.data);
      }
    } catch (error) {
      console.error("GET CATEGORY ERROR", error);
    }
  };

  const fetchBlogPost = async () => {
    try {
      const res = await getAllBlogPostsApi();
      if (res?.data) {
        const post = res.data.find(p => String(p.blogId) === String(id) || String(p.id) === String(id) || String(p._id) === String(id));
        if (post) {
          setOriginalPost(post);
          reset({
            title: post.title || "",
            urlSlug: post.urlSlug || "",
            categoryId: post.categoryId?._id || post.categoryId?.id || post.categoryId || "",
            shortDescription: post.shortDescription || "",
            content: post.content || "",
            altText: post.altText || "",
            metaTitle: post.metaTitle || "",
            metaDescription: post.metaDescription || "",
            metaKeywords: post.metaKeywords || "",
          });
          if (post.featuredImage) {
            setCoverImagePreview(post.featuredImage);
          }
          // Also set word count
          if (post.content) {
             const tempDiv = document.createElement("div");
             tempDiv.innerHTML = post.content;
             const text = tempDiv.textContent || tempDiv.innerText || "";
             setWordCount(text ? text.trim().split(/\s+/).length : 0);
          }
        }
      }
    } catch (error) {
      console.error("GET BLOG POST ERROR", error);
    }
  };

  useEffect(() => {
    fetchCategories();
    if (isEditing) {
      fetchBlogPost();
    }
  }, [id, isEditing, reset]);

  const handleCoverImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
if (file.size > 2 * 1024 * 1024) {
  toast.error("Image size should be less than 2 MB");
  return;
}
    if (coverImagePreview && !coverImagePreview.startsWith("http")) {
      URL.revokeObjectURL(coverImagePreview);
    }
    setCoverImage(file);
    setCoverImagePreview(URL.createObjectURL(file));
  };

  const removeCoverImage = () => {
    if (coverImagePreview && !coverImagePreview.startsWith("http")) {
      URL.revokeObjectURL(coverImagePreview);
    }
    setCoverImage(null);
    setCoverImagePreview(null);
    if (coverImageInputRef.current) coverImageInputRef.current.value = "";
  };

  const handleEditorChange = (value, delta, source, editor, onChange) => {
    onChange(value); // This is from Controller
    const text = editor.getText().trim();
    setWordCount(text ? text.split(/\s+/).length : 0);
  };

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      if (coverImage) {
        formData.append("featuredImage", coverImage);
      }

      formData.append("title", data.title);
      formData.append("urlSlug", data.urlSlug);
      formData.append("categoryId", data.categoryId);
      formData.append("shortDescription", data.shortDescription || "");
      formData.append("content", data.content || "");
      formData.append("altText", data.altText || "");
      formData.append("metaTitle", data.metaTitle || "");
      formData.append("metaDescription", data.metaDescription || "");
      formData.append("metaKeywords", data.metaKeywords || "");
      
      // Preserve existing status or set to PUBLISHED by default
      formData.append("status", isEditing && originalPost?.status ? originalPost.status : "PUBLISHED");
      
      // Append additional fields if editing
      if (isEditing && originalPost) {
        if (originalPost.minuteRead !== undefined) formData.append("minuteRead", originalPost.minuteRead);
        if (originalPost.authorId) formData.append("authorId", originalPost.authorId);
        if (originalPost.publishDate) formData.append("publishDate", originalPost.publishDate);
      }

      let res;
      if (isEditing) {
        res = await updateBlogPostApi(id, formData);
      } else {
        res = await addBlogPostApi(formData);
      }

      if (res?.status === "success") {
        toast.success(isEditing ? "Blog post updated successfully!" : "Blog post created successfully!");
        navigate("/superadmin/blogs");
      } else {
        toast.error(res?.message || (isEditing ? "Failed to update blog post" : "Failed to create blog post"));
      }
    } catch (error) {
      console.error(error);
      toast.error(isEditing ? "An error occurred while updating the blog post" : "An error occurred while creating the blog post");
    }
  };

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic"],
      ["link"],
      ["underline"],
      [{ list: "bullet" }, { list: "ordered" }],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "link",
    "underline",
    "list",
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6 md:p-8 pb-12 font-sans">
      <form onSubmit={handleSubmit(onSubmit)}>
      {/* ── Breadcrumbs & Header ── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-1 gap-4">
        <div>
          <div className="flex items-center text-sm font-semibold text-slate-500 mb-1">
            <span
              className="cursor-pointer hover:text-slate-800 transition-colors"
              onClick={() => navigate("/superadmin/blogs")}
            >
              Blog CMS
            </span>
            <ChevronRight className="w-4 h-4 mx-1 text-slate-400" />
            <span className="text-blue-600">
              {isEditing ? "Edit Blog Post" : "New Blog Post"}
            </span>
          </div>
          <h1 className="text-3xl font-bold text-[#0f172a] leading-tight">
            {isEditing ? "Edit Blog" : "Create New Blog"}
          </h1>
        </div>

        <Button type="submit" className="bg-[#0052cc] hover:bg-[#003d99] text-white font-bold text-[15px] px-6 h-[42px] rounded-lg transition-colors shadow-sm">
          {isEditing ? "Update Post" : "Publish Post"}
        </Button>
      </div>

      {/* ── Posted By Badge ── */}
      <div className="flex items-center gap-2 mb-7 mt-3">
        <span className="flex items-center gap-1.5 text-[13px] font-medium text-slate-500 bg-slate-100 border border-slate-200 rounded-full px-3 py-1">
          <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          Posted By: <strong className="text-slate-700 font-semibold">Super Admin</strong>
          <span className="mx-1 text-slate-300">|</span>
          Date: <strong className="text-slate-700 font-semibold">{todayDate}</strong>
        </span>
      </div>

      {/* ── Two-column Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] xl:grid-cols-[1fr_320px] gap-6 items-stretch">

        {/* ════ LEFT — Main Content ════ */}
        <div className="h-full flex flex-col">
          <Card className="rounded-xl border border-slate-200 shadow-sm bg-white overflow-hidden flex-1 flex flex-col">
            {/* Card header label */}
            <div className="px-6 md:px-8 pt-6 pb-2">
              <span className="text-[11px] font-bold tracking-[0.12em] text-slate-400 uppercase">
                {isEditing ? "Edit Blog" : "Create Blog"}
              </span>
            </div>

            <CardContent className="px-6 md:px-8 pb-6 md:pb-8 pt-2 space-y-6 flex-1 flex flex-col">

              {/* Blog Title */}
              <div className="space-y-1.5">
                <label className="text-[14px] font-bold text-slate-800">Blog Title *</label>
                <input
                  type="text"
                  {...register("title", { required: "Title is required" })}
                  placeholder="Enter a compelling title..."
                  className="w-full border border-slate-200 rounded-lg px-4 py-3 text-[15px] font-medium placeholder:text-slate-400 bg-[#f8fafc] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-transparent transition-all"
                />
                {errors.title && <p className="text-[11px] text-red-500">{errors.title.message}</p>}
              </div>

              {/* URL Slug */}
              <div className="space-y-1.5">
                <label className="text-[14px] font-bold text-slate-800">URL Slug *</label>
                <div className="flex border border-slate-200 rounded-lg overflow-hidden bg-[#f8fafc] focus-within:ring-2 focus-within:ring-blue-500 focus-within:bg-white transition-all">
                  <input
                    type="text"
                    {...register("urlSlug", { required: "Slug is required" })}
                    onChange={handleSlugChange}
                    placeholder="post-title-here"
                    className="flex-1 min-w-0 px-3 py-3 text-[14px] font-medium bg-transparent focus:outline-none placeholder:text-slate-400"
                  />
                </div>
                {errors.urlSlug ? (
                  <p className="text-[11px] text-red-500">{errors.urlSlug.message}</p>
                ) : (
                  <p className="text-[12px] text-slate-500 mt-1">
                    Use dash (-) to separate words. <strong>NOTE: It will be always unique.</strong>
                  </p>
                )}
              </div>

              {/* Short Description */}
              <div className="space-y-1.5">
                <label className="text-[14px] font-bold text-slate-800">Short Description</label>
                <textarea
                  {...register("shortDescription")}
                  placeholder="A brief summary for the blog card and search results..."
                  rows={4}
                  className="w-full border border-slate-200 rounded-lg px-4 py-3 text-[15px] font-medium placeholder:text-slate-400 bg-[#f8fafc] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-transparent transition-all resize-none"
                />
              </div>

              {/* Description — Text Editor */}
              <div className="space-y-1.5 flex-1 flex flex-col">
                <label className="text-[14px] font-bold text-slate-800">Description</label>
                <div className="flex-1 rounded-lg border border-slate-200 overflow-hidden relative flex flex-col">
                  {/* Words Counter */}
                  <div className="absolute top-3 right-4 z-10 text-[12px] font-semibold text-slate-500 bg-white/80 backdrop-blur-sm px-2 py-0.5 rounded border border-slate-100">
                    Words: {wordCount}
                  </div>
                  <Controller
                    name="content"
                    control={control}
                    defaultValue=""
                    render={({ field: { onChange, value } }) => (
                      <ReactQuill
                        theme="snow"
                        value={value}
                        onChange={(val, delta, source, editor) => handleEditorChange(val, delta, source, editor, onChange)}
                        modules={modules}
                        formats={formats}
                        className="flex-1 flex flex-col [&_.ql-toolbar]:bg-[#e2e8f0]/40 [&_.ql-toolbar]:border-x-0 [&_.ql-toolbar]:border-t-0 [&_.ql-toolbar]:border-b [&_.ql-toolbar]:border-slate-200 [&_.ql-toolbar]:px-4 [&_.ql-toolbar]:py-3 [&_.ql-container]:border-none [&_.ql-container]:flex-1 [&_.ql-editor]:min-h-[400px] [&_.ql-editor]:text-[16px] [&_.ql-editor]:text-slate-800 [&_.ql-editor]:p-6 md:[&_.ql-editor]:p-8"
                        placeholder="Start writing your masterpiece here..."
                      />
                    )}
                  />
                </div>
              </div>

            </CardContent>
          </Card>
        </div>

        {/* ════ RIGHT — Meta Details Sidebar ════ */}
        <div className="space-y-4">
          <Card className="rounded-xl border border-slate-200 shadow-sm bg-white overflow-hidden">
            {/* Sidebar header */}
            <div className="px-5 pt-5 pb-3 border-b border-slate-100">
              <span className="text-[11px] font-bold tracking-[0.14em] text-slate-500 uppercase">
                Meta Details
              </span>
            </div>

            <CardContent className="p-5 space-y-5">

{/* Meta Title */}
<div className="space-y-1.5">
  <label className="text-[13px] font-bold text-slate-800">
    Meta Title
  </label>

  <input
    type="text"
    {...register("metaTitle")}
    maxLength={60}
    placeholder="Meta title..."
    className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-[14px] font-medium placeholder:text-slate-400 bg-[#f8fafc] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-transparent transition-all"
  />

  {(watchMetaTitle?.length || 0) > 0 && (watchMetaTitle?.length || 0) < 3 ? (
    <p className="text-[11px] text-red-500">
      Minimum 3 characters required.
    </p>
  ) : (
    <p className="text-[11px] text-slate-400">
      {watchMetaTitle?.length || 0}/60 Characters
    </p>
  )}
</div>

              {/* Meta Description */}
<div className="space-y-1.5">
  <label className="text-[13px] font-bold text-slate-800">
    Meta Description
  </label>

  <textarea
    {...register("metaDescription")}
    maxLength={160}
    placeholder="Meta description..."
    rows={4}
    className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-[14px] font-medium placeholder:text-slate-400 bg-[#f8fafc] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-transparent transition-all resize-none"
  />

  {(watchMetaDescription?.length || 0) > 0 && (watchMetaDescription?.length || 0) < 3 ? (
    <p className="text-[11px] text-red-500">
      Minimum 3 characters required.
    </p>
  ) : (
    <p className="text-[11px] text-slate-400">
      {watchMetaDescription?.length || 0}/160 Characters
    </p>
  )}
</div>

              {/* Blog Category */}
              <div className="space-y-1.5">
                <label className="text-[13px] font-bold text-slate-800">Blog Category</label>
                <div className="relative">
<select
  {...register("categoryId", { required: "Category is required" })}
  className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-[14px] font-medium bg-[#f8fafc] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all cursor-pointer pr-8 text-slate-600 appearance-none"
  style={{
    WebkitAppearance: "none",
    MozAppearance: "none",
    appearance: "none",
  }}
>
  <option value="">Select Category</option>
{categories.map((category) => (
  <option
    key={category.categoryId || category._id || category.id}
    value={category.categoryId || category._id || category.id}
  >
    {category.name}
  </option>
))}
</select>
{errors.categoryId && <p className="text-[11px] text-red-500 mt-1">{errors.categoryId.message}</p>}
                  {/* <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </span> */}
                </div>
              </div>

              {/* Cover Image */}
              <div className="space-y-2">
                <label className="text-[13px] font-bold text-slate-800">Cover Image</label>

                {/* Hidden file input */}
                <input
                  ref={coverImageInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleCoverImageChange}
                />

                {coverImagePreview ? (
                  /* ── Preview State ── */
                  <div className="relative w-full rounded-xl overflow-hidden border border-slate-200 shadow-sm group">
                    <img
                      src={coverImagePreview}
                      alt="Cover preview"
                      className="w-full aspect-[1.91/1] object-cover"
                    />
                    {/* Overlay on hover to replace */}
                    <div
                      onClick={() => coverImageInputRef.current?.click()}
                      className="absolute inset-0 bg-black/0 group-hover:bg-black/30 flex flex-col items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                    >
                      <UploadCloud className="w-7 h-7 text-white drop-shadow" />
                      <span className="text-[13px] font-bold text-white drop-shadow">Replace Image</span>
                    </div>
                    {/* Remove button */}
                    <button
                      type="button"
                      onClick={removeCoverImage}
                      className="absolute top-2 right-2 bg-white/90 hover:bg-red-50 text-red-500 rounded-full p-1.5 shadow transition-colors z-10"
                      title="Remove cover image"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"/>
                        <line x1="6" y1="6" x2="18" y2="18"/>
                      </svg>
                    </button>
                    {/* File name badge */}
                    <div className="px-3 py-1.5 bg-white border-t border-slate-100">
                      <p className="text-[11px] text-slate-500 truncate">{coverImage?.name ?? "Current cover image"}</p>
                    </div>
                  </div>
                ) : (
                  /* ── Empty / Upload State ── */
                  <div
                    onClick={() => coverImageInputRef.current?.click()}
                    className="w-full aspect-[1.91/1] bg-slate-50 rounded-xl border-2 border-dashed border-slate-300 overflow-hidden relative group cursor-pointer hover:border-blue-400 hover:bg-blue-50/30 transition-colors flex flex-col items-center justify-center gap-2"
                  >
                    <UploadCloud className="w-8 h-8 text-slate-400 group-hover:text-[#0052cc] transition-colors" />
                    <span className="text-[13px] font-bold text-slate-600 group-hover:text-[#0052cc] transition-colors">Click to upload cover image</span>
                    <span className="text-[11px] font-medium text-slate-400">JPG, PNG, WebP — max 2 MB</span>
                    <span className="text-[11px] font-medium text-slate-400">Recommended: 1200×630 px</span>
                  </div>
                )}
              </div>

              {/* Alt Text */}
              <div className="space-y-1.5">
                <label className="text-[13px] font-bold text-slate-800">Alt Text</label>
                <input
                  type="text"
                  {...register("altText")}
                  placeholder="Image alt text for SEO..."
                  className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-[14px] font-medium placeholder:text-slate-400 bg-[#f8fafc] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-transparent transition-all"
                />
              </div>

              {/* Meta Keywords */}
              <div className="space-y-1.5">
                <label className="text-[13px] font-bold text-slate-800">Meta Keywords</label>
                <textarea
                  {...register("metaKeywords")}
                  rows={4}
                  placeholder="keyword1, keyword2..."
                  className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-[14px] font-medium placeholder:text-slate-400 bg-[#f8fafc] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-transparent transition-all"
                />
                <p className="text-[11px] text-slate-400">Separated with comma</p>
              </div>

            </CardContent>
          </Card>
        </div>
      </div>
      </form>
    </div>
  );
}