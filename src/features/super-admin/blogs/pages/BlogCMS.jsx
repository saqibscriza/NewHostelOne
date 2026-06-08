import React, { useState } from "react";
import { Search, Filter, Plus, FileText, Eye, TrendingUp, MoreVertical, ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent } from "../../../../components/ui/Card";
import { Badge } from "../../../../components/ui/badge";
import { Button } from "../../../../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../../components/ui/DropdownMenu";

export default function BlogCMS() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const stats = [
    { label: "Total Posts", value: "124", icon: FileText, color: "text-foreground", bgColor: "bg-muted" },
    { label: "Total Views", value: "45.2k", icon: Eye, color: "text-foreground", bgColor: "bg-muted" },
    { label: "Published This Month", value: "+8", icon: TrendingUp, color: "text-foreground", bgColor: "bg-muted" },
  ];

  const blogs = [
    {
      id: 1,
      title: "5 Ways to Improve Employee Retention",
      author: "Sarah Jenkins",
      category: "Retention",
      publishDate: "Oct 24, 2023",
      status: "Published",
      image: "bg-[url('https://images.unsplash.com/photo-1542382156909-9ae37b3f56fd?w=800&q=80')]",
    },
    {
      id: 2,
      title: "The Future of Remote Work",
      author: "Mark Thompson",
      category: "Remote Work",
      publishDate: "Nov 02, 2023",
      status: "Draft",
      image: "bg-[url('https://images.unsplash.com/photo-1596496050827-8299e0220de1?w=800&q=80')]",
    },
    {
      id: 3,
      title: "Navigating Compliance in 2024",
      author: "Alex Rivera",
      category: "Compliance",
      publishDate: "Oct 28, 2023",
      status: "Published",
      image: "bg-[url('https://images.unsplash.com/photo-1555421689-d68471e189f2?w=800&q=80')]",
    },
    { id: 4, title: "Mental Health Policies", author: "Jane Doe", category: "Wellness", publishDate: "Oct 15, 2023", status: "Published", image: "bg-muted-foreground" },
    { id: 5, title: "Q3 Financial Review", author: "John Smith", category: "Finance", publishDate: "Oct 10, 2023", status: "Draft", image: "bg-muted" },
  ];

  // Pagination Logic
  const totalPages = Math.max(1, Math.ceil(blogs.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentBlogs = blogs.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="min-h-screen bg-background p-8 space-y-8 pb-10">
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center w-full gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Blog CMS</h1>
          <p className="text-muted-foreground mt-1 text-sm font-medium">
            Manage your organization's internal news and knowledge base.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto sm:ml-auto">
          <Button variant="outline" className="flex items-center gap-2 h-10 px-4 bg-transparent text-foreground border-border hover:bg-muted font-bold rounded-xl">
            <Filter className="w-4 h-4" />
            Filter
          </Button>
          <Button className="flex items-center gap-2 h-10 px-4 bg-black text-white hover:bg-black/90 font-bold shadow-sm transition-colors whitespace-nowrap rounded-xl">
            <Plus className="w-4 h-4" />
            Add New Blog
          </Button>
        </div>
      </div>

      {/* Top Search Bar (Simulating the top bar from image) */}
      <div className="flex items-center justify-between gap-4 py-2 border-b border-border -mx-8 px-8 bg-transparent" style={{ display: 'none' }}>
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search blogs, authors or tags..."
            className="w-full bg-muted border-none text-foreground text-sm rounded-lg py-2.5 pl-10 pr-4 focus:ring-0 focus:outline-none"
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="rounded-2xl border-none shadow-sm bg-card hover:shadow-md transition-shadow">
            <CardContent className="p-6 flex items-center gap-4">
              <div className={`p-4 rounded-xl ${stat.bgColor} ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-semibold text-muted-foreground">{stat.label}</p>
                <h3 className="text-2xl font-bold text-foreground mt-1">{stat.value}</h3>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Blogs Table Card */}
      <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted text-muted-foreground border-b border-border">
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider">Blog Title</th>
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider">Author</th>
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider">Publish Date</th>
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentBlogs.map((blog) => (
                <tr key={blog.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-lg bg-cover bg-center ${blog.image.startsWith('bg-[url') ? blog.image : blog.image}`} />
                      <span className="font-bold text-[15px] text-foreground">{blog.title}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-[15px] text-muted-foreground font-medium">{blog.author}</td>
                  <td className="px-6 py-5 text-[15px] text-muted-foreground font-medium">{blog.category}</td>
                  <td className="px-6 py-5 text-[15px] text-muted-foreground font-medium">{blog.publishDate}</td>
                  <td className="px-6 py-5">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
                        blog.status === "Published"
                          ? "bg-green-100 text-green-700"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${blog.status === "Published" ? 'bg-green-500' : 'bg-muted-foreground'}`} />
                      {blog.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 "
                        >
                          <MoreVertical className="h-5 w-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="w-32 rounded-xl border-border shadow-sm bg-card"
                      >
                        {/* <DropdownMenuItem
                          className="cursor-pointer text-muted-foreground focus:bg-accent focus:text-foreground"
                        >
                          View
                        </DropdownMenuItem> */}
                        <DropdownMenuItem
                          className="cursor-pointer text-muted-foreground focus:bg-accent focus:text-foreground"
                        >
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="cursor-pointer text-muted-foreground focus:bg-accent focus:text-foreground"
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="px-6 py-4 border-t border-border flex items-center justify-between bg-transparent">
          <span className="text-[14px] font-medium text-muted-foreground">
            Showing {blogs.length === 0 ? 0 : startIndex + 1} to {Math.min(startIndex + itemsPerPage, blogs.length)} of {blogs.length} entries
          </span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`p-1.5 rounded-lg transition-colors ${currentPage === 1 ? 'text-muted-foreground cursor-not-allowed opacity-50' : 'text-foreground hover:bg-muted'}`}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            
            <div className="flex items-center gap-1">
               <button
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-sm font-bold shadow-sm transition-colors bg-[#0f1419] dark:bg-white text-white dark:text-black"
                >
                  1
                </button>
            </div>
            
            <button
               onClick={() => handlePageChange(currentPage + 1)}
               disabled={currentPage === totalPages}
               className={`p-1.5 rounded-lg transition-colors ${currentPage === totalPages ? 'text-muted-foreground cursor-not-allowed opacity-50' : 'text-foreground hover:bg-muted'}`}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}