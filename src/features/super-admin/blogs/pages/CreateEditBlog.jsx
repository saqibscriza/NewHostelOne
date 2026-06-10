import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronRight, Info, UploadCloud } from "lucide-react";
import { Card, CardContent } from "../../../../components/ui/Card";
import { Button } from "../../../../components/ui/button";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";


export default function CreateEditBlog() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;
  const todayDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const [content, setContent] = useState("");
  const [wordCount, setWordCount] = useState(0);

  const handleEditorChange = (value, delta, source, editor) => {
    setContent(value);
    const text = editor.getText().trim();
    setWordCount(text ? text.split(/\s+/).length : 0);
  };

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic"],
      ["link"],
      [{ list: "bullet" }, { list: "ordered" }],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "link",
    "list",
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6 md:p-8 pb-12 font-sans">

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

        <Button className="bg-[#0052cc] hover:bg-[#003d99] text-white font-bold text-[15px] px-6 h-[42px] rounded-lg transition-colors shadow-sm">
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
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] xl:grid-cols-[1fr_320px] gap-6 items-start">

        {/* ════ LEFT — Main Content ════ */}
        <div>
          <Card className="rounded-xl border border-slate-200 shadow-sm bg-white overflow-hidden">
            {/* Card header label */}
            <div className="px-6 md:px-8 pt-6 pb-2">
              <span className="text-[11px] font-bold tracking-[0.12em] text-slate-400 uppercase">
                {isEditing ? "Edit Blog" : "Create Blog"}
              </span>
            </div>

            <CardContent className="px-6 md:px-8 pb-6 md:pb-8 pt-2 space-y-6">

              {/* Blog Title */}
              <div className="space-y-1.5">
                <label className="text-[14px] font-bold text-slate-800">Blog Title</label>
                <input
                  type="text"
                  placeholder="Enter a compelling title..."
                  className="w-full border border-slate-200 rounded-lg px-4 py-3 text-[15px] font-medium placeholder:text-slate-400 bg-[#f8fafc] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-transparent transition-all"
                />
              </div>

              {/* URL Slug */}
              <div className="space-y-1.5">
                <label className="text-[14px] font-bold text-slate-800">URL Slug</label>
                <div className="flex border border-slate-200 rounded-lg overflow-hidden bg-[#f8fafc] focus-within:ring-2 focus-within:ring-blue-500 focus-within:bg-white transition-all">
                  <span className="px-3 py-3 text-[13px] font-medium text-slate-500 bg-[#e8edf2] border-r border-slate-200 whitespace-nowrap select-none">
                    scriza.com/blog/
                  </span>
                  <input
                    type="text"
                    placeholder="post-title-here"
                    className="flex-1 min-w-0 px-3 py-3 text-[14px] font-medium bg-transparent focus:outline-none placeholder:text-slate-400"
                  />
                </div>
                <p className="text-[12px] text-slate-500 mt-1">
                  Use dash (-) to separate words. <strong>NOTE: It will be always unique.</strong>
                </p>
              </div>

              {/* Short Description */}
              <div className="space-y-1.5">
                <label className="text-[14px] font-bold text-slate-800">Short Description</label>
                <textarea
                  placeholder="A brief summary for the blog card and search results..."
                  rows={4}
                  className="w-full border border-slate-200 rounded-lg px-4 py-3 text-[15px] font-medium placeholder:text-slate-400 bg-[#f8fafc] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-transparent transition-all resize-none"
                />
              </div>

              {/* Description — Text Editor (UNCHANGED) */}
              <div className="space-y-1.5">
                <label className="text-[14px] font-bold text-slate-800">Description</label>
                <div className="rounded-lg border border-slate-200 overflow-hidden relative">
                  {/* Words Counter */}
                  <div className="absolute top-3 right-4 z-10 text-[12px] font-semibold text-slate-500 bg-white/80 backdrop-blur-sm px-2 py-0.5 rounded border border-slate-100">
                    Words: {wordCount}
                  </div>
                  <ReactQuill
                    theme="snow"
                    value={content}
                    onChange={handleEditorChange}
                    modules={modules}
                    formats={formats}
                    className="flex flex-col [&_.ql-toolbar]:bg-[#e2e8f0]/40 [&_.ql-toolbar]:border-x-0 [&_.ql-toolbar]:border-t-0 [&_.ql-toolbar]:border-b [&_.ql-toolbar]:border-slate-200 [&_.ql-toolbar]:px-4 [&_.ql-toolbar]:py-3 [&_.ql-container]:border-none [&_.ql-container]:flex-1 [&_.ql-editor]:min-h-[280px] [&_.ql-editor]:text-[16px] [&_.ql-editor]:text-slate-800 [&_.ql-editor]:p-6 md:[&_.ql-editor]:p-8"
                    placeholder="Start writing your masterpiece here..."
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
                <label className="text-[13px] font-bold text-slate-800">Meta Title</label>
                <input
                  type="text"
                  placeholder="Meta title..."
                  className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-[14px] font-medium placeholder:text-slate-400 bg-[#f8fafc] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-transparent transition-all"
                />
                <p className="text-[11px] text-slate-400">3-60 Characters</p>
              </div>

              {/* Meta Description */}
              <div className="space-y-1.5">
                <label className="text-[13px] font-bold text-slate-800">Meta Description</label>
                <textarea
                  placeholder="Meta description..."
                  rows={4}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-[14px] font-medium placeholder:text-slate-400 bg-[#f8fafc] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-transparent transition-all resize-none"
                />
                <p className="text-[11px] text-slate-400">3-160 Characters</p>
              </div>

              {/* Blog Category */}
              <div className="space-y-1.5">
                <label className="text-[13px] font-bold text-slate-800">Blog Category</label>
                <div className="relative">
                  <select className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-[14px] font-medium bg-[#f8fafc] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all appearance-none cursor-pointer pr-8 text-slate-600">
                    <option value="">Select Category</option>
                    <option value="industry-news">Industry News</option>
                    <option value="product-updates">Product Updates</option>
                    <option value="tutorials">Tutorials</option>
                    <option value="case-studies">Case Studies</option>
                  </select>
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </div>
              </div>

              {/* Cover Image */}
              <div className="space-y-2">
                <label className="text-[13px] font-bold text-slate-800">Cover Image</label>
                <div className="w-full aspect-[1.91/1] bg-slate-100 rounded-xl border border-slate-200 overflow-hidden relative group cursor-pointer hover:border-blue-300 transition-colors">
                  <div
                    className="absolute inset-0 bg-cover bg-center opacity-50 group-hover:opacity-40 transition-opacity"
                    style={{ backgroundImage: "url('https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&q=80')" }}
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 p-3">
                    <UploadCloud className="w-7 h-7 text-[#0052cc] drop-shadow" />
                    <span className="text-[13px] font-bold text-slate-800 drop-shadow">Replace Image</span>
                    <span className="text-[11px] font-medium text-slate-600 drop-shadow">Recommended: 1200x630px</span>
                  </div>
                </div>
              </div>

              {/* Alt Text */}
              <div className="space-y-1.5">
                <label className="text-[13px] font-bold text-slate-800">Alt Text</label>
                <input
                  type="text"
                  placeholder="Image alt text for SEO..."
                  className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-[14px] font-medium placeholder:text-slate-400 bg-[#f8fafc] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-transparent transition-all"
                />
              </div>

              {/* Meta Keywords */}
              <div className="space-y-1.5">
                <label className="text-[13px] font-bold text-slate-800">Meta Keywords</label>
                <input
                  type="text"
                  placeholder="keyword1, keyword2..."
                  className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-[14px] font-medium placeholder:text-slate-400 bg-[#f8fafc] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-transparent transition-all"
                />
                <p className="text-[11px] text-slate-400">Separated with comma</p>
              </div>

            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
