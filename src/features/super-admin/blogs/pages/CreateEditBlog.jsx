import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronRight, Bold, Italic, List, Quote, Image as ImageIcon, Link as LinkIcon, Code, UploadCloud } from "lucide-react";
import { Card, CardContent } from "../../../../components/ui/Card";
import { Button } from "../../../../components/ui/button";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";


export default function CreateEditBlog() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;
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
    <div className="min-h-screen bg-[#f8fafc] p-8 pb-10 font-sans">
      {/* Breadcrumbs & Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <div className="flex items-center text-sm font-semibold text-slate-500 mb-2">
            <span className="cursor-pointer hover:text-slate-800" onClick={() => navigate("/superadmin/blogs")}>Blog CMS</span>
            <ChevronRight className="w-4 h-4 mx-1" />
            <span className="text-blue-600">{isEditing ? "Edit Blog Post" : "New Blog Post"}</span>
          </div>
          <h1 className="text-3xl font-bold text-[#0f172a]">{isEditing ? "Edit Blog" : "Create New Blog"}</h1>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* <Button variant="outline" className="border-slate-300 text-slate-700 font-bold bg-white text-[15px] px-6 h-[42px] rounded-lg hover:bg-slate-50 transition-colors">
            Save Draft
          </Button> */}
          <Button className="bg-[#0052cc] hover:bg-[#0043a6] text-white font-bold text-[15px] px-6 h-[42px] rounded-lg transition-colors">
            {isEditing ? "Update Post" : "Publish Post"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Details Card */}
          <Card className="rounded-xl border border-slate-200 shadow-sm bg-white overflow-hidden">
            <CardContent className="p-6 md:p-8 space-y-6">
              <div className="space-y-1.5">
                <label className="text-[14px] font-bold text-slate-800 tracking-wide">Blog Title</label>
                <input
                  type="text"
                  placeholder="Enter a compelling title..."
                  className="w-full border border-slate-200 rounded-lg px-4 py-3 text-[15px] font-medium placeholder:text-slate-400 bg-[#f8fafc] focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white focus:border-transparent transition-all"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-1.5 min-w-0">
                  <label className="text-[14px] font-bold text-slate-800 tracking-wide whitespace-nowrap">URL Slug</label>
                  <div className="flex border border-slate-200 rounded-lg overflow-hidden bg-[#eef2f6]">
                    {/* <span className="px-3 py-3 text-[13px] sm:text-[14px] font-medium text-slate-500 bg-[#e2e8f0] border-r border-slate-200 hidden sm:block whitespace-nowrap">
                      scriza.com/blog/
                    </span> */}
                    <input
                      type="text"
                      placeholder="Enter the Slug..."
                      className="w-full min-w-0 px-3 py-3 text-[14px] sm:text-[15px] font-medium bg-transparent focus:outline-none focus:bg-white transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-1.5 min-w-0">
                  <label className="text-[14px] font-bold text-slate-800 tracking-wide whitespace-nowrap">Category</label>
                  <select className="w-full min-w-0 border border-slate-200 rounded-lg px-2 sm:px-4 py-3 text-[14px] sm:text-[15px] font-medium bg-[#f8fafc] focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all appearance-none cursor-pointer">
                    <option value="">Select</option>
                    <option value="industry-news">Industry News</option>
                    <option value="product-updates">Product Updates</option>
                  </select>
                </div>

                <div className="space-y-1.5 flex flex-col min-w-0">
                  <label className="text-[14px] font-bold text-slate-800 tracking-wide whitespace-nowrap">Minute Read</label>
                  <div className="flex items-center border border-slate-200 rounded-lg bg-[#f8fafc] pr-3 sm:pr-4 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-600 transition-all flex-1 min-w-0">
                    <input
                      type="number"
                      placeholder="e.g. 5"
                      className="w-full min-w-0 px-3 sm:px-4 py-3 text-[14px] sm:text-[15px] font-medium focus:outline-none bg-transparent"
                      min="1"
                    />
                    <span className="text-[13px] sm:text-[14px] font-bold text-slate-500">mins</span>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[14px] font-bold text-slate-800 tracking-wide">Short Description</label>
                <textarea
                  placeholder="A brief summary for the blog card and search results..."
                  rows={4}
                  className="w-full border border-slate-200 rounded-lg px-4 py-3 text-[15px] font-medium placeholder:text-slate-400 bg-[#f8fafc] focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white focus:border-transparent transition-all resize-none"
                />
              </div>
            </CardContent>
          </Card>

          {/* Editor Card */}
          <Card className="rounded-xl border border-slate-200 shadow-sm bg-white overflow-hidden flex flex-col min-h-[400px]">
             <div className="flex-1 flex flex-col relative w-full h-full">
                {/* Words Counter Overlay */}
                <div className="absolute top-3 right-4 z-10 text-[13px] font-semibold text-slate-600 bg-transparent px-2 py-1 rounded">
                    Words: {wordCount}
                </div>
                <ReactQuill 
                   theme="snow"
                   value={content}
                   onChange={handleEditorChange}
                   modules={modules}
                   formats={formats}
                   className="flex-1 flex flex-col [&_.ql-toolbar]:bg-[#e2e8f0]/40 [&_.ql-toolbar]:border-x-0 [&_.ql-toolbar]:border-t-0 [&_.ql-toolbar]:border-b [&_.ql-toolbar]:border-slate-200 [&_.ql-toolbar]:px-4 [&_.ql-toolbar]:py-3 [&_.ql-container]:border-none [&_.ql-container]:flex-1 [&_.ql-editor]:min-h-[300px] [&_.ql-editor]:text-[16px] [&_.ql-editor]:text-slate-800 [&_.ql-editor]:p-6 md:[&_.ql-editor]:p-8"
                   placeholder="Start writing your masterpiece here..."
                />
             </div>
          </Card>

                    {/* SEO Card */}
          <Card className="rounded-xl border border-slate-200 shadow-sm bg-white overflow-hidden">
             <div className="flex border-b border-slate-200 px-2 sm:px-6 pt-2 overflow-x-auto">
                 <button className="px-4 py-3 text-[14px] font-bold text-[#0052cc] border-b-2 border-[#0052cc] whitespace-nowrap">
                    SEO General
                 </button>
                 {/* <button className="px-4 py-3 text-[14px] font-bold text-slate-600 hover:text-slate-800 whitespace-nowrap">
                    Social (OG)
                 </button> */}
             </div>
             <CardContent className="p-6 md:p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-1.5">
                      <label className="text-[14px] font-bold text-slate-800 tracking-wide">Meta Title</label>
                      <input
                        type="text"
                        className="w-full border border-slate-200 rounded-lg px-4 py-3 text-[15px] font-medium bg-[#f8fafc] focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white focus:border-transparent transition-all"
                      />
                   </div>
                   <div className="space-y-1.5">
                      <label className="text-[14px] font-bold text-slate-800 tracking-wide">Keywords</label>
                      <input
                        type="text"
                        placeholder="Add keywords separated by comma"
                        className="w-full border border-slate-200 rounded-lg px-4 py-3 text-[15px] font-medium placeholder:text-slate-500 bg-[#f8fafc] focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white focus:border-transparent transition-all"
                      />
                   </div>
                </div>
                <div className="space-y-1.5">
                   <label className="text-[14px] font-bold text-slate-800 tracking-wide">Meta Description</label>
                   <textarea
                     rows={3}
                     className="w-full border border-slate-200 rounded-lg px-4 py-3 text-[15px] font-medium bg-[#f8fafc] focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white focus:border-transparent transition-all resize-none"
                   />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-1.5">
                      <label className="text-[14px] font-bold text-slate-800 tracking-wide">Alt Text</label>
                      <input
                        type="text"
                        className="w-full border border-slate-200 rounded-lg px-4 py-3 text-[15px] font-medium bg-[#f8fafc] focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white focus:border-transparent transition-all"
                      />
                   </div>
                   {/* <div className="space-y-1.5">
                      <label className="text-[14px] font-bold text-slate-800 tracking-wide">Keywords</label>
                      <input
                        type="text"
                        placeholder="Add keywords separated by comma"
                        className="w-full border border-slate-200 rounded-lg px-4 py-3 text-[15px] font-medium placeholder:text-slate-500 bg-[#f8fafc] focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white focus:border-transparent transition-all"
                      />
                   </div> */}
                </div>
             </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Metadata Card */}
          <Card className="rounded-xl border border-slate-200 shadow-sm bg-white overflow-hidden">
            <CardContent className="p-6 space-y-6">
              <div className="space-y-1.5">
                <label className="text-[13px] font-bold text-slate-800 tracking-wider uppercase">Author</label>
                <select className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-[15px] font-medium bg-[#f8fafc] focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all appearance-none cursor-pointer">
                  <option value="super-admin">Super Admin</option>
                  {/* <option value="admin-2">John Doe</option> */}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[13px] font-bold text-slate-800 tracking-wider uppercase">Publish Date</label>
                 <div className="relative">
                    <input
                      type="date"
                      className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-[15px] font-medium bg-[#f8fafc] focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all appearance-none cursor-pointer text-slate-700 [&::-webkit-calendar-picker-indicator]:opacity-50"
                    />
                 </div>
              </div>
            </CardContent>
          </Card>

          {/* Featured Image Card */}
          <Card className="rounded-xl border border-slate-200 shadow-sm bg-white overflow-hidden">
             <CardContent className="p-6 space-y-4">
                <label className="text-[13px] font-bold text-slate-800 tracking-wider uppercase block">Featured Image</label>
                <div className="w-full aspect-[1.91/1] bg-slate-100 rounded-xl border border-slate-200 overflow-hidden relative group cursor-pointer hover:border-blue-300 transition-colors">
                    {/* Placeholder content - can replace with actual image if exists */}
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&q=80')] bg-cover bg-center opacity-40 group-hover:opacity-30 transition-opacity"></div>
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                        <UploadCloud className="w-8 h-8 text-[#0052cc] mb-2 drop-shadow-sm" />
                        <span className="text-[15px] font-bold text-slate-800 drop-shadow-sm">Replace Image</span>
                        <span className="text-[12px] font-medium text-slate-600 mt-1 drop-shadow-sm">Recommended: 1200x630px</span>
                    </div>
                </div>
             </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
